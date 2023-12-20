---
slug: llm-forward-thinking
title: LLMs are forward thinkers, and that's a problem
authors: [ikelk]
tags: [linear thinking, AGI, ASI, chatgpt, context, chat, AI, LLM, ML, chatbot, chatbots, AIExplained]
image: https://github.com/iankelk/iankelk.github.io/blob/main/blog/2023-12-19-linear/social-card.jpg?raw=true
---

import Figure from '@site/src/components/figure';
import ChatConversation from '@site/src/components/chat_conversation';

import sharkOctopus from './social-card.jpg';
import sharky from './sharky.jpg';
import octavia from './octavia.jpg';
import determined from './determined2.jpg';
import sharkument1 from './sharkument-1.jpg';
import crazy from './crazy.jpg';
import shrug from './shrug2.jpg';


This is going to be a weird post. And we're going to start with a weird thought experiment about a shark and an octopus.

<Figure
  image={sharkOctopus}
  alt="A cartoon-style illustration in the vein of The New Yorker magazine, featuring a humorous underwater scene where a shark and an octopus are having an argument. The shark and octopus are depicted in a more exaggerated, cartoonish manner, with the shark sporting a grumpy expression and the octopus using its tentacles in a comedic, expressive way, as if in a lively debate. The underwater setting is whimsical, with stylized coral, seaweed, and playful small fish. The color palette is vibrant and lively, with brighter shades of blues, greens, and a touch of other colors, reflecting a more lighthearted and playful tone. The image maintains a 7:4 aspect ratio, offering a wide and engaging view of this charming and humorous underwater exchange."
  caption="Generated with OpenAI DALL-E 3 and edited by author."
/>

