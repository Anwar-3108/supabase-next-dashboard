import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase"; // Adjust path if necessary

export async function PATCH(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return new Response(
        JSON.stringify({ message: "ID parameter is required" }),
        { status: 400 }
      );
    }

    const updatedData = await req.json();

    if (!updatedData || Object.keys(updatedData).length === 0) {
      return new Response(
        JSON.stringify({ message: "No data provided to update" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("carData")
      .update(updatedData)
      .eq("id", id)
      .select();

    if (error) throw error;

    const logData = {
      action: "UPDATE",
      table_name: "carData",
      created_at: new Date().toISOString(),
    };
    await supabase.from("logs").insert([logData]);

    const notificationData = {
      action: "UPDATE",
      table_name: "carData",
      message: `Entry updated: ${data[0].expense_name}`,
      created_at: new Date().toISOString(),
    };
    await supabase.from("notifications").insert([notificationData]);

    return new Response(
      JSON.stringify({ message: "Data updated successfully", data }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in PATCH operation:", error);
    return new Response(JSON.stringify({ message: "Failed to update entry" }), {
      status: 500,
    });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { id } = params;

    if (!id)
      return new Response(JSON.stringify({ error: "Missing ID" }), {
        status: 400,
      });

    const { error } = await supabase.from("carData").delete().eq("id", id);

    if (error) throw error;

    const logData = {
      action: "DELETE",

      table_name: "carData",
      created_at: new Date().toISOString(),
    };
    await supabase.from("logs").insert([logData]);

    const notificationData = {
      action: "DELETE",
      table_name: "carData",
      message: `Entry with ID: ${id} was deleted.`,
      created_at: new Date().toISOString(),
    };
    await supabase.from("notifications").insert([notificationData]);

    return new Response(
      JSON.stringify({ message: "Entry deleted successfully" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE operation:", error);
    return new Response(JSON.stringify({ error: "Failed to delete entry" }), {
      status: 500,
    });
  }
}
