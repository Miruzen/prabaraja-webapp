
import { FileQuestion } from "lucide-react"

export default function Reports() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-semibold text-foreground mb-2">Reports Coming Soon</h1>
      <p className="text-muted-foreground">
        This section is currently under development. Check back later for updates!
      </p>
    </div>
  )
}
