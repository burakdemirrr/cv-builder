'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/useAuth';
import { supabase, CV } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { useRouter } from 'next/navigation';
import DragDropContainer from '@/components/DragDropContainer';
import TemplateSelector from '@/components/TemplateSelector';
import { exportToPDF } from '@/lib/pdfExport';
import { motion } from 'framer-motion';

export default function EditorPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [cv, setCV] = useState<CV | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  // Get state from Zustand store
  const { 
    title, 
    content, 
    template, 
    setTitle, 
    setTemplate 
  } = useStore();

  useEffect(() => {
    // Redirect if not authenticated
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  // Fetch CV data
  useEffect(() => {
    const fetchCV = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('cvs')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setCV(data);
          // Initialize Zustand store with CV data
          setTitle(data.title);
          setTemplate(data.template);
          // Initialize sections in the store
          useStore.setState({ content: data.content });
        }
      } catch (error) {
        console.error('Error fetching CV:', error);
        setError('Failed to load CV data');
      } finally {
        setLoading(false);
      }
    };

    fetchCV();
  }, [id, user, setTitle, setTemplate]);

  // Save CV data
  const saveCV = async () => {
    if (!user || !cv) return;
    
    setSaving(true);
    
    try {
      const { error } = await supabase
        .from('cvs')
        .update({
          title,
          content,
          template,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id);
        
      if (error) throw error;
      
    } catch (error) {
      console.error('Error saving CV:', error);
      setError('Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  // Handle PDF export
  const handleExport = async () => {
    await exportToPDF('cv-content', `${title.replace(/\s+/g, '-')}.pdf`);
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="glass-card">
          <p className="text-xl">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="glass-card">
          <p className="text-xl text-red-400">{error}</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="glass-button mt-4"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-20">
      <div className="flex flex-col md:flex-row justify-between items-start gap-6">
        {/* Editor sidebar */}
        <div className="w-full md:w-1/3 lg:w-1/4">
          <div className="glass-card mb-6">
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium mb-1">
                CV Title
              </label>
              <input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="glass-input w-full"
              />
            </div>
            
            <TemplateSelector 
              selectedTemplate={template} 
              onSelectTemplate={setTemplate} 
            />
            
            <div className="flex gap-3 mt-6">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex-1"
                onClick={saveCV}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save'}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="glass-button flex-1"
                onClick={handleExport}
              >
                Export PDF
              </motion.button>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button w-full mt-3"
              onClick={() => router.push('/dashboard')}
            >
              Back to Dashboard
            </motion.button>
          </div>
          
          <DragDropContainer />
        </div>
        
        {/* CV Preview */}
        <div className="w-full md:w-2/3 lg:w-3/4">
          <div className="glass-card">
            <div id="cv-content" className={`bg-white text-black p-8 rounded-lg shadow-lg ${template}`}>
              {/* CV content will be rendered here based on selected template */}
              <h1 className="text-3xl font-bold">{title}</h1>
              
              {content.sections.map((section) => (
                <div key={section.id} className="mt-6">
                  <h2 className="text-xl font-semibold border-b border-gray-300 pb-1 mb-3">
                    {section.title}
                  </h2>
                  
                  {section.type === 'summary' && (
                    <p>{section.content}</p>
                  )}
                  
                  {section.type === 'experience' && Array.isArray(section.content) && (
                    <div className="space-y-4">
                      {section.content.map((item: any, index: number) => (
                        <div key={index}>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.company} | {item.period}</p>
                          <p className="mt-1">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {section.type === 'education' && Array.isArray(section.content) && (
                    <div className="space-y-4">
                      {section.content.map((item: any, index: number) => (
                        <div key={index}>
                          <h3 className="font-medium">{item.degree}</h3>
                          <p className="text-sm text-gray-600">{item.institution} | {item.period}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {section.type === 'skills' && Array.isArray(section.content) && (
                    <div className="flex flex-wrap gap-2">
                      {section.content.map((skill: string, index: number) => (
                        <span 
                          key={index}
                          className="bg-gray-100 px-2 py-1 rounded text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 