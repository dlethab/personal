import React from "react";
import { Link } from "react-router-dom"; 

import "./InfoPage.css";
import pic from "../assets/photos/personal.png"

const InfoPage = () => {

  return (
    <main className="info-container">
      {/* Left Side: Image and Description */}
      <div className="left-side">
        <h2 className= "info-title">Information</h2>
        <div className="profile-info">
            <p className="description">
                A brief description about yourself...
            </p>
          <img src={pic} alt="Your Name" className="profile-img" />
          
        </div>
      </div>

      {/* Right Side: Links */}
      <div className="right-side">
        <h3 className="info-title">Links</h3>
        <ul className="links-list">
            <div className="resume-toggle" style={{ marginTop: "1rem" }}>
                <Link to="/resume" className="resume-link-text">
                    Resume
                </Link>
            </div>
          <li><a href="link-to-project-1">Project 1</a></li>
          <li><a href="link-to-project-2">Project 2</a></li>
          {/* Add more links as needed */}
        </ul>
      </div>
    </main>
  );
};

export default InfoPage;
