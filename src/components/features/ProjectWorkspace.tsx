'use client'

import { useState } from 'react'
import { Folder, File, Settings, Play, Save } from 'lucide-react'
import CodeEditor from './CodeEditor'

interface FileStructure {
  name: string
  type: 'file' | 'folder'
  content?: string
  children?: FileStructure[]
}

interface ProjectWorkspaceProps {
  project: {
    name: string
    description: string
    files: FileStructure[]
  }
}

export default function ProjectWorkspace({ project }: ProjectWorkspaceProps) {
  const [selectedFile, setSelectedFile] = useState<FileStructure | null>(null)

  const renderFileTree = (items: FileStructure[], level = 0) => {
    return items.map((item) => (
      <div key={item.name} style={{ paddingLeft: `${level * 1.5}rem` }}>
        <button
          onClick={() => item.type === 'file' && setSelectedFile(item)}
          className={`flex items-center space-x-2 w-full px-3 py-1.5 rounded-lg hover:bg-gray-800 transition-colors ${
            selectedFile?.name === item.name ? 'bg-gray-800' : ''
          }`}
          type="button"
        >
          {item.type === 'folder' ? (
            <Folder className="w-4 h-4 text-primary" />
          ) : (
            <File className="w-4 h-4 text-gray-400" />
          )}
          <span className="text-sm">{item.name}</span>
        </button>
        {item.children && renderFileTree(item.children, level + 1)}
      </div>
    ))
  }

  return (
    <div className="h-full flex">
      {/* File Explorer */}
      <div className="w-64 bg-secondary border-r border-gray-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold">{project.name}</h2>
          <Settings className="w-4 h-4 text-gray-400" />
        </div>
        <div>{renderFileTree(project.files)}</div>
      </div>

      {/* Editor */}
      <div className="flex-1 flex flex-col">
        {selectedFile ? (
          <>
            <div className="bg-secondary border-b border-gray-800 px-4 py-2 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <File className="w-4 h-4 text-gray-400" />
                <span className="text-sm">{selectedFile.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
                  <Save className="w-4 h-4" />
                </button>
                <button className="p-1.5 text-gray-400 hover:text-white transition-colors">
                  <Play className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="flex-1 p-4">
              <CodeEditor
                initialCode={selectedFile.content || ''}
                language={selectedFile.name.split('.').pop() || 'text'}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a file to edit
          </div>
        )}
      </div>
    </div>
  )
} 