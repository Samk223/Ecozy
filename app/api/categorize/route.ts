import { NextResponse } from "next/server";
import { z } from "zod";
import { serverDb } from "@/lib/serverDb";

// Validation schema for the incoming categorized product
const categorizeSchema = z.object({
  product: z.object({
    name: z.string().min(1),
    description: z.string().min(1),
    material: z.string().min(1),
    price: z.number().min(0),
    weight: z.number().min(0),
  }),
  aiResult: z.object({
    category: z.string().min(1),
    subCategory: z.string().min(1),
    seoTags: z.array(z.string()),
    sustainabilityFilters: z.array(z.string()),
  }),
  log: z.object({
    prompt: z.string(),
    rawResponse: z.string(),
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = categorizeSchema.parse(body);

    // 1. Save AI Log
    serverDb.aiLogs.add({
      module: "categorization",
      prompt: validatedData.log.prompt,
      response: validatedData.log.rawResponse,
    });

    // 2. Save Product
    const newProduct = serverDb.products.add({
      ...validatedData.product,
      ...validatedData.aiResult,
    });

    return NextResponse.json({ success: true, product: newProduct });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
