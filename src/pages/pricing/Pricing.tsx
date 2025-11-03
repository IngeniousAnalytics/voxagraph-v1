import React, { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import "./pricing.css";

const Pricing: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      q: "How does the Professional license key work?",
      a: "After purchase, you'll receive a license key that activates the downloadable version of Voxagraph. The key is tied to the number of database connections you've purchased (up to 5 for Professional). You can manage your licenses through your account dashboard.",
    },
    {
      q: "Can I upgrade from Professional to Enterprise?",
      a: "Yes, you can upgrade at any time. We'll prorate the difference between your Professional plan and the Enterprise subscription. Contact our sales team for large deployments or special requirements.",
    },
    {
      q: "What databases do you support?",
      a: "Voxagraph supports all major SQL databases (PostgreSQL, MySQL, SQL Server, Oracle) and cloud data warehouses (BigQuery, Snowflake, Redshift). We also support CSV/Excel file uploads for quick analysis.",
    },
    {
      q: "How secure is my data in the demo?",
      a: "Demo uploads are processed in a secure, isolated environment and automatically deleted after 24 hours. For production data, we recommend the downloadable Professional or Enterprise versions which keep all data on your infrastructure.",
    },
    {
      q: "What is Human-in-the-Loop and why is it important?",
      a: "Human-in-the-Loop is our unique feature that adds a human review step for critical queries. This ensures AI-generated SQL queries are validated before execution, preventing costly errors and maintaining data integrity.",
    },
  ];

  return (
    <AppLayout>
      <main className="pricing-page">
        {/* Hero */}
        <section className="pricing-hero">
          <div className="container">
            <h1>Simple, Transparent Pricing</h1>
            <p>
              Choose the plan that fits your needs. Start with a free demo or go
              pro for advanced analytics and enterprise features.
            </p>
          </div>
        </section>

        {/* Pricing Tiers */}
        <section className="pricing-tiers">
          <div className="container">
            <div className="tiers-container">
              {/* Free Tier */}
              <div className="pricing-tier">
                <div className="tier-header">
                  <div className="tier-name">Demo</div>
                  <div className="tier-price">₹0</div>
                  <div className="tier-period">Limited</div>
                </div>
                <div className="tier-description">
                  Try our basic features with sample data or upload your own
                  CSV/Excel files.
                </div>
                <div className="tier-features">
                  {[
                    "Upload CSV/Excel (up to 2MB)",
                    "Basic visualizations",
                    "Sample dashboards",
                    "Sample Database Attached",
                    "Community support",
                  ].map((f, i) => (
                    <div className="feature-item" key={i}>
                      <span className="feature-icon">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="tier-cta secondary-cta"
                  onClick={() =>
                    (window.location.href = "/login?mode=registration")
                  }
                >
                  Try Demo
                </button>
              </div>

              {/* Enterprise Tier */}
              <div className="pricing-tier">
                <div className="tier-header">
                  <div className="tier-name">Enterprise</div>
                  <div className="tier-price">Custom</div>
                  <div className="tier-period">
                    Perpetual License (Base)
                  </div>
                </div>
                <div className="tier-description">
                  For organizations needing unlimited scale, sharing, and
                  enterprise-grade features.
                </div>
                <div className="tier-features">
                  {[
                    "Everything in Professional",
                    "Unlimited database connections",
                    "Shared dashboards with public URLs",
                    "Policy-based analytics",
                    "24/7 priority support & SLAs",
                    "On-premise deployment option",
                    "Dedicated account manager",
                  ].map((f, i) => (
                    <div className="feature-item" key={i}>
                      <span className="feature-icon">✓</span>
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
                <button
                  className="tier-cta secondary-cta"
                  onClick={() =>
                    (window.location.href =
                      "mailto:info@ingeniousanalytics.com?subject=Enterprise Plan Inquiry")
                  }
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section */}
        <section className="demo-section">
          <div className="container demo-container">
            <div className="demo-content">
              <h2>Try Before You Buy</h2>
              <p>
                Upload your CSV or Excel file and see how Voxagraph transforms
                your data into actionable insights with beautiful
                visualizations.
              </p>
              <ul>
                <li>No credit card required</li>
                <li>Processes files up to 10MB</li>
                <li>Export your visualizations</li>
                <li>Test all chart types</li>
              </ul>
            </div>
            <div className="demo-box">
              <div
                className="upload-area"
                onClick={() =>
                  (window.location.href = "/login?mode=registration")
                }
              >
                <div className="upload-icon">📊</div>
                <h3>Upload Your Data</h3>
                <p>Drag & drop your CSV or Excel file here</p>
                <p
                  style={{
                    color: "var(--dark-gray)",
                    margin: "10px 0",
                  }}
                >
                  or
                </p>
                <button className="secondary-cta">Browse Files</button>
              </div>
              <p
                style={{
                  fontSize: "0.875rem",
                  color: "var(--dark-gray)",
                  marginTop: "12px",
                }}
              >
                By uploading, you agree to our{" "}
                <a
                  href="/privacy"
                  style={{
                    color: "var(--electric-blue)",
                    textDecoration: "underline",
                  }}
                >
                  Privacy Policy
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="faq-section">
          <div className="container">
            <h2>Frequently Asked Questions</h2>
            {faqs.map((faq, i) => (
              <div key={i} className="faq-item">
                <div
                  className="faq-question"
                  onClick={() => toggleFAQ(i)}
                  style={{
                    background: openIndex === i ? "rgba(59,130,246,0.05)" : "",
                  }}
                >
                  <span>{faq.q}</span>
                  <span>{openIndex === i ? "−" : "+"}</span>
                </div>
                <div
                  className={`faq-answer ${openIndex === i ? "active" : ""}`}
                >
                  <p>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default Pricing;
