"use client"

import { useState, useEffect } from "react"
import { Bot, Check, ArrowLeft, Home as HomeIcon } from "lucide-react"

const courses = {
  "Python Programming": [
    "Variables & Data Types",
    "Loops & Conditions",
    "Lists & Dictionaries",
    "Functions",
    "File Handling",
    "Practice Problems"
  ],
  "Data Analysis": [
    "Data Cleaning",
    "Visualization",
    "Statistics",
    "NumPy",
    "Pandas",
    "Matplotlib"
  ],
  "Web Development": [
    "HTML5",
    "CSS3",
    "JavaScript",
    "Responsive Design",
    "Web APIs",
    "Deployment"
  ],
  "SQL & Databases": [
    "SELECT Statements",
    "Joins",
    "Aggregations",
    "Schema Design",
    "Normalization",
    "Indexing"
  ],
  "Programming Fundamentals": [
    "Algorithms",
    "Logic",
    "Data Types",
    "Control Structures",
    "Debugging",
    "Documentation"
  ],
  "Data Structures & Algorithms": [
    "Arrays",
    "Linked Lists",
    "Stacks/Queues",
    "Trees",
    "Sorting",
    "Recursion"
  ]
}

const levels = {
  "Beginner": ["Python Programming", "Programming Fundamentals"],
  "Intermediate": ["Data Analysis", "SQL & Databases"],
  "Advanced": ["Web Development", "Data Structures & Algorithms"]
}

type Step = "home" | "selection" | "details"

