
import { useState, useEffect } from "react";
import { FileQuestion, Save, User } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Settings() {
  const [username, setUsername] = useState("");
  
  // Load username from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleSaveUsername = () => {
    if (username.trim()) {
      localStorage.setItem("username", username.trim());
      toast.success("Username updated successfully");
    } else {
      toast.error("Username cannot be empty");
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="text-white/80"> Modify your workdesk </p>
        </div>
        
        <div className="p-6 max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" /> User Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input 
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username"
                  />
                </div>
                <Button 
                  onClick={handleSaveUsername}
                  className="flex items-center gap-2"
                >
                  <Save className="h-4 w-4" /> Save Changes
                </Button>
              </div>
            </CardContent>
          </Card>
          
          <div className="text-center text-gray-500 mt-8">
            <FileQuestion className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold text-foreground mb-2">More Settings Coming Soon</h2>
            <p className="text-muted-foreground">
              Additional settings options are currently under development. Check back later for updates!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
