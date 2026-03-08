import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { code, language } = await req.json();
    if (!code) {
      return new Response(JSON.stringify({ error: "No code provided" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are a friendly, patient coding tutor explaining code to a student. Write in a warm, conversational tone — like a teacher sitting next to the student, pointing at lines and saying "Here's what's happening..." or "Think of it this way...".

Given code in a specified language, return ONLY valid JSON (no markdown, no code fences) with this exact structure:
{
  "explanation": "A friendly 2-3 sentence overview of what this code does, written like you're talking to the student. For example: 'This code sorts a list of numbers using the bubble sort algorithm. It works by repeatedly comparing neighbors and swapping them if they are out of order. Let me walk you through how it works step by step.'",
  "steps": [
    {
      "step": 1,
      "title": "Short friendly title",
      "lines": [1, 2],
      "description": "A calm, clear explanation of what happens here. Use phrases like 'First, we...' or 'Now the code checks if...' or 'Think of this as...' Keep it simple and avoid jargon where possible.",
      "variables": { "varName": "value or description" },
      "category": "initialization|condition|loop|function|output|return"
    }
  ],
  "flowchart": "graph TD\\n    A[Start] --> B[Step]\\n    B --> C[End]",
  "complexity": {
    "timeComplexity": "O(n)",
    "spaceComplexity": "O(1)",
    "explanation": "A simple explanation of why, e.g. 'Since we go through the list once, it takes time proportional to the number of items.'",
    "suggestions": ["Friendly suggestion 1", "Helpful tip 2"]
  }
}

Rules for steps:
- Break code into logical execution steps (3-10 steps typically)
- Write descriptions in a conversational, educational tone — like a tutor explaining to a beginner
- Use "we" language: "First, we create a variable..." not "A variable is created..."
- Avoid overly technical jargon; if you must use a term like "iterate", briefly explain it
- "lines" is an array of 1-indexed line numbers this step covers
- "variables" shows variable state changes at that step (can be empty {})
- "category" must be one of: initialization, condition, loop, function, output, return
- For loops, show the loop entry as one step and iterations as concept

Rules for flowchart:
- Use valid Mermaid.js "graph TD" syntax ONLY
- The flowchart field must be a single string with \\n for newlines
- Node IDs: single uppercase letters A, B, C, D etc
- Rectangles: A[Label text here]
- Diamonds for conditions: C{Is x greater than 5}
- Rounded for start/end: A([Start])  Z([End])
- Arrows: --> for connections, -->|Yes| and -->|No| for labeled edges
- NEVER use parentheses () inside square brackets []
- NEVER use quotes inside node labels
- NEVER use special characters like colons semicolons or backticks in labels
- Keep labels short, max 6 words per node
- Keep it clean: 5-12 nodes maximum
- Example: "graph TD\\n    A([Start]) --> B[Initialize variables]\\n    B --> C{Check condition}\\n    C -->|Yes| D[Execute body]\\n    D --> C\\n    C -->|No| E([End])"

Rules for complexity:
- timeComplexity and spaceComplexity should use Big-O notation
- explanation should be 1-2 friendly sentences explaining the reasoning in simple terms
- suggestions should be 1-3 actionable tips written as helpful advice`
          },
          {
            role: "user",
            content: `Analyze this ${language} code and return the JSON structure:\n\n${code}`
          },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI usage limit reached. Please add credits." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const rawContent = data.choices?.[0]?.message?.content || "";
    
    let parsed;
    try {
      const cleaned = rawContent.replace(/```json\s*/g, "").replace(/```\s*/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        explanation: rawContent,
        steps: [],
        flowchart: "graph TD\n    A([Start]) --> B([End])",
        complexity: null,
      };
    }

    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("explain-code error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
