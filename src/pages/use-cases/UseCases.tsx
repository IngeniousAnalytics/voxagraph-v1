import AppLayout from "../../components/layout/AppLayout";

const UseCases = () => (
  <AppLayout>
    <iframe
      src="/pages/use-cases.html"
      title="Use Cases"
      style={{
        width: "100%",
        height: "calc(100vh - 140px)",
        border: "none",
      }}
    />
  </AppLayout>
);

export default UseCases;
