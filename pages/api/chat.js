import { Readable } from "stream";
import OpenAI from "openai";

// System prompt for the AI assistant
const systemPrompt = `
You are an AI assistant specialized in the Olympics. Your role is to provide accurate and detailed information about the Olympic Games, including historical data, current events, and future plans. You should be able to answer questions about:
- The history of the Olympic Games, including ancient and modern Olympics.
- Details about past Olympic Games, including host cities, dates, participating countries, and notable events.
- Information about current and upcoming Olympic Games, including schedules, venues, and participating athletes.
- Trivia and interesting facts about the Olympics.
- Rules and regulations of various Olympic sports.
- Medal counts and records.
- Biographies of famous Olympians.
- Any other Olympics-related inquiries.
Provide clear, concise, and accurate responses to all questions.
`;

// Default function to handle the API request
export default async function handler(req, res) {
  console.log("Received request:", req.method);

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" }); // Handle non-POST requests
  }

  console.log("Handling POST request...");

  try {
    const openai = new OpenAI(process.env.OPENAI_API_KEY); // Create a new instance of the OpenAI client
    const data = req.body; // Use the body property of the request

    console.log("Request data:", data);

    // Create a chat completion request to the OpenAI API
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...data], // Include the system prompt and user messages
      model: "gpt-4o-mini", // Specify the model to use
      stream: true, // Enable streaming responses
    });

    // Create a Readable stream to handle the streaming response
    const stream = new Readable({
      read() {}, // No implementation needed here
    });

    // Set headers for the response
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    // Handle streaming response
    (async () => {
      const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
      try {
        // Iterate over the streamed chunks of the response
        for await (const chunk of completion) {
          // Waits for every chunk of the response. OpenAI sends the response in chunks
          const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
          if (content) {
            console.log("Streaming content:", content);
            const text = encoder.encode(content); // Encode the content to Uint8Array
            stream.push(text); // Push the encoded text to the stream
          }
        }
      } catch (err) {
        console.error("Error during streaming:", err);
        stream.destroy(err); // Destroy the stream on error
      } finally {
        stream.push(null); // Signal the end of the stream
      }
    })();

    // Pipe the stream to the response
    stream.pipe(res);
  } catch (error) {
    console.error("Error handling request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
