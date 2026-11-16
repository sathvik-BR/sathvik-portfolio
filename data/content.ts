export interface Profile {
  name: string;
  role: string;
  tagline: string;
  summary: string;
  location: string;
  email: string;
  github: string;
  education: {
    degree: string;
    college: string;
    years: string;
    cgpa: string;
  };
  languages: string[];
}

export interface ProjectResult {
  label: string;
  value: string;
}

export interface Project {
  slug: string;
  title: string;
  subtitle: string;
  stack: string[];
  points: string[];
  summary: string;
  problem: string;
  approach: string[];
  results: ProjectResult[];
  role: string;
  type: string;
  repo: string;
  demo?: string;
}

export interface SkillCategories {
  [category: string]: string[];
}

export interface Certification {
  title: string;
  issuer: string;
  year: string;
}

export const profile: Profile = {
  name: "B R Sathvik",
  role: "AI/ML Engineer",
  tagline: "Computer Vision | Deep Learning | NLP | RAG Pipelines",
  summary:
    "AI/ML undergraduate building end-to-end AI applications: medical imaging with Explainable AI, RAG-based LLM tools, real-time object detection systems and REST API backends.",
  location: "Bengaluru, India",
  email: "sathvikbumisetty@gmail.com",
  github: "https://github.com/sathvik-BR",
  education: {
    degree: "B.E. Artificial Intelligence and Machine Learning",
    college: "AMC Engineering College, Bengaluru (VTU)",
    years: "2023-2027",
    cgpa: "7.8",
  },
  languages: ["English", "Telugu", "Hindi", "Kannada"],
};

