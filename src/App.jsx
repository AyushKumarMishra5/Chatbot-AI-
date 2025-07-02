import { useState } from 'react';
import './App.css';
import Axios from 'axios';
import { FaBolt } from 'react-icons/fa';

function NeonOracle() {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState([]);

  async function generateAnswer() {
    if (!question.trim()) return;

    const userMessage = { type: 'question', text: question };
    setMessages(prev => [...prev, userMessage]);
    setQuestion('');

    try {
      const response = await Axios({
        url: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyCLuaPcOptrUL_I-Uftx5lX208c8veW6Pg',
        method: 'post',
        data: {
          contents: [
            {
              parts: [{ text: question }]
            }
          ]
        }
      });

      const text =
        response.data.candidates?.[0]?.content?.parts?.[0]?.text ||
        'No response from AI.';
      const botMessage = { type: 'answer', text };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      const errorMessage = { type: 'answer', text: '⚠️ Failed to fetch response.' };
      setMessages(prev => [...prev, errorMessage]);
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      generateAnswer();
    }
  }

  return (
    <div className="app-wrapper">
      <h1>NeonOracle</h1>

      <div className="chat-container">
        {messages.map((msg, index) => (
          <div key={index} className={`message-wrapper ${msg.type}`}>
            <div className={`message ${msg.type}`}>{msg.text}</div>
          </div>
        ))}
      </div>

      <div className="input-container">
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask something amazing..."
        />
        <button onClick={generateAnswer} title="Generate Answer">
          <FaBolt size={20} />
        </button>
      </div>
    </div>
  );
}

export default NeonOracle;
