import React, { useState, useEffect } from 'react';
import Joyride, { CallBackProps, STATUS, Step } from 'react-joyride';

const TOUR_COMPLETED_KEY = 'json_workbench_tour_completed';

const FeatureTour: React.FC = () => {
  const [run, setRun] = useState(false);
  const [steps] = useState<Step[]>([
    {
      target: '.json-workbench-title',
      content: '👋 Welcome to JSON Workbench — a privacy-first JSON editor. Everything runs in your browser, so your data stays with you!',
      disableBeacon: true,
      placement: 'bottom',
      title: 'Welcome!'
    },
    {
      target: '.dev-greeting',
      content: "🎉 Here’s your personal greeting. Glad to have you here, fellow developer!",
      placement: 'bottom',
      title: 'Your Developer Hub'
    },
    {
      target: '.monaco-editor-container',
      content: "💻 This is your main editor. Paste, type, or import JSON here. Enjoy syntax highlighting, auto-formatting, and a smooth editing experience.",
      placement: 'bottom',
      title: 'The JSON Editor'
    },
    {
      target: '.mode-selector',
      content: '🔍 Switch between Tree, Code, and Table views to explore your JSON data the way you like.',
      placement: 'bottom',
      title: 'View Modes'
    },
    {
      target: '.input-type-selector',
      content: '📥 Choose between JSON or Base64 input modes. Easily decode Base64 strings into JSON on the fly!',
      placement: 'bottom',
      title: 'Input Type'
    },
    {
      target: '.file-dropzone',
      content: '📂 Drag & drop JSON files here, or use the import options from the sidebar.',
      placement: 'bottom',
      title: 'Import JSON'
    },
    {
      target: '.export-button',
      content: '💾 Save your JSON to a file — quick and secure, right on your device.',
      placement: 'bottom',
      title: 'Export JSON'
    },
    {
      target: '.quick-actions-buttons',
      content: '⚡ Format, minify, validate, or decode JSON instantly with one click.',
      placement: 'bottom',
      title: 'Quick Actions'
    },
    {
      target: '.clipboard-operations',
      content: '📋 Quickly copy any content to your clipboard or paste directly from it — hassle-free and instant.',
      placement: 'bottom',
      title: 'Copy/Paste'
    },
    {
      target: '.compare-button',
      content: '🆚 Compare JSON data, files, or even folders to spot differences at a glance.',
      placement: 'bottom',
      title: 'Compare'
    },
    {
      target: '.status-bar',
      content: 'ℹ️ Watch the status bar for real-time validation messages, tips, and updates.',
      placement: 'top',
      title: 'Status Updates'
    },
  ]);


  useEffect(() => {
    const tourCompleted = localStorage.getItem(TOUR_COMPLETED_KEY);
    if (!tourCompleted) {
      setRun(true);
    }
  }, []);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem(TOUR_COMPLETED_KEY, 'true');
    }
  };

  return (
    <Joyride
      run={run}
      steps={steps}
      continuous
      showProgress
      showSkipButton
      callback={handleJoyrideCallback}
      styles={{
        options: {
          zIndex: 10000,
          arrowColor: '#2d3748',
          backgroundColor: '#2d3748',
          primaryColor: '#4299e1',
          textColor: '#cbd5e0',
        },
        tooltip: {
          maxWidth: '300px',
          backgroundColor: '#2d3748',
          color: '#cbd5e0',
        },
      }}
    />
  );
};

export default FeatureTour;
