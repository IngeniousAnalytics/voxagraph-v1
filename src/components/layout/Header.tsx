import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/images/logo1.png";
import "./layout.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleToggle = () => setMenuOpen(!menuOpen);

  return (
    <header className="site-header">
      <div className="container header-container">
        <button
          className="logo-btn"
          aria-label="Voxagraph Home"
          onClick={() => navigate("/")}
        >
          <img src={logo} alt="Voxagraph Logo" className="logo-img" />
        </button>

        {/* Mobile Menu Button */}
        <button
          className={`nav-toggle ${menuOpen ? "open" : ""}`}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={handleToggle}
        >
          <span className="nav-bar"></span>
          <span className="nav-bar"></span>
          <span className="nav-bar"></span>
        </button>

        {/* Navigation */}
        <nav className={`main-nav ${menuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <button onClick={() => navigate("/features")}>Features</button>
            </li>
            <li>
              <button onClick={() => navigate("/use-cases")}>Use Cases</button>
            </li>
            <li>
              <button onClick={() => navigate("/pricing")}>Pricing</button>
            </li>
            <li>
              <button onClick={() => navigate("/documentation")}>Documentation</button>
            </li>
            <li>
              <button
                className="cta-button"
                onClick={() => navigate("/login")}
              >
                Sign-in
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
