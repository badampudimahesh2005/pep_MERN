
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import SERVER_URL from '../../utils';
import { useEffect, useState } from 'react';


const LinkDashboard = () => {

  const [error, setError] = useState({});
  const [linkData, setLinkData] = useState([]);

  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/links`, { withCredentials: true });
      console.log(response.data);
      setLinkData(response.data.links);
    } catch (err) {
      setError({message: 'Unable to fetch links. Please try again later.'});
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const columns = [
    { field: 'campaignTit', headerName: 'Campaign', flex: 2},
    { field: 'originalUrl', headerName: 'URL', flex: 3},
    { field: 'category', headerName: 'Category', flex: 2},
    { field: 'clickCount', headerName: 'Clicks', flex: 1},
    { field: 'action', headerName: 'Action', flex: 1, renderCell: (params) => (
      <>
      <IconButton>
        <EditIcon />
      </IconButton>

      <IconButton>
        <DeleteIcon />
      </IconButton>
      </>
    )
    }
  ]
  return (
    <div className='container mx-auto py-4'>
      <h2>Manage Affiliate Links</h2>
      {error.message && <div className="error">{error.message}</div>}
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={linkData}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 20, page: 0 },
            },
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
        />
      </div>

    </div>
  );
}

export default LinkDashboard