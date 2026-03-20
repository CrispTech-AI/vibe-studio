import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth header
    const token = authHeader?.replace("Bearer ", "");
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { prompt, genre, type, projectId } = await req.json();

    let systemPrompt = "";
    let userPrompt = "";

    if (type === "lyrics") {
      systemPrompt = `You are a professional songwriter and lyricist. Generate creative, original song lyrics. 
Format with section headers like [Verse 1], [Chorus], [Bridge], etc. 
Be creative, evocative, and match the requested genre and mood. No restrictions on content themes.`;
      userPrompt = `Write song lyrics in the ${genre || "pop"} genre based on this description: ${prompt}`;
    } else if (type === "music_description") {
      systemPrompt = `You are a music production expert. Given a description, generate a detailed music production brief 
including tempo (BPM), key, instruments, mood, structure, and production notes. Be specific and technical.`;
      userPrompt = `Create a detailed music production brief for a ${genre || "pop"} track: ${prompt}`;
    } else if (type === "background") {
      systemPrompt = `You are a visual artist and motion graphics designer. Generate a detailed visual description 
for a music video background animation. Include colors, movements, transitions, and mood. Be cinematic and vivid.`;
      userPrompt = `Describe a background animation for a music video: ${prompt}`;
    } else {
      systemPrompt = `You are a creative music and visual AI assistant for a music video production studio. 
Help the user with their creative vision. Be detailed and inspiring.`;
      userPrompt = prompt;
    }

    const response = await fetch("https://ai.gateway.synergylabs.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${CRISPTECH_AIE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits depleted. Please add credits in Settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await response.text();
      console.error("AI gateway error:", response.status, t);
      throw new Error("AI generation failed");
    }

    const aiData = await response.json();
    const content = aiData.choices?.[0]?.message?.content || "";

    // Save to generated_tracks if projectId provided
    if (projectId) {
      await supabase.from("generated_tracks").insert({
        project_id: projectId,
        user_id: user.id,
        prompt,
        genre,
        ai_response: content,
        lyrics_suggestion: type === "lyrics" ? content : null,
        status: "completed",
      });
    }

    return new Response(JSON.stringify({ content, type }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("generate-music error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
