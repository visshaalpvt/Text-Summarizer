export async function POST(request: Request) {
  try {
    const { text } = await request.json();

    if (!text || text.trim().length === 0) {
      return Response.json({ error: "No text provided" }, { status: 400 });
    }

    // Call your FastAPI backend instead of OpenAI
    const response = await fetch("http://127.0.0.1:8000/summarize", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text }),
    });

    const data = await response.json();

    // Return the FastAPI summary to the frontend
    if (data.summary) {
      return Response.json({ summary: data.summary });
    } else {
      return Response.json({ error: "Failed to summarize" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error calling FastAPI summarizer:", error);
    return Response.json({ error: "Backend connection failed" }, { status: 500 });
  }
}
