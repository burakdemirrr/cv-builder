// No need for server-only functionality anymore
// import 'server-only';
// import prisma from './prisma';
// import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';

export type CVContent = {
  sections: CVSection[];
};

export type CVSection = {
  id: string;
  type: 'experience' | 'education' | 'skills' | 'projects' | 'summary' | 'contact';
  title: string;
  content: any;
};

// Define CV type based on Prisma model
export type CV = {
  id: string;
  title: string;
  content: any;
  template: string;
  createdAt: Date;
  updatedAt: Date;
};

// In-memory storage for CVs during the session
let cvs: CV[] = [];

export function getAllCVs(): CV[] {
  return cvs;
}

export function getCVById(id: string): CV | undefined {
  return cvs.find(cv => cv.id === id);
}

export function createCV(
  title: string,
  content: any,
  template: string
): CV {
  const newCV: CV = {
    id: uuidv4(),
    title,
    content,
    template,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
  
  cvs.push(newCV);
  return newCV;
}

export function updateCV(
  id: string,
  data: {
    title?: string;
    content?: any;
    template?: string;
  }
): CV {
  const index = cvs.findIndex(cv => cv.id === id);
  if (index === -1) {
    throw new Error('CV not found');
  }
  
  const updatedCV = {
    ...cvs[index],
    ...data,
    updatedAt: new Date()
  };
  
  cvs[index] = updatedCV;
  return updatedCV;
}

export function deleteCV(id: string): void {
  const index = cvs.findIndex(cv => cv.id === id);
  if (index !== -1) {
    cvs.splice(index, 1);
  }
}

// Function to export CV as PDF or JSON
export function exportCV(id: string, format: 'pdf' | 'json') {
  const cv = getCVById(id);
  if (!cv) {
    throw new Error('CV not found');
  }
  
  if (format === 'json') {
    return JSON.stringify(cv);
  }
  
  // For PDF you'd implement actual PDF generation
  // This is just a placeholder
  return 'PDF generation would happen here';
} 