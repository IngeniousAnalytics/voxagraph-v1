import React from "react";
import AppLayout from "../../components/layout/AppLayout";
import "./use-cases.css";
import "../features/features.css";

import educationIcon from "../../assets/images/icons/education.svg";
import healthcareIcon from "../../assets/images/icons/healthcare.svg";
import financeIcon from "../../assets/images/icons/finance.svg";
import governmentIcon from "../../assets/images/icons/government.svg";
import manufacturingIcon from "../../assets/images/icons/manufacturing.svg";
import retailIcon from "../../assets/images/icons/retail.svg";

const UseCases: React.FC = () => {
  const useCases = [
    {
      icon: educationIcon,
      title: "Education Analytics",
      desc: "Empower universities and institutes to visualize student performance, attendance, and progress metrics in real-time.",
    },
    {
      icon: healthcareIcon,
      title: "Healthcare Insights",
      desc: "Track patient trends, optimize hospital resources, and improve healthcare outcomes with AI-powered dashboards.",
    },
    {
      icon: financeIcon,
      title: "Finance & Auditing",
      desc: "Streamline expense monitoring, detect anomalies, and automate financial reporting securely.",
    },
    {
      icon: governmentIcon,
      title: "Government Data Transparency",
      desc: "Provide public dashboards for policy tracking, budget utilization, and impact assessments.",
    },
    {
      icon: manufacturingIcon,
      title: "Manufacturing & Supply Chain",
      desc: "Monitor production, logistics, and inventory efficiency across multiple facilities in real-time.",
    },
    {
      icon: retailIcon,
      title: "Retail & E-Commerce",
      desc: "Analyze sales trends, customer behavior, and optimize inventory with predictive analytics.",
    },
  ];

  return (
    <AppLayout>
      <main className="use-cases-page">
        {/* Hero Section */}
        <section className="use-cases-hero">
          <div className="container">
            <h1>Voxagraph Use Cases</h1>
            <p>
              Discover how Voxagraph AI Dashboard empowers industries to make
              better data-driven decisions with actionable intelligence.
            </p>
          </div>
        </section>

        {/* Use Case Cards */}
        <section className="use-cases">
          <div className="container">
            <div className="section-header">
              <h2>Real-world Applications</h2>
              <p>
                From education to finance, see how Voxagraph helps transform
                industries with smart analytics.
              </p>
            </div>

            <div className="features-grid futuristic">
              {useCases.map((u, i) => (
                <div key={i} className="feature-card futuristic">
                  <div className="feature-icon">
                    <img src={u.icon} alt={u.title} />
                  </div>
                  <h3>{u.title}</h3>
                  <p>{u.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="use-cases-cta">
          <div className="container">
            <h2>Ready to Build with Voxagraph?</h2>
            <p>
              Join organizations using Voxagraph for smarter, faster, and safer
              decision-making.
            </p>
            <div className="cta-buttons">
              <a href="/login?mode=registration" className="btn btn-primary">
                Get Started
              </a>
              <a href="/features" className="btn btn-outline-secondary">
                Explore Features
              </a>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default UseCases;
