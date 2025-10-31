import "./layout.css";

const Footer = () => (
  <footer className="site-footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-column">
          <h3>Product</h3>
          <ul>
            <li><a href="/features">Features</a></li>
            <li><a href="/pricing">Pricing</a></li>
            <li><a href="/documentation">Documentation</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Legal</h3>
          <ul>
            <li><a href="/privacy">Privacy</a></li>
            <li><a href="/terms">Terms</a></li>
            <li><a href="/security">Security</a></li>
          </ul>
        </div>

        <div className="footer-column">
          <h3>Get Started</h3>
          <a href="/login" className="cta-button" style={{ display: "inline-block", marginBottom: "20px" }}>
            Sign Up Free
          </a>
          <p>
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

export default Footer;
