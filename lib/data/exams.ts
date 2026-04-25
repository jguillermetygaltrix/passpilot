import type { Exam, ExamId } from "../types";
import { AZ900_TOPICS, getTopicsForExam } from "./topics";
import { AWS_CCP_TOPICS } from "./exams/aws-ccp";
import { MS900_TOPICS } from "./exams/ms-900";
import { AI900_TOPICS } from "./exams/ai-900";
import { SEC_PLUS_TOPICS } from "./exams/sec-plus";
import { AWS_AIP_TOPICS } from "./exams/aws-aip";
import { GCP_CDL_TOPICS } from "./exams/gcp-cdl";

export interface ExamMeta extends Exam {
  accentFrom: string;
  accentTo: string;
  shortCode: string;
  tagline: string;
  durationMin: number;
  questionCountRange: [number, number];
  priceUSD: number;
  available: boolean;
}

export const EXAMS: ExamMeta[] = [
  {
    id: "az-900",
    name: "AZ-900",
    shortCode: "AZ-900",
    vendor: "Microsoft",
    fullTitle: "Microsoft Azure Fundamentals",
    tagline: "Entry-level Azure certification",
    passScore: 70,
    totalDomains: AZ900_TOPICS.length,
    description:
      "Foundational cloud concepts and core Azure services. Recommended first step into the Microsoft certification path.",
    domains: AZ900_TOPICS,
    accentFrom: "#3d60ff",
    accentTo: "#6d35e5",
    durationMin: 60,
    questionCountRange: [40, 60],
    priceUSD: 99,
    available: true,
  },
  {
    id: "aws-ccp",
    name: "AWS CCP",
    shortCode: "CLF-C02",
    vendor: "Amazon",
    fullTitle: "AWS Certified Cloud Practitioner",
    tagline: "Foundational AWS certification",
    passScore: 70,
    totalDomains: AWS_CCP_TOPICS.length,
    description:
      "Tests your understanding of AWS Cloud, services, security, architecture, pricing, and support. The entry-level AWS cert and a launchpad for the rest of the AWS stack.",
    domains: AWS_CCP_TOPICS,
    accentFrom: "#ff9900",
    accentTo: "#ec4899",
    durationMin: 90,
    questionCountRange: [65, 65],
    priceUSD: 100,
    available: true,
  },
  {
    id: "ms-900",
    name: "MS-900",
    shortCode: "MS-900",
    vendor: "Microsoft",
    fullTitle: "Microsoft 365 Fundamentals",
    tagline: "Entry-level Microsoft 365 certification",
    passScore: 70,
    totalDomains: MS900_TOPICS.length,
    description:
      "Tests your knowledge of Microsoft 365, its apps and services, security, compliance, pricing, and support. Perfect for IT pros and admins new to M365.",
    domains: MS900_TOPICS,
    accentFrom: "#10b981",
    accentTo: "#06b6d4",
    durationMin: 60,
    questionCountRange: [40, 60],
    priceUSD: 99,
    available: true,
  },
  {
    id: "ai-900",
    name: "AI-900",
    shortCode: "AI-900",
    vendor: "Microsoft",
    fullTitle: "Microsoft Azure AI Fundamentals",
    tagline: "Entry-level Azure AI certification",
    passScore: 70,
    totalDomains: AI900_TOPICS.length,
    description:
      "Tests your knowledge of AI workloads, machine learning, computer vision, NLP, and the brand-new generative AI domain (added 2024). The fastest credential to validate AI literacy on Azure — perfect cross-sell with AZ-900.",
    domains: AI900_TOPICS,
    accentFrom: "#a855f7",
    accentTo: "#ec4899",
    durationMin: 60,
    questionCountRange: [40, 60],
    priceUSD: 99,
    available: true,
  },
  {
    id: "sec-plus",
    name: "Security+",
    shortCode: "SY0-701",
    vendor: "CompTIA",
    fullTitle: "CompTIA Security+ (SY0-701)",
    tagline: "The biggest entry-level security certification",
    passScore: 75,
    totalDomains: SEC_PLUS_TOPICS.length,
    description:
      "The most-required entry-level cybersecurity cert — DoD 8570 mandates it, and it's the baseline for nearly every SOC analyst, security admin, and IT security role. Vendor-neutral and broadly portable.",
    domains: SEC_PLUS_TOPICS,
    accentFrom: "#dc2626",
    accentTo: "#f97316",
    durationMin: 90,
    questionCountRange: [80, 90],
    priceUSD: 392,
    available: true,
  },
  {
    id: "aws-aip",
    name: "AWS AIP",
    shortCode: "AIF-C01",
    vendor: "Amazon",
    fullTitle: "AWS Certified AI Practitioner",
    tagline: "AWS's new entry-level AI certification",
    passScore: 70,
    totalDomains: AWS_AIP_TOPICS.length,
    description:
      "Launched late 2024 — AWS's entry-level AI cert covering foundation models, Bedrock, Amazon Q, RAG, and responsible AI. Perfect pairing with AI-900 for a multi-cloud AI fundamentals story.",
    domains: AWS_AIP_TOPICS,
    accentFrom: "#f59e0b",
    accentTo: "#fb923c",
    durationMin: 90,
    questionCountRange: [65, 65],
    priceUSD: 100,
    available: true,
  },
  {
    id: "gcp-cdl",
    name: "GCP CDL",
    shortCode: "CDL",
    vendor: "Google",
    fullTitle: "Google Cloud Digital Leader",
    tagline: "Entry-level Google Cloud certification",
    passScore: 70,
    totalDomains: GCP_CDL_TOPICS.length,
    description:
      "Google's foundational cloud cert — covers BigQuery, Vertex AI, GKE, Cloud Run, Anthos, and BeyondCorp Zero Trust. Completes the all-three-clouds story for the Multi tier.",
    domains: GCP_CDL_TOPICS,
    accentFrom: "#4285f4",
    accentTo: "#34a853",
    durationMin: 90,
    questionCountRange: [50, 60],
    priceUSD: 99,
    available: true,
  },
];

export const EXAM_MAP: Record<ExamId, ExamMeta> = EXAMS.reduce(
  (acc, e) => ({ ...acc, [e.id]: e }),
  {} as Record<ExamId, ExamMeta>
);

export function getExamMeta(id: ExamId): ExamMeta {
  return EXAM_MAP[id] || EXAMS[0];
}
