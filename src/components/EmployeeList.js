import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './EmployeeList.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EmployeePage = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/employees`);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/employees/${id}`, { method: 'DELETE' });
      toast.success('Employee deleted successfully!');
      fetchEmployees();
    } catch (error) {
      toast.error('Error deleting employee');
      console.error('Error deleting employee:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastEmployee = currentPage * itemsPerPage;
  const indexOfFirstEmployee = indexOfLastEmployee - itemsPerPage;
  const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  const handleAddClick = () => {
    navigate('/employees/add');
  };

  const handleEditClick = (id) => {
    navigate(`/employees/edit/${id}`);
  };

  return (
    <main style={styles.main}>
      <h2>Employee List</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={handleSearch}
          className="search-bar"
        />
        <button onClick={handleAddClick} className="add-button">Add New Employee</button>
      </div>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Gender</th>
            <th>Start Date</th>
            <th>Days Worked</th>
            <th>Café</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentEmployees.map(employee => (
            <tr key={employee._id}>
              <td>{employee.name}</td>
              <td>{employee.email_address}</td>
              <td>{employee.phone_number}</td>
              <td>{employee.gender}</td>
              <td>{new Date(employee.start_date).toLocaleDateString()}</td>
              <td>{employee.days_worked}</td>
              <td>{employee.cafe || 'N/A'}</td>
              <td>
                <button className="action-button edit-button" onClick={() => handleEditClick(employee._id)}>Edit</button>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {[...Array(Math.ceil(filteredEmployees.length / itemsPerPage)).keys()].map(number => (
          <button
            key={number + 1}
            onClick={() => handlePageChange(number + 1)}
            className={`pagination-button ${currentPage === number + 1 ? 'active' : ''}`}
          >
            {number + 1}
          </button>
        ))}
      </div>
      <ToastContainer />
    </main>
  );
};

const styles = {
  main: {
    padding: '20px',
    textAlign: 'center'
  }
};

export default EmployeePage;
