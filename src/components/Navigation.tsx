
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const Navigation = () => {
  const {
    isAuthenticated,
    user,
    profile,
    logout
  } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Get display name from profile or fallback to email
  const displayName = profile?.name || user?.email?.split('@')[0] || "User";
  
  return <header className="border-b py-4">
      <div className="container flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <h1 className="text-2xl font-serif font-medium">Bella Tasks</h1>
        </Link>
        
        {/* Mobile toggle */}
        <button className="lg:hidden text-foreground" onClick={toggleMobileMenu} aria-label="Toggle menu">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M3.75 6.75h16.5M3.75 12h16.5M3.75 17.25h16.5"} />
          </svg>
        </button>

        {/* Desktop navigation */}
        <nav className="hidden lg:flex items-center space-x-6">
          <Link to="/" className={`text-sm font-medium ${location.pathname === "/" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            Home
          </Link>
          {isAuthenticated ? <>
              <Link to="/dashboard" className={`text-sm font-medium ${location.pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                Dashboard
              </Link>
              <Link to="/settings" className={`text-sm font-medium ${location.pathname === "/settings" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                Settings
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-medium">
                  Hello, {displayName}
                </span>
                <Button variant="outline" onClick={logout}>
                  Logout
                </Button>
              </div>
            </> : <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="outline">Log in</Button>
              </Link>
              <Link to="/register">
                <Button className="elegant-button">Sign up</Button>
              </Link>
            </div>}
        </nav>

        {/* Mobile menu */}
        {mobileMenuOpen && <div className="fixed lg:hidden inset-0 z-50 bg-background pt-16">
            <div className="container flex flex-col space-y-6 py-8">
              <Link to="/" className={`text-lg font-medium ${location.pathname === "/" ? "text-foreground" : "text-muted-foreground"}`} onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
              {isAuthenticated ? <>
                  <Link to="/dashboard" className={`text-lg font-medium ${location.pathname === "/dashboard" ? "text-foreground" : "text-muted-foreground"}`} onClick={() => setMobileMenuOpen(false)}>
                    Dashboard
                  </Link>
                  <Link to="/settings" className={`text-lg font-medium ${location.pathname === "/settings" ? "text-foreground" : "text-muted-foreground"}`} onClick={() => setMobileMenuOpen(false)}>
                    Settings
                  </Link>
                  <div className="flex flex-col space-y-4 pt-4 border-t">
                    <span className="text-muted-foreground">
                      Signed in as {displayName}
                    </span>
                    <Button variant="outline" onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }}>
                      Logout
                    </Button>
                  </div>
                </> : <div className="flex flex-col space-y-4 pt-4 border-t">
                  <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full" variant="outline">Log in</Button>
                  </Link>
                  <Link to="/register" onClick={() => setMobileMenuOpen(false)}>
                    <Button className="w-full elegant-button">Sign up</Button>
                  </Link>
                </div>}

              <Button variant="ghost" className="mt-8 absolute top-4 right-4" onClick={() => setMobileMenuOpen(false)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>
          </div>}
      </div>
    </header>;
};
export default Navigation;
