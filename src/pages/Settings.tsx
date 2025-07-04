
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
import { useAuth } from "@/contexts/AuthContext";
import { useRoleAccess } from "@/hooks/useRoleAccess";
import { useProfiles, useUpdateUserRole } from "@/hooks/useProfiles";
import { getRoleDisplayName, AVAILABLE_ROLES, validateRoleChange } from "@/utils/roleUtils";
import { ConfirmRoleChangeDialog } from "@/components/ConfirmRoleChangeDialog";

export default function Settings() {
  const [username, setUsername] = useState("");
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    userId: string;
    userEmail: string;
    currentRole: string;
    newRole: string;
  }>({
    isOpen: false,
    userId: '',
    userEmail: '',
    currentRole: '',
    newRole: ''
  });

  const { user } = useAuth();
  const { isAdmin, profile, isLoading: roleLoading } = useRoleAccess();
  const { data: profiles, isLoading: profilesLoading } = useProfiles();
  const updateUserRole = useUpdateUserRole();
  
  // Load username from profile on component mount
  useEffect(() => {
    if (profile?.name) {
      setUsername(profile.name);
    }
  }, [profile]);

  const handleSaveUsername = () => {
    if (username.trim()) {
      // For now, we'll just save to localStorage as before
      // In a full implementation, you'd update the profile in Supabase
      localStorage.setItem("username", username.trim());
      toast.success("Username updated successfully");
    } else {
      toast.error("Username cannot be empty");
    }
  };

  const handleRoleChangeRequest = (userId: string, newRole: string) => {
    const targetUser = profiles?.find(p => p.id === userId);
    if (!targetUser) return;

    // Validate the role change
    const validation = validateRoleChange(
      profile?.role || 'member',
      user?.id || '',
      userId,
      newRole
    );

    if (!validation.isValid) {
      toast.error(validation.error || 'Invalid role change');
      return;
    }

    // Show confirmation dialog
    setConfirmDialog({
      isOpen: true,
      userId,
      userEmail: targetUser.email || 'Unknown',
      currentRole: targetUser.role || 'member',
      newRole
    });
  };

  const handleConfirmRoleChange = async () => {
    if (!confirmDialog.userId || !confirmDialog.newRole) return;

    try {
      await updateUserRole.mutateAsync({ 
        userId: confirmDialog.userId, 
        newRole: confirmDialog.newRole 
      });
      
      // Close dialog on success
      setConfirmDialog(prev => ({ ...prev, isOpen: false }));
    } catch (error) {
      // Error is already handled in the mutation
      console.error('Role change failed:', error);
    }
  };

  const handleResetPassword = (email: string) => {
    // In a real app, this would trigger a password reset flow
    toast.success(`Password reset link sent to ${email}`);
  };

  const closeConfirmDialog = () => {
    setConfirmDialog(prev => ({ ...prev, isOpen: false }));
  };

  if (roleLoading) {
    return (
      <div className="flex h-screen bg-background">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </div>
    );
  }

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
                    value={user?.email || ''}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-muted-foreground">Your email address cannot be changed</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input 
                    id="role"
                    type="text"
                    value={getRoleDisplayName(profile?.role || 'member')}
                    disabled
                    className="bg-gray-100"
                  />
                  <p className="text-sm text-muted-foreground">Your role is managed by administrators</p>
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
                {profilesLoading ? (
                  <div className="text-center py-4">Loading users...</div>
                ) : !profiles || profiles.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    No users found in the system
                  </div>
                ) : (
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
                      {profiles.map((userProfile) => {
                        const isCurrentUser = userProfile.id === user?.id;
                        const currentRole = userProfile.role || 'member';
                        
                        return (
                          <TableRow key={userProfile.id}>
                            <TableCell className="font-medium">
                              {userProfile.email || "—"}
                              {isCurrentUser && (
                                <Badge variant="outline" className="ml-2 text-xs">
                                  You
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell>{userProfile.name || "—"}</TableCell>
                            <TableCell>
                              <Select
                                defaultValue={currentRole}
                                onValueChange={(value) => handleRoleChangeRequest(userProfile.id, value)}
                                disabled={isCurrentUser || updateUserRole.isPending}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {AVAILABLE_ROLES.map((role) => (
                                    <SelectItem key={role} value={role}>
                                      <Badge 
                                        variant="outline" 
                                        className={`${
                                          role === 'admin' ? 'bg-blue-50 text-blue-600 hover:bg-blue-50' :
                                          role === 'team_lead' ? 'bg-green-50 text-green-600 hover:bg-green-50' :
                                          role === 'division_member' ? 'bg-purple-50 text-purple-600 hover:bg-purple-50' :
                                          'bg-gray-50 text-gray-600 hover:bg-gray-50'
                                        }`}
                                      >
                                        {getRoleDisplayName(role)}
                                      </Badge>
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              {isCurrentUser && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Cannot change own role
                                </p>
                              )}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={() => handleResetPassword(userProfile.email || '')}
                                disabled={!userProfile.email}
                              >
                                Reset Password
                              </Button>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                )}
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

      <ConfirmRoleChangeDialog
        isOpen={confirmDialog.isOpen}
        onClose={closeConfirmDialog}
        onConfirm={handleConfirmRoleChange}
        userEmail={confirmDialog.userEmail}
        currentRole={confirmDialog.currentRole}
        newRole={confirmDialog.newRole}
        isLoading={updateUserRole.isPending}
      />
    </div>
  );
}
