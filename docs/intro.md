---
sidebar_position: 1
---

import Figure from "@site/src/components/figure";
import ChatConversation from '@site/src/components/chat_conversation';



# Tutorial Intro

Let's discover **Docusaurus in less than 5 minutes**.

## Getting Started

Get <kbd>started</kbd> by **creating a new site**.

Or **try Docusaurus immediately** with **[docusaurus.new](https://docusaurus.new)**.

### What you'll need

- [Node.js](https://nodejs.org/en/download/) version 18.0 or above:
  - When installing Node.js, you are recommended to check all checkboxes related to dependencies.

## Generate a new site

Generate a new Docusaurus site using the **classic template**.

The classic template will automatically be added to your project after you run the command:

```bash
npm init docusaurus@latest my-website classic
```

You can type this command into Command Prompt, Powershell, Terminal, or any other integrated terminal of your code editor.

The command also installs all necessary dependencies you need to run Docusaurus.

## Start your site

Run the development server:

```bash
cd my-website
npm run start
```

The `cd` command changes the directory you're working with. In order to work with your newly created Docusaurus site, you'll need to navigate the terminal there.

The `npm run start` command builds your website locally and serves it through a development server, ready for you to view at http://localhost:3000/.

Open `docs/intro.md` (this page) and edit some lines: the site **reloads automatically** and displays your changes.


<ChatConversation
  conversation={[
    { speaker: 'user', text: 'Hello, how are you?' },
    { speaker: 'chatbot', text: 'I am fine, thank you! And you?' },
    { speaker: 'user', text: "What's the difference between naming a file md or mdx? Does it matter for docusaurus?"},
    { speaker: 'chatbot', text: "In the context of Docusaurus and many static site generators that support MDX is the extension for Markdown files. Markdown is a lightweight markup language with plain text formatting syntax. It's designed to be converted to HTML and often used for readme files, writing messages in online forums, and creating rich text using a plain text editor.- mdx is the extension for MDX files. MDX is an extension of Markdown that allows you to use JSX (JavaScript XML) within your Markdown files. This means that you can import and use React components directly in your Markdown files, enabling interactive and dynamic content within your static pages.", comment: 'User greets the chatbot.'  },
    { speaker: 'user', text: 'I am fine, thank you! And you?' },
    { speaker: 'chatbot', text: 'I am fine, thank you! And you?' },
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>

<ChatConversation
  conversation={[
    { speaker: 'user', text: 'Hello, how are you?', comment: 'User greets the chatbot.' },
    { speaker: 'chatbot', text: 'I am fine, thank you! And you?', comment: 'Chatbot responds politely.' },
    // ... more entries
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>


<ChatConversation
  conversation={[
    { speaker: 'user', text: 'Hello, how are you?' },
    { speaker: 'chatbot', text: 'I am fine, thank you! And you?', comment: 'Chatbot inquires about the user.' },
    // ... more entries
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>