export default function Home() {
  const [step, setStep] = useState<Step>("home")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [completedTopics, setCompletedTopics] = useState<Record<string, string[]>>({})
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedStep = localStorage.getItem("cl_currentStep") as Step | null
      const savedCourse = localStorage.getItem("cl_selectedCourse")
      const savedProgress = localStorage.getItem("cl_completedTopics")

      if (savedStep) setStep(savedStep)
      if (savedCourse) setSelectedCourse(savedCourse)
      if (savedProgress) setCompletedTopics(JSON.parse(savedProgress))
    } catch (e) {
      console.error("Failed to load state", e)
    }
    setIsLoaded(true)
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem("cl_currentStep", step)
    localStorage.setItem("cl_completedTopics", JSON.stringify(completedTopics))
    if (selectedCourse) {
      localStorage.setItem("cl_selectedCourse", selectedCourse)
    } else {
      localStorage.removeItem("cl_selectedCourse")
    }
  }, [step, selectedCourse, completedTopics, isLoaded])

  const handleStart = () => setStep("selection")
  
  const handleSelectCourse = (course: string) => {
    setSelectedCourse(course)
    setStep("details")
  }

  const goToHome = () => {
    setStep("home")
    setSelectedCourse(null)
  }

  const goToSelection = () => {
    setStep("selection")
    setSelectedCourse(null)
  }

  const toggleTopic = (course: string, topic: string) => {
    setCompletedTopics(prev => {
      const courseProgress = prev[course] || []
      const isAlreadyCompleted = courseProgress.includes(topic)
      
      const newProgress = isAlreadyCompleted
        ? courseProgress.filter(t => t !== topic)
        : [...courseProgress, topic]
      
      const updated = { ...prev, [course]: newProgress }
      // Immediate save feedback could be added here if needed
      return updated
    })
  }

  if (!isLoaded) return null

  const getProgress = (course: string) => {
    const total = courses[course as keyof typeof courses]?.length || 0
    const completed = completedTopics[course]?.length || 0
    return total === 0 ? 0 : Math.round((completed / total) * 100)
  }

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center p-5 font-sans overflow-x-hidden bg-white text-black">
      {/* Subtle Grayscale Background */}
      <div 
        className="fixed inset-0 z-0 opacity-[0.03] grayscale pointer-events-none"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />

      <div className="relative z-10 w-full max-w-[800px] flex flex-col items-center">
        
        {/* Navigation Header (Hidden on Home) */}
        {step !== "home" && (
          <div className="w-full flex justify-between items-center mb-8 px-2 animate-in fade-in duration-500">
            <button 
              onClick={goToHome}
              className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
            >
              <HomeIcon className="w-4 h-4" /> Home
            </button>
            {step === "details" && (
              <button 
                onClick={goToSelection}
                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-40 hover:opacity-100 transition-opacity"
              >
                <ArrowLeft className="w-4 h-4" /> Courses
              </button>
            )}
          </div>
        )}

        <div className="w-full bg-white border border-black p-8 sm:p-12 rounded-3xl shadow-[20px_20px_0px_0px_rgba(0,0,0,1)] text-center">
          
          {/* STEP 1: HOME PAGE */}
          {step === "home" && (
            <div className="animate-in fade-in zoom-in-95 duration-700">
              <div className="flex justify-center mb-8">
                <div className="bg-black p-6 rounded-full shadow-[8px_8px_0px_0px_rgba(0,0,0,0.2)]">
                  <Bot className="w-16 h-16 text-white" />
                </div>
              </div>
              <h1 className="text-[4rem] sm:text-[5rem] font-black mb-2 tracking-tighter uppercase leading-[0.9]">
                Clarity<br/>Track
              </h1>
              <div className="h-2 w-24 bg-black mx-auto mb-8" />
              <p className="text-xl font-medium mb-12 opacity-60">
                Master the curriculum. Track your progress.<br/>Simple. Focused. Monochrome.
              </p>
              <button 
                onClick={handleStart}
                className="bg-black text-white px-12 py-5 rounded-full font-black text-xl hover:scale-105 active:scale-95 transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,0.2)] hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,0.3)]"
              >
                GET STARTED
              </button>
            </div>
          )}

          {/* STEP 2: COURSE SELECTION */}
          {step === "selection" && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 w-full">
              <h2 className="text-4xl font-black mb-12 uppercase tracking-tighter italic">Select Your Path</h2>
              
              <div className="grid gap-12 text-left">
                {Object.entries(levels).map(([level, levelCourses]) => (
                  <div key={level}>
                    <div className="flex items-center gap-4 mb-6">
                      <h3 className="text-sm font-black uppercase tracking-[0.4em] opacity-30 whitespace-nowrap">
                        {level} Level
                      </h3>
                      <div className="h-px bg-black/10 w-full" />
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {levelCourses.map((course) => (
                        <button
                          key={course}
                          onClick={() => handleSelectCourse(course)}
                          className="group relative bg-white border-2 border-black p-6 rounded-2xl hover:bg-black hover:text-white transition-all duration-300 text-left shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1"
                        >
                          <div className="font-black text-xl mb-4 uppercase leading-tight">{course}</div>
                          <div className="space-y-2">
                            <div className="flex justify-between text-[10px] font-black uppercase tracking-widest opacity-50 group-hover:opacity-100">
                              <span>Progress</span>
                              <span>{getProgress(course)}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/5 group-hover:bg-white/20 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-black group-hover:bg-white transition-all duration-700"
                                style={{ width: `${getProgress(course)}%` }}
                              />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: COURSE DETAILS */}
          {step === "details" && selectedCourse && (
            <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
              <div className="mb-12">
                <h2 className="text-4xl sm:text-5xl font-black mb-6 uppercase tracking-tighter italic leading-none">
                  {selectedCourse}
                </h2>
                
                {/* Large Progress Indicator */}
                <div className="max-w-[400px] mx-auto">
                  <div className="flex justify-between items-end mb-3">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] opacity-30">Mastery Level</span>
                    <span className="text-3xl font-black">{getProgress(selectedCourse)}%</span>
                  </div>
                  <div className="h-4 w-full bg-black/5 rounded-full overflow-hidden border-2 border-black p-0.5">
                    <div 
                      className="h-full bg-black rounded-full transition-all duration-1000 cubic-bezier(0.65, 0, 0.35, 1)"
                      style={{ width: `${getProgress(selectedCourse)}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="text-left space-y-3">
                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] opacity-30 mb-6 ml-1">
                  Topic Checklist
                </h3>
                <div className="grid gap-3">
                  {(courses[selectedCourse as keyof typeof courses] || []).map((topic, i) => {
                    const isCompleted = completedTopics[selectedCourse]?.includes(topic)
                    return (
                      <button 
                        key={i} 
                        onClick={(e) => {
                          e.preventDefault();
                          toggleTopic(selectedCourse, topic);
                        }}
                        className={`group w-full flex items-center p-5 rounded-2xl border-2 transition-all duration-200 active:scale-[0.98] ${
                          isCompleted 
                            ? "bg-black border-black text-white shadow-none" 
                            : "bg-white border-black text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
                        }`}
                      >
                        <div className={`flex-shrink-0 w-8 h-8 rounded-lg border-2 flex items-center justify-center mr-5 transition-all ${
                          isCompleted ? "bg-white border-white" : "border-black group-hover:bg-black/5"
                        }`}>
                          {isCompleted && <Check className="w-5 h-5 text-black stroke-[4px]" />}
                        </div>
                        <span className="font-black text-lg uppercase tracking-tight">{topic}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

        </div>
        
        {/* Footer info */}
        <div className="mt-12 text-[10px] font-black uppercase tracking-[0.5em] opacity-20">
          ClarityTrack © 2024 • Strictly Monochrome
        </div>
      </div>
    </div>
  )
}
