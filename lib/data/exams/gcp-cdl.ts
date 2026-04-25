import type { Lesson, Question, Topic } from "../../types";

// ─────────────────────────────────────────────────────────────────
// Google Cloud Digital Leader (CDL) — entry-level GCP cert.
// Business + tech audience. $99, 90 min, 50-60 multiple-choice.
// ─────────────────────────────────────────────────────────────────

export const GCP_CDL_TOPICS: Topic[] = [
  {
    id: "cdl-transformation",
    examId: "gcp-cdl",
    name: "Digital Transformation with Google Cloud",
    shortName: "Transformation",
    weight: 0.10,
    summary:
      "Why organizations move to the cloud, the business value Google Cloud emphasizes, and the strategic frameworks Google sells (cloud transformation, data transformation).",
    subtopics: [
      "What digital transformation means and why it matters",
      "Cloud computing essentials (NIST 5 characteristics)",
      "Cloud deployment models: public, private, hybrid, multi-cloud",
      "Cloud service models: IaaS, PaaS, SaaS",
      "Google Cloud's value pillars: open, scalable, data-first, sustainable",
      "TCO and CapEx vs OpEx",
      "Cloud transformation phases (assess, plan, build, migrate, operate, optimize)",
    ],
    keyFacts: [
      "Cloud computing essentials (NIST): on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service.",
      "IaaS = VMs (Compute Engine). PaaS = managed runtime (App Engine, Cloud Run). SaaS = packaged software (Workspace).",
      "TCO = total cost of ownership (hardware + power + cooling + staff + opportunity).",
      "CapEx = upfront capital. OpEx = ongoing operational. Cloud is fundamentally OpEx.",
      "Google Cloud emphasizes open (multi-cloud, open source friendly) and sustainable (carbon-neutral since 2007, 24/7 carbon-free energy goal).",
    ],
    cramSheet: [
      "Public / Private / Hybrid / Multi-cloud — know each.",
      "IaaS / PaaS / SaaS — increasing abstraction.",
      "TCO compares cloud to on-prem total costs.",
      "Cloud = OpEx model.",
      "Google's pillars: open, scalable, data-first, sustainable.",
    ],
    review: {
      examWeight: "10% of the exam (smallest domain)",
      overview:
        "The smallest domain. It's vocabulary and Google's positioning. Memorize the cloud essentials (5 NIST characteristics), service models (IaaS/PaaS/SaaS), and deployment models (public/private/hybrid/multi-cloud). Google's sustainability story shows up reliably — they were the first major cloud provider to claim carbon neutrality (2007) and aim for 24/7 carbon-free energy by 2030.",
      sections: [
        {
          heading: "Cloud essentials — the 5 characteristics",
          bullets: [
            "On-demand self-service — provision without human intervention.",
            "Broad network access — reachable over standard networks.",
            "Resource pooling — multi-tenant; shared underlying resources.",
            "Rapid elasticity — scale out and back automatically.",
            "Measured service — metered billing.",
          ],
        },
        {
          heading: "Deployment models",
          bullets: [
            "Public — shared infrastructure (Google Cloud, AWS, Azure).",
            "Private — single-tenant, on-prem or hosted.",
            "Hybrid — combination of public + private; data and apps move between.",
            "Multi-cloud — using two or more public providers (e.g., GCP + AWS).",
          ],
        },
        {
          heading: "Service models",
          table: {
            columns: ["Model", "GCP example", "What you manage"],
            rows: [
              { label: "IaaS", cells: ["Compute Engine VMs", "OS, runtime, apps, data"] },
              { label: "PaaS", cells: ["App Engine, Cloud Run", "Apps, data"] },
              { label: "SaaS", cells: ["Google Workspace", "Data + identities only"] },
            ],
          },
        },
        {
          heading: "Google Cloud's value pillars",
          bullets: [
            "Open — open-source friendly (Kubernetes, TensorFlow, Anthos for multi-cloud).",
            "Scalable — global network, per-second billing, autoscaling.",
            "Data-first — BigQuery and AI/ML positioned as differentiators.",
            "Sustainable — carbon-neutral since 2007, targeting 24/7 carbon-free energy by 2030.",
            "Secure-by-default — Titan security chip, BeyondCorp Zero Trust, encryption everywhere.",
          ],
        },
        {
          heading: "Cloud transformation phases",
          bullets: [
            "Assess — current state, workloads, dependencies.",
            "Plan — target architecture, migration approach.",
            "Build — landing zone, networking, IAM, security baseline.",
            "Migrate — move workloads using one of the 6 Rs (rehost, replatform, refactor, repurchase, retire, retain).",
            "Operate — run in cloud with new processes.",
            "Optimize — cost, performance, security continuously.",
          ],
        },
        {
          heading: "TCO and economic model",
          bullets: [
            "TCO compares cloud spend to all on-prem costs (hardware + power + cooling + staff + opportunity).",
            "Cloud shifts CapEx → OpEx.",
            "Per-second billing on Compute Engine (after first minute).",
            "Sustained-use discounts and committed-use discounts reduce cost without upfront commitment.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Hybrid vs Multi-cloud",
          explanation:
            "Hybrid = public + private (often connecting on-prem to one cloud). Multi-cloud = two or more public clouds (e.g., GCP + AWS). The exam loves to swap these as distractors.",
        },
        {
          confusion: "IaaS vs PaaS",
          explanation:
            "If you manage the OS, it's IaaS. If the platform manages the OS and runtime, it's PaaS. Compute Engine VMs = IaaS. App Engine and Cloud Run = PaaS.",
        },
        {
          confusion: "CapEx vs OpEx",
          explanation:
            "CapEx = buy assets upfront. OpEx = pay as you use. Cloud is OpEx.",
        },
        {
          confusion: "Sustained vs Committed use discounts",
          explanation:
            "Sustained-use is automatic if you run an instance for a large portion of the month. Committed-use requires a 1-3 year commitment for a deeper discount.",
        },
      ],
      examTips: [
        "'Pay only for what you use, no upfront' → OpEx.",
        "'Compare on-prem cost to cloud cost' → TCO.",
        "'On-prem datacenter connected to cloud' → hybrid.",
        "'GCP + AWS for redundancy' → multi-cloud.",
        "'No OS to patch' → PaaS or SaaS.",
        "'Carbon-neutral cloud since 2007' → Google Cloud.",
        "'Lift-and-shift VM migration' → rehost.",
      ],
    },
  },
  {
    id: "cdl-data-ai",
    examId: "gcp-cdl",
    name: "Innovation with Data, ML and AI",
    shortName: "Data & AI",
    weight: 0.30,
    summary:
      "Google Cloud's data platform (BigQuery, Looker, Pub/Sub, Dataflow), AI/ML services (Vertex AI), and the AI products (Gemini, Duet AI, Document AI, Contact Center AI).",
    subtopics: [
      "Data lifecycle: ingest, store, process, analyze, visualize",
      "BigQuery — serverless data warehouse",
      "Cloud Storage — object storage with classes (Standard, Nearline, Coldline, Archive)",
      "Cloud SQL, Spanner, Firestore, Bigtable — when to use which",
      "Pub/Sub — messaging / event ingest",
      "Dataflow — stream and batch processing",
      "Looker / Looker Studio — BI and dashboards",
      "Vertex AI — unified ML platform (training, deployment, AutoML, generative AI)",
      "Gemini family models",
      "Pre-built AI APIs: Vision, Translation, Speech-to-Text, Text-to-Speech, Natural Language",
      "Document AI for forms / contracts",
      "Contact Center AI",
    ],
    keyFacts: [
      "BigQuery is serverless, separates storage from compute, scales to petabytes, supports SQL.",
      "Cloud Storage classes: Standard (hot), Nearline (>30 days access), Coldline (>90 days), Archive (>365 days). Cheaper storage = higher access cost.",
      "Spanner is globally distributed relational DB with strong consistency.",
      "Firestore is NoSQL document DB with mobile/web sync.",
      "Bigtable is wide-column NoSQL for IoT, time series, ad tech (low-latency, high-throughput).",
      "Pub/Sub is the global messaging backbone — millions of events per second.",
      "Dataflow runs both stream and batch (Apache Beam under the hood).",
      "Vertex AI unifies AutoML, custom training, model deployment, and generative AI in one platform.",
      "Gemini is Google's flagship multimodal foundation model (text + image + video + code).",
    ],
    cramSheet: [
      "BigQuery = serverless analytics warehouse, SQL.",
      "Cloud Storage classes: Standard / Nearline / Coldline / Archive.",
      "Cloud SQL = managed MySQL/Postgres/SQL Server. Spanner = global SQL. Firestore = doc NoSQL. Bigtable = wide-column NoSQL.",
      "Pub/Sub = messaging. Dataflow = stream+batch processing.",
      "Vertex AI = unified ML platform.",
      "Gemini = multimodal foundation model family.",
      "Pre-built APIs: Vision, Translation, Speech, Natural Language, Document AI, Video Intelligence.",
    ],
    review: {
      examWeight: "30% of the exam — tied for biggest",
      overview:
        "This domain is service mapping again. You need to know which database fits which scenario (Cloud SQL vs Spanner vs Firestore vs Bigtable), which storage class fits which access pattern, and how Pub/Sub + Dataflow + BigQuery form the standard streaming-analytics pipeline. Vertex AI is the umbrella for all ML work; Gemini is the flagship FM. Memorize the pre-built AI APIs and which task each handles.",
      sections: [
        {
          heading: "Database — pick the right one",
          table: {
            columns: ["Service", "Type", "Best for"],
            rows: [
              { label: "Cloud SQL", cells: ["Managed RDBMS", "Standard MySQL / Postgres / SQL Server, regional"] },
              { label: "Cloud Spanner", cells: ["Global RDBMS", "Globally distributed, strong consistency, horizontal scaling"] },
              { label: "AlloyDB", cells: ["Postgres-compatible", "Postgres at higher performance for analytical workloads"] },
              { label: "Firestore", cells: ["Document NoSQL", "Mobile/web with real-time sync, serverless"] },
              { label: "Bigtable", cells: ["Wide-column NoSQL", "IoT, time series, ad tech — low latency, high throughput"] },
              { label: "Memorystore", cells: ["In-memory cache", "Redis / Memcached"] },
              { label: "BigQuery", cells: ["Analytics warehouse", "Petabyte-scale SQL analytics"] },
            ],
          },
        },
        {
          heading: "Cloud Storage classes",
          table: {
            columns: ["Class", "Min duration", "Use case"],
            rows: [
              { label: "Standard", cells: ["None", "Frequent access, hot data"] },
              { label: "Nearline", cells: ["30 days", "Accessed monthly"] },
              { label: "Coldline", cells: ["90 days", "Accessed quarterly"] },
              { label: "Archive", cells: ["365 days", "Long-term backup, compliance"] },
            ],
          },
        },
        {
          heading: "BigQuery — the analytics centerpiece",
          bullets: [
            "Serverless — no clusters to manage.",
            "Separates storage and compute (compute scales independently).",
            "SQL interface (Standard SQL).",
            "Supports federated queries across Cloud Storage, Spanner, Bigtable.",
            "ML in BigQuery (BigQuery ML) lets you train models with SQL.",
            "Streaming inserts for near-real-time analytics.",
            "Per-query pricing (on-demand) or capacity-based (slots/reservations).",
          ],
        },
        {
          heading: "Streaming pipeline pattern",
          body:
            "The canonical Google Cloud streaming pipeline: source → Pub/Sub → Dataflow → BigQuery (or Bigtable) → Looker.",
          bullets: [
            "Pub/Sub — global, durable, async messaging. Decouples producer from consumer.",
            "Dataflow — stream and batch processing on Apache Beam. Auto-scales.",
            "BigQuery — query the processed data. Looker visualizes.",
          ],
        },
        {
          heading: "Vertex AI — unified ML platform",
          bullets: [
            "AutoML — train high-quality models with minimal code.",
            "Custom training — bring your own framework (TensorFlow, PyTorch, sklearn).",
            "Model Garden — pre-trained Google + open-source models including Gemini, PaLM, Llama.",
            "Generative AI Studio — prompt design, fine-tuning, deployment for FMs.",
            "Pipelines — orchestrate ML workflows.",
            "Feature Store — managed features for training and serving.",
            "Endpoints — online prediction with autoscaling.",
            "Explainable AI — feature attributions.",
          ],
        },
        {
          heading: "Pre-built AI APIs",
          table: {
            columns: ["API", "Use case"],
            rows: [
              { label: "Vision API", cells: ["Image classification, object detection, OCR"] },
              { label: "Video Intelligence", cells: ["Label, shot detection, OCR in video"] },
              { label: "Translation", cells: ["100+ language neural translation"] },
              { label: "Speech-to-Text", cells: ["Audio transcription"] },
              { label: "Text-to-Speech", cells: ["Natural neural voices"] },
              { label: "Natural Language", cells: ["Sentiment, entities, syntax, classification"] },
              { label: "Document AI", cells: ["Extract structured data from forms, invoices, contracts"] },
              { label: "Contact Center AI (CCAI)", cells: ["Virtual agents, agent assist, conversational insights"] },
              { label: "Recommendations AI", cells: ["Personalized product recommendations"] },
            ],
          },
        },
        {
          heading: "Gemini and generative AI",
          bullets: [
            "Gemini — Google's flagship multimodal foundation model family.",
            "Gemini 1.5 Pro — 2M-token context, multimodal (text + image + audio + video).",
            "Gemini Nano — on-device.",
            "Vertex AI Studio — develop with Gemini and other FMs.",
            "Gemini for Google Cloud — assistant in the console (formerly Duet AI).",
            "Gemini for Google Workspace — assistant in Gmail, Docs, Sheets, Slides, Meet.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Cloud SQL vs Spanner",
          explanation:
            "Cloud SQL is managed regional RDBMS (MySQL/Postgres/SQL Server). Spanner is globally distributed, strongly consistent, horizontally scalable. Pick Spanner only when you need global scale or strong consistency at scale.",
        },
        {
          confusion: "Firestore vs Bigtable",
          explanation:
            "Firestore is document NoSQL with real-time sync (good for mobile/web). Bigtable is wide-column NoSQL for high-throughput, low-latency workloads (IoT, time series, ad tech). Different access patterns.",
        },
        {
          confusion: "Pub/Sub vs Dataflow",
          explanation:
            "Pub/Sub is messaging/event delivery. Dataflow is the processing engine that consumes from Pub/Sub and transforms into BigQuery (or another sink).",
        },
        {
          confusion: "BigQuery vs traditional warehouse",
          explanation:
            "BigQuery is fully serverless — no clusters, no nodes to manage. Storage and compute scale independently. Pricing is per-query (on-demand) or per-slot (capacity).",
        },
        {
          confusion: "Coldline vs Archive",
          explanation:
            "Coldline = accessed at most quarterly (90-day minimum). Archive = accessed at most yearly (365-day minimum). Archive is cheaper to store, more expensive to retrieve.",
        },
        {
          confusion: "Vertex AI vs AutoML vs Model Garden",
          explanation:
            "Vertex AI is the umbrella platform. AutoML is one feature inside Vertex AI for no-code training. Model Garden is the catalog of pre-trained models inside Vertex AI.",
        },
      ],
      examTips: [
        "'Globally distributed SQL with strong consistency' → Cloud Spanner.",
        "'Real-time mobile app database with sync' → Firestore.",
        "'Time-series for IoT' → Bigtable.",
        "'Petabyte-scale SQL analytics' → BigQuery.",
        "'Object storage class for daily access' → Standard.",
        "'Object storage for once-a-year compliance backup' → Archive.",
        "'Global async messaging at scale' → Pub/Sub.",
        "'Stream and batch processing on Apache Beam' → Dataflow.",
        "'No-code ML training' → Vertex AI AutoML.",
        "'Multimodal foundation model with 2M token context' → Gemini 1.5 Pro.",
        "'Extract fields from invoices' → Document AI.",
        "'Virtual agent for call center' → Contact Center AI.",
      ],
    },
  },
  {
    id: "cdl-infra",
    examId: "gcp-cdl",
    name: "Modernizing Infrastructure & Applications",
    shortName: "Infrastructure",
    weight: 0.30,
    summary:
      "Google Cloud compute options (Compute Engine, GKE, Cloud Run, App Engine, Functions), Anthos for hybrid/multi-cloud, networking, and modernization patterns (containers, microservices, DevOps).",
    subtopics: [
      "Compute Engine (VMs)",
      "Google Kubernetes Engine (GKE) — managed Kubernetes",
      "Cloud Run — fully managed serverless containers",
      "App Engine — PaaS for web apps",
      "Cloud Functions — serverless event functions",
      "Anthos — manage Kubernetes across GCP, on-prem, AWS, Azure",
      "VPC, Cloud Load Balancing, Cloud CDN, Cloud Interconnect, Cloud VPN",
      "Migration tools: Migrate to Virtual Machines, Database Migration Service",
      "Containers and microservices",
      "DevOps and SRE: Cloud Build, Artifact Registry, Cloud Deploy, Cloud Operations (Monitoring + Logging)",
    ],
    keyFacts: [
      "GKE Autopilot manages nodes for you; Standard mode you manage nodes.",
      "Cloud Run is serverless containers — scale to zero, request-based billing.",
      "App Engine has Standard (sandboxed runtimes, scale to zero) and Flexible (Docker, no scale to zero).",
      "Anthos extends GCP control plane to on-prem and other clouds.",
      "Cloud Load Balancing is global (single anycast IP); other clouds typically have regional LBs.",
      "Cloud CDN integrates with Cloud Load Balancing using Google's edge POPs.",
      "Cloud Interconnect = dedicated private connection (10 Gbps or 100 Gbps). Cloud VPN = encrypted tunnel.",
      "Cloud Build = CI. Cloud Deploy = CD. Artifact Registry = container/package registry.",
    ],
    cramSheet: [
      "Compute ladder: Compute Engine (VMs) → GKE (containers + orchestration) → Cloud Run (serverless containers) → App Engine (PaaS) → Cloud Functions (event functions).",
      "GKE Autopilot = no node management. GKE Standard = you manage nodes.",
      "Cloud Run = serverless containers, scale to zero.",
      "Anthos = Kubernetes everywhere (GCP + on-prem + other clouds).",
      "Cloud Load Balancing = GLOBAL anycast (unique to GCP).",
      "Interconnect = dedicated fiber. VPN = encrypted internet tunnel.",
      "Cloud Build = CI. Cloud Deploy = CD.",
    ],
    review: {
      examWeight: "30% of the exam — tied for biggest",
      overview:
        "Two threads: compute services and modernization patterns. The compute ladder is critical — match the workload to the right service (VMs for full control, GKE for container orchestration, Cloud Run for serverless containers, App Engine for managed web apps, Functions for event-driven). Anthos is Google's pitch for multi-cloud Kubernetes management. The networking story emphasizes Google's GLOBAL load balancer with a single anycast IP, which most other clouds can't match.",
      sections: [
        {
          heading: "The compute ladder — pick the right service",
          table: {
            columns: ["Service", "Abstraction", "Best for"],
            rows: [
              { label: "Compute Engine", cells: ["VMs (IaaS)", "Full OS control, lift-and-shift, GPU/TPU"] },
              { label: "GKE (Standard / Autopilot)", cells: ["Managed Kubernetes", "Container orchestration at scale"] },
              { label: "Cloud Run", cells: ["Serverless containers", "HTTPS services that scale to zero"] },
              { label: "App Engine", cells: ["PaaS for web apps", "Standard runtimes, managed scaling"] },
              { label: "Cloud Functions", cells: ["FaaS / serverless functions", "Event-driven small bits of code"] },
            ],
          },
        },
        {
          heading: "GKE — Standard vs Autopilot",
          bullets: [
            "Standard mode — you choose node sizes, count, OS image. You manage cluster operations.",
            "Autopilot mode — Google manages all nodes, you only manage workloads. Pay per pod, not per node.",
            "Both modes support GPU, multi-zone, regional control planes.",
            "Workload Identity ties pods to Google service accounts for secure access to APIs.",
          ],
        },
        {
          heading: "Cloud Run vs App Engine vs Functions",
          bullets: [
            "Cloud Run — Docker containers. Scale to zero. Best for general HTTPS services. Replaces 'classic' App Engine in many use cases.",
            "App Engine Standard — sandboxed runtimes (Python, Java, Go, Node.js, etc.). Scales to zero. Less flexible than Cloud Run.",
            "App Engine Flexible — Docker. No scale to zero. Largely superseded by Cloud Run.",
            "Cloud Functions — single-purpose code triggered by an event (HTTP, Pub/Sub, Storage, etc.). Smallest unit.",
          ],
        },
        {
          heading: "Anthos — Kubernetes everywhere",
          body:
            "Anthos is Google's platform for managing Kubernetes clusters across Google Cloud, on-premises (bare metal, VMware), AWS, and Azure with consistent tooling and governance.",
          bullets: [
            "Anthos clusters — managed Kubernetes anywhere.",
            "Anthos Service Mesh — managed Istio for service-to-service communication.",
            "Anthos Config Management — declarative policy and config across clusters.",
            "Migrate to Containers — convert VMs to containers automatically.",
            "Use case: hybrid cloud with consistent operations across environments.",
          ],
        },
        {
          heading: "Networking essentials",
          bullets: [
            "VPC — global private network (regions appear as subnets).",
            "Cloud Load Balancing — GLOBAL anycast (single IP), supports HTTP(S), TCP, SSL, UDP. Differentiator vs other clouds.",
            "Cloud CDN — integrates with Cloud Load Balancing for edge caching.",
            "Cloud Interconnect — Dedicated (10/100 Gbps direct fiber) or Partner (via service provider).",
            "Cloud VPN — IPsec tunnel over public internet (HA VPN for active-active).",
            "Network Connectivity Center — hub-and-spoke connectivity across sites.",
            "Private Google Access / Private Service Connect — reach Google APIs from VPC privately.",
          ],
        },
        {
          heading: "Migration tools",
          bullets: [
            "Migrate to Virtual Machines — automated VM migration from on-prem / other clouds.",
            "Migrate to Containers — convert VM workloads into container images.",
            "Database Migration Service (DMS) — homogeneous and heterogeneous DB migrations to Cloud SQL.",
            "Storage Transfer Service — large-scale data transfer to Cloud Storage.",
            "Transfer Appliance — physical device for petabyte transfer.",
            "BigQuery Data Transfer Service — scheduled SaaS data ingestion (Google Ads, YouTube, Salesforce, etc.).",
          ],
        },
        {
          heading: "DevOps and operations",
          table: {
            columns: ["Service", "Role"],
            rows: [
              { label: "Cloud Build", cells: ["CI — build, test, deploy"] },
              { label: "Cloud Deploy", cells: ["Managed CD for GKE/Cloud Run"] },
              { label: "Artifact Registry", cells: ["Container + package registry"] },
              { label: "Cloud Source Repositories", cells: ["Managed Git"] },
              { label: "Cloud Operations Suite", cells: ["Monitoring, Logging, Trace, Profiler, Error Reporting"] },
              { label: "Cloud Trace", cells: ["Distributed tracing"] },
              { label: "Cloud Profiler", cells: ["Continuous CPU and memory profiling"] },
            ],
          },
        },
      ],
      gotchas: [
        {
          confusion: "Cloud Run vs App Engine",
          explanation:
            "Cloud Run handles any Docker container with a built-in HTTP server. App Engine Standard is restricted to specific runtimes. Cloud Run has largely replaced App Engine Flex; App Engine Standard still has its niche.",
        },
        {
          confusion: "GKE Autopilot vs GKE Standard",
          explanation:
            "Autopilot = Google manages nodes (you pay per pod, you can't change node config). Standard = you choose nodes (more control, more ops work). Autopilot is the easier default.",
        },
        {
          confusion: "Interconnect vs VPN",
          explanation:
            "Interconnect = dedicated private fiber (high cost, high bandwidth, low latency). VPN = encrypted tunnel over public internet (cheap, lower bandwidth, variable latency). Pick by SLA requirement.",
        },
        {
          confusion: "Anthos vs GKE",
          explanation:
            "GKE is Kubernetes on Google Cloud. Anthos extends the GKE-style control plane to on-prem, AWS, Azure — for consistent multi-environment operations.",
        },
        {
          confusion: "Cloud Build vs Cloud Deploy",
          explanation:
            "Cloud Build = CI (build the artifact). Cloud Deploy = CD (deploy through environments with rollout policies). They typically work together.",
        },
        {
          confusion: "Cloud Load Balancing — global vs regional",
          explanation:
            "GCP's Global LB uses a single anycast IP and routes to the nearest healthy backend worldwide. Most cloud LBs are regional. This is one of GCP's signature differentiators.",
        },
      ],
      examTips: [
        "'Run Docker containers without managing servers' → Cloud Run.",
        "'Managed Kubernetes with no node management' → GKE Autopilot.",
        "'Event-driven function triggered by Pub/Sub' → Cloud Functions.",
        "'Manage Kubernetes across GCP, on-prem, AWS' → Anthos.",
        "'Single global IP for a worldwide app' → Cloud Load Balancing (global).",
        "'Dedicated 10 Gbps private fiber to GCP' → Cloud Interconnect.",
        "'Encrypted IPsec tunnel over the internet to GCP' → Cloud VPN.",
        "'Migrate on-prem MySQL to Cloud SQL' → Database Migration Service.",
        "'CI/CD pipeline managed service' → Cloud Build (CI) + Cloud Deploy (CD).",
        "'Single source of monitoring, logs, trace' → Cloud Operations Suite.",
      ],
    },
  },
  {
    id: "cdl-trust",
    examId: "gcp-cdl",
    name: "Trust & Security in Google Cloud",
    shortName: "Trust & Security",
    weight: 0.30,
    summary:
      "Google Cloud's shared responsibility model, IAM, encryption, BeyondCorp Zero Trust, compliance, and the security tools (Security Command Center, Cloud Armor, IAP).",
    subtopics: [
      "Shared responsibility model (vs shared fate)",
      "IAM: principals, roles (basic/predefined/custom), policies, organization hierarchy",
      "Service accounts and Workload Identity",
      "Encryption at rest (default), in transit (default), and customer-managed (CMEK / CSEK / EKM)",
      "BeyondCorp / Zero Trust",
      "Identity-Aware Proxy (IAP)",
      "Cloud Armor — DDoS + WAF",
      "Security Command Center — security posture dashboard",
      "VPC Service Controls — perimeter security for sensitive data",
      "Compliance certifications and Compliance Reports Manager",
      "Data Loss Prevention (DLP)",
    ],
    keyFacts: [
      "Shared responsibility: Google secures the underlying cloud; customer secures workloads in the cloud.",
      "Shared fate (Google's framing): Google goes beyond shared responsibility with secure-by-default products, blueprints, and continuous attestation.",
      "Resource hierarchy: Organization → Folders → Projects → Resources. IAM and policies inherit downward.",
      "All data is encrypted at rest by default (Google-managed keys). CMEK lets you control keys via Cloud KMS. EKM keeps keys in your own external HSM.",
      "BeyondCorp = Google's Zero Trust model (no trusted internal network).",
      "IAP brokers identity-aware access to apps and SSH/RDP without VPN.",
      "Cloud Armor protects against L3-L7 DDoS and OWASP top 10 (WAF).",
      "Security Command Center is the central security posture dashboard with Standard (free) and Premium tiers.",
    ],
    cramSheet: [
      "Resource hierarchy: Org → Folders → Projects → Resources.",
      "IAM roles: Basic (Owner/Editor/Viewer — too broad), Predefined (per-service, recommended), Custom (you define).",
      "Encryption tiers: Google-managed (default) → CMEK (your keys in KMS) → CSEK (your keys client-side) → EKM (your keys in external HSM).",
      "BeyondCorp = Zero Trust. IAP = identity-aware app access without VPN.",
      "Cloud Armor = DDoS + WAF. SCC = security posture dashboard.",
      "VPC Service Controls = perimeter around APIs (e.g., BigQuery exfil prevention).",
    ],
    review: {
      examWeight: "30% of the exam — tied for biggest",
      overview:
        "Trust and security spans IAM, encryption, network security, and compliance. The big-ticket items: resource hierarchy (Org → Folders → Projects → Resources), IAM role types (basic vs predefined vs custom — predefined is recommended), encryption tiers (CMEK vs CSEK vs EKM), and the BeyondCorp / IAP zero-trust pattern. Cloud Armor for DDoS+WAF, Security Command Center for posture, and VPC Service Controls for data-exfiltration prevention round out the security stack.",
      sections: [
        {
          heading: "Shared responsibility (and shared fate)",
          bullets: [
            "Shared responsibility — same as other clouds. Google secures the cloud; you secure what's in the cloud.",
            "Shared fate — Google's framing that goes beyond: secure-by-default products, blueprints (e.g., enterprise foundations), continuous attestation, risk insurance.",
            "The customer's share grows from SaaS → PaaS → IaaS.",
          ],
        },
        {
          heading: "Resource hierarchy",
          bullets: [
            "Organization — top level, ties to a domain (Google Workspace or Cloud Identity).",
            "Folders — group projects by department, environment, application.",
            "Projects — billing, quota, IAM boundary; resources live inside.",
            "Resources — VMs, buckets, datasets, etc.",
            "IAM policies and Org Policies inherit DOWN the hierarchy.",
          ],
        },
        {
          heading: "IAM roles",
          table: {
            columns: ["Role type", "Scope", "Use it when"],
            rows: [
              { label: "Basic (Owner/Editor/Viewer)", cells: ["Project-wide, broad", "Avoid in production — too broad"] },
              { label: "Predefined", cells: ["Per-service (e.g., 'storage.objectViewer')", "Default best practice"] },
              { label: "Custom", cells: ["You compose the permissions", "When predefined is too broad / too narrow"] },
            ],
          },
        },
        {
          heading: "Service accounts and Workload Identity",
          bullets: [
            "Service account — identity for a workload (VM, GKE pod, Cloud Function).",
            "Workload Identity (GKE) — bind a Kubernetes service account to a Google service account; no key files in pods.",
            "Service account keys — long-lived secrets; avoid when possible.",
            "Service Account Impersonation — lets a user temporarily act as a service account (logged + auditable).",
          ],
        },
        {
          heading: "Encryption tiers",
          table: {
            columns: ["Tier", "Key location", "Control level"],
            rows: [
              { label: "Google-managed (default)", cells: ["Google", "Lowest — you don't see keys"] },
              { label: "CMEK (Customer-Managed Encryption Keys)", cells: ["Cloud KMS in your project", "You control rotation and IAM"] },
              { label: "CSEK (Customer-Supplied)", cells: ["You provide per-request", "Highest secrecy; less convenient"] },
              { label: "EKM (External Key Manager)", cells: ["Your external HSM (Fortanix, Equinix, etc.)", "Keys never enter Google"] },
            ],
          },
        },
        {
          heading: "BeyondCorp and Identity-Aware Proxy (IAP)",
          body:
            "BeyondCorp is Google's Zero Trust security model — no trusted internal network. Every access request is authenticated and authorized based on identity + device posture.",
          bullets: [
            "IAP — gates HTTPS apps behind Google identity. No VPN needed for browser apps.",
            "IAP for TCP forwarding — gives identity-gated SSH/RDP/DB access without a public IP.",
            "Context-Aware Access — policies based on user, device, location, IP.",
            "BeyondCorp Enterprise — paid product with browser-based zero-trust enforcement.",
          ],
        },
        {
          heading: "Network and edge security",
          table: {
            columns: ["Service", "Use"],
            rows: [
              { label: "Cloud Armor", cells: ["DDoS protection (L3-L7) + WAF (OWASP top 10) at the edge"] },
              { label: "VPC Service Controls", cells: ["Perimeter around GCP APIs to prevent data exfiltration (e.g., BigQuery, Storage)"] },
              { label: "Private Google Access", cells: ["VMs without public IPs reach Google APIs privately"] },
              { label: "Private Service Connect", cells: ["Private IP for accessing managed services / partner services"] },
              { label: "Cloud NAT", cells: ["Outbound-only NAT for VMs without public IPs"] },
              { label: "Cloud DNS", cells: ["Authoritative + DNSSEC + private zones"] },
            ],
          },
        },
        {
          heading: "Security visibility and compliance",
          bullets: [
            "Security Command Center (SCC) — posture dashboard.",
            "  Standard tier: free; surface basic findings (Security Health Analytics, Web Security Scanner).",
            "  Premium tier: paid; adds Event Threat Detection, Container Threat Detection, advanced threat detection.",
            "  Enterprise tier: adds vulnerability management, attack path simulation.",
            "Cloud DLP (Data Loss Prevention) — discover, classify, redact PII in storage and BigQuery.",
            "Compliance Reports Manager — download SOC 2, ISO, PCI, HIPAA reports for audits.",
            "Audit Logs — Admin Activity (always on), Data Access (configure), System Event, Policy Denied.",
            "VPC Flow Logs and Firewall Rules Logging.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Basic vs Predefined IAM roles",
          explanation:
            "Basic roles (Owner/Editor/Viewer) are too broad for production. Predefined roles (per-service, like storage.objectViewer) are the recommended default. Custom roles when neither fits.",
        },
        {
          confusion: "CMEK vs CSEK vs EKM",
          explanation:
            "CMEK = your keys in Google's KMS. CSEK = you supply the key per request (very limited services). EKM = your keys in YOUR external HSM (key never enters Google). Increasing customer control, decreasing convenience.",
        },
        {
          confusion: "IAP vs VPN",
          explanation:
            "IAP brokers identity-based access without a VPN. The user authenticates with Google, IAP authorizes based on policy, and traffic flows through IAP's infrastructure. VPN gives network access; IAP gives application access.",
        },
        {
          confusion: "VPC Service Controls vs IAM",
          explanation:
            "IAM controls WHO can access. VPC Service Controls control WHERE they can access from (perimeter). VPC SC stops a compromised credential from being used to exfiltrate data outside the perimeter.",
        },
        {
          confusion: "Cloud Armor vs Cloud Firewall Rules",
          explanation:
            "Cloud Armor is at Google's edge — DDoS scrubbing and WAF for HTTPS. VPC firewall rules apply at the network layer inside your VPC. Both are needed.",
        },
        {
          confusion: "Shared responsibility vs shared fate",
          explanation:
            "Shared responsibility = traditional split. Shared fate = Google's framing where they go beyond by providing secure-by-default products, blueprints, and risk-bearing.",
        },
      ],
      examTips: [
        "'Top of the IAM hierarchy' → Organization.",
        "'Recommended default IAM role type' → Predefined.",
        "'Avoid using these too-broad roles in prod' → Basic (Owner/Editor/Viewer).",
        "'Your keys in your own HSM, never enter Google' → EKM (External Key Manager).",
        "'Your keys in Google Cloud KMS' → CMEK.",
        "'No VPN — gate web app access by identity' → Identity-Aware Proxy (IAP).",
        "'Block OWASP top 10 at the edge' → Cloud Armor.",
        "'Prevent data exfiltration from BigQuery to outside your perimeter' → VPC Service Controls.",
        "'Discover and redact PII in S3-equivalent buckets' → Cloud DLP.",
        "'Central dashboard of all security findings' → Security Command Center.",
        "'Download a SOC 2 report for a customer audit' → Compliance Reports Manager.",
        "'GKE pod accesses BigQuery without a key file' → Workload Identity.",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────────────────────────────

export const GCP_CDL_QUESTIONS: Question[] = [
  // ── Transformation ────────────────────────────────────────────
  {
    id: "q-cdl-t-1",
    examId: "gcp-cdl",
    topicId: "cdl-transformation",
    prompt: "Which deployment model uses two or more public cloud providers (e.g., Google Cloud + AWS)?",
    choices: ["Hybrid", "Multi-cloud", "Private", "Edge"],
    correctIndex: 1,
    explanation:
      "Multi-cloud uses 2+ public providers. Hybrid combines public + private (often on-prem with one cloud).",
    difficulty: "easy",
    tags: ["deployment-models"],
  },
  {
    id: "q-cdl-t-2",
    examId: "gcp-cdl",
    topicId: "cdl-transformation",
    prompt: "An organization wants to compare its current on-premises IT spend with the equivalent cost of running on Google Cloud. Which framework is the right tool?",
    choices: ["TCO analysis", "Capacity planning", "Risk assessment", "Audit"],
    correctIndex: 0,
    explanation:
      "Total Cost of Ownership (TCO) analysis compares all costs of on-prem (hardware, power, cooling, staff, opportunity) against cloud equivalents.",
    difficulty: "easy",
    tags: ["economics"],
  },
  {
    id: "q-cdl-t-3",
    examId: "gcp-cdl",
    topicId: "cdl-transformation",
    prompt: "Which Google Cloud service model gives you full control of the operating system?",
    choices: ["SaaS", "PaaS", "IaaS", "FaaS"],
    correctIndex: 2,
    explanation:
      "IaaS (Compute Engine VMs) gives you OS control. PaaS abstracts the OS; SaaS abstracts everything.",
    difficulty: "easy",
    tags: ["service-models"],
  },
  {
    id: "q-cdl-t-4",
    examId: "gcp-cdl",
    topicId: "cdl-transformation",
    prompt: "Which Google Cloud value pillar is most directly demonstrated by being carbon-neutral since 2007 and aiming for 24/7 carbon-free energy by 2030?",
    choices: ["Open", "Sustainable", "Scalable", "Data-first"],
    correctIndex: 1,
    explanation:
      "Sustainability is one of Google Cloud's marketed value pillars. Carbon-neutral 2007, 24/7 carbon-free energy goal by 2030.",
    difficulty: "easy",
    tags: ["pillars", "sustainability"],
  },

  // ── Data & AI ─────────────────────────────────────────────────
  {
    id: "q-cdl-d-1",
    examId: "gcp-cdl",
    topicId: "cdl-data-ai",
    prompt: "Which Google Cloud service is a serverless, petabyte-scale analytics data warehouse with a SQL interface?",
    choices: ["Cloud SQL", "Spanner", "BigQuery", "Bigtable"],
    correctIndex: 2,
    explanation:
      "BigQuery is the serverless data warehouse — separates storage from compute, scales to petabytes, SQL interface.",
    difficulty: "easy",
    tags: ["bigquery"],
  },
  {
    id: "q-cdl-d-2",
    examId: "gcp-cdl",
    topicId: "cdl-data-ai",
    prompt: "A global retail company needs a relational database with strong consistency and horizontal scaling across regions. Which service fits?",
    choices: ["Cloud SQL", "Cloud Spanner", "Firestore", "Bigtable"],
    correctIndex: 1,
    explanation:
      "Spanner is globally distributed, strongly consistent, horizontally scalable. Cloud SQL is regional; Firestore is doc NoSQL; Bigtable is wide-column NoSQL.",
    difficulty: "medium",
    tags: ["databases"],
  },
  {
    id: "q-cdl-d-3",
    examId: "gcp-cdl",
    topicId: "cdl-data-ai",
    prompt: "Which Cloud Storage class is designed for objects accessed at most once per year (e.g., compliance archives)?",
    choices: ["Standard", "Nearline", "Coldline", "Archive"],
    correctIndex: 3,
    explanation:
      "Archive is the coldest tier — 365-day minimum, cheapest storage, highest retrieval cost.",
    difficulty: "easy",
    tags: ["storage-classes"],
  },
  {
    id: "q-cdl-d-4",
    examId: "gcp-cdl",
    topicId: "cdl-data-ai",
    prompt: "Which two Google Cloud services together typically form the standard streaming pipeline (event ingest + stream processing) before data lands in BigQuery?",
    choices: [
      "Compute Engine + Cloud Storage",
      "Pub/Sub + Dataflow",
      "Cloud SQL + Cloud Functions",
      "GKE + Anthos",
    ],
    correctIndex: 1,
    explanation:
      "Pub/Sub for event ingest + Dataflow for stream processing → BigQuery is the canonical streaming analytics pattern.",
    difficulty: "medium",
    tags: ["pipelines"],
  },
  {
    id: "q-cdl-d-5",
    examId: "gcp-cdl",
    topicId: "cdl-data-ai",
    prompt: "Which Google Cloud service is the unified ML platform that includes AutoML, custom training, and generative AI tools?",
    choices: ["Vertex AI", "BigQuery ML", "Dataflow", "Cloud Functions"],
    correctIndex: 0,
    explanation:
      "Vertex AI unifies AutoML, custom training, model deployment, generative AI (Gemini), Feature Store, and Pipelines.",
    difficulty: "easy",
    tags: ["vertex-ai"],
  },
  {
    id: "q-cdl-d-6",
    examId: "gcp-cdl",
    topicId: "cdl-data-ai",
    prompt: "Which pre-built Google Cloud AI API extracts structured fields from documents like invoices and contracts?",
    choices: ["Vision API", "Document AI", "Natural Language API", "Translation"],
    correctIndex: 1,
    explanation:
      "Document AI is purpose-built for extracting structured data from forms, invoices, contracts, IDs.",
    difficulty: "easy",
    tags: ["ai-apis"],
  },
  {
    id: "q-cdl-d-7",
    examId: "gcp-cdl",
    topicId: "cdl-data-ai",
    prompt: "Which Google foundation model family is multimodal (text, image, audio, video) with up to a 2M-token context?",
    choices: ["BERT", "PaLM 1", "Gemini", "T5"],
    correctIndex: 2,
    explanation:
      "Gemini is Google's flagship multimodal foundation model family. Gemini 1.5 Pro supports up to 2M-token context.",
    difficulty: "medium",
    tags: ["gemini"],
  },

  // ── Infrastructure ────────────────────────────────────────────
  {
    id: "q-cdl-i-1",
    examId: "gcp-cdl",
    topicId: "cdl-infra",
    prompt: "Which Google Cloud service runs Docker containers fully serverless and scales to zero on idle?",
    choices: ["Compute Engine", "GKE Standard", "Cloud Run", "App Engine Flexible"],
    correctIndex: 2,
    explanation:
      "Cloud Run runs Docker containers serverless, scales to zero, request-based billing. Best fit for HTTPS services.",
    difficulty: "easy",
    tags: ["cloud-run"],
  },
  {
    id: "q-cdl-i-2",
    examId: "gcp-cdl",
    topicId: "cdl-infra",
    prompt: "An organization wants managed Kubernetes without managing nodes themselves. Which GKE mode is the right choice?",
    choices: ["GKE Standard", "GKE Autopilot", "Cloud Run", "Anthos on bare metal"],
    correctIndex: 1,
    explanation:
      "GKE Autopilot manages nodes for you. You only manage workloads. Pay per pod, not per node.",
    difficulty: "medium",
    tags: ["gke"],
  },
  {
    id: "q-cdl-i-3",
    examId: "gcp-cdl",
    topicId: "cdl-infra",
    prompt: "Which Google Cloud service lets you manage Kubernetes clusters across Google Cloud, on-premises, AWS, and Azure with consistent tooling?",
    choices: ["Cloud Run", "Anthos", "Cloud Build", "VPC Network Peering"],
    correctIndex: 1,
    explanation:
      "Anthos extends GKE-style operations to on-prem and other clouds for hybrid/multi-cloud Kubernetes.",
    difficulty: "medium",
    tags: ["anthos"],
  },
  {
    id: "q-cdl-i-4",
    examId: "gcp-cdl",
    topicId: "cdl-infra",
    prompt: "What is a notable differentiator of Google Cloud Load Balancing compared to other public clouds?",
    choices: [
      "It only works for HTTP traffic.",
      "It uses a single global anycast IP that routes to the nearest healthy backend worldwide.",
      "It requires a separate appliance per region.",
      "It only supports private addresses.",
    ],
    correctIndex: 1,
    explanation:
      "GCP's global Cloud Load Balancing uses a single anycast IP that routes to the nearest healthy backend worldwide — a unique differentiator.",
    difficulty: "medium",
    tags: ["networking"],
  },
  {
    id: "q-cdl-i-5",
    examId: "gcp-cdl",
    topicId: "cdl-infra",
    prompt: "An organization needs a private, dedicated 10 Gbps connection between its on-premises datacenter and Google Cloud, bypassing the public internet. Which service?",
    choices: ["Cloud VPN", "Cloud Interconnect", "Cloud NAT", "VPC Peering"],
    correctIndex: 1,
    explanation:
      "Cloud Interconnect provides dedicated private fiber (10 or 100 Gbps). Cloud VPN is encrypted over public internet.",
    difficulty: "medium",
    tags: ["networking"],
  },
  {
    id: "q-cdl-i-6",
    examId: "gcp-cdl",
    topicId: "cdl-infra",
    prompt: "Which Google Cloud service is the managed CI build engine?",
    choices: ["Cloud Deploy", "Cloud Build", "Artifact Registry", "Cloud Source Repositories"],
    correctIndex: 1,
    explanation:
      "Cloud Build is the managed CI service (build, test, optionally deploy). Cloud Deploy is the dedicated CD service.",
    difficulty: "easy",
    tags: ["devops"],
  },

  // ── Trust & Security ──────────────────────────────────────────
  {
    id: "q-cdl-s-1",
    examId: "gcp-cdl",
    topicId: "cdl-trust",
    prompt: "What is the order of the Google Cloud resource hierarchy from top to bottom?",
    choices: [
      "Project → Folder → Organization → Resource",
      "Resource → Project → Folder → Organization",
      "Organization → Folder → Project → Resource",
      "Folder → Organization → Project → Resource",
    ],
    correctIndex: 2,
    explanation:
      "Organization → Folders → Projects → Resources. Policies inherit downward.",
    difficulty: "easy",
    tags: ["hierarchy"],
  },
  {
    id: "q-cdl-s-2",
    examId: "gcp-cdl",
    topicId: "cdl-trust",
    prompt: "Which IAM role type is recommended as the default for production access?",
    choices: ["Basic (Owner/Editor/Viewer)", "Predefined", "Custom", "Service-account-impersonating"],
    correctIndex: 1,
    explanation:
      "Predefined roles are scoped per-service and follow least privilege better than the broad Basic roles.",
    difficulty: "medium",
    tags: ["iam"],
  },
  {
    id: "q-cdl-s-3",
    examId: "gcp-cdl",
    topicId: "cdl-trust",
    prompt: "An organization wants to control encryption keys themselves using Google Cloud's key management service. Which option fits?",
    choices: [
      "Default Google-managed encryption",
      "CMEK (Customer-Managed Encryption Keys via Cloud KMS)",
      "CSEK (Customer-Supplied Encryption Keys)",
      "EKM (External Key Manager)",
    ],
    correctIndex: 1,
    explanation:
      "CMEK lets the customer manage keys in Cloud KMS — control rotation, IAM, and disable. CSEK requires supplying keys per request; EKM keeps keys outside Google entirely.",
    difficulty: "medium",
    tags: ["encryption"],
  },
  {
    id: "q-cdl-s-4",
    examId: "gcp-cdl",
    topicId: "cdl-trust",
    prompt: "Which Google Cloud service enforces identity-based access to internal web apps without requiring a VPN?",
    choices: ["Cloud Armor", "Identity-Aware Proxy (IAP)", "Cloud VPN", "VPC Service Controls"],
    correctIndex: 1,
    explanation:
      "IAP gates HTTPS apps behind Google identity. No VPN required. Part of the BeyondCorp Zero Trust model.",
    difficulty: "medium",
    tags: ["zero-trust", "iap"],
  },
  {
    id: "q-cdl-s-5",
    examId: "gcp-cdl",
    topicId: "cdl-trust",
    prompt: "Which service provides DDoS protection AND a Web Application Firewall (WAF) at Google's edge?",
    choices: ["Cloud Firewall", "Cloud Armor", "VPC Service Controls", "Security Command Center"],
    correctIndex: 1,
    explanation:
      "Cloud Armor provides L3-L7 DDoS protection and OWASP top 10 WAF rules at Google's edge.",
    difficulty: "medium",
    tags: ["edge-security"],
  },
  {
    id: "q-cdl-s-6",
    examId: "gcp-cdl",
    topicId: "cdl-trust",
    prompt: "Which Google Cloud service prevents data from being exfiltrated from BigQuery or Cloud Storage to destinations outside a defined perimeter, even with valid IAM credentials?",
    choices: ["Cloud Armor", "VPC Service Controls", "Identity-Aware Proxy", "Cloud DLP"],
    correctIndex: 1,
    explanation:
      "VPC Service Controls create a perimeter around Google Cloud APIs. Even a stolen credential can't exfiltrate data to outside the perimeter.",
    difficulty: "hard",
    tags: ["data-protection"],
  },
  {
    id: "q-cdl-s-7",
    examId: "gcp-cdl",
    topicId: "cdl-trust",
    prompt: "Which Google Cloud service is the central security posture dashboard with tiers for free findings and paid threat detection?",
    choices: ["Cloud Logging", "Cloud Audit Logs", "Security Command Center", "Cloud Trace"],
    correctIndex: 2,
    explanation:
      "Security Command Center aggregates findings (Standard tier) and adds threat detection (Premium tier).",
    difficulty: "medium",
    tags: ["scc"],
  },
];

// ─────────────────────────────────────────────────────────────────
// DIAGNOSTIC SET — 8 questions across all 4 domains
// ─────────────────────────────────────────────────────────────────

export const GCP_CDL_DIAGNOSTIC = [
  "q-cdl-t-2",
  "q-cdl-d-1",
  "q-cdl-d-2",
  "q-cdl-d-4",
  "q-cdl-i-1",
  "q-cdl-i-3",
  "q-cdl-s-1",
  "q-cdl-s-4",
];

// ─────────────────────────────────────────────────────────────────
// LESSONS
// ─────────────────────────────────────────────────────────────────

export const GCP_CDL_LESSONS: Lesson[] = [
  // Transformation
  {
    id: "l-cdl-t-1",
    topicId: "cdl-transformation",
    order: 1,
    title: "Cloud essentials and Google Cloud's pitch",
    summary:
      "The 5 NIST cloud characteristics, deployment models, service models, and Google's value pillars.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "5 cloud essentials (NIST)",
        bullets: [
          "On-demand self-service",
          "Broad network access",
          "Resource pooling",
          "Rapid elasticity",
          "Measured service",
        ],
      },
      {
        kind: "concept",
        title: "Deployment + service models",
        bullets: [
          "Public / Private / Hybrid / Multi-cloud (deployment).",
          "IaaS (Compute Engine) / PaaS (App Engine, Cloud Run) / SaaS (Workspace) (service).",
          "Multi-cloud = 2+ public providers (GCP + AWS).",
          "Hybrid = public + private (typically on-prem to one cloud).",
        ],
      },
      {
        kind: "concept",
        title: "Google Cloud's value pillars",
        bullets: [
          "Open — multi-cloud-friendly (Anthos), open source (Kubernetes, TensorFlow).",
          "Scalable — global network, autoscaling, per-second billing.",
          "Data-first — BigQuery + Vertex AI as differentiators.",
          "Sustainable — carbon-neutral since 2007, 24/7 carbon-free by 2030.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Memorize the cloud essentials, models, and Google's positioning. Sustainability shows up reliably.",
      },
    ],
  },

  // Data & AI
  {
    id: "l-cdl-d-1",
    topicId: "cdl-data-ai",
    order: 1,
    title: "Pick the right database",
    summary:
      "Cloud SQL, Spanner, Firestore, Bigtable, BigQuery — each fits a different workload.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Database service map",
        table: {
          columns: ["Service", "Use it for"],
          rows: [
            { label: "Cloud SQL", cells: ["Standard managed MySQL/Postgres/SQL Server, regional"] },
            { label: "Cloud Spanner", cells: ["Globally distributed SQL with strong consistency"] },
            { label: "AlloyDB", cells: ["Postgres-compatible, higher-performance analytical workloads"] },
            { label: "Firestore", cells: ["Document NoSQL with mobile/web sync"] },
            { label: "Bigtable", cells: ["Wide-column NoSQL — IoT, time series, ad tech"] },
            { label: "Memorystore", cells: ["Redis / Memcached cache"] },
            { label: "BigQuery", cells: ["Petabyte-scale serverless analytics warehouse"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Pattern matching",
        body:
          "'Globally distributed SQL' → Spanner. 'Mobile app with sync' → Firestore. 'IoT sensors at scale' → Bigtable. 'Petabyte SQL analytics' → BigQuery. 'Standard MySQL/Postgres' → Cloud SQL.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Match access pattern + scale to database. Most exam questions are scenario-to-service.",
      },
    ],
  },
  {
    id: "l-cdl-d-2",
    topicId: "cdl-data-ai",
    order: 2,
    title: "BigQuery, Pub/Sub, Dataflow — the analytics pipeline",
    summary:
      "The canonical Google Cloud streaming analytics pattern.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "The standard pipeline",
        body:
          "Source (apps, IoT) → Pub/Sub (durable async messaging) → Dataflow (stream/batch processing) → BigQuery (analytics) → Looker (visualization).",
      },
      {
        kind: "concept",
        title: "What each does",
        bullets: [
          "Pub/Sub — global, durable, async messaging. Decouples producers from consumers.",
          "Dataflow — stream and batch processing on Apache Beam. Auto-scales.",
          "BigQuery — serverless petabyte-scale SQL analytics.",
          "Looker / Looker Studio — BI and dashboards.",
        ],
      },
      {
        kind: "tip",
        title: "BigQuery superpowers",
        body:
          "BigQuery separates storage from compute, supports streaming inserts, and includes BigQuery ML (train models with SQL).",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Pub/Sub → Dataflow → BigQuery → Looker is the canonical streaming pattern. Memorize it.",
      },
    ],
  },
  {
    id: "l-cdl-d-3",
    topicId: "cdl-data-ai",
    order: 3,
    title: "Vertex AI and Gemini",
    summary:
      "Google's unified ML platform plus the Gemini foundation model family.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "Vertex AI capabilities",
        bullets: [
          "AutoML — no-code training.",
          "Custom training — bring TensorFlow / PyTorch / sklearn.",
          "Model Garden — pre-trained models including Gemini.",
          "Generative AI Studio — prompt design + fine-tuning + deployment for FMs.",
          "Pipelines — orchestrate ML workflows.",
          "Feature Store — managed features.",
          "Endpoints — online prediction.",
          "Explainable AI — feature attributions.",
        ],
      },
      {
        kind: "concept",
        title: "Gemini family",
        bullets: [
          "Gemini Pro / Gemini 1.5 Pro — multimodal, up to 2M-token context.",
          "Gemini Flash — faster, cheaper.",
          "Gemini Nano — on-device.",
          "Gemini for Google Cloud — assistant in console (formerly Duet AI).",
          "Gemini for Workspace — Gmail, Docs, Sheets, Slides, Meet.",
        ],
      },
      {
        kind: "tip",
        title: "Pre-built API map",
        body:
          "Vision (image), Video Intelligence, Translation, Speech-to-Text, Text-to-Speech, Natural Language, Document AI, Contact Center AI, Recommendations AI.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Vertex AI = unified platform. Gemini = flagship multimodal FM family.",
      },
    ],
  },

  // Infrastructure
  {
    id: "l-cdl-i-1",
    topicId: "cdl-infra",
    order: 1,
    title: "Compute ladder — pick the right service",
    summary:
      "Compute Engine, GKE, Cloud Run, App Engine, Cloud Functions. Increasing abstraction.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "The ladder",
        table: {
          columns: ["Service", "Best for"],
          rows: [
            { label: "Compute Engine", cells: ["VMs, full OS, GPU/TPU, lift-and-shift"] },
            { label: "GKE", cells: ["Container orchestration at scale (Standard or Autopilot)"] },
            { label: "Cloud Run", cells: ["Serverless containers, scale to zero"] },
            { label: "App Engine Standard", cells: ["Sandboxed runtimes, scale to zero"] },
            { label: "Cloud Functions", cells: ["Event-driven snippets"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "GKE Autopilot vs Standard",
        body:
          "Autopilot = no node management, pay per pod, less control. Standard = you manage nodes, more flexible. Default to Autopilot unless you need GPU node pools or specific kernel features.",
      },
      {
        kind: "tip",
        title: "Cloud Run vs Cloud Functions",
        body:
          "Cloud Run = full HTTPS service in a container. Cloud Functions = single event handler (Pub/Sub trigger, HTTP endpoint). Cloud Run is more flexible for general services.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Compute Engine for control, GKE for containers at scale, Cloud Run for serverless containers, Functions for event snippets.",
      },
    ],
  },
  {
    id: "l-cdl-i-2",
    topicId: "cdl-infra",
    order: 2,
    title: "Anthos and the GCP networking story",
    summary:
      "Anthos = Kubernetes anywhere. Cloud Load Balancing = single global IP. Interconnect vs VPN.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "Anthos",
        body:
          "Manage Kubernetes clusters across Google Cloud, on-premises (bare metal, VMware), AWS, Azure with consistent tooling, policy, and observability.",
        bullets: [
          "Anthos clusters — managed Kubernetes anywhere.",
          "Anthos Service Mesh — managed Istio.",
          "Anthos Config Management — declarative policy across clusters.",
          "Migrate to Containers — VM-to-container automation.",
        ],
      },
      {
        kind: "concept",
        title: "Networking essentials",
        bullets: [
          "VPC — global private network (regions are subnets).",
          "Cloud Load Balancing — GLOBAL anycast IP, routes to nearest healthy backend worldwide.",
          "Cloud CDN — edge caching integrated with Cloud LB.",
          "Cloud Interconnect — dedicated private fiber (10/100 Gbps).",
          "Cloud VPN — IPsec tunnel over public internet (HA VPN for active-active).",
        ],
      },
      {
        kind: "tip",
        title: "Differentiator",
        body:
          "Single global anycast IP for Cloud Load Balancing is unique to GCP — most clouds have regional LBs.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Anthos = Kubernetes everywhere. Global LB is GCP's signature. Interconnect = private fiber, VPN = encrypted internet.",
      },
    ],
  },

  // Trust & Security
  {
    id: "l-cdl-s-1",
    topicId: "cdl-trust",
    order: 1,
    title: "Resource hierarchy and IAM",
    summary:
      "Org → Folders → Projects → Resources. Use predefined roles, not basic.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "The hierarchy",
        bullets: [
          "Organization — top, ties to a domain.",
          "Folders — group projects (department, environment, app).",
          "Projects — billing, quota, IAM boundary.",
          "Resources — VMs, buckets, datasets.",
          "IAM and Org Policies inherit DOWNWARD.",
        ],
      },
      {
        kind: "concept",
        title: "IAM role types",
        bullets: [
          "Basic (Owner / Editor / Viewer) — too broad; avoid in prod.",
          "Predefined — per-service, recommended default.",
          "Custom — when predefined doesn't fit.",
        ],
      },
      {
        kind: "concept",
        title: "Service accounts",
        bullets: [
          "Service account = identity for a workload (VM, GKE pod, Cloud Function).",
          "Workload Identity (GKE) — bind K8s service account to Google service account; no key files in pods.",
          "Avoid long-lived service account keys.",
          "Service Account Impersonation — temporarily act as a service account, audited.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Hierarchy is Org → Folder → Project → Resource. Predefined roles + Workload Identity for K8s.",
      },
    ],
  },
  {
    id: "l-cdl-s-2",
    topicId: "cdl-trust",
    order: 2,
    title: "Encryption and zero trust",
    summary:
      "CMEK / CSEK / EKM. BeyondCorp + Identity-Aware Proxy.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Encryption tiers",
        table: {
          columns: ["Tier", "Key location", "Control"],
          rows: [
            { label: "Default (Google-managed)", cells: ["Google", "Lowest"] },
            { label: "CMEK", cells: ["Cloud KMS in your project", "You control rotation, IAM"] },
            { label: "CSEK", cells: ["You supply per request", "Highest secrecy, least convenient"] },
            { label: "EKM", cells: ["Your external HSM", "Keys never enter Google"] },
          ],
        },
      },
      {
        kind: "concept",
        title: "BeyondCorp + IAP",
        bullets: [
          "BeyondCorp = Google's Zero Trust model — no trusted internal network.",
          "Identity-Aware Proxy (IAP) — gates HTTPS apps by Google identity. No VPN.",
          "IAP for TCP forwarding — identity-gated SSH/RDP without public IPs.",
          "Context-Aware Access — policies based on user, device, location, IP.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "CMEK = your keys in KMS. EKM = your keys outside Google. IAP = no VPN needed for app access.",
      },
    ],
  },
  {
    id: "l-cdl-s-3",
    topicId: "cdl-trust",
    order: 3,
    title: "Cloud Armor, VPC Service Controls, Security Command Center",
    summary:
      "Edge defense, perimeter security, posture dashboard.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "The security stack",
        table: {
          columns: ["Service", "Use"],
          rows: [
            { label: "Cloud Armor", cells: ["Edge DDoS + WAF (OWASP top 10)"] },
            { label: "VPC Service Controls", cells: ["Perimeter around Google Cloud APIs to prevent data exfiltration"] },
            { label: "Cloud DLP", cells: ["Discover, classify, redact PII"] },
            { label: "Security Command Center", cells: ["Central security posture dashboard"] },
            { label: "Cloud Audit Logs", cells: ["Admin Activity (always), Data Access (configure), Policy Denied"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "VPC Service Controls is unique",
        body:
          "VPC SC stops a stolen credential from being used to exfiltrate data outside your perimeter, even though IAM allows the access. Critical for sensitive data like BigQuery.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Cloud Armor at the edge, VPC SC for perimeter, SCC for posture. Each addresses a different layer.",
      },
    ],
  },
];
