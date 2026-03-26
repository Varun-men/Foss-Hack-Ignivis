"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { GlassCard } from "@/components/ui/GlassCard"
import { Button } from "@/components/ui/Button"
import { GradientText } from "@/components/ui/GradientText"
import { useRouter } from "next/navigation"
import { Mail, Lock, ArrowRight, ShieldAlert, CheckCircle2 } from "lucide-react"
import { API_URL } from "@/lib/constants"
import { LoginSchema, type LoginInput } from "@/lib/validations"

export default function LoginPage() {
  const router = useRouter()
  const [params, setParams] = useState<URLSearchParams | null>(null)

  useEffect(() => {
    // Simple way to avoid next/navigation searchParams sync bug in some Next versions
    setParams(new URLSearchParams(window.location.search))
  }, [])

  const isRegistered = params?.get("registered") === "true"

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (data: LoginInput) => {
    console.log("[Ignivis Debug] Login Attempt Started");
    console.log("[Ignivis Debug] API URL:", API_URL);
    console.log("[Ignivis Debug] Submission Data (username hidden):", { email: data.email });
    
    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // The backend expects UserCreate shape for simplicity
        body: JSON.stringify({ ...data, username: "login_attempt" })
      }).catch(err => {
        console.error("[Ignivis Debug] Fetch Error:", err);
        throw new Error("Connection failed. Please check if the Backend URL is correct and the server is running.");
      });

      const result = await res.json()
      console.log("[Ignivis Debug] Response Status:", res.status);

      if (!res.ok) {
        // Handle FastAPI validation errors (list of objects)
        if (typeof result.detail === "object" && Array.isArray(result.detail)) {
          throw new Error(result.detail[0]?.msg || "Invalid input data");
        }
        throw new Error(result.detail || "Incorrect email or password");
      }

      console.log("[Ignivis Debug] Login Successful, storing token...");
      localStorage.setItem("ignivis_token", result.access_token)
      window.dispatchEvent(new Event("auth_change"))
      router.push("/analysis")
    } catch (err: any) {
      console.error("[Ignivis Debug] Login Exception:", err.message);
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const onInvalid = (errors: any) => {
    console.log("[Ignivis Debug] Zod Validation Failed:", errors);
  }

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center px-4 relative overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent/20 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <GlassCard className="p-8 md:p-10">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-foreground/60 text-sm">Access the <GradientText variant="accent">Intelligence Engine</GradientText></p>
          </div>

          {isRegistered && !error && (
            <div className="mb-6 p-3 bg-green-500/10 border border-green-500/30 rounded-lg flex items-center gap-2 text-green-400 text-sm">
              <CheckCircle2 className="w-4 h-4" /> Registration successful! Please log in.
            </div>
          )}

          {error && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
              <ShieldAlert className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit, onInvalid)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-foreground/80">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type="text"
                  {...register("email")}
                  className={`w-full bg-white/5 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors lowercase`}
                  placeholder="agent@example.com"
                />
              </div>
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-foreground/80">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                <input
                  type="password"
                  {...register("password")}
                  className={`w-full bg-white/5 border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-accent/50 transition-colors`}
                  placeholder="••••••••"
                />
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password.message}</p>}
            </div>

            <Button variant="secondary" type="submit" className="w-full mt-6" isLoading={loading}>
              Secure Login <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-foreground/60">
            Need an account? <button onClick={() => router.push('/register')} className="text-accent hover:underline">Register here</button>
          </p>
        </GlassCard>
      </motion.div>
    </div>
  )
}
