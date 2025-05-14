import { NextRequest, NextResponse } from 'next/server';
import { getAllCVs, createCV } from '@/lib/cv-service';

// GET endpoint to retrieve all CVs
export async function GET() {
  try {
    const cvs = getAllCVs();
    return NextResponse.json(cvs);
  } catch (error) {
    console.error('Error fetching CVs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CVs' },
      { status: 500 }
    );
  }
}

// POST endpoint to create a new CV
export async function POST(req: NextRequest) {
  try {
    const { title, content, template } = await req.json();
    
    if (!title || !content || !template) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    const newCV = createCV(
      title,
      content,
      template
    );
    
    return NextResponse.json(newCV, { status: 201 });
  } catch (error) {
    console.error('Error creating CV:', error);
    return NextResponse.json(
      { error: 'Failed to create CV' },
      { status: 500 }
    );
  }
} 