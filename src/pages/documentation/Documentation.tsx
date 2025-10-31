import AppLayout from "../../components/layout/AppLayout";

const Documentation = () => (
  <AppLayout>
    <iframe
      src="/pages/doc_professional_v1.html"
      title="Documentation"
      style={{
        width: "100%",
        height: "calc(100vh - 140px)",
        border: "none",
      }}
    />
  </AppLayout>
);

export default Documentation;
