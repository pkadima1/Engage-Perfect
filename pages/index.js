import { useState } from 'react';

import { 
  Sparkles, 
  Users, 
  Briefcase, 
  MessageCircle, 
  Clock, 
  Coffee, 
  Smile, 
  Loader2 
} from 'lucide-react';
import { getLinkedInShareUrl, getFacebookShareUrl, getTwitterShareUrl } from '../src/config/social';


export default function Home() {
  // States for both forms
  const [formData, setFormData] = useState({
    niche: '',
    goal: 'followers',
    platform: 'instagram',
    tone: 'professional'
  });

  const [selectedIdea, setSelectedIdea] = useState('');
  const [captionPlatform, setCaptionPlatform] = useState('instagram');
  const [captionTone, setCaptionTone] = useState('professional');
  const [generatedCaption, setGeneratedCaption] = useState('');
  const [generatedIdeas, setGeneratedIdeas] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [selectedIdeaIndex, setSelectedIdeaIndex] = useState(null);
  const [parsedIdeas, setParsedIdeas] = useState([]);
  const [isCopied, setIsCopied] = useState(false);

  // Goals configuration
  const goals = [
    { 
      id: 'followers', 
      label: 'Grow Followers', 
      icon: Users 
    },
    { 
      id: 'products', 
      label: 'Promote Products', 
      icon: Briefcase 
    },
    { 
      id: 'engagement', 
      label: 'Drive Engagement', 
      icon: MessageCircle 
    },
    { 
      id: 'educational', 
      label: 'Share Knowledge', 
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="currentColor" d="M12 3L1 9l11 6l9-4.91V17h2V9M5 13.18v4L12 21l7-3.82v-4L12 17l-7-3.82Z"/>
        </svg>
      )
    }
  ];

  // Platforms configuration with brand colors
  const platforms = [
    { 
      id: 'instagram', 
      label: 'Instagram',
      color: '#E1306C',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="currentColor" d="M12 2.982c2.937 0 3.285.011 4.445.064a6.087 6.087 0 0 1 2.042.379 3.408 3.408 0 0 1 1.265.823 3.408 3.408 0 0 1 .823 1.265 6.087 6.087 0 0 1 .379 2.042c.053 1.16.064 1.508.064 4.445s-.011 3.285-.064 4.445a6.087 6.087 0 0 1-.379 2.042 3.643 3.643 0 0 1-2.088 2.088 6.087 6.087 0 0 1-2.042.379c-1.16.053-1.508.064-4.445.064s-3.285-.011-4.445-.064a6.087 6.087 0 0 1-2.043-.379 3.408 3.408 0 0 1-1.264-.823 3.408 3.408 0 0 1-.823-1.265 6.087 6.087 0 0 1-.379-2.042c-.053-1.16-.064-1.508-.064-4.445s.011-3.285.064-4.445a6.087 6.087 0 0 1 .379-2.042 3.408 3.408 0 0 1 .823-1.265 3.408 3.408 0 0 1 1.265-.823 6.087 6.087 0 0 1 2.042-.379c1.16-.053 1.508-.064 4.445-.064z"/>
        </svg>
      )
    },
    { 
      id: 'facebook', 
      label: 'Facebook',
      color: '#1877F2',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="currentColor" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      )
    },
    { 
      id: 'twitter', 
      label: 'Twitter',
      color: '#1DA1F2',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      )
    },
    { 
      id: 'linkedin', 
      label: 'LinkedIn',
      color: '#0A66C2',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="currentColor" d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
        </svg>
      )
    },
    { 
      id: 'tiktok', 
      label: 'TikTok',
      color: '#000000',
      icon: () => (
        <svg viewBox="0 0 24 24" className="w-6 h-6">
          <path fill="currentColor" d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      )
    }
  ];

  // Tones configuration
  const tones = [
    { id: 'professional', label: 'Professional', icon: Briefcase },
    { id: 'casual', label: 'Casual', icon: Coffee },
    { id: 'humorous', label: 'Humorous', icon: Smile },
    { id: 'inspirational', label: 'Inspirational', icon: Sparkles }
  ];

  // Selection card component
  
