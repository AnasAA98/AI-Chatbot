import { Readable } from "stream";
import OpenAI from "openai";

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


export default async function handler(req, res) {
    console.log('Received request:', req.method);

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    console.log('Handling POST request...');

    try {
        const openai = new OpenAI(process.env.OPENAI_API_KEY);
        const data = req.body; 

        console.log('Request data:', data);

        // Create a chat completion request to the OpenAI API
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }, ...data.map(msg => ({ ...msg, role: msg.role === 'bot' ? 'assistant' : msg.role }))], // Map 'bot' to 'assistant'
            model: 'gpt-4o-mini',
            stream: true,
        });

        const stream = new Readable({
            read() { }
        });

        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');

        (async () => {
            const encoder = new TextEncoder();
            try {
                for await (const chunk of completion) { 
                    const content = chunk.choices[0]?.delta?.content;
                    if (content) {
                        console.log('Streaming content:', content);
                        const text = encoder.encode(content); 
                        stream.push(text); 
                    }
                }
            } catch (err) {
                console.error('Error during streaming:', err);
                stream.destroy(err); 
            } finally {
                stream.push(null); 
            }
        })();
        stream.pipe(res);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
