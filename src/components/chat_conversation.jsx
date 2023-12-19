// src/components/chat_conversation.jsx

import React from "react";

const ChatConversation = ({ conversation, userAvatar, chatbotAvatar }) => {
  return (
    <div style={{
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      maxWidth: '600px',
      margin: 'auto',
    }}>
      {conversation.map((entry, index) => (
        <div key={index} style={{
          display: 'flex',
          justifyContent: entry.speaker === 'user' ? 'flex-start' : 'flex-end',
          marginBottom: '10px',
        }}>
          <img
            src={entry.speaker === 'user' ? userAvatar : chatbotAvatar}
            alt={entry.speaker}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '20px',
              marginRight: entry.speaker === 'user' ? '10px' : '0',
              marginLeft: entry.speaker === 'user' ? '0' : '10px',
            }}
          />
          <div style={{
            backgroundColor: entry.speaker === 'user' ? '#f0f0f0' : '#d1e7dd',
            padding: '10px 15px',
            borderRadius: '15px',
            maxWidth: '75%',
          }}>
            <p style={{ margin: '0' }}>{entry.text}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatConversation;
