import { NextResponse } from "next/server";
import { fetchLiveCoinPrices } from "@/lib/cryptoPrices";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const coins = await fetchLiveCoinPrices();
    return NextResponse.json({ coins, updatedAt: Date.now() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch prices";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
