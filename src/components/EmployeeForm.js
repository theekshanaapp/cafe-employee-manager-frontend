import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReusableTextbox from './ReusableTextbox';
import './EmployeeForm.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const EmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email_address: '',
    phone_number: '',
    gender: '',
    cafe: '',
    start_date: ''
  });
  const [cafes, setCafes] = useState([]);
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    const fetchCafes = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/cafes`);
        const data = await response.json();
        setCafes(data);
      } catch (error) {
        console.error('Error fetching cafes:', error);
      }
    };

    fetchCafes();

    if (id) {
      const fetchEmployee = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/employees/${id}`);
          const data = await response.json();
          console.log('Employee Data:', data);
          setFormData({
            name: data.name || '',
            email_address: data.email_address || '',
            phone_number: data.phone_number || '',
            gender: data.gender || '',
            cafe: data.cafe || '',
            start_date: data.start_date ? data.start_date.split('T')[0] : '',
            _id: id
          });
        } catch (error) {
          console.error('Error fetching employee:', error);
        }
      };

      fetchEmployee();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
    setIsDirty(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email_address, phone_number, gender, start_date } = formData;
    const phoneRegex = /^[89]\d{7}$/;
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/; // YYYY-MM-DD format
    if (!name || !email_address || !phone_number || !gender || !start_date) {
      alert('All fields are required!');
      return;
    }
    if (!phoneRegex.test(phone_number)) {
      alert('Phone number must start with 8 or 9 and be 8 digits long.');
      return;
    }
    if (!dateRegex.test(start_date)) {
      alert('Start date must be in the format YYYY-MM-DD.');
      return;
    }

    const method = id ? 'PUT' : 'POST';
    const endpoint = '/employees';
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      navigate('/employees');
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleCancel = () => {
    if (isDirty && !window.confirm('You have unsaved changes. Are you sure you want to cancel?')) {
      return;
    }
    navigate('/employees');
  };

  return (
    <div className="employee-form-container">
      <h2>{id ? 'Edit Employee' : 'Add Employee'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <ReusableTextbox
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Employee Name"
            minLength={6}
            maxLength={10}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email_address">Email Address</label>
          <ReusableTextbox
            id="email_address"
            name="email_address"
            type="email"
            value={formData.email_address}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone_number">Phone Number</label>
          <ReusableTextbox
            id="phone_number"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="Phone Number"
            pattern="^[89]\d{7}$"
            required
          />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <div>
            <label>
              <input
                type="radio"
                name="gender"
                value="Male"
                checked={formData.gender === 'Male'}
                onChange={handleChange}
                required
              />
              Male
            </label>
            <label>
              <input
                type="radio"
                name="gender"
                value="Female"
                checked={formData.gender === 'Female'}
                onChange={handleChange}
                required
              />
              Female
            </label>
          </div>
        </div>
        <div className="form-group">
          <label htmlFor="cafe">Assigned Café (Optional)</label>
          <select
            id="cafe"
            name="cafe"
            value={formData.cafe}
            onChange={handleChange}
          >
            <option value="">None</option>
            {cafes.map(cafe => (
              <option key={cafe._id} value={cafe._id}>
                {cafe.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="start_date">Start Date</label>
          <input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date || ''}
            onChange={handleChange}
            required
            className="date-input"
          />
        </div>
        <div className="button-group">
          <button type="submit" className="submit-button">
            {id ? 'Update Employee' : 'Add Employee'}
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmployeeForm;
