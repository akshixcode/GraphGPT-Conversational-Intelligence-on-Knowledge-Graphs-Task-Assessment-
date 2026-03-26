import React, { useState } from 'react';
import { Send, Minimize2 } from 'lucide-react';
import type { ChatMessage } from '../types/graph';
import { proptQuery } from '../services/api';

type Props = {
  setHighlighted: (ids: string[]) => void;
};

const ChatBox: React.FC<Props> = ({ setHighlighted }) => {
  const [input, setInput] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'ai', content: 'Hi! I can help you analyze the Order to Cash process.' }
  ]);

  const handleSendChat = async () => {
    if (input.trim() === '') return;

    setLoading(true);
    setMessages(prev => [...prev, { role: 'user', content: input }]);

    try {
      const res = await proptQuery(input);
      setMessages(prev => [
        ...prev,
        { role: 'ai', content: res.answer }
      ]);
      setHighlighted(res.highlightNodes || []);

    } catch (error) {
      console.error('Error sending chat:', error);
    }

    setInput('');
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full bg-white/90 backdrop-blur-xl border border-gray-200 shadow-2xl rounded-2xl overflow-hidden">
      
      {/* HEADER */}
      <div className="p-5 border-b flex justify-between items-center bg-gray-50/50">
        <div>
          <h3 className="font-extrabold text-gray-900 text-sm">Chat with Graph</h3>
          <p className="text-[9px] text-gray-400 font-bold uppercase">Order to Cash</p>
        </div>
        <button className="text-gray-400 hover:text-gray-600">
          <Minimize2 size={16} />
        </button>
      </div>

      {/* CHAT */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div
              className={`max-w-[80%] p-3 rounded-xl text-sm ${
                msg.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div className="text-xs text-gray-400 animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="p-5 border-t">
        <div className="relative">
          <input
            className="w-full bg-gray-50 border rounded-xl py-3 px-4 pr-12 text-sm focus:outline-none"
            placeholder="Ask about orders, invoices..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSendChat();
              }
            }}
          />
          <button
            onClick={handleSendChat}
            disabled={loading}
            className="absolute right-2 top-2 text-blue-600"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;