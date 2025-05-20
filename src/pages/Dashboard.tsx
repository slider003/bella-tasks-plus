
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import TodoList from "@/components/TodoList";
import { useAuth } from "@/contexts/AuthContext";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navigation />
      
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-medium mb-2">
              Welcome back, {user?.name || "User"}
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your tasks
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="elegant-card">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="text-3xl font-medium mb-2">0</div>
                <div className="text-muted-foreground text-sm">Tasks Completed Today</div>
              </CardContent>
            </Card>
            <Card className="elegant-card">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="text-3xl font-medium mb-2">0</div>
                <div className="text-muted-foreground text-sm">Tasks In Progress</div>
              </CardContent>
            </Card>
            <Card className="elegant-card">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="text-3xl font-medium mb-2">0</div>
                <div className="text-muted-foreground text-sm">Tasks Added This Week</div>
              </CardContent>
            </Card>
          </div>

          <TodoList />
          
          <div className="mt-8 text-center">
            <p className="text-muted-foreground text-sm">
              Note: Your tasks are currently stored locally. Connect Supabase to enable cloud sync.
            </p>
            <Button variant="link" className="text-primary">
              Learn more about Supabase integration
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="py-6 border-t mt-8">
        <div className="container text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Elegant Tasks. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;
