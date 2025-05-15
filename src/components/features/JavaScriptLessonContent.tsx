'use client'

import React from 'react'

interface LessonContentProps {
  lessonId: string;
}

interface CodeExample {
  code: string;
  explanation: string;
}

interface LessonSection {
  title: string;
  content: string;
  examples?: CodeExample[];
}

interface Lesson {
  id: string;
  title: string;
  description: string;
  sections: LessonSection[];
}

// Mock data for JavaScript lessons
const jsLessons: Record<string, Lesson> = {
  'js-vars': {
    id: 'js-vars',
    title: 'Variables & Data Types',
    description:
      'Learn about variables and the fundamental data types in JavaScript.',
    sections: [
      {
        title: 'Declaring Variables',
        content:
          'JavaScript has three ways to declare variables: var, let, and const. Modern JavaScript favors let and const over var.',
        examples: [
          {
            code: 'let name = "John";\nconst age = 30;\nvar isStudent = true;',
            explanation:
              'let allows you to declare variables that can be reassigned. const declares constants that cannot be reassigned. var is the older way to declare variables.',
          },
        ],
      },
      {
        title: 'Primitive Data Types',
        content:
          'JavaScript has 7 primitive data types: String, Number, Boolean, null, undefined, Symbol, and BigInt.',
        examples: [
          {
            code: 'let name = "John"; // String\nlet age = 30; // Number\nlet isStudent = true; // Boolean\nlet score = null; // null (intentional absence of value)\nlet result; // undefined (unintentionally missing value)',
            explanation:
              'Primitive values are immutable (cannot be changed) and are passed by value.',
          },
        ],
      },
      {
        title: 'Complex Data Types',
        content:
          'Objects and Arrays are complex data types that can store collections of data.',
        examples: [
          {
            code: '// Object\nconst person = {\n  name: "John",\n  age: 30,\n  isStudent: true\n};\n\n// Array\nconst colors = ["red", "green", "blue"];',
            explanation:
              'Objects store data in key-value pairs. Arrays are ordered collections of values. Both are passed by reference.',
          },
        ],
      },
    ],
  },
  'js-operators': {
    id: 'js-operators',
    title: 'Operators & Expressions',
    description: 'Learn about the various operators and how to form expressions in JavaScript.',
    sections: [
      {
        title: 'Arithmetic Operators',
        content:
          'JavaScript supports standard arithmetic operations for performing calculations.',
        examples: [
          {
            code: 'let a = 10;\nlet b = 5;\n\nlet sum = a + b; // 15\nlet difference = a - b; // 5\nlet product = a * b; // 50\nlet quotient = a / b; // 2\nlet remainder = a % b; // 0',
            explanation:
              'These operators work similarly to mathematics and are used for performing calculations.',
          },
        ],
      },
      {
        title: 'Comparison Operators',
        content:
          'Comparison operators compare values and return a boolean result.',
        examples: [
          {
            code: 'let x = 5;\nlet y = 10;\n\nx === y; // false (equal to)\nx !== y; // true (not equal to)\nx > y; // false (greater than)\nx < y; // true (less than)\nx >= y; // false (greater than or equal to)\nx <= y; // true (less than or equal to)',
            explanation:
              'Use === and !== instead of == and != for strict equality checking that considers both value and type.',
          },
        ],
      },
      {
        title: 'Logical Operators',
        content:
          'Logical operators perform logical operations and are often used with conditional statements.',
        examples: [
          {
            code: 'let isAdult = true;\nlet hasLicense = false;\n\nisAdult && hasLicense; // false (logical AND)\nisAdult || hasLicense; // true (logical OR)\n!isAdult; // false (logical NOT)',
            explanation:
              'Logical operators are used to combine multiple conditions and determine the final result.',
          },
        ],
      },
    ],
  },
  'js-control': {
    id: 'js-control',
    title: 'Control Flow',
    description: 'Learn how to control the flow of your program with conditional statements and loops.',
    sections: [
      {
        title: 'Conditional Statements',
        content:
          'Conditional statements help you execute different code blocks based on different conditions.',
        examples: [
          {
            code: 'let age = 18;\n\nif (age >= 18) {\n  console.log("You are an adult");\n} else {\n  console.log("You are a minor");\n}\n\n// Using else if\nlet grade = 85;\n\nif (grade >= 90) {\n  console.log("A");\n} else if (grade >= 80) {\n  console.log("B");\n} else if (grade >= 70) {\n  console.log("C");\n} else {\n  console.log("F");\n}',
            explanation:
              'The if statement executes a block of code if a specified condition is true. The else statement specifies a block of code to be executed if the condition is false.',
          },
        ],
      },
      {
        title: 'Switch Statement',
        content:
          'The switch statement is used to perform different actions based on different conditions.',
        examples: [
          {
            code: 'let day = "Monday";\n\nswitch (day) {\n  case "Monday":\n    console.log("Start of the week");\n    break;\n  case "Friday":\n    console.log("End of the week");\n    break;\n  default:\n    console.log("Regular day");\n    break;\n}',
            explanation:
              'The switch statement evaluates an expression, matching the expression\'s value to a case clause, and executes statements associated with that case. Don\'t forget the break statement to prevent fall-through!',
          },
        ],
      },
      {
        title: 'Loops',
        content:
          'Loops are used to execute a block of code a specified number of times or until a specific condition is met.',
        examples: [
          {
            code: '// For loop\nfor (let i = 0; i < 5; i++) {\n  console.log(i); // 0, 1, 2, 3, 4\n}\n\n// While loop\nlet i = 0;\nwhile (i < 5) {\n  console.log(i); // 0, 1, 2, 3, 4\n  i++;\n}\n\n// For...of loop (arrays)\nconst colors = ["red", "green", "blue"];\nfor (const color of colors) {\n  console.log(color);\n}\n\n// For...in loop (objects)\nconst person = { name: "John", age: 30 };\nfor (const key in person) {\n  console.log(key + ": " + person[key]);\n}',
            explanation:
              'Different types of loops are used in different scenarios. For loops are good when you know the number of iterations, while loops are useful when the condition might change during execution.',
          },
        ],
      },
    ],
  }
};

