import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const bookingId = String(Math.floor(100000 + Math.random() * 900000));

  const { error } = await supabase.from("bookings").insert({
    booking_id: bookingId,
    full_name: body.fullName,
    date_of_birth: body.dateOfBirth,
    partner_name: body.partnerName || null,
    phone: body.phone,
    problem_description: body.problemDescription,
    payment_amount: Number(body.paymentAmount),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ bookingId });
}
