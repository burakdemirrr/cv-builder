'use client';

import { motion } from 'framer-motion';

interface TemplateSelectorProps {
  selectedTemplate: string;
  onSelectTemplate: (template: string) => void;
}

// Define available templates with their properties
const templates = [
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean and professional design with a modern touch',
  },
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional CV layout with a timeless design',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold and innovative layout to stand out',
  },
];

export default function TemplateSelector({
  selectedTemplate,
  onSelectTemplate,
}: TemplateSelectorProps) {
  return (
    <div>
      <h3 className="text-sm font-medium mb-2">CV Template</h3>
      <div className="space-y-2">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={`p-3 rounded-lg cursor-pointer border transition-all ${
              selectedTemplate === template.id
                ? 'border-purple-400 bg-purple-500 bg-opacity-20'
                : 'border-glass-border hover:border-white/30'
            }`}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectTemplate(template.id)}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{template.name}</h4>
              {selectedTemplate === template.id && (
                <span className="text-purple-300">✓</span>
              )}
            </div>
            <p className="text-xs mt-1 opacity-70">{template.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
} 