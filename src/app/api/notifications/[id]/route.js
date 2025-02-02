import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    if (!id)
      return NextResponse.json(
        { success: false, error: "Notification ID is required" },
        { status: 400 }
      );

    console.log(id);

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .eq("id", id);

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Marked as read" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
