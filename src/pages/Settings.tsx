
import { useState, useEffect } from "react";
import { FileQuestion, Save, User, Users } from "lucide-react";
import { Sidebar } from "@/components/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface User {
  email: string;
  role: "admin" | "member";
  name?: string;
}

// Mock users data
const mockUsers: User[] = [
  { email: "admin@gmail.com", role: "admin", name: "Admin User" },
  { email: "john@example.com", role: "member", name: "John Doe" },
  { email: "sarah@example.com", role: "member", name: "Sarah Smith" },
  { email: "mike@example.com", role: "member", name: "Mike Johnson" },
];

export default function Settings() {
  const [username, setUsername] = useState("");
  const [currentUserEmail, setCurrentUserEmail] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [users, setUsers] = useState<User[]>(mockUsers);
  
  // Load username and check if admin from localStorage on component mount
  useEffect(() => {
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
      setUsername(savedUsername);
    }
    
    // Get current user email from localStorage (in a real app this would come from auth)
    const email = localStorage.getItem("userEmail") || "";
    setCurrentUserEmail(email);
    
    // Check if user is admin
    const isUserAdmin = email === "admin@gmail.com";
    setIsAdmin(isUserAdmin);
  }, []);

  const handleSaveUsername = () => {
    if (username.trim()) {
      localStorage.setItem("username", username.trim());
      toast.success("Username updated successfully");
    } else {
      toast.error("Username cannot be empty");
    }
  };

  const handleRoleChange = (email: string, newRole: "admin" | "member") => {
    const updatedUsers = users.map(user => 
      user.email === email ? { ...user, role: newRole } : user
    );
    setUsers(updatedUsers);
    toast.success(`User role updated to ${newRole}`);
  };

  const handleResetPassword = (email: string) => {
    // In a real app, this would trigger a password reset flow
    toast.success(`Password reset link sent to ${email}`);
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <div className="bg-gradient-to-b from-[#818CF8] to-[#C084FC] p-6">
          <h1 className="text-2xl font-semibold text-white">Settings</h1>
          <p className="text-white/80">Modify your workdesk</p>
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
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email"
                    type="email"
                    value={currentUserEmail}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-muted-foreground">Your email address cannot be changed</p>
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
          
          {isAdmin && (
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" /> User Management (Admin Only)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.email}>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.name || "—"}</TableCell>
                        <TableCell>
                          <Select
                            defaultValue={user.role}
                            onValueChange={(value) => handleRoleChange(user.email, value as "admin" | "member")}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="admin">
                                <Badge variant="outline" className="bg-blue-50 text-blue-600 hover:bg-blue-50">Admin</Badge>
                              </SelectItem>
                              <SelectItem value="member">
                                <Badge variant="outline" className="bg-gray-50 text-gray-600 hover:bg-gray-50">Member</Badge>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </TableCell>
                        <TableCell>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => handleResetPassword(user.email)}
                          >
                            Reset Password
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          )}
          
          {!isAdmin && (
            <div className="text-center text-gray-500 mt-8">
              <FileQuestion className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">More Settings Coming Soon</h2>
              <p className="text-muted-foreground">
                Additional settings options are currently under development. Check back later for updates!
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
