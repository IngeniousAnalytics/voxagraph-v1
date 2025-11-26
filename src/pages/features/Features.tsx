import React from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../../components/layout/AppLayout";
import { Sparkles, Zap, Database, BarChart3, CheckCircle2, Shield, ArrowRight } from "lucide-react";
import "./features.css";

import humanLoop from "../../assets/images/icons/human-loop.svg";
import realTime from "../../assets/images/icons/real-time.svg";
import scalable from "../../assets/images/icons/scalable.svg";
import reliable from "../../assets/images/icons/reliable.svg";
import costEfficiency from "../../assets/images/icons/cost-efficiency.svg";
import noIT from "../../assets/images/icons/no-it.svg";

const Features: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Sparkles,
      image: humanLoop,
      title: "AI-Powered NLP",
      desc: "Advanced natural language processing converts your questions into accurate SQL queries instantly. No technical knowledge required.",
      gradient: "from-purple-500 to-pink-500",
    },
    {
      icon: Zap,
      image: realTime,
      title: "Real-Time Visualizations",
      desc: "See insights as they happen with interactive charts, graphs, and data tables that update automatically as your data changes.",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: Database,
      image: scalable,
      title: "Multi-Database Support",
      desc: "Connect to MySQL, PostgreSQL, SQL Server, Oracle, and more. One platform, unlimited data sources with enterprise-grade scalability.",
      gradient: "from-indigo-500 to-purple-500",
    },
    {
      icon: Shield,
      image: reliable,
      title: "Human-in-the-Loop Validation",
      desc: "Our AI never works alone – gain confidence through human verification for critical decisions, ensuring accuracy and reliability.",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: BarChart3,
      image: costEfficiency,
      title: "90% Cost Reduction",
      desc: "Dashboard development costs reduced dramatically – no front-end or back-end developers needed for analytics setup.",
      gradient: "from-orange-500 to-red-500",
    },
    {
      icon: CheckCircle2,
      image: noIT,
      title: "Zero IT Dependency",
      desc: "Management teams can directly create, manage, and analyze dashboards – eliminating reliance on intermediate IT resources.",
      gradient: "from-teal-500 to-blue-500",
    },
  ];

  return (
    <AppLayout>
      <main className="features-page">
        {/* Hero Section */}
        <section className="features-hero">
          <div className="hero-background">
            <div className="hero-gradient"></div>
          </div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <Sparkles size={16} />
                <span>Platform Features</span>
              </div>
              <h1>Powerful Features for <span className="gradient-text">AI-Driven Analytics</span></h1>
              <p>
                Transform how your team interacts with data. From natural language queries to instant visualizations,
                everything you need for modern business intelligence.
              </p>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="features-section">
          <div className="container">
            <div className="features-grid">
              {features.map((feature, i) => {
                const IconComponent = feature.icon;
                return (
                  <div key={i} className="feature-card-modern">
                    <div className="feature-icon-modern">
                      <div className="icon-wrapper">
                        <img src={feature.image} alt={feature.title} className="feature-image" />
                        <div className="icon-overlay">
                          <IconComponent size={24} />
                        </div>
                      </div>
                    </div>
                    <h3>{feature.title}</h3>
                    <p>{feature.desc}</p>
                    <div className="feature-glow"></div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="features-cta">
          <div className="container">
            <div className="cta-content">
              <h2>Ready to Experience These Features?</h2>
              <p>Start building dashboards with natural language today. No credit card required.</p>
              <button
                className="btn-primary-large"
                onClick={() => navigate("/login?mode=registration")}
              >
                Get Started Free
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default Features;
