
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import { Label } from "@/components/ui/label";

const Settings = () => {
  const { user, profile, updateProfile, updateEmail, updatePassword } = useAuth();
  const { toast } = useToast();
  
  const [name, setName] = useState(profile?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [isUpdatingEmail, setIsUpdatingEmail] = useState(false);
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      return toast({
        title: "Error",
        description: "Name cannot be empty",
        variant: "destructive",
        duration: 3000,
      });
    }
    
    try {
      setIsUpdatingProfile(true);
      await updateProfile({ name });
    } catch (error) {
      console.error("Profile update error:", error);
    } finally {
      setIsUpdatingProfile(false);
    }
  };
  
  const handleEmailUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      return toast({
        title: "Error",
        description: "Email cannot be empty",
        variant: "destructive",
        duration: 3000,
      });
    }
    
    try {
      setIsUpdatingEmail(true);
      await updateEmail(email);
    } catch (error) {
      console.error("Email update error:", error);
    } finally {
      setIsUpdatingEmail(false);
    }
  };
  
  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      return toast({
        title: "Error",
        description: "All password fields are required",
        variant: "destructive",
        duration: 3000,
      });
    }
    
    if (newPassword !== confirmPassword) {
      return toast({
        title: "Error",
        description: "New passwords do not match",
        variant: "destructive",
        duration: 3000,
      });
    }
    
    try {
      setIsUpdatingPassword(true);
      await updatePassword(newPassword);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("Password update error:", error);
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navigation />
      
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-4xl">
          <h1 className="text-3xl font-serif font-medium mb-8">
            Account Settings
          </h1>
          
          <Tabs defaultValue="profile" className="w-full">
            <TabsList className="grid grid-cols-3 mb-8">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="email">Email</TabsTrigger>
              <TabsTrigger value="password">Password</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile">
              <Card>
                <form onSubmit={handleProfileUpdate}>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Update your account profile information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="elegant-input"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="elegant-button" 
                      disabled={isUpdatingProfile}
                    >
                      {isUpdatingProfile ? 
                        <div className="flex items-center">
                          <span className="mr-2">Saving</span>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div> : 
                        "Save Changes"
                      }
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="email">
              <Card>
                <form onSubmit={handleEmailUpdate}>
                  <CardHeader>
                    <CardTitle>Email Address</CardTitle>
                    <CardDescription>
                      Update your email address. You'll need to verify the new email.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="elegant-input"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="elegant-button" 
                      disabled={isUpdatingEmail}
                    >
                      {isUpdatingEmail ? 
                        <div className="flex items-center">
                          <span className="mr-2">Sending Verification</span>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div> : 
                        "Update Email"
                      }
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            
            <TabsContent value="password">
              <Card>
                <form onSubmit={handlePasswordUpdate}>
                  <CardHeader>
                    <CardTitle>Password</CardTitle>
                    <CardDescription>
                      Change your account password
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="current-password">Current Password</Label>
                      <Input
                        id="current-password"
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className="elegant-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <Input
                        id="new-password"
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="elegant-input"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirm New Password</Label>
                      <Input
                        id="confirm-password"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="elegant-input"
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      type="submit" 
                      className="elegant-button" 
                      disabled={isUpdatingPassword}
                    >
                      {isUpdatingPassword ? 
                        <div className="flex items-center">
                          <span className="mr-2">Updating</span>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        </div> : 
                        "Change Password"
                      }
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="py-6 border-t mt-8">
        <div className="container text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Bella Tasks. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Settings;
