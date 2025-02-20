import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY; // Store in .env.local

export async function POST() {
  try {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const prompt = "Suggest some engaging anonymous messages for conversations. Provide them as a plain-text list, separated by `||`.";
    const result = await model.generateContent(prompt);

    // Extract response text
    let responseText = result.response.text();

    // Remove unwanted formatting (e.g., Markdown `**`, `*`, `_`)
    responseText = responseText.replace(/\*\*/g, "").replace(/\*/g, "").replace(/_/g, "");

    // Return the response as plain text
    return new Response(responseText, {
      status: 200,
      headers: { "Content-Type": "text/plain" },
    });
  } catch (error) {
    console.error("Error generating message:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
