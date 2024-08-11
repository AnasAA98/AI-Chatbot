# AI Chatbot

## Overview

## Features

- **Next.js**: Fast and scalable React framework with server-side rendering.
- **OpenAI**: Integration with OpenAI's API for advanced AI capabilities.
- **Material UI**: Beautiful and customizable UI components.
- **Responsive Design**: Features a modern and responsive design that adjusts to various devices and screen sizes.

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn

### Installation

Follow these steps to set up the AI Chatbot on your local machine:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/AnasAA98/AI-Chatbot
    cd AI-Chatbot
    ```

2. **Install dependencies**:
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Set up environment variables**:
    Create a `.env.local` file in the root of your project and add your OpenAI API key:
    ```bash
    NEXT_PUBLIC_OPENAI_API_KEY=your-openai-api-key
    ```

### Running the Project

1. **Development mode**:
    ```bash
    npm run dev
    # or
    yarn dev
    ```
    Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

2. **Production build**:
    ```bash
    npm run build
    npm start
    # or
    yarn build
    yarn start
    ```

## Enhancements

This version of the AI Chatbot introduces several significant enhancements aimed at improving both the user interface and functionality:

### UI Enhancements

- **Modern Font Integration**: Integrated 'Poppins' font family to enhance readability and give the chatbot a modern aesthetic appeal.
- **Advanced Send Button Styling**:
  - Updated the send button with animated effects that include a glow on hover, providing visual feedback and enhancing user engagement.
  - Introduced a subtle pressing animation effect to simulate a tactile response during user interactions.
- **Custom Scrollbar Design**:
  - Customized the scrollbar to be thinner and less obtrusive, blending seamlessly with the overall design theme.
  - Added a dynamic color gradient to the scrollbar thumb, enriching the visual experience.
- **Typing Indicator Improvements**:
  - Replaced the traditional text indicator with a sophisticated animated loader, offering a dynamic visual cue during AI processing.
- **Responsive Design Adjustments**: Enhanced responsiveness across various devices, ensuring the interface scales effectively and maintains usability on different screen sizes.
- **Enhanced Message Bubbles**:
  - Redesigned message bubbles with rounded corners and shadow effects for better differentiation between user and assistant messages.
  - Applied a distinct color scheme to improve readability and ease of following conversation threads.

### Functional Enhancements

- **Optimized Message Handling**:
  - Implemented enhancements to prevent message duplication, ensuring that each message is unique and the conversation flow is smooth.
  - Updated state management to handle real-time interactions more effectively, reducing the chances of any lag or errors during conversations.

- **Streamlined Server Communication**:
  - Improved the efficiency of server communication protocols to ensure quicker response times and more reliable data handling.

- **Enhanced Error Handling**:
  - Developed a more robust error-handling framework to identify, log, and address potential issues during chat interactions, thus improving the overall reliability of the chatbot.

These enhancements collectively enhance the functionality and appearance of the AI Chatbot, making it more intuitive, responsive, and engaging for users. The aim is to provide a seamless and enjoyable experience that leverages advanced AI capabilities to deliver accurate and helpful information about the Olympics.


## Code Explanation

### API Interaction

Handles POST requests to fetch AI-generated responses using OpenAI's API. Includes robust error handling and improved data streaming to ensure efficient real-time interactions.

### Chat Interface

Manages state and UI interactions in `page.js`, utilizing a modern React hook-based approach. Enhancements include a loader animation for the typing indicator and improved visual elements.

## Conclusion

This AI Chatbot serves as a powerful tool for accessing a wealth of information about the Olympics, showcasing how cutting-edge AI can enhance user experience in informational applications.


## Code Explanation
How to setup an OPEN AI API call:

1. Importing Dependencies

``` Javascript
import { Readable } from 'stream'; // Import Readable from 'stream' module for handling Node.js streams
import OpenAI from 'openai'; // Import OpenAI library for interacting with the OpenAI API
```
# Explanation:

-Readable: A class from Node.js's stream module that allows us to create a readable stream, which we use to handle the streaming response from the OpenAI API.

-OpenAI: A library that provides methods to interact with the OpenAI API. This is used to create a chat completion request.


2. Setting Up the System Prompt

``` Javascript
const systemPrompt = `...`;
```

- systemPrompt: A string containing guidelines for the AI assistant. This prompt helps the AI understand its role and the context in which it should respond to user queries.


3. Handling the API Request

``` Javascript
export default async function handler(req, res) {
    console.log('Received request:', req.method);

    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method Not Allowed' }); // Handle non-POST requests
    }

    console.log('Handling POST request...');
