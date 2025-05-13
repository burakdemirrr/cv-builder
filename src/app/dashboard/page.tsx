'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { supabase, CV } from '@/lib/supabase';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [cvs, setCvs] = useState<CV[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, loading: authLoading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    const fetchCVs = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('user_id', user.id)
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        setCvs(data || []);
      } catch (error) {
        console.error('Error fetching CVs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCVs();
  }, [user]);

  const createNewCV = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from('cvs')
        .insert([
          {
            user_id: user.id,
            title: 'Untitled CV',
            content: {
              sections: [
                {
                  id: crypto.randomUUID(),
                  type: 'summary',
                  title: 'Professional Summary',
                  content: 'A brief professional summary',
                },
                {
                  id: crypto.randomUUID(),
                  type: 'experience',
                  title: 'Work Experience',
                  content: [],
                },
                {
                  id: crypto.randomUUID(),
                  type: 'education',
                  title: 'Education',
                  content: [],
                },
                {
                  id: crypto.randomUUID(),
                  type: 'skills',
                  title: 'Skills',
                  content: [],
                },
              ],
            },
            template: 'modern',
          },
        ])
        .select();
        
      if (error) throw error;
      
      if (data && data[0]) {
        router.push(`/editor/${data[0].id}`);
      }
    } catch (error) {
      console.error('Error creating CV:', error);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="glass-card">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My CVs</h1>
        <div className="flex gap-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button"
            onClick={createNewCV}
          >
            Create New CV
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button bg-red-500 bg-opacity-20"
            onClick={signOut}
          >
            Sign Out
          </motion.button>
        </div>
      </div>

      {loading ? (
        <div className="glass-card">
          <p className="text-center">Loading your CVs...</p>
        </div>
      ) : cvs.length === 0 ? (
        <div className="glass-card text-center py-12">
          <h2 className="text-xl mb-4">You don&apos;t have any CVs yet</h2>
          <p className="mb-6">Create your first CV to get started</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="glass-button inline-block"
            onClick={createNewCV}
          >
            Create New CV
          </motion.button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cvs.map((cv) => (
            <Link href={`/editor/${cv.id}`} key={cv.id}>
              <motion.div
                className="glass-card h-48 cursor-pointer"
                whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(31, 38, 135, 0.4)' }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <h2 className="text-xl font-semibold mb-2">{cv.title}</h2>
                <p className="text-sm opacity-70">
                  Last updated: {new Date(cv.updated_at).toLocaleDateString()}
                </p>
                <div className="mt-4 text-sm">
                  <p>Template: {cv.template}</p>
                  <p>Sections: {cv.content.sections.length}</p>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
} 