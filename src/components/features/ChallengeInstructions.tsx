'use client'

import Icon from '@/components/ui/Icon'
import { ICONS } from '@/lib/icons'

interface TestCase {
  input: string
  expectedOutput: string
}

interface ChallengeInstructionsProps {
  title: string
  difficulty: 'easy' | 'medium' | 'hard'
  description: string
  examples: TestCase[]
  constraints?: string[]
}

const difficultyColors = {
  easy: 'text-green-500',
  medium: 'text-yellow-500',
  hard: 'text-red-500',
}

export default function ChallengeInstructions({
  title,
  difficulty,
  description,
  examples,
  constraints = [],
}: ChallengeInstructionsProps) {
  return (
    <div className="h-full flex flex-col bg-secondary rounded-lg overflow-hidden">
      <div className="p-6 border-b border-gray-700">
        <h2 className="text-2xl font-semibold mb-2">{title}</h2>
        <div className={`text-sm font-medium ${difficultyColors[difficulty]} mb-4`}>
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
        </div>
        <p className="text-gray-300">{description}</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-lg font-semibold mb-4">Examples</h3>
          <div className="space-y-4">
            {examples.map((example, index) => (
              <div key={`example-${index}`} className="bg-gray-800 rounded-lg p-4">
                <div className="mb-2">
                  <span className="text-gray-400">Input: </span>
                  <code className="text-primary">{example.input}</code>
                </div>
                <div>
                  <span className="text-gray-400">Expected Output: </span>
                  <code className="text-accent">{example.expectedOutput}</code>
                </div>
              </div>
            ))}
          </div>
        </div>

        {constraints.length > 0 && (
          <div className="p-6">
            <h3 className="text-lg font-semibold mb-4">Constraints</h3>
            <ul className="list-disc list-inside space-y-2 text-gray-300">
              {constraints.map((constraint, index) => (
                <li key={`constraint-${index}`}>{constraint}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="p-4 bg-gray-800 border-t border-gray-700">
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <Icon name={ICONS.info} className="w-4 h-4" />
          <span>Submit your solution to check if it passes all test cases</span>
        </div>
      </div>
    </div>
  )
} 