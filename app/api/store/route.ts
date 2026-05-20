// ============================================================
// app/api/store/route.ts — BFF (Backend for Frontend)
// الـ Frontend بيكلم هنا، وهنا بس اللي بيعرف الـ API_SECRET
// ============================================================

import { NextRequest, NextResponse } from "next/server";

const APPS_SCRIPT_URL = process.env.APPS_SCRIPT_URL!;
const API_SECRET      = process.env.API_SECRET;

// الـ actions اللي محتاجة api_secret
const PRIVATE_ACTIONS = new Set([
  "createOrder",
  "cancelOrder",
  "updateOrderStatus",
  "getOrder",
  "upsertCustomer",
  "archiveOldData",
  "recalculateCounters",
]);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action } = body;

    if (!action) {
      return NextResponse.json({ success: false, error: "action required" }, { status: 400 });
    }

    // أضف الـ api_secret للـ private actions تلقائياً
    const payload = { ...body };
    if (PRIVATE_ACTIONS.has(action)) {
      if (!API_SECRET) {
        return NextResponse.json(
          { success: false, error: "Server not configured" },
          { status: 500 }
        );
      }
      payload.api_secret = API_SECRET;
    }

    const response = await fetch(APPS_SCRIPT_URL, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(payload),
    });

    const data = await response.json();
    return NextResponse.json(data);

  } catch (err) {
    console.error("[BFF] Error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
