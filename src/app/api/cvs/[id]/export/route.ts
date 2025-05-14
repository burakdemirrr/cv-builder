import { NextRequest, NextResponse } from 'next/server';
import { getCVById } from '@/lib/cv-service';

// GET endpoint to export a CV as JSON
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const cv = getCVById(params.id);
    
    if (!cv) {
      return NextResponse.json(
        { error: 'CV not found' },
        { status: 404 }
      );
    }
    
    // Set headers for file download
    const headers = new Headers();
    headers.set('Content-Disposition', `attachment; filename="cv-${cv.title.replace(/\s+/g, '-')}.json"`);
    headers.set('Content-Type', 'application/json');
    
    // Return JSON data as a downloadable file
    return new NextResponse(JSON.stringify(cv, null, 2), {
      status: 200,
      headers
    });
  } catch (error) {
    console.error('Error exporting CV:', error);
    return NextResponse.json(
      { error: 'Failed to export CV' },
      { status: 500 }
    );
  }
} 