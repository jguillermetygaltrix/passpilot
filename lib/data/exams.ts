import type { Exam, ExamId } from "../types";
import { AZ900_TOPICS, getTopicsForExam } from "./topics";
import { AWS_CCP_TOPICS } from "./exams/aws-ccp";
import { MS900_TOPICS } from "./exams/ms-900";

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
];

export const EXAM_MAP: Record<ExamId, ExamMeta> = EXAMS.reduce(
  (acc, e) => ({ ...acc, [e.id]: e }),
  {} as Record<ExamId, ExamMeta>
);

export function getExamMeta(id: ExamId): ExamMeta {
  return EXAM_MAP[id] || EXAMS[0];
}
