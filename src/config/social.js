// src/config/social.js

// Social Media Configuration
export const socialConfig = {
    linkedin: {
      clientId: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || '',
      redirectUri: typeof window !== 'undefined' 
        ? `${window.location.origin}/api/auth/linkedin/callback` 
        : '',
      scope: 'r_liteprofile r_emailaddress w_member_social',
    },
    facebook: {
      appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || '',
      version: 'v12.0',
    },
    twitter: {
      apiKey: process.env.NEXT_PUBLIC_TWITTER_API_KEY || '',
    },
    tiktok: {
      // Placeholder for future TikTok integration
      clientKey: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_KEY || '',
    }
  };
  
  // LinkedIn Share URL Generator
  export const getLinkedInShareUrl = (url, text) => {
    return `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`;
  };
  // Facebook Share URL Generator
  
export const getFacebookShareUrl = (url, text) => {
  return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`;
}
  // Twitter Share URL Generator
  export const getTwitterShareUrl = (text) => {
    return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
  };
  
  // General Social Share Helper
  export const shareSocial = async (platform, content) => {
    try {
      const response = await fetch('/api/social/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          content
        })
      });
  
      return await response.json();
    } catch (error) {
      console.error('Error sharing to social media:', error);
      throw error;
    }
  };
  
  // Window Helper for Social Popups
  export const openSharePopup = (url) => {
    const width = 570;
    const height = 520;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    const params = `scrollbars=no,resizable=no,status=no,location=no,toolbar=no,menubar=no,width=${width},height=${height},top=${top},left=${left}`;
  
    window.open(url, 'share', params);
  };
  
  // Format Social Media Text
  export const formatSocialText = (text, platform) => {
    let formattedText = text;
  
    switch (platform) {
      case 'twitter':
        // Twitter has a 280 character limit
        formattedText = text.length > 280 ? text.substring(0, 277) + '...' : text;
        break;
      case 'linkedin':
        // LinkedIn has a 3000 character limit
        formattedText = text.length > 3000 ? text.substring(0, 2997) + '...' : text;
        break;
      case 'facebook':
        // Facebook has a 63,206 character limit
        formattedText = text.length > 63206 ? text.substring(0, 63203) + '...' : text;
        break;
      default:
        formattedText = text;
    }
  
    return formattedText;
  };