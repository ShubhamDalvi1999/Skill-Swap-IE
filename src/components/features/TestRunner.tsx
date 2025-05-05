'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Icon from '@/components/ui/Icon'
import { ICONS } from '@/lib/icons'
import { cn } from '@/lib/utils'

type TestCase = {
  id: string
  input: string
  expectedOutput: string
  actualOutput?: string
  status: 'pending' | 'running' | 'passed' | 'failed'
}

type TestRunnerProps = {
  testCases: TestCase[]
  onRunTests: () => void
  isRunning: boolean
}

export default function TestRunner({ testCases, onRunTests, isRunning }: TestRunnerProps) {
  const getStatusIcon = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return <Icon name={ICONS.success} className="w-5 h-5 text-green-500" />
      case 'failed':
        return <Icon name={ICONS.error} className="w-5 h-5 text-red-500" />
      case 'running':
        return <Icon name={ICONS.duration} className="w-5 h-5 text-yellow-500 animate-spin" />
      default:
        return <Icon name={ICONS.inProgress} className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusColor = (status: TestCase['status']) => {
    switch (status) {
      case 'passed':
        return 'border-green-500/20 bg-green-500/10'
      case 'failed':
        return 'border-red-500/20 bg-red-500/10'
      case 'running':
        return 'border-yellow-500/20 bg-yellow-500/10'
      default:
        return 'border-gray-500/20'
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Test Cases</h2>
        <Button 
          onClick={onRunTests} 
          disabled={isRunning}
          variant="secondary"
        >
          {isRunning ? 'Running Tests...' : 'Run Tests'}
        </Button>
      </div>
      <div className="space-y-2">
        {testCases.map((test) => (
          <Card
            key={test.id}
            className={cn(
              'p-4 border',
              getStatusColor(test.status)
            )}
          >
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-mono text-sm">
                  <span className="text-gray-400">Input:</span> {test.input}
                </div>
                <div className="font-mono text-sm">
                  <span className="text-gray-400">Expected:</span> {test.expectedOutput}
                </div>
                {test.actualOutput && (
                  <div className="font-mono text-sm">
                    <span className="text-gray-400">Actual:</span> {test.actualOutput}
                  </div>
                )}
              </div>
              <div>{getStatusIcon(test.status)}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
} 