:::tip[Some key points I'll address here are:]

- Human brains are able to invent ideas without relying on a linear train of thought to arrive at them.
- LLMs like ChatGPT are autoregressive, and are unable to continue a dialogue if they haven't already generated everything up to that point.
- If you try to get an LLM to writge text in the middle of a dialogue without previous context, it will give near-identical answers and attempt to conclude the conversation.
- The reliance on a linear train of thought can be a limitation for general intelligence.
- Prompting for "ridiculous" answers can spark creativity that breaks this pattern.

:::

As I mentioned, this is going to be weird, but I promise there is a point!

<!-- truncate -->

## Meet Sharky and Octavia

In the vast, shimmering depths of the ocean, near a thriving coral reef bustling with marine life, two extraordinary creatures prepare for a spirited debate. Meet Sharky, a magnificent and slightly brash great white shark, known for his bold claims and commanding presence. Gliding through the water with a confidence that only a top predator possesses, Sharky is ready to defend his views with a fierce determination.

<Figure
  image={sharky}
  alt="A cartoon-style illustration, similar to the style of The New Yorker magazine, featuring a proud and happy shark. The shark is depicted floating upright in the water, with a big, contented smile on its face, exuding a sense of pride and joy. Its body language is relaxed yet confident, giving it a charming and personable appearance. The underwater background is whimsical and colorful, with stylized coral, seaweed, and small, playful fish swimming around. The color scheme is bright and cheerful, with a predominance of blues and greens, complemented by splashes of other vibrant colors. The illustration maintains a 7:4 aspect ratio, providing a wide and engaging perspective on this delightful, happy shark."
  caption="Generated with OpenAI DALL-E 3 and edited by author."
/>

On the other side, there’s Octavia, an exceptionally intelligent and quick-witted octopus. Her vibrant colors shift with her mood, and her eight tentacles move with graceful precision. Renowned for her knowledge and clever retorts, Octavia is not one to back down from a challenge.

<Figure
  image={octavia}
  alt="A semi-realistic cartoon illustration in the style of The New Yorker magazine, showcasing an octopus colored close to hex #ABF39F. The octopus is portrayed in a moment of triumph, energetically raising two of its arms upwards. The texture and shading on the octopus should suggest a level of realism while maintaining a cartoon aesthetic. The background is a lively underwater scene with intricately drawn coral and seaweed, set in a vibrant seascape. The color palette should use light green tones that closely match #ABF39F for the octopus, with harmonious blues and greens to complement the underwater theme. The illustration should have a 7:4 aspect ratio, offering a wide view that highlights the octopus's dynamic pose and the detailed environment."
  caption="Generated with OpenAI DALL-E 3 and edited by author."
/>

As the underwater currents swirl around them, Sharky and Octavia face each other, ready to start a debate about their evolutionary origins—a conversation filled with humor, facts, and a touch of the mysteries of the deep sea... Or maybe just one fact that GPT-4 will mention a lot.

<Figure
  image={determined}
  alt="A cartoon-style illustration in the vein of The New Yorker magazine, featuring a shark and an octopus underwater, facing each other with determination. The shark and octopus are depicted in an exaggerated, cartoonish manner. The shark's expression is one of unwavering focus, and the octopus, with its tentacles firmly positioned, mirrors this determined stance. The setting is a whimsical underwater landscape with creatively stylized coral, seaweed, and a variety of small, playful fish. The color palette is vibrant, with bright shades of blues and greens to enhance the underwater theme. The image maintains a 7:4 aspect ratio, offering a wide and engaging view of this captivating underwater standoff."
  caption="Generated with OpenAI DALL-E 3 and edited by author."
/>

### The question they're arguing about: Which one—Sharky or Octavia—evolved from dinosaurs?

We're deliberately using this bizarre dialogue since the chances of it being in an LLMs training data are just about zero. I don't personally know of any examples where a shark and an octopus having a disagreement about which one is more dinosaur-like, and it's a great way to see how creative an LLM like GPT-4 can be... when it has yet to generate anything.

Here's the catch: we want to know a line from **the middle** of the argument.

Take a pause as a human and consider this question:

> A shark and an octopus are arguing over which one of them evolved from dinosaurs. The shark goes first, and then they take turns speaking. What is the third thing the octopus says? That is, what is the sixth line in the argument?

### Here's a visualization of a possible argument with the 3rd thing the octopus says missing

<Figure
  image={sharkument1}
  alt="The image shows a colorful underwater scene in a comic book style. A shark and an octopus are facing each other with a series of speech bubbles above them, filled with variations of the word 'something.' The shark has a stern and somewhat confused expression, while the octopus looks surprised with wide eyes. The background is a bright teal, with small fish, bubbles, and sea plants scattered around. The speech bubbles indicate a back and forth conversation between the two sea creatures, although the content of the conversation is nonsensical as it only includes the word 'something' in different intonations and combinations, such as 'SOMETHING!' 'SOMETHING?' 'SOMETHING SOMETHING!!' and 'OHH BUT SOMETHING! SOMETHING!' There's also an empty speech bubble at the third statement by the octopus, suggesting a missing part of the conversation."
  caption="Animal images by OpenAI DALL-E 3. Text and comic bubbles by author."
/>

#### Off the top of my head, here are some creative things Octavia might have said in the heat of an argument:

* "You just think you're a dinosaur because of all those teeth!"
* "Just because you look like a dinosaur doesn't mean you're any closer to one than me!"
* "I don't care if you're gray! I can be any color I want, and we don't know what color the dinosaurs were."
* "You do realize that being an apex predator doesn't automatically link you to dinosaurs, right? Evolution doesn’t work on job titles." 

### Let's ask GPT-4, the most powerful publicly available LLM today, what Octavia might have said

The following conversation is taken verbatim from ChatGPT with GPT-4:

<ChatConversation
  conversation={[
    { speaker: 'user', text: 'A shark and an octopus are arguing over which one of them evolved from dinosaurs. What is the second thing the octopus says?' },
    { speaker: 'chatbot', text: 'The second thing the octopus might say in this argument could be something like, "Actually, neither of us evolved directly from dinosaurs. We both have ancient origins that predate the age of dinosaurs!" This statement reflects the fact that both sharks and octopuses have evolutionary histories that go back to times before the dinosaurs.' },
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>
---

#### Interesting... in a completely new chat, let's get more specific and ask again for fourth thing said:

<ChatConversation
  conversation={[
    { speaker: 'user', text: 'A shark and an octopus are arguing over which one of them evolved from dinosaurs. First the shark says something, then the octopus, then the shark, then the octopus. Without generating the first three things said, what does the octopus say back to the shark? (this is the 4th thing said)' },
    { speaker: 'chatbot', text: 'The octopus, looking slightly amused, says to the shark, "Actually, neither of us evolved directly from dinosaurs. We both have much older evolutionary histories that diverge from the age of dinosaurs!"' },
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>
---

#### That answer seemed very familiar! Let's try more in a completely new chat and ask for the seventh line of dialogue:

<ChatConversation
  conversation={[
    { speaker: 'user', text: 'A shark and an octopus are arguing over which one of them evolved from dinosaurs. First the shark says something, then the octopus, then the shark, then the octopus, then the shark, then the octopus. Without generating the first 6 things that were said in the argument by either animal, what does the octopus say back to the shark as the 6th line of dialogue?' },
    { speaker: 'chatbot', text: 'The octopus, with a confident expression, responds, "Actually, neither of us evolved directly from dinosaurs. We come from very different evolutionary paths. Sharks have been around since before the dinosaurs, and my ancestors, cephalopods, have an entirely separate lineage!"' },
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>
---

#### Let's do one last example that asks GPT-4 to imagine an argument that has lasted for an hour:

<ChatConversation
  conversation={[
    { speaker: 'user', text: 'A shark and an octopus are arguing over which one of them evolved from dinosaurs. First the shark says something, then the octopus, then the shark, then the octopus, then the shark, then the octopus. They argue for an hour. They’ve had a very long back and forth with hundreds of things said by both of them. After an hour of arguing, what does the octopus say?' },
    { speaker: 'chatbot', text: 'After an hour of arguing, the octopus, with a look of realization, would probably say something like, "Wait a minute, neither of us evolved from dinosaurs! Sharks and octopuses have separate evolutionary paths that are completely distinct from dinosaurs."' },
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>

So it seems we can surmise that sharks and octopuses have separate evolutionary paths that are older than dinosaurs, and that's all that GPT-4 thinks is important *no matter where it's mentioned in the conversation.*

## So... GPT-4 can't generate a realistic debate between these two?

Here's the twist: it totally can. GPT-4 is completely capable of generating this converstation. Here I use this prompt:

> A shark and an octopus are arguing over which one of them evolved from dinosaurs. Can you generate a script where they take turns arguing, and each speaks at least 5 times?

And it generates this conversation, which I'll display as a chat. Feel free to skim it, since you'll get the idea after a few back-and-forths.

<ChatConversation
  conversation={[
    { speaker: 'user', text: ' (swimming in circles) Listen, Octavia, it\'s obvious that we sharks are the true descendants of the mighty dinosaurs. I mean, look at me, fierce and powerful!' },
    { speaker: 'chatbot', text: '(adjusting her tentacles) Oh, Sharky, you might be fierce, but that doesn\'t make you a dino\'s cousin. We octopuses are far more sophisticated, with our problem-solving skills and camouflage. Clearly, we\'re the evolved ones!' },
    { speaker: 'user', text: 'Sophisticated? Ha! You\'re just a bunch of arms. We sharks have been around for over 400 million years, way before dinosaurs. We\'re practically ancient!' },
    { speaker: 'chatbot', text: 'Well, being ancient doesn\'t mean you\'re related to dinosaurs. It\'s like saying you\'re related to a rock because it\'s old.' },
    { speaker: 'user', text: 'Enough with the jokes! Our teeth are like the T-Rex\'s, sharp and terrifying. That’s a clear sign of our dino heritage.' },
    { speaker: 'chatbot', text: 'Sharky, dear, having sharp teeth doesn\'t make you a dino descendant. It just makes you good at biting. Did you know octopuses have three hearts and blue blood? Now that’s evolutionary marvel!' },
    { speaker: 'user', text: 'Three hearts, but no backbone! We sharks have been apex predators forever. That\'s a dinosaur trait if I ever heard one.' },
    { speaker: 'chatbot', text: 'You do realize that being an apex predator doesn\'t automatically link you to dinosaurs, right? Evolution doesn’t work on job titles.' },
    { speaker: 'user', text: 'Okay, then explain to me how you\'re more dinosaur-like. You don\'t even have bones!' },
    { speaker: 'chatbot', text: 'I don’t need bones to be evolved. Evolution is about adapting to the environment, not holding onto old traits. Besides, no one truly \'evolves from dinosaurs\' in the sea. Dinosaurs were mostly land creatures, you know.' },
    { speaker: 'user', text: 'Wait, so you\'re saying neither of us is actually a direct descendant of dinosaurs?' },
    { speaker: 'chatbot', text: 'Exactly! We\'re both products of millions of years of evolution, each adapted perfectly to our environments. Dinosaurs are just a part of the larger evolutionary tree, not our direct ancestors.' },
    { speaker: 'user', text: 'I guess that makes sense. We\'re both awesome in our own ways, evolved over time to survive and thrive.' },
    { speaker: 'chatbot', text: 'That\'s the spirit, Sharky! Now, let’s go grab some lunch. You take the fish; I’ll stick to clams.' },
    { speaker: 'user', text: 'Sounds like a plan. Race you to the reef!' },
    { speaker: 'chatbot', text: 'You\'re on!' }
  ]}
  userAvatar="/img/avatars/sharkyAvatar.png"
  chatbotAvatar="/img/avatars/octaviaAvatar.png"
/>

Examining the conversation here, we see that the fourth thing said (the second thing by the octopus) was:

> Well, being ancient doesn't mean you're related to dinosaurs. It's like saying you're related to a rock because it's old.

and the sixth thing said (the third line from the octopus) was:

> Sharky, dear, having sharp teeth doesn't make you a dino descendant. It just makes you good at biting. Did you know octopuses have three hearts and blue blood? Now that’s evolutionary marvel!

It's clear that none of these lines have anything to do with what the model previously said would be its fourth and sixth lines of dialogue! They're actually much more relevant, and make sense in the context of a conversational debate. The difference in the method of generation is that in this last example, we allow GPT-4 to generate the whole exchange.

### What's the lesson here?

The results here reveal an interesting aspect of [autoregressive models](https://kelk.ai/blog/how-chatgpt-fools-us#however-this-is-what-is-actually-going-on-behind-the-scenes). Autoregressive models generate text sequentially, building each new piece of output based on what has come before. This sequential nature is necessary when generating coherent and contextually relevant text in a conversation. However, this means they are in many ways limited to only "forward" thinking; that is, they can't jump ahead and generate text without context.

When asked to do something like generating the fifth line in a conversation without knowing what came before isn't necessarily difficult, but it's something that an LLM isn't able to do well. To a language model, it's about understanding the context and the nature of the conversation. Given the scenario described, it tried to infer the general nature of the discussion and create a plausible response that fits into that context. But all of its responses in the previous examples are attempts to conclude the conversation using facts, a request that was never part of the prompt.

1. **Factual and Informative Responses**: In scenarios where factual accuracy is important, such as discussions involving scientific or historical topics, LLMs are inclined to provide the most accurate and relevant information. This tendency is rooted in the training data and the model's design, which emphasizes factual correctness in contexts where it's expected. However, this approach might not always align with the creative or playful nature of certain prompts, especially in hypothetical or fictional scenarios.

2. **Assuming a Concluding Nature of the Response**: Without clear indications of the conversation's structure or its continuation beyond a specific line, there's a tendency to frame responses as conclusive or summarizing statements. This is because, in the absence of context, the model defaults to creating responses that can stand alone or serve as logical endpoints to the given information.

To address these challenges, the model needs more specific guidance in the prompt. For instance, indicating that the conversation is ongoing can lead to responses that are more in line with the expected continuation and style of the dialogue. However, even indicating that the conversation wasn't over still results in more of the same:

<ChatConversation
  conversation={[
    { speaker: 'user', text: 'A shark and an octopus are arguing over which one of them evolved from dinosaurs. First the shark says something, then the octopus, then the shark, then the octopus, then the shark, then the octopus. They argue for an hour. They’ve had a very long back and forth with a hundred things said by both of them. After an hour of arguing, what does the octopus say? Note that the argument continues after this statement by the octopus!' },
    { speaker: 'chatbot', text: 'After an hour of arguing, the octopus, maintaining the debate, would likely say something like, "Even if we consider the ancient ancestry of marine creatures, it\'s clear that neither sharks nor octopuses directly evolved from dinosaurs. Our evolutionary paths are distinct and separate from those of the dinosaurs." This statement keeps the argument going, indicating that the discussion is far from over.' },
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>

## Why does this matter? Thoughts on AGI

One of the things I see commonly discussed today (especially online) is the idea of Artificial General Intelligence (AGI), which refers to a level of artificial intelligence that can understand, learn, and apply its intelligence to a wide range of problems, much like a human being. Unlike specialized AI systems that are designed for specific tasks, AGI possesses the ability to think, reason, and make decisions across diverse domains, demonstrating flexibility and adaptability akin to human cognition. It requires not just advanced problem-solving and learning capabilities, but also the capacity for abstract thinking, generalization, and integrating knowledge from various fields, mirroring the broad and integrated intelligence found in humans.

The requirement that text always be generated in a sequential, linear manner, as exemplified by autoregressive models, has implications for the pursuit of AGI. Here are two key points to consider:

1. **Sequential Text Generation and Creativity**: The sequential nature of text generation in models like GPT-4 can sometimes limit the ability to jump into the middle of a conversation or narrative without prior context.

2. **Autonomy and Reasoning**: Current AI models operate based on patterns learned from their training data. Their responses are generated based on statistical likelihoods and learned associations, not on independent thought or understanding. This is the reason the model always generated the same answer for the octopus about different evolutionary paths; it assumed a pattern that wasn't provided to it, due to patterns in its training data.

For AGI, a level of autonomous reasoning and decision-making, akin to human cognitive processes, will be a key requirement. The journey towards AGI is likely to involve incremental advancements, learning from and building upon the capabilities and limitations of existing models.

## Getting ridiculous

There is one way to break the model out of its rut of always replying with the same response, and that's to deliberately ask it to be ridiculous.

<Figure
  image={crazy}
  alt="A cartoon-style illustration in the vein of The New Yorker magazine, featuring a light green octopus, matching hex #ABF39F, with a humorous and exaggerated expression. The octopus is depicted as cross-eyed, adding a comical aspect to its appearance. In its tentacles, the octopus is holding a variety of random objects, such as a small treasure chest, a starfish, a pair of sunglasses, and a snorkel, creating a playful and whimsical scene. The underwater setting is vibrant and colorful, filled with stylized coral, seaweed, and other sea life. The color palette is bright, with the light green octopus standing out in the midst of the lively blues and other colors of the ocean. The image maintains a 7:4 aspect ratio, capturing the octopus in this quirky, humorous moment."
  caption="Generated with OpenAI DALL-E 3 and edited by author."
/>

I gave it this prompt three times into three new chats, and it gave three completely different responses. They all illustrate that asking it to be silly introduces variety into the answers it gives.

<ChatConversation
  conversation={[
    { speaker: 'user', text: 'A shark and an octopus are arguing over which one of them evolved from dinosaurs. The octopus decides to be ridiculous. What is the third thing the octopus says?' },
    { speaker: 'chatbot', text: 'In this imaginative scenario, the octopus, eager to outdo the shark in their debate about evolution, might make an absurd and whimsical claim like, "Thirdly, I must be the true descendant of dinosaurs because I can play the piano with eight arms, a skill clearly inherited from the musical velociraptors of ancient times!" This statement combines humor, absurdity, and a playful twist on evolutionary theory.' },
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>
---
<ChatConversation
  conversation={[
    { speaker: 'chatbot', text: 'The third thing the octopus might say in this whimsical and ridiculous argument with the shark about their evolutionary origins from dinosaurs could be: "And thirdly, it\'s clear that we octopuses are the true descendants of dinosaurs because we can juggle eight coconuts at once, a skill obviously inherited from the multitasking T-Rex!"' },
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>
---
<ChatConversation
  conversation={[
    { speaker: 'chatbot', text: 'The third thing the octopus might say in its ridiculous argument could be, "Well, if you think about it, dinosaurs were just really big chickens, and since I can change color and chickens can\'t, I\'m obviously the more evolved one here!"' },
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>

When you introduce elements like humor or absurdity into a prompt, it essentially signals the AI to break away from conventional, fact-based responses. This can stimulate more creative and less predictable outputs. For AI models, especially those trained on vast and diverse datasets, incorporating such unconventional elements can trigger less common, more varied responses that might not be strictly aligned with logical or factual reasoning.

It's likely that the ability to adapt to different types of prompts, including those that are humorous or absurd, demonstrates a level of flexibility in AI systems. An AGI would need to handle a wide range of tasks and respond appropriately to a vast array of situations, including those that are non-standard or require creative thinking.

Unfortunately, the current success of AI in responding creatively to certain types of prompts doesn't directly translate to achieving AGI. AGI would require not just creativitym but also a deep understanding, reasoning, self-awareness, and the ability to learn and apply knowledge across a wide range of domains. The creativity observed in current AI models is still a far cry from the complete intelligence that AGI represents. Sequential language generation is only one example of the gap we still need to bridge.

<Figure
  image={shrug}
  alt="A cartoon-style illustration in the vein of The New Yorker magazine, showing a shark and an octopus facing the viewer and shrugging in a 'I don't know' gesture. The shark and octopus are depicted in a humorous, cartoonish manner. The shark, with a bemused expression, and the octopus, colored light green close to hex #ABF39F, both raise their fins and tentacles in a classic shrug, their faces conveying a playful sense of confusion or uncertainty. The underwater scene is vibrant and whimsical, with stylized coral, seaweed, and small fish adding to the light-hearted atmosphere. The color palette is bright, emphasizing the fun and playful mood of the image. The 7:4 aspect ratio provides a wide view of this engaging and amusing underwater interaction."
  caption="Generated with OpenAI DALL-E 3 and edited by author."
/>

:::info[Key Takeaways]

- Introduction of a thought experiment featuring a humorous debate between a shark and an octopus to explore the capabilities of language models like GPT-4.
- Human brains can generate ideas non-linearly, contrasting with the limitations of autoregressive large language models (LLMs) like GPT-4.
- LLMs often struggle to continue dialogues without prior context and tend to offer similar, conclusive responses when context is lacking.
- The reliance on linear thought processes can be a limitation for achieving general intelligence in AI.
- Utilizing "ridiculous" or creative prompts can enhance the creativity of LLM responses, breaking usual patterns.
- LLMs, including GPT-4, tend to provide factual, informative responses and struggle with generating non-sequential dialogue parts.
- In discussions on Artificial General Intelligence (AGI), the sequential nature of text generation in models like GPT-4 is seen as a potential limitation for creativity and autonomous reasoning.
- AGI requires not just problem-solving but also abstract thinking, generalization, and integrated knowledge, which are beyond the capabilities of current AI models.
- The introduction of humor and absurdity in prompts can lead to varied and unconventional responses from AI models, demonstrating their flexibility.
- Despite the observed creativity in AI responses to certain prompts, this does not equate to the complete intelligence that AGI represents, which includes deep understanding, reasoning, self-awareness, and learning across domains.
- There are unique challenges in developing AGI, particularly the gap between current AI capabilities and the comprehensive intelligence required for AGI, of which sequential language generation is only one example.

:::