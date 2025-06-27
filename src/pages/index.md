---
layout: default
title: Ian Kelk
---
![My recent work in AI, ML, and data science](/img/project-header-small.png)

## [Resume](/pdf/Kelk_Ian_resume.pdf)

## Projects

### Cloud2Cloud Harvard / NASA Capstone Project
#### Cloud-Top Height Field Estimation from Aerial Imagery

* Cloud2Cloud focuses on accurately measuring cloud-top heights to enhance the calibration and validation of satellite radiometric instruments. This project is a collaboration between Harvard University and NASA.
* NASA developed the Fly’s Eye GLM Simulator (FEGS), a multi-spectral radiometer system with 30 radiometers and an HD camera, to validate the Geostationary Lightning Mapper (GLM) onboard the GOES-16 satellite. Mounted on the NASA ER-2 aerial laboratory, which flies at 70,000 feet, FEGS collected cloud imagery during a 2017 flight campaign alongside the Cloud Physics LiDAR (CPL), which provides precise but single-point cloud-top height measurements.
* Cloud2Cloud developed a predictive computer vision model that integrates high-definition FEGS imagery, LiDAR data, and aircraft metadata to estimate cloud-top heights and generate a three-dimensional height field. Our approach involved deep learning and optical flow techniques to extend single-point height measurements into full spatial height maps.
	- **Feature Extraction**: The ConvNext-large CNN model was used to extract cloud features from high-definition images after fisheye correction and augmentation.
	- **CNN-RNN Model**: A hybrid neural network processed sequences of cloud images alongside flight metadata to predict cloud-top heights at the center of each image.
	- **Optical Flow Geometry**: The RAFT model, coupled with a parallax-based height estimation method, was used to create full cloud height fields. The Lucas-Kanade and TV-L1 optical flow methods were evaluated for tracking cloud motion.
	- **Height Field Generation**: Optical flow-derived height estimates were calibrated using single-point LiDAR measurements to ensure accuracy.
	- **Field Stitching**: Consecutive height fields were merged to create a large-scale, coherent 3D representation of the cloud structure along the flight path.
* Proposal for the project is located [here.](/reports/cloud2cloud-proposal.pdf)
* Final report for the project is located [here.](/reports/cloud2cloud.pdf)
* Poster for [cloud2cloud](/reports/c2c_poster.pdf)
* Appendix for [RAFT modeling](/reports/raft_appendix.pdf)

