import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import SERVER_URL from "../../utils";
import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";


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
    }, [linkId]);


    const columns = [
        { field: 'ip', headerName: 'IP Address', flex: 1 },
        { field: 'city', headerName: 'City', flex: 1 },
        { field: 'country', headerName: 'Country', flex: 1 },
        { field: 'browser', headerName: 'Browser', flex: 1 },
        { field: 'deviceType', headerName: 'Device Type', flex: 1 },
        { field: 'isp', headerName: 'ISP', flex: 1 },
        { field: 'clickedAt', headerName: 'Click Date', flex: 1, 
            renderCell: (params) => {
                return (
                    <>
                        {fromatDate(params.value)}
                    </>
                );
            }
        },
    ]

  return (
    <div style={{ height: 500, width: '90%',margin: '0 auto' }}>
        <h1 className="text-xl font-semibold m-5">Analytics Dashboard for Link ID: {linkId}</h1>

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
            sx={{
                fontFamily: 'inherit',
            }} />

    </div>
  )
}

export default AnalyticsDashboard