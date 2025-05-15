'use client'

import React from 'react'

export default function BuildPage() {
  return (
    <article className="space-y-6">
      <header>
        <h2 className="text-xl font-semibold mb-4">Project Implementation</h2>
      </header>
      
      {/* File Structure Explorer */}
      <section className="mb-6">
        <h3 className="text-md font-medium text-primary mb-2">Project Files</h3>
        <div className="bg-gray-900 rounded-lg p-4 border border-gray-700">
          <ul className="space-y-1 text-sm">
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">📁</span>
              <span>src</span>
            </li>
            <li className="flex items-center ml-5">
              <span className="text-yellow-400 mr-2">📄</span>
              <span className="text-white">index.html</span>
            </li>
            <li className="flex items-center ml-5">
              <span className="text-yellow-400 mr-2">📄</span>
              <span>styles.css</span>
            </li>
            <li className="flex items-center ml-5">
              <span className="text-yellow-400 mr-2">📄</span>
              <span>app.js</span>
            </li>
            <li className="flex items-center">
              <span className="text-blue-400 mr-2">📁</span>
              <span>assets</span>
            </li>
            <li className="flex items-center">
              <span className="text-gray-500 mr-2">📄</span>
              <span className="text-gray-500">README.md</span>
            </li>
          </ul>
        </div>
      </section>
      
      {/* Code Editor */}
      <section className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-md font-medium text-primary">Code Editor</h3>
          <div className="flex space-x-2">
            <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded">HTML</span>
            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">JavaScript</span>
            <span className="text-xs bg-purple-500/20 text-purple-400 px-2 py-1 rounded">CSS</span>
          </div>
        </div>
        <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-gray-300 h-64 border border-gray-700">
          <div className="text-gray-500">{"// Weather App - Main JavaScript"}</div>
          <div className="text-blue-400">{"document.addEventListener('DOMContentLoaded', () => {"}</div>
          <div className="ml-4 text-green-400">{"const searchForm = document.getElementById('search-form');"}</div>
          <div className="ml-4 text-green-400">{"const cityInput = document.getElementById('city-input');"}</div>
          <div className="ml-4 text-green-400">{"const weatherDisplay = document.getElementById('weather-display');"}</div>
          <div className="ml-4" />
          <div className="ml-4 text-yellow-400">{"// TODO: Add API key and fetch implementation"}</div>
          <div className="text-blue-400">{"})"}</div>
        </div>
      </section>
      
      {/* Preview Section */}
      <section>
        <h3 className="text-md font-medium text-primary mb-2">App Preview</h3>
        <div className="bg-white rounded-lg p-4 border border-gray-700 text-center h-48 flex items-center justify-center">
          <div className="text-gray-800">
            <p className="font-semibold">Weather App Preview</p>
            <p className="text-sm text-gray-600">Your implementation will appear here</p>
          </div>
        </div>
      </section>
      
      <footer className="flex justify-between mt-6">
        <button 
          type="button"
          className="px-4 py-2 bg-secondary-800 rounded-md hover:bg-secondary-700 transition-colors"
        >
          Save Progress
        </button>
        <button 
          type="button"
          className="px-4 py-2 bg-primary rounded-md hover:bg-primary-600 transition-colors text-secondary"
        >
          Deploy Project
        </button>
      </footer>
    </article>
  )
} 