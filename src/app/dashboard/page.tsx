'use client';

import { useState, useEffect } from 'react';
// Remove auth import
// import { useAuth } from '@/lib/useAuth';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';

// Define CV type here since we can't import it from server components
type CV = {
  id: string;
  title: string;
  content: any;
  template: string;
  createdAt: Date;
  updatedAt: Date;
};

export default function Dashboard() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const response = await fetch('/api/cvs');
        if (!response.ok) {
          throw new Error('Failed to fetch CVs');
        }
        
        const data = await response.json();
        setCvs(data || []);
      } catch (error) {
        console.error('Error fetching CVs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCVs();
  }, []);

  const handleCreateNewCV = async () => {
    try {
      const response = await fetch('/api/cvs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'Untitled CV',
          content: {
            sections: [
              {
                id: uuidv4(),
                type: 'summary',
                title: 'Professional Summary',
                content: 'A brief professional summary',
              },
              {
                id: uuidv4(),
                type: 'experience',
                title: 'Work Experience',
                content: [],
              },
              {
                id: uuidv4(),
                type: 'education',
                title: 'Education',
                content: [],
              },
              {
                id: uuidv4(),
                type: 'skills',
                title: 'Skills',
                content: [],
              },
            ],
          },
          template: 'modern',
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create CV');
      }
      
      const newCV = await response.json();
      router.push(`/editor/${newCV.id}`);
    } catch (error) {
      console.error('Error creating CV:', error);
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My CVs</h1>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button"
            onClick={handleCreateNewCV}
          >
            Create New CV
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card">
          <p className="text-center">Loading your CVs...</p>
        </div>
      ) : cvs.length === 0 ? (
        <div className="glass-card text-center py-12">
          <h2 className="text-xl mb-4">You don't have any CVs yet</h2>
          <p className="mb-6">Create your first CV to get started</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button inline-block"
            onClick={handleCreateNewCV}
          >
            Create New CV
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <div key={cv.id} className="relative">
              <Link href={`/editor/${cv.id}`}>
                <motion.div
                  className="glass-card h-48 cursor-pointer"
                  whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(31, 38, 135, 0.4)' }}
                  transition={{ type: 'spring', stiffness: 300 }}
                >
                  <h2 className="text-xl font-semibold mb-2">{cv.title}</h2>
                  <p className="text-sm opacity-70">
                    Last updated: {new Date(cv.updatedAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4 text-sm">
                    <p>Template: {cv.template}</p>
                    <p>Sections: {
                      typeof cv.content === 'object' && 
                      cv.content !== null && 
                      Array.isArray((cv.content as any).sections) 
                        ? (cv.content as any).sections.length
                        : 0
                    }</p>
                  </div>
                </motion.div>
              </Link>
              <div className="absolute right-2 bottom-2 flex gap-2">
                <a 
                  href={`/api/cvs/${cv.id}/export`} 
                  download={`cv-${cv.title}.json`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 bg-purple-500 bg-opacity-20 rounded-full"
                    title="Download CV as JSON"
                  >
                    <DownloadIcon className="w-4 h-4" />
                  </motion.button>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
} 