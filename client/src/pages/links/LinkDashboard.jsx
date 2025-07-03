
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DataGrid } from '@mui/x-data-grid';
import axios from 'axios';
import SERVER_URL from '../../utils';
import { useEffect, useState } from 'react';
import { usePermissions } from '../../rbac/Permissions';


const LinkDashboard = () => {

  const [error, setError] = useState({});
  const [linkData, setLinkData] = useState([]);

  const [formData, setFormData] = useState({
    campaignTitle: '',
    originalUrl: '',
    category: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const permissions = usePermissions();

  const handleModalShow = (isEdit, data = {}) => {
    if(isEdit) {
      setFormData({
        id: data._id,
        campaignTitle: data.campaignTitle,
        originalUrl: data.originalUrl,
        category: data.category
      });
    }else {
      setFormData({
        campaignTitle: '',
        originalUrl: '',
        category: ''
      });
    }

    setIsEdit(isEdit);
    setShowModal(true);
  }

  const handleModalClose = () => {
    setShowModal(false);
  }

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDeleteModalShow = (linkId) => {
    setFormData({
      id: linkId
    });
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => {
    setShowDeleteModal(false);
  };

  const handleDeleteSubmit = async (e) => {
    try {

      await axios.delete(`${SERVER_URL}/links/${formData.id}`, { withCredentials: true });
      fetchLinks();
    } catch (err) {
      setError({message: 'Unable to delete link. Please try again later.'});
    } finally {
      handleDeleteModalClose();
    }
  }

  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  }

  const validate = () => {
    let newErros = {};
    let isValid = true;
    if (!formData.campaignTitle || formData.campaignTitle.trim() === '') {
      newErros.campaignTitle = 'Campaign title is required';
      isValid = false;
    }

    if (!formData.originalUrl || formData.originalUrl.trim() === '') {
      newErros.originalUrl = 'Original URL is required';
      isValid = false;
    }

    if (!formData.category || formData.category.trim() === '') {
      newErros.category = 'Category is required';
      isValid = false;
    }

    setError(newErros);
    return isValid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(validate()) {

      const body = {
        campaignTitle: formData.campaignTitle,
        originalUrl: formData.originalUrl,
        category: formData.category
      };

      const config = {
        withCredentials: true
      };

      try {
        if(isEdit) {
          await axios.put(`${SERVER_URL}/links/${formData.id}`, body, config);
        } else {
           await axios.post(`${SERVER_URL}/links/create`, body, config);
          }
          setFormData({
            campaignTitle:'',
            originalUrl:'',
            category:''
          });
          fetchLinks();
      }catch (err) {
        setError({message: 'Unable to add link. Please try again later.'});
    }finally {
      handleModalClose();
    }
  }
  };
  const fetchLinks = async () => {
    try {
      const response = await axios.get(`${SERVER_URL}/links`, { withCredentials: true });
      console.log(response.data);
      setLinkData(response.data.data);
    } catch (err) {
      setError({message: 'Unable to fetch links. Please try again later.'});
    }
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const columns = [
    { field: 'campaignTitle', headerName: 'Campaign', flex: 2},
    { field: 'originalUrl', headerName: 'URL', flex: 3, renderCell:(params) => (
      <a
      href={`${SERVER_URL}/links/r/${params.row._id}`}
      target='_blank'
      rel='noopener noreferrer'
      >
        {params.row.originalUrl}
      </a>
    )
  },
    { field: 'category', headerName: 'Category', flex: 2},
    { field: 'clickCount', headerName: 'Clicks', flex: 1},
    { field: 'action', headerName: 'Action', flex: 1, renderCell: (params) => (
      <>
        {permissions.canEditLink && (
          <IconButton>
            <EditIcon onClick={() => handleModalShow(true, params.row)} />
          </IconButton>
        )}

        {permissions.canDeleteLink && (
          <IconButton>
            <DeleteIcon onClick={() => handleDeleteModalShow(params.row._id)} />
          </IconButton>
        )}
      </>
    )
    }
  ]
  return (
    <div className='container mx-auto py-4'>
      <div className="flex justify-between items-center mb-4 mx-10">
        <div></div>
        <h1 className="text-2xl font-bold">Affiliate Links</h1>

        {permissions.canCreateLink && (
          <button
            onClick={() => { handleModalShow(false) }}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 cursor-pointer"
          >
            Add Link
          </button>
        )}
      </div>

      {error.message && <div className="text-red-500 text-center">{error.message}</div>}
      <div style={{ height: 400, width: '90%', margin: '0 auto' }}>
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
          showToolbar
          sx={{
            fontFamily: 'inherit',
          }}
        />
      </div>

      {/* {showAddModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 *:**:not-[data-modal] bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">:
            <h2 className="text-xl font-bold mb-4">Add New Link</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Campaign Title</label>
                <input 
                  type="text" 
                  name="campaignTitle" 
                  value={formData.campaignTitle || ''} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded"
                />
                {error.campaignTitle && <p className="text-red-500 text-sm">{error.campaignTitle}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Original URL</label>
                <input 
                  type="text" 
                  name="originalUrl" 
                  value={formData.originalUrl || ''} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded"
                />
                {error.originalUrl && <p className="text-red-500 text-sm">{error.originalUrl}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Category</label>
                <input 
                  type="text" 
                  name="category" 
                  value={formData.category || ''} 
                  onChange={handleChange} 
                  className="w-full border border-gray-300 p-2 rounded"
                />
                {error.category && <p className="text-red-500 text-sm">{error.category}</p>}
              </div>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                Add Link
              </button>
            </form>
            <button onClick={handleModalClose} className="mt-4 text-red-500 hover:underline">Cancel</button>

          </div>
        </div>
      )} */}

   {showModal && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 *:**:not-[data-modal] bg-opacity-50 overflow-y-auto px-4 sm:px-6" onClick={handleModalClose}>
    <div className="relative mx-auto my-8 w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-lg p-6"  onClick={(e) => e.stopPropagation()}>
      {/* Close Button */}
      <button
        onClick={handleModalClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none"
      >
        <span className="text-2xl">&times;</span>
      </button>

      {/* Modal Title */}
      <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">{isEdit ? 'Edit Link' : 'Add Link'}</h2>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        {/* Campaign Title */}
        <div className="mb-4">
          <label htmlFor="campaignTitle" className="block text-sm font-medium text-gray-700">
            Campaign Title
          </label>
          <input
            type="text"
            id="campaignTitle"
            name="campaignTitle"
            value={formData.campaignTitle}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              error.campaignTitle ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          />
          {error.campaignTitle && (
            <p className="mt-1 text-sm text-red-600">{error.campaignTitle}</p>
          )}
        </div>

        {/* Original URL */}
        <div className="mb-4">
          <label htmlFor="originalUrl" className="block text-sm font-medium text-gray-700">
            Original URL
          </label>
          <input
            type="text"
            id="originalUrl"
            name="originalUrl"
            value={formData.originalUrl}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              error.originalUrl ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          />
          {error.originalUrl && (
            <p className="mt-1 text-sm text-red-600">{error.originalUrl}</p>
          )}
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`mt-1 block w-full rounded-md border ${
              error.category ? 'border-red-500' : 'border-gray-300'
            } px-3 py-2 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
          />
          {error.category && (
            <p className="mt-1 text-sm text-red-600">{error.category}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            className=" w-full rounded bg-[#0d1b2a] px-4 py-2 text-white hover:bg-[#1b2631] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
)}

   {showDeleteModal && (
  <div 
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto px-4 sm:px-6" 
    onClick={handleDeleteModalClose}
    role="dialog"
    aria-modal="true"
    aria-labelledby="delete-modal-title"
  >
    <div 
      className="relative mx-auto my-8 w-full max-w-md bg-white rounded-lg shadow-xl p-6"  
      onClick={(e) => e.stopPropagation()}
    >
      {/* Close Button */}
      <button
        onClick={handleDeleteModalClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 rounded-full p-1"
        aria-label="Close modal"
      >
        <span className="text-xl">&times;</span>
      </button>

      {/* Modal Content */}
      <div className="pr-8">
        <h2 id="delete-modal-title" className="text-lg font-semibold mb-4 text-gray-900">
          Confirm Delete
        </h2>
        
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this link? This action cannot be undone.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={handleDeleteModalClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteSubmit}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  </div>
)}


    </div>
  );
}

export default LinkDashboard