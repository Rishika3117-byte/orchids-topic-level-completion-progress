"use client"

import * as React from "react"
import { CheckCircle2, ChevronRight, GraduationCap, LayoutGrid, Database, Code, FileCode, Binary, BarChart3 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Topic {
  id: string
  name: string
  level: string | null
  completed: boolean
}

interface Course {
  id: string
  name: string
  icon: React.ReactNode
  topics: Topic[]
}

const COURSES_DATA: Course[] = [
  {
    id: "python",
    name: "Python Programming",
    icon: <FileCode className="h-4 w-4" />,
    topics: [
      { id: "p1", name: "Variables & Data Types", level: null, completed: false },
      { id: "p2", name: "Conditions & Loops", level: null, completed: false },
      { id: "p3", name: "Lists, Tuples & Sets", level: null, completed: false },
      { id: "p4", name: "Dictionaries", level: null, completed: false },
      { id: "p5", name: "Functions", level: null, completed: false },
      { id: "p6", name: "File Handling", level: null, completed: false },
      { id: "p7", name: "Basic Problem Solving", level: null, completed: false },
    ],
  },
  {
    id: "data-analysis",
    name: "Data Analysis",
    icon: <BarChart3 className="h-4 w-4" />,
    topics: [
      { id: "da1", name: "Excel Basics", level: null, completed: false },
      { id: "da2", name: "Data Cleaning", level: null, completed: false },
      { id: "da3", name: "SQL Basics", level: null, completed: false },
      { id: "da4", name: "Python for Data Analysis", level: null, completed: false },
      { id: "da5", name: "Pandas & NumPy", level: null, completed: false },
      { id: "da6", name: "Data Visualization", level: null, completed: false },
      { id: "da7", name: "Mini Project", level: null, completed: false },
    ],
  },
  {
    id: "web-dev",
    name: "Web Development",
    icon: <LayoutGrid className="h-4 w-4" />,
    topics: [
      { id: "wd1", name: "HTML Basics", level: null, completed: false },
      { id: "wd2", name: "CSS Fundamentals", level: null, completed: false },
      { id: "wd3", name: "Responsive Design", level: null, completed: false },
      { id: "wd4", name: "JavaScript Basics", level: null, completed: false },
      { id: "wd5", name: "DOM Manipulation", level: null, completed: false },
      { id: "wd6", name: "Mini Website Project", level: null, completed: false },
    ],
  },
  {
    id: "sql",
    name: "SQL & Databases",
    icon: <Database className="h-4 w-4" />,
    topics: [
      { id: "sql1", name: "Introduction to Databases", level: null, completed: false },
      { id: "sql2", name: "SQL Queries (SELECT, WHERE)", level: null, completed: false },
      { id: "sql3", name: "Joins & Relationships", level: null, completed: false },
      { id: "sql4", name: "Aggregate Functions", level: null, completed: false },
      { id: "sql5", name: "Subqueries", level: null, completed: false },
      { id: "sql6", name: "Indexing & Optimization", level: null, completed: false },
    ],
  },
  {
    id: "fundamentals",
    name: "Programming Fundamentals",
    icon: <Code className="h-4 w-4" />,
    topics: [
      { id: "f1", name: "What is Programming", level: null, completed: false },
      { id: "f2", name: "Variables & Data Types", level: null, completed: false },
      { id: "f3", name: "Conditional Statements", level: null, completed: false },
      { id: "f4", name: "Loops", level: null, completed: false },
      { id: "f5", name: "Functions", level: null, completed: false },
      { id: "f6", name: "Basic Problem Solving", level: null, completed: false },
    ],
  },
  {
    id: "dsa",
    name: "DSA (Basics)",
    icon: <Binary className="h-4 w-4" />,
    topics: [
      { id: "dsa1", name: "Arrays & Strings", level: null, completed: false },
      { id: "dsa2", name: "Searching Algorithms", level: null, completed: false },
      { id: "dsa3", name: "Sorting Algorithms", level: null, completed: false },
      { id: "dsa4", name: "Stack & Queue", level: null, completed: false },
      { id: "dsa5", name: "Time Complexity Basics", level: null, completed: false },
      { id: "dsa6", name: "Practice Problems", level: null, completed: false },
    ],
  },
]

export function TopicTracker() {
  const [activeCourseId, setActiveCourseId] = React.useState(COURSES_DATA[0].id)
  const [courses, setCourses] = React.useState<Course[]>(COURSES_DATA)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    const saved = localStorage.getItem("clarity-track-data")
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        // Merge saved data with static structure to handle potential schema updates
        const merged = COURSES_DATA.map(staticCourse => {
          const savedCourse = parsed.find((c: any) => c.id === staticCourse.id)
          if (savedCourse) {
            return {
              ...staticCourse,
              topics: staticCourse.topics.map(staticTopic => {
                const savedTopic = savedCourse.topics.find((t: any) => t.id === staticTopic.id)
                return savedTopic ? { ...staticTopic, ...savedTopic } : staticTopic
              })
            }
          }
          return staticCourse
        })
        setCourses(merged)
      } catch (e) {
        setCourses(COURSES_DATA)
      }
    }
    setMounted(true)
  }, [])

  React.useEffect(() => {
    if (mounted) {
      localStorage.setItem("clarity-track-data", JSON.stringify(courses))
    }
  }, [courses, mounted])

  const updateTopic = (courseId: string, topicId: string, updates: Partial<Topic>) => {
    setCourses((prev) =>
      prev.map((c) => {
        if (c.id !== courseId) return c
        return {
          ...c,
          topics: c.topics.map((t) => (t.id === topicId ? { ...t, ...updates } : t)),
        }
      })
    )
  }

  const activeCourse = courses.find((c) => c.id === activeCourseId) || courses[0]
  const completedCount = activeCourse.topics.filter((t) => t.completed).length
  const progress = (completedCount / activeCourse.topics.length) * 100

  if (!mounted) return null

  return (
    <div className="mx-auto w-full max-w-4xl space-y-8 p-4">
      <Tabs value={activeCourseId} onValueChange={setActiveCourseId} className="w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">Courses</h2>
              <p className="text-zinc-500 dark:text-zinc-400">Select a course to track your intentional progress.</p>
            </div>
            <TabsList className="bg-zinc-100 dark:bg-zinc-800 p-1 h-auto flex flex-wrap justify-start">
              {courses.map((course) => (
                <TabsTrigger 
                  key={course.id} 
                  value={course.id}
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-950 data-[state=active]:text-zinc-950 dark:data-[state=active]:text-zinc-50 py-2 px-3 gap-2"
                >
                  {course.icon}
                  <span className="hidden sm:inline">{course.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </div>
          
          <div className="w-full md:w-48 space-y-2">
            <div className="flex items-end justify-between">
              <span className="text-2xl font-bold text-primary">{Math.round(progress)}%</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Course Progress</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        </div>

        {courses.map((course) => (
          <TabsContent key={course.id} value={course.id} className="mt-0 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.topics.map((topic) => (
                <Card 
                  key={topic.id} 
                  className={`group relative overflow-hidden transition-all duration-300 border-zinc-200 dark:border-zinc-800 ${
                    topic.completed 
                      ? "bg-zinc-50/50 dark:bg-zinc-900/50 border-primary/20" 
                      : "hover:border-zinc-300 dark:hover:border-zinc-700"
                  }`}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-4">
                      <CardTitle className="text-base font-semibold leading-tight">
                        {topic.name}
                      </CardTitle>
                      {topic.completed && (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wide">
                          <CheckCircle2 className="h-3 w-3" />
                          Done
                        </div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2.5">
                      <Label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">
                        Current Mastery
                      </Label>
                      <RadioGroup
                        value={topic.level || ""}
                        onValueChange={(val) => updateTopic(course.id, topic.id, { level: val })}
                        disabled={topic.completed}
                        className="flex gap-2"
                      >
                        {["Beginner", "Intermediate", "Expert"].map((lvl) => (
                          <div key={lvl} className="flex-1">
                            <RadioGroupItem
                              value={lvl}
                              id={`${topic.id}-${lvl}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`${topic.id}-${lvl}`}
                              className="flex items-center justify-center rounded-md border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-2 hover:bg-zinc-50 dark:hover:bg-zinc-900 peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/5 dark:peer-data-[state=checked]:bg-primary/10 peer-data-[state=checked]:text-primary cursor-pointer transition-all text-xs font-medium"
                            >
                              {lvl}
                            </Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </div>

                    <AnimatePresence mode="wait">
                      {topic.level && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="pt-2">
                            <div 
                              className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                topic.completed 
                                  ? "bg-primary border-primary text-primary-foreground shadow-lg shadow-primary/20" 
                                  : "bg-zinc-100 dark:bg-zinc-800 border-transparent hover:border-zinc-300 dark:hover:border-zinc-700"
                              }`}
                              onClick={() => updateTopic(course.id, topic.id, { completed: !topic.completed })}
                            >
                              <Checkbox
                                id={`complete-${topic.id}`}
                                checked={topic.completed}
                                onCheckedChange={(checked) => 
                                  updateTopic(course.id, topic.id, { completed: checked as boolean })
                                }
                                className={topic.completed ? "border-primary-foreground data-[state=checked]:bg-primary-foreground data-[state=checked]:text-primary" : ""}
                              />
                              <label
                                htmlFor={`complete-${topic.id}`}
                                className="text-sm font-bold leading-none cursor-pointer select-none grow"
                              >
                                Mark as Completed
                              </label>
                              {topic.completed && <CheckCircle2 className="h-4 w-4" />}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
      
      <div className="flex flex-col items-center gap-2 pt-8 border-t border-zinc-100 dark:border-zinc-900">
        <div className="flex items-center gap-2 text-primary font-semibold">
          <GraduationCap className="h-5 w-5" />
          <span className="text-sm">Intentional Learning Philosophy</span>
        </div>
        <p className="text-sm text-zinc-500 dark:text-zinc-400 text-center max-w-md">
          Progress is only tracked when you explicitly confirm completion. 
          Selecting a level reflects your journey; checking the box reflects your achievement.
        </p>
      </div>
    </div>
  )
}
