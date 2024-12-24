"use client";

import { useChat } from "ai/react";
import { Input } from "@/components/ui/input"; // Assuming you have a custom Input component
import { Button } from "@/components/ui/button"; // Assuming you have a custom Button component
import { useEffect } from "react";

export default function Page() {
  const { messages, input, setInput, append } = useChat();

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInput(event.target.value);
  };

  const handleKeyDown = async (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && input.trim()) {
      append({ content: input, role: 'user' });
      setInput(''); // Clear input after sending
    }
  };

  return (
    <div className="flex flex-col p-4 space-y-4">
      <div className="flex-1 overflow-y-auto">
        {messages.map((message, index) => (
          <div key={index} className={`p-2 rounded ${message.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            {message.content}
          </div>
        ))}
      </div>
      <div className="flex">
        <Input
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          className="flex-1 mr-2"
        />
        <Button onClick={() => { if (input.trim()) append({ content: input, role: 'user' }); setInput(''); }}>
          Send
        </Button>
      </div>
    </div>
  );
}