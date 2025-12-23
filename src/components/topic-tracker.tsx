"use client"

import * as React from "react"
import { CheckCircle2, ChevronRight, GraduationCap } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"

interface Topic {
  id: string
  name: string
  level: string | null
  completed: boolean
}

const DEFAULT_TOPICS: Topic[] = [
  { id: "1", name: "HTML & Semantic Markup", level: null, completed: false },
  { id: "2", name: "CSS Grid & Flexbox", level: null, completed: false },
  { id: "3", name: "JavaScript ES6+ Basics", level: null, completed: false },
  { id: "4", name: "React Hooks & Lifecycle", level: null, completed: false },
  { id: "5", name: "Next.js App Router", level: null, completed: false },
  { id: "6", name: "TypeScript Fundamentals", level: null, completed: false },
]

export function TopicTracker() {
  const [topics, setTopics] = React.useState<Topic[]>([])
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const saved = localStorage.getItem("learning-tracker-topics")
    if (saved) {
      try {
        setTopics(JSON.parse(saved))
      } catch (e) {
        setTopics(DEFAULT_TOPICS)
      }
    } else {
      setTopics(DEFAULT_TOPICS)
    }
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem("learning-tracker-topics", JSON.stringify(topics))
    }
  }, [topics, mounted])

  const updateTopic = (id: string, updates: Partial<Topic>) => {
    setTopics((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
    )
  }

  const completedCount = topics.filter((t) => t.completed).length
  const progress = topics.length > 0 ? (completedCount / topics.length) * 100 : 0

  if (!mounted) return null

  return (
    <div className="mx-auto w-full max-w-2xl space-y-8 p-4">
      <header className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Learning Journey</h2>
            <p className="text-muted-foreground">Master your skills step by step.</p>
          </div>
          <div className="text-right">
            <span className="text-4xl font-black text-primary">{Math.round(progress)}%</span>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Progress</p>
          </div>
        </div>
        <Progress value={progress} className="h-3" />
      </header>

      <div className="grid gap-4">
        {topics.map((topic) => (
          <Card 
            key={topic.id} 
            className={`transition-all duration-300 ${topic.completed ? "border-primary/50 bg-primary/5 ring-1 ring-primary/20" : ""}`}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg flex items-center gap-2">
                    {topic.name}
                    {topic.completed && (
                      <Badge variant="default" className="bg-primary hover:bg-primary gap-1">
                        <CheckCircle2 className="h-3 w-3" />
                        Completed
                      </Badge>
                    )}
                  </CardTitle>
                </div>
                {topic.level && !topic.completed && (
                  <Badge variant="secondary" className="capitalize">
                    {topic.level}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-3">
                <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Select Level
                </Label>
                <RadioGroup
                  value={topic.level || ""}
                  onValueChange={(val) => updateTopic(topic.id, { level: val })}
                  disabled={topic.completed}
                  className="flex flex-wrap gap-2"
                >
                  {["beginner", "intermediate", "expert"].map((lvl) => (
                    <div key={lvl} className="flex-1 min-w-[100px]">
                      <RadioGroupItem
                        value={lvl}
                        id={`${topic.id}-${lvl}`}
                        className="peer sr-only"
                      />
                      <Label
                        htmlFor={`${topic.id}-${lvl}`}
                        className="flex items-center justify-center rounded-md border-2 border-muted bg-popover p-2 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all capitalize text-sm font-medium"
                      >
                        {lvl}
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <AnimatePresence>
                {topic.level && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-2">
                      <div 
                        className={`flex items-center space-x-3 p-4 rounded-xl border transition-all cursor-pointer ${
                          topic.completed 
                            ? "bg-primary border-primary text-primary-foreground" 
                            : "bg-secondary/50 border-secondary hover:bg-secondary"
                        }`}
                        onClick={() => updateTopic(topic.id, { completed: !topic.completed })}
                      >
                        <Checkbox
                          id={`complete-${topic.id}`}
                          checked={topic.completed}
                          onCheckedChange={(checked) => 
                            updateTopic(topic.id, { completed: checked as boolean })
                          }
                          className={topic.completed ? "border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary" : ""}
                        />
                        <div className="grid gap-1.5 leading-none cursor-pointer select-none">
                          <label
                            htmlFor={`complete-${topic.id}`}
                            className="text-sm font-bold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                          >
                            Mark as Completed
                          </label>
                          <p className={`text-xs ${topic.completed ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {topic.completed ? "Goal achieved!" : "Ready to finalize this topic?"}
                          </p>
                        </div>
                        {topic.completed && (
                          <motion.div 
                            initial={{ scale: 0 }} 
                            animate={{ scale: 1 }} 
                            className="ml-auto"
                          >
                            <CheckCircle2 className="h-6 w-6" />
                          </motion.div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="pt-4 text-center">
        <p className="text-sm text-muted-foreground italic">
          "Level selected" ≠ "Completed". You must manually confirm completion.
        </p>
      </div>
    </div>
  )
}