```
- handler function: This is the main function that processes incoming requests to the /api/chat endpoint.
- Logging: Logs the HTTP method of the received request for debugging purposes.
- Method Check: Checks if the request method is POST. If it is not, the function responds with a 405 (Method Not Allowed) status code and a JSON message. (POST method is used to send data to the server to create or update a resource)

4. Creating the OpenAI Client and Parsing the Request Body

```javascript
    try {
        const openai = new OpenAI(process.env.OPENAI_API_KEY); // Create a new instance of the OpenAI client
        const data = req.body; // Use the body property of the request

        console.log('Request data:', data);
```
- Try-Catch Block: Wraps the code in a try-catch block to handle any potential errors.
- OpenAI Client Initialization: Initializes a new instance of the OpenAI client using the API key stored in the environment variable OPENAI_API_KEY.
- Request Body Parsing: Extracts the JSON body from the incoming request, which contains the user messages.
- Logging: Logs the extracted request data for debugging purposes.

5. Creating the Chat Completion Request
```javascript
        // Create a chat completion request to the OpenAI API
        const completion = await openai.chat.completions.create({
            messages: [{ role: 'system', content: systemPrompt }, ...data], // Include the system prompt and user messages
            model: 'gpt-4o-mini', // Specify the model to use
            stream: true, // Enable streaming responses
        });
```

- Completion Request: Sends a request to the OpenAI API to generate a chat completion.
- Parameters:
	- messages: An array that includes the system prompt followed by the user's messages. This array sets the context and provides the input for the AI.
	- model: Specifies the model to be used (in this case, gpt-4o-mini).
	-stream: Enabling streaming responses allows the function to process the response in chunks as they arrive.

6. Handling the Streaming Response
``` javascript
        // Create a Readable stream to handle the streaming response
        const stream = new Readable({
            read() { } // No implementation needed here
        });

        // Set headers for the response
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
```
- Readable Stream Creation:
	- const stream = new Readable({ read() {} }); : Creates a new readable stream. The read method is required but not implemented because data will be pushed to the stream manually.
- Response Headers:
	- res.setHeader('Content-Type', 'text/event-stream');: Sets the content type to text/event-stream, indicating that the response will be a stream of events.
	- res.setHeader('Cache-Control', 'no-cache');: Ensures that the response is not cached.
	- res.setHeader('Connection', 'keep-alive');: Keeps the connection open for streaming.

7. Processing and Streaming the Response

``` javascript
        // Handle streaming response
        (async () => {
            const encoder = new TextEncoder(); // Create a TextEncoder to convert strings to Uint8Array
            try {
                // Iterate over the streamed chunks of the response
                for await (const chunk of completion) { // Waits for every chunk of the response. OpenAI sends the response in chunks
                    const content = chunk.choices[0]?.delta?.content; // Extract the content from the chunk
                    if (content) {
                        console.log('Streaming content:', content);
                        const text = encoder.encode(content); // Encode the content to Uint8Array
                        stream.push(text); // Push the encoded text to the stream
                    }
                }
            } catch (err) {
                console.error('Error during streaming:', err);
                stream.destroy(err); // Destroy the stream on error
            } finally {
                stream.push(null); // Signal the end of the stream
            }
        })();
```

- Anonymous Async Function: An anonymous asynchronous function is immediately invoked to handle the streaming response.
- TextEncoder:
	- const encoder = new TextEncoder(); : Creates a TextEncoder instance to convert strings to Uint8Array.
- For-Await Loop:
	- for await (const chunk of completion) { ... } : This loop iterates over each chunk of the streamed response from the OpenAI API. The response is received in multiple parts (chunks) because streaming is enabled.
- Content Extraction:
	- const content = chunk.choices[0]?.delta?.content; : Extracts the content from each chunk. The delta object contains the part of the response generated by the AI.
- Content Encoding:
	- const text = encoder.encode(content); : Encodes the content to Uint8Array format.
- Push to Stream:
	- stream.push(text); : Pushes the encoded content to the readable stream, which will eventually be sent to the client.
-Error Handling: 
	- If an error occurs during the streaming process, it is logged, and the stream is destroyed.
- End of Stream:
	- stream.push(null); : Signals the end of the stream by pushing null.

8. Sending the Response
```javascript
        // Pipe the stream to the response
        stream.pipe(res);
    } catch (error) {
        console.error('Error handling request:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
}
```

- Pipe to Response:
	-stream.pipe(res); : Pipes the readable stream to the HTTP response, sending the streamed data to the client as it is received and processed. 
- Error Handling:
	- If any error occurs outside the streaming process, it is caught and logged, and a 500 (Internal Server Error) response is sent to the client.

## Summary of the Process
1 Client Sends Request: The client sends a POST request to the /api/chat endpoint with user messages.

2 API Route Handling: The Next.js API route (handler function) processes the request.

3 OpenAI Client Initialization: The OpenAI client is initialized with the API key.

4 Request Parsing: The request body is parsed to get the user's messages.

5 Completion Request: A request is made to the OpenAI API to generate a response, with streaming enabled.

6 Stream Setup: A readable stream is created, and the response headers are set.

7 Streaming Response Handling: The response from the OpenAI API is processed in chunks. Each chunk is encoded and pushed to the readable stream.

8 Sending the Response: The readable stream is piped to the HTTP response, sending the streamed data to the client.

