import UpdateRentTrasact from "@/action/rent_transact/updaterenttransact";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  await UpdateRentTrasact({});
  return NextResponse.json({});
}
