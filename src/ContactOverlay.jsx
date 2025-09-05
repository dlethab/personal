// ContactOverlay.jsx
import React, { useEffect, useState } from "react";
import "./ContactOverlay.css";
import contactImage from "./assets/dlet.png";

const ContactOverlay = ({ isOpen, closePopup }) => {

  const [showPopup, setShowPopup] = useState(false);
  const [animateOut, setAnimateOut] = useState(false);
  const [subject, setSubject] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // Check if all fields are filled
  const allFilled = subject && name && email && message;
    const handleSubmit = () => {
    if (allFilled) {
      alert("Form submitted!"); // Replace with real submit logic
      // Clear fields
      setSubject("");
      setName("");
      setEmail("");
      setMessage("");
    }
  };

  // When isOpen changes
  useEffect(() => {
    if (isOpen) {
      setShowPopup(true);
      setAnimateOut(false);
      document.body.style.overflow = "hidden"; // disable scroll
    } else if (showPopup) {
      setAnimateOut(true); // trigger slide-up
      document.body.style.overflow = ""; // re-enable scroll
      // remove from DOM after animation
      const timer = setTimeout(() => setShowPopup(false), 500); // match animation duration
      return () => clearTimeout(timer);
    }
  }, [isOpen, showPopup, animateOut]);

  if (!showPopup) return null;

  return (
    <div className="popup">

      
      {/* Full-screen overlay */}
      <div
        className="popup-overlay"
        onClick={closePopup} // Clicking outside closes the popup
      ></div>

      {/* Actual popup content */}
      <div
        className="main-popup"
        onClick={(e) => e.stopPropagation()} // Stops clicks inside popup
        style={{
          animation: isOpen ? "slide-in 0.5s ease forwards" : "slide-out 0.5s ease forwards",
        }}
      >
        {/* Close button */}
        <button className="close-btn" onClick={closePopup}>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M16.25 16.25L8.30005 8.3M16.25 16.25L24.2 8.29999M16.25 16.25L8.30005 24.2M16.25 16.25L24.2 24.2"
              stroke="#1A1A1A"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>


        <div className="popup-content-wrapper">
          <div>
          </div>
        <div className="popup-left">
            {/* Fields */}
            <input
              type="text"
              placeholder="Subject"
              className="contact-input"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
            <input
              type="text"
              placeholder="Name"
              className="contact-input"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Email"
              className="contact-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <textarea
              placeholder="Message"
              className="contact-input contact-message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            ></textarea>

            <div className="contact-actions">
            {/* Submit link */}
            <div
              className={`contact-submit ${allFilled ? "enabled" : ""}`}
              onClick={handleSubmit}
            >
              Submit
            </div>

            <a
              href="https://github.com/dlethab"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
            >
              Github
            </a>

            <a
              href="https://www.linkedin.com/in/dlet-habtemariam/"
              target="_blank"
              rel="noopener noreferrer"
              className="linkedin-link"
            >
              LinkedIn
            </a>
            

          </div>

          </div>

          <div className="popup-right">
            <img src={contactImage} alt="Contact" />
          </div>
        </div>

      </div>
    </div>

  );
};

export default ContactOverlay;
