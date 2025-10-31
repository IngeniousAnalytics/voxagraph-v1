// src/App.tsx
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/home/Home";
import Login from "./pages/Login";
import Features from "./pages/features/Features";
import UseCases from "./pages/use-cases/UseCases";
import Pricing from "./pages/pricing/Pricing";
import Documentation from "./pages/documentation/Documentation";

function App() {
  const handleConnect = () => console.log("connect");
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login handleConnect={handleConnect} />} />
        <Route path="/features" element={<Features />} />
        <Route path="/use-cases" element={<UseCases />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/documentation" element={<Documentation />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

