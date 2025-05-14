import { useState } from 'react';
import { CVSection } from '@/lib/supabase';
import { useStore } from '@/lib/store';
import { motion } from 'framer-motion';

interface SectionEditorProps {
  section: CVSection;
}

export default function SectionEditor({ section }: SectionEditorProps) {
  const { updateSection } = useStore();
  
  // For summary section (text)
  const [summaryText, setSummaryText] = useState(section.content || '');
  
  // For experience, education, projects sections (array of objects)
  const [items, setItems] = useState<any[]>(Array.isArray(section.content) ? section.content : []);
  
  // For skills section (array of strings)
  const [skillText, setSkillText] = useState('');
  const [skills, setSkills] = useState<string[]>(
    Array.isArray(section.content) ? section.content : []
  );

  // Save changes based on section type
  const saveChanges = (newContent: any) => {
    updateSection(section.id, { content: newContent });
  };

  // Add a new skill
  const addSkill = () => {
    if (skillText.trim()) {
      const updatedSkills = [...skills, skillText.trim()];
      setSkills(updatedSkills);
      saveChanges(updatedSkills);
      setSkillText('');
    }
  };

  // Remove a skill
  const removeSkill = (index: number) => {
    const updatedSkills = skills.filter((_, i) => i !== index);
    setSkills(updatedSkills);
    saveChanges(updatedSkills);
  };
  
  // Handle summary text changes
  const handleSummaryChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setSummaryText(newText);
    saveChanges(newText);
  };

  // Render editor based on section type
  switch (section.type) {
    case 'summary':
      return (
        <div className="mt-2">
          <textarea
            value={summaryText}
            onChange={handleSummaryChange}
            className="glass-input w-full min-h-[100px]"
            placeholder="Write your professional summary..."
          />
        </div>
      );
      
    case 'skills':
      return (
        <div className="mt-2">
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillText}
              onChange={(e) => setSkillText(e.target.value)}
              className="glass-input flex-1"
              placeholder="Add a skill..."
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="glass-button"
              onClick={addSkill}
            >
              Add
            </motion.button>
          </div>
          
          {skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {skills.map((skill, index) => (
                <div 
                  key={index}
                  className="bg-purple-500 bg-opacity-20 rounded-full px-3 py-1 text-sm flex items-center gap-2"
                >
                  {skill}
                  <button 
                    onClick={() => removeSkill(index)}
                    className="text-red-300 hover:text-red-400"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      );
      
    default:
      return (
        <div className="mt-2 text-center text-sm text-gray-400">
          Edit feature for {section.type} type coming soon...
        </div>
      );
  }
} 