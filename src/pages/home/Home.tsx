// src/pages/home/Home.tsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "@mantine/core";
import AppLayout from "../../components/layout/AppLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../assets/css/home.css";

// image imports
import heroImg from "../../assets/images/hero.png";
import testimonial1 from "../../assets/images/icons/scalable.svg";
import testimonial2 from "../../assets/images/icons/no-it.svg";

// video import


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
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <h1 className="hero-title">AI Dashbaord Insights with Human Confidence</h1>
              <p className="hero-sub">
                The intelligent dashboard that combines AI power with human
                oversight for reliable decision-making.
              </p>
                    <div className="hero-buttons">
                    <button
                      className="btn btn-primary"
                      onClick={() => navigate("/login?mode=registration")}
                    >
                      Try Now
                    </button>

                    <button
                      className="btn btn-outline"
                      onClick={() => setOpened(true)}
                    >
                      Demo Video
                    </button>

                    <button
                      className="btn btn-contact"
                      onClick={() => navigate("/contact")}
                    >
                      Contact Us
                    </button>
                  </div>



            </div>

            <div className="col-lg-6 text-center">
              <img
                src={heroImg}
                alt="Voxagraph dashboard preview"
                className="img-fluid hero-image"
              />
            </div>
          </div>
        </div>
      </section>

    {/* ---------- Modern Large Video Modal ---------- */}
    {/* ---------- Modern Large YouTube Video Modal ---------- */}
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
        src="https://www.youtube.com/embed/Cn3X_gGFn5I?si=sQR90xcvpCpRWrwJ"
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



      {/* ---------- Features Section ---------- */}
      <section className="features" id="features">
        <div className="container">
          <div className="section-header text-center mb-5">
            <h2>Why Choose Voxagraph AI Dashboard</h2>
            <p>
              Powerful analytics combined with human verification for
              trustworthy insights.
            </p>
          </div>

          <div className="features-grid futuristic">
            <div className="feature-card futuristic">
              <div className="feature-icon">
                <img
                  src="/assets/images/icons/human-loop.svg"
                  alt="Human-in-the-Loop"
                />
              </div>
              <h3>Human-in-the-Loop Confirmation</h3>
              <p>
                Our AI never works alone – gain confidence through human
                verification for critical decisions.
              </p>
            </div>

            <div className="feature-card futuristic">
              <div className="feature-icon">
                <img
                  src="/assets/images/icons/real-time.svg"
                  alt="Real-Time Visualizations"
                />
              </div>
              <h3>Real-Time Visualizations</h3>
              <p>
                See insights as they happen with accurate cost projections and
                interactive data exploration.
              </p>
            </div>

            <div className="feature-card futuristic">
              <div className="feature-icon">
                <img
                  src="/assets/images/icons/scalable.svg"
                  alt="Enterprise Scalability"
                />
              </div>
              <h3>Enterprise-Grade Scalability</h3>
              <p>
                Handles your largest databases with ease while maintaining
                performance and reliability.
              </p>
            </div>

            <div className="feature-card futuristic">
              <div className="feature-icon">
                <img
                  src="/assets/images/icons/reliable.svg"
                  alt="Proven Reliability"
                />
              </div>
              <h3>Proven Reliability</h3>
              <p>
                Benchmark-tested against real-world scenarios with continuous
                performance monitoring.
              </p>
            </div>

            <div className="feature-card futuristic">
              <div className="feature-icon">
                <img
                  src="/assets/images/icons/cost-efficiency.svg"
                  alt="Cost Efficiency"
                />
              </div>
              <h3>Cost Efficiency</h3>
              <p>
                Dashboard development costs reduced by <strong>90%</strong> – no
                front-end or back-end developers needed for analytics setup.
              </p>
            </div>

            <div className="feature-card futuristic">
              <div className="feature-icon">
                <img
                  src="/assets/images/icons/no-it.svg"
                  alt="No IT Dependencies"
                />
              </div>
              <h3>No IT Dependencies</h3>
              <p>
                Management teams can directly create, manage, and analyze
                dashboards – eliminating reliance on intermediate IT resources.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Testimonials ---------- */}
      <section id="testimonials" className="py-5 bg-light">
        <div className="container">
          <div className="row text-center mb-4">
            <div className="col">
              <h3>What Teams Say</h3>
            </div>
          </div>

          <div className="row g-4">
            <div className="col-md-6">
              <div className="testimonial p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={testimonial1}
                    alt="Ravi K"
                    className="testimonial-avatar me-3"
                  />
                  <div>
                    <strong>Ravi K.</strong>
                    <div className="text-muted">Head of Data</div>
                  </div>
                </div>
                <p>
                  "We replaced multiple tools with Voxagraph — the multi-db
                  connector and role system is rock-solid."
                </p>
              </div>
            </div>

            <div className="col-md-6">
              <div className="testimonial p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={testimonial2}
                    alt="Maya S"
                    className="testimonial-avatar me-3"
                  />
                  <div>
                    <strong>Maya S.</strong>
                    <div className="text-muted">Product Manager</div>
                  </div>
                </div>
                <p>
                  "Great onboarding and the payment/plan UI was straightforward
                  to plug in."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- CTA Section ---------- */}
      {/* <section
        id="contact"
        className="cta-section py-5 text-white"
        style={{ backgroundColor: "#172b4d" }}
      >
        <div className="container text-center">
          <h4>Ready to get started?</h4>
          <p className="mb-4">
            Sign up and connect your first database in minutes.
          </p>
          <button
            className="btn btn-light"
            onClick={() => navigate("/signup")}
          >
            Start Free
          </button>
        </div>
      </section> */}
    </AppLayout>
  );
};

export default Home;
