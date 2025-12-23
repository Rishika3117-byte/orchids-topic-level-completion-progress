import { TopicTracker } from "@/components/topic-tracker"

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <main className="container mx-auto py-12 px-4 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary font-medium">
            Personal Learning Path
          </div>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl">
            ClarityTrack
          </h1>
          <p className="max-w-[700px] text-zinc-500 md:text-xl dark:text-zinc-400">
            A minimalist tracker for intentional learning. Select your level, 
            master the content, and confirm your progress.
          </p>
        </div>
        
        <TopicTracker />
        
        <footer className="mt-24 text-center text-sm text-zinc-400">
          <p>© {new Date().getFullYear()} ClarityTrack. Built for focused minds.</p>
        </footer>
      </main>
    </div>
  )
}
