// src/components/chat_conversation.jsx

import React from "react";

const ChatConversation = ({ conversation, userAvatar, chatbotAvatar }) => {
  return (
    <div style={{
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      maxWidth: '90%',
      margin: 'auto',
    }}>
      {conversation.map((entry, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'flex-end', // Align items to the bottom
          flexDirection: entry.speaker === 'user' ? 'row' : 'row-reverse', // Reverse direction for the chatbot
          marginBottom: '10px',
        }}>
          <img
            src={entry.speaker === 'user' ? userAvatar : chatbotAvatar}
            alt={entry.speaker}
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '20px',
            }}
          />
          <div style={{
            backgroundColor: entry.speaker === 'user' ? '#f0f0f0' : '#d1e7dd',
            padding: '10px 15px',
            borderRadius: '15px',
            margin: '0 10px',
            maxWidth: '70%',
          }}>
            <p style={{ margin: '0' }}>{entry.text}</p>
          </div>
          {entry.comment && (
            <div style={{
              flex: 1,
              padding: '0 10px', // Give some spacing
              fontSize: '0.8em',
              color: '#555',
              textAlign: entry.speaker === 'user' ? 'right' : 'left',
              alignSelf: 'center', // Center align the comment
            }}>
              {entry.comment}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChatConversation;
