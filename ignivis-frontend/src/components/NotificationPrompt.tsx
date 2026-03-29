"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, BellOff, X, ShieldCheck } from "lucide-react"
import { useNotifications } from "@/hooks/useNotifications"

export function NotificationPrompt() {
  const {
    isSupported,
    isEnabled,
    hasBeenPrompted,
    permission,
    enable,
    dismissPrompt,
  } = useNotifications()

  const [isVisible, setIsVisible] = useState(true)
  const [status, setStatus] = useState<"idle" | "enabling" | "success" | "denied">("idle")

  if (!isSupported || isEnabled || hasBeenPrompted || permission === "denied" || !isVisible) {
    return null
  }

  const handleEnable = async () => {
    setStatus("enabling")
    const granted = await enable()
    if (granted) {
      setStatus("success")
      setTimeout(() => setIsVisible(false), 2500)
    } else {
      setStatus("denied")
      setTimeout(() => setIsVisible(false), 2500)
    }
  }

  const handleDismiss = () => {
    dismissPrompt()
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-2rem)] max-w-md"
        >
          <div className="relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500 via-red-500 to-purple-500 p-[1px] animate-pulse" />

            <div className="relative glass rounded-2xl p-5 m-[1px]">
              <button
                onClick={handleDismiss}
                className="absolute top-3 right-3 text-white/40 hover:text-white/80 transition-colors p-1 rounded-full hover:bg-white/10"
                aria-label="Dismiss notification prompt"
              >
                <X className="w-4 h-4" />
              </button>

              {status === "idle" && (
                <div className="flex items-start gap-4">
                  <div className="shrink-0 relative">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center">
                      <motion.div
                        animate={{
                          rotate: [0, 15, -15, 10, -10, 0],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      >
                        <Bell className="w-6 h-6 text-orange-400" />
                      </motion.div>
                    </div>
                    <div className="absolute inset-0 rounded-full bg-orange-500/20 animate-ping" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-white text-sm mb-1">
                      Stay Protected from Heat Stress
                    </h4>
                    <p className="text-foreground/50 text-xs leading-relaxed mb-3">
                      Get periodic health reminders — hydration alerts, scan nudges, and wellness tips to keep you safe.
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={handleEnable}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white text-xs font-semibold hover:shadow-[0_0_20px_rgba(255,69,0,0.4)] transition-shadow"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        Enable Alerts
                      </button>
                      <button
                        onClick={handleDismiss}
                        className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 text-foreground/60 text-xs font-medium hover:bg-white/10 transition-colors"
                      >
                        Not Now
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {status === "enabling" && (
                <div className="flex items-center justify-center gap-3 py-2">
                  <div className="w-5 h-5 border-2 border-orange-400 border-t-transparent rounded-full animate-spin" />
                  <span className="text-sm text-foreground/70">Requesting permission...</span>
                </div>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-3 py-2"
                >
                  <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-400">Health alerts activated!</p>
                    <p className="text-xs text-foreground/50">You&apos;ll receive reminders every 2 hours.</p>
                  </div>
                </motion.div>
              )}

              {status === "denied" && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="flex items-center justify-center gap-3 py-2"
                >
                  <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center">
                    <BellOff className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-400">Permission denied</p>
                    <p className="text-xs text-foreground/50">You can enable later in browser settings.</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
