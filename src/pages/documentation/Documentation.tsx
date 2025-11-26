import React from "react";
import AppLayout from "../../components/layout/AppLayout";
import { Book, Brain, Settings, CheckCircle, Play, BarChart, ArrowRight, Sparkles } from "lucide-react";
import "./doc.css";

const Documentation: React.FC = () => {
  const agents = [
    {
      icon: Brain,
      title: "Intent Classification Agent",
      desc: "Analyzes user queries to determine intent and required data sources. Routes requests to appropriate downstream agents.",
      color: "#667eea",
    },
    {
      icon: Settings,
      title: "Query Generation Agent",
      desc: "Transforms natural language into optimized SQL queries. Leverages schema understanding to ensure accuracy.",
      color: "#764ba2",
    },
    {
      icon: CheckCircle,
      title: "Validation Agent",
      desc: "Ensures query correctness before execution. Validates syntax and semantic accuracy through automated verification.",
      color: "#10b981",
    },
    {
      icon: Play,
      title: "Execution Agent",
      desc: "Manages secure query execution with human-in-the-loop oversight, providing execution previews and error handling.",
      color: "#f093fb",
    },
    {
      icon: BarChart,
      title: "Visualization Agent",
      desc: "Converts query results into actionable insights through intelligent visualization with interactive charts.",
      color: "#4facfe",
    },
  ];

  const capabilities = [
    {
      title: "Zero IT Dependency",
      desc: "Query data using natural language—no SQL or technical knowledge required.",
    },
    {
      title: "Custom Dashboard Design",
      desc: "Create dashboards with charts, cards, and grids tailored to your KPIs.",
    },
    {
      title: "Real-Time Monitoring",
      desc: "Track business metrics in real time with visual dashboards.",
    },
    {
      title: "Executive-Friendly Interface",
      desc: "Ask questions like 'Show Q4 revenue by region' and get instant insights.",
    },
  ];

  const advantages = [
    {
      icon: Sparkles,
      title: "NLP-Powered Queries",
      desc: "Executives ask in plain English—no SQL or IT dependency.",
    },
    {
      icon: CheckCircle,
      title: "Automated Validation",
      desc: "Multi-layer checks ensure accurate analytics for decision-making.",
    },
    {
      icon: BarChart,
      title: "Custom Dashboards",
      desc: "Design personalized dashboards for ongoing performance monitoring.",
    },
    {
      icon: Settings,
      title: "Zero IT Dependency",
      desc: "Access data directly, instantly, securely.",
    },
    {
      icon: Brain,
      title: "Executive Dashboard Control",
      desc: "Build dashboards around critical KPIs.",
    },
    {
      icon: Play,
      title: "Cost Transparency",
      desc: "Real-time cost tracking for analytics resource usage.",
    },
  ];

  return (
    <AppLayout>
      <main className="documentation-page">
        {/* Hero Section */}
        <section className="doc-hero">
          <div className="hero-background">
            <div className="hero-gradient"></div>
          </div>
          <div className="container">
            <div className="hero-content">
              <div className="hero-badge">
                <Book size={16} />
                <span>Technical Documentation</span>
              </div>
              <h1>AI Dashboard <span className="gradient-text">Technical Documentation</span></h1>
              <p>
                Empowering CEOs, Directors, Finance Heads, and Management to access analytics
                without IT dependency through advanced Natural Language Processing.
              </p>
            </div>
          </div>
        </section>

        {/* Documentation Content */}
        <section className="documentation">
          <div className="container">
            <div className="doc-content">
              {/* Executive Summary */}
              <div className="doc-section">
                <h2>Executive Summary</h2>
                <p className="lead-text">
                  Powered by advanced Natural Language Processing (NLP), our platform revolutionizes how C-suite executives,
                  directors, finance heads, and management teams access critical business analytics. By eliminating dependency
                  on IT departments, we enable leadership to obtain required data for analytics independently, design custom
                  dashboards with graphics, grids, and cards, and monitor key metrics regularly—all through simple
                  conversational interfaces.
                </p>
                <div className="info-box">
                  <p>
                    <strong>Our Vision:</strong> Transform how executives interact with data. CEOs, CFOs, Directors, and
                    Management can now ask questions in natural language and receive instant analytics through customizable
                    graphics, grids, and interactive cards—without waiting for IT support or learning complex database query
                    languages.
                  </p>
                </div>
              </div>

              {/* System Architecture */}
              <div className="doc-section">
                <h2>System Architecture</h2>
                <p>
                  Our platform employs a sophisticated multi-agent architecture built on LangGraph, orchestrating specialized
                  AI agents that collaborate to transform natural language queries into accurate, validated database operations.
                </p>

                <h3>Core Agent Framework</h3>
                <p>
                  The system consists of five specialized agents, each optimized for specific aspects of the query-to-insight pipeline:
                </p>

                <div className="agents-grid">
                  {agents.map((agent, i) => {
                    const IconComponent = agent.icon;
                    return (
                      <div key={i} className="agent-card">
                        <div className="agent-icon" style={{ background: `${agent.color}15` }}>
                          <IconComponent size={32} style={{ color: agent.color }} />
                        </div>
                        <h4>{agent.title}</h4>
                        <p>{agent.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Key Capabilities */}
              <div className="doc-section">
                <h2>Key Capabilities</h2>
                <p>
                  Our platform serves C-suite executives and management teams who need immediate, independent access to data
                  insights without IT barriers.
                </p>

                <div className="capabilities-grid">
                  {capabilities.map((cap, i) => (
                    <div key={i} className="capability-card">
                      <div className="capability-number">{i + 1}</div>
                      <h4>{cap.title}</h4>
                      <p>{cap.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Experience Metrics */}
              <div className="doc-section">
                <h3>User Experience Metrics</h3>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <div className="metric-value">89%</div>
                    <div className="metric-label">Disambiguation Success</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">0.76</div>
                    <div className="metric-label">F1 Score</div>
                  </div>
                  <div className="metric-card">
                    <div className="metric-value">40s–2m</div>
                    <div className="metric-label">Average Response Time</div>
                  </div>
                </div>
              </div>

              {/* Core Advantages */}
              <div className="doc-section">
                <h3>Core Value for Executive Leadership</h3>
                <div className="advantages-grid">
                  {advantages.map((adv, i) => {
                    const IconComponent = adv.icon;
                    return (
                      <div key={i} className="advantage-item">
                        <div className="advantage-icon">
                          <IconComponent size={24} />
                        </div>
                        <div>
                          <strong>{adv.title}</strong>
                          <p>{adv.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default Documentation;
