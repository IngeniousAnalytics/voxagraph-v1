import React, { useState } from "react";
import AppLayout from "../../components/layout/AppLayout";
import "./contact.css";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    country: "",
    remarks: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.email.trim()) newErrors.email = "Email is required.";
    if (!formData.country.trim()) newErrors.country = "Country is required.";
    if (formData.remarks.trim().split(" ").length < 20)
      newErrors.remarks = "Remarks must be at least 20 words.";
    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSubmitted(true);
    // TODO: send data to your backend or email service
    console.log("Form submitted:", formData);
  };

  return (
    <AppLayout>
      <main className="contact-page">
        {/* Hero Section */}
        <section className="contact-hero">
          <div className="container">
            <h1>Contact Us</h1>
            <p>
              We’d love to hear from you. Whether you’re a potential partner,
              customer, or just curious about Voxagraph, feel free to reach out.
            </p>
          </div>
        </section>

        {/* Offices Section */}
        <section className="office-section">
          <div className="container offices-grid">
            <div className="office-card">
              <h3>Head Office (India)</h3>
              <p>Ingenious Analytics</p>
              <p>Chandigarh, India</p>
              <p>
                <a href="mailto:info@ingeniousanalytics.com">
                  info@ingeniousanalytics.com
                </a>
              </p>
              <p>Business Hours: Mon–Sat, 9:30–18:30 IST</p>
            </div>

            <div className="office-card">
              <h3>United States</h3>
              <p>
                <a href="mailto:us@ingeniousanalytics.com">
                  us@ingeniousanalytics.com
                </a>
              </p>
            </div>

            <div className="office-card">
              <h3>Australia</h3>
              <p>
                <a href="mailto:australia@ingeniousanalytics.com">
                  australia@ingeniousanalytics.com
                </a>
              </p>
            </div>

            <div className="office-card">
              <h3>Canada</h3>
              <p>
                <a href="mailto:canada@ingeniousanalytics.com">
                  canada@ingeniousanalytics.com
                </a>
              </p>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="form-section">
          <div className="container">
            <h2>Get in Touch</h2>
            {!submitted ? (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your full name"
                    />
                  </div>

                  <div className="form-group required">
                    <label>Email <span>*</span></label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      required
                    />
                    {errors.email && <small className="error">{errors.email}</small>}
                  </div>

                  <div className="form-group">
                    <label>Phone</label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 9876543210"
                    />
                  </div>

                  <div className="form-group required">
                    <label>Country <span>*</span></label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      placeholder="Your country"
                      required
                    />
                    {errors.country && (
                      <small className="error">{errors.country}</small>
                    )}
                  </div>

                  <div className="form-group full-width">
                    <label>Remarks (minimum 20 words)</label>
                    <textarea
                      name="remarks"
                      rows={6}
                      value={formData.remarks}
                      onChange={handleChange}
                      placeholder="Tell us about your requirements or project..."
                    />
                    {errors.remarks && (
                      <small className="error">{errors.remarks}</small>
                    )}
                  </div>
                </div>

                <button type="submit" className="btn btn-primary">
                  Submit Message
                </button>
              </form>
            ) : (
              <div className="thank-you-box">
                <h3>Thank you for contacting us! 🎉</h3>
                <p>
                  We’ve received your message and will reach out to you soon.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </AppLayout>
  );
};

export default Contact;
