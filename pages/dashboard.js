// pages/dashboard.js
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import ResultsDashboard from '../components/ResultsDashboard';

export default function Dashboard() {
  // Initialize formData with default values
  const [formData] = useState({
    niche: 'Not specified',
    goal: 'Not specified',
    platform: 'Not specified',
    tone: 'Not specified'
  });

  const [generatedContent] = useState({
    ideas: '',
    captions: ''
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <ResultsDashboard 
          formData={formData}
          generatedIdeas={generatedContent.ideas}
          generatedCaption={generatedContent.captions}
        />
      </div>
    </div>
  );
}