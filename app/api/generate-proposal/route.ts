import { NextResponse } from "next/server";
import { z } from "zod";
import { serverDb } from "@/lib/serverDb";

// Validation schema for the incoming proposal
const proposalSchema = z.object({
  clientName: z.string().min(1),
  budget: z.number().min(0),
  aiResult: z.object({
    recommendedProducts: z.array(
      z.object({
        product: z.string().min(1),
        quantity: z.number().min(1),
        cost: z.number().min(0),
      })
    ),
    totalCost: z.number().min(0),
    budgetRemaining: z.number().min(0),
    impactSummary: z.string().min(1),
  }),
  log: z.object({
    prompt: z.string(),
    rawResponse: z.string(),
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = proposalSchema.parse(body);

    // 1. Save AI Log
    serverDb.aiLogs.add({
      module: "proposal-generator",
      prompt: validatedData.log.prompt,
      response: validatedData.log.rawResponse,
    });

    // 2. Save Proposal
    const newProposal = serverDb.proposals.add({
      clientName: validatedData.clientName,
      budget: validatedData.budget,
      ...validatedData.aiResult,
    });

    return NextResponse.json({ success: true, proposal: newProposal });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ success: false, errors: error.issues }, { status: 400 });
    }
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
