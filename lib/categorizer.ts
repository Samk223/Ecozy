import { getAIClient } from "./aiClient";
import { Type } from "@google/genai";

export interface ProductInput {
  name: string;
  description: string;
  material: string;
  price: number;
  weight: number;
}

export interface CategorizationResult {
  category: string;
  subCategory: string;
  seoTags: string[];
  sustainabilityFilters: string[];
}

export const generateProductCategorization = async (
  product: ProductInput
): Promise<{ result: CategorizationResult; prompt: string; rawResponse: string }> => {
  const ai = getAIClient();

  const prompt = `
You are an expert in sustainable e-commerce. Categorize the following product and generate SEO tags and sustainability filters.

Product Name: ${product.name}
Description: ${product.description}
Material: ${product.material}
Price: $${product.price}
Weight: ${product.weight}g

Assign a primary category from a predefined list (e.g., Packaging, Office Supplies, Food Containers, Hygiene Products, Apparel, Home Goods).
Suggest a sub-category.
Generate 5-10 SEO tags.
Suggest sustainability filters (e.g., plastic-free, compostable, recyclable, vegan, biodegradable, recycled-material).
  `.trim();

  const response = await ai.models.generateContent({
    model: "gemini-3.1-pro-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          category: { type: Type.STRING, description: "Primary category" },
          subCategory: { type: Type.STRING, description: "Sub-category" },
          seoTags: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "5-10 SEO tags",
          },
          sustainabilityFilters: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "Sustainability filters",
          },
        },
        required: ["category", "subCategory", "seoTags", "sustainabilityFilters"],
      },
    },
  });

  const rawResponse = response.text || "{}";
  const result = JSON.parse(rawResponse) as CategorizationResult;

  return { result, prompt, rawResponse };
};
