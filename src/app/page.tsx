"use client"

import { useState, useEffect } from "react"
import { Bot, Check } from "lucide-react"

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
    const savedStep = localStorage.getItem("currentStep") as Step | null
    const savedCourse = localStorage.getItem("selectedCourse")
    const savedProgress = localStorage.getItem("completedTopics")

    if (savedStep) setStep(savedStep)
    if (savedCourse) setSelectedCourse(savedCourse)
    if (savedProgress) setCompletedTopics(JSON.parse(savedProgress))
    setIsLoaded(true)
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem("currentStep", step)
    localStorage.setItem("completedTopics", JSON.stringify(completedTopics))
    if (selectedCourse) {
      localStorage.setItem("selectedCourse", selectedCourse)
    } else {
      localStorage.removeItem("selectedCourse")
    }
  }, [step, selectedCourse, completedTopics, isLoaded])

  const handleStart = () => setStep("selection")
  
  const handleSelectCourse = (course: string) => {
    setSelectedCourse(course)
    setStep("details")
  }

  const handleReset = () => {
    setSelectedCourse(null)
    setStep("selection")
  }

  const toggleTopic = (course: string, topic: string) => {
    setCompletedTopics(prev => {
      const courseProgress = prev[course] || []
      const newProgress = courseProgress.includes(topic)
        ? courseProgress.filter(t => t !== topic)
        : [...courseProgress, topic]
      return { ...prev, [course]: newProgress }
    })
  }

  if (!isLoaded) return null

  const getProgress = (course: string) => {
    const total = courses[course as keyof typeof courses]?.length || 0
    const completed = completedTopics[course]?.length || 0
    return total === 0 ? 0 : Math.round((completed / total) * 100)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-5 font-sans overflow-hidden">
      {/* Background with study-themed photos and grayscale filter */}
      <div 
        className="absolute inset-0 z-0 opacity-20 grayscale"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?q=80&w=2073&auto=format&fit=crop')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      />
      <div className="absolute inset-0 bg-white/60 z-1" />

      <div className="relative z-10 max-w-[700px] w-full bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl text-center border border-black/10">
        
        {/* STEP 1: HOME PAGE */}
        {step === "home" && (
          <div className="animate-in fade-in zoom-in-95 duration-700">
            <div className="flex justify-center mb-6">
              <div className="bg-black p-4 rounded-full shadow-lg">
                <Bot className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-[3rem] font-black mb-4 tracking-tighter text-black uppercase">ClarityTrack</h1>
            <p className="text-[1.1rem] text-black/60 mb-10 font-medium tracking-wide">
              Track what you understand, not how long you study.
            </p>
            <button 
              onClick={handleStart}
              className="group relative bg-black text-white px-10 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 active:scale-95 shadow-xl hover:shadow-black/20"
            >
              Start Learning
            </button>
          </div>
        )}

        {/* STEP 2: COURSE SELECTION */}
        {step === "selection" && (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-3xl font-black mb-8 text-black uppercase tracking-tight">Select a Course</h2>
            <div className="space-y-10">
              {Object.entries(levels).map(([level, levelCourses]) => (
                <div key={level} className="text-left">
                  <h3 className="text-xs font-black uppercase tracking-[0.3em] text-black/40 mb-4 ml-1">
                    {level} Level
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {levelCourses.map((course) => (
                      <button
                        key={course}
                        onClick={() => handleSelectCourse(course)}
                        className="group relative bg-white border border-black/10 p-5 rounded-xl hover:border-black transition-all duration-300 text-left shadow-sm hover:shadow-md"
                      >
                        <div className="font-bold text-lg text-black mb-1">{course}</div>
                        <div className="flex items-center justify-between">
                          <div className="text-[10px] font-bold text-black/40 uppercase tracking-widest">
                            {getProgress(course)}% Complete
                          </div>
                          <div className="h-1 flex-1 mx-3 bg-black/5 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-black transition-all duration-500"
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
            <div className="mb-8">
              <h2 className="text-3xl font-black mb-3 text-black uppercase tracking-tight leading-tight">
                {selectedCourse}
              </h2>
              
              {/* Progress Bar */}
              <div className="max-w-[300px] mx-auto mb-6">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/40">Overall Progress</span>
                  <span className="text-xl font-black text-black">{getProgress(selectedCourse)}%</span>
                </div>
                <div className="h-3 w-full bg-black/5 rounded-full overflow-hidden border border-black/5 p-[2px]">
                  <div 
                    className="h-full bg-black rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${getProgress(selectedCourse)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-left mb-8">
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 mb-4 ml-1">
                Curriculum
              </h3>
              <ul className="space-y-2">
                {(courses[selectedCourse as keyof typeof courses] || []).map((topic, i) => {
                  const isCompleted = completedTopics[selectedCourse]?.includes(topic)
                  return (
                    <li 
                      key={i} 
                      onClick={() => toggleTopic(selectedCourse, topic)}
                      className={`group cursor-pointer flex items-center p-4 rounded-xl border transition-all duration-300 ${
                        isCompleted 
                          ? "bg-black border-black text-white" 
                          : "bg-white border-black/10 text-black hover:border-black"
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mr-4 transition-colors ${
                        isCompleted ? "bg-white border-white" : "border-black/10 group-hover:border-black"
                      }`}>
                        {isCompleted && <Check className="w-4 h-4 text-black" />}
                      </div>
                      <span className="font-bold">{topic}</span>
                    </li>
                  )
                })}
              </ul>
            </div>
            
            <button 
              onClick={handleReset}
              className="text-black/40 font-bold uppercase tracking-widest text-xs hover:text-black transition-colors border-b border-transparent hover:border-black pb-1"
            >
              Choose a different course
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
