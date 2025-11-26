// src/components/layout/Header.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import { Sparkles, Menu, X } from "lucide-react";
import "./layout.css";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/features", label: "Features" },
    { path: "/use-cases", label: "Use Cases" },
    { path: "/pricing", label: "Pricing" },
    { path: "/documentation", label: "Docs" },
  ];

  return (
    <header className={`site-header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-container">
        {/* Logo */}
        <button
          className="logo-btn"
          onClick={() => {
            navigate("/");
            setMenuOpen(false);
          }}
          aria-label="Go to home"
        >
          <img
            src="/assets/img/logo.svg"
            alt="VoxaGraph Logo"
            className="logo-img"
          />
        </button>

        {/* Desktop Navigation */}
        <nav className="main-nav">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <button
                  className={isActive(item.path) ? "active" : ""}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                >
                  {item.label}
                </button>
              </li>
            ))}
            <li>
              <button
                className="cta-button"
                onClick={() => {
                  setLoginModalOpened(true);
                  setMenuOpen(false);
                }}
              >
                Sign In
              </button>
            </li>
          </ul>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className={`nav-toggle ${menuOpen ? "open" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      <nav className={`mobile-nav ${menuOpen ? "open" : ""}`}>
        <ul>
          {navItems.map((item) => (
            <li key={item.path}>
              <button
                className={isActive(item.path) ? "active" : ""}
                onClick={() => {
                  navigate(item.path);
                  setMenuOpen(false);
                }}
              >
                {item.label}
              </button>
            </li>
          ))}
          <li>
            <button
              className="cta-button mobile-cta"
              onClick={() => {
                setLoginModalOpened(true);
                setMenuOpen(false);
              }}
            >
              Sign In
            </button>
          </li>
        </ul>
      </nav>

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
