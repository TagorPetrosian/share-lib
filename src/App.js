import React, { useState } from 'react';
import './App.css';

function App() {
  const [shareMessage, setShareMessage] = useState('');

  const dummyData = {
    title: 'Welcome to Share Lib',
    description: 'This is a simple application for sharing content with others.',
    author: 'John Doe',
    date: 'January 15, 2024',
    content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.'
  };

  const handleShare = async () => {
    const shareData = {
      title: dummyData.title,
      text: `${dummyData.description}\n\n${dummyData.content}`,
      url: window.location.href
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
        setShareMessage('Shared successfully!');
      } else {
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        setShareMessage('Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        setShareMessage('Failed to share. Please try again.');
      }
    }

    setTimeout(() => setShareMessage(''), 3000);
  };

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
        <button className="share-button" onClick={handleShare}>
          Share
        </button>
        {shareMessage && <p className="share-message">{shareMessage}</p>}
      </div>
    </div>
  );
}

export default App;
