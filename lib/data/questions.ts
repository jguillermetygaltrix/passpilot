import type { ExamId, Question } from "../types";
import { AWS_CCP_DIAGNOSTIC, AWS_CCP_QUESTIONS } from "./exams/aws-ccp";
import { MS900_DIAGNOSTIC, MS900_QUESTIONS } from "./exams/ms-900";

export const AZ900_QUESTIONS: Question[] = [
  // ── Cloud Concepts ──────────────────────────────────────────────
  {
    id: "q-cc-1",
    examId: "az-900",
    topicId: "cloud-concepts",
    prompt:
      "Which cloud service model gives you the MOST control over the underlying operating system?",
    choices: ["SaaS", "PaaS", "IaaS", "FaaS"],
    correctIndex: 2,
    explanation:
      "IaaS (Infrastructure as a Service) gives you VMs where you manage the OS, runtime, and applications. PaaS abstracts the OS, SaaS abstracts everything.",
    difficulty: "easy",
    tags: ["service-models"],
  },
  {
    id: "q-cc-2",
    examId: "az-900",
    topicId: "cloud-concepts",
    prompt:
      "A company wants to pay only for what they use, with no long-term hardware commitment. Which pricing model is this?",
    choices: [
      "Capital expenditure (CapEx)",
      "Fixed licensing",
      "Operational expenditure (OpEx)",
      "Perpetual license",
    ],
    correctIndex: 2,
    explanation:
      "OpEx is the consumption-based, ongoing expense model that cloud providers use. CapEx is upfront spend on owned assets.",
    difficulty: "easy",
    tags: ["economics"],
  },
  {
    id: "q-cc-3",
    examId: "az-900",
    topicId: "cloud-concepts",
    prompt:
      "What cloud characteristic describes the ability to automatically scale resources up and down based on demand?",
    choices: [
      "High availability",
      "Elasticity",
      "Disaster recovery",
      "Fault tolerance",
    ],
    correctIndex: 1,
    explanation:
      "Elasticity = automatic scaling. Scalability is the broader ability to grow; elasticity is automatic and bidirectional.",
    difficulty: "easy",
    tags: ["characteristics"],
  },
  {
    id: "q-cc-4",
    examId: "az-900",
    topicId: "cloud-concepts",
    prompt:
      "In the shared responsibility model for SaaS, which of the following is ALWAYS the customer's responsibility?",
    choices: [
      "Physical security of the datacenter",
      "Operating system patching",
      "Data and identities",
      "Hypervisor patching",
    ],
    correctIndex: 2,
    explanation:
      "Data and identities are always the customer's responsibility regardless of service model. The provider handles infrastructure.",
    difficulty: "medium",
    tags: ["shared-responsibility"],
  },
  {
    id: "q-cc-5",
    examId: "az-900",
    topicId: "cloud-concepts",
    prompt:
      "A company has strict data residency laws. They want cloud-like benefits while keeping sensitive data on-premises. What deployment model fits best?",
    choices: [
      "Public cloud",
      "Private cloud",
      "Hybrid cloud",
      "Community cloud",
    ],
    correctIndex: 2,
    explanation:
      "Hybrid lets sensitive workloads stay private while other workloads use public cloud. Private alone would miss public cloud benefits.",
    difficulty: "medium",
    tags: ["deployment-models"],
  },
  {
    id: "q-cc-6",
    examId: "az-900",
    topicId: "cloud-concepts",
    prompt:
      "Microsoft 365 is an example of which cloud service model?",
    choices: ["IaaS", "PaaS", "SaaS", "DaaS"],
    correctIndex: 2,
    explanation:
      "Microsoft 365 is a complete application delivered as a service — SaaS. The user does not manage runtime or infrastructure.",
    difficulty: "easy",
    tags: ["service-models"],
  },
  {
    id: "q-cc-7",
    examId: "az-900",
    topicId: "cloud-concepts",
    prompt:
      "Which benefit of cloud computing refers to the ability to recover from a regional outage within minutes?",
    choices: [
      "Elasticity",
      "Disaster recovery",
      "CapEx reduction",
      "Broad network access",
    ],
    correctIndex: 1,
    explanation:
      "Disaster recovery refers to restoring service after a major failure. Elasticity is about scaling, not recovery.",
    difficulty: "easy",
    tags: ["benefits"],
  },
  {
    id: "q-cc-8",
    examId: "az-900",
    topicId: "cloud-concepts",
    prompt:
      "You deploy a web app on Azure App Service. Who is responsible for patching the underlying OS?",
    choices: [
      "You (the customer)",
      "Microsoft",
      "A third-party contractor",
      "Shared equally",
    ],
    correctIndex: 1,
    explanation:
      "App Service is PaaS — Microsoft manages the OS and runtime. You manage the app and data.",
    difficulty: "medium",
    tags: ["shared-responsibility", "paas"],
  },
  {
    id: "q-cc-9",
    examId: "az-900",
    topicId: "cloud-concepts",
    prompt:
      "Which statement about public cloud is TRUE?",
    choices: [
      "Resources are dedicated to a single organization.",
      "It typically offers the lowest upfront cost.",
      "It cannot provide high availability.",
      "Data never leaves the customer's country.",
    ],
    correctIndex: 1,
    explanation:
      "Public cloud shares infrastructure among tenants and has no upfront hardware cost, which typically makes it the cheapest entry point.",
    difficulty: "easy",
    tags: ["deployment-models"],
  },
  {
    id: "q-cc-10",
    examId: "az-900",
    topicId: "cloud-concepts",
    prompt:
      "What does 'consumption-based pricing' mean?",
    choices: [
      "You pay a fixed monthly fee regardless of usage.",
      "You pay only for the resources you actually use.",
      "You pay upfront for a year of service.",
      "You pay based on the number of employees.",
    ],
    correctIndex: 1,
    explanation:
      "Consumption-based = pay-as-you-go. You are billed based on actual usage such as compute seconds or GB stored.",
    difficulty: "easy",
    tags: ["economics"],
  },

  // ── Core Azure Services ─────────────────────────────────────────
  {
    id: "q-cs-1",
    examId: "az-900",
    topicId: "core-services",
    prompt:
      "You need to ensure your storage survives an entire Azure region going offline. Which redundancy option should you choose?",
    choices: ["LRS", "ZRS", "GRS", "None — Azure never has outages"],
    correctIndex: 2,
    explanation:
      "GRS (Geo-Redundant Storage) replicates data to a paired region hundreds of miles away. LRS is a single DC; ZRS is across zones in one region.",
    difficulty: "medium",
    tags: ["storage", "redundancy"],
  },
  {
    id: "q-cs-2",
    examId: "az-900",
    topicId: "core-services",
    prompt:
      "Which Azure service is best for running a globally distributed NoSQL database with low latency worldwide?",
    choices: [
      "Azure SQL Database",
      "Azure Cosmos DB",
      "Azure Database for PostgreSQL",
      "Azure Table Storage",
    ],
    correctIndex: 1,
    explanation:
      "Cosmos DB is a globally distributed, multi-model, low-latency database with five consistency levels.",
    difficulty: "easy",
    tags: ["database"],
  },
  {
    id: "q-cs-3",
    examId: "az-900",
    topicId: "core-services",
    prompt:
      "A team wants to run event-driven code without managing servers, paying only per execution. Which service fits best?",
    choices: [
      "Azure Virtual Machines",
      "Azure App Service",
      "Azure Functions",
      "Azure Kubernetes Service",
    ],
    correctIndex: 2,
    explanation:
      "Azure Functions is serverless, event-driven, and billed per execution with a generous free grant.",
    difficulty: "easy",
    tags: ["compute", "serverless"],
  },
  {
    id: "q-cs-4",
    examId: "az-900",
    topicId: "core-services",
    prompt:
      "An Availability Zone is best described as:",
    choices: [
      "A geographically dispersed group of regions.",
      "Physically separate datacenters inside an Azure region.",
      "A logical grouping of VMs.",
      "A subscription-level boundary.",
    ],
    correctIndex: 1,
    explanation:
      "Availability Zones are physically separate datacenters within a single region, each with independent power, cooling, and networking.",
    difficulty: "medium",
    tags: ["global-infra"],
  },
  {
    id: "q-cs-5",
    examId: "az-900",
    topicId: "core-services",
    prompt:
      "Which Azure service provides a private, dedicated network connection between your on-prem network and Azure, NOT over the public internet?",
    choices: [
      "VPN Gateway",
      "Virtual Network Peering",
      "ExpressRoute",
      "Azure Bastion",
    ],
    correctIndex: 2,
    explanation:
      "ExpressRoute uses a private circuit via a connectivity provider — it does not traverse the public internet.",
    difficulty: "medium",
    tags: ["networking"],
  },
  {
    id: "q-cs-6",
    examId: "az-900",
    topicId: "core-services",
    prompt:
      "You want to host a managed Kubernetes cluster and pay only for the worker nodes. Which service do you choose?",
    choices: [
      "Azure Container Instances",
      "Azure Kubernetes Service",
      "Azure App Service",
      "Azure Service Fabric",
    ],
    correctIndex: 1,
    explanation:
      "AKS (Azure Kubernetes Service) provides a managed control plane for free; you pay for worker nodes.",
    difficulty: "easy",
    tags: ["compute", "containers"],
  },
  {
    id: "q-cs-7",
    examId: "az-900",
    topicId: "core-services",
    prompt:
      "Which Azure Storage type is optimized for storing large amounts of unstructured data like images and backups?",
    choices: ["File", "Queue", "Blob", "Table"],
    correctIndex: 2,
    explanation:
      "Blob storage is designed for unstructured data such as images, video, and backups.",
    difficulty: "easy",
    tags: ["storage"],
  },
  {
    id: "q-cs-8",
    examId: "az-900",
    topicId: "core-services",
    prompt:
      "What is the primary purpose of an Azure region pair?",
    choices: [
      "To reduce network latency between customers.",
      "To provide geo-redundancy with sequential updates and isolated failures.",
      "To split billing across regions.",
      "To enforce compliance boundaries.",
    ],
    correctIndex: 1,
    explanation:
      "Paired regions receive updates sequentially and are isolated from each other, improving DR and update safety.",
    difficulty: "hard",
    tags: ["global-infra"],
  },
  {
    id: "q-cs-9",
    examId: "az-900",
    topicId: "core-services",
    prompt:
      "Which service would you use to quickly run a single container without managing a cluster?",
    choices: [
      "Azure Kubernetes Service",
      "Azure Container Instances",
      "Azure Functions",
      "Azure App Service",
    ],
    correctIndex: 1,
    explanation:
      "Azure Container Instances (ACI) runs a single container with no orchestration overhead — ideal for simple, short-lived workloads.",
    difficulty: "medium",
    tags: ["compute", "containers"],
  },
  {
    id: "q-cs-10",
    examId: "az-900",
    topicId: "core-services",
    prompt:
      "An Azure Virtual Network (VNet) is primarily used to:",
    choices: [
      "Store files across regions.",
      "Isolate and segment cloud networking for your resources.",
      "Replace DNS for on-prem servers.",
      "Distribute load across regions.",
    ],
    correctIndex: 1,
    explanation:
      "VNets provide network isolation and segmentation for Azure resources, similar to a traditional on-prem network.",
    difficulty: "easy",
    tags: ["networking"],
  },

  // ── Solutions & Tools ───────────────────────────────────────────
  {
    id: "q-st-1",
    examId: "az-900",
    topicId: "solutions-tools",
    prompt:
      "Which tool is the preferred declarative language for defining Azure infrastructure, designed to replace raw ARM JSON?",
    choices: ["YAML", "Bicep", "Terraform HCL", "PowerShell"],
    correctIndex: 1,
    explanation:
      "Bicep is Microsoft's DSL that compiles to ARM JSON. It is cleaner and the recommended native IaC approach.",
    difficulty: "medium",
    tags: ["iac", "tools"],
  },
  {
    id: "q-st-2",
    examId: "az-900",
    topicId: "solutions-tools",
    prompt:
      "Where would you go to see whether a global Azure outage is currently affecting your specific resources?",
    choices: [
      "Azure Advisor",
      "Azure Service Health",
      "Azure Monitor",
      "Azure Policy",
    ],
    correctIndex: 1,
    explanation:
      "Service Health is personalized — it shows outages and planned maintenance relevant to your specific resources.",
    difficulty: "medium",
    tags: ["monitoring"],
  },
  {
    id: "q-st-3",
    examId: "az-900",
    topicId: "solutions-tools",
    prompt:
      "Which Azure service provides an in-browser shell pre-authenticated to your subscription, with Bash and PowerShell?",
    choices: [
      "Azure CLI",
      "Azure PowerShell",
      "Azure Cloud Shell",
      "Windows Terminal",
    ],
    correctIndex: 2,
    explanation:
      "Cloud Shell is browser-based, pre-authenticated, supports Bash and PowerShell, and includes common tools.",
    difficulty: "easy",
    tags: ["tools"],
  },
  {
    id: "q-st-4",
    examId: "az-900",
    topicId: "solutions-tools",
    prompt:
      "A team needs pre-built image recognition, translation, and speech APIs without training custom models. What fits best?",
    choices: [
      "Azure Machine Learning",
      "Azure Cognitive Services",
      "Azure Databricks",
      "Azure Synapse",
    ],
    correctIndex: 1,
    explanation:
      "Cognitive Services provides pre-built AI capabilities via API. Azure ML is for building and training custom models.",
    difficulty: "easy",
    tags: ["ai"],
  },
  {
    id: "q-st-5",
    examId: "az-900",
    topicId: "solutions-tools",
    prompt:
      "Which monitoring component provides application performance management (APM) including request rates, failures, and user flows?",
    choices: [
      "Azure Monitor",
      "Log Analytics",
      "Application Insights",
      "Azure Advisor",
    ],
    correctIndex: 2,
    explanation:
      "Application Insights is Azure's APM — it tracks app-level telemetry and feeds into Azure Monitor.",
    difficulty: "medium",
    tags: ["monitoring"],
  },
  {
    id: "q-st-6",
    examId: "az-900",
    topicId: "solutions-tools",
    prompt:
      "Logic Apps is best described as:",
    choices: [
      "A code-first serverless compute engine.",
      "A low-code visual workflow service with hundreds of connectors.",
      "A managed Kubernetes service.",
      "A container registry.",
    ],
    correctIndex: 1,
    explanation:
      "Logic Apps is a low-code workflow orchestrator with connectors for Microsoft and third-party services.",
    difficulty: "easy",
    tags: ["serverless"],
  },
  {
    id: "q-st-7",
    examId: "az-900",
    topicId: "solutions-tools",
    prompt:
      "Which service is designed for ingesting massive amounts of telemetry from millions of devices?",
    choices: [
      "Azure IoT Central",
      "Azure IoT Hub",
      "Azure Event Grid",
      "Azure Service Bus",
    ],
    correctIndex: 1,
    explanation:
      "IoT Hub is the device-to-cloud messaging backbone for IoT. IoT Central is a managed SaaS dashboard on top.",
    difficulty: "medium",
    tags: ["iot"],
  },
  {
    id: "q-st-8",
    examId: "az-900",
    topicId: "solutions-tools",
    prompt:
      "Azure Advisor provides recommendations in which of the following categories?",
    choices: [
      "Only cost optimization",
      "Cost, security, reliability, operational excellence, and performance",
      "Only security",
      "Only performance tuning",
    ],
    correctIndex: 1,
    explanation:
      "Azure Advisor gives personalized best-practice recommendations across five pillars: cost, security, reliability, operational excellence, and performance.",
    difficulty: "medium",
    tags: ["monitoring", "governance"],
  },
  {
    id: "q-st-9",
    examId: "az-900",
    topicId: "solutions-tools",
    prompt:
      "What is the primary function of an ARM template?",
    choices: [
      "To monitor resource health.",
      "To declaratively define and deploy Azure resources.",
      "To apply policy rules to resources.",
      "To manage user access to resources.",
    ],
    correctIndex: 1,
    explanation:
      "ARM templates are declarative JSON files describing what resources to deploy. Azure Resource Manager then provisions them.",
    difficulty: "easy",
    tags: ["iac"],
  },

  // ── Security & Network ──────────────────────────────────────────
  {
    id: "q-sn-1",
    examId: "az-900",
    topicId: "security-network",
    prompt:
      "Where should application secrets like connection strings and API keys be stored in Azure?",
    choices: [
      "In the app's configuration file, encrypted.",
      "In Azure Key Vault.",
      "As environment variables in source code.",
      "In a shared blob container.",
    ],
    correctIndex: 1,
    explanation:
      "Key Vault is the dedicated service for secrets, keys, and certificates, with HSM backing and access auditing.",
    difficulty: "easy",
    tags: ["key-vault"],
  },
  {
    id: "q-sn-2",
    examId: "az-900",
    topicId: "security-network",
    prompt:
      "Which tier of Azure DDoS Protection provides near-real-time attack telemetry and cost protection?",
    choices: [
      "DDoS Basic",
      "DDoS Standard",
      "DDoS Premium",
      "DDoS is not offered by Azure",
    ],
    correctIndex: 1,
    explanation:
      "DDoS Basic is free and automatic. DDoS Standard adds analytics, tuning, and cost protection against scale-out.",
    difficulty: "medium",
    tags: ["ddos"],
  },
  {
    id: "q-sn-3",
    examId: "az-900",
    topicId: "security-network",
    prompt:
      "Which service allows you to securely RDP or SSH to a VM WITHOUT giving that VM a public IP?",
    choices: [
      "Azure Firewall",
      "Network Security Group",
      "Azure Bastion",
      "Azure Private Link",
    ],
    correctIndex: 2,
    explanation:
      "Azure Bastion provides browser-based RDP/SSH through the portal over TLS, so VMs can remain without public IPs.",
    difficulty: "medium",
    tags: ["bastion"],
  },
  {
    id: "q-sn-4",
    examId: "az-900",
    topicId: "security-network",
    prompt:
      "Microsoft Sentinel is best described as a:",
    choices: [
      "Managed VM service",
      "Cloud-native SIEM/SOAR solution",
      "Backup service",
      "Load balancer",
    ],
    correctIndex: 1,
    explanation:
      "Sentinel is a cloud-native SIEM (and SOAR) that ingests logs, detects threats, and automates responses.",
    difficulty: "easy",
    tags: ["sentinel"],
  },
  {
    id: "q-sn-5",
    examId: "az-900",
    topicId: "security-network",
    prompt:
      "Network Security Groups (NSGs) filter traffic using rules based on:",
    choices: [
      "Application-layer content inspection",
      "Source/destination IP, port, and protocol",
      "User identity attributes",
      "DNS query patterns",
    ],
    correctIndex: 1,
    explanation:
      "NSGs are basic 5-tuple packet filters — source/destination IP, port, and protocol. They do not do deep inspection.",
    difficulty: "medium",
    tags: ["nsg"],
  },
  {
    id: "q-sn-6",
    examId: "az-900",
    topicId: "security-network",
    prompt:
      "Defender for Cloud's 'Secure Score' measures:",
    choices: [
      "The dollar value of your resources.",
      "How well your environment follows security best practices.",
      "The speed of your VMs.",
      "The number of users with MFA.",
    ],
    correctIndex: 1,
    explanation:
      "Secure Score is a measurement of your security posture based on how many recommended controls you have implemented.",
    difficulty: "medium",
    tags: ["defender"],
  },
  {
    id: "q-sn-7",
    examId: "az-900",
    topicId: "security-network",
    prompt:
      "The concept of 'defense in depth' means:",
    choices: [
      "Relying on a single strong perimeter firewall.",
      "Using layered security controls so a failure at one layer doesn't expose everything.",
      "Storing all data in encrypted form only.",
      "Outsourcing security entirely to the cloud provider.",
    ],
    correctIndex: 1,
    explanation:
      "Defense in depth applies controls at multiple layers — identity, perimeter, network, compute, app, and data.",
    difficulty: "easy",
    tags: ["principles"],
  },
  {
    id: "q-sn-8",
    examId: "az-900",
    topicId: "security-network",
    prompt:
      "Which is a stateful, fully managed firewall service with built-in threat intelligence?",
    choices: [
      "Network Security Group",
      "Azure Firewall",
      "Azure Front Door",
      "Application Gateway",
    ],
    correctIndex: 1,
    explanation:
      "Azure Firewall is a stateful, managed PaaS firewall with threat intelligence feeds. NSGs are simple stateless-style filters.",
    difficulty: "medium",
    tags: ["firewall"],
  },

  // ── Identity, Governance, Compliance ────────────────────────────
  {
    id: "q-ig-1",
    examId: "az-900",
    topicId: "identity-governance",
    prompt:
      "Which feature lets you define rules like 'require MFA when signing in from outside the corporate network'?",
    choices: [
      "Azure Policy",
      "Conditional Access",
      "RBAC",
      "Resource Locks",
    ],
    correctIndex: 1,
    explanation:
      "Conditional Access evaluates signals (user, device, location, risk) to apply access controls like MFA.",
    difficulty: "easy",
    tags: ["conditional-access"],
  },
  {
    id: "q-ig-2",
    examId: "az-900",
    topicId: "identity-governance",
    prompt:
      "You want to prevent a critical resource group from being accidentally deleted. What do you apply?",
    choices: [
      "Azure Policy",
      "A Resource Lock of type CanNotDelete",
      "Tags",
      "Role-Based Access Control",
    ],
    correctIndex: 1,
    explanation:
      "A CanNotDelete lock prevents deletion while still allowing modification. ReadOnly blocks modification too.",
    difficulty: "medium",
    tags: ["governance"],
  },
  {
    id: "q-ig-3",
    examId: "az-900",
    topicId: "identity-governance",
    prompt:
      "Azure Policy is used primarily to:",
    choices: [
      "Assign users to roles.",
      "Enforce organizational standards and evaluate compliance.",
      "Encrypt data at rest.",
      "Deploy VMs faster.",
    ],
    correctIndex: 1,
    explanation:
      "Azure Policy enforces rules (e.g., allowed regions, allowed SKUs) and evaluates resource compliance.",
    difficulty: "easy",
    tags: ["policy"],
  },
  {
    id: "q-ig-4",
    examId: "az-900",
    topicId: "identity-governance",
    prompt:
      "Which identifies WHAT a user is allowed to do once authenticated?",
    choices: [
      "Authentication",
      "Authorization",
      "Federation",
      "Encryption",
    ],
    correctIndex: 1,
    explanation:
      "Authentication proves identity. Authorization determines which actions that identity is allowed to perform.",
    difficulty: "easy",
    tags: ["identity"],
  },
  {
    id: "q-ig-5",
    examId: "az-900",
    topicId: "identity-governance",
    prompt:
      "At which level can RBAC roles be assigned? (choose the most complete answer)",
    choices: [
      "Subscription only",
      "Management group, subscription, resource group, or individual resource",
      "Resource only",
      "Tenant only",
    ],
    correctIndex: 1,
    explanation:
      "RBAC can be scoped at management group, subscription, resource group, or individual resource — inheritance flows downward.",
    difficulty: "medium",
    tags: ["rbac"],
  },
  {
    id: "q-ig-6",
    examId: "az-900",
    topicId: "identity-governance",
    prompt:
      "Microsoft Entra ID (formerly Azure AD) is Microsoft's:",
    choices: [
      "On-premises Active Directory replacement.",
      "Cloud-based identity and access management service.",
      "Enterprise SQL database.",
      "DNS service.",
    ],
    correctIndex: 1,
    explanation:
      "Entra ID is a cloud IAM service. It is NOT a replacement for on-prem AD Domain Services.",
    difficulty: "easy",
    tags: ["entra-id"],
  },
  {
    id: "q-ig-7",
    examId: "az-900",
    topicId: "identity-governance",
    prompt:
      "Which service provides unified data governance across on-prem, multi-cloud, and SaaS?",
    choices: [
      "Microsoft Defender for Cloud",
      "Microsoft Purview",
      "Azure Policy",
      "Azure Blueprints",
    ],
    correctIndex: 1,
    explanation:
      "Microsoft Purview is the unified data governance and compliance platform — catalog, classification, lineage.",
    difficulty: "hard",
    tags: ["compliance"],
  },
  {
    id: "q-ig-8",
    examId: "az-900",
    topicId: "identity-governance",
    prompt:
      "What is the order of the Azure management hierarchy from highest to lowest scope?",
    choices: [
      "Subscription → Management Group → Resource Group → Resource",
      "Management Group → Subscription → Resource Group → Resource",
      "Resource → Resource Group → Subscription → Management Group",
      "Tenant → Resource → Subscription → Group",
    ],
    correctIndex: 1,
    explanation:
      "Top-down: Management Group → Subscription → Resource Group → Resource. Policies and RBAC flow downward through this hierarchy.",
    difficulty: "medium",
    tags: ["hierarchy"],
  },
  {
    id: "q-ig-9",
    examId: "az-900",
    topicId: "identity-governance",
    prompt:
      "Tags in Azure are BEST used to:",
    choices: [
      "Enforce security policies.",
      "Provide metadata for billing, organization, and reporting.",
      "Encrypt resources.",
      "Scale resources automatically.",
    ],
    correctIndex: 1,
    explanation:
      "Tags are key-value metadata used for cost allocation, filtering, and organization. They do not enforce policy on their own.",
    difficulty: "easy",
    tags: ["tags"],
  },
  {
    id: "q-ig-10",
    examId: "az-900",
    topicId: "identity-governance",
    prompt:
      "The Microsoft Service Trust Portal provides:",
    choices: [
      "Real-time alerts about your subscription usage.",
      "Compliance reports, audit documents, and trust information.",
      "Resource deployment templates.",
      "Virtual machine pricing.",
    ],
    correctIndex: 1,
    explanation:
      "The Service Trust Portal hosts compliance documentation, audit reports (SOC, ISO), and trust resources.",
    difficulty: "hard",
    tags: ["compliance"],
  },
];

