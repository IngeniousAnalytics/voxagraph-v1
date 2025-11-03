import React from "react";
import AppLayout from "../../components/layout/AppLayout";
import "./features.css";

import humanLoop from "../../assets/images/icons/human-loop.svg";
import realTime from "../../assets/images/icons/real-time.svg";
import scalable from "../../assets/images/icons/scalable.svg";
import reliable from "../../assets/images/icons/reliable.svg";
import costEfficiency from "../../assets/images/icons/cost-efficiency.svg";
import noIT from "../../assets/images/icons/no-it.svg";

const Features: React.FC = () => {
  const features = [
    {
      icon: humanLoop,
      title: "Human-in-the-Loop Confirmation",
      desc: "Our AI never works alone – gain confidence through human verification for critical decisions.",
    },
    {
      icon: realTime,
      title: "Real-Time Visualizations",
      desc: "See insights as they happen with accurate cost projections and interactive data exploration.",
    },
    {
      icon: scalable,
      title: "Enterprise-Grade Scalability",
      desc: "Handles your largest databases with ease while maintaining performance and reliability.",
    },
    {
      icon: reliable,
      title: "Proven Reliability",
      desc: "Benchmark-tested against real-world scenarios with continuous performance monitoring.",
    },
    {
      icon: costEfficiency,
      title: "Cost Efficiency",
      desc: "Dashboard development costs reduced by 90% – no front-end or back-end developers needed for analytics setup.",
    },
    {
      icon: noIT,
      title: "No IT Dependencies",
      desc: "Management teams can directly create, manage, and analyze dashboards – eliminating reliance on intermediate IT resources.",
    },
  ];

  return (
    <AppLayout>
      <main className="features-page">
        <section className="features" id="features">
          <div className="container">
            <div className="section-header">
              <h2>Why Choose Voxagraph AI Dashboard</h2>
              <p>
                Powerful analytics combined with human verification for
                trustworthy insights
              </p>
            </div>

            <div className="features-grid futuristic">
              {features.map((f, i) => (
                <div key={i} className="feature-card futuristic">
                  <div className="feature-icon">
                    <img src={f.icon} alt={f.title} />
                  </div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default Features;
