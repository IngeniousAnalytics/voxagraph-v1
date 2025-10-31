import AppLayout from "../../components/layout/AppLayout";


const Features = () => (
  <AppLayout>
    <div className="static-page-container">
      <iframe
        src={`/pages/features.html`}
        title="Features"
        style={{
          width: "100%",
          height: "calc(100vh - 140px)",
          border: "none",
          overflow: "auto",
        }}
      />
    </div>
  </AppLayout>
);

export default Features;
