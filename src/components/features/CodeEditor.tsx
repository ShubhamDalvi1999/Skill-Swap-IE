'use client'

import { useState } from 'react'
import { Play, RotateCcw } from 'lucide-react'

interface CodeEditorProps {
  initialCode?: string
  language?: string
  onRun?: (code: string) => void
}

export default function CodeEditor({ 
  initialCode = '// Write your code here',
  language = 'javascript',
  onRun 
}: CodeEditorProps) {
  const [code, setCode] = useState(initialCode)

  return (
    <div className="h-full flex flex-col bg-secondary rounded-lg overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
        </div>
        <div className="text-sm text-gray-400">{language}</div>
      </div>
      
      <div className="flex-1 p-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full h-full bg-transparent text-white font-mono resize-none focus:outline-none"
          spellCheck="false"
        />
      </div>

      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-t border-gray-700">
        <button
          onClick={() => setCode(initialCode)}
          className="flex items-center space-x-2 text-sm text-gray-400 hover:text-white transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset</span>
        </button>
        <button
          onClick={() => onRun?.(code)}
          className="flex items-center space-x-2 px-4 py-1.5 bg-primary text-secondary rounded-md hover:bg-primary/90 transition-colors"
        >
          <Play className="w-4 h-4" />
          <span>Run</span>
        </button>
      </div>
    </div>
  )
} 