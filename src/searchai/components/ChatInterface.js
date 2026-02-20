import * as React from 'react';
import { Send, Sparkles, MessageSquare, Mic, MicOff, X } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { ResearchCard } from './ResearchCard';

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export const ChatInterface = ({ displayMode = 'inline', initialQuery = '' }) => {
    const isWidget = displayMode === 'widget';
    const [isOpen, setIsOpen] = React.useState(!isWidget);
    const [input, setInput] = React.useState('');
    const [messages, setMessages] = React.useState(() => {
        const saved = sessionStorage.getItem('searchai_history');
        if (saved) {
            try {
                return JSON.parse(saved);
            } catch (e) {
                console.error('Failed to parse chat history', e);
            }
        }
        return [
            {
                id: '1',
                role: 'assistant',
                content: "Welcome to Coresight Research. I'm Corey, your research partner. I have access to our latest reports on retail, e-commerce, and consumer trends. How can I assist your research today?",
            },
        ];
    });

    React.useEffect(() => {
        sessionStorage.setItem('searchai_history', JSON.stringify(messages));
    }, [messages]);
    const [isTyping, setIsTyping] = React.useState(false);
    const [hasAutoSent, setHasAutoSent] = React.useState(false);
    // Read the backend URL injected by WordPress via wp_localize_script in searchai.php
    const apiBaseUrl = (window.searchaiSettings && window.searchaiSettings.apiBaseUrl) || 'https://coresight-chat-backend.vercel.app';
    const messagesEndRef = React.useRef(null);
    const [isRecording, setIsRecording] = React.useState(false);
    const recognitionRef = React.useRef(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }, [messages, isTyping]);

    // Initialize Recognition
    React.useEffect(() => {
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false; // Stop after one sentence
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInput(transcript); // Put the voice text into the input field
                setIsRecording(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error("Speech recognition error", event.error);
                setIsRecording(false);
            };
        }
    }, []);

    const toggleRecording = () => {
        if (isRecording) {
            recognitionRef.current?.stop();
            setIsRecording(false);
        } else {
            setInput(''); // Clear input for new voice note
            recognitionRef.current?.start();
            setIsRecording(true);
        }
    };

    const handleSend = async (overrideMessage) => {
        const messageText = overrideMessage || input;
        if (!messageText.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            role: 'user',
            content: messageText,
        };

        setMessages((prev) => [...prev, userMsg]);
        if (!overrideMessage) setInput('');
        setIsTyping(true);

        try {
            // Prepare history for Gemini (excluding the system instructions which are handled server-side)
            const history = messages.map((m) => ({
                role: m.role === 'assistant' ? 'model' : 'user',
                parts: [{ text: m.content }],
            }));

            const res = await fetch(`${apiBaseUrl}/search/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: userMsg.content,
                    history: history
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.details || `Request failed: ${res.status}`);
            }

            const data = await res.json();

            // Map AI response and any structured article data returned
            const aiMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: data.response ?? 'I apologize, but I encountered an issue processing that request.',
                // If backend returns a list of articles separately, they appear here
                researchResults: data.articles || []
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: `**Connection Error:** I couldn't reach the research library. Please ensure the server is running or try again later. \n\n*Technical details: ${err.message}*`,
            };
            setMessages((prev) => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    // Auto-send initial query from search page URL
    React.useEffect(() => {
        if (initialQuery && !hasAutoSent) {
            setHasAutoSent(true);
            handleSend(initialQuery);
        }
    }, [initialQuery, hasAutoSent]);

    return (
        <>
            {/* Widget Toggle Button */}
            {isWidget && !isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="fixed bottom-6 right-6 h-14 w-14 bg-red-600 rounded-full text-white shadow-lg flex items-center justify-center hover:bg-red-700 transition-all z-[9999]"
                >
                    <MessageSquare size={24} />
                </button>
            )}

            <div className={`
                flex flex-col bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100
                ${isWidget
                    ? `fixed bottom-24 right-6 z-[9999] w-[90vw] sm:w-[400px] md:w-[520px] h-[550px] max-h-[75vh] shadow-2xl transition-all duration-300 origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`
                    : 'max-w-5xl mx-auto w-full h-[calc(100vh-140px)]'
                }
            `}>
                {/* Top Branding Bar */}
                <div className="bg-red-600 h-1.5 w-full" />

                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-white">
                    <div className="flex items-center gap-2">
                        <div className="bg-red-50 p-1.5 rounded-lg">
                            <MessageSquare size={18} className="text-red-600" />
                        </div>
                        <span className="font-bold text-gray-800 tracking-tight">Corey <span className="text-gray-400 font-normal ml-1">| AI Partner</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                        <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">Live Research Library</span>
                        {isWidget && (
                            <button onClick={() => setIsOpen(false)} className="ml-2 text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8 bg-gray-50/30">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-in fade-in duration-300`}
                        >
                            <div className={`max-w-[85%] ${msg.role === 'user' ? 'bg-gray-900 text-white' : 'bg-white border border-gray-200'} rounded-2xl p-5 shadow-sm`}>
                                <div className="flex gap-4">
                                    {msg.role === 'assistant' && (
                                        <div className="h-9 w-9 min-w-9 rounded-xl bg-red-600 flex items-center justify-center text-white shadow-md shadow-red-200">
                                            <Sparkles size={18} />
                                        </div>
                                    )}
                                    <div className={`prose prose-sm max-w-none ${msg.role === 'user' ? 'prose-invert' : 'text-gray-700'}`}>
                                        <ReactMarkdown
                                            components={{
                                                a: ({ node, ...props }) => <a {...props} className="text-red-600 font-semibold underline underline-offset-4 hover:text-red-800 transition-colors" target="_blank" rel="noopener noreferrer" />
                                            }}
                                        >
                                            {msg.content}
                                        </ReactMarkdown>
                                    </div>
                                </div>

                                {/* Display Research Cards if articles were found */}
                                {msg.researchResults && msg.researchResults.length > 0 && (
                                    <div className="mt-6 border-t border-gray-100 pt-5">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Cited Resources</p>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {msg.researchResults.map((result, idx) => (
                                                <ResearchCard key={idx} {...result} />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    {isTyping && (
                        <div className="flex justify-start">
                            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm flex items-center gap-1.5">
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-1.5 h-1.5 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-5 bg-white border-t border-gray-100">
                    <div className="relative flex items-center gap-3 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-red-500 focus-within:bg-white transition-all shadow-sm p-1">

                        {/* Voice Toggle Button */}
                        <button
                            onClick={toggleRecording}
                            className={`pl-3 transition-colors ${isRecording ? 'text-red-600' : 'text-gray-400 hover:text-red-500'}`}
                        >
                            {isRecording ? <MicOff size={22} className="animate-pulse" /> : <Mic size={22} />}
                        </button>

                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isRecording ? "Listening..." : "What insights are you looking for?"}
                            className="flex-1 bg-transparent border-none py-4 px-2 text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-0"
                        />

                        <button
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            className="mr-1 p-3 rounded-xl bg-red-600 text-white hover:bg-red-700 disabled:bg-gray-200 transition-all shadow-sm active:scale-95"
                        >
                            <Send size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};