const AZ900_DIAGNOSTIC = [
  "q-cc-1",
  "q-cc-3",
  "q-cc-4",
  "q-cs-1",
  "q-cs-3",
  "q-cs-4",
  "q-st-1",
  "q-st-5",
  "q-sn-1",
  "q-sn-5",
  "q-ig-1",
  "q-ig-4",
];

export const ALL_QUESTIONS: Question[] = [
  ...AZ900_QUESTIONS,
  ...AWS_CCP_QUESTIONS,
  ...MS900_QUESTIONS,
];

export const QUESTION_MAP: Record<string, Question> = ALL_QUESTIONS.reduce(
  (acc, q) => ({ ...acc, [q.id]: q }),
  {}
);

export const DIAGNOSTIC_SETS: Record<ExamId, string[]> = {
  "az-900": AZ900_DIAGNOSTIC,
  "aws-ccp": AWS_CCP_DIAGNOSTIC,
  "ms-900": MS900_DIAGNOSTIC,
};

// Back-compat for older imports
export const DIAGNOSTIC_SET = AZ900_DIAGNOSTIC;

export function getQuestionsForExam(examId: ExamId): Question[] {
  return ALL_QUESTIONS.filter((q) => q.examId === examId);
}

export function getQuestionsByTopic(topicId: string): Question[] {
  return ALL_QUESTIONS.filter((q) => q.topicId === topicId);
}

export function getDiagnosticQuestions(examId: ExamId = "az-900"): Question[] {
  const ids = DIAGNOSTIC_SETS[examId] ?? [];
  return ids.map((id) => QUESTION_MAP[id]).filter(Boolean);
}

export function sampleQuestions(
  ids: string[],
  count: number,
  seed = Date.now()
): Question[] {
  const pool = ids.length
    ? ids.map((id) => QUESTION_MAP[id]).filter(Boolean)
    : ALL_QUESTIONS;
  const shuffled = [...pool].sort(
    (a, b) => (hash(a.id + seed) % 1000) - (hash(b.id + seed) % 1000)
  );
  return shuffled.slice(0, count);
}

function hash(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}
