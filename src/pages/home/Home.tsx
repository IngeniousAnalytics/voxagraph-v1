// src/pages/home/Home.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "@mantine/core";
import AppLayout from "../../components/layout/AppLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "./home.css";
import { Sparkles, Zap, BarChart3, Database, ArrowRight, Play, CheckCircle2, MessageSquare, Eye, Code } from "lucide-react";

// image imports
import heroImg from "../../assets/images/hero.png";
import testimonial1 from "../../assets/images/icons/scalable.svg";
import testimonial2 from "../../assets/images/icons/no-it.svg";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [opened, setOpened] = useState(false);

  useEffect(() => {
    const hero = document.querySelector(".home-hero");
    if (hero) setTimeout(() => hero.classList.add("visible"), 100);
  }, []);

  return (
    <AppLayout>
      {/* ---------- Hero Section ---------- */}
      <section className="home-hero">
        <div className="hero-background">
          <div className="hero-gradient"></div>
          <div className="hero-pattern"></div>
        </div>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-10 hero-content">
              <div className="hero-badge">
                <Sparkles size={16} />
                <span>AI-Powered Dashboard Platform</span>
              </div>
              <h1 className="hero-title">
                Transform <span className="gradient-text">Natural Language</span> into Dynamic Dashboards
              </h1>
              <p className="hero-sub">
                Simply describe what you want to see, and our AI instantly converts your questions into beautiful, interactive dashboards. No coding. No complexity. Just insights.
              </p>
              <div className="hero-features">
                <div className="hero-feature-item feature-nlp">
                  <div className="feature-icon-wrapper">
                    <MessageSquare size={20} />
                  </div>
                  <span>NLP to SQL Conversion</span>
                  <div className="feature-glow"></div>
                </div>
                <div className="hero-feature-item feature-realtime">
                  <div className="feature-icon-wrapper">
                    <Eye size={20} />
                  </div>
                  <span>Real-time Visualizations</span>
                  <div className="feature-glow"></div>
                </div>
                <div className="hero-feature-item feature-code">
                  <div className="feature-icon-wrapper">
                    <Code size={20} />
                  </div>
                  <span>Zero Code Required</span>
                  <div className="feature-glow"></div>
                </div>
              </div>
              <div className="hero-buttons">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("/login?mode=registration")}
                >
                  Get Started Free
                  <ArrowRight size={18} />
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setOpened(true)}
                >
                  <Play size={18} />
                  Watch Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Video Modal ---------- */}
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        centered
        withCloseButton={true}
        size="xl"
        overlayProps={{ opacity: 0.7, blur: 6 }}
        styles={{
          content: {
            background: "rgba(0,0,0,0.85)",
            borderRadius: "14px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4)",
            padding: "0",
            overflow: "hidden",
            width: "80vw",
            maxWidth: "1000px",
          },
          body: { padding: 0 },
        }}
      >
        <div className="video-modal-container">
          <div className="youtube-wrapper">
            <iframe
              width="100%"
              height="540"
              src="https://www.youtube.com/embed/NaFsitmTpZY?si=3Th3LTLpw7CsWu8o"
              title="VoxaGraph Demo Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                border: "none",
                borderRadius: "10px",
              }}
            ></iframe>
          </div>
          <div className="video-footer">
            <button
              className="btn btn-outline-light"
              onClick={() => setOpened(false)}
            >
              Close
            </button>
          </div>
        </div>
      </Modal>

      {/* ---------- How It Works Section ---------- */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>From question to dashboard in seconds</p>
          </div>
          <div className="steps-container">
            <div className="step-item">
              <div className="step-icon">
                <Zap size={32} />
              </div>
              <h3>1. Ask in Natural Language</h3>
              <p>Simply type your question: "Show me sales by region" or "What are the top products this month?"</p>
            </div>
            <div className="step-arrow">
              <ArrowRight size={24} />
            </div>
            <div className="step-item">
              <div className="step-icon">
                <Database size={32} />
              </div>
              <h3>2. AI Converts to SQL</h3>
              <p>Our advanced NLP engine understands your intent and generates optimized SQL queries automatically.</p>
            </div>
            <div className="step-arrow">
              <ArrowRight size={24} />
            </div>
            <div className="step-item">
              <div className="step-icon">
                <BarChart3 size={32} />
              </div>
              <h3>3. Instant Dashboard</h3>
              <p>Beautiful, interactive visualizations appear instantly. Customize, share, and iterate with ease.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Features Section ---------- */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header">
            <h2>Why Choose AI Dashboard</h2>
            <p>
              Powerful AI capabilities combined with intuitive design for instant insights
            </p>
          </div>

          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <Sparkles size={32} />
              </div>
              <h3>AI-Powered NLP</h3>
              <p>
                Advanced natural language processing converts your questions into accurate SQL queries instantly.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Real-Time Visualizations</h3>
              <p>
                See insights as they happen with interactive charts, graphs, and data tables that update automatically.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Database size={32} />
              </div>
              <h3>Multi-Database Support</h3>
              <p>
                Connect to MySQL, PostgreSQL, SQL Server, and more. One platform, unlimited data sources.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <BarChart3 size={32} />
              </div>
              <h3>Zero Code Required</h3>
              <p>
                No SQL knowledge needed. No developers required. Just ask questions and get answers visually.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <CheckCircle2 size={32} />
              </div>
              <h3>90% Cost Reduction</h3>
              <p>
                Eliminate the need for front-end and back-end developers. Build dashboards in minutes, not months.
              </p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <Zap size={32} />
              </div>
              <h3>Enterprise Scalability</h3>
              <p>
                Handles your largest databases with ease while maintaining performance and reliability at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section id="testimonials" className="testimonials">
        <div className="container">
          <div className="section-header">
            <h2>What Teams Say</h2>
            <p>Join thousands of teams transforming their data workflows</p>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="testimonial">
                <div className="testimonial-header">
                  <img
                    src={testimonial1}
                    alt="Ravi K"
                    className="testimonial-avatar"
                  />
                  <div>
                    <strong>Ravi K.</strong>
                    <div className="testimonial-role">Head of Data</div>
                  </div>
                </div>
                <p>
                  "We replaced multiple tools with Voxagraph — the multi-db connector and role system is rock-solid. The NLP to SQL conversion is incredibly accurate."
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="testimonial">
                <div className="testimonial-header">
                  <img
                    src={testimonial2}
                    alt="Maya S"
                    className="testimonial-avatar"
                  />
                  <div>
                    <strong>Maya S.</strong>
                    <div className="testimonial-role">Product Manager</div>
                  </div>
                </div>
                <p>
                  "Great onboarding and the payment/plan UI was straightforward to plug in. Our team can now create dashboards without waiting for developers."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA Section ---------- */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your Data?</h2>
            <p>
              Start building dashboards with natural language today. No credit card required.
            </p>
            <button
              className="btn btn-cta"
              onClick={() => navigate("/login?mode=registration")}
            >
              Get Started Free
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default Home;
