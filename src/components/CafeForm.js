import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import ReusableTextbox from './ReusableTextbox';
import './CafeForm.css';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;
const API_LOGO_URL = process.env.REACT_APP_API_BASE_URL_LOGO;

const CafeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: null,
    location: ''
  });

  useEffect(() => {
    if (id) {
      const fetchCafe = async () => {
        try {
          const response = await fetch(`${API_BASE_URL}/cafes/${id}`);
          const data = await response.json();
          setFormData({
            name: data.name || '',
            description: data.description || '',
            logo: data.logo || '',
            location: data.location || ''
          });
        } catch (error) {
          console.error('Error fetching cafe:', error);
        }
      };

      fetchCafe();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.location) {
      alert('Name and Location are required!');
      return;
    }

    const form = new FormData();
    form.append('name', formData.name);
    form.append('description', formData.description);
    form.append('location', formData.location);
    if (formData.logo) form.append('logo', formData.logo);
    if (id) form.append('_id', id);

    const method = id ? 'PUT' : 'POST';
    const endpoint = '/cafes';
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        body: form
      });

      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }

      navigate('/');
    } catch (error) {
      console.error('Error saving cafe:', error);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  return (
    <div className="cafe-form-container">
      <h2>{id ? 'Edit Cafe' : 'Add Cafe'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <ReusableTextbox
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Cafe Name"
            minLength={6}
            maxLength={10}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <ReusableTextbox
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Cafe Description"
            maxLength={256}
          />
        </div>
        <div className="form-group">
          <label htmlFor="logo">Logo</label>
          {formData.logo && (
            <div>
              <img
                src={`${API_LOGO_URL}${formData.logo}`}
                alt="Cafe Logo"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
              <br />
            </div>
          )}
          <input
            type="file"
            id="logo"
            name="logo"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="location">Location</label>
          <ReusableTextbox
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Cafe Location"
            required
          />
        </div>
        <div className="form-group">
          <button type="submit" className="submit-button">
            {id ? 'Update Cafe' : 'Add Cafe'}
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default CafeForm;
