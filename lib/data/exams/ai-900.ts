import type { Lesson, Question, Topic } from "../../types";

// ─────────────────────────────────────────────────────────────────
// Microsoft Azure AI Fundamentals (AI-900)
// Official update — Sept 2024 added Generative AI as a 5th domain.
// ─────────────────────────────────────────────────────────────────

export const AI900_TOPICS: Topic[] = [
  {
    id: "ai9-workloads",
    examId: "ai-900",
    name: "AI Workloads & Considerations",
    shortName: "AI Workloads",
    weight: 0.18,
    summary:
      "What counts as an AI workload, the categories Microsoft groups them into, and the responsible-AI guardrails that surround every Azure AI deployment.",
    subtopics: [
      "Common AI workload types (vision, NLP, speech, document, generative, anomaly, knowledge mining)",
      "Microsoft's six Responsible AI principles",
      "Where each principle shows up in practice",
      "Transparency, fairness, accountability — and how Azure tooling enforces them",
      "Limits and risks of AI",
    ],
    keyFacts: [
      "Microsoft groups AI workloads into 7 categories: prediction/forecasting, anomaly detection, computer vision, NLP, knowledge mining, document intelligence, and generative AI.",
      "The six Responsible AI principles: Fairness, Reliability & Safety, Privacy & Security, Inclusiveness, Transparency, Accountability.",
      "Fairness = no group is unfairly disadvantaged. Reliability = consistent results under expected conditions.",
      "Transparency = users understand what the system does and its limits.",
      "Accountability = humans, not AI, are responsible for AI decisions.",
      "Anomaly detection = flag unusual data points (fraud, equipment failure).",
      "Knowledge mining = extract structure from unstructured data (Azure AI Search).",
    ],
    cramSheet: [
      "AI workload categories: vision, NLP, speech, document, generative, anomaly, knowledge mining.",
      "6 Responsible AI principles: Fairness, Reliability & Safety, Privacy & Security, Inclusiveness, Transparency, Accountability.",
      "Anomaly detection ≠ classification. It flags 'this looks weird' not 'this is class X.'",
      "Knowledge mining = unstructured → structured (Azure AI Search).",
      "Generative AI is its own workload category — not just 'NLP+'.",
    ],
    review: {
      examWeight: "15–20% of the exam",
      overview:
        "This domain is concept-heavy. You're not asked to build anything — you're asked to recognize *what kind* of AI a scenario describes, and which Responsible AI principle is at stake. Memorize the 7 workload categories and the 6 principles; everything in this domain pattern-matches to that vocabulary. The principles in particular show up in 3-4 questions and the wrong answers are usually almost-right rephrasings of another principle, so precise definitions matter.",
      sections: [
        {
          heading: "AI workload types — the 7 categories",
          body:
            "Microsoft groups every AI use case into one of these. Recognize the scenario, pick the category.",
          table: {
            columns: ["Category", "What it does", "Example"],
            rows: [
              {
                label: "Prediction / Forecasting",
                cells: ["Predict a numeric value from inputs", "Sales next quarter, energy demand"],
              },
              {
                label: "Anomaly Detection",
                cells: ["Flag data points that don't match the pattern", "Credit card fraud, equipment failure"],
              },
              {
                label: "Computer Vision",
                cells: ["Interpret images and video", "Face detection, OCR, defect spotting"],
              },
              {
                label: "Natural Language Processing",
                cells: ["Understand text and speech", "Sentiment, translation, summarization"],
              },
              {
                label: "Knowledge Mining",
                cells: ["Extract structure from unstructured sources", "Searching across PDFs, contracts, audio"],
              },
              {
                label: "Document Intelligence",
                cells: ["Extract specific fields from forms and documents", "Invoice fields, receipt totals"],
              },
              {
                label: "Generative AI",
                cells: ["Produce new content (text, images, code)", "ChatGPT, DALL-E, GitHub Copilot"],
              },
            ],
          },
        },
        {
          heading: "Responsible AI — the six principles",
          body:
            "Microsoft's Responsible AI standard. Every question framed as 'a system did X — which principle was violated?' maps to one of these.",
          table: {
            columns: ["Principle", "What it means", "Real-world failure"],
            rows: [
              {
                label: "Fairness",
                cells: ["Treat all groups equitably", "Loan model approves men more than women for the same income"],
              },
              {
                label: "Reliability & Safety",
                cells: ["Performs consistently and safely under expected conditions", "Self-driving model fails in rain it wasn't trained on"],
              },
              {
                label: "Privacy & Security",
                cells: ["Protect personal data; resist tampering", "Training data leaks PII through model outputs"],
              },
              {
                label: "Inclusiveness",
                cells: ["Empower everyone — especially under-served groups", "Speech model only works for native English"],
              },
              {
                label: "Transparency",
                cells: ["Users understand what the system does and its limits", "Black-box model with no explanation of decisions"],
              },
              {
                label: "Accountability",
                cells: ["Humans take responsibility for AI behavior", "No designated owner when the model causes harm"],
              },
            ],
          },
        },
        {
          heading: "Where each principle is enforced in Azure",
          bullets: [
            "Fairness → Fairlearn library and Responsible AI dashboard inside Azure ML.",
            "Reliability & Safety → testing, ongoing monitoring with model performance drift alerts.",
            "Privacy & Security → Azure Key Vault, network isolation (private endpoints), data anonymization, customer-managed keys.",
            "Inclusiveness → designing datasets and interfaces that work for diverse users (e.g., Microsoft's Inclusive Design toolkit).",
            "Transparency → model cards, the Responsible AI dashboard's interpretability panels, ML.NET model explanations.",
            "Accountability → governance reviews, the Responsible AI Standard, audit trails.",
          ],
        },
        {
          heading: "Common AI limits and risks",
          bullets: [
            "Bias from training data — model is only as fair as what it learned from.",
            "Hallucinations (especially in generative AI) — confident output that isn't true.",
            "Drift — model accuracy degrades as the world changes around it.",
            "Privacy leakage — model memorizes and regurgitates sensitive training data.",
            "Misuse — same model can be used for legitimate or malicious ends.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Anomaly detection vs classification",
          explanation:
            "Classification answers 'which of these classes?' Anomaly detection answers 'is this normal or weird?' Fraud detection is anomaly detection — most transactions are fine and the model flags the unusual ones.",
        },
        {
          confusion: "Knowledge mining vs document intelligence",
          explanation:
            "Knowledge mining is broad: searching and discovering insights across mountains of unstructured content (PDFs, audio, images). Document intelligence is narrower: extracting specific fields from forms (invoice number, total, due date).",
        },
        {
          confusion: "Reliability vs Safety",
          explanation:
            "They're combined into one principle on AI-900. Reliability = consistent results. Safety = no harm under failure. Together they mean 'the system performs as intended without hurting people.'",
        },
        {
          confusion: "Fairness vs Inclusiveness",
          explanation:
            "Fairness is about outputs (is one group treated worse by the model's decisions?). Inclusiveness is about access (can everyone *use* the system at all?). A speech model that doesn't recognize a regional accent fails inclusiveness, not fairness.",
        },
        {
          confusion: "Transparency vs Accountability",
          explanation:
            "Transparency is what the system does. Accountability is who answers for it. Transparency is a property of the model; accountability is a property of the organization.",
        },
      ],
      examTips: [
        "'Detect unusual transactions' → anomaly detection.",
        "'Read text from a photo' → computer vision (OCR).",
        "'Translate spoken Spanish to English text' → NLP (speech-to-text + translation).",
        "'Extract invoice number and total from a scanned PDF' → document intelligence.",
        "'Search across thousands of PDFs and audio files' → knowledge mining.",
        "'Generate marketing copy from a prompt' → generative AI.",
        "'A model approves loans for some demographics more than others' → fairness violated.",
        "'A medical model can't be explained to a patient' → transparency violated.",
        "'A facial recognition system fails for darker skin tones' → fairness AND inclusiveness.",
      ],
    },
  },
  {
    id: "ai9-ml",
    examId: "ai-900",
    name: "Machine Learning Fundamentals",
    shortName: "ML Fundamentals",
    weight: 0.22,
    summary:
      "What machine learning is, how Azure ML supports the lifecycle, and the difference between supervised, unsupervised, regression, classification, and clustering.",
    subtopics: [
      "Supervised vs unsupervised learning",
      "Regression vs classification vs clustering",
      "Features and labels",
      "Training, validation, and test data splits",
      "Common evaluation metrics (MAE, RMSE, accuracy, precision, recall, F1, AUC)",
      "Azure Machine Learning workspace and Studio",
      "Automated ML, Designer, and Notebooks",
    ],
    keyFacts: [
      "Supervised learning uses labeled data; unsupervised learning finds structure without labels.",
      "Regression predicts a number. Classification predicts a category. Clustering groups similar items.",
      "Features = inputs (X). Labels = outputs (y).",
      "Train / validate / test splits are typically 70/15/15 or 80/10/10.",
      "Classification metrics: accuracy, precision, recall, F1, ROC AUC.",
      "Regression metrics: MAE (Mean Absolute Error), RMSE (Root Mean Squared Error), R².",
      "Azure ML Designer = drag-and-drop. Automated ML = Azure picks the best algorithm. Notebooks = code.",
    ],
    cramSheet: [
      "Supervised = labels. Unsupervised = no labels.",
      "Regression = number. Classification = category. Clustering = groups.",
      "Confusion matrix → accuracy, precision, recall, F1.",
      "AutoML iterates through algorithms; you give it the metric to optimize.",
      "Designer is no-code; Notebooks are code-first.",
    ],
    review: {
      examWeight: "20–25% of the exam — the biggest after generative AI",
      overview:
        "ML Fundamentals tests three things: vocabulary, problem framing, and Azure ML's tools. You don't have to train a model on the exam — you have to recognize 'this scenario calls for regression, the right metric is RMSE, and the easiest Azure tool is Automated ML.' Memorize the supervised/unsupervised split, the three problem types (regression / classification / clustering), and the metric pairs. Azure ML Designer vs Automated ML vs Notebooks always shows up — know which is no-code, which is automated, which is code-first.",
      sections: [
        {
          heading: "Supervised vs unsupervised learning",
          body:
            "The first decision: do you have labeled examples? If yes, supervised. If no, unsupervised. (Reinforcement learning is a third category but rarely tested on AI-900.)",
          table: {
            columns: ["Type", "Has labels?", "Example task"],
            rows: [
              { label: "Supervised — Regression", cells: ["Yes (numeric)", "Predict house price"] },
              { label: "Supervised — Classification", cells: ["Yes (categorical)", "Spam vs not-spam"] },
              { label: "Unsupervised — Clustering", cells: ["No", "Group customers by behavior"] },
            ],
          },
        },
        {
          heading: "Regression — predicting numbers",
          bullets: [
            "Output is a continuous numeric value.",
            "Examples: predicting price, temperature, demand, time-to-failure.",
            "Evaluation: MAE (average absolute error), RMSE (penalizes big errors), R² (variance explained).",
            "Lower MAE/RMSE is better. Higher R² is better (closer to 1 = best).",
          ],
        },
        {
          heading: "Classification — predicting categories",
          body:
            "Binary classification = 2 classes (spam / not-spam). Multi-class = 3+ classes (cat / dog / bird). Evaluation lives in the confusion matrix.",
          table: {
            columns: ["Metric", "Formula", "Use when"],
            rows: [
              { label: "Accuracy", cells: ["(TP+TN) / total", "Classes are balanced"] },
              { label: "Precision", cells: ["TP / (TP+FP)", "False positives are costly"] },
              { label: "Recall", cells: ["TP / (TP+FN)", "False negatives are costly"] },
              { label: "F1 Score", cells: ["Harmonic mean of P & R", "You need balance between P and R"] },
              { label: "ROC AUC", cells: ["Area under ROC curve", "Class-imbalanced problems"] },
            ],
          },
        },
        {
          heading: "Clustering — finding groups",
          bullets: [
            "Unsupervised — there are no labels.",
            "K-means is the canonical algorithm. You choose K (number of clusters).",
            "Examples: customer segmentation, anomaly grouping, document grouping.",
            "Evaluation is harder — internal metrics like silhouette score, or downstream business value.",
          ],
        },
        {
          heading: "Train / validate / test splits",
          body:
            "You hold back some data so the model can be evaluated on data it has never seen. Common splits: 70/15/15 or 80/10/10. Cross-validation rotates which slice is the holdout to use data more efficiently.",
          bullets: [
            "Training set — the model learns from this.",
            "Validation set — used during training to tune hyperparameters.",
            "Test set — final, untouched evaluation. Touch it once.",
          ],
        },
        {
          heading: "Azure Machine Learning — the workspace",
          body:
            "Azure ML is the umbrella service. Inside the workspace you find compute, datastores, models, endpoints, and three authoring surfaces.",
          table: {
            columns: ["Surface", "Audience", "How"],
            rows: [
              { label: "Automated ML (AutoML)", cells: ["Citizen data scientists", "Pick a dataset and target; Azure tries many algorithms"] },
              { label: "Designer", cells: ["Visual builders", "Drag-and-drop pipeline canvas, no code"] },
              { label: "Notebooks (Python)", cells: ["Data scientists", "Full control with the Azure ML SDK"] },
            ],
          },
        },
        {
          heading: "MLOps and lifecycle",
          bullets: [
            "Compute targets — clusters or instances on which training and inference run.",
            "Datasets — versioned data references managed by the workspace.",
            "Models — registered artifacts with versioning.",
            "Endpoints — deployed models for real-time or batch inference (Online Endpoints / Batch Endpoints).",
            "Pipelines — repeatable workflows for training and deployment.",
            "Responsible AI dashboard — bundled tools for fairness, error analysis, interpretability, causal analysis.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Regression vs Classification",
          explanation:
            "Regression outputs a number. Classification outputs a category. 'Will this customer buy?' = classification. 'How much will this customer spend?' = regression.",
        },
        {
          confusion: "Precision vs Recall",
          explanation:
            "Precision = of all predicted positives, how many were actually positive. Recall = of all actual positives, how many did we catch. Spam filter favors precision (don't put real mail in spam). Cancer screen favors recall (don't miss any cases).",
        },
        {
          confusion: "Validation vs Test set",
          explanation:
            "Validation is used during training (to choose hyperparameters). Test is touched once at the end, after the model is final, to measure real-world expectation.",
        },
        {
          confusion: "AutoML vs Designer vs Notebooks",
          explanation:
            "AutoML = you give the data and target, Azure picks the algorithm. Designer = you build the pipeline visually but choose the steps. Notebooks = full code. AutoML is the easiest; Notebooks the most flexible.",
        },
        {
          confusion: "Supervised vs Unsupervised",
          explanation:
            "If your training data has correct answers (labels), it's supervised. If you only have raw data and want to find structure, it's unsupervised. Clustering is unsupervised; classification is supervised.",
        },
      ],
      examTips: [
        "'Predict next month's revenue' → regression.",
        "'Predict if an email is spam' → classification.",
        "'Group similar customers without predefined categories' → clustering (unsupervised).",
        "'Penalize large prediction errors more' → RMSE.",
        "'Avoid missing any fraud' → optimize recall.",
        "'Avoid false fraud alerts' → optimize precision.",
        "'No-code model building for business users' → Azure ML Designer or AutoML.",
        "'Pick the best algorithm automatically' → Automated ML.",
        "'Full Python control with the SDK' → Notebooks in Azure ML.",
      ],
    },
  },
  {
    id: "ai9-cv",
    examId: "ai-900",
    name: "Computer Vision",
    shortName: "Vision",
    weight: 0.18,
    summary:
      "How Azure handles images and video — image classification, object detection, OCR, face detection, and the services that wrap each capability.",
    subtopics: [
      "Image classification vs object detection vs semantic segmentation",
      "Optical Character Recognition (OCR)",
      "Face detection and analysis",
      "Azure AI Vision (formerly Computer Vision)",
      "Azure AI Custom Vision (your own model)",
      "Azure AI Face service",
      "Azure AI Document Intelligence (formerly Form Recognizer)",
      "Azure AI Video Indexer",
    ],
    keyFacts: [
      "Image classification = label the whole image. Object detection = label and locate objects.",
      "Semantic segmentation = label every pixel.",
      "OCR reads text from images; the modern Azure AI Vision Read API handles printed and handwritten text.",
      "Custom Vision = train your own classifier or detector on your domain images.",
      "Face service detects faces and analyzes attributes; some sensitive features were retired for Responsible AI.",
      "Document Intelligence extracts structured fields from forms (invoices, receipts, IDs).",
      "Azure AI Vision is the umbrella service for general-purpose vision — described in the new Azure AI Foundry portal.",
    ],
    cramSheet: [
      "Classification = whole-image label. Detection = label + bounding box. Segmentation = pixel labels.",
      "OCR → Azure AI Vision Read API.",
      "Custom domain classifier → Custom Vision.",
      "Faces → Azure AI Face.",
      "Forms / invoices → Document Intelligence.",
      "Video search and tagging → Video Indexer.",
    ],
    review: {
      examWeight: "15–20% of the exam",
      overview:
        "This domain is service-mapping: 'I have a vision problem — which Azure service?' Memorize the service-to-capability map. The big three to keep distinct: Azure AI Vision (general, pre-built), Custom Vision (you train), and Document Intelligence (forms specifically). Also know what 'classification' vs 'object detection' mean — they sound similar and are different problems.",
      sections: [
        {
          heading: "Vision tasks — the four shapes",
          table: {
            columns: ["Task", "Output", "Example"],
            rows: [
              { label: "Image classification", cells: ["One label for the whole image", "'cat' or 'dog'"] },
              { label: "Object detection", cells: ["Labels + bounding boxes", "'cat at (10,20,80,80), bowl at (90,10,150,80)'"] },
              { label: "Semantic segmentation", cells: ["A label for every pixel", "Pixel-level outline of the cat"] },
              { label: "OCR (text recognition)", cells: ["Text strings + locations", "Reading a road sign or document"] },
            ],
          },
        },
        {
          heading: "Azure AI Vision — pre-built capabilities",
          body:
            "Azure AI Vision (the renamed Computer Vision service, accessed inside Azure AI Foundry) gives you ready-made vision APIs without training anything yourself.",
          bullets: [
            "Image analysis — describe an image, list tags, detect objects, generate captions.",
            "OCR (Read API) — printed and handwritten text in 100+ languages.",
            "Background removal — isolate the foreground subject.",
            "Smart cropping — pick the most interesting region.",
            "People detection — locate people in the frame.",
          ],
        },
        {
          heading: "Custom Vision — bring your own labels",
          body:
            "When pre-built models don't know your domain (defect types on your factory line, your brand's product catalog), you train Custom Vision. Two project types: classification or object detection.",
          bullets: [
            "Upload labeled images (typically 50+ per tag minimum).",
            "Quick training (minutes) for prototypes; advanced training for production.",
            "Iterations — version your model and pick the best.",
            "Export models to ONNX, TensorFlow, or CoreML for edge deployment.",
          ],
        },
        {
          heading: "Azure AI Face",
          body:
            "Detects faces and returns face IDs, locations, and attributes. Microsoft retired several attributes (emotion, gender, age, smile) for Responsible AI reasons — they could enable surveillance or stereotyping. The verification and identification capabilities remain available with Limited Access approval.",
          bullets: [
            "Detection — find faces in an image, return bounding boxes and basic landmarks.",
            "Verification — is this the same person in two images?",
            "Identification — who is this person? (against a known set)",
            "Limited Access — applies for verification/identification to prevent misuse.",
          ],
        },
        {
          heading: "Document Intelligence (formerly Form Recognizer)",
          body:
            "Specialized for documents and forms. Pre-built models for invoices, receipts, IDs, business cards, and W-2s. Custom models when you have a unique form. The 'Read' model is general OCR; 'Layout' adds structure (tables, selection marks).",
          bullets: [
            "Pre-built: invoice, receipt, ID, business card, US tax forms.",
            "Read model: text + barcodes + multilingual OCR.",
            "Layout model: text + tables + selection marks + structure.",
            "Custom models: train on your own forms (template or neural).",
          ],
        },
        {
          heading: "Video Indexer",
          body:
            "Built on Azure AI services for video. Extracts insights: faces, speakers, transcripts, OCR, sentiment, scene boundaries. Searchable timeline of everything that happens in the video.",
        },
      ],
      gotchas: [
        {
          confusion: "Classification vs Object Detection",
          explanation:
            "Classification labels the whole image with one tag. Object detection finds multiple objects and returns each one with a bounding box. 'Is there a cat?' is classification. 'Where are all the cats and dogs?' is detection.",
        },
        {
          confusion: "Azure AI Vision vs Custom Vision",
          explanation:
            "Azure AI Vision is pre-trained on general categories. Custom Vision is for when those don't fit — you upload your own labeled images and train.",
        },
        {
          confusion: "Document Intelligence vs OCR",
          explanation:
            "OCR (in Azure AI Vision Read) gives you raw text. Document Intelligence extracts *fields* (invoice number, total, due date) from documents using structure-aware models.",
        },
        {
          confusion: "Face attributes — what got retired",
          explanation:
            "Microsoft retired emotion, gender, age, smile, hair, makeup attributes from public Face API in 2022 for Responsible AI. Detection (location), verification, and identification remain — the latter two require Limited Access approval.",
        },
        {
          confusion: "Semantic segmentation vs object detection",
          explanation:
            "Detection draws boxes around objects. Segmentation labels every pixel as belonging to a class. Segmentation is more precise but more expensive.",
        },
      ],
      examTips: [
        "'Identify defective products on a factory line' → Custom Vision (object detection).",
        "'Read text from a scanned receipt' → Azure AI Vision Read API or Document Intelligence.",
        "'Extract invoice number and total from a PDF' → Document Intelligence.",
        "'Detect whether faces are present in security camera footage' → Azure AI Face (detection).",
        "'Confirm that two photos are the same person' → Face verification.",
        "'Caption an image automatically' → Azure AI Vision (image analysis).",
        "'Search and tag content inside an MP4 file' → Video Indexer.",
        "'Group every pixel of a road as drivable surface' → semantic segmentation.",
      ],
    },
  },
  {
    id: "ai9-nlp",
    examId: "ai-900",
    name: "Natural Language Processing",
    shortName: "NLP",
    weight: 0.18,
    summary:
      "How Azure handles text and speech — sentiment, entities, language understanding, translation, speech-to-text, text-to-speech, and conversational AI.",
    subtopics: [
      "Azure AI Language service capabilities",
      "Sentiment analysis, key phrase extraction, entity recognition",
      "Language detection",
      "Conversational Language Understanding (CLU)",
      "Question Answering",
      "Translator service",
      "Speech service: speech-to-text, text-to-speech, speech translation",
      "Azure AI Bot Service for conversational agents",
    ],
    keyFacts: [
      "Azure AI Language is the umbrella for text analytics (sentiment, entities, key phrases, language detection).",
      "Conversational Language Understanding (CLU) — modern replacement for LUIS — interprets user intent and entities.",
      "Question Answering replaces QnA Maker; turns FAQ pages or docs into a Q&A bot backend.",
      "Translator service handles 100+ languages, both real-time and document translation.",
      "Speech service does speech-to-text, text-to-speech (with neural voices), speaker recognition, and speech translation.",
      "Bot Service hosts and manages bots built with the Bot Framework SDK or Composer.",
    ],
    cramSheet: [
      "Sentiment / entities / key phrases / language detect → Azure AI Language.",
      "User intent (what they want) → Conversational Language Understanding (CLU).",
      "Knowledge-base bot from FAQs → Question Answering.",
      "Translate text or docs → Translator.",
      "Speech-to-text / text-to-speech → Speech service.",
      "Host the bot → Azure AI Bot Service.",
    ],
    review: {
      examWeight: "15–20% of the exam",
      overview:
        "NLP on AI-900 is service-mapping again. The trick is the rebrand parade: LUIS → Conversational Language Understanding, QnA Maker → Question Answering, Text Analytics → Azure AI Language. Know both names — questions sometimes use the old. Memorize which service handles intent (CLU) vs sentiment (Language) vs Q&A (Question Answering) vs translation (Translator) vs speech (Speech). Bot Service is the host; the language services are the brains.",
      sections: [
        {
          heading: "Azure AI Language — text analytics",
          body:
            "One service, several text-understanding capabilities. The exam loves to test which capability handles which task.",
          table: {
            columns: ["Capability", "What you give", "What you get back"],
            rows: [
              { label: "Sentiment analysis", cells: ["Text", "Positive / neutral / negative + confidence per sentence"] },
              { label: "Key phrase extraction", cells: ["Text", "List of key phrases"] },
              { label: "Named entity recognition", cells: ["Text", "Entities (person, place, org, datetime, etc.)"] },
              { label: "Entity linking", cells: ["Text", "Entities + Wikipedia / Wikidata IDs"] },
              { label: "Language detection", cells: ["Text", "ISO language code + confidence"] },
              { label: "PII detection", cells: ["Text", "Sensitive entities to redact"] },
              { label: "Summarization", cells: ["Document", "Extractive or abstractive summary"] },
            ],
          },
        },
        {
          heading: "Conversational Language Understanding (CLU)",
          body:
            "The modern replacement for LUIS. You define intents (what the user wants) and entities (the slots they fill in). The model maps utterances to intents.",
          bullets: [
            "Intents — discrete actions a user might want (BookFlight, CancelFlight, CheckBalance).",
            "Entities — slots inside the utterance (origin, destination, date).",
            "Utterances — example phrasings used to train the intent model.",
            "Used for: voice assistants, command interpretation, ticket routing.",
          ],
        },
        {
          heading: "Question Answering",
          body:
            "Replaces QnA Maker. Turns existing FAQs, documents, or URLs into a Q&A pair backend that a bot or app can call. Good when the answers already exist somewhere as text.",
          bullets: [
            "Ingest: URLs, PDFs, Word docs, CSV.",
            "Knowledge base of question/answer pairs.",
            "Multi-turn (follow-up) prompts supported.",
            "Best for: documentation bots, customer support, internal helpdesk.",
          ],
        },
        {
          heading: "Translator",
          bullets: [
            "100+ languages, neural machine translation.",
            "Real-time text translation API.",
            "Document Translation — preserves formatting in Word, PowerPoint, PDF.",
            "Custom Translator — train on your domain (product names, jargon).",
            "Detect-and-translate is one call (auto-detect source language).",
          ],
        },
        {
          heading: "Speech service",
          body:
            "Speech-to-text (STT), text-to-speech (TTS), speech translation, speaker recognition. Neural TTS voices sound natural; you can also build a Custom Neural Voice (with strict approval).",
          table: {
            columns: ["Capability", "Use case"],
            rows: [
              { label: "Speech-to-text (STT)", cells: ["Transcribe meetings, phone calls, voice commands"] },
              { label: "Text-to-speech (TTS)", cells: ["Read responses aloud (IVR, accessibility, audiobooks)"] },
              { label: "Speech translation", cells: ["Translate spoken Spanish to English text or speech"] },
              { label: "Speaker recognition", cells: ["Verify or identify the person speaking"] },
            ],
          },
        },
        {
          heading: "Azure AI Bot Service",
          body:
            "The host for conversational bots. Build with the Bot Framework SDK (C#, JS, Python) or low-code with Bot Framework Composer. Channels include Teams, Slack, web chat, SMS, Telephony.",
        },
      ],
      gotchas: [
        {
          confusion: "Azure AI Language vs Conversational Language Understanding",
          explanation:
            "Azure AI Language analyzes text features (sentiment, entities, key phrases). CLU figures out what the user *wants to do* (intent + slot filling). Different services, different jobs.",
        },
        {
          confusion: "CLU vs Question Answering",
          explanation:
            "CLU classifies user intent and extracts slots ('book a flight from NYC to LA tomorrow'). Question Answering returns an answer from a known FAQ or doc set ('what is your return policy?').",
        },
        {
          confusion: "Translator vs Speech translation",
          explanation:
            "Translator handles text-to-text. Speech translation goes from spoken audio → translated text or audio. They use different services.",
        },
        {
          confusion: "Old vs new service names",
          explanation:
            "LUIS → Conversational Language Understanding. QnA Maker → Question Answering. Text Analytics → Azure AI Language. Computer Vision → Azure AI Vision. Form Recognizer → Document Intelligence. The exam may use either name.",
        },
        {
          confusion: "Sentiment vs key phrase",
          explanation:
            "Sentiment tells you the emotional polarity. Key phrase extraction tells you the topical anchors. Both run on the same input text.",
        },
      ],
      examTips: [
        "'Detect if a customer review is positive or negative' → Azure AI Language (sentiment).",
        "'Pull person/place/date from a paragraph' → Azure AI Language (NER).",
        "'Auto-detect what language a chat message is in' → Azure AI Language (language detection).",
        "'Build a bot that understands the user wants to book a flight' → Conversational Language Understanding.",
        "'Build an FAQ bot from existing documentation' → Question Answering.",
        "'Translate a Word document into 10 languages, preserving formatting' → Translator (Document Translation).",
        "'Transcribe a meeting recording' → Speech-to-text.",
        "'Read a chatbot reply out loud' → Text-to-speech.",
        "'Host the bot on Teams and web chat' → Azure AI Bot Service.",
      ],
    },
  },
  {
    id: "ai9-genai",
    examId: "ai-900",
    name: "Generative AI",
    shortName: "Generative AI",
    weight: 0.24,
    summary:
      "The newest AI-900 domain (added Sept 2024). Covers LLMs, prompts, Azure OpenAI, Copilot products, RAG, and the Responsible AI guardrails specific to generative models.",
    subtopics: [
      "Large Language Models (LLMs) and how they work at a high level",
      "Tokens, completions, and context windows",
      "Prompt engineering basics — system, user, assistant",
      "Azure OpenAI Service",
      "Microsoft Copilot family (Microsoft 365 Copilot, GitHub Copilot)",
      "Retrieval-Augmented Generation (RAG)",
      "Azure AI Foundry portal and project workspace",
      "Responsible AI for generative — content safety, hallucinations, prompt injection",
    ],
    keyFacts: [
      "LLMs are probabilistic — they predict the next token. They don't 'know' truth.",
      "A token is roughly ¾ of a word in English. Context window = max tokens in + out.",
      "Prompt engineering = designing the input to steer the output.",
      "Azure OpenAI hosts OpenAI models (GPT-4o, GPT-4, embeddings, DALL-E) inside Azure with enterprise governance.",
      "Microsoft 365 Copilot grounds responses in your Microsoft Graph data (mail, files, meetings).",
      "RAG = grounding generation in retrieved documents to reduce hallucination.",
      "Azure AI Content Safety filters harmful prompts and responses (hate, violence, sexual, self-harm).",
    ],
    cramSheet: [
      "Generative AI = produce new content (text, images, code).",
      "LLMs predict the next token; they hallucinate when uncertain.",
      "Prompt parts: system (role), user (input), assistant (response).",
      "Azure OpenAI = OpenAI models + Azure governance.",
      "Copilot = Microsoft's branded generative assistants (M365, GitHub, Security, etc.).",
      "RAG = retrieval + generation; grounds answers in your data.",
      "Hallucination = confident wrong answer — the #1 generative AI risk.",
    ],
    review: {
      examWeight: "20–25% of the exam — the new flagship domain",
      overview:
        "This is the newest and largest domain on the updated AI-900. Microsoft added it because every customer is now using Copilot or Azure OpenAI. You need to know: what an LLM does at a high level (predict next token), what tokens and context windows are, how prompt engineering works (system/user/assistant), what Azure OpenAI Service is for vs the consumer ChatGPT, what each Copilot product is, what RAG does, and what specific risks generative AI brings (hallucination, prompt injection, content safety). You won't be asked to write a prompt — you'll be asked to recognize the right service or principle.",
      sections: [
        {
          heading: "What an LLM actually does",
          body:
            "A Large Language Model is a neural network trained on huge amounts of text. Given input tokens, it predicts the next most-likely token, then the next, and so on. It is not retrieving facts — it is generating plausible continuations. That's the source of both its power and its limitations.",
          bullets: [
            "Tokens — the model's basic unit; ~¾ of an English word.",
            "Context window — the maximum tokens (input + output) the model can handle in one call.",
            "Temperature — randomness control. 0 = deterministic, higher = more creative.",
            "Top-p / nucleus sampling — alternative to temperature; restricts sampling to the most probable tokens.",
          ],
        },
        {
          heading: "Prompt engineering basics",
          body:
            "Modern chat LLMs structure conversations in three roles. Knowing the roles is foundational.",
          table: {
            columns: ["Role", "Purpose", "Example"],
            rows: [
              { label: "System", cells: ["Sets behavior, tone, constraints", "'You are a Python expert. Always show full code.'"] },
              { label: "User", cells: ["The user's request or question", "'Write a function that sorts a list.'"] },
              { label: "Assistant", cells: ["The model's response (also fed back as conversation history)", "'Here is a function ...'"] },
            ],
          },
        },
        {
          heading: "Prompt design techniques",
          bullets: [
            "Be specific — vague prompts get vague answers.",
            "Show, don't just tell — give few-shot examples in the prompt.",
            "Specify format — 'reply in JSON' or 'use bullets'.",
            "Constrain — set length, tone, audience explicitly.",
            "Decompose — break complex tasks into steps and let the model think step-by-step.",
          ],
        },
        {
          heading: "Azure OpenAI Service",
          body:
            "Hosts OpenAI's models inside Azure with enterprise features: data residency, network isolation, RBAC, monitoring, content safety. Same models as the consumer ChatGPT but governed.",
          bullets: [
            "Models available: GPT-4o, GPT-4, GPT-3.5-Turbo, embeddings (text-embedding-3-small/large), DALL-E 3, Whisper.",
            "Your prompts and outputs are NOT used to train OpenAI models.",
            "Deployments — you deploy a model into your resource and call it via API.",
            "Azure AI Foundry portal is the modern UI for building, testing, and deploying.",
          ],
        },
        {
          heading: "The Copilot family",
          body:
            "'Copilot' is Microsoft's brand for generative AI assistants embedded in their products. The exam tests recognition.",
          table: {
            columns: ["Product", "Where it lives", "What it does"],
            rows: [
              { label: "Microsoft 365 Copilot", cells: ["Word, Excel, PowerPoint, Outlook, Teams", "Grounds in your Microsoft Graph data — mail, files, meetings"] },
              { label: "GitHub Copilot", cells: ["VS Code, Visual Studio, JetBrains, GitHub.com", "Code completions, chat, PR summaries"] },
              { label: "Microsoft Copilot (consumer)", cells: ["Web, Edge sidebar, Windows", "General chat assistant grounded in Bing search"] },
              { label: "Copilot for Security", cells: ["Microsoft Defender / Sentinel", "Incident triage, KQL queries, threat summaries"] },
              { label: "Copilot Studio", cells: ["Standalone low-code", "Build your own custom Copilot agent"] },
            ],
          },
        },
        {
          heading: "Retrieval-Augmented Generation (RAG)",
          body:
            "Pure LLMs hallucinate when asked about things outside their training. RAG fixes this by retrieving relevant documents first, then injecting them into the prompt as context.",
          bullets: [
            "Step 1: User asks a question.",
            "Step 2: Retrieve relevant chunks from a search index (often Azure AI Search) using vector similarity.",
            "Step 3: Inject retrieved chunks into the prompt as grounding context.",
            "Step 4: LLM answers, citing the retrieved sources.",
            "Result: Grounded, up-to-date answers from YOUR data — not just what the model memorized in training.",
          ],
        },
        {
          heading: "Generative AI risks and Responsible AI",
          body:
            "Generative AI introduces risks specific to the technology. The exam tests recognition of each.",
          table: {
            columns: ["Risk", "What it is", "Mitigation"],
            rows: [
              {
                label: "Hallucination",
                cells: ["Confident output that isn't true", "RAG with citations, retrieval grounding, lower temperature"],
              },
              {
                label: "Prompt injection",
                cells: ["Hidden instructions in input that hijack the model", "Input validation, separating system / user roles, content safety"],
              },
              {
                label: "Harmful content",
                cells: ["Hate, violence, sexual, self-harm output", "Azure AI Content Safety filters at input and output"],
              },
              {
                label: "Privacy leakage",
                cells: ["Model surfaces training-data PII", "Data filtering, DPIAs, customer-managed keys"],
              },
              {
                label: "Copyright",
                cells: ["Generated content reproduces protected works", "Indemnification (Microsoft offers Copilot Copyright Commitment)"],
              },
            ],
          },
        },
      ],
      gotchas: [
        {
          confusion: "Azure OpenAI vs OpenAI / ChatGPT",
          explanation:
            "Same models, different deployment. Azure OpenAI gives you data residency, network isolation, RBAC, and a guarantee that your data is not used to train OpenAI's models. Consumer ChatGPT is a Microsoft-unrelated OpenAI product.",
        },
        {
          confusion: "Microsoft 365 Copilot vs Microsoft Copilot vs Copilot Studio",
          explanation:
            "M365 Copilot is grounded in YOUR Microsoft Graph data (mail, files). Microsoft Copilot (consumer) is general chat over Bing. Copilot Studio is the low-code builder for making your own custom Copilot agents.",
        },
        {
          confusion: "RAG vs fine-tuning",
          explanation:
            "RAG injects retrieved data into the prompt at inference time. Fine-tuning permanently adjusts model weights using a training dataset. RAG is cheaper, more flexible, and easier to update — fine-tuning is for specific style or format adjustments.",
        },
        {
          confusion: "Hallucination vs prompt injection",
          explanation:
            "Hallucination = the model confidently makes things up. Prompt injection = an attacker manipulates the input to override your system prompt. Different problems, different defenses.",
        },
        {
          confusion: "Tokens vs words",
          explanation:
            "A token is typically ~3-4 characters or roughly ¾ of an English word. 1,000 tokens ≈ 750 words. Languages like Chinese pack more characters per token differently. Always think in tokens, not words, for context limits and pricing.",
        },
        {
          confusion: "Temperature 0 vs higher",
          explanation:
            "Temperature 0 = the model picks the most likely next token every time, near-deterministic. Higher temperatures introduce randomness for more creative or varied output. Use 0 for code or extraction; higher for brainstorming.",
        },
      ],
      examTips: [
        "'Generate marketing copy from a prompt' → generative AI workload.",
        "'Run OpenAI models with enterprise governance' → Azure OpenAI Service.",
        "'AI inside Word and Excel grounded in my company's data' → Microsoft 365 Copilot.",
        "'AI code completions in VS Code' → GitHub Copilot.",
        "'Build my own custom AI chatbot without writing code' → Copilot Studio.",
        "'Reduce hallucination by grounding in my docs' → RAG (Retrieval-Augmented Generation).",
        "'Block harmful content in prompts and responses' → Azure AI Content Safety.",
        "'Deterministic output (same answer every time)' → temperature 0.",
        "'Steer the model's role and tone' → system message in prompt.",
        "'Limit on prompt + completion length' → context window (tokens).",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────────────────────────────

export const AI900_QUESTIONS: Question[] = [
  // ── AI Workloads & Considerations ─────────────────────────────
  {
    id: "q-ai9-w-1",
    examId: "ai-900",
    topicId: "ai9-workloads",
    prompt: "A bank wants to flag credit card transactions that look unusual compared to a customer's normal spending. Which AI workload type best describes this?",
    choices: ["Image classification", "Anomaly detection", "Knowledge mining", "Generative AI"],
    correctIndex: 1,
    explanation:
      "Anomaly detection identifies data points that don't fit the established pattern — exactly what fraud detection needs.",
    difficulty: "easy",
    tags: ["workload-types"],
  },
  {
    id: "q-ai9-w-2",
    examId: "ai-900",
    topicId: "ai9-workloads",
    prompt: "Which AI workload is best suited for extracting structured information (line items, totals, due dates) from scanned invoices?",
    choices: ["Computer vision (object detection)", "Document intelligence", "Natural language processing", "Knowledge mining"],
    correctIndex: 1,
    explanation:
      "Document intelligence is purpose-built to pull specific fields out of forms and documents like invoices, receipts, and IDs.",
    difficulty: "easy",
    tags: ["workload-types"],
  },
  {
    id: "q-ai9-w-3",
    examId: "ai-900",
    topicId: "ai9-workloads",
    prompt: "An AI model used for hiring tends to recommend male candidates more often than equally qualified female candidates. Which Responsible AI principle has been violated?",
    choices: ["Reliability & Safety", "Privacy & Security", "Fairness", "Transparency"],
    correctIndex: 2,
    explanation:
      "Fairness requires equitable treatment across groups. A hiring model that discriminates by gender violates fairness.",
    difficulty: "easy",
    tags: ["responsible-ai"],
  },
  {
    id: "q-ai9-w-4",
    examId: "ai-900",
    topicId: "ai9-workloads",
    prompt: "A doctor uses an AI system to recommend treatments but cannot explain to patients how the model reached its recommendation. Which Responsible AI principle is most affected?",
    choices: ["Inclusiveness", "Transparency", "Accountability", "Privacy & Security"],
    correctIndex: 1,
    explanation:
      "Transparency means users can understand what the system does and how it makes decisions. A black-box model with no explanation violates transparency.",
    difficulty: "medium",
    tags: ["responsible-ai"],
  },
  {
    id: "q-ai9-w-5",
    examId: "ai-900",
    topicId: "ai9-workloads",
    prompt: "Which Responsible AI principle states that humans — not the AI system — are responsible for AI behavior and outcomes?",
    choices: ["Fairness", "Accountability", "Transparency", "Reliability & Safety"],
    correctIndex: 1,
    explanation:
      "Accountability puts the responsibility for AI behavior on humans and organizations, not the AI itself.",
    difficulty: "easy",
    tags: ["responsible-ai"],
  },
  {
    id: "q-ai9-w-6",
    examId: "ai-900",
    topicId: "ai9-workloads",
    prompt: "A speech recognition product fails to work for users who speak with non-native accents. Which Responsible AI principle is most directly violated?",
    choices: ["Inclusiveness", "Accountability", "Reliability & Safety", "Privacy & Security"],
    correctIndex: 0,
    explanation:
      "Inclusiveness empowers everyone, especially under-served groups. A speech model that excludes some accents fails inclusiveness.",
    difficulty: "medium",
    tags: ["responsible-ai"],
  },
  {
    id: "q-ai9-w-7",
    examId: "ai-900",
    topicId: "ai9-workloads",
    prompt: "Searching across thousands of unstructured PDFs, audio recordings, and emails to find relevant content is best categorized as which workload?",
    choices: ["Document intelligence", "Generative AI", "Knowledge mining", "Anomaly detection"],
    correctIndex: 2,
    explanation:
      "Knowledge mining extracts structure and insight from large unstructured corpora — Azure AI Search is the underlying engine.",
    difficulty: "medium",
    tags: ["workload-types"],
  },

  // ── ML Fundamentals ─────────────────────────────────────────────
  {
    id: "q-ai9-ml-1",
    examId: "ai-900",
    topicId: "ai9-ml",
    prompt: "You want to predict the future selling price of a house given features like square footage and number of bedrooms. Which ML problem type is this?",
    choices: ["Classification", "Regression", "Clustering", "Reinforcement learning"],
    correctIndex: 1,
    explanation:
      "Predicting a continuous numeric value is regression. Classification predicts a category, clustering finds groups.",
    difficulty: "easy",
    tags: ["problem-types"],
  },
  {
    id: "q-ai9-ml-2",
    examId: "ai-900",
    topicId: "ai9-ml",
    prompt: "A model is built to label incoming emails as either 'spam' or 'not spam'. What kind of ML task is this?",
    choices: ["Regression", "Binary classification", "Clustering", "Anomaly detection"],
    correctIndex: 1,
    explanation:
      "Two discrete categories make this binary classification.",
    difficulty: "easy",
    tags: ["problem-types"],
  },
  {
    id: "q-ai9-ml-3",
    examId: "ai-900",
    topicId: "ai9-ml",
    prompt: "You want a model that automatically groups customers into segments without predefined labels, so marketing can target each group. Which approach fits?",
    choices: ["Supervised classification", "Supervised regression", "Unsupervised clustering", "Reinforcement learning"],
    correctIndex: 2,
    explanation:
      "No labels and the goal is to discover groups — that's clustering, an unsupervised technique.",
    difficulty: "easy",
    tags: ["problem-types"],
  },
  {
    id: "q-ai9-ml-4",
    examId: "ai-900",
    topicId: "ai9-ml",
    prompt: "In supervised learning, what is the role of labels in your training data?",
    choices: [
      "They are the inputs that the model uses to make predictions.",
      "They are the correct outputs the model is trying to learn to predict.",
      "They are metadata used only for filtering datasets.",
      "They are the output of clustering algorithms.",
    ],
    correctIndex: 1,
    explanation:
      "In supervised learning, labels are the correct outputs (the 'y') the model learns to predict from the features (the 'X').",
    difficulty: "easy",
    tags: ["supervised-vs-unsupervised"],
  },
  {
    id: "q-ai9-ml-5",
    examId: "ai-900",
    topicId: "ai9-ml",
    prompt: "Your medical screening model must minimize false negatives (missing a positive case). Which evaluation metric should you prioritize?",
    choices: ["Precision", "Recall", "Accuracy", "Mean Absolute Error"],
    correctIndex: 1,
    explanation:
      "Recall = TP / (TP+FN). Maximizing recall minimizes false negatives — exactly what a screening tool needs.",
    difficulty: "medium",
    tags: ["metrics"],
  },
  {
    id: "q-ai9-ml-6",
    examId: "ai-900",
    topicId: "ai9-ml",
    prompt: "A regression model produces an MAE of 5 and an RMSE of 12. What does this discrepancy suggest?",
    choices: [
      "The model is biased toward positive predictions.",
      "There are some predictions with very large errors driving up RMSE.",
      "The model underfits the data.",
      "The features are highly correlated.",
    ],
    correctIndex: 1,
    explanation:
      "RMSE squares errors before averaging, so a large gap between MAE and RMSE indicates a few outliers with big errors are dominating RMSE.",
    difficulty: "hard",
    tags: ["metrics"],
  },
  {
    id: "q-ai9-ml-7",
    examId: "ai-900",
    topicId: "ai9-ml",
    prompt: "A business analyst with no coding background needs to build a model to predict sales next quarter. Which Azure ML authoring surface is the best fit?",
    choices: ["Azure ML Notebooks", "Azure ML SDK in VS Code", "Automated ML", "Azure CLI"],
    correctIndex: 2,
    explanation:
      "Automated ML lets non-coders pick a dataset and target — Azure tries many algorithms and picks the best. The Designer (drag-and-drop) is also no-code, but AutoML is the fastest 'no expertise' path.",
    difficulty: "medium",
    tags: ["azure-ml"],
  },
  {
    id: "q-ai9-ml-8",
    examId: "ai-900",
    topicId: "ai9-ml",
    prompt: "Why do you split training data into train, validation, and test sets?",
    choices: [
      "To make training faster by using less data.",
      "So the model can be evaluated on data it hasn't seen during training.",
      "To allow the model to retrain itself automatically.",
      "Because Azure ML requires three datasets minimum.",
    ],
    correctIndex: 1,
    explanation:
      "Holding back data for validation and final test ensures you measure how the model generalizes — not how well it memorized the training set.",
    difficulty: "easy",
    tags: ["training-process"],
  },

  // ── Computer Vision ─────────────────────────────────────────────
  {
    id: "q-ai9-cv-1",
    examId: "ai-900",
    topicId: "ai9-cv",
    prompt: "You need to identify and locate every defective product on a factory line photo. Which task type does this require?",
    choices: ["Image classification", "Object detection", "OCR", "Semantic segmentation"],
    correctIndex: 1,
    explanation:
      "Object detection finds objects AND returns their bounding box locations — exactly what's needed to point at each defect.",
    difficulty: "easy",
    tags: ["vision-tasks"],
  },
  {
    id: "q-ai9-cv-2",
    examId: "ai-900",
    topicId: "ai9-cv",
    prompt: "A retail company wants to train a model that recognizes their unique product packaging. Their products are not in the pre-built Azure AI Vision categories. Which service should they use?",
    choices: ["Azure AI Vision (general)", "Custom Vision", "Document Intelligence", "Video Indexer"],
    correctIndex: 1,
    explanation:
      "Custom Vision is for training your own classifier or detector on domain-specific images.",
    difficulty: "medium",
    tags: ["custom-vision"],
  },
  {
    id: "q-ai9-cv-3",
    examId: "ai-900",
    topicId: "ai9-cv",
    prompt: "Which Azure AI service is best suited for extracting the total amount and tax from a scanned receipt PDF?",
    choices: ["Azure AI Vision (OCR only)", "Custom Vision", "Document Intelligence (pre-built receipt model)", "Azure AI Language"],
    correctIndex: 2,
    explanation:
      "Document Intelligence has pre-built models for receipts that return structured fields like merchant, total, and tax.",
    difficulty: "easy",
    tags: ["document-intelligence"],
  },
  {
    id: "q-ai9-cv-4",
    examId: "ai-900",
    topicId: "ai9-cv",
    prompt: "Microsoft retired several attributes from the Face service (such as emotion, age, and gender). Which Responsible AI consideration drove this decision?",
    choices: [
      "Cost reduction",
      "Accuracy degradation over time",
      "Risk of misuse for surveillance and stereotyping",
      "Lack of customer demand",
    ],
    correctIndex: 2,
    explanation:
      "Microsoft retired sensitive attributes for Responsible AI reasons — they could enable surveillance, stereotyping, or biased decisions.",
    difficulty: "medium",
    tags: ["face", "responsible-ai"],
  },
  {
    id: "q-ai9-cv-5",
    examId: "ai-900",
    topicId: "ai9-cv",
    prompt: "Which Azure service would you use to build a searchable index of insights (faces, transcripts, scenes) from a library of MP4 videos?",
    choices: ["Azure AI Vision", "Custom Vision", "Video Indexer", "Document Intelligence"],
    correctIndex: 2,
    explanation:
      "Video Indexer extracts insights from video — speakers, transcripts, faces, OCR, scene boundaries — and indexes them for search.",
    difficulty: "medium",
    tags: ["video"],
  },
  {
    id: "q-ai9-cv-6",
    examId: "ai-900",
    topicId: "ai9-cv",
    prompt: "What is the difference between image classification and object detection?",
    choices: [
      "Classification works on color images; detection works only on grayscale.",
      "Classification labels the whole image with one tag; detection labels and locates multiple objects with bounding boxes.",
      "Classification is unsupervised; detection is supervised.",
      "Classification uses CNNs; detection uses RNNs.",
    ],
    correctIndex: 1,
    explanation:
      "Classification gives one label for the entire image. Object detection finds multiple objects and returns each with a bounding box.",
    difficulty: "easy",
    tags: ["vision-tasks"],
  },

  // ── NLP ────────────────────────────────────────────────────────
  {
    id: "q-ai9-nlp-1",
    examId: "ai-900",
    topicId: "ai9-nlp",
    prompt: "Which Azure AI Language capability would you use to classify customer reviews as positive, neutral, or negative?",
    choices: ["Sentiment analysis", "Key phrase extraction", "Named entity recognition", "Language detection"],
    correctIndex: 0,
    explanation:
      "Sentiment analysis classifies text by emotional polarity — positive / neutral / negative.",
    difficulty: "easy",
    tags: ["language"],
  },
  {
    id: "q-ai9-nlp-2",
    examId: "ai-900",
    topicId: "ai9-nlp",
    prompt: "You're building a chatbot that needs to understand whether a user wants to 'book a flight' or 'cancel a flight' based on their message. Which Azure service is the best fit?",
    choices: ["Azure AI Language (sentiment)", "Conversational Language Understanding (CLU)", "Question Answering", "Translator"],
    correctIndex: 1,
    explanation:
      "CLU classifies user intent and extracts entities — perfect for routing 'book flight' vs 'cancel flight' utterances.",
    difficulty: "medium",
    tags: ["clu"],
  },
  {
    id: "q-ai9-nlp-3",
    examId: "ai-900",
    topicId: "ai9-nlp",
    prompt: "A company wants to turn their 200-page product FAQ into a chatbot that returns answers to user questions. Which service is the best fit?",
    choices: ["CLU", "Question Answering", "Sentiment analysis", "Custom Translator"],
    correctIndex: 1,
    explanation:
      "Question Answering ingests existing FAQ documents and turns them into a Q&A backend the bot can call.",
    difficulty: "medium",
    tags: ["question-answering"],
  },
  {
    id: "q-ai9-nlp-4",
    examId: "ai-900",
    topicId: "ai9-nlp",
    prompt: "Which Azure service would you use to convert a recorded meeting audio file into a written transcript?",
    choices: ["Translator", "Azure AI Language", "Speech-to-text", "Text-to-speech"],
    correctIndex: 2,
    explanation:
      "Speech-to-text (in the Speech service) transcribes audio into text. Text-to-speech is the opposite direction.",
    difficulty: "easy",
    tags: ["speech"],
  },
  {
    id: "q-ai9-nlp-5",
    examId: "ai-900",
    topicId: "ai9-nlp",
    prompt: "A global news site wants to translate articles into 20 languages while preserving formatting like headings and bold text. Which Translator capability fits?",
    choices: ["Real-time text translation", "Document Translation", "Speech translation", "Custom Translator"],
    correctIndex: 1,
    explanation:
      "Document Translation translates Word, PowerPoint, PDF and similar files while preserving their formatting.",
    difficulty: "medium",
    tags: ["translator"],
  },
  {
    id: "q-ai9-nlp-6",
    examId: "ai-900",
    topicId: "ai9-nlp",
    prompt: "Which legacy Microsoft service has been replaced by Conversational Language Understanding (CLU)?",
    choices: ["LUIS (Language Understanding Intelligent Service)", "QnA Maker", "Bing Search", "Form Recognizer"],
    correctIndex: 0,
    explanation:
      "CLU is the modern replacement for LUIS. QnA Maker was replaced by Question Answering. Form Recognizer became Document Intelligence.",
    difficulty: "easy",
    tags: ["service-renames"],
  },
  {
    id: "q-ai9-nlp-7",
    examId: "ai-900",
    topicId: "ai9-nlp",
    prompt: "A customer support team wants to automatically pull people, organizations, and dates out of incoming support emails. Which capability fits?",
    choices: ["Sentiment analysis", "Named entity recognition (NER)", "Key phrase extraction", "Language detection"],
    correctIndex: 1,
    explanation:
      "NER extracts entities like person, organization, location, date, and quantity from text.",
    difficulty: "easy",
    tags: ["language", "ner"],
  },

  // ── Generative AI ──────────────────────────────────────────────
  {
    id: "q-ai9-genai-1",
    examId: "ai-900",
    topicId: "ai9-genai",
    prompt: "A large language model (LLM) generates a confident answer to a factual question, but the answer is wrong. What is this phenomenon called?",
    choices: ["Bias", "Drift", "Hallucination", "Overfitting"],
    correctIndex: 2,
    explanation:
      "A hallucination is a confident but incorrect output from a generative model — the #1 risk in production LLM use.",
    difficulty: "easy",
    tags: ["risks"],
  },
  {
    id: "q-ai9-genai-2",
    examId: "ai-900",
    topicId: "ai9-genai",
    prompt: "Which technique reduces hallucinations by retrieving relevant documents and injecting them into the prompt as context?",
    choices: ["Fine-tuning", "Few-shot prompting", "Retrieval-Augmented Generation (RAG)", "Reinforcement learning"],
    correctIndex: 2,
    explanation:
      "RAG retrieves relevant context (often via vector search) and grounds the LLM's response in real documents, reducing hallucination.",
    difficulty: "medium",
    tags: ["rag"],
  },
  {
    id: "q-ai9-genai-3",
    examId: "ai-900",
    topicId: "ai9-genai",
    prompt: "Which Azure service hosts OpenAI models like GPT-4 with enterprise governance, data residency, and a guarantee that your prompts are not used to train OpenAI's models?",
    choices: ["Azure AI Vision", "Azure OpenAI Service", "Azure Cognitive Search", "Microsoft Copilot Studio"],
    correctIndex: 1,
    explanation:
      "Azure OpenAI Service hosts OpenAI models inside Azure with enterprise governance — your data stays yours.",
    difficulty: "easy",
    tags: ["azure-openai"],
  },
  {
    id: "q-ai9-genai-4",
    examId: "ai-900",
    topicId: "ai9-genai",
    prompt: "Which Microsoft Copilot product is grounded in your organization's data — emails, files, meetings — through Microsoft Graph?",
    choices: ["GitHub Copilot", "Microsoft 365 Copilot", "Copilot for Security", "Microsoft Copilot (consumer)"],
    correctIndex: 1,
    explanation:
      "Microsoft 365 Copilot grounds in your tenant's Microsoft Graph data — that's the differentiator from consumer Copilot.",
    difficulty: "medium",
    tags: ["copilot"],
  },
  {
    id: "q-ai9-genai-5",
    examId: "ai-900",
    topicId: "ai9-genai",
    prompt: "In a chat-style LLM prompt, what is the purpose of the 'system' message?",
    choices: [
      "It records what the user has said previously.",
      "It sets the model's role, behavior, tone, or constraints.",
      "It contains the LLM's response.",
      "It logs API usage for billing.",
    ],
    correctIndex: 1,
    explanation:
      "The system message sets the model's persona, tone, and rules. The user message is the user's input; the assistant message is the response.",
    difficulty: "easy",
    tags: ["prompting"],
  },
  {
    id: "q-ai9-genai-6",
    examId: "ai-900",
    topicId: "ai9-genai",
    prompt: "What is a 'token' in the context of an LLM?",
    choices: [
      "A user authentication credential.",
      "A unit of text — roughly 3-4 characters or about three-quarters of an English word.",
      "A neural network layer.",
      "A file format for model weights.",
    ],
    correctIndex: 1,
    explanation:
      "A token is the basic unit an LLM processes — roughly ¾ of an English word. Pricing and context windows are measured in tokens.",
    difficulty: "easy",
    tags: ["tokens"],
  },
  {
    id: "q-ai9-genai-7",
    examId: "ai-900",
    topicId: "ai9-genai",
    prompt: "An attacker hides instructions inside a document the LLM is asked to summarize, hoping to override the system prompt. What is this attack called?",
    choices: ["Hallucination", "Prompt injection", "Model drift", "Data poisoning"],
    correctIndex: 1,
    explanation:
      "Prompt injection is when adversarial content in user input attempts to override or manipulate the system instructions.",
    difficulty: "medium",
    tags: ["risks"],
  },
  {
    id: "q-ai9-genai-8",
    examId: "ai-900",
    topicId: "ai9-genai",
    prompt: "Which Azure service screens prompts and model responses for harmful content categories like hate, violence, sexual, and self-harm?",
    choices: ["Azure AI Content Safety", "Azure AI Vision", "Azure Sentinel", "Microsoft Purview"],
    correctIndex: 0,
    explanation:
      "Azure AI Content Safety filters input and output for harmful content categories — the standard generative AI guardrail.",
    difficulty: "medium",
    tags: ["content-safety"],
  },
  {
    id: "q-ai9-genai-9",
    examId: "ai-900",
    topicId: "ai9-genai",
    prompt: "You want deterministic, near-identical output every time you call the model with the same prompt. Which parameter setting helps?",
    choices: ["Temperature 0", "Temperature 1", "Top-p 1", "Increased max tokens"],
    correctIndex: 0,
    explanation:
      "Temperature 0 makes the model pick the highest-probability next token at every step — near-deterministic output.",
    difficulty: "medium",
    tags: ["prompting"],
  },
  {
    id: "q-ai9-genai-10",
    examId: "ai-900",
    topicId: "ai9-genai",
    prompt: "Which Microsoft product allows non-developers to build their own custom AI assistants (Copilots) with low-code tools?",
    choices: ["GitHub Copilot", "Copilot Studio", "Azure OpenAI Service", "Power BI"],
    correctIndex: 1,
    explanation:
      "Copilot Studio is the low-code tool for building custom Copilot agents grounded in your own data and connectors.",
    difficulty: "medium",
    tags: ["copilot"],
  },
];

// ─────────────────────────────────────────────────────────────────
// DIAGNOSTIC SET — 8 questions spanning all 5 domains
// ─────────────────────────────────────────────────────────────────

export const AI900_DIAGNOSTIC = [
  "q-ai9-w-1",
  "q-ai9-w-3",
  "q-ai9-ml-1",
  "q-ai9-ml-5",
  "q-ai9-cv-2",
  "q-ai9-nlp-2",
  "q-ai9-genai-1",
  "q-ai9-genai-3",
];

// ─────────────────────────────────────────────────────────────────
// LESSONS
// ─────────────────────────────────────────────────────────────────

export const AI900_LESSONS: Lesson[] = [
  // ── Workloads ────────────────────────────────────────────────
  {
    id: "l-ai9-w-1",
    topicId: "ai9-workloads",
    order: 1,
    title: "What counts as 'AI'?",
    summary:
      "The 7 workload categories Microsoft uses, and how to recognize which one a scenario describes.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Start with the categories",
        body:
          "Before you can map scenarios to Azure services, you need the vocabulary Microsoft uses. There are 7 AI workload categories. Memorize them — every scenario question maps to one.",
      },
      {
        kind: "concept",
        title: "The 7 workload categories",
        body:
          "If a scenario doesn't fit one of these, it probably isn't AI on the AI-900 exam.",
        bullets: [
          "Prediction / forecasting — predict a number from inputs.",
          "Anomaly detection — flag the unusual.",
          "Computer vision — interpret images and video.",
          "Natural language processing — understand text and speech.",
          "Knowledge mining — make sense of unstructured corpora.",
          "Document intelligence — extract specific fields from forms.",
          "Generative AI — produce new content (text, images, code).",
        ],
      },
      {
        kind: "tip",
        title: "Watch for trap words",
        body:
          "'Detect unusual' = anomaly detection, not classification. 'Extract fields from a form' = document intelligence, not OCR. 'Search across PDFs and audio' = knowledge mining, not document intelligence.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Every AI scenario on the exam maps to one of 7 categories. Pattern-match the scenario; pick the category.",
      },
    ],
  },
  {
    id: "l-ai9-w-2",
    topicId: "ai9-workloads",
    order: 2,
    title: "The 6 Responsible AI principles",
    summary:
      "Microsoft's Responsible AI standard. Memorize these — they appear in every exam.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "Why Responsible AI matters on the exam",
        body:
          "Several questions describe an AI failure and ask which principle was violated. The wrong answers are usually almost-right rephrasings of another principle. Precise definitions matter.",
      },
      {
        kind: "concept",
        title: "The six principles",
        bullets: [
          "Fairness — no group is unfairly disadvantaged.",
          "Reliability & Safety — consistent, safe behavior under expected conditions.",
          "Privacy & Security — protect personal data and resist tampering.",
          "Inclusiveness — empower everyone, especially under-served groups.",
          "Transparency — users understand what the system does and its limits.",
          "Accountability — humans (not AI) are responsible.",
        ],
      },
      {
        kind: "comparison",
        title: "The pairs people confuse",
        body:
          "Fairness is about *outputs* (the model's decisions). Inclusiveness is about *access* (can everyone use it?). Transparency is what the system does. Accountability is who answers for it.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Six principles. Different problems, different mitigations. Memorize the differences — that's what the exam tests.",
      },
    ],
  },

  // ── ML Fundamentals ─────────────────────────────────────────────
  {
    id: "l-ai9-ml-1",
    topicId: "ai9-ml",
    order: 1,
    title: "Supervised, unsupervised, and the three problem types",
    summary:
      "The vocabulary that everything in this domain rests on. Get this right and the rest is pattern matching.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "First decision: do you have labels?",
        body:
          "Supervised learning = your training data has correct answers (labels). Unsupervised = no labels, the model finds structure. Almost everything else flows from this.",
      },
      {
        kind: "concept",
        title: "Three problem types",
        bullets: [
          "Regression — predict a number (price, demand, temperature).",
          "Classification — predict a category (spam / not-spam, dog / cat).",
          "Clustering — group similar items without predefined labels.",
        ],
      },
      {
        kind: "comparison",
        title: "Regression vs Classification — the litmus test",
        body:
          "If the answer is a number on a continuous scale → regression. If the answer is a discrete category → classification. 'Will the customer buy?' is classification. 'How much will the customer spend?' is regression.",
      },
      {
        kind: "tip",
        title: "Clustering is unsupervised",
        body:
          "If a scenario says 'group customers without predefined categories,' that's clustering — and it's unsupervised. If categories are pre-defined, you're back to supervised classification.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Supervised + numbers = regression. Supervised + categories = classification. Unsupervised + groups = clustering.",
      },
    ],
  },
  {
    id: "l-ai9-ml-2",
    topicId: "ai9-ml",
    order: 2,
    title: "Evaluation metrics that the exam loves",
    summary:
      "Precision, recall, MAE, RMSE — when each matters and what the answer pattern looks like.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Classification — the confusion matrix family",
        bullets: [
          "Accuracy = (TP+TN)/total. Use when classes are balanced.",
          "Precision = TP/(TP+FP). Use when false positives are expensive.",
          "Recall = TP/(TP+FN). Use when false negatives are expensive.",
          "F1 = balance of precision and recall.",
        ],
      },
      {
        kind: "example",
        title: "Spam vs cancer",
        body:
          "Spam filter: prioritize precision (don't put real mail in spam). Cancer screening: prioritize recall (don't miss any cases). Same metrics — opposite priorities driven by which error costs more.",
      },
      {
        kind: "concept",
        title: "Regression metrics",
        bullets: [
          "MAE — average absolute error.",
          "RMSE — same as MAE but squares errors first, so big errors hurt more.",
          "R² — variance explained, closer to 1 is better.",
        ],
      },
      {
        kind: "tip",
        title: "If RMSE >> MAE",
        body:
          "A big gap between RMSE and MAE means a few outliers with large errors are dominating RMSE. Investigate them.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Metric choice should reflect cost of error. The exam tests this with scenario stems.",
      },
    ],
  },
  {
    id: "l-ai9-ml-3",
    topicId: "ai9-ml",
    order: 3,
    title: "Azure ML — three ways to build a model",
    summary:
      "AutoML, Designer, and Notebooks. Know which is which and when each fits.",
    minutes: 4,
    cards: [
      {
        kind: "comparison",
        title: "Three authoring surfaces",
        table: {
          columns: ["Surface", "Audience", "Effort"],
          rows: [
            { label: "Automated ML", cells: ["Citizen data scientists", "Lowest — pick data + target"] },
            { label: "Designer", cells: ["Visual builders", "Low — drag-and-drop pipeline"] },
            { label: "Notebooks (SDK)", cells: ["Data scientists", "Highest — full Python control"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "AutoML when you can",
        body:
          "If a scenario says 'business analyst,' 'no coding,' or 'pick the best algorithm automatically' — answer is AutoML.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "AutoML = easiest. Designer = visual. Notebooks = full control. Match audience to surface.",
      },
    ],
  },

  // ── Computer Vision ─────────────────────────────────────────────
  {
    id: "l-ai9-cv-1",
    topicId: "ai9-cv",
    order: 1,
    title: "Vision tasks — classify, detect, segment, OCR",
    summary:
      "Four shapes of vision problems. Each one maps to a different Azure service.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "The four task shapes",
        bullets: [
          "Image classification — one label for the whole image.",
          "Object detection — labels + bounding boxes for multiple objects.",
          "Semantic segmentation — a label for every pixel.",
          "OCR — text strings + locations from images.",
        ],
      },
      {
        kind: "comparison",
        title: "Classification vs detection",
        body:
          "Classification: 'is there a cat in this image?' returns 'yes/no' or 'cat'. Detection: 'where are all the cats?' returns boxes around each cat. The 'where' is the difference.",
      },
      {
        kind: "tip",
        title: "OCR question hints",
        body:
          "'Read text from a sign / receipt / handwritten note' → OCR. The Read API in Azure AI Vision handles printed and handwritten text in 100+ languages.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Recognize the shape (classify / detect / segment / OCR), then pick the service.",
      },
    ],
  },
  {
    id: "l-ai9-cv-2",
    topicId: "ai9-cv",
    order: 2,
    title: "Azure Vision services — which one when",
    summary:
      "Azure AI Vision, Custom Vision, Document Intelligence, Face, Video Indexer.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "Service map",
        table: {
          columns: ["Service", "Use it for"],
          rows: [
            { label: "Azure AI Vision", cells: ["General pre-built vision (image analysis, OCR, smart crop)"] },
            { label: "Custom Vision", cells: ["Train your own classifier or detector on domain images"] },
            { label: "Document Intelligence", cells: ["Extract structured fields from forms (invoices, receipts, IDs)"] },
            { label: "Face", cells: ["Detect, verify, identify faces (limited access for some features)"] },
            { label: "Video Indexer", cells: ["Insights from video — faces, transcripts, scenes"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Pre-built vs custom",
        body:
          "If pre-built categories work → Azure AI Vision. If you need your own categories → Custom Vision.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Memorize the service-to-task map. The exam tests recognition, not configuration.",
      },
    ],
  },

  // ── NLP ────────────────────────────────────────────────────────
  {
    id: "l-ai9-nlp-1",
    topicId: "ai9-nlp",
    order: 1,
    title: "Azure AI Language — what's inside",
    summary:
      "Sentiment, entities, key phrases, language detection, summarization, PII. Five capabilities, one service.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "Capabilities at a glance",
        bullets: [
          "Sentiment analysis — positive / neutral / negative.",
          "Key phrase extraction — main topics from text.",
          "Named entity recognition — person, place, org, date.",
          "Language detection — which language is this text?",
          "PII detection — find sensitive info to redact.",
          "Summarization — extractive or abstractive.",
        ],
      },
      {
        kind: "tip",
        title: "Easy mapping",
        body:
          "If the scenario says 'analyze text' and the answer is one of the bullets above, the service is Azure AI Language.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Azure AI Language = the text-analytics umbrella. Different capabilities, same service.",
      },
    ],
  },
  {
    id: "l-ai9-nlp-2",
    topicId: "ai9-nlp",
    order: 2,
    title: "CLU vs Question Answering vs Translator vs Speech",
    summary:
      "How to tell apart the conversational, knowledge, translation, and speech services.",
    minutes: 5,
    cards: [
      {
        kind: "comparison",
        title: "Match scenario to service",
        table: {
          columns: ["Scenario", "Service"],
          rows: [
            { label: "Understand user intent ('book flight')", cells: ["Conversational Language Understanding"] },
            { label: "Answer FAQ questions from existing docs", cells: ["Question Answering"] },
            { label: "Translate text or documents", cells: ["Translator"] },
            { label: "Transcribe audio", cells: ["Speech-to-text"] },
            { label: "Read text aloud", cells: ["Text-to-speech"] },
            { label: "Host the bot", cells: ["Azure AI Bot Service"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Watch for the rebrands",
        body:
          "LUIS → CLU. QnA Maker → Question Answering. Form Recognizer → Document Intelligence. The exam may use either name.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Six services, six clear use cases. Memorize the scenario-to-service map.",
      },
    ],
  },

  // ── Generative AI ──────────────────────────────────────────────
  {
    id: "l-ai9-genai-1",
    topicId: "ai9-genai",
    order: 1,
    title: "What an LLM actually does",
    summary:
      "LLMs predict the next token. That's it. The implications matter for everything else in this domain.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "Demystifying the magic",
        body:
          "A Large Language Model takes input tokens and predicts the next most-likely token. Then the next. Then the next. It's not retrieving facts — it's generating plausible continuations.",
      },
      {
        kind: "concept",
        title: "Why this matters",
        bullets: [
          "Hallucination — the model makes things up because it's predicting plausibility, not truth.",
          "Context window — there's a max number of tokens it can handle in one call.",
          "Tokens ≠ words — a token is roughly ¾ of an English word.",
          "Temperature — controls how random the next-token pick is. 0 = deterministic.",
        ],
      },
      {
        kind: "tip",
        title: "Tokens drive cost and limits",
        body:
          "Pricing is per 1,000 tokens. Context windows are measured in tokens (e.g., 128k). Always think tokens, not words.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "LLMs predict tokens. They hallucinate when uncertain. Tokens drive cost and limits.",
      },
    ],
  },
  {
    id: "l-ai9-genai-2",
    topicId: "ai9-genai",
    order: 2,
    title: "Prompt engineering — system, user, assistant",
    summary:
      "Modern chat LLMs use three roles. Knowing each is foundational.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "The three roles",
        table: {
          columns: ["Role", "Purpose"],
          rows: [
            { label: "System", cells: ["Sets behavior, tone, constraints"] },
            { label: "User", cells: ["The user's request"] },
            { label: "Assistant", cells: ["The model's response (also fed back as history)"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Better prompts",
        body:
          "Be specific. Show examples (few-shot). Specify output format. Constrain length and tone. Decompose complex tasks.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "System sets the rules. User asks. Assistant answers. Each role has a job.",
      },
    ],
  },
  {
    id: "l-ai9-genai-3",
    topicId: "ai9-genai",
    order: 3,
    title: "Azure OpenAI vs Copilot vs Copilot Studio",
    summary:
      "Three Microsoft generative AI products with overlapping names. Know the differences.",
    minutes: 5,
    cards: [
      {
        kind: "comparison",
        title: "Three Microsoft generative-AI surfaces",
        table: {
          columns: ["Product", "Audience", "Differentiator"],
          rows: [
            { label: "Azure OpenAI Service", cells: ["Developers", "Run OpenAI models with enterprise governance and your own apps"] },
            { label: "Microsoft 365 Copilot", cells: ["Enterprise users", "Embedded in Word/Excel/Teams, grounded in your Microsoft Graph data"] },
            { label: "Copilot Studio", cells: ["Citizen developers", "Low-code builder for custom Copilot agents"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Identify by question stems",
        body:
          "'API for OpenAI models inside Azure' → Azure OpenAI. 'AI in my Word and Excel' → M365 Copilot. 'Build my own AI assistant without code' → Copilot Studio.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Three products. Three audiences. Three jobs. Don't mix them up.",
      },
    ],
  },
  {
    id: "l-ai9-genai-4",
    topicId: "ai9-genai",
    order: 4,
    title: "RAG and Responsible AI for generative",
    summary:
      "Why RAG matters, what prompt injection is, how content safety works.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Retrieval-Augmented Generation (RAG)",
        body:
          "Retrieve relevant documents from your data, inject them into the prompt as context, then have the LLM answer with citations. Reduces hallucinations and grounds answers in YOUR data.",
        bullets: [
          "Step 1: User asks.",
          "Step 2: Retrieve relevant chunks (often from Azure AI Search using vector similarity).",
          "Step 3: Inject context into the prompt.",
          "Step 4: LLM answers, citing sources.",
        ],
      },
      {
        kind: "concept",
        title: "Generative-AI-specific risks",
        bullets: [
          "Hallucination — confident but false output. Mitigate with RAG and citations.",
          "Prompt injection — adversarial input that overrides system rules. Mitigate with input validation and Content Safety.",
          "Harmful content — block via Azure AI Content Safety filters (hate, violence, sexual, self-harm).",
          "Privacy leakage — model surfaces training-data PII. Mitigate with data filtering and CMK.",
          "Copyright — Microsoft offers Copilot Copyright Commitment for indemnification.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "RAG reduces hallucination by grounding in your data. Content Safety filters harm. Each risk has a mitigation — know which.",
      },
    ],
  },
];
