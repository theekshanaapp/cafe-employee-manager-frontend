import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import './HomePage.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_LOGO_URL = process.env.REACT_APP_API_BASE_URL_LOGO;

const HomePage = () => {
  const [cafes, setCafes] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [cafesPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCafes();
  }, []);

  const fetchCafes = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/cafes`);
      const data = await response.json();
      setCafes(data);
    } catch (error) {
      console.error('Error fetching cafes:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/cafes/${id}`, { method: 'DELETE' });
      setCafes(cafes.filter((cafe) => cafe.id !== id));
      toast.success('Cafe deleted successfully!');
      fetchCafes();
    } catch (error) {
      toast.error('Error deleting cafe');
      console.error('Error deleting cafe:', error);
    }
  };

  const filteredCafes = cafes.filter(
    (cafe) =>
      (cafe.name && cafe.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cafe.description && cafe.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (cafe.location && cafe.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastCafe = currentPage * cafesPerPage;
  const indexOfFirstCafe = indexOfLastCafe - cafesPerPage;
  const currentCafes = filteredCafes.slice(indexOfFirstCafe, indexOfLastCafe);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  const handleAddClick = () => {
    navigate('/add-cafe');
  };

  const handleEditClick = (cafeId) => {
    navigate(`/edit-cafe/${cafeId}`);
  };

  return (
    <main style={styles.main}>
      <h2>List of Cafes</h2>
      <div className="controls">
        <input
          type="text"
          placeholder="Search cafes..."
          className="search-bar"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={handleAddClick} className="add-button">Add New Cafe</button>
      </div>
      <table className="cafe-table">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Description</th>
            <th>Employees</th>
            <th>Location</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentCafes.map((cafe) => (
            <tr key={cafe.id}>
              <td>
                {cafe.logo && (
                  <img
                    src={`${API_LOGO_URL}${cafe.logo}`}
                    alt={cafe.name}
                    className="cafe-logo"
                    style={{ maxWidth: '100px', maxHeight: '100px' }}
                  />
                )}
              </td>
              <td>{cafe.name}</td>
              <td>{cafe.description}</td>
              <td>{cafe.employees}</td>
              <td>{cafe.location}</td>
              <td>
                <button onClick={() => handleEditClick(cafe._id)} className="action-button edit-button">Edit</button>
                <button
                  className="action-button delete-button"
                  onClick={() => handleDelete(cafe._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(filteredCafes.length / cafesPerPage) }, (_, index) => (
          <button
            key={index + 1}
            onClick={() => paginate(index + 1)}
            className={`pagination-button ${currentPage === index + 1 ? 'active' : ''}`}
          >
            {index + 1}
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
    textAlign: 'center',
  },
};

export default HomePage;
