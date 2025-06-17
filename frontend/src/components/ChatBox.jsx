import React, { useState, useRef, useEffect } from 'react';

function ChatBox({ filename }) {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const chatAreaRef = useRef(null);

  const scrollToBottom = () => {
    if (chatAreaRef.current) {
      chatAreaRef.current.scrollTop = chatAreaRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const askQuestion = async () => {
    if (!question.trim()) return;

    const userMessage = { type: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    setQuestion("");
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("filename", filename);
      formData.append("question", question);

      const res = await fetch("http://localhost:8000/ask/", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      
      const botMessage = { type: 'bot', content: data.answer };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = { type: 'bot', content: 'Sorry, there was an error processing your question.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      askQuestion();
    }
  };

  return (
    <>
      <div className="chat-area scrollbar-hide" ref={chatAreaRef}>
        {messages.length === 0 && (
          <div className="welcome-message">
            Start asking questions about your PDF document
          </div>
        )}
        
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`message ${message.type === 'user' ? 'user-message' : 'bot-message'}`}
          >
            <div className={`avatar ${message.type === 'user' ? 'user-avatar' : 'bot-avatar'}`}>
              {message.type === 'user' ? 'S' : 'AI'}
            </div>
            <div className="message-content">
              {message.content}
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="message bot-message">
            <div className="avatar bot-avatar">AI</div>
            <div className="message-content">
              Thinking...
            </div>
          </div>
        )}
      </div>
      
      <div className="input-area">
        <div className="input-container">
          <input 
            className="question-input"
            value={question} 
            onChange={(e) => setQuestion(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask a question about the PDF..." 
            disabled={isLoading}
          />
          <button 
            className="send-button" 
            onClick={askQuestion}
            disabled={isLoading || !question.trim()}
          >
            Send
          </button>
        </div>
      </div>
    </>
  );
}

export default ChatBox;