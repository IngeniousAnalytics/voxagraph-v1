// src/types/cards.ts (recommended)
export interface ICardDesign {
  color?: string;
  fontSize?: number;
  fontStyle?: "normal" | "italic";
  fontWeight?: "normal" | "bold";
  icon?: string;
  background?: string;
}

export interface ICardData {
  questions: string;
  title: string;
  sql_query: string;
  data: Array<Record<string, string | number>>;
  plot: string;
  design?: ICardDesign;
}
