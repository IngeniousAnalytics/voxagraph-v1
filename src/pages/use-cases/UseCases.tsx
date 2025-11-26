import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { GraduationCap, Heart, DollarSign, Building2, Factory, ShoppingBag, ArrowRight } from "lucide-react";
import "./use-cases.css";
import "../features/features.css";

import educationIcon from "../../assets/images/icons/education.svg";
import healthcareIcon from "../../assets/images/icons/healthcare.svg";
import financeIcon from "../../assets/images/icons/finance.svg";
import governmentIcon from "../../assets/images/icons/government.svg";
import manufacturingIcon from "../../assets/images/icons/manufacturing.svg";
import retailIcon from "../../assets/images/icons/retail.svg";

const UseCases: React.FC = () => {
  const navigate = useNavigate();

  const useCases = [
    {
      icon: GraduationCap,
      image: educationIcon,
      title: "Education Analytics",
      desc: "Empower universities and institutes to visualize student performance, attendance, and progress metrics in real-time with AI-powered dashboards.",
      color: "#667eea",
    },
    {
      icon: Heart,
      image: healthcareIcon,
      title: "Healthcare Insights",
      desc: "Track patient trends, optimize hospital resources, and improve healthcare outcomes with intelligent data visualization and predictive analytics.",
      color: "#f093fb",
    },
    {
      icon: DollarSign,
      image: financeIcon,
      title: "Finance & Auditing",
      desc: "Streamline expense monitoring, detect anomalies, and automate financial reporting securely with real-time dashboards and alerts.",
      color: "#4facfe",
    },
    {
      icon: Building2,
      image: governmentIcon,
      title: "Government Data Transparency",
      desc: "Provide public dashboards for policy tracking, budget utilization, and impact assessments with transparent, accessible data visualization.",
      color: "#764ba2",
    },
    {
      icon: Factory,
      image: manufacturingIcon,
      title: "Manufacturing & Supply Chain",
      desc: "Monitor production, logistics, and inventory efficiency across multiple facilities in real-time with integrated analytics dashboards.",
      color: "#00f2fe",
    },
    {
      icon: ShoppingBag,
      image: retailIcon,
      title: "Retail & E-Commerce",
      desc: "Analyze sales trends, customer behavior, and optimize inventory with predictive analytics and dynamic business intelligence.",
      color: "#f093fb",
    },
  ];

  return (
    <AppLayout>
      <main className="use-cases-page">
        {/* Hero Section */}
        <section className="use-cases-hero">
          <div className="hero-background">
            <div className="hero-gradient"></div>
          </div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <Building2 size={16} />
                <span>Industry Applications</span>
              </div>
              <h1>Transform Your Industry with <span className="gradient-text">AI Dashboards</span></h1>
              <p>
                Discover how organizations across industries leverage AI-powered analytics to make better,
                data-driven decisions with actionable intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="use-cases-section">
          <div className="container">
            <div className="section-header">
              <h2>Real-World Applications</h2>
              <p>From education to finance, see how AI Dashboard helps transform industries with smart analytics</p>
            </div>

            <div className="use-cases-grid">
              {useCases.map((useCase, i) => {
                const IconComponent = useCase.icon;
                return (
                  <div key={i} className="use-case-card">
                    <div className="use-case-icon" style={{ background: `${useCase.color}15` }}>
                      <div className="icon-container">
                        <img src={useCase.image} alt={useCase.title} className="use-case-image" />
                        <div className="icon-badge" style={{ background: useCase.color }}>
                          <IconComponent size={20} color="#ffffff" />
                        </div>
                      </div>
                    </div>
                    <h3>{useCase.title}</h3>
                    <p>{useCase.desc}</p>
                    <div className="use-case-accent" style={{ background: useCase.color }}></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="use-cases-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Transform Your Industry?</h2>
              <p>
                Join organizations using AI Dashboard for smarter, faster, and safer decision-making.
                Start building your custom dashboards today.
              </p>
              <div className="cta-buttons">
                <button
                  className="btn-primary-large"
                  onClick={() => navigate("/login?mode=registration")}
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </button>
                <button
                  className="btn-secondary-large"
                  onClick={() => navigate("/features")}
                >
                  Explore Features
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default UseCases;
