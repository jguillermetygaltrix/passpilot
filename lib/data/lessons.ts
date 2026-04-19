import type { ExamId, Lesson } from "../types";
import { AWS_CCP_LESSONS } from "./exams/aws-ccp";
import { MS900_LESSONS } from "./exams/ms-900";
import { TOPIC_MAP } from "./topics";

export const AZ900_LESSONS: Lesson[] = [
  // ─────────────────────────────────────────────────────────────────
  // Chapter 1: Cloud Concepts
  // ─────────────────────────────────────────────────────────────────
  {
    id: "l-cc-1",
    topicId: "cloud-concepts",
    order: 1,
    title: "What is cloud computing?",
    summary:
      "The core idea, the five characteristics, and why 'cloud' is more than just 'someone else's computer.'",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Start here",
        body:
          "Before Azure makes sense, cloud computing has to make sense. This short lesson gives you the core vocabulary you'll use for the rest of the exam.",
      },
      {
        kind: "concept",
        title: "The one-sentence definition",
        body:
          "Cloud computing is the on-demand delivery of IT resources — compute, storage, networking, software — over the internet, billed by consumption.",
        bullets: [
          "You don't buy hardware.",
          "You don't run a datacenter.",
          "You pay for what you use, when you use it.",
        ],
      },
      {
        kind: "concept",
        title: "The five characteristics of cloud",
        body:
          "NIST's definition boils cloud down to five essential traits. If a service has all five, it's cloud. Memorize these — they appear as distractors and correct answers constantly.",
        bullets: [
          "On-demand self-service — provision without talking to a human.",
          "Broad network access — reachable from any standard network.",
          "Resource pooling — multi-tenant; resources come from a shared pool.",
          "Rapid elasticity — scale out and back in automatically.",
          "Measured service — metered, and that's how you're billed.",
        ],
      },
      {
        kind: "example",
        title: "In practice",
        body:
          "When you spin up a VM in Azure, it takes minutes — not weeks of procurement. You click, it provisions, you're billed by the second. All five characteristics in motion at once.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Cloud = on-demand IT, shared, metered, paid by the second.",
        body:
          "That one line is your cloud elevator pitch. Next up: why the business side cares about this shift — CapEx versus OpEx.",
      },
    ],
  },
  {
    id: "l-cc-2",
    topicId: "cloud-concepts",
    order: 2,
    title: "CapEx vs OpEx: the money model",
    summary:
      "Why finance teams love cloud: turning big upfront hardware bills into predictable consumption expenses.",
    minutes: 3,
    cards: [
      {
        kind: "intro",
        title: "The financial reason cloud exists",
        body:
          "Half of cloud's promise is technical (scale, speed). The other half is financial. This lesson is the money half.",
      },
      {
        kind: "concept",
        title: "CapEx (capital expenditure)",
        body:
          "You buy hardware upfront. The organization owns the asset, depreciates it over years, and carries the maintenance cost whether the asset is heavily used or sitting idle.",
        bullets: [
          "Large upfront commitment.",
          "Long procurement cycles.",
          "You eat the cost of overprovisioning.",
        ],
      },
      {
        kind: "concept",
        title: "OpEx (operational expenditure)",
        body:
          "You rent infrastructure and pay as you consume it. No ownership, no upfront commitment. Your bill tracks actual usage.",
        bullets: [
          "Pay-as-you-go.",
          "Zero upfront — you can deploy in minutes.",
          "Stop paying the moment you shut it down.",
        ],
      },
      {
        kind: "tip",
        title: "Exam pattern",
        body:
          "If a question mentions 'no upfront hardware,' 'pay only for what you use,' or 'shift costs from capital to operational,' the answer is OpEx. Cloud is fundamentally OpEx.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "CapEx buys servers. OpEx rents them by the second.",
      },
    ],
  },
  {
    id: "l-cc-3",
    topicId: "cloud-concepts",
    order: 3,
    title: "IaaS, PaaS, SaaS — who manages what",
    summary:
      "The three service models, the responsibility shift between them, and the rule that never changes: data is always yours.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "The three-model ladder",
        body:
          "Cloud services come in layers. The layer you pick decides how much control you keep and how much Microsoft handles.",
      },
      {
        kind: "concept",
        title: "IaaS — Infrastructure as a Service",
        body:
          "You rent raw infrastructure: VMs, storage, networking. You install the OS, patch it, install runtimes, and deploy apps. Example: Azure Virtual Machines.",
        bullets: [
          "Most control.",
          "Most responsibility.",
          "Best for lift-and-shift and legacy workloads.",
        ],
      },
      {
        kind: "concept",
        title: "PaaS — Platform as a Service",
        body:
          "Microsoft runs the OS and runtime. You just deploy code. Example: Azure App Service, Azure Functions.",
        bullets: [
          "You skip patching and OS maintenance.",
          "You focus on app logic, not infrastructure.",
          "Ideal for modern web apps and APIs.",
        ],
      },
      {
        kind: "concept",
        title: "SaaS — Software as a Service",
        body:
          "Microsoft runs the whole application. You just use it. Example: Microsoft 365, Dynamics 365, Salesforce.",
        bullets: [
          "Zero infrastructure responsibility.",
          "You still own your data, users, and access controls.",
        ],
      },
      {
        kind: "comparison",
        title: "Side-by-side",
        table: {
          columns: ["Layer", "IaaS", "PaaS", "SaaS"],
          rows: [
            { label: "Apps", cells: ["You", "You", "Provider"] },
            { label: "Data", cells: ["You", "You", "You"] },
            { label: "Runtime", cells: ["You", "Provider", "Provider"] },
            { label: "OS", cells: ["You", "Provider", "Provider"] },
            { label: "Hardware", cells: ["Provider", "Provider", "Provider"] },
          ],
        },
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "You patch OS? IaaS. Microsoft patches? PaaS. You just log in? SaaS.",
      },
    ],
  },
  {
    id: "l-cc-4",
    topicId: "cloud-concepts",
    order: 4,
    title: "Public, Private, Hybrid — where the cloud runs",
    summary:
      "Deployment models decide who shares the infrastructure and where the data lives. Three you must know cold.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Service model vs deployment model",
        body:
          "Service model = who manages each layer. Deployment model = who owns and uses the infrastructure. Don't confuse them.",
      },
      {
        kind: "concept",
        title: "Public cloud",
        body:
          "Infrastructure is owned by a provider and shared by many tenants. Azure, AWS, GCP are all public clouds.",
        bullets: [
          "Lowest entry cost.",
          "Highest scalability.",
          "Least control over physical placement.",
        ],
      },
      {
        kind: "concept",
        title: "Private cloud",
        body:
          "Dedicated infrastructure for a single organization — either on-premises or hosted by a third party.",
        bullets: [
          "Most control.",
          "Typically highest cost.",
          "Used when compliance or latency demands exclusivity.",
        ],
      },
      {
        kind: "concept",
        title: "Hybrid cloud",
        body:
          "A public and private environment connected together (via VPN or ExpressRoute). Some workloads stay private; others burst to public.",
        bullets: [
          "Flexibility + compliance.",
          "Common in regulated industries (healthcare, finance, government).",
        ],
      },
      {
        kind: "tip",
        title: "Don't confuse hybrid with multi-cloud",
        body:
          "Hybrid = public + private. Multi-cloud = two or more public providers (Azure + AWS). The exam uses them as distractors for each other.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Public = shared. Private = dedicated. Hybrid = connected.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Chapter 2: Core Azure Services
  // ─────────────────────────────────────────────────────────────────
  {
    id: "l-cs-1",
    topicId: "core-services",
    order: 1,
    title: "How Azure is laid out globally",
    summary:
      "Geographies, regions, availability zones, region pairs — the geography vocabulary the exam loves.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "Before services, geography",
        body:
          "Azure's 'where' is tested before its 'what.' Learn these four terms cold: geography, region, availability zone, region pair.",
      },
      {
        kind: "concept",
        title: "Region",
        body:
          "A geographic area containing one or more datacenters (East US, West Europe, Brazil South). When you deploy a resource, you pick a region.",
      },
      {
        kind: "concept",
        title: "Availability Zone (AZ)",
        body:
          "A physically separate datacenter inside a region with independent power, cooling, and networking. Zones let you survive a single-DC failure without leaving the region.",
        bullets: [
          "At least 3 AZs per supported region.",
          "Zone-redundant deployments get a 99.99% SLA.",
          "AZs are connected by low-latency private fiber inside the region.",
        ],
      },
      {
        kind: "concept",
        title: "Region pair",
        body:
          "Two regions paired for geo-redundancy, usually hundreds of miles apart. Updates roll out sequentially between paired regions so both don't go down at once.",
        bullets: [
          "Used by storage GRS and by Azure for safe update rollout.",
          "Failure in one region is isolated from the other.",
        ],
      },
      {
        kind: "tip",
        title: "Don't mix region and zone",
        body:
          "Region = geography. Zone = a datacenter inside a region. Deploying across AZs protects against DC failure within a region. Deploying across regions (via GRS or DR) protects against a whole region going down.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Region = geography. AZ = DC within a region. Pair = two regions linked for DR.",
      },
    ],
  },
  {
    id: "l-cs-2",
    topicId: "core-services",
    order: 2,
    title: "Compute options in one picture",
    summary:
      "Six compute services, one decision: what are you running and how much do you want Microsoft to manage?",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "'Run my code' means many things",
        body:
          "Azure offers many compute services because 'compute' covers everything from a legacy VM to a one-off container to event-driven snippets. Your job on the exam is to match the scenario to the right service.",
      },
      {
        kind: "comparison",
        title: "The six to know",
        table: {
          columns: ["Service", "Best for", "Billing"],
          rows: [
            { label: "Virtual Machines", cells: ["Full OS control, lift-and-shift", "Per second while running"] },
            { label: "VM Scale Sets", cells: ["Identical VMs with autoscale", "Per VM"] },
            { label: "App Service", cells: ["Web apps and APIs, no OS work", "Plan-based"] },
            { label: "Container Instances (ACI)", cells: ["Single container, no orchestration", "Per second of container"] },
            { label: "Azure Kubernetes Service (AKS)", cells: ["Managed Kubernetes clusters", "Worker nodes only (control plane free)"] },
            { label: "Functions", cells: ["Event-driven, serverless, scale to zero", "Per execution"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Decision shortcuts",
        bullets: [
          "'Autoscale a fleet of identical VMs' → VM Scale Sets.",
          "'Managed web app' → App Service.",
          "'Run a single container' → ACI.",
          "'Orchestrate microservices' → AKS.",
          "'Code reacts to events, pay per run' → Functions.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "The more Microsoft manages, the less you pay for idle — and the less control you have.",
      },
    ],
  },
  {
    id: "l-cs-3",
    topicId: "core-services",
    order: 3,
    title: "Networking building blocks",
    summary:
      "Virtual networks, connectivity options, and the load balancers that sit in front of your apps.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "The networking primer",
        body:
          "Networking questions revolve around connecting things securely and distributing traffic to them. Learn the big-ticket services.",
      },
      {
        kind: "concept",
        title: "Virtual Network (VNet) and subnets",
        body:
          "A VNet is your private IP space in Azure. Subnets carve it up. Resources like VMs sit inside subnets.",
        bullets: [
          "Peering connects two VNets privately.",
          "NSGs apply traffic rules at the subnet or NIC level.",
        ],
      },
      {
        kind: "comparison",
        title: "Connecting on-prem to Azure",
        table: {
          columns: ["Option", "How it works", "When to pick it"],
          rows: [
            { label: "VPN Gateway", cells: ["Encrypted tunnel over the public internet", "Cost-sensitive, low-bandwidth"] },
            { label: "ExpressRoute", cells: ["Private, dedicated fiber via provider", "High bandwidth, no internet, predictable latency"] },
          ],
        },
      },
      {
        kind: "comparison",
        title: "Load balancers you'll be asked about",
        table: {
          columns: ["Service", "Level", "Scope"],
          rows: [
            { label: "Azure Load Balancer", cells: ["L4 (TCP/UDP)", "Regional"] },
            { label: "Application Gateway", cells: ["L7 (HTTP + WAF)", "Regional"] },
            { label: "Azure Front Door", cells: ["L7 + CDN + WAF", "Global"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Exam phrase matching",
        bullets: [
          "'No public internet' → ExpressRoute.",
          "'HTTP routing with WAF' → Application Gateway.",
          "'Global accelerated routing' → Front Door.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "VNet = your private space. Gateway or ExpressRoute = how you reach it from outside.",
      },
    ],
  },
  {
    id: "l-cs-4",
    topicId: "core-services",
    order: 4,
    title: "Storage and redundancy",
    summary:
      "Five storage types and four redundancy options — and which failure each one actually protects you from.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "Storage has two choices to make",
        body:
          "First: what type of data? (Blob, File, Queue, Table, Disk). Second: what failure do you want to survive? That's redundancy.",
      },
      {
        kind: "concept",
        title: "The five storage services",
        bullets: [
          "Blob — unstructured: images, video, backups.",
          "File — SMB/NFS shares, lift-and-shift of file servers.",
          "Queue — simple async messaging (small messages).",
          "Table — legacy NoSQL key-value (prefer Cosmos for new).",
          "Disk — managed disks for VMs (HDD, SSD, Premium SSD).",
        ],
      },
      {
        kind: "comparison",
        title: "Redundancy: what each one protects you from",
        table: {
          columns: ["Option", "Copies", "Survives"],
          rows: [
            { label: "LRS", cells: ["3 in one DC", "Disk/rack failure"] },
            { label: "ZRS", cells: ["3 across AZs", "Whole DC outage"] },
            { label: "GRS", cells: ["LRS + async copy to paired region", "Regional outage"] },
            { label: "GZRS", cells: ["ZRS + async copy to paired region", "AZ + regional outage"] },
          ],
        },
      },
      {
        kind: "concept",
        title: "Blob access tiers",
        body:
          "Blob storage lets you trade storage cost for access cost. Pick based on how often you read the data.",
        bullets: [
          "Hot — frequent access.",
          "Cool — 30+ days between accesses.",
          "Cold — 90+ days between accesses.",
          "Archive — offline, rehydrate in hours. Cheapest to store, most expensive to read.",
        ],
      },
      {
        kind: "tip",
        title: "Exam shortcuts",
        bullets: [
          "'Images and video' → Blob.",
          "'SMB file share' → Azure Files.",
          "'Survive a region outage' → GRS or GZRS.",
          "'Backups you almost never read' → Archive tier.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "LRS = one DC. ZRS = zones. GRS/GZRS = across regions.",
      },
    ],
  },
  {
    id: "l-cs-5",
    topicId: "core-services",
    order: 5,
    title: "Databases on Azure",
    summary:
      "Relational vs NoSQL, managed vs self-managed — picking the right database in under 30 seconds.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Two questions to ask first",
        bullets: [
          "Is my data relational (tables with joins) or non-relational (documents, key-value, graph)?",
          "How much do I want Microsoft to manage?",
        ],
      },
      {
        kind: "concept",
        title: "The SQL Server trio",
        body:
          "If the answer is 'relational + SQL Server,' Azure gives you three flavors with increasing control.",
        bullets: [
          "Azure SQL Database — PaaS, fully managed, best for new cloud apps.",
          "Azure SQL Managed Instance — near 100% compatibility with on-prem SQL, easier lift-and-shift.",
          "SQL Server on Azure VM — raw IaaS, maximum control, you patch.",
        ],
      },
      {
        kind: "concept",
        title: "Other relational options",
        bullets: [
          "Azure Database for MySQL — managed MySQL.",
          "Azure Database for PostgreSQL — managed PostgreSQL (with Flexible Server).",
          "Azure Database for MariaDB — managed MariaDB.",
        ],
      },
      {
        kind: "concept",
        title: "Cosmos DB — the global NoSQL option",
        body:
          "Cosmos is globally distributed, multi-model, and low-latency. Five consistency levels let you trade correctness for speed.",
        bullets: [
          "Multi-model: SQL (Core), MongoDB, Cassandra, Gremlin, Table APIs.",
          "Single-digit millisecond latency anywhere you replicate.",
          "Use when you need global reads and writes with low latency.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Azure SQL for relational. Cosmos for global NoSQL. Managed Instance for lift-and-shift.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Chapter 3: Solutions & Tools
  // ─────────────────────────────────────────────────────────────────
  {
    id: "l-st-1",
    topicId: "solutions-tools",
    order: 1,
    title: "Higher-level solutions: IoT, AI, Big Data",
    summary:
      "The brand-name services you'll see mentioned — and which problem each one solves.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Azure beyond compute and storage",
        body:
          "Azure has hundreds of services. The exam only cares that you can recognize a handful of categories and the lead service inside each.",
      },
      {
        kind: "concept",
        title: "IoT",
        bullets: [
          "IoT Hub — the backbone for device-to-cloud and cloud-to-device messaging.",
          "IoT Central — a managed SaaS dashboard on top of IoT Hub. UI-first, no code.",
          "Azure Sphere — secured microcontroller + OS + cloud security for edge devices.",
        ],
      },
      {
        kind: "concept",
        title: "AI & machine learning",
        bullets: [
          "Azure AI Services (formerly Cognitive Services) — pre-built APIs for vision, speech, language, decision.",
          "Azure Machine Learning — end-to-end platform for building and training custom models.",
          "Azure OpenAI Service — enterprise-grade access to GPT-4, DALL-E, embeddings.",
        ],
      },
      {
        kind: "concept",
        title: "Big data & analytics",
        bullets: [
          "Azure Synapse Analytics — unified analytics (warehouse + Spark + SQL).",
          "Azure Databricks — managed Apache Spark with collaborative notebooks.",
          "HDInsight — managed Hadoop/Spark/Kafka/HBase.",
          "Data Lake Storage Gen2 — hierarchical storage for big data workloads.",
        ],
      },
      {
        kind: "tip",
        title: "Exam pattern",
        bullets: [
          "'Pre-built translation API' → Azure AI Services (Cognitive Services).",
          "'Train a custom ML model' → Azure Machine Learning.",
          "'IoT dashboard with no code' → IoT Central.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Pre-built = AI Services. Build-your-own = Azure ML.",
      },
    ],
  },
  {
    id: "l-st-2",
    topicId: "solutions-tools",
    order: 2,
    title: "Managing Azure: Portal, CLI, ARM, Bicep",
    summary:
      "The tools you use to interact with Azure — from clicking buttons to writing infrastructure as code.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Four ways to touch Azure",
        body:
          "You can manage Azure from a browser, a shell, code, or a phone. The exam distinguishes the interactive tools from the infrastructure-as-code tools.",
      },
      {
        kind: "comparison",
        title: "The management tools",
        table: {
          columns: ["Tool", "Where it lives", "When to use"],
          rows: [
            { label: "Azure Portal", cells: ["Web UI", "Exploration, one-off changes"] },
            { label: "Azure CLI", cells: ["Bash/sh", "Cross-platform scripting"] },
            { label: "Azure PowerShell", cells: ["PowerShell", "Windows and automation"] },
            { label: "Cloud Shell", cells: ["Browser", "Pre-authenticated Bash or PowerShell"] },
            { label: "Azure Mobile App", cells: ["iOS/Android", "Monitoring on the go"] },
          ],
        },
      },
      {
        kind: "concept",
        title: "Infrastructure as Code",
        body:
          "Instead of clicking, you declare the desired state in a file and Azure makes reality match. This is reproducible, versionable, and reviewable.",
        bullets: [
          "ARM templates — declarative JSON, original IaC for Azure.",
          "Bicep — cleaner DSL that compiles to ARM. Recommended for new projects.",
        ],
      },
      {
        kind: "tip",
        title: "ARM vs Bicep",
        body:
          "Both produce the same result. Bicep is shorter, easier to read, and ships with official tooling. If the exam asks 'what's the recommended IaC for new Azure projects?' — it's Bicep.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Portal for exploration, CLI/PowerShell for scripting, Bicep for reproducible deployments.",
      },
    ],
  },
  {
    id: "l-st-3",
    topicId: "solutions-tools",
    order: 3,
    title: "Monitoring the cloud",
    summary:
      "Five tools that sound alike but do different things. The #1 source of exam confusion.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "'The monitoring stack'",
        body:
          "Azure has five observability tools that get mixed up constantly. If you can explain what each one does in one sentence, you'll bank easy points.",
      },
      {
        kind: "concept",
        title: "Azure Monitor — the umbrella",
        body:
          "Collects metrics and logs from every Azure resource. Alerts, dashboards, and workbooks are built on top. If the question says 'platform-level telemetry,' it's Monitor.",
      },
      {
        kind: "concept",
        title: "Log Analytics",
        body:
          "The Kusto (KQL) query interface over Azure Monitor logs. You write queries here to investigate.",
      },
      {
        kind: "concept",
        title: "Application Insights",
        body:
          "Application performance management (APM). Tracks requests, failures, dependencies, user flows for web apps. Feeds into Monitor.",
      },
      {
        kind: "concept",
        title: "Azure Advisor",
        body:
          "Personalized best-practice recommendations across five pillars: cost, security, reliability, operational excellence, performance.",
      },
      {
        kind: "concept",
        title: "Service Health",
        body:
          "Shows you outages and planned maintenance that affect YOUR resources specifically — not generic status page info.",
      },
      {
        kind: "tip",
        title: "The one-line cheat sheet",
        bullets: [
          "Monitor = your telemetry.",
          "Advisor = Microsoft's suggestions.",
          "Service Health = outages impacting you.",
          "App Insights = APM for a web app.",
          "Log Analytics = the query engine over logs.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Monitor collects. Advisor suggests. Service Health warns. App Insights traces. Log Analytics queries.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Chapter 4: Security
  // ─────────────────────────────────────────────────────────────────
  {
    id: "l-sn-1",
    topicId: "security-network",
    order: 1,
    title: "Defense in depth",
    summary:
      "Layered security — if one control fails, the next layer catches the attack. The mental model behind every security question.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "No single layer is perfect",
        body:
          "Security is layered. Microsoft's model uses seven layers, and every security service fits into one. If you know the layer, you can usually guess the right answer.",
      },
      {
        kind: "concept",
        title: "The seven layers",
        bullets: [
          "Physical — datacenter security (Microsoft's job).",
          "Identity & access — Entra ID, MFA, Conditional Access.",
          "Perimeter — DDoS Protection, Azure Firewall.",
          "Network — NSGs, segmentation, subnets.",
          "Compute — malware protection, patching, disk encryption.",
          "Application — secure SDLC, Web App Firewall.",
          "Data — encryption at rest, encryption in transit, key management.",
        ],
      },
      {
        kind: "example",
        title: "How the layers stack",
        body:
          "An attacker trying to steal a database breaks through perimeter (blocked by firewall), tries network (blocked by NSG), tries compute (blocked by hardened VM), tries the app (blocked by WAF), reaches data (blocked by encryption + key vault). Every layer adds independent cost.",
      },
      {
        kind: "tip",
        title: "Layer identification",
        bullets: [
          "Azure Firewall → perimeter.",
          "NSG → network.",
          "Key Vault → data.",
          "MFA → identity & access.",
          "WAF → application.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Layered security means no single control has to be perfect — and none is.",
      },
    ],
  },
  {
    id: "l-sn-2",
    topicId: "security-network",
    order: 2,
    title: "The network security stack",
    summary:
      "NSGs, Azure Firewall, WAF, DDoS — what each one does and how they fit together.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "Not one firewall — several",
        body:
          "Azure has multiple overlapping network-security services. They're complementary, not alternatives. Know what each solves.",
      },
      {
        kind: "comparison",
        title: "The four to know",
        table: {
          columns: ["Service", "What it does", "Layer"],
          rows: [
            { label: "Network Security Group", cells: ["5-tuple allow/deny rules at subnet or NIC", "Network (L3/L4)"] },
            { label: "Azure Firewall", cells: ["Stateful managed firewall with threat intel", "Perimeter (L3–L7)"] },
            { label: "Web Application Firewall", cells: ["OWASP protection on HTTP traffic", "Application (L7)"] },
            { label: "DDoS Protection", cells: ["Volumetric and protocol attack defense", "Perimeter"] },
          ],
        },
      },
      {
        kind: "concept",
        title: "NSG vs Azure Firewall",
        body:
          "NSG is simple, free, and local (per subnet or NIC). Azure Firewall is a full managed PaaS with threat intelligence, FQDN filtering, and (in Premium tier) TLS inspection. Most architectures use both.",
      },
      {
        kind: "concept",
        title: "DDoS Basic vs Standard",
        bullets: [
          "Basic — free, automatic on every public IP. Protects against common attacks.",
          "Standard — paid, adds real-time telemetry, mitigation tuning, and cost protection against scale-out bills caused by attacks.",
        ],
      },
      {
        kind: "concept",
        title: "Azure Bastion",
        body:
          "Need to RDP or SSH into a VM without giving it a public IP? Bastion brokers the connection through the portal over TLS. The VM never exposes port 22 or 3389.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "NSG is free and simple. Azure Firewall adds threat intel. WAF protects apps. Bastion saves you from public IPs.",
      },
    ],
  },
  {
    id: "l-sn-3",
    topicId: "security-network",
    order: 3,
    title: "Defender for Cloud, Sentinel, and Key Vault",
    summary:
      "Three security services you'll be asked about. Each does a different job — don't confuse them.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Three roles, three products",
        body:
          "Defender for Cloud does posture and workload protection. Sentinel does SIEM. Key Vault stores secrets. Know which is which.",
      },
      {
        kind: "concept",
        title: "Microsoft Defender for Cloud",
        body:
          "Two products in one: Cloud Security Posture Management (CSPM) and Cloud Workload Protection (CWP).",
        bullets: [
          "Secure Score — 0–100% measurement of your security posture.",
          "Regulatory compliance dashboards (ISO, PCI, NIST).",
          "Covers Azure AND AWS and GCP resources.",
          "Workload protection plans per resource type (VMs, SQL, containers, etc.).",
        ],
      },
      {
        kind: "concept",
        title: "Microsoft Sentinel",
        body:
          "Cloud-native SIEM + SOAR. Ingests logs from anywhere, detects threats with analytics rules, and automates response via Logic Apps-based playbooks.",
        bullets: [
          "Connectors for Azure, AWS, M365, firewalls, on-prem.",
          "ML-powered analytics rules.",
          "Automated response playbooks.",
        ],
      },
      {
        kind: "concept",
        title: "Azure Key Vault",
        body:
          "Centralized, HSM-backed store for secrets, keys, and certificates. Use managed identities to let your apps authenticate without credentials in code.",
        bullets: [
          "Soft delete + purge protection prevent accidental loss.",
          "RBAC or access policies control who reads what.",
        ],
      },
      {
        kind: "tip",
        title: "Which one does what",
        bullets: [
          "'Measures security posture' → Secure Score (Defender).",
          "'SIEM' → Sentinel.",
          "'Store a connection string securely' → Key Vault.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Defender measures + protects. Sentinel hunts + responds. Key Vault stores secrets.",
      },
    ],
  },

  // ─────────────────────────────────────────────────────────────────
  // Chapter 5: Identity, Governance, Privacy & Compliance
  // ─────────────────────────────────────────────────────────────────
  {
    id: "l-ig-1",
    topicId: "identity-governance",
    order: 1,
    title: "Microsoft Entra ID — your identity backbone",
    summary:
      "Entra ID (formerly Azure AD) is Microsoft's cloud identity service. What it is, what it isn't, and how it compares to on-prem AD.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Identity first",
        body:
          "Every Azure subscription and every Microsoft 365 tenant sits on top of Microsoft Entra ID. Get this one right and half the governance domain falls into place.",
      },
      {
        kind: "concept",
        title: "What Entra ID is",
        body:
          "A cloud-based identity and access management (IAM) service. It authenticates users for Azure, Microsoft 365, and thousands of SaaS apps via OAuth 2.0, OIDC, and SAML.",
        bullets: [
          "Tenant = a dedicated instance of Entra ID.",
          "Users, groups, guests (B2B), consumers (B2C).",
          "Supports SSO, MFA, Conditional Access.",
        ],
      },
      {
        kind: "concept",
        title: "What Entra ID is NOT",
        body:
          "It is NOT a replacement for on-premises Active Directory Domain Services. Different protocols, different purpose.",
        bullets: [
          "AD DS uses Kerberos, LDAP, NTLM. Entra ID uses OAuth, OIDC, SAML.",
          "AD DS has forests and OUs. Entra ID has a flat tenant structure.",
          "AD DS is for Windows domains and group policy. Entra ID is for cloud and SaaS SSO.",
        ],
      },
      {
        kind: "tip",
        title: "Hybrid identity",
        body:
          "You can connect your on-prem AD to Entra ID using Entra Connect. That gives users one identity across on-prem and cloud — but it doesn't eliminate either system.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Entra ID = cloud identity. AD DS = on-prem identity. They coexist; one doesn't replace the other.",
      },
    ],
  },
  {
    id: "l-ig-2",
    topicId: "identity-governance",
    order: 2,
    title: "Authentication methods and MFA",
    summary:
      "Passwords are the weakest link. MFA, passwordless, and Conditional Access are how you shore up the front door.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Proving who you are",
        body:
          "Authentication is step one of identity. Entra ID supports several methods, and the exam expects you to know them.",
      },
      {
        kind: "concept",
        title: "Methods",
        bullets: [
          "Passwords — weakest, still common.",
          "Multi-factor authentication — something you know + something you have / are.",
          "Passwordless — Windows Hello, FIDO2 keys, Authenticator phone sign-in.",
          "Self-service password reset (SSPR) — lets users reset without calling IT.",
        ],
      },
      {
        kind: "concept",
        title: "Single sign-on (SSO)",
        body:
          "Sign in once, access many apps. Entra ID federates with thousands of SaaS apps so users don't juggle passwords.",
      },
      {
        kind: "concept",
        title: "Conditional Access — the policy engine",
        body:
          "Conditional Access sits between authentication and access. It evaluates signals and enforces decisions. Think 'if-then' for identity.",
        bullets: [
          "Signals: user/group, device state, location, app, risk level.",
          "Decisions: allow, block, require MFA, require compliant device.",
          "Example: 'Require MFA when signing in from outside the trusted network.'",
        ],
      },
      {
        kind: "tip",
        title: "Exam shortcuts",
        bullets: [
          "'Prompt for MFA only from untrusted locations' → Conditional Access.",
          "'Let users reset their own password' → SSPR.",
          "'Sign in with a FIDO2 key' → passwordless.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "MFA stops most attacks. Conditional Access decides when to enforce it.",
      },
    ],
  },
  {
    id: "l-ig-3",
    topicId: "identity-governance",
    order: 3,
    title: "RBAC — who can do what",
    summary:
      "Role-Based Access Control: three ingredients (principal, role, scope) that answer every 'who can do this?' question.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Authentication vs Authorization",
        body:
          "Authentication = who you are. Authorization = what you can do. RBAC handles the second half.",
      },
      {
        kind: "concept",
        title: "The three ingredients",
        bullets: [
          "Security principal — who: user, group, service principal, or managed identity.",
          "Role definition — what: a set of allowed actions (Owner, Contributor, Reader, custom).",
          "Scope — where: management group, subscription, resource group, or resource.",
        ],
      },
      {
        kind: "concept",
        title: "Built-in roles you'll recognize",
        bullets: [
          "Owner — full control, including access assignment.",
          "Contributor — full control except access assignment.",
          "Reader — read-only view.",
          "User Access Administrator — manage access only.",
        ],
      },
      {
        kind: "concept",
        title: "Scope and inheritance",
        body:
          "Scope follows Azure's management hierarchy. Assignments at a higher scope inherit downward.",
        highlight:
          "Management Group → Subscription → Resource Group → Resource.",
      },
      {
        kind: "tip",
        title: "Common exam patterns",
        bullets: [
          "'Grant read-only access to a storage account' → assign Reader at resource scope.",
          "'Grant full admin to a whole subscription' → Owner at subscription scope.",
          "'Principle of least privilege' → pick the narrowest role at the narrowest scope that gets the job done.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "RBAC = principal + role + scope. Know that triplet and you can answer any access question.",
      },
    ],
  },
  {
    id: "l-ig-4",
    topicId: "identity-governance",
    order: 4,
    title: "Governance: Policy, Locks, Tags",
    summary:
      "How organizations keep their Azure estate organized, compliant, and safe from accidents.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "Governance, simply",
        body:
          "Governance is how you enforce rules, label resources, and prevent mistakes at scale. Four tools do most of the work.",
      },
      {
        kind: "concept",
        title: "Azure Policy",
        body:
          "Define rules. Policy evaluates existing resources and blocks non-compliant deployments. Auto-remediation is supported.",
        bullets: [
          "Example: 'Only allow VMs in East US.'",
          "Example: 'Require a \"CostCenter\" tag on every resource.'",
          "Policy vs RBAC: Policy decides WHAT can be deployed. RBAC decides WHO can deploy.",
        ],
      },
      {
        kind: "concept",
        title: "Resource Locks",
        body:
          "Prevent accidents on critical resources. Two flavors:",
        bullets: [
          "CanNotDelete — edits allowed, deletion blocked.",
          "ReadOnly — neither edits nor deletion allowed.",
        ],
      },
      {
        kind: "concept",
        title: "Tags",
        body:
          "Key-value metadata for billing, ownership, environment. Tags do NOT inherit automatically — enforce with policy if you want consistency.",
        bullets: [
          "Example: { \"Environment\": \"Production\", \"Owner\": \"team-web\" }",
          "Used by Cost Management for billing breakdowns.",
        ],
      },
      {
        kind: "concept",
        title: "Management Groups",
        body:
          "Top of the hierarchy. Group multiple subscriptions and apply policies + RBAC in one place. Useful once you manage more than a handful of subscriptions.",
      },
      {
        kind: "tip",
        title: "Quick identification",
        bullets: [
          "'Prevent deletion of a resource' → Resource Lock (CanNotDelete).",
          "'Only allow certain regions' → Azure Policy.",
          "'Group subscriptions for shared policy' → Management Group.",
          "'Tag resources for billing' → Tags (enforced by Policy).",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Policy enforces rules. Locks prevent mistakes. Tags organize. Management Groups scale it all.",
      },
    ],
  },
];

