
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY") || "";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Edge function for OpenAI chat integration
 * 
 * REQUEST FORMAT:
 * {
 *   "message": string,     // The text message from the user
 *   "image"?: string       // Optional: URL to an image from Supabase Storage
 *                          // Format: https://[project-ref].supabase.co/storage/v1/object/public/temp_chat_images/[user-id]/[uuid]-[filename]
 * }
 * 
 * If an image URL is included, it should be processed along with the message.
 * The image URL is a temporary public URL that will be deleted after processing.
 * 
 * RESPONSE FORMAT:
 * - When successful: Streaming events with OpenAI's response
 * - When error: JSON object with error message
 */
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, image } = await req.json();

    if (!message) {
      throw new Error("No message provided");
    }

    console.log("Calling OpenAI with message:", message);
    if (image) {
      console.log("Image URL included:", image);
      // If you're passing the image to OpenAI, you would need to modify this section
      // to include the image in the API call. Currently, the code only logs the image URL.
    }
    
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: message }],
        stream: true,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error("OpenAI API error:", response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status} ${errorData}`);
    }

    if (!response.body) {
      throw new Error("No response body received");
    }

    // Return the streaming response directly
    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (error) {
    console.error("Error in OpenAI streaming:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
