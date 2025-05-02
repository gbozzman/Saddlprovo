"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"

type Message = {
  id: number
  text: string
  sender: "user" | "bot"
}

export default function AIChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (input.trim()) {
      const newMessage: Message = { id: Date.now(), text: input, sender: "user" }
      setMessages([...messages, newMessage])
      setInput("")
      setTimeout(() => {
        const botResponse: Message = {
          id: Date.now(),
          text: "I'm an AI assistant. How can I help you with horse racing?",
          sender: "bot",
        }
        setMessages((prev) => [...prev, botResponse])
      }, 1000)
    }
  }

  return (
    <div className="flex flex-col h-screen bg-secondary p-4">
      <h1 className="text-2xl font-bold text-primary mb-4">AI Chatbot</h1>
      <div className="flex-1 overflow-y-auto mb-4 bg-white rounded-lg p-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`mb-2 p-2 rounded-lg ${
              message.sender === "user" ? "bg-primary text-white self-end" : "bg-gray-200 text-black self-start"
            }`}
          >
            {message.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 rounded-l-lg border-2 border-primary focus:outline-none"
          placeholder="Type your message..."
        />
        <button type="submit" className="bg-primary text-white p-2 rounded-r-lg" aria-label="Send message">
          <Send size={24} />
        </button>
      </form>
    </div>
  )
}
