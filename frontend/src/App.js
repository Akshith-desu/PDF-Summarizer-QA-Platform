import React, { useState } from 'react';
import PDFUpload from './components/PDFUpload';
import ChatBox from './components/ChatBox';
import './App.css';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);

  return (
    <div className="container">
      <div className="sidebar">
        <PDFUpload onUploaded={setUploadedFile} />
      </div>
      <div className="main-content">
        <h1>PDF Chat Assistant</h1>
        {uploadedFile && <ChatBox filename={uploadedFile} />}
      </div>
    </div>
  );
}

export default App;
