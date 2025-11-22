// src/components/layout/Header.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "./LoginModal";
import "./layout.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="site-header">
      <div className="container header-container">
        {/* Logo */}
        <button
          className="logo-btn"
          onClick={() => navigate("/")}
          aria-label="Go to home"
        >
          <img
            src="/assets/img/logo.svg"
            alt="VoxaGraph Logo"
            className="logo-img"
          />
        </button>

        {/* ✅ Hamburger Button */}
        <button
          className={`nav-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          <span className="nav-bar"></span>
          <span className="nav-bar"></span>
          <span className="nav-bar"></span>
        </button>

        {/* ✅ Nav Menu */}
        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          <ul>
            <li><button onClick={() => navigate("/features")}>Features</button></li>
            <li><button onClick={() => navigate("/use-cases")}>Use Cases</button></li>
            <li><button onClick={() => navigate("/pricing")}>Pricing</button></li>
            <li><button onClick={() => navigate("/documentation")}>Documentation</button></li>
            <li><button className="cta-button" onClick={() => setLoginModalOpened(true)}>Sign In</button></li>
          </ul>
        </nav>
      </div>

      {/* Login Modal Popup */}
      <LoginModal 
        opened={loginModalOpened} 
        onClose={() => setLoginModalOpened(false)} 
        handleConnect={() => {
          setLoginModalOpened(false);
          navigate("/dashboard");
        }} 
      />
    </header>
  );
};

export default Header;
