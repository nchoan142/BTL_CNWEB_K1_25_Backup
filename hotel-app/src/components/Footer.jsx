import React from 'react';

const Footer = () => (
  <footer className="footer-area">
    <div className="container">
      <div className="row">
        <div className="col-12">
          <p className="text-center mt-30" style={{color: '#fff'}}>
            Copyright &copy; {new Date().getFullYear()} All rights reserved | Template converted to ReactJS
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;