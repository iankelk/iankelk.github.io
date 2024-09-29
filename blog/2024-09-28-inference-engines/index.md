---
slug: inference-engines
title: "Open Source Inference at Full Throttle: Exploring TGI and vLLM"
authors: [ikelk]
tags: [LLM, ChatGPT, AI, vLLM, PagedAttention, LocalAI, OpenWeightsModels, LlamaModels, InferenceEngine, KVCache]
enableComments: true
image: https://github.com/iankelk/iankelk.github.io/blob/main/blog/2024-09-28-inference-engines/social-card.jpg?raw=true
hide_reading_time: false
---
import CodeBlock from "@theme/CodeBlock";
import Figure from '@site/src/components/figure';
import ChatConversation from '@site/src/components/chat_conversation';

import chickenTuning from './social-card.jpg';
import andrej from './andrej.jpg';
import chatgptPhotosynthesisImage2 from './chatgpt-photosynthesis-2.jpeg';
import comparison from './comparison.jpg';
import sequential from './sequential.jpg';
import paged from './paged.jpg';

Large language models (LLMs) have received a huge amount of attention ever since ChatGPT first appeared at the end of 2022. ChatGPT represented a notable breakthrough in AI language models, surprising everyone with its ability to generate human-like text. However, it came with a notable limitation: the model could only be accessed via OpenAI’s servers. Users could interact with ChatGPT through a web interface, but they lacked access to the underlying architecture and model weights. Although a few months later OpenAI added access to the underlying GPT-3.5 model to its API, the models still resided on remote servers, and the underlying weights of the models couldn’t be changed. While this was necessary due to the model's enormous computational requirements, it naturally raised questions about privacy and access since all data could be read by OpenAI and an external internet connection was required. 

Two years later and the situation has dramatically changed. Thanks to the rise of open-weights alternatives like Meta’s Llama models, we now have multiple options for running LLMs locally on our own hardware. Access is no longer tethered to cloud-based infrastructures, but instead users can directly manipulate, explore, and deploy models themselves.

<Figure
  image={chickenTuning}
  alt="Two old-timey F1 race cars labeled TGI and vLLM, capturing that vintage racing vibe with a touch of futuristic flair. This design emphasizes the competitive spirit between the two inference engines, set in a nostalgic, dynamic scene."
  caption="Generated with OpenAI DALL-E 3 and edited by the author."
/>

