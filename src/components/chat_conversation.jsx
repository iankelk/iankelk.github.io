// src/components/chat_conversation.jsx

import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';

const ChatConversation = ({ conversation, userAvatar, chatbotAvatar }) => {
  const { colorMode } = useColorMode();

  const bubbleStyles = (speaker) => {
    let backgroundColor;
    let textColor;

    if (colorMode === 'dark') {
      backgroundColor = speaker === 'user' ? '#333' : '#1a4d57'; // Dark mode background colors
      textColor = '#fff'; // Dark mode text color
    } else {
      backgroundColor = speaker === 'user' ? '#f0f0f0' : '#d1e7dd'; // Light mode background colors
      textColor = '#000'; // Light mode text color
    }

    return {
      backgroundColor,
      color: textColor,
      padding: '10px 15px',
      borderRadius: '15px',
      margin: '0 10px',
      maxWidth: '70%',
    };
  };

  return (
    <div style={{
      fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
      maxWidth: '90%',
      margin: 'auto',
      color: colorMode === 'dark' ? 'var(--ifm-heading-color)' : 'inherit' // Use theme color for text
    }}>
      {conversation.map((entry, index) => (
        <div key={index} style={{
          display: 'flex',
          alignItems: 'flex-end',
          flexDirection: entry.speaker === 'user' ? 'row' : 'row-reverse',
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
          <div style={bubbleStyles(entry.speaker)}>
            <p style={{ margin: '0' }}>{entry.text}</p>
          </div>
          {entry.comment && (
            <div style={{
              flex: 1,
              padding: '0 10px',
              fontSize: '0.8em',
              color: colorMode === 'dark' ? '#ccc' : '#555', // Adjust comment color based on theme
              textAlign: entry.speaker === 'user' ? 'right' : 'left',
              alignSelf: 'center',
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
