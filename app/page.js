'use client'

import { useState } from 'react';

export default function Home() {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([
        { role: 'assistant', content: 'Hi, I am your Olympic assistant. You can ask me any question. How can i help you?' }]);    
    const [isLoading, setIsLoading] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (input.trim() === '') return;

        const newMessage = { role: 'user', content: input };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setIsLoading(true);
        setIsTyping(true);

        const res = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([newMessage]),
        });

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let fullResponse = '';

        try {
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                fullResponse += decoder.decode(value, { stream: true });
            }
            setMessages(prevMessages => [...prevMessages.slice(0, -1), { role: 'user', content: input }, { role: 'assistant', content: fullResponse }]);
        } catch (error) {
            console.error('Error reading response:', error);
        } finally {
            setIsLoading(false);
            setIsTyping(false);
        }
    };

    return (
        <>
            <style>
                {`
                ::-webkit-scrollbar {
                    width: 6px;
                    background-color: transparent;
                }
                ::-webkit-scrollbar-thumb {
                    border-radius: 10px;
                    background-color: #007BFF;
                    border: 1px solid #2b2b59;
                }
                ::-webkit-scrollbar-thumb:hover {
                    background-color: #0056b3;
                }
                .send-button {
                    padding: 12px 20px;
                    background-color: #007BFF;
                    color: #fff;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    font-size: 16px;
                    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.3s ease;
                    box-shadow: 0 2px 10px rgba(0, 123, 255, 0.4);
                }
                .send-button:hover {
                    background-color: #0056b3;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 15px rgba(0, 123, 255, 0.6);
                }
                `}
            </style>
            <div style={{
                fontFamily: "'Roboto', sans-serif",
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#1a1a3d',
                padding: '20px',
                boxSizing: 'border-box'
            }}>
                <h1 style={{
                    color: '#ffffff',
                    fontSize: '26px',
                    marginBottom: '20px',
                    textAlign: 'center'
                }}>OlympiaBot</h1>
                <div style={{
                    height: '70%',
                    width: '100%',
                    maxWidth: '600px',
                    overflowY: 'scroll',
                    backgroundColor: '#2b2b59',
                    borderRadius: '8px',
                    padding: '15px',
                    boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    {messages.map((msg, index) => (
                        <div key={index} style={{
                            display: 'flex',
                            justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                        }}>
                            <span style={{
                                display: 'inline-block',
                                padding: '10px',
                                borderRadius: '8px',
                                backgroundColor: msg.role === 'user' ? '#007BFF' : '#7678a8',
                                color: '#ffffff',
                                maxWidth: '80%',
                                textAlign: msg.role === 'user' ? 'right' : 'left',
                            }}>
                                {msg.content}
                            </span>
                        </div>
                    ))}
                    {isTyping && (
                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-start',
                            padding: '10px'
                        }}>
                            <div className="loader"></div>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit} style={{
                    marginTop: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    maxWidth: '600px'
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Ask something about the Olympics"
                        disabled={isLoading}
                        style={{
                            flexGrow: 1,
                            padding: '12px 15px',
                            borderRadius: '8px',
                            backgroundColor: '#2b2b59',
                            color: '#ffffff',
                            border: 'none',
                            outline: 'none',
                            marginRight: '10px',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                        }}
                    />
                    <button type="submit" disabled={isLoading} className="send-button">
                        Send
                    </button>
                </form>
            </div>
        </>
    );
}
