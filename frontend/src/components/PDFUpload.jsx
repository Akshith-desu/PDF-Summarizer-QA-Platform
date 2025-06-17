import React from 'react';

function PDFUpload({ onUploaded }) {
  const handleUpload = async (e) => {
    const formData = new FormData();
    formData.append("file", e.target.files[0]);
    const res = await fetch("http://localhost:8000/upload_pdf/", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    onUploaded(data.filename);
  };

  return (
    <div>
      <h3>Upload PDF</h3>
      <input type="file" accept="application/pdf" onChange={handleUpload} />
    </div>
  );
}

export default PDFUpload;