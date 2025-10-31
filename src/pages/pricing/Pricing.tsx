import AppLayout from "../../components/layout/AppLayout";

const Pricing = () => (
  <AppLayout>
    <iframe
      src="/pages/pricing.html"
      title="Pricing"
      style={{
        width: "100%",
        height: "calc(100vh - 140px)",
        border: "none",
      }}
    />
  </AppLayout>
);

export default Pricing;
