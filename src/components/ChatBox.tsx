import React, { useEffect, useRef, useState } from "react"
import { MessageCircle, RotateCcw, Send, X } from "lucide-react"
import { sendChatMessage } from "@/api/chat"

interface Message {
  id: string
  text: string
  sender: "bot" | "user"
  timestamp: string
}

function now() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    text: "Chào bạn! Hãy nhập thông tin nhà đất (ví dụ: nhà riêng 80m2 quận 7), rồi gõ 'ok' để dự đoán.",
    sender: "bot",
    timestamp: now(),
  },
]

export const ChatBox: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (isOpen) scrollToBottom()
  }, [isOpen, messages])

  const pushUserMessage = (text: string) => {
    const msg: Message = { id: `${Date.now()}-u`, text, sender: "user", timestamp: now() }
    setMessages((prev) => [...prev, msg])
  }

  const pushBotMessage = (text: string) => {
    const msg: Message = { id: `${Date.now()}-b`, text, sender: "bot", timestamp: now() }
    setMessages((prev) => [...prev, msg])
  }

  const handleSend = async (overrideMessage?: string) => {
    const message = (overrideMessage ?? inputValue).trim()
    if (!message || isSending) return
    pushUserMessage(message)
    setInputValue("")
    setIsSending(true)

    try {
      const res = await sendChatMessage({ session_id: sessionId, message })
      setSessionId(res.session_id)
      pushBotMessage(res.reply)

      if (res.is_prediction && res.prediction) {
        pushBotMessage(
          `Kết quả: ${res.prediction.price_per_m2.toFixed(2)} triệu/m² | Tổng: ${res.prediction.total_price.toFixed(2)} triệu VND`
        )
      }
    } catch (err) {
      pushBotMessage(err instanceof Error ? `Lỗi: ${err.message}` : "Lỗi gọi API chat.")
    } finally {
      setIsSending(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSend()
  }

  const handleResetSession = async () => {
    await handleSend("reset")
  }

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      <div
        className={`bg-background border rounded-2xl shadow-xl flex flex-col overflow-hidden transition-all duration-300 origin-bottom-right ${
          isOpen ? "w-[360px] h-[470px] opacity-100 scale-100 mb-4" : "w-[0px] h-[0px] opacity-0 scale-50 m-0"
        }`}
      >
        <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center shrink-0">
          <div>
            <h3 className="font-semibold">Chatbot Predict</h3>
            <p className="text-[10px] opacity-90">{sessionId ? `session: ${sessionId.slice(0, 8)}...` : "session mới"}</p>
          </div>
          <button onClick={() => setIsOpen(false)} className="hover:bg-primary/90 rounded-full p-1 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="px-3 py-2 border-b bg-muted/20 flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleSend("ok")}
            disabled={isSending}
            className="text-xs rounded-md border px-2 py-1 hover:bg-muted disabled:opacity-50"
          >
            Gửi "ok"
          </button>
          <button
            onClick={handleResetSession}
            disabled={isSending}
            className="text-xs rounded-md border px-2 py-1 hover:bg-muted disabled:opacity-50 inline-flex items-center gap-1"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/30">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}>
              <div
                className={`max-w-[82%] rounded-2xl px-4 py-2 ${
                  msg.sender === "user"
                    ? "bg-primary text-primary-foreground rounded-br-sm"
                    : "bg-muted border text-foreground rounded-bl-sm"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 mx-1">{msg.timestamp}</span>
            </div>
          ))}
          {isSending ? (
            <div className="flex flex-col items-start">
              <div className="max-w-[82%] rounded-2xl rounded-bl-sm bg-muted border text-foreground px-4 py-2">
                <div className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-pulse" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-pulse [animation-delay:120ms]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/70 animate-pulse [animation-delay:240ms]" />
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 mx-1">đang trả lời...</span>
            </div>
          ) : null}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 bg-background border-t shrink-0 flex items-center gap-2">
          <input
            type="text"
            className="flex-1 bg-muted/50 border-none rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-black"
            placeholder="Nhập nội dung (ví dụ: nhà riêng 80m2 quận 7)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyPress}
          />
          <button
            onClick={() => handleSend()}
            disabled={!inputValue.trim() || isSending}
            className="bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:hover:bg-primary text-primary-foreground p-2 rounded-full transition-colors flex items-center justify-center"
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary hover:bg-primary/90 text-primary-foreground p-4 rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95 flex items-center justify-center"
      >
        {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  )
}
