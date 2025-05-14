import { NextRequest, NextResponse } from 'next/server';
import { getCVById, updateCV, deleteCV, exportCV } from '@/lib/cv-service';

// GET endpoint to retrieve a specific CV
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
    
    return NextResponse.json(cv);
  } catch (error) {
    console.error('Error fetching CV:', error);
    return NextResponse.json(
      { error: 'Failed to fetch CV' },
      { status: 500 }
    );
  }
}

// PATCH endpoint to update a CV
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await req.json();
    
    const updatedCV = updateCV(params.id, data);
    
    return NextResponse.json(updatedCV);
  } catch (error) {
    console.error('Error updating CV:', error);
    return NextResponse.json(
      { error: 'Failed to update CV' },
      { status: 500 }
    );
  }
}

// DELETE endpoint to delete a CV
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    deleteCV(params.id);
    
    return NextResponse.json(
      { success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting CV:', error);
    return NextResponse.json(
      { error: 'Failed to delete CV' },
      { status: 500 }
    );
  }
} 