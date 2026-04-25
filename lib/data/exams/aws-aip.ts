import type { Lesson, Question, Topic } from "../../types";

// ─────────────────────────────────────────────────────────────────
// AWS Certified AI Practitioner (AIF-C01) — launched late 2024
// AWS's entry-level AI cert. Pairs with AI-900 for multi-cloud AI story.
// ─────────────────────────────────────────────────────────────────

export const AWS_AIP_TOPICS: Topic[] = [
  {
    id: "aip-fundamentals",
    examId: "aws-aip",
    name: "Fundamentals of AI and ML",
    shortName: "AI/ML Fundamentals",
    weight: 0.20,
    summary:
      "Core AI / ML concepts — supervised/unsupervised/reinforcement, model lifecycle, training data, inference, and AWS's positioning of AI vs ML vs deep learning.",
    subtopics: [
      "AI vs ML vs deep learning vs generative AI",
      "Supervised, unsupervised, reinforcement learning",
      "Common ML problem types (classification, regression, clustering, recommendation)",
      "Training, validation, test datasets",
      "Inference: real-time vs batch",
      "Model performance metrics (accuracy, precision, recall, F1, AUC, RMSE)",
      "Bias and variance, overfitting and underfitting",
      "AWS ML stack at a glance (SageMaker, AI services, Bedrock)",
    ],
    keyFacts: [
      "AI is the umbrella; ML is a subset that learns from data; deep learning is ML with neural networks; generative AI is deep learning that produces new content.",
      "Supervised = labeled data. Unsupervised = no labels. Reinforcement = reward signal.",
      "Real-time inference responds in milliseconds; batch inference processes large datasets offline.",
      "Overfitting = model memorizes training data, fails on new data. Underfitting = model is too simple.",
      "Classification metrics: accuracy / precision / recall / F1 / AUC. Regression metrics: MAE / RMSE / R².",
      "Bias = systematic error from oversimplification. Variance = sensitivity to small training data changes.",
      "AWS layers: AI services (pre-built APIs) → SageMaker (build/train/deploy your own) → Bedrock (foundation models / generative AI).",
    ],
    cramSheet: [
      "AI ⊃ ML ⊃ DL ⊃ Generative AI (each is a subset of the previous).",
      "Supervised = labels. Unsupervised = patterns. Reinforcement = rewards.",
      "Real-time inference = milliseconds. Batch = bulk offline.",
      "Overfit = great on train, bad on test. Underfit = bad on both.",
      "AWS AI tiers: AI services → SageMaker → Bedrock.",
    ],
    review: {
      examWeight: "20% of the exam",
      overview:
        "Lays the foundation for everything else on AIF-C01. AWS frames the AI/ML landscape with three concentric layers — AI services (pre-built), SageMaker (custom), Bedrock (foundation models / generative). Memorize that hierarchy and the supervised/unsupervised/reinforcement split. The metrics (precision vs recall, RMSE vs MAE) and overfit/underfit show up in scenario questions about model evaluation.",
      sections: [
        {
          heading: "AI / ML / DL / Generative AI — the hierarchy",
          body:
            "AWS likes the nested-circles framing. Memorize what each adds beyond the previous.",
          bullets: [
            "Artificial Intelligence (AI) — any system that performs tasks normally requiring human intelligence.",
            "Machine Learning (ML) — subset of AI; systems that learn from data without being explicitly programmed.",
            "Deep Learning (DL) — subset of ML; multi-layer neural networks.",
            "Generative AI (GenAI) — subset of DL; models that produce new content (text, images, code, audio).",
          ],
        },
        {
          heading: "Learning paradigms",
          table: {
            columns: ["Type", "Has labels?", "Example task"],
            rows: [
              { label: "Supervised", cells: ["Yes", "Spam classification, price prediction"] },
              { label: "Unsupervised", cells: ["No", "Customer segmentation, anomaly detection"] },
              { label: "Reinforcement", cells: ["Reward signal", "Game playing, robotics, ad bidding"] },
              { label: "Self-supervised", cells: ["Synthetic labels from data", "LLM pretraining"] },
            ],
          },
        },
        {
          heading: "Inference modes",
          bullets: [
            "Real-time inference — single prediction request, low-latency response (milliseconds).",
            "Batch inference — large dataset processed offline, no latency requirement.",
            "Asynchronous inference — for large payloads with longer processing time.",
            "Serverless inference — auto-scaling endpoints with no infra to manage.",
          ],
        },
        {
          heading: "Performance metrics",
          table: {
            columns: ["Metric", "Use for", "Higher = better?"],
            rows: [
              { label: "Accuracy", cells: ["Balanced classification", "Yes"] },
              { label: "Precision", cells: ["Minimize false positives", "Yes"] },
              { label: "Recall", cells: ["Minimize false negatives", "Yes"] },
              { label: "F1", cells: ["Balance precision + recall", "Yes"] },
              { label: "AUC (ROC)", cells: ["Class-imbalanced classification", "Yes (0.5 = random, 1.0 = perfect)"] },
              { label: "MAE", cells: ["Regression — absolute error", "No (lower is better)"] },
              { label: "RMSE", cells: ["Regression — penalize big errors", "No (lower is better)"] },
              { label: "R²", cells: ["Regression — variance explained", "Yes (closer to 1)"] },
            ],
          },
        },
        {
          heading: "Bias, variance, overfitting, underfitting",
          bullets: [
            "Bias — systematic error from oversimplification. High bias → model can't capture patterns (underfit).",
            "Variance — sensitivity to small training-data changes. High variance → model memorizes noise (overfit).",
            "Overfitting — high training accuracy, low test accuracy. Mitigate with regularization, dropout, more data, simpler model.",
            "Underfitting — low accuracy on both training and test. Mitigate with more features, deeper model, train longer.",
            "Bias-variance tradeoff — reducing one often increases the other; aim for sweet spot.",
          ],
        },
        {
          heading: "AWS AI/ML stack — three tiers",
          table: {
            columns: ["Tier", "What it offers", "Audience"],
            rows: [
              {
                label: "AI Services (pre-built)",
                cells: ["Rekognition, Comprehend, Polly, Translate, Transcribe, Textract, Lex, Personalize", "Developers — REST API call"],
              },
              {
                label: "SageMaker",
                cells: ["Build, train, deploy custom ML models", "Data scientists / ML engineers"],
              },
              {
                label: "Bedrock + Q",
                cells: ["Foundation models (Claude, Llama, Titan, Stable Diffusion, etc) + Amazon Q business assistant", "Builders + business users for generative AI"],
              },
            ],
          },
        },
      ],
      gotchas: [
        {
          confusion: "AI vs ML vs DL vs GenAI",
          explanation:
            "Concentric subsets. AI is the broadest. ML is AI that learns from data. DL is ML with neural nets. GenAI is DL that produces new content (text/image/code).",
        },
        {
          confusion: "Overfitting vs underfitting",
          explanation:
            "Overfit = great training, terrible test (memorized). Underfit = bad on both (too simple). The exam loves to give you train/test accuracy numbers and ask which it is.",
        },
        {
          confusion: "Precision vs recall",
          explanation:
            "Precision = of all predicted positives, how many were correct. Recall = of all actual positives, how many did we catch. Spam filter prioritizes precision; cancer screening prioritizes recall.",
        },
        {
          confusion: "Real-time vs batch inference",
          explanation:
            "Real-time = single request, low latency (chatbot, fraud check). Batch = large dataset, no latency requirement (nightly scoring, recommendations refresh).",
        },
        {
          confusion: "AWS AI Services vs SageMaker vs Bedrock",
          explanation:
            "AI Services = pre-built (you call an API). SageMaker = build your own custom model. Bedrock = foundation models / generative AI as a managed service.",
        },
      ],
      examTips: [
        "'Pre-built API for image labeling' → Rekognition (AWS AI Service).",
        "'Build my own custom classifier with full control' → SageMaker.",
        "'Generate text from a prompt with Claude or Llama' → Bedrock.",
        "'Model is 99% accurate on training, 65% on test' → overfitting.",
        "'Optimize for catching every fraud case' → recall.",
        "'No labels, group customers' → unsupervised clustering.",
        "'Reward-based learning for game agents' → reinforcement learning.",
        "'Bulk score 10M records overnight' → batch inference.",
      ],
    },
  },
  {
    id: "aip-genai",
    examId: "aws-aip",
    name: "Fundamentals of Generative AI",
    shortName: "Generative AI",
    weight: 0.24,
    summary:
      "What foundation models are, how prompts and tokens work, AWS Bedrock as the managed FM platform, and the new Amazon Q product family.",
    subtopics: [
      "Foundation models (FMs) and large language models (LLMs)",
      "Tokens, embeddings, context windows, temperature, top-p",
      "Multi-modal models (text, image, audio, video)",
      "Amazon Bedrock: Anthropic Claude, Meta Llama, Amazon Titan, Cohere, AI21, Mistral, Stability AI",
      "Amazon Q (Business, Developer, in QuickSight, in Connect)",
      "Tradeoffs of generative AI: cost, latency, accuracy, hallucination",
      "Pre-training vs fine-tuning vs prompt engineering vs RAG",
    ],
    keyFacts: [
      "Foundation models are large pre-trained models adaptable to many tasks.",
      "Tokens are the input/output unit — pricing and context windows are measured in tokens.",
      "Bedrock is AWS's serverless gateway to multiple FM providers (Anthropic, Meta, Amazon, Cohere, etc).",
      "Amazon Q is AWS's branded generative AI assistant family (Business / Developer / QuickSight / Connect).",
      "Prompt engineering is fastest and cheapest. Fine-tuning permanently adapts the model. RAG augments with external data at inference.",
      "Hallucination is the #1 risk; mitigate with RAG and grounding.",
      "Bedrock supports both proprietary and open-weight models with consistent API.",
    ],
    cramSheet: [
      "Bedrock = managed FMs from many vendors (Claude, Llama, Titan, Cohere, AI21, Mistral, Stability).",
      "Amazon Q = AWS's branded GenAI assistant: Business, Developer, in QuickSight, in Connect.",
      "Tokens drive cost + context limits.",
      "Hallucination = confidently wrong output. Fix with RAG.",
      "Adaptation order (cheap → expensive): prompt engineering → RAG → fine-tuning → continued pre-training.",
    ],
    review: {
      examWeight: "24% of the exam",
      overview:
        "AWS's GenAI domain centers on Bedrock and Amazon Q. Memorize: Bedrock is the multi-vendor FM playground (Claude, Llama, Titan, etc.) with one API. Amazon Q is the branded assistant family. Know the four ways to adapt a model (prompt → RAG → fine-tune → continued pre-training) and their relative cost. Hallucination + RAG comes up everywhere — they're the GenAI exam's most-tested pair.",
      sections: [
        {
          heading: "What foundation models are",
          body:
            "Foundation models (FMs) are large, pre-trained on huge datasets, and adaptable to many downstream tasks. LLMs (Large Language Models) are FMs specialized for text. Multi-modal FMs handle multiple input/output types (text + image + audio).",
          bullets: [
            "Pre-training is expensive — done by the vendor on massive corpora.",
            "Adaptation is cheaper — fine-tune, prompt-engineer, or augment with RAG.",
            "Examples: Claude (Anthropic), Llama (Meta), Titan (Amazon), Stable Diffusion (Stability AI), DALL-E (OpenAI, not on Bedrock).",
          ],
        },
        {
          heading: "Tokens, context, and parameters",
          bullets: [
            "Token — basic unit (~3-4 chars or ¾ word in English). Pricing is per 1k tokens.",
            "Context window — max tokens (input + output) per request.",
            "Embeddings — vector representations of text used in semantic search and RAG.",
            "Temperature — randomness; 0 is near-deterministic, higher is more creative.",
            "Top-p (nucleus sampling) — restrict sampling to top-probability tokens.",
            "Max tokens — cap on response length.",
          ],
        },
        {
          heading: "Amazon Bedrock — the managed FM gateway",
          body:
            "Single API for multiple FM vendors. Serverless. Your prompts and outputs aren't used to train the underlying models.",
          table: {
            columns: ["Vendor on Bedrock", "Models / focus"],
            rows: [
              { label: "Anthropic", cells: ["Claude family — strong reasoning, long context"] },
              { label: "Amazon", cells: ["Titan text + embeddings + image"] },
              { label: "Meta", cells: ["Llama — open-weight"] },
              { label: "Cohere", cells: ["Command, Embed (multilingual)"] },
              { label: "AI21 Labs", cells: ["Jurassic / Jamba"] },
              { label: "Mistral", cells: ["Mistral / Mixtral — efficient open"] },
              { label: "Stability AI", cells: ["Stable Diffusion (image)"] },
            ],
          },
        },
        {
          heading: "Amazon Q — the assistant family",
          table: {
            columns: ["Product", "Audience", "Use"],
            rows: [
              { label: "Q Business", cells: ["Enterprise users", "Generative assistant grounded in your company data"] },
              { label: "Q Developer", cells: ["Developers", "Code generation, modernization (replaces CodeWhisperer)"] },
              { label: "Q in QuickSight", cells: ["BI users", "Natural-language analytics from your data"] },
              { label: "Q in Connect", cells: ["Contact center agents", "Real-time call assistance with knowledge base"] },
            ],
          },
        },
        {
          heading: "Adaptation strategies — cheapest to most expensive",
          table: {
            columns: ["Strategy", "Cost / Effort", "When to use"],
            rows: [
              { label: "Prompt engineering", cells: ["Lowest", "Tweak the prompt for better output"] },
              { label: "Few-shot prompting", cells: ["Low", "Provide examples in the prompt"] },
              { label: "RAG", cells: ["Low–Medium", "Ground in your data without retraining"] },
              { label: "Fine-tuning", cells: ["Medium–High", "Adapt model weights for specific style or task"] },
              { label: "Continued pre-training", cells: ["High", "Domain adaptation on large corpus"] },
              { label: "Train from scratch", cells: ["Very High", "Almost never the right answer"] },
            ],
          },
        },
        {
          heading: "Tradeoffs of generative AI",
          bullets: [
            "Hallucination — confidently wrong output. Mitigate with RAG, grounding, lower temperature.",
            "Cost — token-based pricing scales with usage; large context = more cost.",
            "Latency — bigger models are slower; choose model size based on use case.",
            "Toxicity / harmful content — use Guardrails for Bedrock to filter.",
            "Determinism — outputs vary unless temperature = 0 (and even then, not 100% across model updates).",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Bedrock vs SageMaker JumpStart",
          explanation:
            "Bedrock is the serverless FM API (you don't manage infra). SageMaker JumpStart lets you deploy FMs to SageMaker endpoints (you manage the infrastructure). Bedrock is simpler; SageMaker gives more control.",
        },
        {
          confusion: "Amazon Q Developer vs CodeWhisperer",
          explanation:
            "Q Developer replaced CodeWhisperer in 2024. The features were rolled into Q with broader capabilities (chat, modernization, code transformations).",
        },
        {
          confusion: "Fine-tuning vs RAG",
          explanation:
            "Fine-tuning permanently changes model weights using a training dataset (style/format adaptation). RAG retrieves data at inference and injects it as context (current/proprietary data). Fine-tuning is for HOW the model responds; RAG is for WHAT facts it knows.",
        },
        {
          confusion: "Tokens vs words",
          explanation:
            "A token is ~¾ of an English word, but varies by language. 1,000 tokens ≈ 750 English words. Pricing and context windows are always in tokens.",
        },
        {
          confusion: "Foundation model vs LLM",
          explanation:
            "All LLMs are FMs (specialized in text). Not all FMs are LLMs — image/audio/multi-modal FMs exist. Stable Diffusion is an FM but not an LLM.",
        },
      ],
      examTips: [
        "'Single API to call Claude, Llama, and Titan' → Amazon Bedrock.",
        "'Generative AI assistant for developers' → Amazon Q Developer.",
        "'Generative assistant grounded in company data' → Amazon Q Business.",
        "'Reduce hallucinations by grounding in your docs' → RAG.",
        "'Adapt the model permanently for a specific writing style' → fine-tuning.",
        "'Lowest-cost way to improve output quality' → prompt engineering.",
        "'Filter harmful content from FM responses' → Guardrails for Amazon Bedrock.",
        "'Generate vector representations for semantic search' → embeddings (e.g., Titan Embeddings).",
      ],
    },
  },
  {
    id: "aip-applications",
    examId: "aws-aip",
    name: "Applications of Foundation Models",
    shortName: "Applications",
    weight: 0.28,
    summary:
      "Bringing FMs into real applications: Bedrock features in depth, prompt engineering techniques, RAG with vector stores, agents, and the AWS AI Services for non-generative tasks.",
    subtopics: [
      "Bedrock features: Knowledge Bases, Agents, Guardrails, Model Evaluation, Prompt Management",
      "Prompt engineering techniques: zero-shot, few-shot, chain-of-thought",
      "Retrieval-Augmented Generation (RAG) and vector databases",
      "Vector stores on AWS: OpenSearch (with k-NN), Aurora pgvector, MemoryDB, Neptune Analytics, Kendra",
      "AWS AI Services: Rekognition, Comprehend, Polly, Translate, Transcribe, Textract, Lex, Personalize, Forecast",
      "Choosing the right service for the task",
      "Cost factors: token usage, model choice, context size, frequency",
    ],
    keyFacts: [
      "Bedrock Knowledge Bases provide managed RAG over your data without writing the retrieval pipeline.",
      "Bedrock Agents orchestrate multi-step tasks: function calling + reasoning + memory.",
      "Bedrock Guardrails filter harmful content, enforce topics, and redact PII.",
      "Vector embeddings power semantic search; vector stores include OpenSearch (k-NN), Aurora PostgreSQL with pgvector, Neptune Analytics, MemoryDB.",
      "Amazon Kendra is a managed enterprise search service often used as the retrieval layer in RAG.",
      "Pre-built AI Services: Rekognition (vision), Comprehend (NLP), Polly (TTS), Translate, Transcribe (STT), Textract (documents), Lex (chatbots), Personalize (recommendations), Forecast (time series).",
      "Model evaluation in Bedrock supports automatic and human-in-the-loop scoring.",
    ],
    cramSheet: [
      "Bedrock features: Knowledge Bases (RAG), Agents (multi-step + tools), Guardrails (safety), Model Evaluation, Prompt Management.",
      "RAG vector stores: OpenSearch + k-NN, Aurora pgvector, Neptune Analytics, MemoryDB, Kendra.",
      "AI Service mappings: Rekognition (image/video), Comprehend (text NLP), Textract (forms/docs), Polly (TTS), Transcribe (STT), Translate (lang), Lex (chatbot), Personalize (rec), Forecast (TS).",
      "Prompt techniques: zero-shot (no examples), few-shot (provide examples), chain-of-thought (think step by step).",
    ],
    review: {
      examWeight: "28% of the exam — the biggest domain",
      overview:
        "This is the largest AIF domain. AWS expects you to know Bedrock's whole feature set (Knowledge Bases, Agents, Guardrails, Model Evaluation, Prompt Management) and how to map AI Services to scenarios (Rekognition for images, Comprehend for text, Textract for forms, etc). RAG is heavily tested — know the vector store options on AWS and that Knowledge Bases automate the whole pipeline. Prompt engineering techniques (zero-shot / few-shot / chain-of-thought) appear regularly.",
      sections: [
        {
          heading: "Amazon Bedrock — feature set",
          table: {
            columns: ["Feature", "Use it for"],
            rows: [
              { label: "Knowledge Bases", cells: ["Managed RAG — point at your data, get grounded answers"] },
              { label: "Agents", cells: ["Multi-step task orchestration with tool/function calling"] },
              { label: "Guardrails", cells: ["Block harmful topics, redact PII, enforce content policies"] },
              { label: "Model Evaluation", cells: ["Compare models with automatic or human-graded scoring"] },
              { label: "Prompt Management", cells: ["Versioned prompt templates and A/B testing"] },
              { label: "Custom Model Import", cells: ["Bring your own fine-tuned weights"] },
              { label: "Provisioned Throughput", cells: ["Reserve capacity for predictable workloads"] },
            ],
          },
        },
        {
          heading: "Prompt engineering techniques",
          bullets: [
            "Zero-shot — ask the model directly with no examples.",
            "Few-shot — provide a handful of input/output examples in the prompt.",
            "Chain-of-thought — instruct the model to 'think step by step', revealing reasoning before the answer.",
            "Role prompting — assign a persona ('You are an expert SQL analyst…').",
            "Structured output — request specific format (JSON, bullets, tables).",
            "Self-consistency — ask the model multiple times and take the majority answer.",
          ],
        },
        {
          heading: "RAG architecture on AWS",
          body:
            "Retrieval-Augmented Generation grounds an LLM's response in your data. The standard pattern: documents → chunks → embeddings → vector store → retrieve at query time → inject into prompt → LLM responds.",
          bullets: [
            "Bedrock Knowledge Bases — fully managed; ingest documents from S3, retrieve at query time.",
            "Vector store options: Amazon OpenSearch with k-NN, Aurora PostgreSQL with pgvector, MemoryDB (vector index), Neptune Analytics.",
            "Embeddings: Titan Embeddings, Cohere Embed, or open-source models.",
            "Amazon Kendra — managed enterprise search; can be the retrieval layer.",
          ],
        },
        {
          heading: "Bedrock Agents — multi-step orchestration",
          body:
            "Agents extend FMs with the ability to take actions. The agent reasons, calls a function (tool / API / Lambda), and continues until the goal is met.",
          bullets: [
            "Action groups — APIs the agent can call (defined via OpenAPI schema or function detail).",
            "Knowledge bases — agent can also retrieve from RAG sources.",
            "Memory — agents can maintain conversational state across turns.",
            "Use cases: complex workflows, customer support, multi-step data analysis.",
          ],
        },
        {
          heading: "AWS AI Services — pre-built APIs (non-generative)",
          table: {
            columns: ["Service", "Use case"],
            rows: [
              { label: "Rekognition", cells: ["Image and video analysis (faces, objects, moderation, celebs)"] },
              { label: "Comprehend", cells: ["NLP — sentiment, entities, key phrases, language, topics, PII"] },
              { label: "Comprehend Medical", cells: ["NLP for clinical text"] },
              { label: "Textract", cells: ["Extract text + structured data (tables, forms) from documents"] },
              { label: "Polly", cells: ["Text-to-speech (neural and standard voices)"] },
              { label: "Transcribe", cells: ["Speech-to-text (calls, meetings, video)"] },
              { label: "Translate", cells: ["Neural machine translation across 75+ languages"] },
              { label: "Lex", cells: ["Conversational interfaces (intents + slots) — same engine as Alexa"] },
              { label: "Personalize", cells: ["Real-time personalization and recommendations"] },
              { label: "Forecast", cells: ["Time-series forecasting (now largely folded into other services)"] },
              { label: "Kendra", cells: ["Managed enterprise search with NLP"] },
              { label: "Fraud Detector", cells: ["ML-based fraud detection without ML expertise"] },
            ],
          },
        },
        {
          heading: "Cost factors for generative AI",
          bullets: [
            "Token usage — input + output tokens are billed per 1k.",
            "Model choice — larger models cost more per token.",
            "Context window size — using more context per call = more tokens billed.",
            "Frequency — high-volume use → consider Provisioned Throughput.",
            "Fine-tuning has training + storage costs separate from inference.",
            "Vector storage and retrieval also incur cost (Knowledge Base / OpenSearch).",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Knowledge Bases vs Agents",
          explanation:
            "Knowledge Bases retrieve and pass context (RAG). Agents reason and call tools/APIs in multiple steps. They're often combined — agents can use knowledge bases as one of their action sources.",
        },
        {
          confusion: "Comprehend vs Textract",
          explanation:
            "Comprehend analyzes text (sentiment, entities, language). Textract extracts text and structured data from documents (forms, tables, receipts). If the input is an image/PDF, Textract first; Comprehend on the extracted text.",
        },
        {
          confusion: "Lex vs Bedrock Agents",
          explanation:
            "Lex is intent-based conversational AI (legacy chatbot pattern, same engine as Alexa). Bedrock Agents use FMs for open-ended reasoning and tool use. Use Bedrock Agents for modern generative chatbots; Lex for predictable intent-driven flows.",
        },
        {
          confusion: "Kendra vs OpenSearch for RAG",
          explanation:
            "Kendra is a higher-level managed enterprise search service with NLP. OpenSearch is a general search/analytics engine that you configure for k-NN vector search. Kendra is faster to set up; OpenSearch is more flexible and often cheaper at scale.",
        },
        {
          confusion: "Few-shot vs fine-tuning",
          explanation:
            "Few-shot puts examples in the prompt at runtime — no model change. Fine-tuning trains the model on examples — model change. Few-shot is faster and cheaper to iterate; fine-tuning is for stable, repeated use cases.",
        },
      ],
      examTips: [
        "'Managed RAG over your S3 documents' → Bedrock Knowledge Bases.",
        "'Multi-step task that calls APIs' → Bedrock Agents.",
        "'Block hate speech in FM outputs' → Bedrock Guardrails.",
        "'Compare two models on the same prompts' → Bedrock Model Evaluation.",
        "'Detect faces and objects in images' → Rekognition.",
        "'Extract fields from invoices' → Textract.",
        "'Sentiment analysis of customer reviews' → Comprehend.",
        "'Convert audio recording to text' → Transcribe.",
        "'Read text aloud with neural voice' → Polly.",
        "'Real-time product recommendations' → Personalize.",
        "'Vector search inside a relational DB' → Aurora PostgreSQL with pgvector.",
        "'Provide a few examples in the prompt' → few-shot prompting.",
        "'Ask the model to think step by step' → chain-of-thought prompting.",
      ],
    },
  },
  {
    id: "aip-responsible",
    examId: "aws-aip",
    name: "Guidelines for Responsible AI",
    shortName: "Responsible AI",
    weight: 0.14,
    summary:
      "Bias, fairness, transparency, explainability, and the AWS tools that support responsible AI throughout the model lifecycle.",
    subtopics: [
      "Responsible AI dimensions: fairness, explainability, robustness, privacy, governance, transparency, veracity, controllability, safety",
      "Bias sources and mitigation",
      "Explainability: LIME, SHAP, model cards",
      "SageMaker Clarify (bias detection + explainability)",
      "AWS AI Service Cards (model documentation)",
      "Human-in-the-loop (Amazon A2I)",
      "Bedrock Guardrails for responsible generative AI",
    ],
    keyFacts: [
      "Bias can enter from training data, sampling, labeling, or feedback loops.",
      "SageMaker Clarify detects bias before, during, and after training, and provides feature attributions for explainability.",
      "AWS AI Service Cards document service intended use, performance, limitations, and design choices.",
      "Amazon A2I (Augmented AI) routes low-confidence predictions to human reviewers.",
      "Bedrock Guardrails enforce content policies, block topics, redact PII in both prompts and responses.",
      "Explainability tools: SHAP and LIME (model-agnostic), built-in feature importance for tree models.",
    ],
    cramSheet: [
      "Responsible AI dimensions Microsoft uses + AWS adds: fairness, explainability, robustness, privacy, governance, transparency, veracity, controllability, safety.",
      "SageMaker Clarify = bias detection + SHAP-based explainability.",
      "Amazon A2I = human-in-the-loop for low-confidence predictions.",
      "AWS AI Service Cards = model card analog for AWS pre-built services.",
      "Bedrock Guardrails = generative AI safety filter.",
    ],
    review: {
      examWeight: "14% of the exam",
      overview:
        "Responsible AI on AIF tests two things: vocabulary (fairness, explainability, robustness, etc) and AWS-specific tools that support each (Clarify, A2I, Service Cards, Guardrails). Memorize what each AWS tool does and which responsible-AI dimension it addresses. Bias detection scenarios show up reliably — Clarify is the answer.",
      sections: [
        {
          heading: "Responsible AI dimensions",
          bullets: [
            "Fairness — equitable outcomes across groups; no bias against protected classes.",
            "Explainability — humans can understand why the model made a decision.",
            "Robustness — model performs reliably across conditions (handles drift, adversarial input).",
            "Privacy & Security — protect personal data; prevent training-data leakage.",
            "Governance — clear ownership and processes for AI decisions.",
            "Transparency — disclose how the system works and its limitations.",
            "Veracity — outputs are factually accurate; address hallucination.",
            "Controllability — humans can override, correct, or stop AI behavior.",
            "Safety — minimize harmful outcomes.",
          ],
        },
        {
          heading: "Sources of bias",
          bullets: [
            "Sampling bias — training data doesn't represent the real world.",
            "Labeling bias — human labelers introduce subjective judgments.",
            "Confirmation bias — models reinforced by their own predictions.",
            "Measurement bias — features are proxies that disadvantage some groups.",
            "Reporting bias — over- or under-representation of certain events.",
            "Algorithmic bias — model's learning algorithm amplifies existing patterns.",
          ],
        },
        {
          heading: "AWS responsible-AI tooling",
          table: {
            columns: ["Tool", "Use it for"],
            rows: [
              { label: "SageMaker Clarify", cells: ["Detect bias before/during/after training; SHAP-based explanations"] },
              { label: "Amazon A2I", cells: ["Route low-confidence predictions to humans (review pipeline)"] },
              { label: "AWS AI Service Cards", cells: ["Documentation: intended use, performance, limits per AI service"] },
              { label: "Bedrock Guardrails", cells: ["Filter harmful content, block topics, redact PII"] },
              { label: "Bedrock Model Evaluation", cells: ["Compare model outputs against human-graded or auto metrics"] },
              { label: "SageMaker Model Monitor", cells: ["Detect data drift, concept drift, bias drift in production"] },
            ],
          },
        },
        {
          heading: "Explainability techniques",
          bullets: [
            "SHAP (SHapley Additive exPlanations) — game-theoretic feature attribution, model-agnostic.",
            "LIME (Local Interpretable Model-agnostic Explanations) — perturb input, observe changes.",
            "Feature importance — built-in for tree-based models.",
            "Partial dependence plots — show feature effect across its range.",
            "Model cards — structured documentation of intended use, performance, limitations.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Bias detection vs explainability",
          explanation:
            "Bias detection asks 'is the model unfair to a group?' Explainability asks 'why did the model predict X?' SageMaker Clarify does both, but they're different jobs.",
        },
        {
          confusion: "AI Service Cards vs Model Cards",
          explanation:
            "AI Service Cards document the AWS pre-built AI services (Rekognition, Comprehend). Model Cards are the broader industry pattern for documenting any model (including ones you build).",
        },
        {
          confusion: "A2I vs Guardrails",
          explanation:
            "A2I routes uncertain predictions to humans for review. Guardrails enforce content/safety rules on generative AI inputs and outputs. Both help safety but they target different problems.",
        },
        {
          confusion: "SHAP vs LIME",
          explanation:
            "Both are model-agnostic explainability techniques. SHAP uses game theory and is more theoretically grounded but slower. LIME perturbs the input and is faster but less consistent. SageMaker Clarify uses SHAP.",
        },
      ],
      examTips: [
        "'Detect bias against a protected class in a credit model' → SageMaker Clarify.",
        "'Send low-confidence document classifications to humans' → Amazon A2I.",
        "'Block harmful topics in a Bedrock chatbot' → Bedrock Guardrails.",
        "'Documentation describing how Rekognition was designed and tested' → AI Service Card.",
        "'Detect drift in a deployed model' → SageMaker Model Monitor.",
        "'Explain why a tree model predicted X for a customer' → SHAP-based feature attribution.",
      ],
    },
  },
  {
    id: "aip-security",
    examId: "aws-aip",
    name: "Security, Compliance & Governance for AI",
    shortName: "Security & Governance",
    weight: 0.14,
    summary:
      "Securing AI workloads on AWS — IAM, data protection, network isolation, compliance frameworks, and GenAI-specific risks like prompt injection.",
    subtopics: [
      "IAM, roles, least privilege for AI/ML services",
      "Encryption at rest (KMS) and in transit (TLS)",
      "VPC endpoints, PrivateLink, network isolation for SageMaker and Bedrock",
      "Data lineage, audit, AWS CloudTrail for ML actions",
      "Compliance: SOC, ISO, HIPAA, PCI, FedRAMP — AWS shared responsibility",
      "GenAI-specific risks: prompt injection, jailbreaking, training-data leakage, hallucination",
      "AWS AI Service Terms and customer data use",
      "Data residency, model isolation, customer-managed keys (CMK)",
    ],
    keyFacts: [
      "AWS shared responsibility: AWS secures the cloud; customer secures workloads in the cloud.",
      "Bedrock prompts and outputs are NOT used to train base models. Customer data stays in the customer's account.",
      "SageMaker training jobs and endpoints can run in customer VPCs with network isolation.",
      "KMS provides customer-managed keys (CMK) for encryption with full key control.",
      "CloudTrail logs all AWS API calls; CloudWatch monitors metrics and logs.",
      "PrivateLink (VPC endpoints) keeps traffic to AWS services on the AWS backbone — never the public internet.",
      "Prompt injection — adversarial input that subverts system instructions in an LLM.",
      "Jailbreaking — coaxing an LLM past its safety constraints with crafted prompts.",
    ],
    cramSheet: [
      "Bedrock customer data ≠ training data for base models. Confirmed in AWS service terms.",
      "VPC endpoints / PrivateLink = traffic stays on AWS backbone.",
      "KMS CMK = customer-managed encryption keys.",
      "CloudTrail = API audit log. CloudWatch = metrics + logs.",
      "Prompt injection = adversarial input. Jailbreak = bypass safety guardrails.",
      "AWS shared responsibility: AWS = cloud, customer = in the cloud.",
    ],
    review: {
      examWeight: "14% of the exam",
      overview:
        "AWS expects you to know who is responsible for what, what protects what, and what GenAI-specific threats look like. Memorize: Bedrock customer data is not used to train base models. CloudTrail audits API calls. KMS handles encryption keys (with CMK option). PrivateLink/VPC endpoints keep traffic off the public internet. Prompt injection and jailbreaking are the most-tested GenAI threats.",
      sections: [
        {
          heading: "AWS shared responsibility for AI",
          bullets: [
            "AWS is responsible for security OF the cloud (datacenters, hypervisor, hardware).",
            "Customer is responsible for security IN the cloud — IAM, data, model artifacts, app code.",
            "For SaaS-like services (Comprehend, Rekognition), AWS handles more of the stack.",
            "For SageMaker training/inference, the customer manages more (VPC, network policies, IAM).",
          ],
        },
        {
          heading: "Identity and access management",
          bullets: [
            "Least privilege — grant only the permissions needed for the job.",
            "Use IAM roles for EC2, Lambda, SageMaker — not long-lived access keys.",
            "Service Control Policies (SCPs) at the org level limit what accounts can do.",
            "IAM Conditions can restrict actions by source IP, time of day, MFA presence.",
            "Resource-based policies on S3, KMS keys, Bedrock models for cross-account access.",
          ],
        },
        {
          heading: "Data protection",
          table: {
            columns: ["Mechanism", "What it protects", "AWS service"],
            rows: [
              { label: "Encryption at rest", cells: ["Stored data", "S3, EBS, RDS — keys via KMS"] },
              { label: "Encryption in transit", cells: ["Network traffic", "TLS (default everywhere)"] },
              { label: "Key management", cells: ["Encryption keys", "KMS (AWS-managed or customer-managed)"] },
              { label: "Secrets storage", cells: ["API keys, credentials", "Secrets Manager, SSM Parameter Store"] },
              { label: "Data lineage", cells: ["Where data came from / went", "SageMaker Lineage Tracking, Lake Formation, DataZone"] },
              { label: "Data masking", cells: ["PII in datasets", "Macie (discover PII), Glue DataBrew (mask)"] },
            ],
          },
        },
        {
          heading: "Network isolation",
          bullets: [
            "VPC — private network for your resources.",
            "VPC endpoint (PrivateLink) — connect to AWS services without traversing the public internet. Available for Bedrock, SageMaker, S3, etc.",
            "SageMaker network isolation — disable internet access on training jobs and endpoints.",
            "Subnets, NACLs, security groups — defense in depth at the network layer.",
          ],
        },
        {
          heading: "Audit and monitoring",
          bullets: [
            "CloudTrail — logs every AWS API call (who, what, when, from where).",
            "CloudWatch — metrics, logs, alarms.",
            "AWS Config — track resource configuration changes; detect drift from baselines.",
            "Macie — automated discovery of sensitive data (PII) in S3.",
            "Audit Manager — automated evidence collection for compliance audits.",
          ],
        },
        {
          heading: "GenAI-specific threats",
          table: {
            columns: ["Threat", "Description", "Mitigation"],
            rows: [
              { label: "Prompt injection", cells: ["Adversarial input overrides system instructions", "Input validation, separate system/user roles, Guardrails"] },
              { label: "Jailbreaking", cells: ["Coaxing the model past its safety rules", "Guardrails, monitoring, rate limits"] },
              { label: "Hallucination", cells: ["Confident but false output", "RAG with citations, lower temperature, model evaluation"] },
              { label: "Training data leakage", cells: ["Model surfaces sensitive training data", "Filter training data, evaluate outputs for leakage"] },
              { label: "Insecure output handling", cells: ["Acting on FM output without validation (e.g., executing generated code)", "Sandbox execution, validate outputs"] },
              { label: "Excessive agency", cells: ["Agent has broader permissions than needed", "Least-privilege tools, scoped action groups"] },
            ],
          },
        },
        {
          heading: "Compliance frameworks AWS supports",
          bullets: [
            "SOC 1, 2, 3 — service organization controls (most common attestations).",
            "ISO 27001, 27017, 27018 — international ISMS standards.",
            "HIPAA — US healthcare; many AWS services are HIPAA-eligible.",
            "PCI DSS — payment card data.",
            "FedRAMP — US government cloud authorization (Moderate / High).",
            "GDPR — EU personal data; AWS provides DPA and data residency in EU regions.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Bedrock customer data being used to train",
          explanation:
            "Bedrock prompts and outputs are NOT used to train base models. The data stays in the customer's account. This is a frequent exam question.",
        },
        {
          confusion: "VPC endpoint vs internet gateway",
          explanation:
            "VPC endpoint (PrivateLink) connects to AWS services privately. Internet gateway routes traffic to the public internet. For private access to S3, Bedrock, SageMaker — use VPC endpoints.",
        },
        {
          confusion: "Prompt injection vs jailbreaking",
          explanation:
            "Prompt injection inserts hidden instructions in user input to override system rules. Jailbreaking is coaxing the model past safety constraints with crafted prompts. Overlapping — Guardrails help with both.",
        },
        {
          confusion: "CloudTrail vs CloudWatch",
          explanation:
            "CloudTrail = audit log of API calls (who did what). CloudWatch = metrics, logs from applications and services (performance + observability).",
        },
        {
          confusion: "AWS-managed key vs customer-managed key (CMK)",
          explanation:
            "AWS-managed keys are created and rotated by AWS (you can't disable). CMKs are created and managed by you in KMS — you control rotation, policies, and disable. CMK is required for some compliance regimes.",
        },
      ],
      examTips: [
        "'Bedrock prompts used to train base models' → false. They're not.",
        "'Connect to Bedrock without using the public internet' → VPC endpoint / PrivateLink.",
        "'Audit log of every Bedrock API call' → CloudTrail.",
        "'Customer-managed encryption keys' → KMS CMK.",
        "'Find PII in S3 buckets automatically' → Amazon Macie.",
        "'Adversarial input that overrides system prompt' → prompt injection.",
        "'Block topics and redact PII for an FM' → Bedrock Guardrails.",
        "'AWS service terms confirm customer data is not used for training' → review AWS Service Terms (and the responsible-AI documentation per service).",
        "'Healthcare organization needs HIPAA-eligible AI' → check service is on HIPAA Eligible list; sign BAA.",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────────────────────────────

export const AWS_AIP_QUESTIONS: Question[] = [
  // ── Fundamentals ───────────────────────────────────────────────
  {
    id: "q-aip-f-1",
    examId: "aws-aip",
    topicId: "aip-fundamentals",
    prompt: "Which statement best describes the relationship between AI, ML, deep learning, and generative AI?",
    choices: [
      "They are equivalent terms used interchangeably.",
      "Generative AI ⊃ Deep Learning ⊃ ML ⊃ AI.",
      "AI ⊃ ML ⊃ Deep Learning ⊃ Generative AI.",
      "ML ⊃ AI ⊃ Generative AI ⊃ Deep Learning.",
    ],
    correctIndex: 2,
    explanation:
      "Concentric subsets. AI is the broadest umbrella; ML is AI that learns from data; deep learning is ML with neural nets; generative AI is deep learning that produces new content.",
    difficulty: "easy",
    tags: ["hierarchy"],
  },
  {
    id: "q-aip-f-2",
    examId: "aws-aip",
    topicId: "aip-fundamentals",
    prompt: "A model achieves 99% accuracy on training data but only 60% on test data. What's the most likely problem?",
    choices: ["Underfitting", "Overfitting", "Data drift", "Class imbalance"],
    correctIndex: 1,
    explanation:
      "Overfitting — the model memorized the training data and fails to generalize. Mitigations: regularization, dropout, more data, simpler model.",
    difficulty: "easy",
    tags: ["model-eval"],
  },
  {
    id: "q-aip-f-3",
    examId: "aws-aip",
    topicId: "aip-fundamentals",
    prompt: "You need to score 50 million records overnight without any latency requirement. Which inference mode fits?",
    choices: ["Real-time inference endpoint", "Batch inference (transform job)", "Asynchronous inference", "Edge inference"],
    correctIndex: 1,
    explanation:
      "Batch inference is designed for large dataset processing offline with no per-request latency requirement. Real-time is for low-latency single requests.",
    difficulty: "medium",
    tags: ["inference"],
  },
  {
    id: "q-aip-f-4",
    examId: "aws-aip",
    topicId: "aip-fundamentals",
    prompt: "A bank wants to detect fraud where missing a fraudulent transaction is more costly than flagging a legitimate one. Which metric should the model optimize for?",
    choices: ["Accuracy", "Precision", "Recall", "RMSE"],
    correctIndex: 2,
    explanation:
      "Recall measures how many actual positives are caught. Maximizing recall minimizes false negatives — exactly what's needed when missing fraud is the costlier error.",
    difficulty: "medium",
    tags: ["model-eval", "metrics"],
  },
  {
    id: "q-aip-f-5",
    examId: "aws-aip",
    topicId: "aip-fundamentals",
    prompt: "Which AWS service tier is best when you want to call a pre-built API for image labeling with no ML expertise required?",
    choices: ["SageMaker", "Bedrock", "AWS AI Services (e.g., Rekognition)", "EMR"],
    correctIndex: 2,
    explanation:
      "AWS AI Services (Rekognition, Comprehend, Polly, etc.) are pre-built APIs requiring no ML expertise.",
    difficulty: "easy",
    tags: ["aws-stack"],
  },
  {
    id: "q-aip-f-6",
    examId: "aws-aip",
    topicId: "aip-fundamentals",
    prompt: "Which learning paradigm uses a reward signal to train an agent through trial and error?",
    choices: ["Supervised", "Unsupervised", "Self-supervised", "Reinforcement"],
    correctIndex: 3,
    explanation:
      "Reinforcement learning maximizes cumulative reward through trial and error. Common in game playing, robotics, ad bidding.",
    difficulty: "easy",
    tags: ["paradigms"],
  },

  // ── GenAI ──────────────────────────────────────────────────────
  {
    id: "q-aip-g-1",
    examId: "aws-aip",
    topicId: "aip-genai",
    prompt: "Which AWS service provides a single API to invoke foundation models from multiple vendors (Anthropic Claude, Meta Llama, Amazon Titan)?",
    choices: ["SageMaker", "Amazon Bedrock", "Amazon Q", "AWS Lambda"],
    correctIndex: 1,
    explanation:
      "Bedrock is AWS's serverless gateway to multiple FM vendors with a unified API.",
    difficulty: "easy",
    tags: ["bedrock"],
  },
  {
    id: "q-aip-g-2",
    examId: "aws-aip",
    topicId: "aip-genai",
    prompt: "Which Amazon Q variant is designed to assist developers with code generation and modernization (replacing CodeWhisperer)?",
    choices: ["Q Business", "Q Developer", "Q in QuickSight", "Q in Connect"],
    correctIndex: 1,
    explanation:
      "Amazon Q Developer replaced CodeWhisperer in 2024 and expanded its scope to chat, code transformation, and modernization.",
    difficulty: "medium",
    tags: ["amazon-q"],
  },
  {
    id: "q-aip-g-3",
    examId: "aws-aip",
    topicId: "aip-genai",
    prompt: "Which adaptation strategy permanently modifies model weights to improve performance on a specific task or style?",
    choices: ["Prompt engineering", "Few-shot prompting", "Retrieval-Augmented Generation (RAG)", "Fine-tuning"],
    correctIndex: 3,
    explanation:
      "Fine-tuning trains the model on additional examples and updates weights. Prompt engineering and RAG don't change weights.",
    difficulty: "medium",
    tags: ["adaptation"],
  },
  {
    id: "q-aip-g-4",
    examId: "aws-aip",
    topicId: "aip-genai",
    prompt: "Which approach is the LOWEST-cost way to improve the quality of FM outputs for a new use case?",
    choices: ["Train a new model from scratch", "Continued pre-training", "Fine-tuning", "Prompt engineering"],
    correctIndex: 3,
    explanation:
      "Prompt engineering is essentially free — refine the prompt and re-test. Always start here before considering fine-tuning or RAG.",
    difficulty: "easy",
    tags: ["adaptation"],
  },
  {
    id: "q-aip-g-5",
    examId: "aws-aip",
    topicId: "aip-genai",
    prompt: "What does 'temperature 0' do for an LLM call?",
    choices: [
      "Disables the model entirely.",
      "Makes the model output near-deterministic by always picking the highest-probability token.",
      "Forces the model to use only training data, no general knowledge.",
      "Increases the maximum context window.",
    ],
    correctIndex: 1,
    explanation:
      "Temperature 0 = pick the most likely next token at every step → near-deterministic output. Use for code, extraction, structured tasks.",
    difficulty: "medium",
    tags: ["params"],
  },
  {
    id: "q-aip-g-6",
    examId: "aws-aip",
    topicId: "aip-genai",
    prompt: "Per AWS service terms, are customer prompts and outputs in Amazon Bedrock used to train the underlying base foundation models?",
    choices: ["Yes, always.", "Yes, unless the customer opts out.", "No.", "Only for fine-tuned custom models."],
    correctIndex: 2,
    explanation:
      "Bedrock customer data (prompts and outputs) is not used to train base FMs. The data stays in the customer's account.",
    difficulty: "medium",
    tags: ["data-privacy"],
  },

  // ── Applications ───────────────────────────────────────────────
  {
    id: "q-aip-a-1",
    examId: "aws-aip",
    topicId: "aip-applications",
    prompt: "Which Bedrock feature provides managed Retrieval-Augmented Generation over your own data without writing the retrieval pipeline?",
    choices: ["Bedrock Agents", "Bedrock Guardrails", "Bedrock Knowledge Bases", "Bedrock Model Evaluation"],
    correctIndex: 2,
    explanation:
      "Knowledge Bases handle the entire RAG pipeline: ingest from S3, chunk, embed, store in vector DB, retrieve at query time.",
    difficulty: "medium",
    tags: ["bedrock-features", "rag"],
  },
  {
    id: "q-aip-a-2",
    examId: "aws-aip",
    topicId: "aip-applications",
    prompt: "Which Bedrock feature lets an FM call APIs and execute multi-step tasks?",
    choices: ["Knowledge Bases", "Agents", "Guardrails", "Provisioned Throughput"],
    correctIndex: 1,
    explanation:
      "Bedrock Agents orchestrate multi-step reasoning, calling tools/APIs (action groups) until the task is complete.",
    difficulty: "medium",
    tags: ["bedrock-features", "agents"],
  },
  {
    id: "q-aip-a-3",
    examId: "aws-aip",
    topicId: "aip-applications",
    prompt: "Which AWS AI Service extracts text and structured data (tables, key-value pairs) from scanned documents?",
    choices: ["Comprehend", "Textract", "Rekognition", "Transcribe"],
    correctIndex: 1,
    explanation:
      "Textract handles documents — text + tables + forms. Comprehend analyzes text NLP. Rekognition is image/video. Transcribe is speech-to-text.",
    difficulty: "easy",
    tags: ["ai-services"],
  },
  {
    id: "q-aip-a-4",
    examId: "aws-aip",
    topicId: "aip-applications",
    prompt: "Which AWS AI Service generates real-time personalized product recommendations from user activity?",
    choices: ["Forecast", "Personalize", "Lex", "Comprehend"],
    correctIndex: 1,
    explanation:
      "Amazon Personalize is purpose-built for real-time personalization and recommendations.",
    difficulty: "easy",
    tags: ["ai-services"],
  },
  {
    id: "q-aip-a-5",
    examId: "aws-aip",
    topicId: "aip-applications",
    prompt: "A team wants to instruct the model to 'think step by step' to improve answers on complex multi-step problems. What is this prompting technique called?",
    choices: ["Zero-shot", "Few-shot", "Chain-of-thought", "Role prompting"],
    correctIndex: 2,
    explanation:
      "Chain-of-thought prompting asks the model to reason step by step before answering, often improving accuracy on complex tasks.",
    difficulty: "medium",
    tags: ["prompting"],
  },
  {
    id: "q-aip-a-6",
    examId: "aws-aip",
    topicId: "aip-applications",
    prompt: "Which AWS service is commonly used as the vector store for a RAG application using PostgreSQL?",
    choices: ["DynamoDB", "Aurora PostgreSQL with pgvector", "Redshift", "DocumentDB"],
    correctIndex: 1,
    explanation:
      "Aurora PostgreSQL with the pgvector extension is the standard relational option for vector search on AWS. OpenSearch with k-NN is the search-native alternative.",
    difficulty: "medium",
    tags: ["rag", "vector-stores"],
  },
  {
    id: "q-aip-a-7",
    examId: "aws-aip",
    topicId: "aip-applications",
    prompt: "Which Bedrock feature filters harmful content and can redact PII from prompts and responses?",
    choices: ["Guardrails", "Knowledge Bases", "Custom Model Import", "Provisioned Throughput"],
    correctIndex: 0,
    explanation:
      "Guardrails for Amazon Bedrock enforce content policies (block topics, redact PII, filter hate/violence/sexual/insults) on inputs and outputs.",
    difficulty: "easy",
    tags: ["bedrock-features", "guardrails"],
  },

  // ── Responsible AI ─────────────────────────────────────────────
  {
    id: "q-aip-r-1",
    examId: "aws-aip",
    topicId: "aip-responsible",
    prompt: "Which AWS tool helps detect bias in training data and provides feature attributions for model explainability?",
    choices: ["Amazon A2I", "SageMaker Clarify", "AWS Audit Manager", "CloudTrail"],
    correctIndex: 1,
    explanation:
      "SageMaker Clarify detects bias before/during/after training and provides SHAP-based explainability.",
    difficulty: "medium",
    tags: ["responsible-ai", "bias"],
  },
  {
    id: "q-aip-r-2",
    examId: "aws-aip",
    topicId: "aip-responsible",
    prompt: "Which AWS service routes low-confidence ML predictions to human reviewers for final decision?",
    choices: ["SageMaker Model Monitor", "Amazon A2I (Augmented AI)", "Bedrock Agents", "CloudWatch"],
    correctIndex: 1,
    explanation:
      "Amazon A2I (Augmented AI) provides human-in-the-loop review workflows for low-confidence predictions.",
    difficulty: "medium",
    tags: ["responsible-ai", "human-loop"],
  },
  {
    id: "q-aip-r-3",
    examId: "aws-aip",
    topicId: "aip-responsible",
    prompt: "Which document, published by AWS, describes the intended use, performance, and limitations of an AWS AI service like Rekognition?",
    choices: ["Service Level Agreement", "AI Service Card", "Acceptable Use Policy", "Service Health Dashboard"],
    correctIndex: 1,
    explanation:
      "AWS publishes AI Service Cards documenting intended use, performance characteristics, design choices, and limitations of each AI service.",
    difficulty: "medium",
    tags: ["responsible-ai", "documentation"],
  },
  {
    id: "q-aip-r-4",
    examId: "aws-aip",
    topicId: "aip-responsible",
    prompt: "Which responsible-AI dimension addresses 'humans can understand why the model made a decision'?",
    choices: ["Fairness", "Robustness", "Explainability", "Veracity"],
    correctIndex: 2,
    explanation:
      "Explainability is about making model decisions understandable to humans. Tools: SHAP, LIME, model cards.",
    difficulty: "easy",
    tags: ["responsible-ai", "dimensions"],
  },
  {
    id: "q-aip-r-5",
    examId: "aws-aip",
    topicId: "aip-responsible",
    prompt: "A deployed model's accuracy starts degrading as input data patterns shift. Which AWS service detects this drift?",
    choices: ["SageMaker Clarify", "SageMaker Model Monitor", "CloudTrail", "Amazon Macie"],
    correctIndex: 1,
    explanation:
      "SageMaker Model Monitor continuously monitors deployed models for data drift, concept drift, and bias drift.",
    difficulty: "medium",
    tags: ["responsible-ai", "monitoring"],
  },

  // ── Security ──────────────────────────────────────────────────
  {
    id: "q-aip-s-1",
    examId: "aws-aip",
    topicId: "aip-security",
    prompt: "How can you connect from a private VPC to Amazon Bedrock without the traffic going over the public internet?",
    choices: [
      "Add an internet gateway to the VPC.",
      "Use a NAT gateway.",
      "Use a VPC endpoint (PrivateLink).",
      "Switch to a different region.",
    ],
    correctIndex: 2,
    explanation:
      "VPC endpoints (PrivateLink) keep traffic to AWS services on the AWS backbone, never traversing the public internet.",
    difficulty: "medium",
    tags: ["network"],
  },
  {
    id: "q-aip-s-2",
    examId: "aws-aip",
    topicId: "aip-security",
    prompt: "Which AWS service provides a complete audit log of every API call made in your account?",
    choices: ["CloudWatch Logs", "CloudTrail", "AWS Config", "X-Ray"],
    correctIndex: 1,
    explanation:
      "CloudTrail is the audit log of AWS API calls — who, what, when, from where. Required for governance and compliance.",
    difficulty: "easy",
    tags: ["audit"],
  },
  {
    id: "q-aip-s-3",
    examId: "aws-aip",
    topicId: "aip-security",
    prompt: "An attacker hides instructions inside a document that an LLM is asked to summarize, attempting to override the system prompt. What is this attack?",
    choices: ["Hallucination", "Prompt injection", "Data poisoning", "Model inversion"],
    correctIndex: 1,
    explanation:
      "Prompt injection inserts adversarial content in user input to override system instructions. Mitigation: input validation, role separation, Guardrails.",
    difficulty: "medium",
    tags: ["genai-threats"],
  },
  {
    id: "q-aip-s-4",
    examId: "aws-aip",
    topicId: "aip-security",
    prompt: "Which AWS service automatically discovers personally identifiable information (PII) in S3 buckets?",
    choices: ["GuardDuty", "Macie", "Inspector", "Detective"],
    correctIndex: 1,
    explanation:
      "Amazon Macie uses ML to discover and classify sensitive data (including PII) in S3.",
    difficulty: "medium",
    tags: ["data-protection"],
  },
  {
    id: "q-aip-s-5",
    examId: "aws-aip",
    topicId: "aip-security",
    prompt: "A healthcare organization needs to ensure their AI workloads meet HIPAA requirements. What is the FIRST step on AWS?",
    choices: [
      "Enable CloudTrail in all regions.",
      "Confirm the AWS services they use are HIPAA-eligible and execute a Business Associate Addendum (BAA) with AWS.",
      "Move all workloads to a dedicated tenant.",
      "Encrypt all S3 buckets.",
    ],
    correctIndex: 1,
    explanation:
      "Use only AWS HIPAA-Eligible Services for PHI workloads, and execute a BAA with AWS. Encryption and logging are also required, but the foundational step is service eligibility + BAA.",
    difficulty: "hard",
    tags: ["compliance"],
  },
];

// ─────────────────────────────────────────────────────────────────
// DIAGNOSTIC SET — 8 questions across all 5 domains
// ─────────────────────────────────────────────────────────────────

export const AWS_AIP_DIAGNOSTIC = [
  "q-aip-f-1",
  "q-aip-f-2",
  "q-aip-g-1",
  "q-aip-g-3",
  "q-aip-a-3",
  "q-aip-a-7",
  "q-aip-r-1",
  "q-aip-s-3",
];

// ─────────────────────────────────────────────────────────────────
// LESSONS
// ─────────────────────────────────────────────────────────────────

export const AWS_AIP_LESSONS: Lesson[] = [
  // Fundamentals
  {
    id: "l-aip-f-1",
    topicId: "aip-fundamentals",
    order: 1,
    title: "AI / ML / DL / GenAI — the AWS framing",
    summary:
      "AWS uses concentric subsets to position the field. Memorize the hierarchy and the AWS three-tier stack.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "The hierarchy",
        bullets: [
          "AI — any system performing tasks normally requiring human intelligence.",
          "ML — AI that learns from data without explicit programming.",
          "Deep Learning — ML using multi-layer neural networks.",
          "Generative AI — Deep Learning that produces new content (text, image, code, audio).",
        ],
      },
      {
        kind: "concept",
        title: "AWS's three-tier ML stack",
        table: {
          columns: ["Tier", "What you get", "Audience"],
          rows: [
            { label: "AI Services", cells: ["Pre-built APIs (Rekognition, Comprehend, Polly, ...)", "Developers"] },
            { label: "SageMaker", cells: ["Build, train, deploy custom models", "Data scientists"] },
            { label: "Bedrock + Q", cells: ["Foundation models + branded assistants", "Builders + business users"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Pick the highest tier that solves the problem",
        body:
          "Always start at the AI Services tier — if there's a pre-built API, use it. Only drop to SageMaker if the pre-built doesn't fit. Bedrock is for generative AI specifically.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "AI ⊃ ML ⊃ DL ⊃ GenAI. AWS stack: AI Services → SageMaker → Bedrock.",
      },
    ],
  },
  {
    id: "l-aip-f-2",
    topicId: "aip-fundamentals",
    order: 2,
    title: "Learning paradigms and inference modes",
    summary:
      "Supervised / unsupervised / reinforcement, plus real-time vs batch inference.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "Three learning paradigms",
        bullets: [
          "Supervised — labeled data; predicts category (classification) or value (regression).",
          "Unsupervised — no labels; finds structure (clustering, dimensionality reduction).",
          "Reinforcement — reward signal; agent learns through trial and error.",
        ],
      },
      {
        kind: "concept",
        title: "Inference modes",
        bullets: [
          "Real-time — single request, low latency (chatbot, fraud check).",
          "Batch — large dataset, no latency requirement (overnight scoring).",
          "Asynchronous — large payload, longer processing time.",
          "Serverless — auto-scaling, no infra management.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Match paradigm to data, mode to latency requirement.",
      },
    ],
  },
  {
    id: "l-aip-f-3",
    topicId: "aip-fundamentals",
    order: 3,
    title: "Metrics and the overfit/underfit story",
    summary:
      "Accuracy / precision / recall / F1 / AUC for classification; MAE / RMSE for regression. Overfit vs underfit signs.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Classification metrics",
        bullets: [
          "Accuracy — % correct overall (best when classes are balanced).",
          "Precision — of predicted positives, how many are actually positive.",
          "Recall — of actual positives, how many were caught.",
          "F1 — harmonic mean of precision + recall.",
          "AUC — area under ROC curve; great for class-imbalanced problems.",
        ],
      },
      {
        kind: "concept",
        title: "Regression metrics",
        bullets: [
          "MAE — mean absolute error.",
          "RMSE — root mean squared error (penalizes large errors more).",
          "R² — variance explained (1 = perfect, 0 = no better than mean).",
        ],
      },
      {
        kind: "comparison",
        title: "Overfit vs underfit",
        table: {
          columns: ["Symptom", "Meaning", "Fix"],
          rows: [
            { label: "High train, low test accuracy", cells: ["Overfit (memorized)", "Regularization, dropout, more data, simpler model"] },
            { label: "Low train AND low test accuracy", cells: ["Underfit (too simple)", "More features, deeper model, train longer"] },
          ],
        },
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Pick metrics based on problem and class balance. Diagnose fit by comparing train vs test scores.",
      },
    ],
  },

  // GenAI
  {
    id: "l-aip-g-1",
    topicId: "aip-genai",
    order: 1,
    title: "Foundation models, tokens, and Bedrock",
    summary:
      "What FMs are, why tokens matter, and how Bedrock provides one API for many vendors.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Foundation models",
        body:
          "Large pre-trained models adaptable to many tasks. Examples: Claude (Anthropic), Llama (Meta), Titan (Amazon), Stable Diffusion (image). LLMs are FMs specialized for text. Multi-modal FMs handle multiple input/output types.",
      },
      {
        kind: "concept",
        title: "Tokens — the basic unit",
        bullets: [
          "Token ≈ ¾ of an English word (varies by language).",
          "Pricing is per 1,000 input + 1,000 output tokens.",
          "Context window = max tokens (input + output) per request.",
          "Use Tokenizer tools to estimate token counts.",
        ],
      },
      {
        kind: "concept",
        title: "Amazon Bedrock — what it offers",
        bullets: [
          "Single API for FMs from Anthropic, Meta, Amazon, Cohere, AI21, Mistral, Stability AI.",
          "Serverless — no infrastructure to manage.",
          "Customer data is NOT used to train base models.",
          "Features: Knowledge Bases, Agents, Guardrails, Model Evaluation, Prompt Management.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Bedrock = managed multi-vendor FM API. Tokens drive cost and limits. Customer data stays private.",
      },
    ],
  },
  {
    id: "l-aip-g-2",
    topicId: "aip-genai",
    order: 2,
    title: "Amazon Q — the assistant family",
    summary:
      "AWS's branded GenAI assistants: Business, Developer, in QuickSight, in Connect.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "Four flavors of Q",
        table: {
          columns: ["Product", "Use"],
          rows: [
            { label: "Q Business", cells: ["Generative assistant grounded in your company data"] },
            { label: "Q Developer", cells: ["Code generation + modernization (replaced CodeWhisperer)"] },
            { label: "Q in QuickSight", cells: ["Natural-language analytics from data"] },
            { label: "Q in Connect", cells: ["Real-time call assistance with knowledge base"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Q vs Bedrock",
        body:
          "Bedrock is the API to FMs (you build with it). Q is AWS's branded ready-to-use assistant products built ON Bedrock.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Q = AWS's branded GenAI assistants. Four variants for different audiences.",
      },
    ],
  },
  {
    id: "l-aip-g-3",
    topicId: "aip-genai",
    order: 3,
    title: "Adapting an FM — cheapest to most expensive",
    summary:
      "Prompt → Few-shot → RAG → Fine-tune → Continued pre-train. Always start cheap.",
    minutes: 4,
    cards: [
      {
        kind: "comparison",
        title: "Adaptation ladder",
        table: {
          columns: ["Strategy", "Cost", "When to use"],
          rows: [
            { label: "Prompt engineering", cells: ["Lowest", "Tweak the prompt"] },
            { label: "Few-shot", cells: ["Low", "Provide examples in prompt"] },
            { label: "RAG", cells: ["Low–Med", "Ground in your data without retraining"] },
            { label: "Fine-tuning", cells: ["Med–High", "Adapt for specific style/task"] },
            { label: "Continued pre-training", cells: ["High", "Domain adaptation on large corpus"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "RAG vs Fine-tuning",
        body:
          "RAG = WHAT facts the model knows (changes at retrieval time). Fine-tuning = HOW the model responds (changes weights).",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Always start at prompt engineering. Climb only if needed.",
      },
    ],
  },

  // Applications
  {
    id: "l-aip-a-1",
    topicId: "aip-applications",
    order: 1,
    title: "Bedrock features in depth",
    summary:
      "Knowledge Bases, Agents, Guardrails, Model Evaluation, Prompt Management, Provisioned Throughput.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "The feature menu",
        table: {
          columns: ["Feature", "Use it for"],
          rows: [
            { label: "Knowledge Bases", cells: ["Managed RAG over your data"] },
            { label: "Agents", cells: ["Multi-step reasoning + tool calls"] },
            { label: "Guardrails", cells: ["Block topics, redact PII, filter harmful content"] },
            { label: "Model Evaluation", cells: ["Compare models on your prompts"] },
            { label: "Prompt Management", cells: ["Versioned prompt templates"] },
            { label: "Provisioned Throughput", cells: ["Reserved capacity for predictable workloads"] },
            { label: "Custom Model Import", cells: ["Bring your own fine-tuned weights"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Knowledge Bases + Agents combo",
        body:
          "Agents can use Knowledge Bases as one of their action sources — combining retrieval (facts) with reasoning + tool use (actions).",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Bedrock isn't just FM access — it's a full GenAI app platform.",
      },
    ],
  },
  {
    id: "l-aip-a-2",
    topicId: "aip-applications",
    order: 2,
    title: "AWS AI Services — service-to-task map",
    summary:
      "Pre-built APIs for vision, NLP, speech, documents, search, recommendations.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "The map",
        table: {
          columns: ["Service", "Use case"],
          rows: [
            { label: "Rekognition", cells: ["Image/video analysis"] },
            { label: "Comprehend", cells: ["Text NLP — sentiment, entities, topics"] },
            { label: "Textract", cells: ["Extract text + structured data from docs"] },
            { label: "Polly", cells: ["Text-to-speech"] },
            { label: "Transcribe", cells: ["Speech-to-text"] },
            { label: "Translate", cells: ["Neural translation"] },
            { label: "Lex", cells: ["Intent-based chatbots (Alexa engine)"] },
            { label: "Personalize", cells: ["Real-time recommendations"] },
            { label: "Kendra", cells: ["Managed enterprise search with NLP"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Pair when needed",
        body:
          "Common combos: Textract → Comprehend (extract text from doc, then analyze). Transcribe → Comprehend (audio → text → sentiment).",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Memorize the service-to-task map. The exam will give you a scenario; you pick the service.",
      },
    ],
  },
  {
    id: "l-aip-a-3",
    topicId: "aip-applications",
    order: 3,
    title: "RAG architecture and prompt techniques",
    summary:
      "How RAG works on AWS, vector store options, and the main prompting techniques.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "RAG flow",
        bullets: [
          "Documents → chunks → embeddings → vector store.",
          "Query time: embed query → retrieve nearest chunks → inject into prompt → LLM responds.",
          "Bedrock Knowledge Bases automate the whole pipeline.",
        ],
      },
      {
        kind: "concept",
        title: "Vector store options on AWS",
        bullets: [
          "Amazon OpenSearch with k-NN — flexible, search-native.",
          "Aurora PostgreSQL with pgvector — relational + vector.",
          "Amazon MemoryDB — Redis-compatible with vector index.",
          "Amazon Neptune Analytics — graph + vector.",
          "Amazon Kendra — managed enterprise search.",
        ],
      },
      {
        kind: "concept",
        title: "Prompt techniques",
        bullets: [
          "Zero-shot — ask directly with no examples.",
          "Few-shot — provide examples in the prompt.",
          "Chain-of-thought — instruct 'think step by step.'",
          "Role prompting — assign a persona.",
          "Structured output — request JSON / specific format.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "RAG = retrieve + generate. Vector store choice depends on your existing data infrastructure.",
      },
    ],
  },

  // Responsible AI
  {
    id: "l-aip-r-1",
    topicId: "aip-responsible",
    order: 1,
    title: "Responsible AI dimensions and AWS tools",
    summary:
      "Fairness, explainability, robustness, privacy, governance, transparency, veracity, controllability, safety.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Dimensions",
        bullets: [
          "Fairness — equitable outcomes across groups.",
          "Explainability — humans can understand decisions.",
          "Robustness — reliable across conditions.",
          "Privacy & Security — protect data, prevent leakage.",
          "Governance — clear ownership and processes.",
          "Transparency — disclose how the system works.",
          "Veracity — outputs are factually accurate.",
          "Controllability — humans can override.",
          "Safety — minimize harmful outcomes.",
        ],
      },
      {
        kind: "concept",
        title: "AWS tooling map",
        table: {
          columns: ["Tool", "Use"],
          rows: [
            { label: "SageMaker Clarify", cells: ["Bias detection + explainability"] },
            { label: "Amazon A2I", cells: ["Human-in-the-loop review"] },
            { label: "AI Service Cards", cells: ["Per-service intended use + limitations"] },
            { label: "Bedrock Guardrails", cells: ["GenAI content filtering"] },
            { label: "Bedrock Model Evaluation", cells: ["Compare model outputs"] },
            { label: "SageMaker Model Monitor", cells: ["Drift detection in production"] },
          ],
        },
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Match the responsible-AI dimension to the AWS tool that addresses it.",
      },
    ],
  },

  // Security
  {
    id: "l-aip-s-1",
    topicId: "aip-security",
    order: 1,
    title: "Securing AI workloads on AWS",
    summary:
      "IAM, KMS, VPC endpoints, CloudTrail, Macie. The standard AWS security stack applied to AI.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Identity and data",
        bullets: [
          "IAM least privilege — roles, not access keys.",
          "KMS — customer-managed keys (CMK) for full key control.",
          "Macie — auto-discover PII in S3.",
          "Secrets Manager — store API keys safely.",
        ],
      },
      {
        kind: "concept",
        title: "Network isolation",
        bullets: [
          "VPC — private network for resources.",
          "VPC endpoint (PrivateLink) — connect to AWS services without public internet.",
          "SageMaker network isolation — disable internet on training/endpoints.",
        ],
      },
      {
        kind: "concept",
        title: "Audit",
        bullets: [
          "CloudTrail — every API call logged.",
          "CloudWatch — metrics, logs, alarms.",
          "AWS Config — track resource configuration changes.",
          "Audit Manager — automated compliance evidence.",
        ],
      },
      {
        kind: "tip",
        title: "Bedrock data privacy",
        body:
          "Bedrock prompts and outputs are NOT used to train base FMs. Customer data stays in the customer account. Frequently tested.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Standard AWS security primitives apply. Plus: PrivateLink for Bedrock, CMK for keys, Macie for PII.",
      },
    ],
  },
  {
    id: "l-aip-s-2",
    topicId: "aip-security",
    order: 2,
    title: "GenAI-specific threats",
    summary:
      "Prompt injection, jailbreaking, hallucination, training-data leakage, insecure output handling, excessive agency.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "The threats",
        table: {
          columns: ["Threat", "Mitigation"],
          rows: [
            { label: "Prompt injection", cells: ["Input validation, role separation, Guardrails"] },
            { label: "Jailbreaking", cells: ["Guardrails, monitoring, rate limits"] },
            { label: "Hallucination", cells: ["RAG, lower temperature, citations"] },
            { label: "Training data leakage", cells: ["Filter training data, output evaluation"] },
            { label: "Insecure output handling", cells: ["Sandbox execution, validate outputs"] },
            { label: "Excessive agency", cells: ["Least-privilege tools, scoped action groups"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Bedrock Guardrails coverage",
        body:
          "Guardrails handle most of the runtime defenses: harmful content, denied topics, PII redaction, prompt-injection patterns.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "GenAI introduces new threats. Match each to its mitigation.",
      },
    ],
  },
];
