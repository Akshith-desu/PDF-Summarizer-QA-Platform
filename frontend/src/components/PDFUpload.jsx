import React, { useState } from 'react';

function PDFUpload({ onUploaded }) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

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
      onUploaded(data.filename);
    } catch (error) {
      console.error('Upload failed:', error);
      setUploadedFileName(null);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="upload-section">
      <h3>Upload PDF</h3>
      <div className="file-input-wrapper">
        <input 
          className="file-input"
          type="file" 
          accept="application/pdf" 
          onChange={handleUpload}
          disabled={isUploading}
        />
      </div>
      
      {isUploading && (
        <div style={{ color: '#3498db', fontSize: '14px', marginTop: '10px' }}>
          Uploading...
        </div>
      )}
      
      {uploadedFileName && !isUploading && (
        <div style={{ color: '#27ae60', fontSize: '14px', marginTop: '10px' }}>
          ✓ {uploadedFileName} uploaded successfully
        </div>
      )}
    </div>
  );
}

export default PDFUpload;