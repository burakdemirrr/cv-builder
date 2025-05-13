'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CVSection } from '@/lib/supabase';
import { useStore } from '@/lib/store';

interface SectionCardProps {
  section: CVSection;
  onRemove: () => void;
}

export default function SectionCard({ section, onRemove }: SectionCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(section.title);
  const { updateSection } = useStore();
  
  // Handle saving the section title
  const handleSave = () => {
    updateSection(section.id, { title });
    setIsEditing(false);
  };
  
  // Handle key press events for input
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setTitle(section.title);
      setIsEditing(false);
    }
  };
  
  // Get the section icon based on type
  const getSectionIcon = (type: CVSection['type']) => {
    switch (type) {
      case 'summary':
        return '📝';
      case 'experience':
        return '💼';
      case 'education':
        return '🎓';
      case 'skills':
        return '🛠️';
      case 'projects':
        return '🚀';
      case 'contact':
        return '📞';
      default:
        return '📄';
    }
  };
  
  return (
    <div className="glass-card p-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span className="text-xl" role="img" aria-label={section.type}>
          {getSectionIcon(section.type)}
        </span>
        
        {isEditing ? (
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={handleSave}
            onKeyDown={handleKeyDown}
            className="glass-input py-1 px-2"
            autoFocus
          />
        ) : (
          <span className="font-medium">{section.title}</span>
        )}
      </div>
      
      <div className="flex gap-2">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 hover:bg-white hover:bg-opacity-10 rounded"
          onClick={() => setIsEditing(!isEditing)}
          title={isEditing ? "Save" : "Edit title"}
        >
          {isEditing ? '💾' : '✏️'}
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="p-1 hover:bg-white hover:bg-opacity-10 rounded text-red-300"
          onClick={onRemove}
          title="Remove section"
        >
          🗑️
        </motion.button>
      </div>
    </div>
  );
} 