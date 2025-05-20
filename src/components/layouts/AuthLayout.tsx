
import { ReactNode } from "react";
import { Link } from "react-router-dom";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b py-4">
        <div className="container flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <h1 className="text-2xl font-serif font-medium">Elegant Tasks</h1>
          </Link>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md animate-fadeIn">
          {children}
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container text-center text-muted-foreground text-sm">
          &copy; {new Date().getFullYear()} Elegant Tasks. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default AuthLayout;
