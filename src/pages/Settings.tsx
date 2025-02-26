
import { FileQuestion } from "lucide-react"
import { Sidebar } from "@/components/Sidebar"

export default function Settings() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" />
      <h1 className="text-2xl font-semibold text-foreground mb-2">Settings Coming Soon</h1>
      <p className="text-muted-foreground">
        This section is currently under development. Check back later for updates!
      </p>
    </div>
  )
}
