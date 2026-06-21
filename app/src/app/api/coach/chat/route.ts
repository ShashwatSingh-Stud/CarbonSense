import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

const SYSTEM_PROMPT = `You are the CarbonSense AI Carbon Coach — a friendly, knowledgeable sustainability advisor.
You help Indian users understand and reduce their personal carbon footprint.

Guidelines:
- Use India-specific context: Indian food (dal, biryani, thali), transport (auto-rickshaw, metro, BRTS), energy (LPG, state grid factors)
- Be encouraging, not guilt-tripping. Celebrate small wins
- Give specific, actionable advice ranked by impact and ease
- Use numbers: "switching from car to metro saves 0.14 kg CO₂ per km"
- Use emojis sparingly for warmth 🌱
- Keep responses concise (under 200 words) unless asked for a detailed plan
- Reference the user's actual data when available
- Suggest alternatives, not just restrictions
- Use bold (**text**) for key points`;

export async function POST(request: NextRequest) {
  try {
    const { message, context, history } = await request.json();

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    // Build conversation history
    const chatHistory = (history || []).map((msg: { role: string; content: string }) => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    const chat = model.startChat({
      history: [
        {
          role: 'user',
          parts: [{ text: `System instructions: ${SYSTEM_PROMPT}\n\nUser context: ${context}` }],
        },
        {
          role: 'model',
          parts: [{ text: "I understand! I'm the CarbonSense AI Carbon Coach. I'll provide personalized, India-specific carbon reduction advice based on the user's data. Let me help them reduce their footprint! 🌱" }],
        },
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(message);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { error: 'Failed to get AI response', response: null },
      { status: 500 }
    );
  }
}
