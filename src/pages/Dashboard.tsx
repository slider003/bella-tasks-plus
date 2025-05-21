
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import TodoList from "@/components/TodoList";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

const Dashboard = () => {
  const { user, profile } = useAuth();
  const [stats, setStats] = useState({
    completedToday: 0,
    inProgress: 0,
    addedThisWeek: 0
  });

  const fetchTodoStats = async () => {
    if (!user) return;

    try {
      // Get todos completed today
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayISOString = today.toISOString();
      
      const { data: completedTodayData, error: completedTodayError } = await supabase
        .from('todos')
        .select('count')
        .eq('user_id', user.id)
        .eq('completed', true)
        .gte('updated_at', todayISOString);
      
      // Get todos in progress
      const { data: inProgressData, error: inProgressError } = await supabase
        .from('todos')
        .select('count')
        .eq('user_id', user.id)
        .eq('completed', false);
      
      // Get todos added this week
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const oneWeekAgoISOString = oneWeekAgo.toISOString();
      
      const { data: addedThisWeekData, error: addedThisWeekError } = await supabase
        .from('todos')
        .select('count')
        .eq('user_id', user.id)
        .gte('created_at', oneWeekAgoISOString);
      
      if (completedTodayError || inProgressError || addedThisWeekError) {
        console.error("Error fetching todo stats:", { 
          completedTodayError, 
          inProgressError, 
          addedThisWeekError 
        });
        return;
      }
      
      setStats({
        completedToday: completedTodayData?.[0]?.count || 0,
        inProgress: inProgressData?.[0]?.count || 0,
        addedThisWeek: addedThisWeekData?.[0]?.count || 0
      });
      
    } catch (error) {
      console.error("Failed to fetch todo statistics:", error);
    }
  };

  useEffect(() => {
    fetchTodoStats();
    
    // Set up realtime subscription for stats updates
    if (user) {
      const channel = supabase
        .channel('todos-stats-changes')
        .on('postgres_changes', 
          { event: '*', schema: 'public', table: 'todos', filter: `user_id=eq.${user.id}` },
          () => {
            // Refresh stats when any todo changes
            fetchTodoStats();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col bg-secondary/30">
      <Navigation />
      
      <main className="flex-1 py-8 px-4">
        <div className="container max-w-4xl">
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-medium mb-2">
              Welcome back, {profile?.name || user?.email?.split('@')[0] || "User"}
            </h1>
            <p className="text-muted-foreground">
              Here's an overview of your tasks
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="elegant-card">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="text-3xl font-medium mb-2">{stats.completedToday}</div>
                <div className="text-muted-foreground text-sm">Tasks Completed Today</div>
              </CardContent>
            </Card>
            <Card className="elegant-card">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="text-3xl font-medium mb-2">{stats.inProgress}</div>
                <div className="text-muted-foreground text-sm">Tasks In Progress</div>
              </CardContent>
            </Card>
            <Card className="elegant-card">
              <CardContent className="p-6 flex flex-col items-center">
                <div className="text-3xl font-medium mb-2">{stats.addedThisWeek}</div>
                <div className="text-muted-foreground text-sm">Tasks Added This Week</div>
              </CardContent>
            </Card>
          </div>

          <TodoList />
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
