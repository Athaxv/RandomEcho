import { openai } from '@ai-sdk/openai';
import { streamText } from 'ai';
import { NextResponse } from 'next/server';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

  const result = streamText({
    model: openai('gpt-4o'),
    messages,
  });

  return result.toDataStreamResponse();
  } catch (error) {
    if (error instanceof Error && error.message.includes("OpenAI")) {
      // Handling specific OpenAI-related errors (You can adjust this condition based on your needs)
      const { name, message, stack } = error;
      console.error(`OpenAI Error: ${message}`);
      
      return NextResponse.json({
        name,
        message,
        stack,
      }, { status: 500 });
    } else {
      console.error("An unexpected error occured", error);  
      throw error;
    }
  }
}