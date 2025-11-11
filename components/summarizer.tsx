"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Sparkles, Copy, Check } from "lucide-react"

export function Summarizer() {
  const [inputText, setInputText] = useState("")
  const [summary, setSummary] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [copied, setCopied] = useState(false)

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      setError("Please enter text to summarize")
      return
    }

    setIsLoading(true)
    setError("")
    setSummary("")

    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      })

      if (!response.ok) {
        throw new Error("Failed to summarize text")
      }

      const data = await response.json()
      setSummary(data.summary)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-12 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-primary to-accent rounded-xl">
              <Sparkles className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Text Summarizer
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Distill your content into concise, actionable summaries powered by AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50" />
              <Card className="relative border border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
                <div className="p-6">
                  <label htmlFor="input" className="block text-sm font-semibold text-foreground mb-3">
                    Paste your text
                  </label>
                  <textarea
                    id="input"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder="Enter the text you want to summarize..."
                    className="w-full h-64 p-4 bg-input/50 border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent resize-none transition-all"
                  />
                </div>
              </Card>
            </div>

            <Button
              onClick={handleSummarize}
              disabled={isLoading || !inputText.trim()}
              className="w-full h-12 text-base font-semibold bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Summarizing...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  Summarize
                </div>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            {error && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-destructive/20 to-transparent rounded-2xl blur-xl" />
                <Card className="relative border border-destructive/30 bg-destructive/5 rounded-2xl backdrop-blur-sm">
                  <div className="p-4">
                    <p className="text-destructive text-sm font-medium">{error}</p>
                  </div>
                </Card>
              </div>
            )}

            {summary && (
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-accent/20 rounded-2xl blur-xl opacity-50" />
                <Card className="relative border border-border/50 bg-card/80 backdrop-blur-sm rounded-2xl overflow-hidden hover:border-primary/50 transition-colors">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full" />
                        Summary
                      </h2>
                      <button
                        onClick={handleCopy}
                        className="p-2 hover:bg-secondary rounded-lg transition-colors text-muted-foreground hover:text-foreground"
                        aria-label="Copy summary"
                      >
                        {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                    <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap text-sm">{summary}</p>
                  </div>
                </Card>
              </div>
            )}

            {!summary && !error && (
              <div className="relative h-64">
                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-accent/10 rounded-2xl" />
                <Card className="relative h-full border border-dashed border-border rounded-2xl flex items-center justify-center bg-card/40 backdrop-blur-sm">
                  <div className="text-center">
                    <div className="text-muted-foreground mb-2">
                      <Sparkles className="w-8 h-8 mx-auto opacity-50" />
                    </div>
                    <p className="text-muted-foreground text-sm">Your summary will appear here</p>
                  </div>
                </Card>
              </div>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{inputText.length}</p>
              <p className="text-xs text-muted-foreground mt-1">Characters</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-accent">{inputText.split(/\s+/).filter(Boolean).length}</p>
              <p className="text-xs text-muted-foreground mt-1">Words</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {Math.ceil((inputText.split(/\s+/).filter(Boolean).length || 0) * 0.3)}
              </p>
              <p className="text-xs text-muted-foreground mt-1">Est. Summary</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