export const ALL_LESSONS: Lesson[] = [
  ...AZ900_LESSONS,
  ...AWS_CCP_LESSONS,
  ...MS900_LESSONS,
];

export const LESSONS_BY_TOPIC: Record<string, Lesson[]> = ALL_LESSONS.reduce(
  (acc, l) => {
    (acc[l.topicId] ||= []).push(l);
    return acc;
  },
  {} as Record<string, Lesson[]>
);

export const LESSON_MAP: Record<string, Lesson> = ALL_LESSONS.reduce(
  (acc, l) => ({ ...acc, [l.id]: l }),
  {}
);

export function getTopicLessons(topicId: string): Lesson[] {
  return (LESSONS_BY_TOPIC[topicId] || []).sort((a, b) => a.order - b.order);
}

export function getLessonsForExam(examId: ExamId): Lesson[] {
  return ALL_LESSONS.filter((l) => {
    const topic = TOPIC_MAP[l.topicId];
    return topic?.examId === examId;
  });
}

export function getNextLesson(lessonId: string): Lesson | null {
  const current = LESSON_MAP[lessonId];
  if (!current) return null;
  const topicLessons = getTopicLessons(current.topicId);
  const idx = topicLessons.findIndex((l) => l.id === lessonId);
  if (idx >= 0 && idx < topicLessons.length - 1) return topicLessons[idx + 1];
  return null;
}

export function getPrevLesson(lessonId: string): Lesson | null {
  const current = LESSON_MAP[lessonId];
  if (!current) return null;
  const topicLessons = getTopicLessons(current.topicId);
  const idx = topicLessons.findIndex((l) => l.id === lessonId);
  if (idx > 0) return topicLessons[idx - 1];
  return null;
}
