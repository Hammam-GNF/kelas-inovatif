"use client";

import { useChat } from "ai/react";
import { Input } from "@/components/ui/input";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="flex flex-col w-full max-w-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div className="font-bold">{m.role}</div>
            <p>{m.content}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="fixed bottom-0 w-full max-w-md mb-8"
      >
        <Input
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
          className="border border-gray-300 rounded shadow-xl"
        />
      </form>
    </div>
  );
}