export default function JavaScriptLessonContent({ lessonId }: LessonContentProps) {
  const lesson = jsLessons[lessonId];

  if (!lesson) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-semibold text-gray-400">Lesson content coming soon!</h2>
        <p className="mt-2 text-gray-500">This lesson is still under development.</p>
      </div>
    );
  }

  return (
    <div className="prose prose-invert max-w-none">
      <h1 className="text-2xl font-bold mb-4">{lesson.title}</h1>
      <p className="text-gray-300 mb-6">{lesson.description}</p>

      <div className="space-y-8">
        {lesson.sections.map((section, idx) => (
          <div key={`section-${lesson.id}-${idx}`} className="bg-secondary-800/50 rounded-lg p-5 border border-gray-800">
            <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
            <p className="text-gray-300 mb-4">{section.content}</p>
            
            {section.examples?.map((example, exIdx) => (
              <div key={`example-${lesson.id}-${idx}-${exIdx}`} className="mt-4">
                <div className="bg-gray-900 rounded-md p-3 font-mono text-sm overflow-x-auto">
                  {example.code.split('\n').map((line, lineIdx) => (
                    <div key={`line-${lesson.id}-${idx}-${exIdx}-${lineIdx}`} className="whitespace-pre">
                      {line}
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-sm text-gray-400">{example.explanation}</p>
              </div>
            ))}
          </div>
        ))}
      </div>

      <div className="mt-8 border-t border-gray-800 pt-6">
        <div className="flex justify-between items-center">
          <button 
            type="button"
            className="px-3 py-1.5 bg-secondary-800 rounded-md hover:bg-secondary-700 transition-colors text-sm"
          >
            Previous Lesson
          </button>
          <button 
            type="button"
            className="px-3 py-1.5 bg-primary rounded-md hover:bg-primary-700 transition-colors text-secondary text-sm"
          >
            Next Lesson
          </button>
        </div>
      </div>
    </div>
  )
} 