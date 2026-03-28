"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, ChevronRight, Bot, User, Flame, ArrowDown } from "lucide-react"

// ─── Q&A Data ────────────────────────────────────────────────────────────────

interface QA {
  question: string
  answer: string
}

interface Category {
  name: string
  emoji: string
  items: QA[]
}

const categories: Category[] = [
  {
    name: "General",
    emoji: "🔥",
    items: [
      {
        question: "What is Ignivis?",
        answer:
          "Ignivis is an AI-powered real-time heat stress detection system. It combines facial computer vision analysis with live environmental data (temperature, humidity, UV, AQI) to predict your personalized heat stress risk before it becomes dangerous.",
      },
      {
        question: "Who is Ignivis designed for?",
        answer:
          "Ignivis is built for anyone exposed to extreme heat — construction workers, farmers, delivery personnel, traffic police, athletes, and elderly individuals. It's especially useful in hot climates like India where outdoor workers face daily heat risk.",
      },
      {
        question: "Is Ignivis free to use?",
        answer:
          "Yes! Ignivis is a fully open-source project licensed under MIT. You can use it for free for personal or commercial purposes.",
      },
    ],
  },
  {
    name: "How It Works",
    emoji: "🧠",
    items: [
      {
        question: "How does the face scan work?",
        answer:
          "When you start an analysis, your webcam captures a photo of your face. Our AI models analyze facial redness intensity, skin brightness variation, and micro-stress cues using OpenCV and MediaPipe to calculate a Physiological Stress Score (0–100).",
      },
      {
        question: "What environmental data does Ignivis use?",
        answer:
          "Ignivis fetches real-time Temperature, Humidity, UV Index, and Air Quality Index (AQI) for your location using weather APIs. These are processed through our ML model to generate an Environmental Stress Score (0–100).",
      },
      {
        question: "How is the final risk score calculated?",
        answer:
          "The final risk combines Environmental Score (30%), Physiological Score (40%), Face Analysis (15%), and Skin Analysis (15%), plus lifestyle modifiers like sleep hours and water intake. The result is a 0–100 risk score classified as Safe (🟢), Moderate (🟡), or High (🔴).",
      },
      {
        question: "What are the risk levels?",
        answer:
          "Safe (0–39): Low risk — maintain hydration. Moderate (40–74): Elevated indicators — drink water, seek shade. High (75–100): Immediate action required — move to a cool area and rest.",
      },
    ],
  },
  {
    name: "Privacy",
    emoji: "🔒",
    items: [
      {
        question: "Is my face data stored anywhere?",
        answer:
          "Absolutely not. Your facial image is processed in real-time for risk prediction and is immediately discarded after analysis. We never store, save, or use your biometric data for training.",
      },
      {
        question: "Can Ignivis replace a doctor?",
        answer:
          "No. Ignivis is an early-warning intelligence system designed to alert you to potential heat stress risks. It is not a substitute for professional medical diagnosis. If you experience severe symptoms like dizziness, nausea, or confusion, seek medical help immediately.",
      },
    ],
  },
  {
    name: "Using the App",
    emoji: "📱",
    items: [
      {
        question: "What do I need to get started?",
        answer:
          "Just a device with a webcam and a modern web browser — no special hardware needed. You'll also want to know your approximate body temperature and resting heart rate for the physiological inputs.",
      },
      {
        question: "How do I run an analysis?",
        answer:
          'Click "Start Analysis" on the homepage, allow webcam and location access, enter your body temperature, heart rate, sleep hours, and water intake, then capture your face scan. Ignivis will calculate your personalized risk score in seconds.',
      },
      {
        question: "What should I do if my risk is High?",
        answer:
          "Move to an air-conditioned or shaded area immediately. Drink at least 500ml of cool water. Stop all physical exertion. Monitor your body temperature and seek medical attention if symptoms worsen.",
      },
      {
        question: "Can I view my past results?",
        answer:
          "Yes! Navigate to the Dashboard page to see your complete analysis history with detailed score breakdowns and trends over time.",
      },
    ],
  },
  {
    name: "Heat Stress",
    emoji: "🌡️",
    items: [
      {
        question: "What are the signs of heat stress?",
        answer:
          "Common signs include excessive sweating, rapid heartbeat, dizziness, nausea, headache, muscle cramps, and flushed skin. Severe cases can lead to heat exhaustion or heatstroke, which is a medical emergency.",
      },
      {
        question: "How can I prevent heat stress?",
        answer:
          "Stay hydrated (drink 3–4 liters/day in hot weather), wear light and breathable clothing, take regular breaks in shaded areas, avoid peak sun hours (11 AM – 3 PM), and monitor your body for early warning signs.",
      },
      {
        question: "Why does hydration affect my score?",
        answer:
          "Dehydration impairs your body's ability to regulate temperature through sweating. Drinking less than 2 liters/day increases your heat stress modifier by +15 points, while 4+ liters gives you a -10 protective buffer.",
      },
      {
        question: "How does sleep affect heat stress risk?",
        answer:
          "Sleep deprivation reduces your body's thermoregulation capacity and stress recovery. Less than 6 hours of sleep adds +10 points to your risk score, making you significantly more vulnerable to heat-related illness.",
      },
    ],
  },
  {
    name: "Technical",
    emoji: "⚙️",
    items: [
      {
        question: "What AI models does Ignivis use?",
        answer:
          "Ignivis uses 4 machine learning models: an Environmental model (temperature/humidity/UV), a Physiological model (body temp/heart rate), a Facial Stress model (skin brightness/variations), and a Skin Thermal Variance model — all built with Scikit-learn and served via FastAPI.",
      },
      {
        question: "Is Ignivis open source?",
        answer:
          "Yes! Ignivis is open-source under the MIT License. You can view, modify, and contribute to the codebase on GitHub.",
      },
      {
        question: "What technology stack is used?",
        answer:
          "Frontend: Next.js 16 + React 19 + TypeScript + Tailwind CSS + Framer Motion. Backend: FastAPI + Python. ML: OpenCV + MediaPipe + Scikit-learn. Data: Real-time weather APIs + PostgreSQL for history.",
      },
    ],
  },
]

