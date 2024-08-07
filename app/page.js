'use client'

import { useState } from 'react';

export default function Home() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (input.trim() === '') return;

        const newMessage = { role: 'user', content: input };
        const updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setInput('');
        setIsLoading(true);

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedMessages),
        });

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let result = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            result += decoder.decode(value, { stream: true });
            setMessages((prev) => [
                ...prev.slice(0, -1),
                { ...prev[prev.length - 1], content: result },
            ]);
        }

        setIsLoading(false);
    };

    return (
        <div>
            <h1>AI Chatbot</h1>
            <div style={{ height: '300px', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
                {messages.map((msg, index) => (
                    <div key={index}>
                        <strong>{msg.role}:</strong> {msg.content}
                    </div>
                ))}
                {isLoading && <div><strong>bot:</strong> Typing...</div>}
            </div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask something about the Olympics"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>Send</button>
            </form>
        </div>
    );
}
