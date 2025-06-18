import React, { useState } from 'react';
import ChatBox from './components/ChatBox';
import './App.css';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [uploadedFileName, setUploadedFileName] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Clear previous messages
    setError(null);
    setSuccess(null);

    // Client-side validation
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a PDF file only.');
      return;
    }

    if (file.size > 50 * 1024 * 1024) { // 50MB limit
      setError('File size too large. Maximum allowed size is 50MB.');
      return;
    }

    setIsUploading(true);
    setUploadedFileName(file.name);

    try {
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("http://localhost:8000/upload_pdf/", {
        method: "POST",
        body: formData,
      });
      
      const data = await res.json();
      
      if (res.ok) {
        setUploadedFile(data.filename);
        setSuccess('PDF uploaded and processed successfully!');
        setError(null);
      } else {
        // Handle server validation errors
        setError(data.detail || 'Upload failed. Please try again.');
        setUploadedFileName(null);
      }
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Network error. Please check your connection and try again.');
      setUploadedFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleShowPDF = () => {
    if (uploadedFile) {
      // Open PDF in new tab - adjust URL based on your backend setup
      window.open(`http://localhost:8000/view_pdf/${uploadedFile}`, '_blank');
    }
  };

  const triggerFileInput = () => {
    document.getElementById('pdf-file-input').click();
  };

  const clearMessages = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="container">
      <div className="top-nav">
        <div className="nav-left">
          <span className="nav-title">PDF Chat Assistant</span>
        </div>
        <div className="nav-buttons">
          <button className="nav-button black " onClick={triggerFileInput} disabled={isUploading}>
            {isUploading ? 'Uploading...' : 'Upload PDF'}
          </button>
        </div>
      </div>
      
      <input
        id="pdf-file-input"
        type="file"
        accept="application/pdf"
        onChange={handleFileUpload}
        className="hidden-file-input"
      />
      
      {/* Error and Success Messages */}
      {error && (
        <div className="error-message">
          <span>❌ {error}</span>
          <button onClick={clearMessages} className="close-button">×</button>
        </div>
      )}
      
      {success && (
        <div className="success-message">
          <span>✅ {success}</span>
          <button onClick={clearMessages} className="close-button">×</button>
        </div>
      )}
      
      <div className="main-content">
        {uploadedFile ? (
          <ChatBox filename={uploadedFile} />
        ) : (
          <div className="chat-area">
            <div className="upload-prompt">
              Upload a PDF to start chatting with it
              <div className="upload-info">
                <small>Supported: PDF files only (max 50MB)</small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;