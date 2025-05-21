import React from "react";

const Footer = () => (
  <footer className="py-8 border-t">
    <div className="container">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0">
          <h2 className="text-xl font-serif font-medium">Bella Tasks</h2>
          <p className="text-sm text-muted-foreground">Organize your life elegantly</p>
        </div>
        <div className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} <a href="https://thebellamarketplace.com/" target="_blank" rel="noopener noreferrer" className="hover:underline">Bella Tasks</a>. All rights reserved.
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
