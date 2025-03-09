// src/app/api/placeholder/[width]/[height]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import * as path from 'path';
import * as fs from 'fs';

/**
 * Simple placeholder image generator
 * Outputs an SVG with the specified dimensions and text showing the dimensions
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  try {
    const width = parseInt(params.width);
    const height = parseInt(params.height);
    
    // Validate dimensions
    if (isNaN(width) || isNaN(height) || width <= 0 || height <= 0 || width > 1200 || height > 1200) {
      return new NextResponse('Invalid dimensions. Width and height must be between 1 and 1200.', {
        status: 400,
        headers: {
          'Content-Type': 'text/plain'
        }
      });
    }
    
    // Create SVG placeholder
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="${width}" height="${height}" fill="#CCCCCC"/>
      <rect width="${width}" height="${height}" fill="url(#pattern)"/>
      <defs>
        <pattern id="pattern" patternUnits="userSpaceOnUse" width="10" height="10" patternTransform="rotate(45)">
          <rect width="6" height="6" fill="#BBBBBB"/>
        </pattern>
      </defs>
      <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.max(14, Math.min(width, height) / 10)}px" 
        fill="#888888" text-anchor="middle" dominant-baseline="middle">
        ${width}×${height}
      </text>
    </svg>`;
    
    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=31536000, immutable'
      }
    });
  } catch (error) {
    console.error('Error generating placeholder image:', error);
    return new NextResponse('Error generating placeholder image', {
      status: 500,
      headers: {
        'Content-Type': 'text/plain'
      }
    });
  }
}