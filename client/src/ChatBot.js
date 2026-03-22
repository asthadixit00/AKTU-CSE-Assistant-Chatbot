import React, { useState } from 'react';
import axios from 'axios';

const ChatBot = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    
    // User message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    try {
      const res = await axios.post('http://localhost:5000/api/chat',
        { message: input });
      setMessages(prev => [...prev, { role: 'bot', ...res.data }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', answer: 'Backend off? cd ../server && npm start' }]);
    }
    setInput('');
  };

  return (
    <div style={{ maxWidth: 600, margin: '20px auto', border: '1px solid #ccc', borderRadius: 10 }}>
      <div style={{ height: 400, overflowY: 'scroll', padding: 20, background: '#f5f5f5' }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ 
            margin: '10px 0', 
            padding: 10, 
            background: msg.role === 'user' ? '#007bff' : '#fff',
            color: msg.role === 'user' ? 'white' : 'black',
            textAlign: msg.role === 'user' ? 'right' : 'left',
            borderRadius: 10
          }}>
            <strong>{msg.role === 'user' ? 'You' : 'Bot'}:</strong> 
            {msg.content || msg.answer}
          </div>
        ))}
      </div>
      <div style={{ padding: 20, display: 'flex' }}>
        <input 
          value={input} 
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && sendMessage()}
          placeholder="6th sem syllabus?"
          style={{ flex: 1, padding: 10, borderRadius: 5, border: '1px solid #ddd' }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 10, padding: '10px 20px', background: '#007bff', color: 'white', border: 'none', borderRadius: 5 }}>
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBot;
