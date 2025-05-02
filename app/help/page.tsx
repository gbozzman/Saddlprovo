"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send } from "lucide-react"
import { useRouter } from "next/navigation"

export default function HelpPage() {
  const router = useRouter()
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState([{ id: 1, text: "Hello! How can I assist you today?", sender: "system" }])
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const handleSend = () => {
    if (input.trim() === "") return

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate response after a short delay
    setTimeout(() => {
      const systemMessage = {
        id: Date.now() + 1,
        text: "Thank you for your question. Our team will get back to you shortly.",
        sender: "system",
      }
      setMessages((prev) => [...prev, systemMessage])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-screen bg-[#183531]">
      <div className="bg-[#DDAD69] p-4 text-white flex items-center">
        <button onClick={() => router.back()} className="mr-4 hover:text-[#183531] transition-colors">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold">Help Center</h1>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="flex flex-col space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-3 rounded-lg max-w-[80%] ${
                message.sender === "user" ? "bg-[#DDAD69] text-white self-end" : "bg-white/10 text-white self-start"
              }`}
            >
              {message.text}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-[#122724] border-t border-[#DDAD69]/20">
        <div className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            className="flex-1 p-3 border border-[#DDAD69]/30 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-[#DDAD69] bg-white/10 text-white"
            placeholder="Type your message..."
          />
          <button
            onClick={handleSend}
            className="bg-[#DDAD69] text-white p-3 rounded-r-lg hover:bg-[#B78E3C] transition-colors"
            aria-label="Send message"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  )
}
