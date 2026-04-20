import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:3000";

function App() {
  const [input, setInput] = useState("");
  const [interactions, setInteractions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Removed fetchHistory on mount to ensure a clean start ("Chat with the Assistant" screen)
  // as per user request to avoid seeing "U AI U AI" at the start.

  useEffect(() => {
    scrollToBottom();
  }, [interactions]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const currentQuestion = input;
    setInput("");
    setIsLoading(true);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion }),
      });

      const data = await res.json();
      
      const newInteraction = { 
        question: currentQuestion, 
        answer: data.answer 
      };
      
      // We only show the latest interactions to keep the UI clean
      setInteractions((prev) => [...prev, newInteraction]);
    } catch (err) {
      console.error("Interaction error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = async () => {
    // Updated confirmation to match the button label
    if (!confirm("Are you sure you want to clear your questions?")) return;
    try {
      await fetch(`${API_BASE}/history`, { method: "DELETE" });
      setInteractions([]);
    } catch (err) {
      console.error("Failed to clear history:", err);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    setInput(e.target.value);
    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h1 className="brand">Cognitia AI</h1>
        <button className="new-chat-btn" onClick={clearHistory}>
          <span>+</span> Clear Questions
        </button>
      </aside>

      <main className="main-chat">
        {interactions.length === 0 && !isLoading ? (
          <div className="welcome-screen">
            <h2>Cognitia AI</h2>
            <p>Chat with the Assistant</p>
          </div>
        ) : (
          <div className="chat-messages">
            {interactions.map((item, index) => (
              <div key={index}>
                {/* Question */}
                <div className="message-container user">
                  <div className="message-content">
                    <div className="avatar user">User</div>
                    <div className="text">{item.question}</div>
                  </div>
                </div>
                {/* Answer */}
                <div className="message-container assistant">
                  <div className="message-content">
                    <div className="avatar bot">AI</div>
                    <div className="text">
                      <ReactMarkdown>{item.answer}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message-container assistant">
                <div className="message-content">
                  <div className="avatar bot">AI</div>
                  <div className="text">Thinking...</div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}

        <div className="input-area">
          <div className="input-container">
            <textarea
              ref={textareaRef}
              rows={1}
              placeholder="Ask a question..."
              value={input}
              onChange={handleInput}
              onKeyDown={handleKeyDown}
            />
            <button
              className="send-btn"
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M7 11L12 6L17 11M12 18V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;