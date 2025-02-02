import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(req) {
  try {
    // Fetch latest notifications from Supabase
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false }) 
      .limit(10);

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}


// export async function PATCH(req) {
//     try {
//       const { id } = await req.json();
//       if (!id) return NextResponse.json({ success: false, error: "Notification ID is required" }, { status: 400 });
  
//       const { error } = await supabase
//         .from("notifications")
//         .update({ is_read: true })
//         .eq("id", id);
  
//       if (error) throw error;
//       return NextResponse.json({ success: true, message: "Marked as read" });
//     } catch (error) {
//       return NextResponse.json({ success: false, error: error.message }, { status: 500 });
//     }
//   }