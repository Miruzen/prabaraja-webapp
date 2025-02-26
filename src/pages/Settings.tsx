import { FileQuestion } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";

export default function Settings() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col items-center justify-center"> {/* Center content */}
        <FileQuestion className="w-16 h-16 text-muted-foreground mb-4" /> {/* Icon */}
        <h1 className="text-2xl font-semibold text-foreground mb-2">Settings Coming Soon</h1> {/* Heading */}
        <p className="text-muted-foreground">
          This section is currently under development. Check back later for updates!
        </p> {/* Subtext */}
      </div>
    </div>
  );
}