import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Read the swagger.json file
    const swaggerPath = path.join(process.cwd(), 'src', 'app', 'api', 'swagger.json')
    const swaggerContent = fs.readFileSync(swaggerPath, 'utf-8')
    const swaggerSpec = JSON.parse(swaggerContent)
    
    // Return the Swagger specification
    return NextResponse.json(swaggerSpec)
  } catch (error) {
    console.error('Error serving Swagger specification:', error)
    return NextResponse.json(
      { error: 'Failed to load API documentation' },
      { status: 500 }
    )
  }
} 