### NLP
* Research paper from 2022 on automatic fake news detection: [Automatic Fake News Detection: Are current models “fact-checking” or “gut-checking”?](https://aclanthology.org/2022.fever-1.4/) presented at FEVER at ACL 2022
* [Video](https://www.youtube.com/watch?v=v4Ue97kzX8Q&t) provided for the online system for ACL 2022
* GitHub [repo](https://github.com/automatic-fake-news-detection) for the paper
* I gave an hour-long talk to the [NeuLab](https://www.cs.cmu.edu/~neulab/) at Carnegie Mellon in July of 2022
* Short [video](https://www.youtube.com/watch?v=hj_Oujn9ZK0) and [repository](https://github.com/iankelk/rlhf-imdb) explaining how RLHF works.

### Vision for safety inspections
* August 30th article in Bloomberg ["9 Smart Ways To Make Cities Better"](https://archive.ph/SSPfv) mentioned my work on this project in part 6. Links to [PDF](/pdf/bloomberg.pdf) and [image of specific page.](/img/bloomberg-06.png)
* [How AI Could Have Warned Us about the Florida Condo Collapse Before It Happened](https://towardsdatascience.com/how-a-i-can-prevent-future-building-collapses-before-they-happen-71c3bf3740b5) article for Towards Data Science.
* The [video](https://www.youtube.com/watch?v=g4tnZTghSmg) for the TDS article (featured on the page, but here it is directly)

### Vision
* [Search and Rescue using YOLOv5](https://wandb.ai/iankelk/YOLOv5/reports/Search-and-Rescue-Augmentation-and-Preprocessing-on-Drone-Based-Water-Rescue-Images-with-YOLOv5---VmlldzoxOTk4MTI2?galleryTag=object-detection) using the Weights and Biases report.
* Co-authored a [research paper](https://sp2023.ieee-security.org/program-papers.html) on physical adversarial attacks on face recognition systems for biometric security for S&P 2023: [ImU: Physical Impersonating Attack for Face Recognition System with Natural Style Changes](/reports/S_P_2023_Physical_Attack.pdf)
* My [recorded presentation](https://www.youtube.com/watch?v=dzdyO1WmlEE) on the [Gist: Efficient Data Encoding for Deep Neural Network Training](https://www.microsoft.com/en-us/research/uploads/prod/2018/04/fiddle-gist-isca18.pdf) paper from Microsoft. Link to slides [here.](https://docs.google.com/presentation/d/1y4qM_qi-XI1kPqrZSM5u1yzr4aN5kxTOLejfJPO-5nA/edit?usp=sharing)

### Visualization
* JavaScript D3 Visualization [project](https://iankelk.github.io/fantastic-news/) on Fake News mostly focuses on COVID-19 propaganda (requires Chrome or Firefox on desktop). It was selected as [best project](https://www.cs171.org/2022/fame/) for the class in my Masters program.
* I recorded the 2-minute [video](https://www.youtube.com/watch?v=V8gTSvInKDA) for the project in an old-timey mid-Atlantic accent for uh, fun.

### Clarifai Blogs
* I've written about 60 blog posts for Clarifai. They can all be found [here.](https://www.clarifai.com/blog/author/ian-kelk) Below are a few samples. I also maintained the Clarifai documentation for quite two years, so much of the newer content on their [docs site](https://docs.clarifai.com) was written by me using Meta's "Docusaurus" platform.
* Blog [post](https://www.clarifai.com/blog/imperfections-in-the-machine-bias-in-ai) on AI bias
* Creating AI workflows [post](https://www.clarifai.com/blog/creating-workflows-in-clarifai-community)
* Clarifai Quick Start [post](https://www.clarifai.com/blog/image-predictions-quick-start)

### Clarifai Videos
* I've recorded a good number of videos for Clarifai, and they can be viewed [here.](https://www.youtube.com/@theworldsai/videos) Below are a few samples.
* [Enhancing LLMs with Retrieval Augmented Generation (RAG)](https://www.youtube.com/watch?v=HbuOu9zq2UE)
* [AI-assisted data labeling](https://www.youtube.com/watch?v=hLMzm_vvMVg)
* [Auto Annotation](https://www.youtube.com/watch?v=q38eEf2dUoo)
* Something I created for a Webinar offered by Acquia / Widen (Digital Asset Management providers) for a demo on [generating ChatGPT prompts](https://www.youtube.com/watch?v=kMQbEcf3lps) using image classification.
* Another video for Acquia / Widen on relevant Clarifai features, where they had me [re-record the intro](https://www.youtube.com/watch?v=Fyb1Tq3yCtE) after I'd gotten a haircut. I'm sure nobody noticed.

### Promotional Clarifai Videos
* I've created slick promotional loops used at tradeshows using Adobe After Effects. 
	* Digital Asset Management promotional [video](https://www.youtube.com/watch?v=BFAvwt_Cahc)
	* Retail AI promotional [video](https://www.youtube.com/watch?v=5HMlx5SLobg)  

### Virmuze
* [Virmuze](https://virmuze.com/) is a startup of mine that I worked on for a while. The National Security Agency (NSA) uses it to host the National Cryptologic Museum's online exhibits. It's an unusual point of pride for me as I also helped them create much of the online exhibit content during the COVID-19 pandemic.
* Link to Virmuze on [nsa.gov](https://www.nsa.gov/museum/) (it's the colorful footprint icon next to the Twitter logo)
* [Link](https://virmuze.com/m/crypto-museum/) to the museum itself on Virmuze

### Database design
* I developed a [systems project](https://github.com/iankelk/lsm-tree/) for a [research class](http://daslab.seas.harvard.edu/classes/cs265/) in big data systems in C++. 
* It's a fully functional, modern LSM-tree (Log Structured Merge tree) write-optimized NoSQL key-value store. It supports tiered, leveled, lazy-leveled, and partial compaction by percentage level policies. It also offers [MONKEY](https://stratos.seas.harvard.edu/files/stratos/files/monkeykeyvaluestore.pdf) (Monkey: Optimal Navigable Key-Value Store) bloom filter optimization, internally multi-threaded range queries and compaction using a threadpool, and is also externally multi-threaded and can support multiple clients concurrently accessing the database with per-level blocking.
* Final report is located [here](/reports/Final_Report_Ian_Kelk.pdf)
* A literature review on LSM tree key value stores is located [here](/reports/Literature_Review_Ian_Kelk.pdf).

### Teaching
* Teaching fellow for Fall 2023, [CSCI E-89C Deep Reinforcement Learning.](https://courses.dce.harvard.edu/?details&srcdb=202401&crn=16817)
* I teach a weekly section on foundational and advanced concepts in reinforcement learning and deep learning. I also grade assignments, and answer questions via class forum and email.
* Reinforcement learning topics include Markov Decision Processes (MDP), dynamic programming with the Bellman Equation, application of Monte Carlo methods in reinforcement contexts, temporal-difference Prediction & Control, including SARSA and Q-learning techniques, n-step TD and various Approximation Methods like stochastic-gradient, semi-gradient TD update, and Least-squares TD.
* Deep learning topics include techniques and principles behind training neural networks using backpropagation, strategies for tuning neural networks, with a focus on regularization, convolutional neural networks (CNNs) and recurrent neural networks (RNNs).
* Deep reinforcement learning topics include value-based deep RL using Q-networks, policy-based approaches in Deep RL with REINFORCE, asynchronous methods for deep RL, with a spotlight on advantage actor-critic (A2C).

### Retrieval Augmented Generation (RAG)
* I built a custom RAG system with an LLM that scrapes and answers questions on entire websites using LlamaIndex, Weaviate, LangChain, and GPT-3.5. It's hosted on Google Cloud Services and Google Cloud Storage, and uses Docker and Kubernetes for production use. As well, the project hosts a fine-tuned BERT model on Google Vertex for classification of the generated text, and the entire thing runs FastAPI on the backend and React in the frontend.
* Video [RAG Detective: Retrieval Augmented Generation with website data](https://www.youtube.com/watch?v=L2hfkp8DXBU)
* [Medium post](https://medium.com/@iankelk/rag-detective-retrieval-augmented-generation-with-website-data-5a748b063040)
* [GitHub repo](https://github.com/healthy-chicken-saladeers/rag_detective)

### Harvard Extension Masters
* I completed a master's degree in Data Science from Harvard University in December, 2024, and graduated on the Dean's List with a 4.0 GPA. The classes I took were:

	* Data Modeling (R)
	* Foundations of Data Science and Engineering (Python, SQL, Tableau)
	* [Deep Learning for NLP](https://harvard-iacs.github.io/CS287/) (Research, Python, PyTorch)
	* Computer Vision (Python, Keras/TensorFlow)
	* Deep Reinforcement Learning (Python, I later TA'd this class)
	* Elements of Data Science and Statistical Learning with R (R)
	* Time Series Analysis with Python (Python)
	* [Visualization](https://www.cs171.org/2022/) (D3 JavaScript, HTML, CSS, Tableau)
	* [Big Data Systems](http://daslab.seas.harvard.edu/classes/cs265/) (Research, C++)
	* [Productionizing AI (MLOps): AC215](https://harvard-iacs.github.io/2023-AC215/)
	* Pre-capstone proposal ([cloud2cloud](./#cloud2cloud-harvard--nasa-capstone-project))
	* Capstone project ([cloud2cloud](https://github.com/cloud-2-cloud/c2c)

## Contact
Feel free to reach out to me:
* [LinkedIn](https://www.linkedin.com/in/iankelk/)
* [Github](https://github.com/iankelk)
* [myfirstandlastnametogether@gmail.com](mailto:myfirstandlastnametogether@gmail.com)
