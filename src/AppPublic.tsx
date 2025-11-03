import { Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Features from "./pages/features/Features";
import UseCases from "./pages/use-cases/UseCases";
import Pricing from "./pages/pricing/Pricing";
import Documentation from "./pages/documentation/Documentation";

function AppPublic() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/features" element={<Features />} />
      <Route path="/use-cases" element={<UseCases />} />
      <Route path="/pricing" element={<Pricing />} />
      <Route path="/documentation" element={<Documentation />} />
    </Routes>
  );
}

export default AppPublic;
