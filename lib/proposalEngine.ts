import { getAIClient } from "./aiClient";
import { Type } from "@google/genai";

export interface ProposalInput {
  clientName: string;
  budget: number;
  categoryPreference?: string;
}

export interface Product {
  id?: string;
  name: string;
  price: number;
  category: string;
  sustainabilityFilters: string[];
}

export interface ProposalResult {
  recommendedProducts: {
    product: string;
    quantity: number;
    cost: number;
    environmentalRationale: string;
  }[];
  totalCost: number;
  budgetRemaining: number;
  impactSummary: string;
}

export const generateB2BProposal = async (
  input: ProposalInput,
  availableProducts: Product[]
): Promise<{ result: ProposalResult; prompt: string; rawResponse: string }> => {
  const ai = getAIClient();

  const prompt = `
You are a B2B sales expert for a sustainable commerce platform.
Generate a proposal for a business buying sustainable products in bulk.

Client Name: ${input.clientName}
Budget: $${input.budget}
Category Preference: ${input.categoryPreference || "None"}

Available Products in Catalog:
${JSON.stringify(availableProducts, null, 2)}

Instructions:
1. Select a recommended sustainable product mix from the available products.
2. Allocate the budget across products (do not exceed the budget).
3. Provide an estimated cost breakdown (quantity * price).
4. For EACH recommended product, generate a concise but detailed 'environmentalRationale' (1-2 sentences) explaining why THIS SPECIFIC product is a better sustainable choice (e.g., material benefits, carbon reduction, longevity).
5. Generate an impact positioning summary explaining how this overall proposal helps the environment.
  `.trim();

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          recommendedProducts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                product: { type: Type.STRING, description: "Product name" },
                quantity: { type: Type.NUMBER, description: "Quantity recommended" },
                cost: { type: Type.NUMBER, description: "Total cost for this product" },
                environmentalRationale: { type: Type.STRING, description: "Detailed environmental benefit for this specific product" },
              },
              required: ["product", "quantity", "cost", "environmentalRationale"],
            },
            description: "Recommended products",
          },
          totalCost: { type: Type.NUMBER, description: "Total cost of the proposal" },
          budgetRemaining: { type: Type.NUMBER, description: "Remaining budget" },
          impactSummary: { type: Type.STRING, description: "Impact positioning summary" },
        },
        required: ["recommendedProducts", "totalCost", "budgetRemaining", "impactSummary"],
      },
    },
  });

  const rawResponse = response.text || "{}";
  const result = JSON.parse(rawResponse) as ProposalResult;

  return { result, prompt, rawResponse };
};
