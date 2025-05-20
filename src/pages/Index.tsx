
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navigation from "@/components/Navigation";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <main className="flex-1">
        <section className="py-20 px-4">
          <div className="container max-w-5xl">
            <div className="flex flex-col lg:flex-row items-center gap-12">
              <div className="flex-1 text-center lg:text-left animate-fadeIn">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-medium mb-6 leading-tight">
                  Elegantly organize your tasks
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
                  A beautifully designed todo application that helps you focus on what matters most
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  {isAuthenticated ? (
                    <Link to="/dashboard">
                      <Button className="elegant-button text-base px-8 py-6">
                        Go to Dashboard
                      </Button>
                    </Link>
                  ) : (
                    <>
                      <Link to="/register">
                        <Button className="elegant-button text-base px-8 py-6">
                          Get Started
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button variant="outline" className="text-base px-8 py-6">
                          Sign In
                        </Button>
                      </Link>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex-1 w-full max-w-md mx-auto lg:max-w-none animate-slideIn">
                <Card className="elegant-card shadow-md">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-md">
                        <div className="h-5 w-5 rounded-full border-2 border-primary/50 flex-shrink-0"></div>
                        <p className="text-muted-foreground">Create task lists</p>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-md">
                        <div className="h-5 w-5 rounded-full border-2 border-primary/50 flex-shrink-0 flex items-center justify-center bg-primary/20">
                          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <p className="text-muted-foreground line-through">Organize your day</p>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-md">
                        <div className="h-5 w-5 rounded-full border-2 border-primary/50 flex-shrink-0"></div>
                        <p className="text-muted-foreground">Increase productivity</p>
                      </div>
                      <div className="flex items-center space-x-3 p-3 bg-secondary/50 rounded-md">
                        <div className="h-5 w-5 rounded-full border-2 border-primary/50 flex-shrink-0"></div>
                        <p className="text-muted-foreground">Track your progress</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-12">Why Elegant Tasks?</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <Card className="elegant-card">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                      <line x1="16" y1="2" x2="16" y2="6"></line>
                      <line x1="8" y1="2" x2="8" y2="6"></line>
                      <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-2">Simple & Clean</h3>
                  <p className="text-muted-foreground">An elegant, distraction-free interface that helps you focus on your tasks</p>
                </CardContent>
              </Card>
              
              <Card className="elegant-card">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                      <polyline points="22 4 12 14.01 9 11.01"></polyline>
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-2">Track Progress</h3>
                  <p className="text-muted-foreground">Easily track and manage your daily tasks and goals</p>
                </CardContent>
              </Card>
              
              <Card className="elegant-card">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"></circle>
                      <path d="M16.2 7.8l-2 6.3-6.4 2.1 2-6.3z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-serif font-medium mb-2">Always Available</h3>
                  <p className="text-muted-foreground">Access your tasks from anywhere, anytime with cloud synchronization</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        <section className="py-20">
          <div className="container text-center max-w-xl">
            <h2 className="text-3xl md:text-4xl font-serif font-medium mb-6">Ready to get organized?</h2>
            <p className="text-muted-foreground mb-8">
              Join thousands of users who have transformed how they manage their daily tasks.
            </p>
            
            <div className="flex justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button className="elegant-button text-lg px-8 py-6">
                    Go to Dashboard
                  </Button>
                </Link>
              ) : (
                <Link to="/register">
                  <Button className="elegant-button text-lg px-8 py-6">
                    Create Your Free Account
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h2 className="text-xl font-serif font-medium">Elegant Tasks</h2>
              <p className="text-sm text-muted-foreground">Organize your life elegantly</p>
            </div>
            
            <div className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Elegant Tasks. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
