import { supabase } from '../../../lib/supabase';

const handleSupabaseError = (error) => {
  console.error(error); 
  return new Response(JSON.stringify({ message: 'Something went wrong' }), { status: 500 });
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    // Fetch all records that match the search term (without pagination)
    let query = supabase
      .from("carData")
      .select("*", { count: "exact" });

    // If there's a search query, filter based on expense_name
    if (search.trim()) {
      query = query.ilike("expense_name", `%${search.trim()}%`);
    }

    const { data, error, count } = await query;

    // Handle any errors during the query
    if (error) {
      console.error("Supabase query error:", error);
      throw error;
    }

    // Apply pagination to the fetched results (in-memory pagination)
    const start = (page - 1) * limit;
    const paginatedData = data.slice(start, start + limit);  // Slice data based on page and limit
    const totalResults = count;  // Total results after search filtering

    // Return paginated search results with the total count
    return new Response(
      JSON.stringify({
        data: paginatedData,
        total: totalResults,
        page,
        limit,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in GET request:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}




export async function POST(req) {
  try {
    
    const entry = await req.json();

  
    const { data, error } = await supabase.from("carData").insert(entry).select();

    if (error) throw error;

  
    const logData = {
      action: 'INSERT',
      table_name: 'carData',
      created_at: new Date().toISOString(),
    };
    await supabase.from("logs").insert([logData]);

    const notificationData = {
      action: 'CREATE',
      message: `New entry created: ${data[0].expense_name}`,
      created_at: new Date().toISOString(),
    };
    await supabase.from("notifications").insert([notificationData]);

    return new Response(JSON.stringify({ data: data[0] }), { status: 200 });
  } catch (error) {
    console.error("Error in POST operation:", error);
    return new Response(JSON.stringify({ message: "Failed to create entry" }), { status: 500 });
  }
}