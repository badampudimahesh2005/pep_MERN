import { useEffect, useState } from 'react';
import IconButton from '@mui/material/IconButton';
import { DataGrid } from '@mui/x-data-grid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import SERVER_URL from '../../utils';

const USER_ROLES = ['viewer', 'developer'];

const ManageUsers = () => {
  const [usersData, setUsersData] = useState([]);
  const [formData, setFormData] = useState({
     email: '', 
     username: '', 
     role: '' 
  });
  const [isEdit, setIsEdit] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  

  

  
  
  const handleModalShow = (isEdit, data = {}) => {
     if (isEdit) {
        setFormData({
            id: data._id,
            email: data.email,
            username: data.username,
            role: data.role
        });
    }else {
        setFormData({
             email: '', 
             username: '', 
             role: '' 
        });
    }
    setIsEdit(isEdit);
    setShowModal(true);
  };
    
    const handleDeleteModalShow = (id) => {
        setFormData({
            id: id,
        });
        setShowDeleteModal(true);
    };
    
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    }

    const validate = () => {
      const newErrors = {};
      let isValid = true;

      if(!formData.email || formData.email.length === 0) {
        newErrors.email = 'Email is required';
        isValid = false;
      }
        if(!formData.username || formData.username.length === 0) {
            newErrors.username = 'Username is required';
            isValid = false;
        }
        if(!formData.role || formData.role.length === 0) {
            newErrors.role = 'Role is required';
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

  const handleDelete = async () => {
    try {
      setFormLoading(true);
      await axios.delete(`${SERVER_URL}/users/${formData.id}`, { withCredentials: true });
      fetchUsers();
    } catch {
      setErrors({ message: 'Failed to delete user' });
    } finally {
      setShowDeleteModal(false);
      setFormLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if( validate()) {
        setFormLoading(true);
        const body = {
            email: formData.email,
            username: formData.username,
            role: formData.role
        };

        const config = {
            withCredentials: true,
        }

        try{

            if (isEdit) {
                await axios.put(`${SERVER_URL}/users/${formData.id}`, body, config);
            }else{
                await axios.post(`${SERVER_URL}/users/create`, body, config);
            }

            setFormData({ email: '', username: '', role: '' });
            fetchUsers();
        }catch (error) {
            setErrors({ message: error.response?.data?.message || 'Failed to save user' });
        }finally{
            setFormLoading(false);
            setShowModal(false);
            setIsEdit(false);
            setErrors({});
        }

    }

  };

  const fetchUsers = async () => {
    try {
        setLoading(true);
        const response = await axios.get(`${SERVER_URL}/users`, { withCredentials: true });
        setUsersData(response.data);
    } catch {
      setErrors({ message: 'Failed to fetch users' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    { field: 'email', headerName: 'Email', flex: 2 },
    { field: 'username', headerName: 'Name', flex: 2 },
    { field: 'role', headerName: 'Role', flex: 2 },
    {
      field: 'action',
      headerName: 'Action',
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton >
            <EditIcon onClick={() => handleModalShow(true, params.row)} />
          </IconButton>
          <IconButton>
            <DeleteIcon onClick={() => handleDeleteModalShow(params.row._id)} />
          </IconButton>
        </>
      ),
    },
  ];

 

  return (
    <div className="container mx-auto py-4">
      <div className="flex justify-between items-center mb-4 mx-10">
        <div></div>
        <h2 className="text-xl font-semibold">Manage Users</h2>
        <button
          onClick={() => handleModalShow(false)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer"
        >
          Add User
        </button>
      </div>

      {errors.message && <p className="text-red-500 text-sm text-center">{errors.message}</p>}

      <div style={{ height: 500, width: '90%',margin: '0 auto' }}>
        <DataGrid
          getRowId={(row) => row._id}
          rows={usersData}
          columns={columns}
          loading={loading}
          initialState={{
            pagination: { paginationModel: { pageSize: 20, page: 0 } },
          }}
          pageSizeOptions={[20, 50, 100]}
          disableRowSelectionOnClick
          showToolbar
          sx={{
            fontFamily: 'inherit'
          }}
        />
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 *:**:not-[data-modal] bg-opacity-50 overflow-y-auto px-4 sm:px-6" onClick={() => setShowModal(false)}>
          <div className="relative mx-auto my-8 w-full max-w-md sm:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-lg p-6" onClick={(e) => e.stopPropagation()}>
            {/* close button */}
            <button
            onClick={() => setShowModal(false)}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
            >
                <span className='text-2xl'>&times;</span>
            </button>
            {/* Title */}
            <h3 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">{isEdit ? 'Edit User' : 'Add User'}</h3>
            <form onSubmit={handleSubmit}>

              <div className="mb-4">
                <label  className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  className={`mt-1 block w-full rounded-md border ${errors.email ? 'border-red-500' : 'border-gray-300'} 
                  px-3 py-2  `}
                />
                {errors.email && <p className="mt-1 text-red-600 text-sm">{errors.email}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  name="username"
                  type="text"
                  value={formData.username}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2  block text-sm ${errors.username ? 'border-red-500' : 'border-gray-300'}`}
                />
                {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700">Role</label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full border rounded px-3 py-2 text-sm block  ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                >
                  <option value="">Select</option>
                  {USER_ROLES.map((role) => (
                    <option key={role} value={role}>
                      {role.charAt(0).toUpperCase() + role.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.role && <p className="text-red-500 text-sm">{errors.role}</p>}
              </div>
              <button
                type="submit"
                className="w-full bg-[#0d1b2a] text-white py-2 rounded hover:bg-[#1b2631] cursor-pointer"
              >
                {formLoading ? 'Saving...' : 'Submit'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto px-4 sm:px-6" 
        onClick={() => setShowDeleteModal(false)}
        >
          <div className="bg-white p-6 rounded-lg w-full max-w-md mx-auto"
           onClick={(e) => e.stopPropagation()}
           >
            <div className='pr-8'>
                <h2 id="delete-modal-title" className="text-lg font-semibold mb-4 text-gray-900 text-center">
          Confirm Delete
        </h2>
          <p className="text-gray-600 mb-6">
          Are you sure you want to delete this link? This action cannot be undone.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
          <button
            onClick={() => setShowDeleteModal(false)}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors cursor-pointer"
          >
           {formLoading ? 'Deleting...' : 'Delete'}
          </button>
        </div>

            </div>
           
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
