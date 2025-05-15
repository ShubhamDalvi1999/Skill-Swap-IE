'use client'

import React, { useState, useEffect } from 'react'

interface PracticePageProps {
  currentChallenge?: {
    title: string;
    starterCode: string;
    testCases: string;
    solution: string;
  };
  lessonId?: string;
}

export default function PracticePage({ currentChallenge, lessonId }: PracticePageProps) {
  const [code, setCode] = useState<string>('')
  const [testResults, setTestResults] = useState<{
    passing: boolean;
    results: Array<{
      name: string;
      passing: boolean;
      error?: string;
    }>;
  } | null>(null)
  const [showSolution, setShowSolution] = useState<boolean>(false)
  const [isRunning, setIsRunning] = useState<boolean>(false)

  // Update code when the challenge changes
  useEffect(() => {
    if (currentChallenge?.starterCode) {
      setCode(currentChallenge.starterCode)
      setTestResults(null)
      setShowSolution(false)
    }
  }, [currentChallenge])

  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCode(e.target.value)
  }

  const handleReset = () => {
    if (currentChallenge?.starterCode) {
      setCode(currentChallenge.starterCode)
      setTestResults(null)
      setShowSolution(false)
    }
  }

  const runTests = () => {
    setIsRunning(true)
    setTestResults(null)

    // This is a very simplified test runner
    // In a real app, you'd use a proper testing framework
    setTimeout(() => {
      try {
        // Mock test results based on the current challenge
        const mockTestResults = {
          passing: Math.random() > 0.5, // Randomly pass or fail for demo
          results: [
            {
              name: 'Test case 1',
              passing: Math.random() > 0.3,
              error: Math.random() > 0.7 ? 'Expected "Fizz" but got "3"' : undefined
            },
            {
              name: 'Test case 2',
              passing: Math.random() > 0.3,
              error: Math.random() > 0.7 ? 'Expected "Buzz" but got "5"' : undefined
            },
            {
              name: 'Test case 3',
              passing: Math.random() > 0.3,
              error: Math.random() > 0.7 ? 'Expected "FizzBuzz" but got "15"' : undefined
            },
          ]
        };

        setTestResults(mockTestResults)
      } catch (error) {
        setTestResults({
          passing: false,
          results: [{
            name: 'Execution error',
            passing: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          }]
        })
      } finally {
        setIsRunning(false)
      }
    }, 1000) // Simulate test execution time
  }

  const toggleSolution = () => {
    setShowSolution(!showSolution)
  }

  return (
    <div className="space-y-6 h-full flex flex-col">
      <header className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">JavaScript Editor</h2>
        
        <div className="flex space-x-2">
          <div className="text-xs px-2 py-1 bg-blue-500/20 text-blue-400 rounded">JavaScript</div>
          {lessonId && (
            <div className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
              {lessonId.split('-')[1]?.toUpperCase() || 'JS'}
            </div>
          )}
        </div>
      </header>
      
      {/* Code Editor */}
      <div className="bg-gray-900 rounded-lg p-4 border border-gray-700 font-mono text-sm relative flex-grow">
        <div className="absolute top-2 right-2 flex space-x-2">
          <button 
            type="button"
            onClick={toggleSolution}
            className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            {showSolution ? 'Hide Solution' : 'Show Solution'}
          </button>
        </div>
        <textarea
          value={showSolution && currentChallenge ? currentChallenge.solution : code}
          onChange={handleCodeChange}
          disabled={showSolution}
          className="w-full h-full min-h-[200px] bg-transparent text-gray-300 focus:outline-none resize-none"
          spellCheck="false"
        />
      </div>
      
      <div className="flex justify-between">
        <button 
          type="button"
          onClick={handleReset}
          className="px-4 py-2 bg-secondary-800 rounded-md hover:bg-secondary-700 transition-colors"
        >
          Reset
        </button>
        <button 
          type="button"
          onClick={runTests}
          disabled={isRunning}
          className={`px-4 py-2 ${isRunning ? 'bg-gray-700' : 'bg-primary hover:bg-primary-600'} rounded-md transition-colors text-secondary flex items-center`}
        >
          {isRunning ? (
            <>
              <svg 
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" 
                xmlns="http://www.w3.org/2000/svg" 
                fill="none" 
                viewBox="0 0 24 24"
                aria-label="Loading indicator"
              >
                <circle 
                  className="opacity-25" 
                  cx="12" 
                  cy="12" 
                  r="10" 
                  stroke="currentColor" 
                  strokeWidth="4" 
                />
                <path 
                  className="opacity-75" 
                  fill="currentColor" 
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" 
                />
              </svg>
              Running...
            </>
          ) : (
            'Run Tests'
          )}
        </button>
      </div>
      
      {/* Test Results */}
      <section className="mt-2">
        <h3 className="text-lg font-medium mb-2">Test Results</h3>
        {testResults ? (
          <div className={`rounded-lg p-4 border ${testResults.passing ? 'bg-green-900/20 border-green-800' : 'bg-red-900/20 border-red-800'}`}>
            <div className="flex items-center mb-3">
              {testResults.passing ? (
                <div className="text-green-500 flex items-center">
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Success icon"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      strokeWidth="2" 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                  All tests passed!
                </div>
              ) : (
                <div className="text-red-500 flex items-center">
                  <svg 
                    className="w-5 h-5 mr-2" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24" 
                    xmlns="http://www.w3.org/2000/svg"
                    aria-label="Error icon"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth="2" 
                      d="M6 18L18 6M6 6l12 12" 
                    />
                  </svg>
                  Some tests failed
                </div>
              )}
            </div>
            
            <ul className="space-y-2">
              {testResults.results.map((result, index) => (
                <li key={`test-result-${index}`} className={`p-2 rounded-md ${result.passing ? 'bg-green-900/30' : 'bg-red-900/30'}`}>
                  <div className="flex items-center">
                    {result.passing ? (
                      <svg 
                        className="w-4 h-4 mr-2 text-green-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Test passed"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    ) : (
                      <svg 
                        className="w-4 h-4 mr-2 text-red-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24" 
                        xmlns="http://www.w3.org/2000/svg"
                        aria-label="Test failed"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                          d="M6 18L18 6M6 6l12 12" 
                        />
                      </svg>
                    )}
                    <span>{result.name}</span>
                  </div>
                  {!result.passing && result.error && (
                    <div className="mt-1 ml-6 text-sm text-red-400">
                      {result.error}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="bg-secondary-800 rounded-lg p-4 border border-gray-700">
            <p className="text-gray-400 text-sm">Run your code to see test results</p>
          </div>
        )}
      </section>
      
      {/* Console Output */}
      <section className="border-t border-gray-800 pt-4 mt-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">JavaScript Console</h3>
          <button 
            type="button"
            className="text-xs px-2 py-1 rounded bg-gray-800 text-gray-300 hover:bg-gray-700 transition-colors"
          >
            Clear
          </button>
        </div>
        <div className="bg-black mt-2 rounded-lg p-3 text-sm font-mono h-24 overflow-y-auto">
          <div className="text-gray-500">{"// Console output will appear here"}</div>
        </div>
      </section>
      
      <footer className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Complete this challenge to unlock the next lesson
        </p>
      </footer>
    </div>
  )
} 