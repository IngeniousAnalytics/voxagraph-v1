import "./layout.css";
import { useNavigate } from "react-router-dom";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Product Column */}
          <div className="footer-column">
            <h3>Product</h3>
            <ul>
              <li><a href="/features">Features</a></li>
              <li><a href="/pricing">Pricing</a></li>
              <li><a href="/documentation">Documentation</a></li>
            </ul>
          </div>

          {/* Legal Column */}
          <div className="footer-column">
            <h3>Legal</h3>
            <ul>
              <li><a href="/privacy">Privacy</a></li>
              <li><a href="/terms">Terms</a></li>
              <li><a href="/security">Security</a></li>
            </ul>
          </div>

          {/* Get Started Column */}
          <div className="footer-column">
            <h3>Get Started</h3>

            <div className="footer-buttons">
              <a
                href="/login"
                className="cta-button"
              >
                Sign Up Free
              </a>
              <a
                href="/contact"
                className="cta-button"
               >
                Contact Us
              </a>

              {/* ✅ New Contact Us Button
              <button
                className="cta-button " style={{
                  display: "inline-block",
                  marginBottom: "10px",
                }}
                onClick={() => navigate("/contact")}
              >
                Contact Us
              </button> */}
            </div>

            <p style={{ marginTop: "16px" }}>
              Questions?{" "}
              <a href="mailto:info@ingeniousanalyties.com">
                info@ingeniousanalyties.com
              </a>
            </p>
          </div>
        </div>

        <div className="copyright">
          © {new Date().getFullYear()}{" "}
          <a
            href="https://ingeniousanalytics.com/index.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "inherit", textDecoration: "underline" }}
          >
            Ingenious Analyties
          </a>
          . All rights reserved. Voxagraph is a product of Ingenious Analyties.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
