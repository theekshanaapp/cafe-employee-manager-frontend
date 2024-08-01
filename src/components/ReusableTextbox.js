import React from 'react';

const ReusableTextbox = ({ label, value, onChange, name, minLength, maxLength, required }) => {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        minLength={minLength}
        maxLength={maxLength}
        required={required}
        className="form-control"
      />
    </div>
  );
};

export default ReusableTextbox;
