"use client"

import { useEffect, useRef, useCallback } from "react"

const NOTIFICATION_INTERVAL_MS = 2 * 60 * 60 * 1000
const STORAGE_KEYS = {
  enabled: "ignivis_notifications_enabled",
  lastNotified: "ignivis_last_notification",
  lastScan: "ignivis_last_scan_time",
  prompted: "ignivis_notifications_prompted",
}

const HEALTH_TIPS = [
  { title: "💧 Time to Hydrate!", body: "Drink a glass of water to stay ahead of heat stress.", tag: "hydrate" },
  { title: "🌡️ Check Your Heat Risk", body: "It's been a while since your last scan. Run a quick analysis.", tag: "scan" },
  { title: "😴 Rest Reminder", body: "Take a short break if you've been active. Your body needs recovery.", tag: "rest" },
  { title: "☀️ Sun Safety Check", body: "If you're outdoors, seek shade and reapply sunscreen.", tag: "sun" },
  { title: "❤️ Heart Rate Check", body: "Feeling your pulse racing? Slow down and breathe deeply.", tag: "heart" },
  { title: "🧊 Cool Down Alert", body: "Splash some cold water on your wrists and neck to cool down fast.", tag: "cool" },
  { title: "🥗 Nutrition Reminder", body: "Eat water-rich fruits like watermelon or cucumber to stay cool.", tag: "nutrition" },
  { title: "🏠 Environment Check", body: "Make sure your indoor space is well-ventilated and cool.", tag: "environment" },
]

export function useNotifications() {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const swRegistrationRef = useRef<ServiceWorkerRegistration | null>(null)

  const isSupported = typeof window !== "undefined" && "Notification" in window && "serviceWorker" in navigator

  const getPermission = useCallback(() => {
    if (!isSupported) return "unsupported"
    return Notification.permission
  }, [isSupported])

  const isEnabled = useCallback(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(STORAGE_KEYS.enabled) === "true"
  }, [])

  const hasBeenPrompted = useCallback(() => {
    if (typeof window === "undefined") return false
    return localStorage.getItem(STORAGE_KEYS.prompted) === "true"
  }, [])

  const recordScan = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.lastScan, Date.now().toString())
  }, [])

  const sendNotification = useCallback(async () => {
    const tip = HEALTH_TIPS[Math.floor(Math.random() * HEALTH_TIPS.length)]

    if (swRegistrationRef.current?.active) {
      swRegistrationRef.current.active.postMessage({
        type: "SHOW_NOTIFICATION",
        tip,
      })
    } else {
      try {
        new Notification(tip.title, {
          body: tip.body,
          icon: "/icon.png",
          tag: tip.tag,
        })
      } catch {}
    }

    localStorage.setItem(STORAGE_KEYS.lastNotified, Date.now().toString())
  }, [])

  const checkAndNotify = useCallback(() => {
    if (!isEnabled()) return
    if (getPermission() !== "granted") return

    const lastNotified = parseInt(localStorage.getItem(STORAGE_KEYS.lastNotified) || "0", 10)
    const now = Date.now()

    if (now - lastNotified >= NOTIFICATION_INTERVAL_MS) {
      sendNotification()
    }
  }, [isEnabled, getPermission, sendNotification])

  const enable = useCallback(async (): Promise<boolean> => {
    if (!isSupported) return false

    try {
      const permission = await Notification.requestPermission()
      if (permission === "granted") {
        localStorage.setItem(STORAGE_KEYS.enabled, "true")
        localStorage.setItem(STORAGE_KEYS.prompted, "true")
        localStorage.setItem(STORAGE_KEYS.lastNotified, Date.now().toString())

        if ("serviceWorker" in navigator) {
          const reg = await navigator.serviceWorker.register("/sw.js")
          swRegistrationRef.current = reg
        }

        return true
      } else {
        localStorage.setItem(STORAGE_KEYS.prompted, "true")
        return false
      }
    } catch {
      return false
    }
  }, [isSupported])

  const disable = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.enabled, "false")
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const dismissPrompt = useCallback(() => {
    localStorage.setItem(STORAGE_KEYS.prompted, "true")
  }, [])

  useEffect(() => {
    if (!isSupported) return

    const initSW = async () => {
      try {
        const reg = await navigator.serviceWorker.register("/sw.js")
        swRegistrationRef.current = reg
      } catch {}
    }
    initSW()

    if (isEnabled() && getPermission() === "granted") {
      checkAndNotify()
      intervalRef.current = setInterval(checkAndNotify, 5 * 60 * 1000)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isSupported, isEnabled, getPermission, checkAndNotify])

  return {
    isSupported,
    isEnabled: isEnabled(),
    hasBeenPrompted: hasBeenPrompted(),
    permission: getPermission(),
    enable,
    disable,
    dismissPrompt,
    recordScan,
    sendNotification,
  }
}
