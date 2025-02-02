import { supabase } from '../../../../lib/supabase';
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("search") || ""; // Default to an empty string if no search term

    // Query the Supabase table and filter by search query
    let query = supabase
      .from("carData")
      .select("*");

    if (searchQuery.trim()) {
      query = query.ilike("expense_name", `%${searchQuery.trim()}%`); // Adjust based on your column name
    }

    const { data, error } = await query;

    if (error) {
      throw error;
    }

    // Return the filtered data as JSON
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}
