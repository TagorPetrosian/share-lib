import React, { useState, useEffect } from 'react';
import { RWebShare } from 'react-web-share';
import './App.css';

function App() {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

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

    loadPdfFile();
  }, []);

  const handleShare = async () => {
    if (!pdfFile) return;

    const shareData = {
      title: dummyData.title,
      text: `${dummyData.description}\n\n${dummyData.content}`,
      url: window.location.href,
      files: [pdfFile]
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else if (navigator.share) {
        const shareDataWithoutFiles = {
          title: shareData.title,
          text: shareData.text,
          url: shareData.url
        };
        await navigator.share(shareDataWithoutFiles);
      } else {
        const shareDataWithoutFiles = {
          text: shareData.text,
          url: shareData.url,
          title: shareData.title
        };
        await navigator.clipboard.writeText(`${shareData.title}\n${shareData.text}\n${shareData.url}`);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Error sharing:', error);
      }
    }
  };

  const shareData = {
    text: `${dummyData.description}\n\n${dummyData.content}`,
    url: window.location.href,
    title: dummyData.title
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
        {!isLoading && pdfFile && (
          <p className="file-info">📄 Attached: sample-document.pdf</p>
        )}
        {pdfFile ? (
          <button className="share-button" onClick={handleShare}>
            Share
          </button>
        ) : (
          <RWebShare data={shareData}>
            <button className="share-button">Share</button>
          </RWebShare>
        )}
      </div>
    </div>
  );
}

export default App;
