import React from "react";
import DynamicCard from "./DynamicCard";
import ChartWidget from "src/pages/Dashboard/components/ChartWidget";
import { ICardData } from "src/types/cards"; // reuse same type as DynamicCard

// 🔹 Define props interface
interface CardFactoryProps {
  variant?: "metric" | "chart";
  data: ICardData;
}

// ✅ Component with explicit prop types
const CardFactory: React.FC<CardFactoryProps> = ({ variant = "metric", data }) => {
  switch (variant) {
    case "chart":
      return <ChartWidget inputData={data} />;
    default:
      return <DynamicCard inputData={data} />;
  }
};

export default CardFactory;
