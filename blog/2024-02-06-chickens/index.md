---
slug: secret-chickens
title: The secret chickens that run LLMs
authors: [ikelk]
tags: [distribution, sampling, top-p, top-k, temperature, AGI, ASI, chatgpt, chat, AI, LLM, ML, chatbot, chatbots, AIExplained]
enableComments: true
image: https://github.com/iankelk/iankelk.github.io/blob/main/blog/2024-02-06-chickens/social-card.jpg?raw=true
---
import CodeBlock from "@theme/CodeBlock";
import Figure from '@site/src/components/figure';
import ChatConversation from '@site/src/components/chat_conversation';

import chickenWink from './social-card.jpg';
import kyleField from './kyle_field.jpg';
import chickenOriginal from './chicken-original.jpg';
import chicken50k from './chicken-50k.jpg';
import nn from './nn-man.jpg';
import ninja from './ninja.jpg';
import chickenQuizzical from './chicken-quizzical.jpg';
import introChicken from './chicken-intro.jpg';
import coinFlip from './coinflip.jpg';
import chickenTuning from './chicken-tuning.jpg';
import chickenLowTemp from './chicken-low-temp.jpg';
import chickenHighTemp from './chicken-high-temp.jpg';
import chickenTopK from './chicken-top-k.jpg';
import chickenTopKRenorm from './chicken-top-k-renorm.jpg';
import chickenTopP from './chicken-top-p.jpg';
import chickenTopPRenorm from './chicken-top-p-renorm.jpg';
import cards from './cards.jpg';
import hiddenChicken from './hidden-chicken.jpg';


Humans often organize large, skilled groups to undertake complex projects, yet often place less-than-competent individuals in charge. Despite this, they somehow succeed! Large language models (LLMs) seem to be carrying on this proud tradition with my new favorite metaphor of who's ultimately responsible for the text they generate--a chicken.

:::note

In this post, I use the term *word* instead of *token* to describe what an LLM predicts. This is just a useful simplification to avoid having to address why the model might predict half a word or a semicolon, since the underlying principles of the "stochastic chicken" are the same.

:::

<Figure
  image={chickenWink}
  alt="An illustration that features a whimsical chicken winking at the camera with an expression reminiscent of Mr. Beast in a YouTube thumbnail. The chicken, full of personality and charm, is front and center. In the background, there's a plethora of computers and tech equipment, suggesting a high-energy, creative digital workspace or a gaming setup. This mix of traditional and modern elements should capture the playful, engaging spirit of online content creation, all rendered in the sophisticated, detailed aesthetic of New Yorker illustrations. The artwork should be dynamic and filled with intricate details that invite the viewer to explore the scene."
  caption="Generated with OpenAI DALL-E 3 and edited by the author."
/>