:::tip[Some key points I'll address here are:]

- The evolution from server-dependent AI models like ChatGPT to locally runnable models like Meta's Llama
- The basic components needed to run a local LLM: parameter files and inference engine code
- The introduction of PagedAttention and its role in efficient memory management for LLM serving
- The comparison between traditional contiguous memory allocation and the paged memory approach in AI models
- The ongoing competition and rapid developments in LLM inference optimization, including vLLM and TGI

:::

<!-- truncate -->

## What is an LLM inference engine?

At its most basic level, running a local model like Meta’s Llama 3.1 70B could involve two core files: the parameters file and a piece of code to execute those parameters. The parameters, also called the model’s “weights,” are the values that the model has learned during training. For instance, the Llama 3.1 70B model has 70 billion parameters, and each of these parameters is stored as a 2-byte value. This results in a parameter file that’s about 140 GB in size. This file is essentially a list of 70 billion values, and it is not executable on its own.

To actually run the model, you need a small piece of code—often written in C or Python (or a mix of both)—that defines how to interpret and use those weights to generate text. This code file, the inference engine, holds the neural network architecture and algorithm that process inputs and generate outputs based on the parameters.

Using just these two files—the parameters and the code—you can run the model directly on your local machine. You can compile the code, point it at the parameters file, and begin interacting with the model. For example, you could prompt it to generate a poem or an essay, just as you would with cloud-based models like ChatGPT.

Unlike proprietary models locked behind web interfaces, open-weights models allow for customization, experimentation, and offline usage, making it possible to run sophisticated AI models in entirely self-contained and private environments.

While the code to run these models can be extremely short, as in Andrej Karpathy's video, where he points to one that's a mere 500 lines, running a model as large as Llama 3.1 70B locally requires significant computational power. 

<Figure
  image={andrej}
  alt="Two old-timey F1 race cars labeled TGI and vLLM, capturing that vintage racing vibe with a touch of futuristic flair. This design emphasizes the competitive spirit between the two inference engines, set in a nostalgic, dynamic scene."
  caption="A still from Andrej Karpathy's video [The busy person's intro to LLMs](https://www.youtube.com/watch?v=zjkBMFhNj_g) showing the parameters of Meta's Llama 2 70B model, run.c file, an air-gapped MacBook, and a brief sample of generated text."
/>


A model of that size in its raw format would need 140 GB of GPU memory to run at a realistically usable speed, and that could require two 80 GB GPUs costing tens of thousands of dollars. That’s not all they require: they need even more memory for activations, attention mechanisms, and intermediate computations.
These requirements are only for a single user! For enterprise use, the model would need to serve many users concurrently, requiring a ton of GPUs for production-scale services. This is where robust LLM inference engines, such as [vLLM](https://docs.vllm.ai/en/latest/) and [Hugging Face Text Generation Inference (TGI)](https://huggingface.co/docs/text-generation-inference/en/index), become necessary.

## vLLM and PagedAttention

A natural spot to start the discussion is with vLLM and the invention of [PagedAttention](https://blog.vllm.ai/2023/06/20/vllm.html), originally published in the paper [“Efficient Memory Management for Large Language Model Serving with PagedAttention.”](https://arxiv.org/abs/2309.06180)

PagedAttention solves the problem of inefficient memory management in LLM inference engines. LLMs are autoregressive, meaning the model predicts the next token in a sequence based on all the tokens that have come before it.

<Figure
  image={chatgptPhotosynthesisImage2}
  alt="A black and white comic strip showing a dialogue between a woman and a person wearing a 'CHATGPT' shirt. The woman is labeled 'USER' and asks, 'What is photosynthesis?' The person labeled 'CHATGPT' answers, 'Photosynthesis is the process by which plants use sunlight to synthesize nutrients from carbon dioxide and water.' The woman, termed 'USER' again, follows with, 'Can humans do it?' and receives the reply, 'No, humans cannot perform photosynthesis.' Both characters are drawn as cartoons."
  caption="People images by OpenAI DALL-E 3. Text and comic bubbles by author."
/>

:::tip[What it means to be autoregressive]

Notice that when the woman asks her second question, she has to reiterate the entire previous conversation, complete with tags on who said what. LLMs require using their own outputs, plus the prompts that generated these outputs, to be prepended to the start of every new prompt from the user.

:::

To do this efficiently, we need to cache certain values used to calculate self-attention scores so that the model isn’t recalculating the same things over and over. The KV cache (Key-Value cache) is a memory structure used in transformer models during the process of autoregressive text generation. It stores the intermediate states (keys and values) from previous tokens, which the model references when generating new tokens.

Traditional systems pre-allocate large, contiguous blocks of memory for the KV cache based on a maximum possible sequence length, even though many requests use much less memory. PagedAttention works by borrowing ideas from how operating systems manage virtual memory through paging. Instead of allocating a large contiguous block of memory for each request, it breaks the KV cache into smaller, fixed-sized blocks (or “pages”). These blocks are stored in non-contiguous memory locations.

To understand how PagedAttention can solve this problem, imagine you’re managing a hotel with rooms, and each guest who checks in represents a token in a sequence that needs memory.

### Contiguous Memory (Traditional Memory Allocation)

In this system, each guest has made a reservation for a certain number of hotel rooms for themselves and their friends, and the hotel management insists that every guest’s rooms must be placed next to each other in a straight line.

When the guest arrives, the hotel reserves one long row of adjacent rooms. This is acceptable if the guest knows exactly how many rooms they need, but they often don't—they have friends who either don't show or friends who bring other friends, so they end up needing fewer or more rooms than expected.

- **Problem 1:** If you reserve 6 rooms but the guest only needs 4, the extra 2 rooms go unused (this is called *internal fragmentation*).

- **Problem 2:** If another unexpected guest arrives but the remaining free rooms are scattered across different floors, you can’t check them in because the rooms aren’t in one long line. They’ll have to wait, even though you have enough rooms, but not in a contiguous block (this is called *external fragmentation*).

<Figure
  image={sequential}
  alt="Guest 1 reserves 6 sequential rooms, uses 4. Guest 2 reserves 6 sequential rooms, uses 3. Rooms 5, 6, 10, 11, and 12 are wasted. Guest 3 is unable to check in"
  caption="Rooms 1 to 12 in a hotel with sequential contiguous memory allocation accomodating 2 guests with 5 wasted rooms and unable to fit a third guest."
/>


### PagedAttention (Paged Memory Allocation)

Now you run the hotel like an apartment complex, where the rooms don’t need to be next to each other. Instead, guests can be accommodated in separate rooms throughout the building.  Each guest is given a page in the hotel ledger that tracks where their rooms are located throughout the hotel. A guest needing 5 rooms can be allocated 2 rooms on one floor and 3 rooms on another. The hotel’s management keeps track of which rooms belong to which guest using the page.

This system avoids wasting rooms and allows more guests to check in.

- **Avoids Problem 1:** No internal fragmentation. If a guest needs five rooms, they get exactly five, with no extra.

- **Avoids Problem 2:** No external fragmentation: Guests don’t need to wait for a block of adjacent rooms to become available—they can take rooms anywhere. Without trying to fit all the rooms into one long line, you can fill in the gaps and maximize space.

<Figure
  image={paged}
  alt="Guest 1 is using rooms 1, 3, 4, and 8. Guest 2 is using rooms 2, 9, and 11. Guest 3 is using rooms 5, 6, 7, and 10. Room 12 is available"
  caption="Rooms 1 to 12 in a hotel with paged memory allocation accomodating 3 guests with no wasted memory."
/>

:::tip[Other benefits]

There are also additional benefits to PagedAttention. Memory can be shared more efficiently between different processes or tasks, similar to how multiple guests could share a communal space instead of requiring separate ones.

:::

## How does vLLM compare to TGI?

When vLLM was first released, it outperformed TGI by a solid margin due to PagedAttention, performing with up to 2.2x to 3.5x higher throughput. 

<Figure
  image={comparison}
  alt="Comparison with HuggingFace and TGI (06/2023. Up to 24x higher throughput than HuggingFace (HF). Up to 3.5x higher throughput than Text Generation Inference"
  caption="Still from video [Fast LLM Serving with vLLM and PagedAttention](https://www.youtube.com/watch?v=5ZlavKF_98U)"
/>

However, TGI soon incorporated PagedAttention, mentioning it in their GitHub repository in [June 2023](https://github.com/huggingface/text-generation-inference/commit/e74bd41e0f279ab569cf6a65ac3e2cea50e80d39).

Currently, it’s quite tricky to make definitive statements about which inference engine is superior. LLM inference optimization is a rapidly evolving and heavily researched field; the best inference backend available today might quickly be surpassed by another as new optimizations become available.

Even more so, the web is becoming inundated—rather ironically—with LLM-generated garbage articles which frequently tout information that was already out-of-date when they were written. Even the product pages for vLLM and TGI themselves are not complete; when I was initially putting together the below table I used [TGI's](https://github.com/huggingface/text-generation-inference) and [vLLM's](https://github.com/vllm-project/vllm) GitHub readme files, however neither of them list all their supported quantizations. I had to check their respective documentation sites. 

Nevertheless, you can clearly see that for many of these optimizations, the two engines are very similar.

### Commonalities

| **Feature**                    | **TGI**                                                                                  | **vLLM**                                                                                  |
|---------------------------------|------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------|
| **Model Serving**               | Simple launcher to serve most popular LLMs                                               | Seamless integration with Hugging Face models                                              |
| **Parallelism**                 | Tensor parallelism for faster inference on multiple GPUs                                 | Tensor and pipeline parallelism for distributed inference                                  |
| **Batching**                    | Continuous batching of incoming requests for high throughput                        | Continuous batching of incoming requests for high throughput                               |
| **Attention Optimization**      | Optimized transformers code with FlashAttention and Paged Attention                      | Efficient memory management with PagedAttention and FlashAttention                         |
| **Quantization**                | GPTQ, AWQ, bitsandbytes, EETQ, Marlin, EXL2, and FP8 quantization                                         | GPTQ, AWQ, bitsandbytes, Marlin, AQLM, DeepSpeedFP, GGUF, INT4, INT8, FP8 quantization                                            |
| **Streaming Outputs**           | Token streaming using Server-Sent Events (SSE)                                           | Streaming outputs                                                                         |
| **Hardware Support**            | Supports **NVIDIA**, **AMD**, **Intel**, **Google TPU**, and **AWS Trainium/Inferentia**                    | Supports **NVIDIA**, **AMD**, **Intel**, **PowerPC**, **TPU**, and **AWS Trainium/Inferentia** 
| **Multi-LoRA Support**          | Supports **Multi-LoRA** for adding multiple task-specific LoRA layers without retraining the model | Also supports **Multi-LoRA** for task-specific adaptation layers                                 |
### Unique features

Here is where the engines diverge a bit, and we can more actively select for functionality we need.

- **[Speculative decoding](https://arxiv.org/abs/2211.17192)** becomes important when we want to reduce latency without compromising on the accuracy of the output. It does this by predicting the next tokens ahead of time, running speculative branches of the model in parallel and only finalizing the output once it’s clear which tokens are likely to be correct. This technique is especially useful in real-time applications like conversational agents, where every millisecond of delay matters.

- Efficient **[beam search](https://towardsdatascience.com/foundations-of-nlp-explained-visually-beam-search-how-it-works-1586b9849a24)** is useful in cases where high-quality output is necessary, but we also need to maintain scalability and performance. In applications like *machine translation* or *summarization*, beam search improves text coherence, and vLLM’s efficient beam search allows us to get high-quality outputs without sacrificing throughput. This makes it ideal for large-scale, enterprise-level deployments.

  However, in scenarios where you need speed and low latency, such as in live chatbots or voice assistants, beam search may introduce delays. In these cases, simpler decoding strategies like greedy search or sampling might be preferred to ensure faster response times.

- **[Watermarking](https://en.wikipedia.org/wiki/Digital_watermarking)** is important when organizations need to ensure the traceability of AI-generated content, particularly in environments where content verification or intellectual property protection is a priority. Use cases such as legal document generation, journalism, and content moderation benefit from watermarking, which allows enterprises to ensure transparency while maintaining trust in the system’s integrity.

- **[Prefix caching](https://docs.vllm.ai/en/latest/automatic_prefix_caching/apc.html)** is important when dealing with repeated queries in chatbots, customer service automation, or document generation systems. In these cases, multiple requests often share similar prefixes or input sequences, and recalculating the same intermediate results for each query would waste computational resources. This can also be very helpful for [RAG](https://www.clarifai.com/blog/what-is-rag-retrieval-augmented-generation) use cases, where a long document would be repeatedly used to answer questions.

| **Feature**                    | **TGI**                                                                                           | **vLLM**                                                                                        |
|---------------------------------|---------------------------------------------------------------------------------------------------|-------------------------------------------------------------------------------------------------|
| **Production Readiness**        | Distributed tracing with **OpenTelemetry** and metrics tracking with **Prometheus**                | No emphasis on production monitoring, more focused on performance and throughput                 |
| **Speculative Decoding**        | Not available                                                                                     | Supports **speculative decoding** for faster response time by predicting token generation        |
| **Guidance for Structured Output** | Supports **Guidance**, enabling function calling and structured outputs based on schemas         | No equivalent feature, focuses on flexible decoding algorithms like **beam search**              |
| **Watermarking**                | Includes **[A Watermark for Large Language Models](https://arxiv.org/abs/2301.10226)** to track model output                          | No watermarking feature available                                                               |
| **Prefix Caching**              | Not available                                                                                     | Supports **prefix caching** to reduce latency for repeated queries                               |

## So when should we use which engine?

As a point to begin choosing which engine we should use, we can note that
TGI is well-suited for enterprises looking for production-ready deployments with robust monitoring and low-latency features such as token streaming and guidance for structured outputs. Its strong focus on observability and ease of deployment makes it ideal for applications requiring real-time interaction.

vLLM, on the other hand, is designed for enterprises focused on high-throughput serving of large models, with advanced memory management, broad quantization support, and superior distributed inference capabilities. It is particularly effective in multi-node and multi-GPU environments that demand maximum scalability and efficiency.

That said, there are still other factors, because when we talk about the performance of an LLM inference engine, there are multiple consuderations.

import React from 'react';

<video style={{width: 'auto', height: 'auto'}} controls autoPlay muted loop>
  <source src="./LatencyThroughputVisualization.webm" type="video/webm" />
  Your browser does not support the video tag.
</video>