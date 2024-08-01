import React from 'react';

const Footer = () => {
  return (
    <footer style={styles.footer}>
      <p>&copy; 2024 Harendra Theekshana</p>
    </footer>
  );
};

const styles = {
  footer: {
    padding: '10px',
    backgroundColor: '#282c34',
    color: 'white',
    textAlign: 'center',
    position: 'fixed',
    width: '100%',
    bottom: 0
  }
};

export default Footer;
