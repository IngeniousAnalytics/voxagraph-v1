import React from "react";
import AppLayout from "../../components/layout/AppLayout";
import "./doc.css";

const Documentation: React.FC = () => {
  return (
    <AppLayout>
      <main className="documentation-page">
        {/* Hero Section */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1>Technical Documentation</h1>
              <p>
                Empowering CEOs, Directors, Finance Heads, and Management to
                access analytics without IT dependency
              </p>
              <div className="breadcrumb">
                <a href="/">Home</a>
                <span>/</span>
                <span>Documentation</span>
              </div>
            </div>
          </div>
        </section>

        {/* Documentation Body */}
        <section className="documentation">
          <div className="container">
            <div className="doc-content">
              <h2>Executive Summary</h2>
              <p className="lead-text">
                Powered by advanced Natural Language Processing (NLP), our
                platform revolutionizes how C-suite executives, directors,
                finance heads, and management teams access critical business
                analytics. By eliminating dependency on IT departments, we
                enable leadership to obtain required data for analytics
                independently, design custom dashboards with graphics, grids,
                and cards, and monitor key metrics regularly—all through simple
                conversational interfaces.
              </p>

              <div className="info-box">
                <p>
                  <strong>Our Vision:</strong> Transform how executives interact
                  with data. CEOs, CFOs, Directors, and Management can now ask
                  questions in natural language and receive instant analytics
                  through customizable graphics, grids, and interactive
                  cards—without waiting for IT support or learning complex
                  database query languages.
                </p>
              </div>

              <h2>System Architecture</h2>
              <p>
                Our platform employs a sophisticated multi-agent architecture
                built on LangGraph, orchestrating specialized AI agents that
                collaborate to transform natural language queries into accurate,
                validated database operations.
              </p>

              <h3>Core Agent Framework</h3>
              <p>
                The system consists of five specialized agents, each optimized
                for specific aspects of the query-to-insight pipeline:
              </p>

              <div className="agents-grid">
                <div className="agent-card">
                  <h4>
                    <span className="agent-icon">🧠</span>Intent Classification Agent
                  </h4>
                  <p>
                    Analyzes user queries to determine intent and required data
                    sources. Routes requests to appropriate downstream agents.
                  </p>
                </div>
                <div className="agent-card">
                  <h4>
                    <span className="agent-icon">⚙️</span>Query Generation Agent
                  </h4>
                  <p>
                    Transforms natural language into optimized SQL queries.
                    Leverages schema understanding to ensure accuracy.
                  </p>
                </div>
                <div className="agent-card">
                  <h4>
                    <span className="agent-icon">✓</span>Validation Agent
                  </h4>
                  <p>
                    Ensures query correctness before execution. Validates syntax
                    and semantic accuracy through automated verification.
                  </p>
                </div>
                <div className="agent-card">
                  <h4>
                    <span className="agent-icon">▶️</span>Execution Agent
                  </h4>
                  <p>
                    Manages secure query execution with human-in-the-loop
                    oversight, providing execution previews and error handling.
                  </p>
                </div>
                <div className="agent-card">
                  <h4>
                    <span className="agent-icon">📊</span>Visualization Agent
                  </h4>
                  <p>
                    Converts query results into actionable insights through
                    intelligent visualization with interactive charts.
                  </p>
                </div>
              </div>

              <h2>Key Capabilities</h2>
              <p>
                Our platform serves C-suite executives and management teams who
                need immediate, independent access to data insights without IT
                barriers.
              </p>

              <ul>
                <li>
                  <strong>Zero IT Dependency:</strong> Query data using natural
                  language—no SQL or technical knowledge required.
                </li>
                <li>
                  <strong>Custom Dashboard Design:</strong> Create dashboards
                  with charts, cards, and grids tailored to your KPIs.
                </li>
                <li>
                  <strong>Real-Time Monitoring:</strong> Track business metrics
                  in real time with visual dashboards.
                </li>
                <li>
                  <strong>Executive-Friendly Interface:</strong> Ask questions
                  like “Show Q4 revenue by region” and get instant insights.
                </li>
              </ul>

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

              <div className="conclusion">
                <h4>Core Value for Executive Leadership</h4>
                <div className="core-advantages">
                  <div className="advantage-item">
                    <span className="advantage-icon">💬</span>
                    <div>
                      <strong>NLP-Powered Queries:</strong> Executives ask in
                      plain English—no SQL or IT dependency.
                    </div>
                  </div>
                  <div className="advantage-item">
                    <span className="advantage-icon">✅</span>
                    <div>
                      <strong>Automated Validation:</strong> Multi-layer checks
                      ensure accurate analytics for decision-making.
                    </div>
                  </div>
                  <div className="advantage-item">
                    <span className="advantage-icon">📊</span>
                    <div>
                      <strong>Custom Dashboards:</strong> Design personalized
                      dashboards for ongoing performance monitoring.
                    </div>
                  </div>
                  <div className="advantage-item">
                    <span className="advantage-icon">🔄</span>
                    <div>
                      <strong>Zero IT Dependency:</strong> Access data directly,
                      instantly, securely.
                    </div>
                  </div>
                  <div className="advantage-item">
                    <span className="advantage-icon">🎯</span>
                    <div>
                      <strong>Executive Dashboard Control:</strong> Build
                      dashboards around critical KPIs.
                    </div>
                  </div>
                  <div className="advantage-item">
                    <span className="advantage-icon">💰</span>
                    <div>
                      <strong>Cost Transparency:</strong> Real-time cost
                      tracking for analytics resource usage.
                    </div>
                  </div>
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