:::tip[Some key points I'll address here are:]

- Modern LLMs are huge and incredibly sophisticated. Yet despite their size and complexity, for every word they generate, they have to hand their predictions over to a random function to pick the actual word.
- These random functions that choose the word are no smarter than a chicken pecking at different piles of feed which chooses the word.
- Without these "stochastic chickens", large language models wouldn't work.
:::

<!-- truncate -->

## LLMs aren't messing around when they say they're "large" 

Picture a stadium full of people. Here's [Kyle Field](https://en.wikipedia.org/wiki/Kyle_Field) in College Station, Texas, with a seating capacity of 102,733. In this photo from 2015 it looks pretty full, so let's assume there are 100,000 people there.

<Figure
  image={kyleField}
  alt="A panorama of the interior of Kyle Field in College Station, Texas. Taken at the Ball State game during the 2015 season."
  caption="Attribution: [Janreagan](https://en.wikipedia.org/wiki/User:Janreagan) at [Wikipedia Commons](https://commons.wikimedia.org/wiki/File:Kyle_Field_Panorama.jpg)"
/>

We've given each one of these (very patient) people a calculator, and given them the instruction that the person in the seat in front of them will give them some number, at which point they need to do a little work on their calculator and pass their new number to the person behind them. For the sake of this analogy, let's assume that despite a considerable number of them being distracted, drunk, or children, they all are able to complete the task.

As the number travels from the front of the stadium to the back, it undergoes a series of transformations. Each person's "little work" on their calculator is akin to the operations performed by neurons in a layer of the neural network—applying weights (learned parameters), adding biases, and passing through activation functions. These transformations are based on the knowledge embedded in the model's parameters, trained to recognize patterns, relationships, and the structure of language.

By the time the number reaches the last person in the stadium, it has been transformed multiple times, each step incorporating more context and adjusting the calculation based on the instructions (the model's architecture and trained parameters). This final result can be seen as the model's output—a complex representation of the input data that encodes the probabilities of the next possible word.

But here's the strange part: despite all this incredible depth of stored knowledge, we're going to take the recommended answers provided by these thousands of people, and select one using a completely random process. It's kind of like a huge pyramid where people work together to assemble a set of possible answers to a problem, then hand it at the top to a person flipping a coin.

<Figure
  image={coinFlip}
  alt="A person flipping a coin atop a pyramid of thousands of people working to solve a problem."
  caption="'Guys... I'm not sure our boss is as smart as we think he is...'\nGenerated with OpenAI DALL-E 3 and edited by the author."
/>


Actually, we can do better than this. To really illustrate the contrast between the complexity of a  model with billions of parameters getting its final answer from a dumb-as-a-rock random number generator, let's use something truly silly. Let's use a chicken. 

To get this chicken involved, we're going to use the results of our calculations to create piles of chicken feed, each one representing a potential next word the model might generate. The bigger the pile, the higher the probability that word should be selected.

<Figure
  image={introChicken}
  alt="A robot handing a paper to a chicken"
  caption="Generated with OpenAI DALL-E 3 and edited by the author."
/>

:::warning

I am not a licensed farmer, and this is just how I assume chickens work.

:::

The chicken, oblivious to the tireless efforts of the stadium's occupants, simply wanders among the piles of chicken feed. Its choice is guided by the sizes of these piles—larger piles are more enticing because they are easier to spot and peck at, but the chicken also has ADHD. It's whims or a sudden distraction might send it running to a smaller pile instead.

Why on earth would we do something like this? Why would we create massive, intelligent machines ultimately rely on the random judgments of a gambling idiot?

The answer is that deep language models such as LLMs are built with neural networks, and neural networks are deterministic.

### What does deterministic mean?

Being deterministic means that if you do something exactly the same way every time, you'll always get the same result. There's no randomness or chance involved. Think of it like a using a simple calculator; if you type in $2 + 2$ on any basic calculator, it will always show "4". It won't suddenly decide to show "5" one day.

In contrast, something that's not deterministic (we call this stochastic) is like rolling a dice; even if you try to do it the same way each time, you can get different outcomes because chance is involved. So, deterministic means predictable and consistent, with no surprises based on how you started.

### Why are neural networks deterministic?

A neural network is a complex system inspired by the human brain, designed to recognize patterns and solve problems. It's made up of layers of artificial neurons, which are small, simple units that perform mathematical operations. Each neuron takes in some input, does some mathematical function to it, and then passes the result on to the next neuron in line.

As a huge simplification of how these models work, these neurons are organized into layers: there's an input layer that receives the initial data (like the token representations of words in a sentence), one or more hidden layers that process the data further, and an output layer that provides the final decision (the probability distribution for the predicted next word in the text).

The diagram below might look **crazy** complicated, but the only thing you need to understand is that each line represents some math function performed from one circle to the next. Some numbers go in one side, and some numbers go out the other side.

<Figure
  image={nn}
  alt="A neural network"
  caption="Maybe it looks scary, but each line connecting the dots is just a little math that never changes.\nGenerated with [NN-SVG](https://alexlenail.me/NN-SVG/) and DALL-E 3"
/>

The reason a neural network is deterministic lies in how these artificial neurons are connected and how they process data. If you give the network the same input and the network has not been changed (its weights, or how much it values certain pieces of input, remain the same), it will always perform the same calculations in the same order, and thus return the same output. While LLMs will have *billions* of these neurons, the basic idea is the same: for a given input, you will **always** get the same output. Typing $2+5\times10$ into a calculator will always give you $52$, no matter how many times you do it.

### So why do LLMs give different responses each time to the same prompt?


This seems suspicious. If you ask an LLM the same thing multiple times, it will give you different answers each time. This contradicts the claim that neural networks are deterministic, right? 

## *ENTER THE CHICKEN*

<Figure
  image={ninja}
  alt="A movie poster featuring a ninja chicken as the protagonist. This vivid depiction showcases the ninja chicken in an epic stance, wielding nunchucks, against a bustling city night. The poster's design incorporates a mix of dark humor and action, titled 'Ninja Chicken: Shadow of the Night,' with engaging taglines such as 'Feathers of Fury' and 'When the city sleeps, the cluck awakens.' The artwork blends the refined essence of New Yorker visuals with the excitement and suspense of a blockbuster movie poster, emphasizing the ninja chicken's heroic silhouette against a backdrop of neon lights and urban mystery. The illustration creates an intriguing narrative of adventure and comedy, appealing to viewers' imaginations."
  caption="Generated with OpenAI DALL-E 3 and edited by the author."
/>

This is why we need the chicken. The chicken is stochastic, and adds randomness and unpredictability to the LLM.

The humans, who for some reason have deified a chicken, will present the chicken with a series of words and probabilities. Technically these are not words but *tokens*; however, for the sake of simplifying this analogy let's refer to them as words. These words and probabilities can be visualized as a series of piles of chicken feed, where each word pile's size corresponds to their probability.

Let's use an example! Here's a prompt that we can give to our language model to see what next word it's going to predict: **"After midnight, the cat decided to..."**

If we show all the possible words that could finish this sentence, the number of food piles would match the size of the model's vocabulary. For a model like GPT-3, this would be **50,257** piles of food!

:::note

The way that GPT-3 can encapsulate all the words in 50+ languages into just 50,257 tokens is its own special magic that I'll cover later. Here's a [Wikipedia link](https://en.wikipedia.org/wiki/Byte_pair_encoding) in the meantime.

:::

<Figure
  image={chicken50k}
  alt="Illustration depicting a chicken looking down a long line of seed piles that extends into the horizon, giving the illusion of an infinite number of piles. The seeds are on pieces of paper with words written on them, and the size of the piles and the spacing between them decrease as they recede into the distance, enhancing the perception of infinity. The scene is elegantly composed, capturing the curiosity of the chicken as it contemplates the endless supply, embodying the sophisticated and artistic essence of The New Yorker's visual storytelling. The aspect ratio of the image is 7:4."
  caption="How the heck is an image like this going to help us understand how the chicken chooses the feed?\nGenerated with OpenAI DALL-E 3"
/>

Clearly trying to visualize a chicken choosing from 50,257 options isn't very useful. Let's instead limit our chicken's choices to only the top 6 words that the language model chose. Here are the options for the chicken and how it might look when the chicken is presented with them:


| Activity  | blog | meditate | cook | eat  | sleep | hunt |
|-----------|------|----------|------|------|-------|------|
| Probability | 0.03 |   0.05   | 0.1  | 0.15 |  0.2  | 0.25 |

### "After midnight, the cat decided to..."

<Figure
  image={chickenOriginal}
  alt="Illustration depicting a chicken pecking at five different piles of seed. The seeds are neatly lined up, each on a separate piece of paper with a word written on it. The amount of seed in each pile forms a power law distribution, with the first pile having the most seeds and the amount decreasing in each subsequent pile. The scene is elegantly composed, with the chicken engaging with the piles in a curious and orderly manner. The aspect ratio of the image is 7:4."
  caption="Showing the top 6 options makes things a lot easier to understand.\nChicken and feed generated with OpenAI DALL-E 3 and edited by the author."
/>

Let's suppose the chicken decides to choose the word **"eat"**, despite it only being the third most probably word since it has the third largest feed pile.

Unfortunately, our chicken's work is just beginning, because it will now need to choose every subsequent word in the following way. Once again, it will be presented with a list of probable words from thousands of hardworking humans in the stadium, and once again it will have to use its tiny chicken brain to select a word. Now our prompt to complete is **"After midnight, the cat decided to eat..."** with the following top 6 possible words and their probability distribution:

| Food  | birds | plants | grass | mice  | catnip | tuna |
|-----------|------|----------|------|------|-------|------|
| Probability | 0.02 |   0.04   | 0.11  | 0.13 |  0.22  | 0.23 |

### "After midnight, the cat decided to eat..."

<Figure
  image={chickenQuizzical}
  alt="Illustration depicting a chicken pecking at five different piles of seed. The seeds are neatly lined up, each on a separate piece of paper with a word written on it. The amount of seed in each pile forms a power law distribution, with the first pile having the most seeds and the amount decreasing in each subsequent pile. The scene is elegantly composed, with the chicken engaging with the piles in a curious and orderly manner. The aspect ratio of the image is 7:4."
  caption="One word down, just a few hundred more to go.\nChicken and feed generated with OpenAI DALL-E 3 and edited by the author."
/>

The incredible irony of all this is that some of these language models are trained using *trillions* of words—comprising the collective works of humanity—and costing *millions* of dollars in the process. We then hand these predictions over to an unintelligent gambling chicken to choose what to actually say. With each choice from the chicken, the model's output increasingly diverges from the sequence of the most statistically probable words. Somehow, this produces more natural-sounding language.

It's kinda bonkers.

In fact, not using the chicken—and just taking the most probable words from the LLM—generates poor language. This is called *greedy decoding*, and it has a whole host of problems.

## Why we need the chicken

### Repetitiveness

Greedy decoding tends to produce repetitive or looped text. Since it always chooses the most probable next word, it can get stuck in a pattern where the same sequence of words keeps being selected. This can happen in situations where the model finds a certain pattern of text to be highly probable and, without a certain chicken to encourage diversity, falls into a cycle of selecting the same sequence over and over again.

Here's a short example with some creative writing:

**Prompt**: "Write a short story taking place in a park in the morning"

The model begins the sentence without issue, and begins by writing "The park was serene in the early morning, with", but then it runs into problems.

**Greedy Decoding Sequence**:
1. The model predicts "the" as the most probable next word.
2. Following "the", it predicts "birds" as the next word.
3. After "birds", it predicts "were" as the next word.
4. Then, "singing" is predicted.
5. However, after "singing", the model might predict "in" as the next most probable word, leading back to "the" again, and then "park", forming a loop.
6. We get this conversation:


<ChatConversation
  conversation={[
    { speaker: 'user', text: 'Write a short story taking place in a park in the morning' },
    { speaker: 'chatbot', text: 'The park was serene in the early morning, with the birds were singing in the park with the birds were singing in the park with the birds were singing in the park with the birds were singing in...' },
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>
<br />

### Lack of Creativity and Diversity

Real human language is rich and varied, often taking unexpected turns, beautiful jellyfish. By always choosing the most probable word, the generated text misses out on these creative and less predictable aspects of language, resulting in outputs that can feel dull or overly formulaic.

### Contextual Inappropriateness

The most probable next word is not always appropriate. Language is highly contextual, and the best choice in one situation might not be the most statistically common one. Greedy decoding can lead to nonsensical or awkward phrases that, while grammatically correct, do not fit well with the preceding text.

Here's another example using a job application:

**Prompt**: "Write me a cover letter applying for a job in marketing"

Again the model begins the sentence without issue, and begins by writing "Dear Ms. Smith, I am writing to express my interest ..." but then again we hit a pothole.

In a cover letter for a job application, the language model should discuss the sender's relevant skills, experiences, or why they are a good fit for the job. However, a contextually inappropriate continuation might look like this:

<ChatConversation
  conversation={[
    { speaker: 'user', text: 'Write me a cover letter applying for a job in marketing' },
    { speaker: 'chatbot', text: 'Dear Ms. Smith, I am writing to express my interest in the marketing position advertised on your website. With my extensive experience in the field, I believe I am well-qualified for the role.' },
    { speaker: 'chatbot', text: 'In addition to my professional qualifications, I love to party on weekends and often go skydiving for fun. My favorite TV show is \'The Office,\' and I\'m a great cook. I\'m looking for an adventurous partner in crime who\'s down for an impromptu trip to Vegas or a quiet evening at home watching \"Real Housewives\".'},
  ]}
  userAvatar="/img/userAvatar.jpeg"
  chatbotAvatar="/img/chatbotAvatar.jpeg"
/>
<br />

The model, perhaps trained on more dating profiles than job applications, has continued the cover letter using the *most* probable words it predicted. While language models can recognize patterns and generate text based on statistical probabilities, they don't understand context in the same way humans do. They might link professional qualifications to personal hobbies due to statistical correlations in the training data, not recognizing the formal context of a job application email.

### Inability to Explore Multiple Paths

Greedy decoding means that an LLM will always produce the same output for any given input. Asking it to "tell a story" for example, would always result in the same story, assuming it isn't plagued with the previously mentioned problems. Language generation, especially in creative or complex tasks, often benefits from considering multiple possible continuations at each step. Greedy decoding's linear path through the probability distribution means fewer interesting outputs that a more exploratory approach could uncover. 

## Tuning the chicken

If you've ever dug into the optional parameters one of the LLM providers APIs, you might have references to tuning "inference hyperparameters" to control how "creative" an LLM can be. These are ways of finding a balance between coherence (sticking to a topic or narrative) and creativity (introducing novel ideas or phrases).

:::info

An "inference hyperparameter" refers to a configuration for how a machine learning model, particularly language models, produce predictions. These settings, such as *temperature*, *top-k*, and *top-p*, control the behavior of the model when generating text, influencing aspects like diversity, randomness, and the overall style of the output. Unlike traditional hyperparameters set prior to training to guide the learning process, **inference hyperparameters** are set to optimize performance for specific tasks or outcomes.

:::

What may come as a surprise is that these methods don't modify the massive underlying neural network part of these models at all. They affect the chicken.

<Figure
  image={chickenTuning}
  alt="Illustrate an image in a sophisticated, detailed, and often humorous style. The scene depicts a woman carefully tuning a guitar. Uniquely, the guitar's headstock is whimsically replaced with the head of a chicken, blending the realms of music and whimsy. The woman, dressed in casual yet stylish attire, focuses intently on her task, unaware of the absurdity. The background is minimal but elegant, ensuring the focus remains on the interaction between the woman and her unusual instrument. The image is to be crafted with a keen eye for detail and a touch of surreal humor. The aspect ratio should be 7:4, providing a wide landscape view of this imaginative moment."
  caption="Working with the chicken to find the optimal tuning (Pen and ink with DALL-E 3, 2024)"
/>

### Temperature

Temperature is an inference hyperparameter used to control the randomness of predictions by scaling the logits (the raw output scores from the model) before applying the softmax function to get probabilities. The temperature parameter basically adjusts how conservative or adventurous the model's predictions are.

#### Temperature = 1

When the temperature is set to 1, it has no effect on the logits, and the model produces outcomes based on the trained probabilities. This is the default setting, where no scaling is applied, and the chicken's choices won't be affected.

<Figure
  image={chickenOriginal}
  alt="Illustration depicting a chicken pecking at five different piles of seed. The seeds are neatly lined up, each on a separate piece of paper with a word written on it. The amount of seed in each pile forms a power law distribution, with the first pile having the most seeds and the amount decreasing in each subsequent pile. The scene is elegantly composed, with the chicken engaging with the piles in a curious and orderly manner. The aspect ratio of the image is 7:4."
  caption="The original chicken image as shown previously\nChicken and feed generated with OpenAI DALL-E 3 and edited by the author."
/>

#### Temperature < 1 (e.g., 0.5)

Lowering the temperature makes the model more confident in its outputs by increasing the gap between the probability of the most likely outcomes and the rest. This makes the chicken's choices less diverse and more deterministic; how could any chicken ignore that *huge* pile by the word "hunt"? A lower temperature is useful when you want the model to take fewer risks and stick closely to the most likely predictions. This can, however, lead to a lack of variety and potentially more repetitive outputs, since as the temperature approaches $0$ it approximates greedy decoding (with all the problems [previously discussed](#why-we-need-the-chicken)).

<Figure
  image={chickenLowTemp}
  alt="Illustration depicting a chicken pecking at five different piles of seed. The seeds are neatly lined up, each on a separate piece of paper with a word written on it. The amount of seed in each pile forms a power law distribution, with the first pile having the most seeds and the amount decreasing in each subsequent pile. The scene is elegantly composed, with the chicken engaging with the piles in a curious and orderly manner. The aspect ratio of the image is 7:4."
  caption="Using a lower temperature of 0.5, the differences between the probabilities have increased\nChicken and feed generated with OpenAI DALL-E 3 and edited by the author."
/>

<details>
  <summary>How is this calculated? (math & Python code)</summary>

  <div>
      Using our original distribution with probabilities of 0.03, 0.05, 0.1, 0.15, 0.2, and 0.25. How would these change if we used a temperature of 0.5?

      Given a distribution of probabilities $P = [0.03, 0.05, 0.1, 0.15, 0.2, 0.25]$ and a temperature $T = 0.5$, we adjust the probabilities as follows:

      1. **Compute the logits**: In this context, you can think of logits as the pre-softmax outputs that the model uses to calculate probabilities. However, since we start with probabilities and want to adjust them by temperature, we reverse-engineer logits by taking the natural logarithm of the probabilities. Thus, the logit for each probability $p_i$ in $P$ is given by:

      $$
      \text{logit}(p_i) = \log(p_i)
      $$

      2. **Scale the logits by the temperature**: We then scale these logits by dividing them by the temperature $T$. This step adjusts the distribution of the logits based on the temperature value. For a temperature of $0.5$, the scaling is:

      $$
      \text{scaled\_logit}(p_i) = \frac{\log(p_i)}{T}
      $$

      3. **Convert the scaled logits back to probabilities**: We use the softmax function to convert the scaled logits back into probabilities. The softmax function is applied to the scaled logits, ensuring that the output probabilities sum to $1$. The softmax of a scaled logit $s_i$ is given by:

      $$
      \text{softmax}(s_i) = \frac{e^{s_i}}{\sum_j e^{s_j}}
      $$

      where $s_i$ is the scaled logit for probability $p_i$, and the denominator is the sum of the exponential of all scaled logits in the distribution. This ensures that the adjusted probabilities sum to $1$.

      Putting it all together for each probability $p_i$ in $P$ and a temperature $T = 0.5$, the adjusted probability $p_i'$ is calculated as:

      $$
      p_i' = \frac{e^{\frac{\log(p_i)}{0.5}}}{\sum_j e^{\frac{\log(p_j)}{0.5}}}
      $$

      This formula shows how each original probability is transformed under the influence of the temperature. By applying this process to our original probabilities with $T = 0.5$, we enhance the differences between them, making the distribution more "peaky" towards higher probabilities, as seen with the new probabilities approximately becoming 0.007, 0.018, 0.072, 0.163, 0.289, and 0.452.

:::note

Step 1 is likely not necessary in practice, since the model's outputs would likely be logits, and thus transforming probabilities back into logits isn't needed. However, since we started with probabilities for illustrative purposes, we transform them to logits in the example.
:::

```python title="Python code for calculating probabiltities with temperature 0.5"
import numpy as np
# Original probabilities
probabilities = np.array([0.03, 0.05, 0.1, 0.15, 0.2, 0.25])

# Temperature
temperature = 0.5

# Adjusting probabilities with temperature
adjusted_probabilities = np.exp(np.log(probabilities) / temperature)
adjusted_probabilities /= adjusted_probabilities.sum()

adjusted_probabilities
```
**Output**

```
array([0.00650289, 0.01806358, 0.07225434, 0.16257225, 0.28901734,
       0.4515896 ])
```

  </div>

</details>

#### Temperature > 1 (e.g., 2)

Increasing the temperature makes the model's predictions more uniform by reducing the differences between the logits. In the below image, while the highest probability of $0.24$ has only been reduced slightly, the lowest probability of $0.03$ has tripled to $0.09$. This means *all* the words in the vocabulary now have a more equal chance of being chosen by the chicken. This leads to higher randomness in the output, allowing for more diverse and sometimes more creative or unexpected predictions; a higher temperature is useful when you want the model to explore less likely options or when generating more varied and interesting content. However, too high a temperature might result in nonsensical or highly unpredictable outputs, because the model will start considering very low probability words that make no refrigerator.

<Figure
  image={chickenHighTemp}
  alt="Illustration depicting a chicken pecking at five different piles of seed. The seeds are neatly lined up, each on a separate piece of paper with a word written on it. The amount of seed in each pile forms a power law distribution, with the first pile having the most seeds and the amount decreasing in each subsequent pile. The scene is elegantly composed, with the chicken engaging with the piles in a curious and orderly manner. The aspect ratio of the image is 7:4."
  caption="Using a higher temperature of 2, the differences between the highest and lowest probabilities have decreased\nChicken and feed generated with OpenAI DALL-E 3 and edited by the author."
/>

<details>
  <summary>How is this calculated? (math & Python code)</summary>

  <div>
      Using our original distribution with probabilities of 0.03, 0.05, 0.1, 0.15, 0.2, and 0.25. How would these change if we used a temperature of 0.5?

      Given a distribution of probabilities $P = [0.03, 0.05, 0.1, 0.15, 0.2, 0.25]$ and a temperature $T = 2$, we adjust the probabilities as follows:

      1. **Compute the logits**: In this context, you can think of logits as the pre-softmax outputs that the model uses to calculate probabilities. However, since we start with probabilities and want to adjust them by temperature, we reverse-engineer logits by taking the natural logarithm of the probabilities. Thus, the logit for each probability $p_i$ in $P$ is given by:

      $$
      \text{logit}(p_i) = \log(p_i)
      $$

      2. **Scale the logits by the temperature**: We then scale these logits by dividing them by the temperature $T$. This step adjusts the distribution of the logits based on the temperature value. For a temperature of $2$, the scaling is:

      $$
      \text{scaled\_logit}(p_i) = \frac{\log(p_i)}{T}
      $$

      3. **Convert the scaled logits back to probabilities**: We use the softmax function to convert the scaled logits back into probabilities. The softmax function is applied to the scaled logits, ensuring that the output probabilities sum to $1$. The softmax of a scaled logit $s_i$ is given by:

      $$
      \text{softmax}(s_i) = \frac{e^{s_i}}{\sum_j e^{s_j}}
      $$

      where $s_i$ is the scaled logit for probability $p_i$, and the denominator is the sum of the exponential of all scaled logits in the distribution. This ensures that the adjusted probabilities sum to $1$.

      Putting it all together for each probability $p_i$ in $P$ and a temperature $T = 2$, the adjusted probability $p_i'$ is calculated as:

      $$
      p_i' = \frac{e^{\frac{\log(p_i)}{2}}}{\sum_j e^{\frac{\log(p_j)}{2}}}
      $$

      This formula demonstrates how we adjust each probability with the temperature. Applying this method to our original set of probabilities with $T = 2$ results in a flatter distribution. The differences between probabilities are reduced, making the distribution more uniform and reducing the variance in outcomes, as seen with the new probabilities approximately becoming 0.085, 0.109, 0.154, 0.189, 0.218, and 0.244.

:::note

Step 1 is likely not necessary in practice, since the model's outputs would likely be logits, and thus transforming probabilities back into logits isn't needed. However, since we started with probabilities for illustrative purposes, we transform them to logits in the example.
:::

```python title="Python code for calculating probabiltities with temperature 2"
import numpy as np
# Original probabilities
probabilities = np.array([0.03, 0.05, 0.1, 0.15, 0.2, 0.25])

# Temperature
temperature = 2

# Adjusting probabilities with temperature
adjusted_probabilities = np.exp(np.log(probabilities) / temperature)
adjusted_probabilities /= adjusted_probabilities.sum()

adjusted_probabilities
```
**Output**

```
array([0.08459132, 0.10920692, 0.15444191, 0.18915193, 0.21841384,
       0.24419409])
```

  </div>

</details>

#### Practical Application

Adjusting the temperature allows users of language models to balance between predictability and diversity in the generated text. For instance, in creative writing or brainstorming tools, a slightly higher temperature might be preferred to inspire novel ideas or suggestions. Conversely, for applications requiring high accuracy and relevance, such as summarization or technical writing, a lower temperature might be more appropriate.

---

### Top-k

Another method of "tuning the chicken" is called top-k sampling. The "k" in top-k refers to a specific number that limits the selection pool to the top "k" most probable next words as predicted by the model. Again, the primary goal of top-k sampling is to strike a balance between randomness and determinism in text generation.

#### How top-k works
1. **Prediction**: At each step in the text generation process, the model predicts a probability distribution over the entire vocabulary for the next word, based on the context of the words generated so far.
2. **Selection of Top-k Words**: From this distribution, only the top "k" words with the highest probabilities are considered for selection. This subset represents the most likely next words according to the model.

<Figure
  image={chickenTopK}
  alt="Illustration depicting a chicken pecking at five different piles of seed. The seeds are neatly lined up, each on a separate piece of paper with a word written on it. The amount of seed in each pile forms a power law distribution, with the first pile having the most seeds and the amount decreasing in each subsequent pile. The scene is elegantly composed, with the chicken engaging with the piles in a curious and orderly manner. The aspect ratio of the image is 7:4."
  caption="With a top-k of 4, we need to remove all words other than the top 4 options.\nChicken and feed generated with OpenAI DALL-E 3 and edited by the author."
/>

3. **Renormalization**: The probabilities of these top "k" words are then renormalized so that they sum up to 1. This step ensures that one of these words can be selected based on their relative probabilities within this restricted set. Note that the 4 piles still being considered have grown in size.

<Figure
  image={chickenTopKRenorm}
  alt="Illustration depicting a chicken pecking at five different piles of seed. The seeds are neatly lined up, each on a separate piece of paper with a word written on it. The amount of seed in each pile forms a power law distribution, with the first pile having the most seeds and the amount decreasing in each subsequent pile. The scene is elegantly composed, with the chicken engaging with the piles in a curious and orderly manner. The aspect ratio of the image is 7:4."
  caption="We now renormalize so that the probabilities add up to 1\nChicken and feed generated with OpenAI DALL-E 3 and edited by the author."
/>

4. **Sampling**: Finally, the next word is chosen by the chicken from this renormalized subset of top "k" words. This introduces variability in the generation process, allowing for diverse and potentially more creative outputs.

#### Before and after top-k with $(k=4)$

| Activity  | blog | meditate | cook | eat  | sleep | hunt |
|-----------|------|----------|------|------|-------|------|
| Original Probability | 0.03 |   0.05   | 0.1  | 0.15 |  0.2  | 0.25 |
| Top-k $(k=4)$ Probability | 0.00 |   0.00  | 0.14  | 0.21 |  0.29  | 0.36 |

:::note

Remember this is a heavily simplified example. In reality, the original values would contain *many* more probabilities, **50,257** in the case of GPT-3. Top-k with $k=4$ would have a large impact on the chicken.
:::

<details>
  <summary>How is this calculated? (math & Python code)</summary>

  <div>
      Here's how to compute top-k sampling with $k = 4$ on the set of probabilities

      $$
      P = [0.03, 0.05, 0.1, 0.15, 0.2, 0.25] \text{ with } k = 4:
      $$

      1. **Sort the probabilities in descending order**: This step isn't necessary for this example, since the probabilties are already sorted, but it's necessary to ensure the that we can select the top 4 probabilities.

      2. **Select the top $k$ probabilities**: We choose the four highest probabilities from $P$. Given our $P$, the top 4 probabilities are $0.25$, $0.2$, $0.15$, and $0.1$.

      3. **Renormalize the selected probabilities**: To ensure that these top $k$ probabilities sum to $1$, we renormalize them. The renormalized probability for each selected outcome $p_i$ is calculated as $p_i' = \frac{p_i}{\sum_{j=1}^{k} p_j}$ where $\sum_{j=1}^{k} p_j$ is the sum of the top $k$ probabilities, ensuring they sum to $1$.

      4. **Sampling**: Finally, we let the chicken choose randomly from these top $k$ adjusted probabilities.

      For our given probabilities and $k = 4$, the top 4 probabilities are $0.1$, $0.15$, $0.2$, and $0.25$, which sum to $0.7$. Renormalizing gives us:

      $$
      p_i' = \frac{p_i}{0.7}
      $$

      for each of the top 4 probabilities. This concentrates the sampling on the most likely outcomes, excluding the least probable ones, thus steering the generation towards more likely (and possibly more coherent) continuations while still maintaining some degree of randomness and variability. We get the new renormalized top-4 probabilities of 0.14, 0.21, 0.29, 0.36 which add up to 1.0.

:::note

Step 1 is likely not necessary in practice, since the model's outputs would likely be logits, and thus transforming probabilities back into logits isn't needed. However, since we started with probabilities for illustrative purposes, we transform them to logits in the example.
:::

```python title="Python code for calculating probabiltities top-k with k = 2"
import numpy as np

# Original probabilities
probabilities = np.array([0.03, 0.05, 0.1, 0.15, 0.2, 0.25])

# Setting k = 4
k = 4

# Step 1: Select the top-k probabilities
top_k_probabilities = np.sort(probabilities)[-k:]

# Step 2: Renormalize the selected probabilities so they sum to 1
renormalized_top_k_probs = top_k_probabilities / top_k_probabilities.sum()

print("Top-k Probabilities:", top_k_probabilities)
print("Renormalized Top-k:", renormalized_top_k_probs)

```
**Output**

```
Top-k Probabilities: [0.1  0.15 0.2  0.25]
Renormalized Top-k: [0.14285714 0.21428571 0.28571429 0.35714286]
```

  </div>

</details>

#### Practical Application

Adjusting the value of "k" allows for tuning the balance between randomness and determinism. A smaller "k" leads to more deterministic outputs, while a larger "k" increases diversity. Top-k sampling is widely used in applications such as chatbots, story generation, and any other domain requiring high-quality, varied text generation.

:::tip

Top-k with $k=1$ is equivalent to greedy decoding.

:::

---

### Top-p (nucleus sampling)

Top-p sampling, also known as nucleus sampling, offers an alternative to top-k sampling and aims to dynamically select the number of words to consider for the next word in a sequence, based on a cumulative probability threshold $p$. This method allows for more flexibility and adaptability in text generation, as it doesn't fix the number of tokens to sample from but rather adjusts this number based on the distribution of probabilities at each step.

#### How Top-p sampling works

1. **Probability Distribution**: Given a probability distribution for the next word predicted by a language model, sort the probabilities in descending order.

2. **Cumulative Probability**: Calculate the cumulative sum of these sorted probabilities.

3. **Thresholding**: Select the smallest set of words whose cumulative probability exceeds the threshold $p$. This threshold $p$ is a hyperparameter, typically set between 0.9 and 1.0, which determines how much of the probability mass to include in the sampling pool. In our example, since we're only showing the top 6 words, I'm using $p=0.75$ to eliminate only the smallest probability.

<Figure
  image={chickenTopP}
  alt="Illustration depicting a chicken pecking at five different piles of seed. The seeds are neatly lined up, each on a separate piece of paper with a word written on it. The amount of seed in each pile forms a power law distribution, with the first pile having the most seeds and the amount decreasing in each subsequent pile. The scene is elegantly composed, with the chicken engaging with the piles in a curious and orderly manner. The aspect ratio of the image is 7:4."
  caption="With a top-p of 0.75, we need to remove all words other than the top 5 options.\nChicken and feed generated with OpenAI DALL-E 3 and edited by the author."
/>

4. **Renormalize**: The selected probabilities are then renormalized to sum to 1.

<Figure
  image={chickenTopPRenorm}
  alt="Illustration depicting a chicken pecking at five different piles of seed. The seeds are neatly lined up, each on a separate piece of paper with a word written on it. The amount of seed in each pile forms a power law distribution, with the first pile having the most seeds and the amount decreasing in each subsequent pile. The scene is elegantly composed, with the chicken engaging with the piles in a curious and orderly manner. The aspect ratio of the image is 7:4."
  caption="With a top-p of 0.75, we need to remove all words other than the top 5 options.\nChicken and feed generated with OpenAI DALL-E 3 and edited by the author."
/>

5. **Sampling**: Finally, the chicken chooses the next word from this renormalized subset.

#### Before and after top-p with $(p=0.75)$

| Activity  | blog | meditate | cook | eat  | sleep | hunt |
|-----------|------|----------|------|------|-------|------|
| Original Probability | 0.03 |   0.05   | 0.1  | 0.15 |  0.2  | 0.25 |
| Top-p $(p=0.75)$ Probability | 0.00 |   0.07  | 0.13  | 0.20 |  0.27  | 0.33 |

:::note

As with top-k, remember this is a heavily simplified example. In reality, the original values would contain *many* more probabilities, **50,257** in the case of GPT-3. Top-p with $p=0.75$ would have a large impact on the chicken.
:::

<details>
  <summary>How is this calculated? (math & Python code)</summary>

  <div>
      Using top-p (nucleus) sampling with a cumulative probability threshold of $p = 0.75$ on the set of probabilities $P = [0.03, 0.05, 0.1, 0.15, 0.2, 0.25]$ involves selecting the smallest set of the most probable outcomes whose cumulative probability exceeds the threshold.

      1. **Sort Probabilities**: First, sort the probabilities in descending order to prioritize higher probabilities. For $P$, when sorted, we have $[0.25, 0.2, 0.15, 0.1, 0.05, 0.03]$.

      2. **Cumulative Sum**: Calculate the cumulative sum of these sorted probabilities. The cumulative sums of the sorted $P$ are approximately $[0.25, 0.45, 0.6, 0.7, 0.75, 0.78]$.

      3. **Apply the Threshold $p = 0.75$**: Identify the smallest set of probabilities whose cumulative sum exceeds $0.75$. In our case, when we reach $0.05$ in the sorted list (cumulative sum $= 0.75$), we've exceeded the threshold $p$.

      4. **Selected Subset**: Based on the threshold, we select the probabilities $[0.25, 0.2, 0.15, 0.1, 0.05]$. Notice that the cumulative probability of these selected probabilities is $0.75$, which meets our threshold condition.

      5. **Renormalize Probabilities**: The selected probabilities are then renormalized so they sum up to 1, to be used for sampling. The renormalization involves dividing each selected probability by the sum of the selected probabilities (which is already $0.75$ in this case, but we generally renormalize to handle rounding).

      6. **Sampling**: Finally, let the chicken pick the next word from this renormalized subset according to the adjusted probabilities.

      ### Description

      In top-p sampling with $p = 0.75$, we dynamically adjust the size of the set from which we sample based on the cumulative probability threshold. Unlike a fixed-size set in top-k sampling, the size of the set in top-p sampling can vary depending on the distribution of the probabilities. In this example, by setting $p = 0.75$, we focus on a subset of outcomes that collectively represent the most probable $75\%$ of the distribution. This method ensures that we're sampling from outcomes that are collectively likely while still allowing for variability and surprise in the generated sequence.

```python title="Python code for calculating probabiltities top-p with p = 0.75"
import numpy as np

# Original probabilities
probabilities = np.array([0.03, 0.05, 0.1, 0.15, 0.2, 0.25])

# Setting the cumulative probability threshold for top-p sampling
p = 0.75

# Sort the probabilities in descending order
sorted_probabilities = np.sort(probabilities)[::-1]

# Calculate the cumulative sum of the sorted probabilities
cumulative_sums = np.cumsum(sorted_probabilities)

# Find the index where the cumulative sum just exceeds or meets p=0.75,
# and select up to that index. This ensures we include probabilities 
# up to the point where the cumulative sum is closest to 0.75
top_p_cutoff_index = np.where(cumulative_sums >= p)[0][0] + 1

# Select the probabilities up to the cutoff index
top_p_probabilities = sorted_probabilities[:top_p_cutoff_index]

# Renormalize the selected probabilities so they sum to 1
renormalized_top_p_probs = top_p_probabilities / np.sum(top_p_probabilities)

print("Top-p Probabilities:", top_p_probabilities)
print("Renormalized Top-p:", renormalized_top_p_probs)
```
**Output**

```
Top-p Probabilities: [0.25 0.2  0.15 0.1  0.05]
Renormalized Top-p: [0.33333333 0.26666667 0.2 0.13333333 0.06666667]
```

  </div>

</details>

#### Practical Application

Unlike top-k sampling, which selects a fixed number of tokens $k$, top-p sampling dynamically adjusts the number of tokens based on their probability distribution. Top-p sampling is effective in excluding the long tail of low-probability words without arbitrarily limiting the choice to a fixed number of top probabilities. This can prevent the inclusion of very unlikely words while still allowing for a rich variety of output.

:::tip

Top-p with $p=1$ is equivalent to the chicken choosing from all words in the vocabulary.

:::

## What does the necessary existence of the chicken imply?

### There's probably no way to definitively prove that a given text was generated

You may have heard this before since it's been floating around the internet for a few years, but every time you shuffle a deck of playing cards, it's almost certain that the specific order of cards has never existed before and will never exist again. In a standard deck of 52 cards, the number of possible ways to arrange the cards is 52 factorial $(52!)$. This number is approximately $8.07 \times 10^{67}$, an extraordinarily large figure.

:::info

Because we're now talking about the size of a model's vocabulary, I'll switch to using the accurate term "token".
:::

In the case of a language model generating a sequence of say, 2,000 tokens, the number of possible combinations is also staggeringly high. It actually blasts right past the number of configurations of a deck of 52 playing cards!

<Figure
  image={cards}
  alt="A detailed, close-up illustration, focusing on the nearly infinite variety of ways a deck of playing cards can be shuffled. This image should capture the essence of numerous playing cards in the midst of being shuffled, with a spotlight on the diversity and intricacy of the shuffle methods. Cards are shown in various stages of shuffling—some being elegantly fanned out, others cascading in a waterfall shuffle, and a few in the midst of a bridge finish. The scene should give the viewer a sense of being in the middle of an elaborate card-shuffling performance, with each card's design vividly detailed to convey the chaos and beauty of the shuffle."
  caption="That's a lot of card combinations!\nGenerated with OpenAI DALL-E 3."
/>

The logarithm (base 10) of the number of possible combinations for a sequence of 2,000 tokens, with GPT-3's vocabulary size of 50,257 unique tokens, is approximately $9,402$. This means the total number of combinations is $10^{9402}$.

To put this into perspective, $10^{9402}$ is an astronomically large number. It's far beyond the total number of atoms in the observable universe (estimated to be around $10^{80}$). Even considering reasonable sampling mechanisms that might drastically reduce this number, the space of possible combinations remains vast.

Therefore, the likelihood of generating the exact same sequence of 2,000 tokens twice is so incredibly small that it's effectively zero in any practical sense. This vastness of the combinatorial space underscores the uniqueness of each long sequence generated by a language model.

<details>
  <summary>How is this calculated? (math & Python code)</summary>

  <div>
```python title="Python code for calculating the combinatorial space of a 2,000 token sequence with a 50,257 token vocabulary"
import math

# Assuming a reasonable vocabulary size for a language model
# For simplicity, let's take GPT-3's vocabulary size of 50,257 unique tokens
vocabulary_size = 50257

# Number of tokens in the sequence
sequence_length = 2000

# Calculating the number of possible combinations
# Since each token can be any one of the 50,257, for a sequence of 2,000 tokens,
# the total combinations would be vocabulary_size ** sequence_length
# However, this number is astronomically large and beyond what can be reasonably calculated directly.
# Instead, we will use logarithms to estimate this.

# Calculate the logarithm (base 10) of the number of combinations
log_combinations = sequence_length * math.log10(vocabulary_size)
log_combinations
```
**Output**

```
9402.393121225747
```

  </div>

</details>

### Let's check with top-k if it gets much smaller

Let's calculate a more realistic estimate of the number of possible combinations with top-k where $k=40$. We'll use top-k only, since temperature doesn't affect the number of considered tokens, and top-p depends on the probabilities predicted.

Let's make some assumptions for a simplified calculation:

1. **Vocabulary Size**: 50,257 tokens.
2. **Sequence Length**: 2,000 tokens.
3. **Sampling Technique**: top-k with $k=40$

Using top-k sampling with an average of 40 choices per token, the logarithm (base 10) of the number of possible combinations for a sequence of 2,000 tokens is approximately $3204.12$. This means the total number of combinations is roughly $10^{3204.12}$.

This number, while still incredibly large, is significantly smaller than the $10^{9402}$ we calculated for the full vocabulary without sampling constraints. It shows the reduction in combinatorial complexity due to less choice of tokens with top-k. The difference between this and the unrestricted vocabulary scenario shows the impact of these sampling techniques in making text generation more manageable, and less prone to extreme outliers.

However, it's still such a stupidly large number that it might as well be infinite. The chances of generating 2,000 tokens that have been generated before in the same order are effectively zero. Thus, it isn't possible to show that a generated text was copied from another, and therefore impossible to prove plagiarism without a shadow of doubt.

Are there other methods of recognizing generated text? Yes, absolutely, using ways such as the frequency of uncommon words (GPT-4 really loves to say "delve") but that goes beyond the scope of this article. 

<details>
  <summary>How is this calculated? (math & Python code)</summary>

  <div>
```python title="Python code for calculating the combinatorial space of a 2,000 token sequence with a top-k of 40"
import math

# Top-k sampling
choices_per_token = 40

# Number of tokens in the sequence
sequence_length = 2000

# Calculate the logarithm (base 10) of the number of combinations for top-k and top-p sampling methods
log_combinations_top_k = sequence_length * math.log10(choices_per_token)
log_combinations_top_k
```
**Output**

```
3204.1199826559246
```

  </div>

</details>

### Despite LLMs appearing to think like people, the need for a stochastic chicken is an argument for why they don't

The use of the chicken in LLMs indeed highlights a fundamental difference between how these models generate text, and how humans think and produce language. 

LLMs generate text based on statistical patterns learned from vast amounts of data, and the randomness introduced by the chicken is a mechanism to to produce diverse and contextually appropriate responses. In contrast, human thought and language production are driven by a complex interplay of cognitive processes, including memory, reasoning, and emotional context, which do not rely on statistical sampling in the same way.

<Figure
  image={hiddenChicken}
  alt="An illustration depicting a humorous scene where a chicken, cleverly disguised or attempting to blend in, is hiding amongst a crowd of business people wearing trench coats. The setting is an urban street scene, perhaps near a bustling business district or a subway entrance, during a busy morning or evening commute. The business people are depicted in a range of poses typical of busy city life, such as reading newspapers, checking smartphones, and holding cups of coffee, all unaware of the chicken among them. The chicken, while trying its best to look inconspicuous, should have a comical expression or stance that hints at its struggle to fit in. The overall tone should convey a lighthearted, satirical take on city life and the oddities that can go unnoticed amidst the hustle and bustle. The illustration should have an aspect ratio of 7:4."
  caption="Nothing to see here.\nGenerated with OpenAI DALL-E 3 and edited by the author."
/>

In my opinion, the chicken is a stopgap, a temporary bandaid to solve a problem, and it does not imbue the model with understanding or cognition. This distinction is central to ongoing discussions in AI about the nature of intelligence, consciousness, and the difference between simulating aspects of human thought and actually replicating the underlying cognitive processes.

