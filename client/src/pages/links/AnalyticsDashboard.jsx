import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SERVER_URL from "../../utils";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import DatePicker from "react-datepicker";
import { Bar,Pie } from "react-chartjs-2";
import "react-datepicker/dist/react-datepicker.css";

//core javascript library (not specific to React) for rendering  Chart.js

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register so that these elements are ready to use by react-chartjs-2
// which is a React wrapper for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);



const fromatDate = (date) => {
    if (!date) return null;
   
    try {
        const dateObj = new Date(date);

        return new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        }).format(dateObj);
    } catch (error) {
        console.error("Error formatting date:", error);
        return null;
    }
};

const AnalyticsDashboard = () => {

    const { linkId } = useParams();
    const navigate = useNavigate();

    const [analyticsData, setAnalyticsData] = useState([]);
    const [fromDate, setFromDate] = useState(null);
    const [toDate, setToDate] = useState(null);

    const  fetchLinkAnalytics = async () => {

        try {
            const linksData = await axios.get(`${SERVER_URL}/links/analytics`,{
                params: {
                    linkId: linkId,
                    from: fromDate,
                    to: toDate
                },
                withCredentials: true
            });

            setAnalyticsData(linksData.data);
            console.log("Analytics Data:", linksData.data);

        } catch (error) {
            console.error("Error fetching link analytics:", error);
            // Navigate to error page or show a notification, if we don't get the data
            //because there is no point rendering the component without data
            navigate('/error');
        }
    }

    // Call the function to fetch analytics when the component mounts
    useEffect(() => {
        fetchLinkAnalytics();
    }, [analyticsData, fromDate, toDate]);


    const groupBy = (key) => {
        return analyticsData.reduce((acc, item) => {
            const label = item[key] || 'Unknown';
            acc[label] = (acc[label] || 0) + 1;
            return acc;
        }, {});
    }

    const clicksByCity = groupBy('city');
    const clicksByBrowser = groupBy('browser');


    const columns = [
        { field: 'ip', headerName: 'IP Address', flex: 1 },
        { field: 'city', headerName: 'City', flex: 1 },
        { field: 'country', headerName: 'Country', flex: 1 },
        { field: 'browser', headerName: 'Browser', flex: 1 },
        { field: 'deviceType', headerName: 'Device Type', flex: 1 },
        { field: 'isp', headerName: 'ISP', flex: 1 },
        { field: 'clickedAt', headerName: 'Click Date', flex: 1, 
            renderCell: (params) => (<>{fromatDate(params.value)}</>)
        },
    ]


  return (
   <div className="max-w-7xl mx-auto py-10 px-4">
  <h1 className="text-2xl font-semibold mb-6">Analytics for LinkID: {linkId}</h1>

  {/* Filters Section */}
  <div className="flex flex-wrap items-center gap-4 border border-gray-300 p-4 rounded-md mb-6">
    <h5 className="text-lg font-medium w-full sm:w-auto">Filters:</h5>
    <div className="w-full sm:w-48">
      <DatePicker
        selected={fromDate}
        onChange={(date) => setFromDate(date)}
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholderText="From (Date)"
      />
    </div>
    <div className="w-full sm:w-48">
      <DatePicker
        selected={toDate}
        onChange={(date) => setToDate(date)}
        className="w-full border border-gray-300 rounded px-3 py-2"
        placeholderText="To (Date)"
      />
    </div>
  </div>

  {/* Charts Section */}
  <div className="flex flex-col lg:flex-row gap-6 border border-gray-300 p-4 rounded-md mb-6">
    <div className="flex-1 bg-white p-4 rounded shadow">
      <h5 className="text-lg font-medium mb-2">Clicks by City</h5>
      <hr className="mb-4" />
      <Bar
        data={{
          labels: Object.keys(clicksByCity),
          datasets: [
            {
              label: 'Clicks',
              data: Object.values(clicksByCity),
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
          ],
        }}
        options={{ responsive: true }}
      />
    </div>

    <div className="w-full lg:w-1/3 bg-white p-4 rounded shadow">
      <h5 className="text-lg font-medium mb-2">Clicks by Browser</h5>
      <hr className="mb-4" />
      <Pie
        data={{
          labels: Object.keys(clicksByBrowser),
          datasets: [
            {
              data: Object.values(clicksByCity),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
                '#FF9F40',
              ],
            },
          ],
        }}
        options={{ responsive: true }}
      />
    </div>
  </div>

  {/* DataGrid Table */}
  <DataGrid
    getRowId={(row) => row._id}
    rows={analyticsData}
    columns={columns}
    initialState={{
      pagination: {
        paginationModel: { pageSize: 20, page: 0 },
      },
    }}
    pageSizeOptions={[20, 50, 100]}
    disableRowSelectionOnClick
    showToolbar
    sx={{ fontFamily: 'inherit' }}
  />
</div>

  );
}


export default AnalyticsDashboard;