export const projects: Project[] = [
  {
    slug: "mediscan-ai",
    title: "MediScan AI",
    subtitle: "Chest X-ray disease detection with Explainable AI",
    stack: ["PyTorch", "DenseNet-121", "Grad-CAM", "LangChain", "FAISS", "LLaMA-3.3-70B", "Groq", "Streamlit"],
    points: [
      "Fine-tuned DenseNet-121 on 5,863 chest X-rays: 90.2% test accuracy, AUC-ROC 0.96+.",
      "Grad-CAM heatmaps show which lung regions drive each prediction.",
      "Clinical RAG assistant grounded in WHO pneumonia guidelines.",
    ],
    summary:
      "An end-to-end chest X-ray screening assistant. A DenseNet-121 classifier flags pneumonia, Grad-CAM shows which lung regions drove the prediction, and a RAG assistant answers clinical questions from WHO guidelines.",
    problem:
      "Medical imaging models are hard to trust when they only return a label. A prediction without an explanation is hard for a clinician to act on, and a general chatbot can answer clinical questions without a reliable source.",
    approach: [
      "Fine-tuned DenseNet-121 on 5,863 chest X-ray images for NORMAL vs PNEUMONIA classification and evaluated it on a held-out test set.",
      "Added Grad-CAM heatmaps so every prediction comes with the lung regions that influenced it.",
      "Built a Clinical RAG Assistant with LangChain and a FAISS vector store, grounded in WHO pneumonia guidelines and answered through LLaMA-3.3-70B on the Groq API.",
      "Packaged the classifier, heatmaps and assistant into a single Streamlit app.",
    ],
    results: [
      { label: "Test accuracy", value: "90.2%" },
      { label: "AUC-ROC", value: "0.96+" },
      { label: "Explainability", value: "Grad-CAM heatmaps" },
    ],
    role: "End to end: model, explainability, RAG assistant and app",
    type: "Solo project",
    repo: "https://github.com/sathvik-BR/mediscan-ai",
    demo: "https://mediscan-ai-jzmgxsbzhstdazbwtsmch6.streamlit.app/",
  },
  {
    slug: "edge-ai-waste-detection",
    title: "Edge AI Waste Dumping Detection",
    subtitle: "Real-time illegal dumping detection on camera streams",
    stack: ["YOLOv8", "OpenCV", "Flask", "Flask-SocketIO", "SQLite", "Chart.js", "pytest"],
    points: [
      "YOLOv8 + OpenCV pipeline on live video (garbage mAP50 0.899) behind a Flask REST API.",
      "Live analytics dashboard with real-time alert streaming.",
      "Modular MVC design with SQLite incident logging.",
    ],
    summary:
      "A real-time camera system that detects illegal waste dumping and raises alerts on a live monitoring dashboard.",
    problem:
      "Illegal dumping is usually discovered after the fact, and watching cameras by hand does not scale. The system needs to spot waste in live video and tell someone straight away.",
    approach: [
      "Trained a YOLOv8 detector on a larger dataset to find garbage in camera frames, reaching 0.899 mAP50.",
      "Built the real-time detection pipeline with OpenCV on live video streams.",
      "Exposed it through a Flask REST API, with Flask-SocketIO pushing alerts to the browser as they happen.",
      "Logged incidents in SQLite and built the live analytics dashboard with Chart.js, in a modular MVC structure.",
    ],
    results: [
      { label: "Garbage detection mAP50", value: "0.899" },
      { label: "Alerts", value: "Real-time" },
      { label: "Interface", value: "Live analytics dashboard" },
    ],
    role: "Model training, detection pipeline and dashboard",
    type: "Team project",
    repo: "https://github.com/sathvik-BR/edge-ai-illegal-dumping-detection-system",
  },
  {
    slug: "ai-knowledge-workspace",
    title: "AI Knowledge Workspace",
    subtitle: "Chat with your PDFs using RAG",
    stack: ["LangChain", "FAISS", "HuggingFace Embeddings", "Groq", "Streamlit"],
    points: [
      "Upload PDFs and query them in natural language.",
      "Summarisation, semantic search and AI flashcard generation.",
    ],
    summary:
      "A document workspace where you upload PDFs and ask questions in plain language. A retrieval-augmented generation pipeline grounds every answer in your own documents.",
    problem:
      "Long PDFs are slow to skim, and keyword search misses meaning. People need answers drawn from the document itself, not from a model guessing.",
    approach: [
      "Split uploaded PDFs into chunks and converted them to vectors with HuggingFace embedding models.",
      "Indexed the vectors in FAISS for fast semantic search.",
      "Wired retrieval and generation together with LangChain and the Groq API so answers come from the retrieved passages.",
      "Added document summarisation and AI flashcard generation, all inside a Streamlit interface.",
    ],
    results: [
      { label: "Modes", value: "Q&A, summaries, flashcards" },
      { label: "Retrieval", value: "FAISS semantic search" },
      { label: "Interface", value: "Streamlit app" },
    ],
    role: "End to end: pipeline and app",
    type: "Solo project",
    repo: "https://github.com/sathvik-BR/ai-knowledge-workspace",
    demo: "https://ai-knowledge-workspace-2nm6jeycwgdgk3u92fzvnm.streamlit.app/",
  },
  {
    slug: "ai-resume-analyzer",
    title: "AI Resume Analyzer",
    subtitle: "Match a resume against a job description",
    stack: ["Python", "NLP", "Streamlit"],
    points: [
      "Upload a PDF resume and compare it with a job description.",
      "Shows a match score and the skills that are missing.",
    ],
    summary:
      "A web app that compares a PDF resume with a job description and shows how well they match, along with the skills the resume is missing.",
    problem:
      "Applicants rarely know how closely a resume fits a posting or which keywords they are missing before they apply.",
    approach: [
      "Extracts the text from an uploaded PDF resume.",
      "Compares the resume with the pasted job description using NLP.",
      "Reports a match score and lists the missing skills.",
      "Wrapped in a Streamlit interface and deployed online.",
    ],
    results: [
      { label: "Output", value: "Match score" },
      { label: "Insight", value: "Missing skills" },
      { label: "Interface", value: "Live Streamlit app" },
    ],
    role: "End to end: analysis logic and app",
    type: "Solo project",
    repo: "https://github.com/sathvik-BR/ai-resume-analyzer",
    demo: "https://ai-resume-analyzer-vm9ibyfmcntsycyo8h2fsi.streamlit.app/",
  },
  {
    slug: "ghost-fishing-gear-detection",
    title: "Ghost Fishing Gear Detection",
    subtitle: "YOLOv8 on a self-annotated marine dataset",
    stack: ["YOLOv8", "PyTorch", "OpenCV", "Google Colab"],
    points: [
      "Custom YOLOv8 model on a self-annotated dataset (70% validation accuracy).",
      "Full ML lifecycle: collection, annotation, augmentation, training, evaluation.",
    ],
    summary:
      "A YOLOv8 object detector trained on a marine dataset I annotated myself, built to spot abandoned ghost fishing gear.",
    problem:
      "Lost fishing nets and traps keep trapping marine life, and there is little ready-made data for detecting them. The dataset had to be built before any model could be trained.",
    approach: [
      "Collected marine images and annotated them by hand.",
      "Applied augmentation to get more out of a small dataset.",
      "Trained a custom YOLOv8 model with PyTorch on Google Colab.",
      "Evaluated the model, optimised inference and documented the whole process.",
    ],
    results: [
      { label: "Validation accuracy", value: "70%" },
      { label: "Dataset", value: "Self-annotated" },
      { label: "Scope", value: "Full ML lifecycle" },
    ],
    role: "Everything: data, annotation, training, evaluation",
    type: "Solo project",
    repo: "https://github.com/sathvik-BR/ghost-fishing-gear-detection-ml",
  },
];

export const skills: SkillCategories = {
  "AI/ML": ["PyTorch", "TensorFlow", "YOLOv8", "OpenCV", "Scikit-learn", "Grad-CAM"],
  "NLP & RAG": ["LangChain", "FAISS", "RAG", "Prompt Engineering"],
  Backend: ["Python", "Flask", "FastAPI", "Streamlit", "REST APIs", "SQLite"],
  Tools: ["Git", "Docker", "Colab", "Kaggle GPU", "pytest", "Power BI"],
  Cloud: ["Oracle Cloud (OCI)", "Groq API", "Streamlit Cloud"],
};

export const certifications: Certification[] = [
  { title: "OCI 2025 AI Foundations", issuer: "Oracle", year: "2025" },
  { title: "OCI 2025 Generative AI", issuer: "Oracle", year: "2025" },
  { title: "Python (Problem Solving)", issuer: "HackerRank", year: "2024" },
  { title: "Gen AI Academy APAC (Agentic AI, MCP)", issuer: "Google Cloud", year: "2025" },
];