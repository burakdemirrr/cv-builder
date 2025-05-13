'use client';

import { useState } from 'react';
import { useStore } from '@/lib/store';
import { motion, Reorder } from 'framer-motion';
import SectionCard from './SectionCard';
import { CVSection } from '@/lib/supabase';

const sectionTypes = [
  { type: 'summary', label: 'Professional Summary' },
  { type: 'experience', label: 'Work Experience' },
  { type: 'education', label: 'Education' },
  { type: 'skills', label: 'Skills' },
  { type: 'projects', label: 'Projects' },
  { type: 'contact', label: 'Contact Information' },
] as const;

export default function DragDropContainer() {
  const [showAddMenu, setShowAddMenu] = useState(false);
  const { content, reorderSections, addSection, removeSection } = useStore();
  
  // Handle section reordering
  const handleReorder = (reorderedSections: CVSection[]) => {
    reorderSections(reorderedSections);
  };
  
  // Handle adding a new section
  const handleAddSection = (type: CVSection['type'], title: string) => {
    addSection(type, title);
    setShowAddMenu(false);
  };
  
  // Handle removing a section
  const handleRemoveSection = (id: string) => {
    removeSection(id);
  };
  
  return (
    <div className="glass-card">
      <h2 className="text-xl font-semibold mb-4">CV Sections</h2>
      
      <div className="mb-6">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="glass-button w-full"
          onClick={() => setShowAddMenu(!showAddMenu)}
        >
          {showAddMenu ? 'Cancel' : 'Add Section'}
        </motion.button>
        
        {showAddMenu && (
          <motion.div 
            className="mt-3 space-y-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            {sectionTypes.map((section) => (
              <motion.button
                key={section.type}
                className="glass-button w-full text-left text-sm py-2"
                whileHover={{ x: 5 }}
                onClick={() => handleAddSection(section.type, section.label)}
              >
                {section.label}
              </motion.button>
            ))}
          </motion.div>
        )}
      </div>
      
      <Reorder.Group 
        axis="y" 
        values={content.sections} 
        onReorder={handleReorder}
        className="space-y-3"
      >
        {content.sections.map((section) => (
          <Reorder.Item
            key={section.id}
            value={section}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="cursor-grab active:cursor-grabbing"
          >
            <SectionCard 
              section={section} 
              onRemove={() => handleRemoveSection(section.id)} 
            />
          </Reorder.Item>
        ))}
      </Reorder.Group>
      
      {content.sections.length === 0 && (
        <p className="text-center py-4 text-gray-400">
          No sections added yet. Click &quot;Add Section&quot; to get started.
        </p>
      )}
    </div>
  );
} 