//=============================================
const SelectionCard = ({ item, selected, onClick }) => (
  <div
    onClick={onClick}
    className={`flex flex-col items-center justify-center p-4 rounded-lg cursor-pointer border transition-all h-24 w-full
      ${selected ? 'bg-blue-50 border-blue-500 border-2' : 'border-gray-200 hover:border-blue-300'}`}
  >
    {typeof item.icon === 'function' ? (
      <div style={{ color: selected ? '#3B82F6' : item.color || 'currentColor' }} className="mb-2">
        <item.icon />
      </div>
    ) : (
      <item.icon className={`w-6 h-6 mb-2 ${selected ? 'text-blue-500' : 'text-black'}`} />
    )}
    <span className={`text-sm text-center font-medium ${selected ? 'text-blue-500' : 'text-black'}`}>
      {item.label}
    </span>
  </div>
);

  //====================================================
  // Format functions
  const formatTextWithBold = (text) => {
    const parts = text.split('**');
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return `<strong>${part}</strong>`;
      }
      return part;
    }).join('');
  };

  const getHashtags = (platform) => {
    const baseHashtags = ['#Innovation', '#Business'];
    switch (platform) {
      case 'instagram':
        return [...baseHashtags, '#Growth', '#Success'];
      case 'tiktok':
        return baseHashtags;
      case 'twitter':
        return baseHashtags.slice(0, 2);
      default:
        return baseHashtags;
    }
  };

  const formatCaption = (caption, platform) => {
    const lines = caption.split('\n');
    const formattedLines = lines.map(line => {
      const trimmedLine = line.trim();
      if (trimmedLine) {
        return formatTextWithBold(trimmedLine);
      }
      return '';
    }).filter(line => line);

    let formattedCaption = formattedLines.join('\n\n');
    const hashtags = getHashtags(platform).join(' ');
    formattedCaption = `${formattedCaption}\n\n${hashtags}`;

    return `${formattedCaption}\n\n✨ Created with engperf.ai`;
  };

  // Parse generated ideas
  const parseGeneratedIdeas = (rawText) => {
    try {
      const ideas = rawText.split('IDEA').filter(text => text.trim()).map(idea => {
        const sections = {};
        const parts = idea.split('[').slice(1);
        
        parts.forEach(part => {
          const [key, ...value] = part.split(']');
          if (key && value) {
            sections[key.toLowerCase()] = value.join(']').trim();
          }
        });

        return {
          title: sections.title || '',
          visual: sections['visual content'] || '',
          caption: sections.caption || '',
          cta: sections['call to action'] || ''
        };
      });
      return ideas;
    } catch (err) {
      console.error('Error parsing ideas:', err);
      return [];
    }
  };

  // Generate ideas function
  const generateIdeas = async () => {
    if (!formData.niche) {
      setError('Please enter your niche first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      let response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'idea',
          niche: formData.niche.trim(),
          goal: formData.goal,
          platform: formData.platform,
          tone: formData.tone
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate ideas');
      }

      const data = await response.json();
      setGeneratedIdeas(data.result);
      setParsedIdeas(parseGeneratedIdeas(data.result));
      setSelectedIdeaIndex(null);
      setSelectedIdea('');
    } catch (err) {
      setError(err.message);
      console.error('Error generating ideas:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle idea selection
  const handleIdeaSelection = (index) => {
    setSelectedIdeaIndex(index);
    const selectedIdea = parsedIdeas[index];
    setSelectedIdea(`${selectedIdea.title}\n${selectedIdea.visual}\n${selectedIdea.caption}\n${selectedIdea.cta}`);
    setCaptionPlatform(formData.platform);
    setCaptionTone(formData.tone);
    
    const captionGenerator = document.getElementById('caption-generator');
    if (captionGenerator) {
      captionGenerator.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Generate caption function
  const generateCaption = async () => {
    if (!selectedIdea) {
      setError('Please enter a post idea first');
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'caption',
          postIdea: selectedIdea,
          platform: captionPlatform,
          tone: captionTone,
          niche: formData.niche
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate caption');
      }

      const data = await response.json();
      setGeneratedCaption(data.result);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle sharing
  const handleShare = async (platform) => {
    // Format the caption for sharing
    const caption = formatCaption(generatedCaption, captionPlatform)
      .replace(/<strong>/g, '')
      .replace(/<\/strong>/g, '')
      .replace(/<div class="mb-2">/g, '')
      .replace(/<\/div>/g, '\n');
  
    // Window dimensions for popups  
    const width = 570;
    const height = 520;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const popupConfig = `width=${width},height=${height},top=${top},left=${left}`;
  
    switch (platform) {
      case 'copy':
        try {
          await navigator.clipboard.writeText(caption);
          setIsCopied(true);
          setTimeout(() => setIsCopied(false), 2000);
        } catch (err) {
          console.error('Failed to copy:', err);
        }
        break;
  
      case 'linkedin':
        const linkedInText = encodeURIComponent(caption);
        const linkedInUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent('https://engperf.ai')}&summary=${linkedInText}`;
        window.open(linkedInUrl, '_blank', popupConfig);
        break;
        
      case 'twitter':
        const twitterText = encodeURIComponent(caption);
        window.open(`https://twitter.com/intent/tweet?text=${twitterText}`, '_blank', popupConfig);
        break;
        
      case 'facebook':
        const fbText = encodeURIComponent(caption);
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent('https://engperf.ai')}&quote=${fbText}`, '_blank', popupConfig);
        break;
  
      case 'instagram':
        if (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent)) {
          // Save caption to clipboard first
          await navigator.clipboard.writeText(caption);
          window.location.href = 'instagram://';
        } else {
          await navigator.clipboard.writeText(caption);
          window.open('https://www.instagram.com');
        }
        break;
    }
  };

  return (
    <div className="min-h-screen bg-white flex justify-center items-start py-8">
      <main className="w-full max-w-2xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2">
            <div className="text-blue-500">
              <Sparkles className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold text-black">EngagePerfect AI</h1>
          </div>
          <p className="text-black">
            Generate engaging social media content ideas tailored to your niche
          </p>
        </div>

        {/* Weekly Usage */}
        <div className="flex items-center gap-2 text-green-600 mb-8">
          <Clock className="w-5 h-5" />
          <span className="text-sm">Weekly Usage</span>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Niche Input */}
          <div>
            <label className="block font-medium mb-2 text-black">What's your niche or industry?</label>
            <input
              type="text"
              value={formData.niche}
              onChange={(e) => setFormData({...formData, niche: e.target.value})}
              className="w-full p-3 border rounded-lg text-black"
              placeholder="e.g., Fitness, Fashion, Technology"
            />
          </div>


          {/*=============================================================*/}
{/* Goal Selection */}
<div>
  <label className="block font-medium mb-2 text-black">What's your goal?</label>
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
    {goals.map((goal) => (
      <div key={goal.id}>
        <SelectionCard
          item={goal}
          selected={formData.goal === goal.id}
          onClick={() => setFormData({...formData, goal: goal.id})}
        />
      </div>
    ))}
  </div>
</div>
        {/*=============================================================*/}

        {/* Platform Selection */}
<div>
  <label className="block font-medium mb-2 text-black">Choose your platform</label>
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
    {platforms.map((platform) => (
      <div key={platform.id}>
        <SelectionCard
          item={platform}
          selected={formData.platform === platform.id}
          onClick={() => setFormData({...formData, platform: platform.id})}
        />
      </div>
    ))}
  </div>
</div>
 {/* Tone Selection */}
<div>
  <label className="block font-medium mb-2 text-black">Select your tone</label>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
    {tones.map((tone) => (
      <div key={tone.id}>
        <SelectionCard
          item={tone}
          selected={formData.tone === tone.id}
          onClick={() => setFormData({...formData, tone: tone.id})}
        />
      </div>
    ))}
  </div>
</div>
          {/* Generate Button */}
          <button
            onClick={generateIdeas}
            disabled={isGenerating || !formData.niche}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-blue-300"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Content Ideas
              </>
            )}
          </button>

          {/* Error Message */}
          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          {/* Generated Ideas Display */}
          {parsedIdeas.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium mb-4 text-black">Generated Ideas:</h3>
              <div className="space-y-4">
                {parsedIdeas.map((idea, index) => (
                  selectedIdeaIndex === null || selectedIdeaIndex === index ? (
                    <div 
                      key={index}
                      className={`p-4 rounded-lg border transition-all cursor-pointer
                        ${selectedIdeaIndex === index ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'}`}
                      onClick={() => handleIdeaSelection(index)}
                    >
                      <h4 className="font-medium text-black">{idea.title}</h4>
                      <p className="text-gray-600 mt-2">{idea.visual}</p>
                      <p className="text-gray-600 mt-2">{idea.caption}</p>
                      <p className="text-gray-600 mt-2">{idea.cta}</p>
                      
                      {selectedIdeaIndex === index && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            document.getElementById('caption-generator').scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="mt-4 w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
                        >
                          Use this idea for caption
                        </button>
                      )}
                    </div>
                  ) : null
                ))}
                {selectedIdeaIndex !== null && (
                  <button
                    onClick={() => setSelectedIdeaIndex(null)}
                    className="text-blue-600 hover:text-blue-800 mt-4"
                  >
                    ← Back to all ideas
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Caption Generator Section */}
          <div id="caption-generator" className="mt-12 pt-12 border-t">
            <h2 className="text-xl font-bold mb-6 text-black">Caption Generator</h2>
            
            <div className="space-y-6">
              {/* Selected Post Idea */}
              <div>
                <label className="block font-medium mb-2 text-black">Selected Post Idea</label>
                <textarea
                  value={selectedIdea}
                  onChange={(e) => setSelectedIdea(e.target.value)}
                  className="w-full p-3 border rounded-lg text-black min-h-[100px]"
                  placeholder="Enter or paste your post idea here"
                />
              </div>

              {/* Platform Selection */}
              <div>
                <label className="block font-medium mb-2 text-black">Platform</label>
                <select
                  value={captionPlatform}
                  onChange={(e) => setCaptionPlatform(e.target.value)}
                  className="w-full p-3 border rounded-lg text-black"
                >
                  <option value="instagram">Instagram</option>
                  <option value="twitter">Twitter</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                </select>
              </div>

              {/* Tone Selection */}
              <div>
                <label className="block font-medium mb-2 text-black">Tone</label>
                <select
                  value={captionTone}
                  onChange={(e) => setCaptionTone(e.target.value)}
                  className="w-full p-3 border rounded-lg text-black"
                >
                  <option value="professional">Professional</option>
                  <option value="casual">Casual</option>
                  <option value="humorous">Humorous</option>
                  <option value="inspirational">Inspirational</option>
                </select>
              </div>

              {/* Generate Caption Button */}
              <button
                onClick={generateCaption}
                disabled={isGenerating || !selectedIdea}
                className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2 disabled:bg-blue-300"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Caption
                  </>
                )}
              </button>

              {/* Generated Caption */}
              {generatedCaption && (
                <div className="mt-6">
                  <h3 className="font-medium mb-2 text-black">Generated Caption:</h3>
                  <div className="bg-gray-50 p-6 rounded-lg space-y-4">
                    <div 
                      className="text-black whitespace-pre-wrap font-medium"
                      dangerouslySetInnerHTML={{ 
                        __html: formatCaption(generatedCaption, captionPlatform)
                          .split('\n')
                          .map(line => `<div class="mb-2">${line}</div>`)
                          .join('')
                      }}
                    />
                    
                    {/* Share Buttons */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                      <button
                        onClick={() => handleShare('copy')}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                      >
                        {isCopied ? (
                          <>
                            <span className="text-green-600">✓</span>
                            Copied!
                          </>
                        ) : (
                          <>
                            Copy to Clipboard
                          </>
                        )}
                      </button>

                      {/* Platform-specific share buttons */}
                      {captionPlatform === 'instagram' && (
                        <button
                          onClick={() => handleShare('instagram')}
                          className="flex items-center gap-2 px-4 py-2 bg-[#E1306C] text-white hover:bg-opacity-90 rounded-lg"
                        >
                          Open Instagram
                        </button>
                      )}

                      {captionPlatform === 'tiktok' && (
                        <button
                          onClick={() => handleShare('tiktok')}
                          className="flex items-center gap-2 px-4 py-2 bg-black text-white hover:bg-opacity-90 rounded-lg"
                        >
                          Open TikTok
                        </button>
                      )}
                      
                      {captionPlatform === 'twitter' && (
                        <button
                          onClick={() => handleShare('twitter')}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1DA1F2] text-white hover:bg-opacity-90 rounded-lg"
                        >
                          Share on Twitter
                        </button>
                      )}
                      
                      {captionPlatform === 'facebook' && (
                        <button
                          onClick={() => handleShare('facebook')}
                          className="flex items-center gap-2 px-4 py-2 bg-[#1877F2] text-white hover:bg-opacity-90 rounded-lg"
                        >
                          Share on Facebook
                        </button>
                      )}
                      
                      {captionPlatform === 'linkedin' && (
                        <button
                          onClick={() => handleShare('linkedin')}
                          className="flex items-center gap-2 px-4 py-2 bg-[#0A66C2] text-white hover:bg-opacity-90 rounded-lg"
                        >
                          Share on LinkedIn
                        </button>
                      )}
                    </div>

                    {/* Platform Instructions */}
                    {(captionPlatform === 'instagram' || captionPlatform === 'tiktok') && (
                      <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                        <p className="text-yellow-800 text-sm">
                          To share on {captionPlatform}:
                          <ol className="list-decimal ml-5 mt-2">
                            <li>Click "Copy to Clipboard" to copy your caption</li>
                            <li>Open {captionPlatform} app</li>
                            <li>Create your post and paste the caption</li>
                          </ol>
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}