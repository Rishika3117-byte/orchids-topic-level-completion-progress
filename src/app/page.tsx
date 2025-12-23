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

type Step = "home" | "selection" | "details"

export default function Home() {
  const [step, setStep] = useState<Step>("home")
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)

  // Load from localStorage on mount
  useEffect(() => {
    const savedStep = localStorage.getItem("currentStep") as Step | null
    const savedCourse = localStorage.getItem("selectedCourse")

    if (savedStep) setStep(savedStep)
    if (savedCourse) setSelectedCourse(savedCourse)
    setIsLoaded(true)
  }, [])

  // Save to localStorage on changes
  useEffect(() => {
    if (!isLoaded) return
    localStorage.setItem("currentStep", step)
    if (selectedCourse) {
      localStorage.setItem("selectedCourse", selectedCourse)
    } else {
      localStorage.removeItem("selectedCourse")
    }
  }, [step, selectedCourse, isLoaded])

  const handleStart = () => setStep("selection")
  
  const handleSelectCourse = (course: string) => {
    setSelectedCourse(course)
    setStep("details")
  }

  const handleReset = () => {
    setSelectedCourse(null)
    setStep("selection")
  }

  if (!isLoaded) return null

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

      <div className="relative z-10 max-w-[600px] w-full bg-white/90 backdrop-blur-sm p-10 rounded-2xl shadow-2xl text-center border border-black/10">
        
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {Object.keys(courses).map((course) => (
                <button
                  key={course}
                  onClick={() => handleSelectCourse(course)}
                  className="bg-white border-2 border-black/5 p-6 rounded-xl hover:border-black hover:bg-black hover:text-white transition-all duration-300 font-bold text-lg shadow-sm hover:shadow-xl hover:-translate-y-1"
                >
                  {course}
                </button>
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
              <div className="h-1 w-20 bg-black mx-auto rounded-full" />
            </div>
            <ul className="text-left space-y-3 mb-10">
              {(courses[selectedCourse as keyof typeof courses] || []).map((topic, i) => (
                <li key={i} className="flex items-center p-4 bg-black/5 border border-black/5 rounded-xl transition-all hover:bg-black/10">
                  <div className="bg-black rounded-full p-1 mr-4">
                    <Check className="w-4 h-4 text-white" />
                  </div>
                  <span className="font-bold text-black/80">{topic}</span>
                </li>
              ))}
            </ul>
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
