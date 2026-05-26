export type Question = {
  question: string;
  type: "multi" | "bool";
  answers: Array<{
    text: string;
    value: boolean;
  }>;
};
