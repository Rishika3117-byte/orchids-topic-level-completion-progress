"use client"

import { useState, useEffect } from "react"

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
    <div className="min-h-screen bg-[#f8fafc] text-[#1e293b] flex items-center justify-center p-5 font-sans">
      <div className="max-w-[600px] w-full bg-white p-10 rounded-lg shadow-sm text-center border border-[#e2e8f0]">
        
        {/* STEP 1: HOME PAGE */}
        {step === "home" && (
          <div className="animate-in fade-in duration-500">
            <h1 className="text-[2.5rem] font-extrabold mb-4 tracking-tight">ClarityTrack</h1>
            <p className="text-[1.25rem] text-[#64748b] mb-8">
              Track what you understand, not how long you study
            </p>
            <button 
              onClick={handleStart}
              className="bg-[#2563eb] hover:bg-[#1d4ed8] text-white px-6 py-3 rounded-md font-semibold transition-colors"
            >
              Start Learning
            </button>
          </div>
        )}

        {/* STEP 2: COURSE SELECTION */}
        {step === "selection" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-bold mb-6">Select a Course</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Object.keys(courses).map((course) => (
                <button
                  key={course}
                  onClick={() => handleSelectCourse(course)}
                  className="bg-[#f8fafc] border border-[#e2e8f0] p-5 rounded-lg hover:border-[#2563eb] hover:-translate-y-0.5 transition-all font-medium text-center"
                >
                  {course}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: COURSE DETAILS */}
        {step === "details" && selectedCourse && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="mb-6">
              <h2 className="text-2xl font-bold mb-2">What you will learn in {selectedCourse}</h2>
            </div>
            <ul className="text-left space-y-2 mb-8">
              {(courses[selectedCourse as keyof typeof courses] || []).map((topic, i) => (
                <li key={i} className="flex items-center p-3 bg-[#f8fafc] border border-[#e2e8f0] rounded-md">
                  <span className="text-[#2563eb] font-bold mr-3">✓</span>
                  {topic}
                </li>
              ))}
            </ul>
            <button 
              onClick={handleReset}
              className="text-[#64748b] underline text-sm hover:text-[#1e293b]"
            >
              Choose a different course
            </button>
          </div>
        )}

      </div>
    </div>
  )
}
