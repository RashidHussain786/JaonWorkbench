import React, { useState, useEffect } from 'react';
import { Terminal } from 'lucide-react';

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
  }, []);

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            JSON Workbench
          </h1>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 pr-4">
            <Terminal size={18} />
            <span className="text-sm font-medium">{currentGreeting}</span>
          </div>
        </div>
      </div>
    </header>
  );
};