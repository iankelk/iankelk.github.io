"use strict";(self.webpackChunkblog=self.webpackChunkblog||[]).push([[6790],{3187:(e,t,i)=>{i.r(t),i.d(t,{assets:()=>r,contentTitle:()=>s,default:()=>d,frontMatter:()=>a,metadata:()=>h,toc:()=>l});var n=i(5893),o=i(1151);i(5124);const a={slug:"how-chatgpt-fools-us",title:"How ChatGPT fools us into thinking we're having a conversation",authors:["ikelk"],tags:["chat history","chatgpt","context","chat","AI","LLM","chatbots","AIExplained"],image:"https://github.com/iankelk/iankelk.github.io/blob/main/blog/2023-11-26-stateless/social-card.jpg?raw=true"},s=void 0,h={permalink:"/blog/how-chatgpt-fools-us",source:"@site/blog/2023-11-26-stateless/index.md",title:"How ChatGPT fools us into thinking we're having a conversation",description:"Remember the first time you used ChatGPT and how amazed you were to find yourself having what appeared to be a full-on conversation with an artificial intelligence? While ChatGPT was (and still is) mind-blowing, it uses a few tricks to make things appear more familiar.",date:"2023-11-26T00:00:00.000Z",formattedDate:"November 26, 2023",tags:[{label:"chat history",permalink:"/blog/tags/chat-history"},{label:"chatgpt",permalink:"/blog/tags/chatgpt"},{label:"context",permalink:"/blog/tags/context"},{label:"chat",permalink:"/blog/tags/chat"},{label:"AI",permalink:"/blog/tags/ai"},{label:"LLM",permalink:"/blog/tags/llm"},{label:"chatbots",permalink:"/blog/tags/chatbots"},{label:"AIExplained",permalink:"/blog/tags/ai-explained"}],readingTime:9.06,hasTruncateMarker:!0,authors:[{name:"Ian Kelk",title:"Developer relations guy",url:"https://iankelk.github.io",imageURL:"https://github.com/iankelk.png",key:"ikelk"}],frontMatter:{slug:"how-chatgpt-fools-us",title:"How ChatGPT fools us into thinking we're having a conversation",authors:["ikelk"],tags:["chat history","chatgpt","context","chat","AI","LLM","chatbots","AIExplained"],image:"https://github.com/iankelk/iankelk.github.io/blob/main/blog/2023-11-26-stateless/social-card.jpg?raw=true"},unlisted:!1},r={authorsImageUrls:[void 0]},l=[{value:"Trick #1: Every time you talk to ChatGPT, you&#39;re not just sending it your question. You&#39;re also sending it the <em>entire</em> conversation up until that point.",id:"trick-1-every-time-you-talk-to-chatgpt-youre-not-just-sending-it-your-question-youre-also-sending-it-the-entire-conversation-up-until-that-point",level:2},{value:"A typical short conversation with ChatGPT might go like this.",id:"a-typical-short-conversation-with-chatgpt-might-go-like-this",level:3},{value:"However, this is what is actually going on behind the scenes.",id:"however-this-is-what-is-actually-going-on-behind-the-scenes",level:3},{value:"How ChatGPT would respond without being fed the whole conversation.",id:"how-chatgpt-would-respond-without-being-fed-the-whole-conversation",level:3},{value:"Trick #2: As your conversation grows, ChatGPT will quietly remove the oldest parts from the beginning.",id:"trick-2-as-your-conversation-grows-chatgpt-will-quietly-remove-the-oldest-parts-from-the-beginning",level:2},{value:"Context Length in LLMs",id:"context-length-in-llms",level:4},{value:"The chat problem",id:"the-chat-problem",level:3},{value:"A visualization of ChatGPT simultaneously printing and scanning back in the entire conversation as it grows to extreme proportions.",id:"a-visualization-of-chatgpt-simultaneously-printing-and-scanning-back-in-the-entire-conversation-as-it-grows-to-extreme-proportions",level:3},{value:"Conversation Length and Token Limitations in LLMs",id:"conversation-length-and-token-limitations-in-llms",level:4},{value:"Another visualization of ChatGPT trimming away the start of your conversation behind the scenes.",id:"another-visualization-of-chatgpt-trimming-away-the-start-of-your-conversation-behind-the-scenes",level:3},{value:"Another typical but silly conversation with ChatGPT.",id:"another-typical-but-silly-conversation-with-chatgpt",level:3},{value:"Again, this is what is actually going on behind the scenes.",id:"again-this-is-what-is-actually-going-on-behind-the-scenes",level:3},{value:"Now let&#39;s suppose we have a long enough conversation that the beginning is trimmed off. ChatGPT might either state that it&#39;s forgotten the name entirely or hallucinate it.",id:"now-lets-suppose-we-have-a-long-enough-conversation-that-the-beginning-is-trimmed-off-chatgpt-might-either-state-that-its-forgotten-the-name-entirely-or-hallucinate-it",level:3},{value:"And finally, if we try to escape this problem by not feeding ChatGPT the entire conversation, it will forget it all the moment it finishes generating each answer.",id:"and-finally-if-we-try-to-escape-this-problem-by-not-feeding-chatgpt-the-entire-conversation-it-will-forget-it-all-the-moment-it-finishes-generating-each-answer",level:3},{value:"Why is it like this?",id:"why-is-it-like-this",level:2},{value:"Getting a bit more technical",id:"getting-a-bit-more-technical",level:2}];function c(e){const t={a:"a",em:"em",h2:"h2",h3:"h3",h4:"h4",img:"img",li:"li",ol:"ol",p:"p",...(0,o.a)(),...e.components};return(0,n.jsxs)(n.Fragment,{children:[(0,n.jsx)(t.p,{children:"Remember the first time you used ChatGPT and how amazed you were to find yourself having what appeared to be a full-on conversation with an artificial intelligence? While ChatGPT was (and still is) mind-blowing, it uses a few tricks to make things appear more familiar."}),"\n",(0,n.jsx)(t.p,{children:"While the title of this article is a bit tongue-in-cheek, it is most certainly not clickbait. ChatGPT does indeed use two notable hidden techniques to simulate human conversation, and the more you know about how they work, the more effectively you can use the technology."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"ChatGPT on the Tonight Show",src:i(6582).Z+"",width:"1200",height:"675"})}),"\n",(0,n.jsxs)(t.h2,{id:"trick-1-every-time-you-talk-to-chatgpt-youre-not-just-sending-it-your-question-youre-also-sending-it-the-entire-conversation-up-until-that-point",children:["Trick #1: Every time you talk to ChatGPT, you're not just sending it your question. You're also sending it the ",(0,n.jsx)(t.em,{children:"entire"})," conversation up until that point."]}),"\n",(0,n.jsx)(t.p,{children:'Contrary to appearances, large language models (LLMs) like ChatGPT do not actually "remember" past interactions. The moment they finish "typing" out their response, they have no idea who you are or what you were talking about. When ChatGPT seems to naturally recall details from earlier in the conversation, it is an illusion; the context of that dialogue is given back to ChatGPT every time you say something to it. This context enables them to build coherent, follow-on responses that appear to be normal conversations.'}),"\n",(0,n.jsxs)(t.p,{children:["However, without this context, ChatGPT would have no knowledge of what was previously discussed. Like all LLMs, ChatGPT is completely ",(0,n.jsx)(t.em,{children:"stateless"}),", meaning that in the actual model itself, no information is maintained between inputs and outputs. All of this feeding of previous context into the current interaction is hidden behind the scenes in the ChatGPT web application."]}),"\n",(0,n.jsx)(t.h3,{id:"a-typical-short-conversation-with-chatgpt-might-go-like-this",children:"A typical short conversation with ChatGPT might go like this."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"How ChatGPT pretends to work",src:i(2959).Z+"",width:"1320",height:"1566"})}),"\n",(0,n.jsx)(t.h3,{id:"however-this-is-what-is-actually-going-on-behind-the-scenes",children:"However, this is what is actually going on behind the scenes."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"How ChatGPT pretends to work",src:i(7752).Z+"",width:"1320",height:"1561"})}),"\n",(0,n.jsx)(t.p,{children:"Notice that when the woman asks her second question, she has to reiterate the entire previous conversation, complete with tags on who said what. Can you imagine talking to a person where every time it was your turn to speak, you had to repeat the entire conversation up to that point? This is how ChatGPT (and all current LLMs) work. They require using their own outputs, plus the prompts that generated these outputs, to be prepended to the start of every new prompt from the user."}),"\n",(0,n.jsx)(t.p,{children:'These models are termed "auto-regressive" due to their method of generating text one piece at a time, building upon the previously generated text. "Auto-" comes from the Greek word "aut\xf3s," meaning "self," and "regressive" is derived from "regress," which in this context refers to the statistical method of predicting future values based on past values.'}),"\n",(0,n.jsxs)(t.p,{children:["In LLMs, what this means is that the model predicts the next word or token in a sequence based on ",(0,n.jsx)(t.em,{children:"all"})," the words or tokens that have come before it. That's ",(0,n.jsx)(t.em,{children:"all"})," of it, not just the current question being asked in a long back-and-forth chat conversation. In humans, we naturally maintain coherence and context in a conversation by just... participating in the conversation."]}),"\n",(0,n.jsxs)(t.p,{children:["However, while chats with ChatGPT mimic a conversational style, with each response building upon the previous dialogue, the moment ChatGPT finishes writing a response, it has no memory of what it just said. Take a look at what would happen with this same conversation without the ",(0,n.jsx)(t.em,{children:"entire discourse"})," being back fed to ChatGPT behind the scenes:"]}),"\n",(0,n.jsx)(t.h3,{id:"how-chatgpt-would-respond-without-being-fed-the-whole-conversation",children:"How ChatGPT would respond without being fed the whole conversation."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"How ChatGPT would respond without being fed the whole conversation:",src:i(4636).Z+"",width:"1320",height:"1563"})}),"\n",(0,n.jsx)(t.h2,{id:"trick-2-as-your-conversation-grows-chatgpt-will-quietly-remove-the-oldest-parts-from-the-beginning",children:"Trick #2: As your conversation grows, ChatGPT will quietly remove the oldest parts from the beginning."}),"\n",(0,n.jsx)(t.h4,{id:"context-length-in-llms",children:"Context Length in LLMs"}),"\n",(0,n.jsxs)(t.p,{children:["When ChatGPT first came out in November 2022, it only offered the model GPT-3.5, which had a maximum context of 4,096 tokens, which is roughly 3,000 words. In a ",(0,n.jsx)(t.a,{href:"https://youtu.be/zjkBMFhNj_g?t=2642",children:"recent talk,"}),' Andrej Karpathy referred to this context window as "your finite precious resource of your working memory of your language model."']}),"\n",(0,n.jsx)(t.p,{children:"What this means is that the GPT-3.5 model can comprehend a maximum of 4,096 tokens at any point. Tokenization is a fascinating subject in itself, and my next post will cover how it works and why 4,096 tokens only gives you about 3,000 words."}),"\n",(0,n.jsx)(t.p,{children:"There's often confusion about what the token limit means regarding input and output: can we give ChatGPT 3,000 words and expect it to be able to produce 3,000 words back? The answer is unfortunately no; the context length of 4,096 tokens covers both the input (prompt) and the output (response). This results in a trade-off where we have to balance the amount of information we give in a prompt with the length of the response we get from the model."}),"\n",(0,n.jsxs)(t.ol,{children:["\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.em,{children:"Input (Prompt):"})," A longer prompt leaves less room for a meaningful response; if the input uses 4,000 tokens, the response can only be 96 tokens long to stay within the token limit."]}),"\n"]}),"\n",(0,n.jsxs)(t.li,{children:["\n",(0,n.jsxs)(t.p,{children:[(0,n.jsx)(t.em,{children:"Output (Response):"})," A shorter prompt could lead to a longer response as long as the combined length doesn't exceed the token limit, but you may not be able to include information in the prompt."]}),"\n"]}),"\n"]}),"\n",(0,n.jsx)(t.h3,{id:"the-chat-problem",children:"The chat problem"}),"\n",(0,n.jsx)(t.p,{children:"Do you see where this becomes problematic? Previously, we saw how the entire conversation has to be fed to the model so that it remembers what has already been discussed. Combining this with the context length, the result is that as you talk more and more with ChatGPT, eventually the combined totals of what you've asked and what it has replied will exceed the 4,096 token limit, and it won't be able to answer any more."}),"\n",(0,n.jsx)(t.h3,{id:"a-visualization-of-chatgpt-simultaneously-printing-and-scanning-back-in-the-entire-conversation-as-it-grows-to-extreme-proportions",children:"A visualization of ChatGPT simultaneously printing and scanning back in the entire conversation as it grows to extreme proportions."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"ChatGPT accumulating a very long chat",src:i(9994).Z+"",width:"1024",height:"1024"})}),"\n",(0,n.jsx)(t.h4,{id:"conversation-length-and-token-limitations-in-llms",children:"Conversation Length and Token Limitations in LLMs"}),"\n",(0,n.jsxs)(t.p,{children:["So how does ChatGPT handle this limitation? As your conversation with it grows, the number of tokens eventually exceeds the model's context window (e.g., 4,096 tokens for GPT-3.5). ChatGPT invisibly removes the oldest parts of the conversation to remain within the limit. This method\u2014using a rolling window of context\u2014is certainly one of the easiest to implement, but oftentimes it is not the perfect solution. Some chat alternative front-ends like ",(0,n.jsx)(t.a,{href:"https://www.typingmind.com/",children:"TypingMind"}),' both warn you when the context limit has been reached and allow you to manually delete sections of the chat that you don\'t need anymore. This lets you choose what information you want to remain in the chat, and has the bizarre philosophical effect of "editing the memory" of GPT.']}),"\n",(0,n.jsx)(t.p,{children:"For your average user using the web version of ChatGPT, what this means is that the longer your conversation, the sooner ChatGPT will start forgetting things you said at the beginning of the chat."}),"\n",(0,n.jsx)(t.h3,{id:"another-visualization-of-chatgpt-trimming-away-the-start-of-your-conversation-behind-the-scenes",children:"Another visualization of ChatGPT trimming away the start of your conversation behind the scenes."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"ChatGPT accumulating a very long chat",src:i(3435).Z+"",width:"1024",height:"1024"})}),"\n",(0,n.jsx)(t.p,{children:"It's good to be mindful of this restriction, especially when referring back to earlier parts of a conversation that might have been truncated due to token limitations\u2014the LLM will not be able to recall these anymore, but the web version of ChatGPT will not tell you. There's also always the risk that it could hallucinate answers based on other parts of the conversation if the beginning is trimmed off."}),"\n",(0,n.jsx)(t.p,{children:"Let's take another look at what happens in a more complex yet sillier chat interaction."}),"\n",(0,n.jsx)(t.h3,{id:"another-typical-but-silly-conversation-with-chatgpt",children:"Another typical but silly conversation with ChatGPT."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"How ChatGPT pretends to work",src:i(5772).Z+"",width:"2550",height:"2353"})}),"\n",(0,n.jsx)(t.h3,{id:"again-this-is-what-is-actually-going-on-behind-the-scenes",children:"Again, this is what is actually going on behind the scenes."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"How ChatGPT pretends to work",src:i(9350).Z+"",width:"2550",height:"2365"})}),"\n",(0,n.jsx)(t.h3,{id:"now-lets-suppose-we-have-a-long-enough-conversation-that-the-beginning-is-trimmed-off-chatgpt-might-either-state-that-its-forgotten-the-name-entirely-or-hallucinate-it",children:"Now let's suppose we have a long enough conversation that the beginning is trimmed off. ChatGPT might either state that it's forgotten the name entirely or hallucinate it."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"How ChatGPT pretends to work",src:i(2456).Z+"",width:"2550",height:"2463"})}),"\n",(0,n.jsx)(t.h3,{id:"and-finally-if-we-try-to-escape-this-problem-by-not-feeding-chatgpt-the-entire-conversation-it-will-forget-it-all-the-moment-it-finishes-generating-each-answer",children:"And finally, if we try to escape this problem by not feeding ChatGPT the entire conversation, it will forget it all the moment it finishes generating each answer."}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"How ChatGPT pretends to work",src:i(8347).Z+"",width:"2550",height:"2392"})}),"\n",(0,n.jsx)(t.p,{children:"Since ChatGPT's debut in November 2022, GPT-4 has been released with both 8,192 and 32,768 context lengths. This made things a lot better in terms of tracking long conversations, and in November 2023, GPT-4 Turbo was released with a 128k context length. Things are looking increasingly good for these models' ability to track long conversations. However, despite GPT-4 Turbo's massive amount of context, it still has a completion limit of 4,096 tokens, so it will always generate a maximum of about 3,000 words."}),"\n",(0,n.jsx)(t.h2,{id:"why-is-it-like-this",children:"Why is it like this?"}),"\n",(0,n.jsx)(t.p,{children:"Transformer-based models like GPT-3 and GPT-4 are designed to be stateless, for good reason! Primarily, this stateless nature significantly enhances scalability and efficiency. Each user request is processed independently, allowing the system to handle numerous queries simultaneously without the complexity of tracking ongoing conversations. Imagine the complexity if every time the model was called, it had to maintain some internal state across millions of users."}),"\n",(0,n.jsx)(t.p,{children:"Transformer model hidden states are also temporary and exist only for the duration of processing a specific input sequence. Once the model has processed an input and generated an output, these states are reset. They do not persist between different interactions."}),"\n",(0,n.jsxs)(t.p,{children:["Data privacy and security play a role as well. Stateless models do not retain a memory of past interactions, ensuring that sensitive data from one session is never inadvertently exposed to another user. This design choice is particularly relevant in light of incidents like ",(0,n.jsx)(t.a,{href:"https://en.wikipedia.org/wiki/Tay_(chatbot)",children:"Microsoft's Tay,"})," an AI chatbot that, due to its design to learn from interactions, ended up mimicking inappropriate and offensive language from users. It's just not safe to have models learn from inputs given by random users."]}),"\n",(0,n.jsx)(t.p,{children:"However, the stateless nature also means these models cannot remember user preferences or learn from past interactions. This is a limitation in scenarios where you might want to create personalized chatbots through past chats or systems that benefit from cumulative learning. To mitigate this, some implementations incorporate a stateful layer atop the stateless LLM, enabling personalized and continuous user experiences."}),"\n",(0,n.jsx)(t.h2,{id:"getting-a-bit-more-technical",children:"Getting a bit more technical"}),"\n",(0,n.jsxs)(t.p,{children:["Prominent examples of such layers include ",(0,n.jsx)(t.a,{href:"https://www.langchain.com/",children:"LangChain"}),", ",(0,n.jsx)(t.a,{href:"https://www.llamaindex.ai/",children:"LlamaIndex"}),", and ",(0,n.jsx)(t.a,{href:"https://haystack.deepset.ai/",children:"Haystack"}),". These layers add flexibility in managing the limited context that LLMs can handle by offering various strategies. For instance, when approaching the token limit, choices must be made: Should a rolling window approach be used to discard older text like in the web ChatGPT, or should GPT be utilized to summarize previous information? Is it more important to retain the initial context, like a source article, while removing less critical middle or later sections? Alternatively, should retrieval augmented generation (RAG, more on that in a later blog) techniques be employed to integrate external data into the token stream? These decisions vary based on the specific goals of the implementation. The most effective architectures often consist of specialized components interwoven to achieve a wide array of practical outcomes, allowing for more nuanced and effective user interactions."]}),"\n",(0,n.jsx)(t.p,{children:(0,n.jsx)(t.img,{alt:"A confused stateless robot",src:i(521).Z+"",width:"1024",height:"1024"})})]})}function d(e={}){const{wrapper:t}={...(0,o.a)(),...e.components};return t?(0,n.jsx)(t,{...e,children:(0,n.jsx)(c,{...e})}):c(e)}},5124:(e,t,i)=>{i(7294),i(4996),i(5893)},3435:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/chatgpt-cutting-a46d0da8fb8e542b1fc4668473f7d58b.jpg"},5772:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/chatgpt-name-1-dc45db4079f1e8dafba7ab49b90ae76b.jpeg"},9350:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/chatgpt-name-2-67272e5821cb56c4a9ca8fd3edd0dd51.jpeg"},8347:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/chatgpt-name-3-338403f314511d72e5f115cdd83ccdbf.jpeg"},2456:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/chatgpt-name-4-8ba86b96f0761141eb93a27cbb4d0e12.jpeg"},2959:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/chatgpt-photosynthesis-1-c2aa8fee81245c48d51d92df0afc0aa5.jpeg"},7752:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/chatgpt-photosynthesis-2-f3fb095ef8519a0ef8b7681e7719670c.jpeg"},4636:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/chatgpt-photosynthesis-3-12c4e20361df1dbcb1838a483460eb32.jpeg"},521:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/confused-1597cabfce805e83f79ef2cf41a2807c.jpg"},9994:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/rolled-chatgpt-51756537e64b16efdf83b5001c773e26.jpg"},6582:(e,t,i)=>{i.d(t,{Z:()=>n});const n=i.p+"assets/images/social-card-e9b8326af5cd7ed2f1080c7e0dcc443c.jpg"},1151:(e,t,i)=>{i.d(t,{Z:()=>h,a:()=>s});var n=i(7294);const o={},a=n.createContext(o);function s(e){const t=n.useContext(a);return n.useMemo((function(){return"function"==typeof e?e(t):{...t,...e}}),[t,e])}function h(e){let t;return t=e.disableParentContext?"function"==typeof e.components?e.components(o):e.components||o:s(e.components),n.createElement(a.Provider,{value:t},e.children)}}}]);