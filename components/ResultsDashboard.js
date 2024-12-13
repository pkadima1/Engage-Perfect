import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, addDoc } from 'firebase/firestore';
import { Sparkles, Hash, MessageCircle, Calendar } from 'lucide-react';

const ResultsDashboard = ({ generatedIdeas, generatedCaption, formData }) => {
  const [activeTab, setActiveTab] = useState('ideas');
  const [savedResults, setSavedResults] = useState({
    ideas: [],
    captions: [],
    hashtags: []
  });
// Add this state in ResultsDashboard
const [dateFilter, setDateFilter] = useState('all');

  // Extract hashtags from text
  const extractHashtags = (text) => {
    const hashtagRegex = /#\w+/g;
    return text.match(hashtagRegex) || [];
  };

  // Save to Firebase
  const saveToFirebase = async (type, content) => {
    try {
      const resultsRef = collection(db, 'results');
      await addDoc(resultsRef, {
        type,
        content,
        niche: formData.niche,
        platform: formData.platform,
        createdAt: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error saving to Firebase:', error);
    }
  };
  //====================Additional Funcs=========================
// In ResultsDashboard.js, add this function
const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
// In ResultsDashboard.js, add delete function
const deleteItem = async (id) => {
  try {
    await deleteDoc(doc(db, 'results', id));
    loadResults(); // Reload the list
  } catch (error) {
    console.error('Error deleting item:', error);
  }
};
  // Load from Firebase
  const loadResults = async () => {
    try {
      const resultsRef = collection(db, 'results');
      const q = query(resultsRef, orderBy('createdAt', 'desc'), limit(10));
      const querySnapshot = await getDocs(q);
      
      const results = {
        ideas: [],
        captions: [],
        hashtags: []
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        switch (data.type) {
          case 'idea':
            results.ideas.push(data);
            break;
          case 'caption':
            results.captions.push(data);
            const hashtags = extractHashtags(data.content);
            if (hashtags.length) {
              results.hashtags = [...new Set([...results.hashtags, ...hashtags])];
            }
            break;
        }
      });

      setSavedResults(results);
    } catch (error) {
      console.error('Error loading results:', error);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  useEffect(() => {
    if (generatedIdeas) {
      saveToFirebase('idea', generatedIdeas);
    }
    if (generatedCaption) {
      saveToFirebase('caption', generatedCaption);
    }
  }, [generatedIdeas, generatedCaption]);

  return (
    <div className="w-full mt-8 bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-blue-500" />
          <h2 className="text-xl font-bold text-black">Results Dashboard</h2>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b">
        <button
          onClick={() => setActiveTab('ideas')}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === 'ideas'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <MessageCircle className="w-4 h-4" />
          Ideas
        </button>
        <button
          onClick={() => setActiveTab('captions')}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === 'captions'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <Calendar className="w-4 h-4" />
          Captions
        </button>
        <button
          onClick={() => setActiveTab('hashtags')}
          className={`flex items-center gap-2 px-4 py-2 ${
            activeTab === 'hashtags'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-600 hover:text-blue-500'
          }`}
        >
          <Hash className="w-4 h-4" />
          Hashtags
        </button>
      </div>

      {/* Content */}
      <div className="p-4 h-96 overflow-auto">
        {activeTab === 'ideas' && (
          <div className="space-y-4">
            {savedResults.ideas.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="whitespace-pre-wrap text-black">{item.content}</div>              </div>
            ))}
          </div>
        )}

        {activeTab === 'captions' && (
          <div className="space-y-4">
            {savedResults.captions.map((item, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm text-gray-500 mb-2">
                  {new Date(item.createdAt).toLocaleDateString()}
                </div>
                <div className="whitespace-pre-wrap text-black">{item.content}</div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'hashtags' && (
          <div className="flex flex-wrap gap-2">
            {savedResults.hashtags.map((hashtag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {hashtag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultsDashboard;