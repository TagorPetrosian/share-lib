import React, { useState, useEffect, useRef } from 'react';
import { RWebShare } from 'react-web-share';
import './App.css';

const FORCE_DISABLE_NATIVE_SHARE = true;

if (FORCE_DISABLE_NATIVE_SHARE && typeof navigator !== 'undefined' && navigator.share) {
  console.log('🚫 [Module Level] Overriding navigator.share to null to force fallback');
  try {
    Object.defineProperty(navigator, 'share', {
      value: null,
      writable: true,
      configurable: true,
      enumerable: false
    });
  } catch (e) {
    navigator.share = null;
  }
  console.log('✅ [Module Level] navigator.share is now:', navigator.share);
}

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const shareBlockedRef = useRef(false);
  
  const isShareBlocked = () => {
    if (FORCE_DISABLE_NATIVE_SHARE) {
      console.log('🔒 FORCE_DISABLE_NATIVE_SHARE is true - using fallback modal');
      return true;
    }
    
    const blockedFlag = localStorage.getItem('shareBlocked');
    if (blockedFlag === 'true') {
      console.log('🔒 shareBlocked flag found in localStorage - using fallback modal');
      return true;
    }
    
    if (!navigator.share) {
      console.log('🔒 navigator.share not available - using fallback modal');
      return true;
    }
    
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost') {
      console.log('🔒 Not HTTPS - using fallback modal');
      return true;
    }
    
    return false;
  };

  const dummyData = {
    title: 'Welcome to Share Lib',
    description: 'This is a simple application for sharing content with others.',
    author: 'John Doe',
    date: 'January 15, 2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
  };

  useEffect(() => {
    const loadPdfFile = async () => {
      try {
        const response = await fetch('/sample-document.pdf');
        const blob = await response.blob();
        const file = new File([blob], 'sample-document.pdf', { type: 'application/pdf' });
        setPdfFile(file);
      } catch (error) {
        console.error('Error loading PDF file:', error);
      } finally {
        setIsLoading(false);
      }
    };

    const originalShare = navigator.share;
    
    if (!FORCE_DISABLE_NATIVE_SHARE && originalShare) {
      navigator.share = function(...args) {
        return originalShare.apply(navigator, args).catch((error) => {
          if (error.name === 'NotAllowedError' || 
              error.name === 'SecurityError' || 
              error.name === 'DOMException' ||
              (error.message && (
                error.message.includes('not allowed') || 
                error.message.includes('blocked') ||
                error.message.includes('denied') ||
                error.message.includes('permission')
              ))) {
            console.warn('Native share is blocked by policy, setting flag for future attempts');
            localStorage.setItem('shareBlocked', 'true');
            shareBlockedRef.current = true;
          }
          throw error;
        });
      };
    }

    loadPdfFile();

    return () => {
      if (FORCE_DISABLE_NATIVE_SHARE && originalShare) {
        navigator.share = originalShare;
        console.log('🔄 Restored navigator.share');
      } else if (originalShare) {
        navigator.share = originalShare;
      }
    };
  }, []);

  const shareData = {
    text: `${dummyData.description}\n\n${dummyData.content}`,
    url: window.location.href,
    title: dummyData.title
  };

  useEffect(() => {
    console.log('📊 Share Data:', shareData);
    console.log('🔧 disableNative will be:', true);
    console.log('🌐 navigator.share available:', !!navigator.share);
    console.log('🚫 FORCE_DISABLE_NATIVE_SHARE:', FORCE_DISABLE_NATIVE_SHARE);
  }, []);

  return (
    <div className="App">
      <div className="container">
        <h1>{dummyData.title}</h1>
        <div className="meta">
          <span className="author">By {dummyData.author}</span>
          <span className="date">{dummyData.date}</span>
        </div>
        <p className="description">{dummyData.description}</p>
        <p className="content">{dummyData.content}</p>
        {!isLoading && pdfFile && (
          <p className="file-info">📄 Attached: sample-document.pdf</p>
        )}
        <RWebShare 
          data={shareData}
          disableNative={true}
          sites={['facebook', 'twitter', 'whatsapp', 'reddit', 'telegram', 'linkedin', 'mail', 'copy']}
          onClick={(shareMethod) => {
            console.log('✅ Shared successfully via:', shareMethod);
          }}
        >
          <button 
            className="share-button"
            onClick={() => {
              console.log('🖱️ Share button clicked - fallback modal should open');
            }}
          >
            Share
          </button>
        </RWebShare>
      </div>
    </div>
  );
}

export default App;
