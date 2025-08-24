import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';
import { ThemeToggle } from '../../theme/components';


export const Header: React.FC = () => {
  const greetings = [
    "Hi Developer!",
    "Hello Coder!",
    "Greetings Dev!",
    "Hey there, Programmer!",
    "Welcome, Dev!",
    "DevBros!",
    "Keep Building, Hacker!",
    "Yo, Code Ninja!",
    "What’s up, Engineer?",
    "Ready to Code?",
    "Blast off, Dev!",
    "Hello World, Coder!",
    "Shipping Code Today?",
    "Bug Hunter Mode ON!",
    "Problem Solver Incoming!",
    "Let’s Debug Together!",
    "Code. Test. Repeat.",
    "Building Something Cool?",
    "Coffee First, Then Code!"
  ];


  const [currentGreeting, setCurrentGreeting] = useState('');

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * greetings.length);
    setCurrentGreeting(greetings[randomIndex]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <header className="bg-light-surface dark:bg-dark-background border-b border-light-border dark:border-dark-border px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-light-text-primary dark:text-dark-text-primary json-workbench-title" data-tourid="json-workbench-title">
            JSON Workbench
          </h1>
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-light-text-secondary dark:text-dark-text-secondary pr-4 dev-greeting" data-tourid="dev-greeting">
            <Terminal size={18} />
            <span className="text-sm font-medium">{currentGreeting}</span>
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
};