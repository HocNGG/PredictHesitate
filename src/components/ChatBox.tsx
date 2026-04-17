import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

// interface Message {
//   id: string;
//   text: string;
//   sender: 'user' | 'bot';
//   timestamp: string;
// }

interface Message{
  id: string;
  text: string;
  sender: "bot" | "user";
  timestamp: string;
}
const initialMessages: Message[] = Array.from({ length: 20 }, (_, i) => ({
  id: `msg-${i}`,
  text: i % 2 === 0 ? `Hello! This is a bot message ${i + 1}.` : `Hi there! I'm the user. This is message ${i + 1}.`,
  sender: i % 2 === 0 ? 'bot' : 'user',
  timestamp: new Date(Date.now() - (20 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
}));

export const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [isOpen, messages]);

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputValue('');

    // TODO: replace with API call
    // await sendMessageToServer(inputValue);
    // const botResponse = await fetchMessages();
    
    // Simulating bot response for demonstration
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm a bot! I received your message.",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      {/* Chat Box */}
      <div 
        className={`bg-background border rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? 'w-[320px] h-[400px] opacity-100 scale-100 mb-4' : 'w-[0px] h-[0px] opacity-0 scale-50 m-0'
        }`}
      >
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shrink-0">
          <h3 className="font-semibold">Support Chat</h3>
          <button 
            onClick={() => setIsOpen(false)}
            className="hover:bg-primary/90 rounded-full p-1 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((msg) => (
            <div 
              key={msg.id} 
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div 
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  msg.sender === 'user' 
                    ? 'bg-primary text-primary-foreground rounded-br-sm' 
                    : 'bg-muted border text-foreground rounded-bl-sm'
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 mx-1">
                {msg.timestamp}
              </span>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Footer */}
        <div className="p-3 bg-background border-t shrink-0 flex items-center gap-2">
          <input 
            type="text"
            className="flex-1 bg-muted/50 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-black"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button 
            onClick={handleSend}
            disabled={!inputValue.trim()}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground p-2 rounded-full transition-colors flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};
