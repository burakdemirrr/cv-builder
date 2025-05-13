import { create } from 'zustand';
import { CVContent, CVSection } from './supabase';
import { v4 as uuidv4 } from 'uuid';

interface CVStore {
  title: string;
  content: CVContent;
  template: string;
  setTitle: (title: string) => void;
  setTemplate: (template: string) => void;
  addSection: (type: CVSection['type'], title: string) => void;
  updateSection: (id: string, updates: Partial<CVSection>) => void;
  removeSection: (id: string) => void;
  reorderSections: (sections: CVSection[]) => void;
}

export const useStore = create<CVStore>((set) => ({
  title: 'My CV',
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
  
  setTitle: (title) => set({ title }),
  
  setTemplate: (template) => set({ template }),
  
  addSection: (type, title) => set((state) => ({
    content: {
      ...state.content,
      sections: [
        ...state.content.sections,
        {
          id: uuidv4(),
          type,
          title,
          content: type === 'summary' ? '' : [],
        },
      ],
    },
  })),
  
  updateSection: (id, updates) => set((state) => ({
    content: {
      ...state.content,
      sections: state.content.sections.map((section) =>
        section.id === id ? { ...section, ...updates } : section
      ),
    },
  })),
  
  removeSection: (id) => set((state) => ({
    content: {
      ...state.content,
      sections: state.content.sections.filter((section) => section.id !== id),
    },
  })),
  
  reorderSections: (sections) => set((state) => ({
    content: {
      ...state.content,
      sections,
    },
  })),
})); 