// ─── Types ───────────────────────────────────────────────────────────────────

interface ChatMessage {
  id: number
  type: "bot" | "user"
  text: string
}

// ─── Component ───────────────────────────────────────────────────────────────

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCategory, setActiveCategory] = useState(0)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 0,
      type: "bot",
      text: "👋 Hi! I'm the Ignivis Assistant. Select a topic below and tap any question to learn more about our AI heat stress detection system.",
    },
  ])
  const [showScrollHint, setShowScrollHint] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const nextIdRef = useRef(1)

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Show scroll hint when content overflows
  useEffect(() => {
    const container = chatContainerRef.current
    if (!container) return

    const checkScroll = () => {
      const isScrollable = container.scrollHeight > container.clientHeight
      const isAtBottom =
        container.scrollHeight - container.scrollTop - container.clientHeight < 40
      setShowScrollHint(isScrollable && !isAtBottom)
    }

    checkScroll()
    container.addEventListener("scroll", checkScroll)
    return () => container.removeEventListener("scroll", checkScroll)
  }, [messages])

  const handleQuestionClick = (qa: QA) => {
    const userMsg: ChatMessage = {
      id: nextIdRef.current++,
      type: "user",
      text: qa.question,
    }
    const botMsg: ChatMessage = {
      id: nextIdRef.current++,
      type: "bot",
      text: qa.answer,
    }
    setMessages((prev) => [...prev, userMsg, botMsg])
  }

  const handleReset = () => {
    setMessages([
      {
        id: 0,
        type: "bot",
        text: "👋 Hi! I'm the Ignivis Assistant. Select a topic below and tap any question to learn more about our AI heat stress detection system.",
      },
    ])
    nextIdRef.current = 1
    setActiveCategory(0)
  }

  return (
    <>
      {/* ── Floating Trigger Button ── */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            id="chatbot-trigger"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#ff8c00] text-white flex items-center justify-center shadow-[0_0_25px_rgba(255,69,0,0.4)] hover:shadow-[0_0_35px_rgba(255,69,0,0.6)] transition-shadow cursor-pointer"
            aria-label="Open chat assistant"
          >
            <MessageCircle className="w-6 h-6" />
            {/* Ping animation */}
            <span className="absolute inline-flex h-full w-full rounded-full bg-[var(--color-primary)] opacity-30 animate-ping" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── Chat Panel ── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id="chatbot-panel"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-2rem)] h-[560px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl overflow-hidden border border-white/10 shadow-[0_8px_60px_rgba(0,0,0,0.6)]"
            style={{
              background: "rgba(10, 10, 16, 0.92)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
            }}
          >
            {/* ── Header ── */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 bg-gradient-to-r from-white/[0.03] to-transparent shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-primary)] to-[#ff8c00] flex items-center justify-center">
                  <Flame className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-wide">
                    Ignivis Assistant
                  </h3>
                  <p className="text-[11px] text-white/40 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                    Always online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={handleReset}
                  className="text-white/40 hover:text-white/80 transition-colors text-xs px-2 py-1 rounded-lg hover:bg-white/5 cursor-pointer"
                  title="Clear chat"
                >
                  Clear
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white/40 hover:text-white transition-colors p-1.5 rounded-lg hover:bg-white/10 cursor-pointer"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* ── Messages Area ── */}
            <div
              ref={chatContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 space-y-3 relative"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,69,0,0.3) transparent",
              }}
            >
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${msg.type === "user" ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  <div
                    className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center mt-0.5 ${
                      msg.type === "bot"
                        ? "bg-gradient-to-br from-[var(--color-primary)]/20 to-orange-500/20 border border-[var(--color-primary)]/30"
                        : "bg-gradient-to-br from-[var(--color-accent)]/20 to-purple-500/20 border border-[var(--color-accent)]/30"
                    }`}
                  >
                    {msg.type === "bot" ? (
                      <Bot className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                    ) : (
                      <User className="w-3.5 h-3.5 text-[var(--color-accent)]" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-3.5 py-2.5 text-[13px] leading-relaxed ${
                      msg.type === "bot"
                        ? "bg-white/[0.06] text-white/80 rounded-tl-sm border border-white/[0.06]"
                        : "bg-gradient-to-r from-[var(--color-primary)]/15 to-orange-500/10 text-white/90 rounded-tr-sm border border-[var(--color-primary)]/15"
                    }`}
                  >
                    {msg.text}
                  </div>
                </motion.div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Scroll hint */}
            <AnimatePresence>
              {showScrollHint && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() =>
                    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
                  }
                  className="absolute bottom-[185px] left-1/2 -translate-x-1/2 z-10 w-7 h-7 rounded-full bg-white/10 border border-white/10 flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-colors cursor-pointer"
                >
                  <ArrowDown className="w-3.5 h-3.5" />
                </motion.button>
              )}
            </AnimatePresence>

            {/* ── Category Tabs ── */}
            <div className="shrink-0 border-t border-white/8 bg-white/[0.02]">
              <div
                className="flex gap-1 px-3 py-2 overflow-x-auto"
                style={{
                  scrollbarWidth: "none",
                  msOverflowStyle: "none",
                }}
              >
                {categories.map((cat, idx) => (
                  <button
                    key={cat.name}
                    onClick={() => setActiveCategory(idx)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                      activeCategory === idx
                        ? "bg-[var(--color-primary)]/20 text-[var(--color-primary)] border border-[var(--color-primary)]/30"
                        : "text-white/40 hover:text-white/70 hover:bg-white/5 border border-transparent"
                    }`}
                  >
                    {cat.emoji} {cat.name}
                  </button>
                ))}
              </div>

              {/* ── Question Chips ── */}
              <div
                className="px-3 pb-3 pt-1 space-y-1.5 max-h-[130px] overflow-y-auto"
                style={{
                  scrollbarWidth: "thin",
                  scrollbarColor: "rgba(255,69,0,0.2) transparent",
                }}
              >
                {categories[activeCategory].items.map((qa, idx) => (
                  <motion.button
                    key={idx}
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleQuestionClick(qa)}
                    className="w-full flex items-center gap-2 text-left px-3 py-2 rounded-xl text-xs text-white/60 hover:text-white/90 bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.04] hover:border-white/10 transition-all cursor-pointer group"
                  >
                    <ChevronRight className="w-3.5 h-3.5 shrink-0 text-[var(--color-primary)]/60 group-hover:text-[var(--color-primary)] transition-colors" />
                    <span className="line-clamp-1">{qa.question}</span>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
