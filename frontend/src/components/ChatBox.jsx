import React, { useState } from 'react';

function ChatBox({ filename }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const askQuestion = async () => {
    const formData = new FormData();
    formData.append("filename", filename);
    formData.append("question", question);

    const res = await fetch("http://localhost:8000/ask/", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setAnswer(data.answer);
  };

  return (
    <div>
      <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Ask a question about the PDF..." />
      <button onClick={askQuestion}>Ask</button>
      {answer && <p><strong>Answer:</strong> {answer}</p>}
    </div>
  );
}

export default ChatBox;