import type { ExamId, Topic } from "../types";
import { AWS_CCP_TOPICS } from "./exams/aws-ccp";
import { MS900_TOPICS } from "./exams/ms-900";
import { AI900_TOPICS } from "./exams/ai-900";
import { SEC_PLUS_TOPICS } from "./exams/sec-plus";
import { AWS_AIP_TOPICS } from "./exams/aws-aip";
import { GCP_CDL_TOPICS } from "./exams/gcp-cdl";

export const AZ900_TOPICS: Topic[] = [
  {
    id: "cloud-concepts",
    examId: "az-900",
    name: "Cloud Concepts",
    shortName: "Cloud Concepts",
    weight: 0.25,
    summary:
      "Fundamentals of cloud computing — what it is, why it matters, and how services are delivered and deployed.",
    subtopics: [
      "Benefits of cloud (scalability, elasticity, high availability, disaster recovery)",
      "Cloud service models: IaaS, PaaS, SaaS",
      "Cloud deployment models: public, private, hybrid",
      "Capital vs operational expenditure",
      "Shared responsibility model",
      "Cloud economics and consumption-based pricing",
    ],
    keyFacts: [
      "IaaS gives the most control; SaaS gives the least.",
      "Elasticity = automatic scaling. Scalability = manual capacity growth.",
      "Public cloud: lower cost, less control. Private cloud: more control, higher cost.",
      "Hybrid cloud connects on-prem with public cloud for flexibility and compliance.",
      "In IaaS, the customer manages OS, runtime, apps; in PaaS, the provider manages OS + runtime.",
      "CapEx = upfront hardware spend. OpEx = ongoing consumption-based spend.",
    ],
    cramSheet: [
      "Cloud = on-demand delivery of IT over the internet, pay-as-you-go.",
      "5 characteristics: on-demand self-service, broad network access, resource pooling, rapid elasticity, measured service.",
      "IaaS = VMs. PaaS = App Service. SaaS = Microsoft 365.",
      "Shared responsibility: security IN the cloud (you) vs security OF the cloud (Azure).",
      "Customer always owns data and identities regardless of model.",
    ],
    review: {
      examWeight: "25–30% of the exam",
      overview:
        "This domain is pure vocabulary and mental models. No hands-on skills are tested — you're being asked to explain *why* cloud exists and what the core tradeoffs are. Expect questions that sound like word problems: 'A company wants X with Y constraint — which cloud model fits?' The fastest path to pass this domain is to internalize a handful of definitions (CapEx vs OpEx, IaaS vs PaaS vs SaaS, public vs private vs hybrid) plus the shared responsibility model, and then pattern-match question stems to those concepts.",
      sections: [
        {
          heading: "What 'cloud' actually means",
          body:
            "Cloud computing is the on-demand delivery of compute, storage, networking, and software over the internet, billed by consumption. NIST defines five essential characteristics that all cloud services share:",
          bullets: [
            "On-demand self-service — provision resources without human interaction from the provider.",
            "Broad network access — reachable over standard networks from any device.",
            "Resource pooling — multi-tenant; resources are dynamically assigned from a shared pool.",
            "Rapid elasticity — scale out and back in automatically based on demand.",
            "Measured service — usage is metered and you are billed accordingly.",
          ],
        },
        {
          heading: "CapEx vs OpEx (and why cloud is always OpEx)",
          body:
            "CapEx (capital expenditure) means buying hardware upfront. You own it, you depreciate it, and you carry the maintenance cost whether or not you use it. OpEx (operational expenditure) means paying for consumption as you go. No ownership, no upfront commitment, and your bill tracks actual use. Cloud is fundamentally OpEx — you rent compute by the second, storage by the GB-month, and egress by the GB. If the exam mentions 'no upfront hardware cost' or 'pay only for what you use,' the answer is OpEx.",
        },
        {
          heading: "Cloud service models: IaaS, PaaS, SaaS",
          body:
            "The service model defines who manages which layer of the stack. The rule of thumb: as you move from IaaS → PaaS → SaaS, you give up control and gain convenience. Data and identities are always your responsibility regardless of model.",
          table: {
            columns: ["Layer", "IaaS (VM)", "PaaS (App Service)", "SaaS (M365)"],
            rows: [
              { label: "Applications", cells: ["You", "You", "Provider"] },
              { label: "Data", cells: ["You", "You", "You"] },
              { label: "Runtime", cells: ["You", "Provider", "Provider"] },
              { label: "OS / middleware", cells: ["You", "Provider", "Provider"] },
              { label: "Virtualization", cells: ["Provider", "Provider", "Provider"] },
              { label: "Physical servers", cells: ["Provider", "Provider", "Provider"] },
              { label: "Networking / storage", cells: ["Provider", "Provider", "Provider"] },
            ],
          },
        },
        {
          heading: "Cloud deployment models",
          body:
            "Deployment model describes *where* the cloud runs and *who* shares it. The three you must know cold are public, private, and hybrid. 'Multi-cloud' (multiple public providers) and 'community cloud' appear as distractors.",
          bullets: [
            "Public: infrastructure is shared among many tenants. Lowest cost, highest scale, least control. Azure, AWS, GCP are all public clouds.",
            "Private: dedicated infrastructure for a single organization, on-prem or hosted. Highest control, typically highest cost.",
            "Hybrid: a public and private environment connected via VPN or ExpressRoute. Used when some data must stay private (compliance, latency) but other workloads benefit from public cloud elasticity.",
            "Multi-cloud: using two or more public providers. Not the same as hybrid.",
          ],
        },
        {
          heading: "The shared responsibility model",
          body:
            "This is the single most tested concept in the domain. Microsoft handles security *of* the cloud (physical DCs, hypervisor, underlying network). You handle security *in* the cloud (your data, your access controls, your app code). Your share of responsibility grows as you move from SaaS → PaaS → IaaS. But three things are always yours no matter what: data, endpoints, and identities/accounts.",
        },
        {
          heading: "Benefits of cloud (and the pairs that trip people up)",
          body:
            "You'll be asked to name the benefit that matches a scenario. Learn the distinctions — especially scalability vs elasticity and high availability vs disaster recovery.",
          bullets: [
            "Scalability — the capability to grow (scale up = bigger machine; scale out = more machines). Manual or automatic.",
            "Elasticity — automatic, bidirectional scaling that matches real-time demand. Elasticity is a subset of scalability.",
            "High availability (HA) — minimal downtime during normal operation; failover keeps the service running.",
            "Disaster recovery (DR) — process of restoring service after a major incident like a regional outage.",
            "Reliability — the system's ability to recover from failures and continue to function.",
            "Predictability — consistent performance and consistent cost (pricing calculator + reservations).",
            "Manageability — *of* the cloud (templates, autoscale) and *in* the cloud (portal, CLI, SDKs).",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "IaaS vs PaaS",
          explanation:
            "If you have to patch the operating system, it's IaaS. If Microsoft patches it, it's PaaS. App Service is PaaS. Virtual Machines are IaaS. Functions are PaaS (or 'serverless,' a subset of PaaS).",
        },
        {
          confusion: "Scalability vs elasticity",
          explanation:
            "Scalability is capacity growth. Elasticity is automatic, bidirectional, real-time scaling. Elasticity implies automation; scalability does not.",
        },
        {
          confusion: "High availability vs disaster recovery",
          explanation:
            "HA prevents downtime during everyday failures (a single VM dying). DR recovers from a catastrophe (an entire region going offline). Different problems, different solutions.",
        },
        {
          confusion: "Hybrid vs multi-cloud",
          explanation:
            "Hybrid = public + private. Multi-cloud = two or more public providers. The exam loves using these as distractors for each other.",
        },
        {
          confusion: "Data responsibility",
          explanation:
            "Data is always the customer's responsibility — even in SaaS. Microsoft 365 doesn't protect your data from accidental deletion by your users; that's on you.",
        },
      ],
      examTips: [
        "'Pay-as-you-go' or 'no upfront commitment' → OpEx.",
        "'Dedicated hardware' or 'single tenant' → private cloud.",
        "'Connect on-prem to cloud' → hybrid (via VPN Gateway or ExpressRoute).",
        "'Auto-scale based on demand' → elasticity, not just scalability.",
        "Any question mentioning data ownership → the customer, always.",
        "'Rapid recovery from a region outage' → disaster recovery.",
        "'Maintain uptime during a single VM failure' → high availability.",
      ],
    },
  },
  {
    id: "core-services",
    examId: "az-900",
    name: "Core Azure Services",
    shortName: "Core Services",
    weight: 0.25,
    summary:
      "Compute, networking, storage, and database services that form the backbone of Azure workloads.",
    subtopics: [
      "Compute: Virtual Machines, App Service, Container Instances, AKS, Functions",
      "Networking: Virtual Network, VPN Gateway, ExpressRoute, Load Balancer",
      "Storage: Blob, File, Queue, Table, Disk; redundancy options (LRS, ZRS, GRS)",
      "Databases: Azure SQL, Cosmos DB, Database for MySQL/PostgreSQL",
      "Azure regions, availability zones, region pairs",
    ],
    keyFacts: [
      "Availability Zones are physically separate datacenters within a region.",
      "LRS = 3 copies in one DC; ZRS = across zones; GRS = across paired regions.",
      "Cosmos DB is globally distributed, multi-model, with 5 consistency levels.",
      "Azure Functions is serverless, event-driven, billed per execution.",
      "AKS manages the control plane for free; you pay only for nodes.",
      "ExpressRoute is a private, dedicated connection — not over the public internet.",
    ],
    cramSheet: [
      "VMs = IaaS. App Service = PaaS.",
      "Blob storage for unstructured data; File for SMB shares; Queue for messaging.",
      "Region = geographic area. Availability Zone = isolated DC inside a region.",
      "GRS replicates to a paired region hundreds of miles away.",
      "AKS = Kubernetes on Azure, control plane free.",
    ],
    review: {
      examWeight: "25–35% of the exam — the biggest domain",
      overview:
        "This is the domain where Azure becomes concrete. You need to know the categories (compute, networking, storage, database), the specific services inside each, and — most importantly — which service to reach for in which scenario. Expect 'pick the right tool' questions: 'A team needs X, which service fits?' The trick is recognizing which words in the stem point to which service. Build service-to-scenario associations (e.g., 'globally distributed NoSQL' = Cosmos DB, 'private dedicated connection' = ExpressRoute) and the questions become pattern matching.",
      sections: [
        {
          heading: "Azure global infrastructure",
          body:
            "Before services, learn the geography. Azure's global infrastructure has a hierarchy: geographies → regions → availability zones → datacenters. The exam tests the difference between a region and an availability zone, and the purpose of region pairs.",
          bullets: [
            "Region: a geographic area containing one or more datacenters (e.g., East US, West Europe). Services are deployed to a region.",
            "Availability Zone (AZ): a physically separate datacenter inside a region with independent power, cooling, and networking. Zone-redundant deployments have a 99.99% SLA.",
            "Region pair: two regions paired for geo-redundancy, usually hundreds of miles apart. Updates roll out sequentially and failure is isolated between them.",
            "Sovereign regions: isolated cloud environments for government or national compliance (Azure Government, Azure China). Different identity plane and separate from the public Azure.",
            "Azure Arc: extends Azure management to resources outside Azure (on-prem servers, other clouds).",
          ],
        },
        {
          heading: "Compute services — which one when",
          body:
            "There are many compute options because 'run my code' means different things. Memorize what each service *is for* — the exam will describe the need, and you pick the service.",
          table: {
            columns: ["Service", "Best for", "Billing"],
            rows: [
              {
                label: "Virtual Machines",
                cells: [
                  "Full OS control, lift-and-shift",
                  "Per second while running",
                ],
              },
              {
                label: "VM Scale Sets",
                cells: [
                  "Identical VMs with autoscale",
                  "Per VM in the set",
                ],
              },
              {
                label: "App Service",
                cells: [
                  "Web apps / APIs without managing OS",
                  "Per App Service plan",
                ],
              },
              {
                label: "Container Instances",
                cells: [
                  "Single container, no orchestration",
                  "Per second of container",
                ],
              },
              {
                label: "Azure Kubernetes Service",
                cells: [
                  "Managed Kubernetes cluster at scale",
                  "Nodes only (control plane free)",
                ],
              },
              {
                label: "Azure Functions",
                cells: [
                  "Event-driven code, scale-to-zero",
                  "Per execution (consumption)",
                ],
              },
            ],
          },
        },
        {
          heading: "Networking services",
          body:
            "Networking questions center on how to connect things securely. Know the difference between the connectivity options (VPN vs ExpressRoute) and the load-balancing options (Load Balancer vs Application Gateway vs Front Door).",
          bullets: [
            "Virtual Network (VNet): your private IP space in Azure. Resources deploy into subnets of a VNet.",
            "VNet Peering: low-latency, private connection between two VNets. No gateway needed.",
            "VPN Gateway: encrypted IPsec tunnel over the internet. Site-to-site (office to Azure) or point-to-site (single device).",
            "ExpressRoute: private, dedicated fiber circuit via a provider. Does NOT traverse the public internet. Higher cost, higher bandwidth (up to 100 Gbps), lower latency.",
            "Azure Load Balancer: Layer 4 (TCP/UDP). High-performance, region-scoped.",
            "Application Gateway: Layer 7 (HTTP/HTTPS). Includes WAF, SSL termination, cookie affinity, URL-based routing.",
            "Azure Front Door: global Layer 7 load balancer with WAF + CDN-like acceleration.",
            "Azure DNS / CDN: managed DNS service; CDN caches static assets at edge POPs.",
          ],
        },
        {
          heading: "Storage services and redundancy",
          body:
            "Storage has two things to learn: which storage type (Blob, File, Queue, Table, Disk) and which redundancy option (LRS, ZRS, GRS, GZRS). Blob is the workhorse for unstructured data.",
          table: {
            columns: ["Redundancy", "Copies", "Failure it protects against"],
            rows: [
              {
                label: "LRS (Locally Redundant)",
                cells: ["3 in one DC", "Disk/rack failures"],
              },
              {
                label: "ZRS (Zone Redundant)",
                cells: ["3 across AZs in one region", "Single-DC outage"],
              },
              {
                label: "GRS (Geo Redundant)",
                cells: ["LRS + async copy to paired region", "Regional outage"],
              },
              {
                label: "GZRS (Geo-Zone Redundant)",
                cells: ["ZRS + async copy to paired region", "AZ + regional outage"],
              },
            ],
          },
        },
        {
          heading: "Blob storage tiers",
          body:
            "Blob storage has access tiers that trade storage cost for retrieval cost. Pick based on access frequency.",
          bullets: [
            "Hot — frequent access, higher storage cost, lowest access cost.",
            "Cool — infrequent access (at least 30 days), lower storage cost, higher access cost.",
            "Cold — rarely accessed (at least 90 days), even cheaper storage.",
            "Archive — offline, hours to rehydrate, cheapest storage, highest access cost. Minimum 180 days.",
          ],
        },
        {
          heading: "Database services",
          body:
            "Relational vs non-relational is the first split. Then managed vs self-managed.",
          bullets: [
            "Azure SQL Database: PaaS SQL Server, fully managed, best for new cloud apps.",
            "Azure SQL Managed Instance: near-100% compatibility with on-prem SQL Server — easier lift-and-shift.",
            "SQL Server on Azure VM: raw IaaS, maximum control, you patch the OS and SQL.",
            "Azure Database for MySQL / PostgreSQL / MariaDB: managed open-source relational DBs.",
            "Cosmos DB: globally distributed NoSQL. Multi-model (SQL, MongoDB, Cassandra, Gremlin, Table) with 5 consistency levels (strong → eventual). Use when you need global low-latency reads/writes.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Region vs Availability Zone",
          explanation:
            "Region is a geographic area (e.g., East US). An AZ is a physically separate DC inside that region. Three AZs per supported region. Deploying across AZs protects against DC-level failures within a single region.",
        },
        {
          confusion: "LRS vs ZRS vs GRS",
          explanation:
            "LRS protects against disk failures. ZRS protects against a whole DC going down. GRS protects against an entire region going down. Pick based on the failure you're worried about.",
        },
        {
          confusion: "VPN Gateway vs ExpressRoute",
          explanation:
            "VPN = encrypted tunnel over the internet, cheap, good enough. ExpressRoute = private dedicated circuit, bypasses the internet, higher cost, higher guarantees. If the question says 'private' or 'no internet' → ExpressRoute.",
        },
        {
          confusion: "Load Balancer vs Application Gateway vs Front Door",
          explanation:
            "Load Balancer is L4 and regional. Application Gateway is L7 and regional (and includes WAF). Front Door is L7 and global (and also has WAF). If the question says 'HTTP routing' → App Gateway or Front Door. If it says 'global' → Front Door.",
        },
        {
          confusion: "Container Instances vs AKS",
          explanation:
            "ACI runs one container, no orchestration. AKS is full managed Kubernetes for clusters. Short-lived single container → ACI. Production microservices → AKS.",
        },
        {
          confusion: "App Service vs Functions",
          explanation:
            "App Service always has at least one instance running (plan-based). Functions can scale to zero and bill per execution. Steady-state web app → App Service. Event-driven / bursty → Functions.",
        },
      ],
      examTips: [
        "'Globally distributed, low-latency NoSQL' → Cosmos DB.",
        "'Dedicated, private, not over the internet' → ExpressRoute.",
        "'Run code without managing servers' → Azure Functions.",
        "'Managed Kubernetes' → AKS.",
        "'SMB file share in the cloud' → Azure Files.",
        "'Serve images/video/backups' → Azure Blob Storage.",
        "'Survive a regional outage' → GRS or GZRS.",
        "'Web app with autoscaling and no OS patching' → App Service.",
        "'Connect two VNets privately' → VNet Peering.",
      ],
    },
  },
  {
    id: "solutions-tools",
    examId: "az-900",
    name: "Core Solutions & Management Tools",
    shortName: "Solutions & Tools",
    weight: 0.2,
    summary:
      "Azure's higher-level solutions (IoT, AI, DevOps) and the tools used to manage and monitor resources.",
    subtopics: [
      "IoT Hub and IoT Central",
      "Big data: Synapse Analytics, HDInsight, Databricks",
      "AI: Azure Machine Learning, Cognitive Services, Bot Service",
      "Serverless: Functions, Logic Apps",
      "DevOps: Azure DevOps, GitHub, DevTest Labs",
      "Management: Portal, CLI, PowerShell, Cloud Shell, ARM templates, Bicep",
      "Monitoring: Azure Monitor, Log Analytics, Application Insights, Service Health",
    ],
    keyFacts: [
      "ARM templates are declarative JSON; Bicep is a cleaner DSL that compiles to ARM.",
      "Azure Monitor is the umbrella — Log Analytics and App Insights feed into it.",
      "Cognitive Services = pre-built AI APIs. Azure ML = build your own models.",
      "Logic Apps is low-code workflow; Functions is code-first.",
      "Cloud Shell runs in the browser with Bash or PowerShell pre-authenticated.",
      "Service Health shows outages affecting your resources specifically.",
    ],
    cramSheet: [
      "IoT Hub = device-to-cloud messaging; IoT Central = managed SaaS dashboard.",
      "ARM templates = infrastructure as code in JSON.",
      "Azure Monitor centralizes metrics + logs.",
      "Application Insights = APM for applications.",
      "Logic Apps = visual workflows; Functions = code triggers.",
    ],
    review: {
      examWeight: "15–20% of the exam",
      overview:
        "This domain is 'what's that service called?' Azure has a huge catalog of higher-level solutions (IoT, AI, Big Data, DevOps) and a stack of operational tools (CLI, ARM, Monitor). You don't need to know how to configure anything — you need to match purpose to product. The distinctions that matter most: Azure Monitor vs Service Health vs Advisor (the three 'M' tools get confused constantly), Cognitive Services vs Azure ML, and Logic Apps vs Functions.",
      sections: [
        {
          heading: "IoT solutions",
          body:
            "Azure has three IoT-related services. IoT Hub is the engine, IoT Central is the SaaS wrapper around it, and Azure Sphere is the hardware/OS combo for secure edge devices.",
          bullets: [
            "IoT Hub: bidirectional messaging between millions of devices and the cloud. Device twins, per-device authentication, routing to other Azure services.",
            "IoT Central: a managed application platform built on IoT Hub. UI-first, bring-your-own template, no coding required. For teams who want dashboards fast.",
            "Azure Sphere: secured microcontroller + custom Linux OS + cloud security service. End-to-end for connected device security.",
          ],
        },
        {
          heading: "Big data and analytics",
          body:
            "Three services handle large-scale data workloads. The differences are about how much Microsoft manages and what the query experience is like.",
          bullets: [
            "Azure Synapse Analytics: unified analytics platform. Combines data warehousing, big data (Spark), and SQL-based analytics into one workspace.",
            "Azure HDInsight: managed Hadoop/Spark/Kafka/HBase clusters. Good when you already have Hadoop-based workloads to migrate.",
            "Azure Databricks: managed Apache Spark with notebooks. Built in partnership with Databricks, collaborative, great for data science teams.",
            "Azure Data Lake Storage Gen2: hierarchical namespace built on top of Blob; designed for big-data workloads.",
          ],
        },
        {
          heading: "AI and machine learning",
          body:
            "The key distinction: pre-built vs do-it-yourself. Cognitive Services are APIs you call. Azure Machine Learning is where you build, train, and deploy custom models.",
          bullets: [
            "Azure AI Services (formerly Cognitive Services): pre-built APIs for vision, speech, language, and decision-making. No ML expertise required — make a REST call.",
            "Azure Machine Learning: end-to-end platform for building, training, and deploying custom models. Supports AutoML, designer UI, and SDK workflows.",
            "Azure Bot Service: develop, test, and publish conversational bots. Integrates with Language Understanding (LUIS) and QnA Maker.",
            "Azure OpenAI Service: access to OpenAI models (GPT-4, DALL-E, embeddings) with enterprise governance.",
          ],
        },
        {
          heading: "Serverless and messaging",
          body:
            "'Serverless' on Azure spans code (Functions), workflow (Logic Apps), and event routing (Event Grid). Event Hubs and Service Bus are related messaging tools.",
          bullets: [
            "Azure Functions: code-first, event-driven, scale to zero. Many triggers (HTTP, timer, queue, blob).",
            "Azure Logic Apps: low-code visual workflow with 400+ connectors. Pick this when the integration would otherwise require gluing many SaaS APIs.",
            "Event Grid: pub/sub event routing service. React to events across Azure with minimal code.",
            "Event Hubs: high-throughput event streaming (millions of events per second). Think of it as a managed Kafka alternative.",
            "Service Bus: enterprise messaging with queues and topics, ordered delivery, dead-letter queues. For classic enterprise integration patterns.",
          ],
        },
        {
          heading: "DevOps tools",
          body:
            "Microsoft's DevOps story has two umbrellas: Azure DevOps (the original suite) and GitHub (acquired in 2018). They overlap in capabilities and Microsoft is converging them over time.",
          bullets: [
            "Azure DevOps Services: Boards (work tracking), Repos (Git), Pipelines (CI/CD), Test Plans, Artifacts (package feeds).",
            "GitHub + GitHub Actions: source control + CI/CD. Default recommendation for most new projects.",
            "GitHub Copilot: AI pair programmer — code suggestions from natural-language prompts.",
            "Azure DevTest Labs: pre-configured dev/test environments with quotas and auto-shutdown policies.",
          ],
        },
        {
          heading: "Management tools",
          body:
            "You can manage Azure through a UI, a shell, code, or a phone. The exam distinguishes between the interactive tools and the infrastructure-as-code tools.",
          table: {
            columns: ["Tool", "When to use it"],
            rows: [
              { label: "Azure Portal", cells: ["Web UI, exploration, one-off changes"] },
              { label: "Azure CLI", cells: ["Cross-platform shell, Bash-friendly, scripting"] },
              { label: "Azure PowerShell", cells: ["Windows / PowerShell users, Cmdlet style"] },
              { label: "Azure Cloud Shell", cells: ["Browser-based shell, pre-authenticated, has Bash + PowerShell"] },
              { label: "Azure Mobile App", cells: ["On-the-go monitoring and basic actions"] },
              { label: "ARM templates", cells: ["Declarative JSON infrastructure-as-code"] },
              { label: "Bicep", cells: ["Cleaner DSL that compiles to ARM; recommended for new IaC"] },
              { label: "Azure SDKs", cells: ["Programmatic access from .NET, Python, JS, Go, Java"] },
            ],
          },
        },
        {
          heading: "Monitoring and recommendations",
          body:
            "These five tools sound alike but do different things. Mix them up on the exam and you'll lose points.",
          bullets: [
            "Azure Monitor: the umbrella. Collects metrics and logs from every Azure resource. Alerts and dashboards are built here.",
            "Log Analytics: the Kusto (KQL) query interface over Azure Monitor logs.",
            "Application Insights: APM for apps — request rates, failures, dependencies, user flows. Feeds into Azure Monitor.",
            "Azure Advisor: personalized best-practice recommendations across five pillars (cost, security, reliability, operational excellence, performance).",
            "Azure Service Health: outages and planned maintenance that affect YOUR resources specifically. Personalized view of the Azure status page.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Azure Monitor vs Service Health vs Advisor",
          explanation:
            "Monitor = your telemetry (metrics, logs, alerts). Service Health = Microsoft telling you about outages affecting you. Advisor = Microsoft telling you how to improve your setup.",
        },
        {
          confusion: "ARM vs Bicep",
          explanation:
            "Both are declarative IaC for Azure. ARM is raw JSON. Bicep is a friendlier DSL that compiles to ARM. For new projects, the recommendation is Bicep.",
        },
        {
          confusion: "Cognitive Services vs Azure ML",
          explanation:
            "Cognitive Services (now Azure AI Services) = pre-built APIs, no training. Azure ML = you build and train your own models.",
        },
        {
          confusion: "Logic Apps vs Functions",
          explanation:
            "Both are serverless. Logic Apps is low-code and visual, ideal for connecting SaaS. Functions is code-first, ideal for custom compute triggered by events.",
        },
        {
          confusion: "Event Grid vs Event Hubs vs Service Bus",
          explanation:
            "Event Grid = reactive event routing (pub/sub). Event Hubs = high-throughput streaming. Service Bus = enterprise messaging with queues/topics. The exam rarely dives deep but you need to recognize which is which.",
        },
        {
          confusion: "IoT Hub vs IoT Central",
          explanation:
            "IoT Hub is the engine you build on. IoT Central is the ready-made SaaS dashboard built on top of IoT Hub.",
        },
      ],
      examTips: [
        "'Personalized best-practice recommendations' → Azure Advisor.",
        "'Is this outage affecting my resources' → Azure Service Health.",
        "'APM for a web app' → Application Insights.",
        "'Low-code workflow connecting SaaS apps' → Logic Apps.",
        "'Pre-built translation or speech API' → Azure AI Services.",
        "'IoT dashboard with no code' → IoT Central.",
        "'Browser-based pre-authenticated shell' → Cloud Shell.",
        "'Declarative infrastructure as code' → ARM or Bicep (Bicep preferred for new work).",
      ],
    },
  },
  {
    id: "security-network",
    examId: "az-900",
    name: "Security & Network Security",
    shortName: "Security",
    weight: 0.15,
    summary:
      "Protecting Azure workloads using network controls, threat protection, and encryption.",
    subtopics: [
      "Defense in depth",
      "Microsoft Defender for Cloud",
      "Microsoft Sentinel (SIEM/SOAR)",
      "Key Vault for secrets, keys, certificates",
      "Network Security Groups and Application Security Groups",
      "Azure Firewall vs NSGs",
      "DDoS Protection (Basic vs Standard)",
      "Azure Bastion for secure RDP/SSH",
    ],
    keyFacts: [
      "NSGs act at subnet or NIC level using 5-tuple rules.",
      "Azure Firewall is stateful, fully managed, with threat intelligence.",
      "DDoS Basic is free and always on; Standard adds analytics and alerts.",
      "Key Vault uses HSMs and supports soft delete + purge protection.",
      "Defender for Cloud provides secure score and workload protection.",
      "Sentinel is cloud-native SIEM that ingests logs from anywhere.",
    ],
    cramSheet: [
      "Defense in depth = layered security: identity, perimeter, network, compute, app, data.",
      "NSG = basic firewall rules. Azure Firewall = advanced stateful firewall.",
      "Key Vault stores secrets; never hardcode credentials.",
      "Bastion = RDP/SSH through the portal, no public IP on VM.",
      "Sentinel = SIEM. Defender for Cloud = CSPM + workload protection.",
    ],
    review: {
      examWeight: "10–15% of the exam",
      overview:
        "Security is small on the exam but dense. You need a working mental model of defense in depth (the layered security principle), the difference between posture (Defender for Cloud) and SIEM (Sentinel), and the network security stack from NSGs up through Azure Firewall and WAF. Don't memorize ports — memorize *roles*. Each service fits into a layer of the stack.",
      sections: [
        {
          heading: "Defense in depth — the mental model",
          body:
            "Microsoft's security model is layered. If one control fails, the next layer catches the attack. No single layer is perfect. Expect an exam question where you're asked which layer a given service belongs to.",
          bullets: [
            "Physical — datacenter access, hardware security (Microsoft's responsibility).",
            "Identity & access — who can authenticate and what they can do (Entra ID, MFA, Conditional Access).",
            "Perimeter — traffic entering your network (DDoS Protection, Azure Firewall).",
            "Network — segmentation and east-west traffic (NSGs, ASGs, subnets).",
            "Compute — securing hosts (malware protection, patching, disk encryption).",
            "Application — secure dev and app-layer filtering (Web App Firewall, secure SDLC).",
            "Data — encryption at rest and in transit, key management.",
          ],
        },
        {
          heading: "Microsoft Defender for Cloud",
          body:
            "Defender for Cloud is two things in one product: Cloud Security Posture Management (CSPM) and Cloud Workload Protection (CWP). CSPM is free and tells you *what* to fix. CWP is paid per workload and actively defends VMs, databases, containers, etc.",
          bullets: [
            "Secure Score: a 0–100% measurement of your security posture based on recommended controls.",
            "Regulatory compliance: dashboards that map your resources to standards like ISO 27001, PCI DSS, NIST.",
            "Workload protection plans: per-resource-type (VMs, App Service, SQL, Storage, Key Vault, containers, ARM, DNS).",
            "Multi-cloud: Defender for Cloud covers AWS and GCP in addition to Azure.",
          ],
        },
        {
          heading: "Microsoft Sentinel (SIEM/SOAR)",
          body:
            "Sentinel is a cloud-native SIEM with built-in SOAR (orchestration + response). It ingests logs from anywhere — Azure, AWS, M365, firewalls, on-prem — and uses ML-based analytics and playbooks to detect and respond.",
          bullets: [
            "Connectors: hundreds, including non-Microsoft products.",
            "Workbooks: customizable investigation dashboards.",
            "Analytics rules: scheduled queries (KQL) that generate alerts.",
            "Hunting: proactive threat hunting with queries.",
            "Automation: playbooks (Logic Apps) that respond to alerts.",
          ],
        },
        {
          heading: "Key Vault — never hardcode a secret again",
          body:
            "Key Vault stores three things: secrets (connection strings, API keys), keys (encryption keys), and certificates (X.509). Backed by HSMs. The 'managed identity' pattern lets an Azure resource (like an App Service) authenticate to Key Vault without storing credentials anywhere.",
          bullets: [
            "Soft delete: deleted items are recoverable for a configurable retention period.",
            "Purge protection: prevents permanent deletion during the retention period, even by admins.",
            "Access control via Azure RBAC or Key Vault access policies (RBAC is the newer, recommended approach).",
            "HSM tier: FIPS 140-2 Level 3 for regulated workloads.",
          ],
        },
        {
          heading: "Network security stack",
          body:
            "Three tools handle different levels of network security. They are complementary, not alternatives.",
          table: {
            columns: ["Tool", "What it does", "Level"],
            rows: [
              {
                label: "NSG",
                cells: ["5-tuple allow/deny rules applied at subnet or NIC", "L3/L4"],
              },
              {
                label: "Azure Firewall",
                cells: ["Stateful managed firewall with threat intel, FQDN rules, TLS inspect (Premium)", "L3–L7"],
              },
              {
                label: "Web Application Firewall",
                cells: ["OWASP-rule protection on top of App Gateway / Front Door", "L7"],
              },
            ],
          },
        },
        {
          heading: "Other network security essentials",
          bullets: [
            "Application Security Group (ASG): tag-like grouping of VMs so you can write NSG rules like 'allow web-servers → db-servers' instead of maintaining IP lists.",
            "DDoS Protection Basic: free and automatic on every Azure public IP.",
            "DDoS Protection Standard: paid, adds analytics, mitigation tuning, and cost protection against DDoS-induced scale-out.",
            "Azure Bastion: fully managed RDP/SSH through the portal over TLS. VMs don't need a public IP.",
            "Private Endpoint / Private Link: expose Azure PaaS services (Storage, SQL, etc.) over a private IP inside your VNet.",
          ],
        },
        {
          heading: "Encryption",
          body:
            "Azure encrypts data at rest by default (Storage Service Encryption). VM disks are encrypted with Azure Disk Encryption (BitLocker for Windows, dm-crypt for Linux). In transit, everything is TLS 1.2+. Customer-managed keys (CMK) let you control the encryption keys via Key Vault instead of Microsoft-managed keys.",
        },
      ],
      gotchas: [
        {
          confusion: "NSG vs Azure Firewall",
          explanation:
            "NSG is a simple 5-tuple packet filter at subnet/NIC level. Azure Firewall is a full stateful L3-L7 firewall with threat intelligence, FQDN filtering, and (in Premium) TLS inspection. Use NSGs for basic segmentation; add Firewall for perimeter control.",
        },
        {
          confusion: "Defender for Cloud vs Sentinel",
          explanation:
            "Defender for Cloud = posture management + workload protection. Sentinel = SIEM/SOAR. Defender alerts can flow into Sentinel; together they form a fuller picture.",
        },
        {
          confusion: "DDoS Basic vs Standard",
          explanation:
            "Basic is free and automatic on every public IP. Standard is paid, adds analytics, mitigation tuning, and cost protection. Exam-relevant phrase: 'near real-time telemetry' → Standard.",
        },
        {
          confusion: "Azure Bastion purpose",
          explanation:
            "Bastion solves 'I need to RDP/SSH into a VM without giving it a public IP.' It runs in the VNet and brokers the session through the Azure portal.",
        },
        {
          confusion: "Private Endpoint vs Service Endpoint",
          explanation:
            "Private Endpoint puts a private IP for a PaaS service inside your VNet (fully private). Service Endpoint keeps traffic on the Azure backbone but the service still has a public IP. Private Endpoint is more secure.",
        },
      ],
      examTips: [
        "'Store connection strings and API keys securely' → Key Vault.",
        "'RDP/SSH a VM without a public IP' → Azure Bastion.",
        "'Cloud-native SIEM' → Microsoft Sentinel.",
        "'Measures your security posture' → Secure Score (inside Defender for Cloud).",
        "'Layered security' → defense in depth.",
        "'Stateful firewall with threat intelligence' → Azure Firewall (not NSG).",
        "'Protect a web app from SQL injection / XSS' → Web Application Firewall on App Gateway or Front Door.",
      ],
    },
  },
  {
    id: "identity-governance",
    examId: "az-900",
    name: "Identity, Governance, Privacy & Compliance",
    shortName: "Identity & Governance",
    weight: 0.15,
    summary:
      "Who can do what, under which rules — identity, access, policy, cost, and compliance.",
    subtopics: [
      "Microsoft Entra ID (formerly Azure AD) — users, groups, tenants",
      "Authentication vs Authorization",
      "Multi-factor authentication and Conditional Access",
      "Role-Based Access Control (RBAC)",
      "Azure Policy and Blueprints",
      "Resource locks and tags",
      "Microsoft Purview for governance and compliance",
      "Trust Center, Service Trust Portal, compliance offerings",
    ],
    keyFacts: [
      "Entra ID is Microsoft's cloud identity service, not a replacement for on-prem AD.",
      "Conditional Access evaluates signals (user, device, location, risk) to allow/block.",
      "RBAC is assigned at management group, subscription, resource group, or resource.",
      "Azure Policy enforces rules (e.g., only allow specific regions).",
      "Resource locks: CanNotDelete or ReadOnly — prevent accidents.",
      "Tags are metadata for organizing and billing; do not inherit automatically.",
    ],
    cramSheet: [
      "Authentication = who you are. Authorization = what you can do.",
      "RBAC uses role definitions + scope + principal.",
      "Azure Policy enforces standards; Blueprints bundle policies + templates + RBAC.",
      "Management hierarchy: Management Group → Subscription → Resource Group → Resource.",
      "MFA and Conditional Access are your best identity defenses.",
    ],
    review: {
      examWeight: "15–20% of the exam",
      overview:
        "This domain is about control — identity (who), access (what), cost (how much), and compliance (under which rules). It's broad but pattern-heavy. The management hierarchy (Management Group → Subscription → Resource Group → Resource) underpins most questions. Know Entra ID vs on-prem AD, RBAC vs Policy (two different jobs), the purpose of resource locks and tags, and where to go for compliance docs (Service Trust Portal).",
      sections: [
        {
          heading: "Microsoft Entra ID (formerly Azure AD)",
          body:
            "Entra ID is Microsoft's cloud identity and access management (IAM) service. It authenticates users for Azure, Microsoft 365, and thousands of SaaS apps. It is NOT a replacement for on-premises Active Directory Domain Services (AD DS). Different protocols, different use cases.",
          table: {
            columns: ["", "AD DS (on-prem)", "Entra ID (cloud)"],
            rows: [
              { label: "Protocols", cells: ["Kerberos, LDAP, NTLM", "OAuth 2.0, OpenID Connect, SAML"] },
              { label: "Structure", cells: ["Forests, domains, OUs", "Flat tenant"] },
              { label: "Primary use", cells: ["Windows domain, GPOs", "Cloud and SaaS SSO"] },
              { label: "Device join", cells: ["Domain join", "Entra join / hybrid join"] },
            ],
          },
        },
        {
          heading: "Authentication methods",
          bullets: [
            "Passwords — weakest, still common.",
            "Multi-factor authentication (MFA) — something you know + something you have / are.",
            "Passwordless — Windows Hello, FIDO2 security keys, Microsoft Authenticator phone sign-in.",
            "Self-service password reset (SSPR) — lets users recover without calling IT.",
            "Single sign-on (SSO) — sign in once, access many apps.",
          ],
        },
        {
          heading: "Conditional Access",
          body:
            "Conditional Access is the policy engine that lives between sign-in and access. It evaluates *signals* and enforces *decisions*. Think of it as 'if-then' rules for identity.",
          bullets: [
            "Signals: user or group, device state (compliant? managed?), location (IP / named location), app being accessed, sign-in risk (calculated by Microsoft's ML).",
            "Decisions: allow, block, require MFA, require compliant device, require approved client app, require password change.",
            "Common pattern: 'Require MFA when signing in from outside the trusted IP range.'",
          ],
        },
        {
          heading: "Authorization: Azure RBAC",
          body:
            "Role-Based Access Control determines *what* an authenticated identity can do. Three ingredients: a security principal (who), a role definition (what they can do), and a scope (where).",
          bullets: [
            "Security principal: user, group, service principal, or managed identity.",
            "Role definition: a collection of allowed actions. Built-in roles include Owner, Contributor, Reader, User Access Administrator. You can create custom roles.",
            "Scope: management group → subscription → resource group → resource. Permissions inherit downward.",
            "Assignments at a higher scope (e.g., subscription) grant access to everything below.",
          ],
        },
        {
          heading: "Zero Trust principles",
          body:
            "Zero Trust is Microsoft's security philosophy for a cloud-first world. The three guiding principles:",
          bullets: [
            "Verify explicitly — always authenticate and authorize based on available signals (identity, device, location, workload).",
            "Use least-privilege access — just-in-time (JIT) and just-enough-access (JEA); never give permanent admin rights you don't need.",
            "Assume breach — segment access, encrypt end-to-end, use analytics to detect and respond.",
          ],
        },
        {
          heading: "Governance: Policy, Blueprints, Locks, Tags",
          body:
            "Governance is the layer that keeps your Azure estate organized and compliant.",
          bullets: [
            "Azure Policy: define rules (e.g., 'only allow VMs in East US' or 'require tags'). Evaluates existing resources and blocks non-compliant deployments. Supports auto-remediation.",
            "Azure Blueprints (being superseded by Template Specs + Deployment Stacks): packages ARM templates + policies + RBAC assignments as a single deployable artifact.",
            "Resource Locks: CanNotDelete (edit allowed, deletion blocked) or ReadOnly (neither edit nor delete). Prevents accidents on shared resources.",
            "Tags: key-value metadata for billing, ownership, environment. Tags do NOT automatically inherit from parent resources — use Azure Policy to enforce them.",
            "Management Groups: top of the hierarchy, group multiple subscriptions for unified policy and RBAC.",
          ],
        },
        {
          heading: "Cost management",
          bullets: [
            "Pricing Calculator — estimate cost of a planned deployment.",
            "TCO Calculator — compare on-premises costs to equivalent Azure costs.",
            "Azure Cost Management + Billing — analyze current spend, set budgets, create alerts, get recommendations.",
            "Azure Reservations — 1- or 3-year commitments for significant discount (up to ~72%).",
            "Azure Hybrid Benefit — bring your on-prem Windows Server or SQL licenses to Azure and save.",
            "Main cost drivers: resource type, region, time, bandwidth (egress), SKU/tier, reservations.",
          ],
        },
        {
          heading: "Privacy, compliance, trust",
          body:
            "Microsoft publishes its compliance posture through a set of 'trust' resources. You need to know which one is which.",
          bullets: [
            "Microsoft Purview: unified data governance across cloud, on-prem, multi-cloud, and SaaS. Data catalog, classification, lineage, DLP, and insider risk management.",
            "Trust Center: trust information portal (privacy, security, compliance overviews).",
            "Service Trust Portal: audit reports (SOC 2, ISO 27001), compliance documents, blueprints. This is the download point for auditor-consumable artifacts.",
            "Compliance Manager: tool that scores your compliance posture and recommends improvements.",
            "Compliance offerings: 100+ standards supported — GDPR, HIPAA, ISO 27001, FedRAMP, PCI DSS, etc.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Authentication vs Authorization",
          explanation:
            "AuthN = prove you are who you say you are. AuthZ = decide what that person is allowed to do. MFA is AuthN. RBAC is AuthZ.",
        },
        {
          confusion: "Entra ID vs on-prem Active Directory",
          explanation:
            "Entra ID is NOT a replacement for AD DS. Different protocols, different purpose. You can connect them with Entra Connect to get hybrid identity, but neither replaces the other.",
        },
        {
          confusion: "Azure Policy vs RBAC",
          explanation:
            "Policy says *what* is allowed to be deployed (e.g., only certain SKUs in certain regions). RBAC says *who* is allowed to deploy it. They answer different questions and both are needed.",
        },
        {
          confusion: "Tags and inheritance",
          explanation:
            "Tags do NOT inherit from resource group to resource automatically. If you want inheritance, apply a policy that enforces tagging.",
        },
        {
          confusion: "Management hierarchy order",
          explanation:
            "Top-down: Management Group → Subscription → Resource Group → Resource. Policy and RBAC flow downward. Memorize this order — questions love to reorder it as distractors.",
        },
        {
          confusion: "CanNotDelete vs ReadOnly locks",
          explanation:
            "CanNotDelete allows edits but blocks deletion. ReadOnly blocks both edits and deletion. Pick CanNotDelete when you still need to change settings but want to prevent accidental deletion.",
        },
        {
          confusion: "Trust Center vs Service Trust Portal vs Compliance Manager",
          explanation:
            "Trust Center is the overview site. Service Trust Portal is where you download audit reports (SOC, ISO). Compliance Manager scores your tenant against standards.",
        },
      ],
      examTips: [
        "'Require MFA from an untrusted location' → Conditional Access.",
        "'Prevent deletion of a production resource' → Resource Lock (CanNotDelete).",
        "'Only allow VMs in a specific region' → Azure Policy.",
        "'Grant read-only access to a storage account' → RBAC with Reader role at resource scope.",
        "'Download a SOC 2 audit report' → Service Trust Portal.",
        "'Estimate the cost of a new deployment' → Pricing Calculator.",
        "'Compare on-prem cost to Azure cost' → TCO Calculator.",
        "'Budget and alert on Azure spend' → Azure Cost Management.",
        "'Unified data catalog across clouds' → Microsoft Purview.",
        "'No permanent admin access; elevate when needed' → Zero Trust / least privilege (Privileged Identity Management if named).",
      ],
    },
  },
];

export const ALL_TOPICS: Topic[] = [
  ...AZ900_TOPICS,
  ...AWS_CCP_TOPICS,
  ...MS900_TOPICS,
  ...AI900_TOPICS,
  ...SEC_PLUS_TOPICS,
  ...AWS_AIP_TOPICS,
  ...GCP_CDL_TOPICS,
];

export const TOPIC_MAP: Record<string, Topic> = ALL_TOPICS.reduce(
  (acc, t) => ({ ...acc, [t.id]: t }),
  {}
);

export function getTopicsForExam(examId: ExamId): Topic[] {
  return ALL_TOPICS.filter((t) => t.examId === examId);
}
