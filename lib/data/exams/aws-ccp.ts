import type { Lesson, Question, Topic } from "../../types";

// ─────────────────────────────────────────────────────────────────
// AWS Certified Cloud Practitioner (CLF-C02)
// ─────────────────────────────────────────────────────────────────

export const AWS_CCP_TOPICS: Topic[] = [
  {
    id: "ccp-cloud-concepts",
    examId: "aws-ccp",
    name: "Cloud Concepts",
    shortName: "Cloud Concepts",
    weight: 0.24,
    summary:
      "What the AWS Cloud is, why organizations adopt it, and the design principles that shape well-built AWS architectures.",
    subtopics: [
      "AWS Cloud value proposition and six advantages",
      "Cloud economics (CapEx vs OpEx, TCO)",
      "AWS Well-Architected Framework (6 pillars)",
      "Cloud architecture principles (design for failure, decoupling, elasticity)",
      "Migration strategies — the 7 Rs",
      "AWS Cloud Adoption Framework (CAF)",
    ],
    keyFacts: [
      "Six advantages of cloud: trade CapEx for OpEx, economies of scale, stop guessing capacity, increase speed, stop spending on DCs, go global in minutes.",
      "Well-Architected Framework pillars: operational excellence, security, reliability, performance efficiency, cost optimization, sustainability.",
      "7 Rs of migration: retire, retain, rehost, relocate, replatform, refactor, repurchase.",
      "Design for failure — everything fails all the time; architect around it.",
      "Loose coupling means independent components reduce cascading failures.",
      "AWS CAF has six perspectives: business, people, governance, platform, security, operations.",
    ],
    cramSheet: [
      "Cloud = pay-as-you-go IT at scale. AWS = the biggest provider.",
      "Six advantages → memorize the acronym or just keep 'variable cost, scale, speed, global, capacity, focus on apps'.",
      "6 pillars of Well-Architected — operational, security, reliability, performance, cost, sustainability.",
      "7 Rs — retire, retain, rehost (lift-and-shift), relocate, replatform (lift-tinker-shift), refactor, repurchase.",
      "Design for failure, loose coupling, automation — these show up as 'best practice' answers.",
    ],
    review: {
      examWeight: "24% of the exam",
      overview:
        "AWS CCP's first domain is about mindset. You're being asked to explain why the cloud exists, why AWS is structured the way it is, and what 'good architecture' looks like. No service-specific questions land here — this is pure concepts. The two things that show up constantly: the six advantages of cloud and the six pillars of the Well-Architected Framework. Internalize those and you'll recognize every question in this domain.",
      sections: [
        {
          heading: "The six advantages of the AWS Cloud",
          body:
            "AWS markets six advantages as the business case for cloud. Exam questions paraphrase these directly — if you can match a scenario to one of these, you've got the answer.",
          bullets: [
            "Trade fixed expense for variable expense — pay only for what you use.",
            "Benefit from massive economies of scale — lower costs because of aggregated demand.",
            "Stop guessing capacity — scale up or down as needed.",
            "Increase speed and agility — provision in minutes, not weeks.",
            "Stop spending money running and maintaining data centers.",
            "Go global in minutes — deploy to regions around the world.",
          ],
        },
        {
          heading: "CapEx vs OpEx (and TCO)",
          body:
            "Traditional IT is CapEx — buy hardware upfront, depreciate over years. AWS is OpEx — pay as you consume. TCO (Total Cost of Ownership) includes hardware, power, cooling, staff, and opportunity cost. AWS typically wins on TCO because you eliminate most of the fixed costs.",
        },
        {
          heading: "The Well-Architected Framework — 6 pillars",
          body:
            "AWS's best-practice framework for building cloud workloads. You'll be asked which pillar covers which concern.",
          table: {
            columns: ["Pillar", "Focus", "Example"],
            rows: [
              {
                label: "Operational Excellence",
                cells: ["Run and monitor systems", "Automated deployments, runbooks"],
              },
              {
                label: "Security",
                cells: ["Protect information and systems", "IAM, encryption, least privilege"],
              },
              {
                label: "Reliability",
                cells: ["Recover from failure, meet demand", "Multi-AZ, auto-scaling"],
              },
              {
                label: "Performance Efficiency",
                cells: ["Use resources efficiently", "Right-sizing, caching"],
              },
              {
                label: "Cost Optimization",
                cells: ["Avoid unnecessary costs", "Reserved Instances, lifecycle policies"],
              },
              {
                label: "Sustainability",
                cells: ["Minimize environmental impact", "Efficient region choice, idle resource removal"],
              },
            ],
          },
        },
        {
          heading: "Cloud design principles",
          bullets: [
            "Design for failure — assume every component will fail at some point.",
            "Loose coupling — components are independent and communicate through well-defined interfaces (e.g., queues, APIs).",
            "Scalability and elasticity — scale out (add more), not up (bigger box).",
            "Automate everything — infrastructure as code, CI/CD, auto-scaling.",
            "Security as a shared responsibility — AWS secures the cloud, you secure what's in it.",
          ],
        },
        {
          heading: "The 7 Rs of migration",
          body:
            "AWS categorizes migration strategies into seven approaches. The exam often asks you to match a scenario to the right R.",
          bullets: [
            "Retire — decommission the workload, don't move it.",
            "Retain — keep it on-premises (for now).",
            "Rehost — lift-and-shift as-is to EC2.",
            "Relocate — move to AWS with VMware or similar without changes.",
            "Replatform — lift-tinker-and-shift (e.g., move DB to RDS).",
            "Refactor — re-architect for cloud-native (e.g., microservices, serverless).",
            "Repurchase — drop in a SaaS alternative (e.g., move from Exchange to M365).",
          ],
        },
        {
          heading: "AWS Cloud Adoption Framework (CAF)",
          body:
            "CAF is AWS's high-level transformation guidance. It has six perspectives that map to organizational stakeholders: business, people, governance, platform, security, and operations. You don't need to memorize the perspectives deeply — just know CAF is the strategy framework for cloud adoption.",
        },
      ],
      gotchas: [
        {
          confusion: "Scalability vs elasticity",
          explanation:
            "Scalability is the ability to grow. Elasticity is automatic, real-time scaling that matches demand. Every elastic system is scalable, but not every scalable system is elastic.",
        },
        {
          confusion: "Reliability vs availability",
          explanation:
            "Reliability is the system's ability to recover from failures. Availability is the percentage of time the system is operational. A reliable system is usually highly available.",
        },
        {
          confusion: "Rehost vs replatform vs refactor",
          explanation:
            "Rehost = no code changes. Replatform = minor optimizations. Refactor = significant re-architecture (often to cloud-native services).",
        },
        {
          confusion: "CapEx vs OpEx on the exam",
          explanation:
            "Anything about 'no upfront hardware,' 'pay-as-you-go,' or 'variable cost' → OpEx. AWS is always OpEx unless the question is specifically comparing to on-prem.",
        },
      ],
      examTips: [
        "'Six advantages' questions → identify the matching benefit in the scenario.",
        "'Loosely coupled' or 'fault-tolerant' → design for failure principle.",
        "'Move to cloud without code changes' → rehost (lift-and-shift).",
        "'Move from Exchange to Microsoft 365' → repurchase.",
        "'Measures cost, power, people, and hardware' → TCO.",
        "'Framework for best practices' → Well-Architected Framework.",
      ],
    },
  },
  {
    id: "ccp-security-compliance",
    examId: "aws-ccp",
    name: "Security & Compliance",
    shortName: "Security",
    weight: 0.3,
    summary:
      "The shared responsibility model, IAM, and the AWS security services you'll see constantly on the exam.",
    subtopics: [
      "AWS Shared Responsibility Model",
      "IAM users, groups, roles, and policies",
      "Root user vs IAM users, MFA",
      "AWS Organizations and Service Control Policies",
      "Detective & monitoring services (CloudTrail, Config, GuardDuty)",
      "Protective services (Shield, WAF, Firewall Manager, Network Firewall)",
      "Data protection (KMS, Secrets Manager, Certificate Manager, Macie)",
      "AWS Artifact and compliance reports",
    ],
    keyFacts: [
      "AWS secures the infrastructure; customer secures everything built on top.",
      "Never use root user for daily tasks — create IAM users.",
      "IAM roles are for AWS services or external identities to assume — no long-lived credentials.",
      "MFA is free and should be enabled on root + privileged IAM users.",
      "Shield Standard is free and automatic; Shield Advanced adds DDoS response team and cost protection.",
      "CloudTrail = WHO did WHAT. Config = resource configuration history. GuardDuty = threat detection.",
    ],
    cramSheet: [
      "AWS = security OF the cloud. Customer = security IN the cloud. Data is always yours.",
      "IAM is free, global, and the foundation of access control.",
      "Use roles instead of access keys for apps and services.",
      "CloudTrail logs API calls. Config tracks resource state. GuardDuty detects threats.",
      "KMS stores/generates encryption keys; Secrets Manager rotates credentials.",
      "Shield = DDoS. WAF = L7 web attacks. Macie = S3 data classification.",
    ],
    review: {
      examWeight: "30% of the exam — the largest domain",
      overview:
        "Security is the biggest slice of the AWS CCP exam. You need to know the shared responsibility model cold, the basics of IAM (users/groups/roles/policies), and the security services by name. The services aren't hard individually — the challenge is matching each to its role. Build a mental map: detection, protection, identity, data. Every exam question will lean on one of those four buckets.",
      sections: [
        {
          heading: "The Shared Responsibility Model",
          body:
            "The foundational security concept. AWS is responsible for *security of the cloud* — physical infrastructure, networking hardware, host operating systems for managed services. You are responsible for *security in the cloud* — your data, your IAM, your configurations, your application code.",
          table: {
            columns: ["Layer", "Who's responsible", "Examples"],
            rows: [
              {
                label: "Customer",
                cells: [
                  "You",
                  "Data, IAM, OS patches on EC2, app code, firewall rules, encryption choices",
                ],
              },
              {
                label: "AWS",
                cells: [
                  "AWS",
                  "Physical datacenters, hardware, hypervisor, managed service internals",
                ],
              },
              {
                label: "Shared",
                cells: [
                  "Both",
                  "Patch management on RDS (AWS patches engine, you patch apps), configuration",
                ],
              },
            ],
          },
        },
        {
          heading: "AWS Identity and Access Management (IAM)",
          body:
            "IAM is the identity foundation. It's global, free, and always-on. Four building blocks:",
          bullets: [
            "Users — long-term identities for humans or applications.",
            "Groups — collections of users that share permissions.",
            "Roles — temporary credentials assumed by AWS services or federated identities.",
            "Policies — JSON documents defining what's allowed or denied.",
          ],
        },
        {
          heading: "IAM best practices",
          bullets: [
            "Lock down the root user: enable MFA, don't use it for daily work, delete its access keys.",
            "Grant least privilege — only the permissions needed for the task.",
            "Use roles for EC2, Lambda, and cross-account access instead of storing keys.",
            "Rotate credentials regularly; use IAM Access Analyzer to find unused permissions.",
            "Use AWS IAM Identity Center (formerly SSO) for centralized workforce access.",
          ],
        },
        {
          heading: "Detection and monitoring services",
          bullets: [
            "AWS CloudTrail — records every API call: who, what, when, from where. Essential for auditing.",
            "AWS Config — tracks resource configurations over time and evaluates compliance rules.",
            "Amazon GuardDuty — ML-based threat detection on VPC flow logs, CloudTrail, and DNS logs.",
            "AWS Security Hub — centralizes security findings from GuardDuty, Inspector, Macie, and partner tools.",
            "Amazon Inspector — vulnerability scanning for EC2 and ECR images.",
            "Amazon Detective — graph-based investigation of security findings.",
          ],
        },
        {
          heading: "Protection and data services",
          bullets: [
            "AWS Shield — DDoS protection. Standard is free and automatic. Advanced is paid with a response team.",
            "AWS WAF — Layer 7 web application firewall. Runs on CloudFront, ALB, API Gateway.",
            "AWS Firewall Manager — central policy management across accounts.",
            "AWS KMS — managed encryption keys, HSM-backed. Most AWS services integrate with KMS.",
            "AWS Secrets Manager — store and automatically rotate secrets like DB credentials.",
            "AWS Certificate Manager (ACM) — free SSL/TLS certificates for AWS resources.",
            "Amazon Macie — discovers and classifies sensitive data (PII, PHI) in S3.",
          ],
        },
        {
          heading: "Organizations, SCPs, and multi-account",
          body:
            "AWS Organizations lets you manage many accounts centrally. Service Control Policies (SCPs) are guardrails — they define the maximum permissions any IAM entity in an account can have, regardless of IAM policies. Use SCPs to enforce 'no root user actions' or 'only certain regions allowed.'",
        },
        {
          heading: "Compliance and trust",
          bullets: [
            "AWS Artifact — portal to download compliance reports (SOC 1/2/3, ISO, PCI, FedRAMP).",
            "AWS compliance programs — HIPAA, GDPR, FedRAMP, and 100+ more.",
            "AWS Audit Manager — continuously assesses AWS usage against compliance standards.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "CloudTrail vs CloudWatch vs Config",
          explanation:
            "CloudTrail records API calls (audit). CloudWatch collects metrics and logs (performance/monitoring). Config tracks resource configuration changes over time (state history).",
        },
        {
          confusion: "Security groups vs NACLs",
          explanation:
            "Security groups are stateful and attached to instances. NACLs are stateless and attached to subnets. Security groups allow only; NACLs have explicit allow and deny rules.",
        },
        {
          confusion: "Shield Standard vs Advanced",
          explanation:
            "Standard is automatic, free, and protects against common DDoS. Advanced is paid, adds 24/7 DDoS response team, cost protection during attacks, and WAF at no extra charge.",
        },
        {
          confusion: "IAM roles vs IAM users",
          explanation:
            "Users have long-lived credentials. Roles are temporary and assumed. Apps on EC2 should use roles, not users with access keys.",
        },
        {
          confusion: "KMS vs Secrets Manager",
          explanation:
            "KMS manages encryption keys. Secrets Manager stores secrets (like database passwords) and can rotate them automatically. They serve different purposes.",
        },
      ],
      examTips: [
        "'Who did what and when' → CloudTrail.",
        "'Tracks resource configuration history' → AWS Config.",
        "'Automatically detect threats from logs' → GuardDuty.",
        "'Classify sensitive data in S3' → Macie.",
        "'Central view of security findings' → Security Hub.",
        "'Download SOC 2 report' → AWS Artifact.",
        "'Enforce guardrails across all accounts' → Organizations SCPs.",
        "'Rotate DB password automatically' → Secrets Manager.",
        "'Free SSL certificate for ELB' → ACM.",
      ],
    },
  },
  {
    id: "ccp-cloud-tech",
    examId: "aws-ccp",
    name: "Cloud Technology & Services",
    shortName: "Services",
    weight: 0.34,
    summary:
      "The services themselves — compute, storage, database, networking, and global infrastructure. The biggest service-recognition domain on the exam.",
    subtopics: [
      "Global infrastructure: regions, AZs, edge locations, Local Zones, Wavelength",
      "Compute services (EC2, Lambda, Fargate, ECS/EKS, Elastic Beanstalk, Lightsail)",
      "Storage services (S3, EBS, EFS, FSx, Storage Gateway, Snow Family)",
      "Database services (RDS, Aurora, DynamoDB, Redshift, ElastiCache)",
      "Networking services (VPC, Route 53, CloudFront, Direct Connect, VPN)",
      "Integration and messaging (SQS, SNS, EventBridge, Step Functions)",
      "Analytics and AI/ML services",
    ],
    keyFacts: [
      "Regions are geographic. AZs are physically separate datacenters within a region. Edge locations are CloudFront POPs.",
      "EC2 is IaaS virtual servers. Lambda is serverless, billed per 1 ms of execution.",
      "S3 is object storage — 11 nines of durability, virtually unlimited capacity.",
      "EBS is block storage attached to EC2. EFS is managed NFS. FSx is managed file systems for Windows/Lustre/NetApp.",
      "RDS supports 6 engines. Aurora is MySQL/PostgreSQL-compatible with 5x/3x performance.",
      "DynamoDB is serverless NoSQL with single-digit ms latency.",
      "CloudFront is the CDN. Route 53 is DNS. Direct Connect is private fiber to AWS.",
    ],
    cramSheet: [
      "EC2 = VMs. Lambda = serverless. Fargate = serverless containers.",
      "S3 tiers: Standard, IA, One Zone-IA, Glacier (Instant, Flexible, Deep Archive).",
      "Use EBS for VM disks, EFS for shared Linux, FSx for shared Windows.",
      "RDS for managed SQL. DynamoDB for NoSQL at scale.",
      "VPC is your private network. CloudFront caches at the edge.",
      "Route 53 = DNS. Direct Connect = dedicated fiber. VPN = encrypted over internet.",
    ],
    review: {
      examWeight: "34% of the exam — biggest service-recognition domain",
      overview:
        "You don't need to operate these services — just recognize them. Every question is 'which service fits this need?' Organize them in your head by category (compute/storage/database/network) and by 'managed level' (IaaS → PaaS → serverless). Once you know each service's one-line purpose, the questions become pattern matching.",
      sections: [
        {
          heading: "AWS Global Infrastructure",
          bullets: [
            "Regions — geographic areas. Choose based on latency, compliance, cost. 30+ regions globally.",
            "Availability Zones (AZs) — at least 3 physically separate datacenters per region with independent power, cooling, network.",
            "Edge locations — 400+ POPs used by CloudFront, Route 53, and Global Accelerator.",
            "Local Zones — AWS infrastructure placed close to large population centers for ultra-low latency.",
            "Wavelength — AWS infra embedded in 5G networks for mobile applications.",
            "Outposts — AWS hardware installed in your datacenter for truly hybrid workloads.",
          ],
        },
        {
          heading: "Compute services",
          table: {
            columns: ["Service", "What it is", "When to use"],
            rows: [
              { label: "EC2", cells: ["Virtual servers (IaaS)", "Lift-and-shift, full OS control"] },
              { label: "Lambda", cells: ["Serverless functions", "Event-driven, short-running, pay per 1 ms"] },
              { label: "Fargate", cells: ["Serverless containers", "Run containers without managing servers"] },
              { label: "ECS", cells: ["Container orchestration", "AWS-native containers (works with Fargate or EC2)"] },
              { label: "EKS", cells: ["Managed Kubernetes", "Kubernetes workloads"] },
              { label: "Elastic Beanstalk", cells: ["PaaS for web apps", "Upload code, AWS handles the rest"] },
              { label: "Lightsail", cells: ["Simple VPS", "Small workloads with predictable pricing"] },
              { label: "Batch", cells: ["Batch computing", "Queue-based high-volume jobs"] },
            ],
          },
        },
        {
          heading: "Storage services",
          bullets: [
            "S3 — object storage, virtually unlimited, 11 nines of durability. Tiers: Standard, IA, One Zone-IA, Glacier Instant / Flexible / Deep Archive.",
            "EBS — block storage attached to an EC2 instance. Persists beyond instance. Can be SSD (gp3, io2) or HDD (st1, sc1).",
            "EFS — managed NFS file system. Multi-AZ, scales automatically. For Linux workloads.",
            "FSx — managed file systems: FSx for Windows File Server, Lustre, NetApp ONTAP, OpenZFS.",
            "Storage Gateway — bridges on-prem storage to AWS (file, volume, tape gateways).",
            "Snow Family — physical devices for bulk data transfer: Snowcone (8TB), Snowball (80TB), Snowmobile (exabyte-scale truck).",
          ],
        },
        {
          heading: "Database services",
          bullets: [
            "RDS — managed relational DBs: MySQL, PostgreSQL, MariaDB, Oracle, SQL Server, Aurora.",
            "Aurora — AWS-built MySQL/PostgreSQL-compatible engine with 5x MySQL / 3x PostgreSQL performance.",
            "DynamoDB — serverless NoSQL, single-digit ms latency, scales to millions of requests.",
            "Redshift — managed data warehouse for analytics at petabyte scale.",
            "ElastiCache — managed Redis or Memcached, in-memory cache.",
            "DocumentDB — MongoDB-compatible. Neptune — graph DB. Timestream — time-series DB.",
          ],
        },
        {
          heading: "Networking services",
          bullets: [
            "VPC — your private virtual network in AWS. Subnets, route tables, IGW, NAT gateway.",
            "Security Groups — stateful, instance-level firewall.",
            "NACLs — stateless, subnet-level firewall with allow and deny.",
            "Route 53 — DNS service with routing policies (simple, weighted, latency, failover, geolocation).",
            "CloudFront — global CDN, 400+ edge locations.",
            "Direct Connect — private dedicated fiber from your DC to AWS. No public internet.",
            "AWS VPN — IPsec encrypted tunnel over the internet.",
            "Transit Gateway — hub for connecting VPCs and on-prem networks.",
            "Global Accelerator — anycast static IPs that route through AWS backbone.",
          ],
        },
        {
          heading: "Integration and messaging",
          bullets: [
            "Amazon SQS — managed message queue, decouples services. Two types: Standard (at-least-once) and FIFO (exactly-once).",
            "Amazon SNS — pub/sub, push-based fan-out to multiple subscribers.",
            "Amazon EventBridge — event bus with schema registry; routes events from AWS, SaaS, and your apps.",
            "AWS Step Functions — state machines for orchestrating multi-step workflows.",
            "Amazon MQ — managed ActiveMQ/RabbitMQ for lift-and-shift of traditional messaging.",
          ],
        },
        {
          heading: "Analytics and AI/ML",
          bullets: [
            "Athena — serverless SQL over S3.",
            "EMR — managed Hadoop/Spark for big data.",
            "Kinesis — real-time streaming data (Data Streams, Firehose, Analytics, Video Streams).",
            "QuickSight — BI dashboards.",
            "Glue — serverless ETL and data catalog.",
            "SageMaker — end-to-end ML platform for custom models.",
            "Rekognition — pre-built image and video analysis.",
            "Polly — text-to-speech. Transcribe — speech-to-text. Translate — language translation.",
            "Lex — conversational chatbots (same tech as Alexa).",
            "Comprehend — NLP (sentiment, entities, topics).",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "EBS vs EFS vs S3",
          explanation:
            "EBS is a disk attached to one EC2 instance. EFS is a shared network file system (multiple EC2s). S3 is object storage accessed via API, not mountable as a file system.",
        },
        {
          confusion: "ECS vs EKS vs Fargate",
          explanation:
            "ECS is AWS-native container orchestration. EKS is managed Kubernetes. Fargate is the serverless *launch type* you can use with either — it means you don't manage the underlying EC2s.",
        },
        {
          confusion: "S3 Glacier tiers",
          explanation:
            "Three Glacier tiers by retrieval time: Instant (ms), Flexible (minutes to hours), Deep Archive (hours to 12 hours). Cost decreases as retrieval time increases.",
        },
        {
          confusion: "CloudFront vs Global Accelerator",
          explanation:
            "CloudFront caches content at edge for HTTP/HTTPS. Global Accelerator provides anycast static IPs for any TCP/UDP traffic, routed via AWS backbone.",
        },
        {
          confusion: "Route 53 routing policies",
          explanation:
            "Simple (one value), Weighted (percentage split), Latency (fastest region), Failover (active/passive), Geolocation (by user location), Multi-value (multiple records).",
        },
      ],
      examTips: [
        "'Run code with no servers, pay per execution' → Lambda.",
        "'Object storage' → S3.",
        "'Shared file system for multiple EC2s' → EFS.",
        "'Managed relational database' → RDS.",
        "'NoSQL with single-digit ms latency' → DynamoDB.",
        "'Private dedicated fiber to AWS' → Direct Connect.",
        "'CDN at the edge' → CloudFront.",
        "'Decouple microservices with a queue' → SQS.",
        "'Fan out to many subscribers' → SNS.",
        "'Transfer petabytes over the network would take too long' → Snow Family.",
      ],
    },
  },
  {
    id: "ccp-billing-support",
    examId: "aws-ccp",
    name: "Billing, Pricing & Support",
    shortName: "Billing & Support",
    weight: 0.12,
    summary:
      "Pricing models, cost management tools, and support plan tiers — the smallest but easiest domain if you memorize the five support plans.",
    subtopics: [
      "AWS Free Tier (free forever, 12 months, trials)",
      "Pricing fundamentals (compute, storage, data transfer)",
      "Savings Plans vs Reserved Instances vs Spot Instances",
      "AWS Budgets, Cost Explorer, Cost and Usage Report",
      "Support plans: Basic, Developer, Business, Enterprise On-Ramp, Enterprise",
      "AWS Trusted Advisor, Personal Health Dashboard",
      "AWS Marketplace",
    ],
    keyFacts: [
      "Compute, storage, and data transfer are the three main cost drivers.",
      "Free Tier has three flavors: always free, 12 months free, and time-limited trials.",
      "Reserved Instances = 1 or 3-year commitment with up to 72% discount.",
      "Savings Plans = flexible 1/3-year commitment on $/hour spend, not specific instance types.",
      "Spot Instances = up to 90% off, but can be terminated with 2 min notice.",
      "Support plans escalate: Basic (free) → Developer → Business → Enterprise On-Ramp → Enterprise.",
      "Trusted Advisor has 5 pillars: cost optimization, performance, security, fault tolerance, service limits.",
    ],
    cramSheet: [
      "Free Tier — always free (DynamoDB 25GB), 12 months (EC2 750h/month), trials (Inspector).",
      "RI = commitment. SP = flexible commitment. Spot = cheapest but interruptible.",
      "Cost Explorer visualizes. Budgets alerts. CUR is the raw export.",
      "Business plan = first tier with 24/7 tech support via chat/phone/email.",
      "Trusted Advisor full checks are Business+ only.",
    ],
    review: {
      examWeight: "12% of the exam — smallest domain, easiest to bank",
      overview:
        "Billing and support is the smallest domain but comes with almost guaranteed points if you memorize a few specifics: the three kinds of Free Tier, the three EC2 purchasing models, the five support plans, and the five Trusted Advisor pillars. A handful of lists carries most of this domain.",
      sections: [
        {
          heading: "How AWS pricing works",
          body:
            "Three core cost drivers: compute (EC2 hours, Lambda GB-seconds), storage (GB-months across S3/EBS/EFS), and data transfer (especially outbound). Inbound data transfer is free. Data transfer within a region and between AZs has specific rules. Understand this shape even if you don't memorize rates.",
        },
        {
          heading: "AWS Free Tier — three flavors",
          bullets: [
            "Always free — services that have a free allowance indefinitely (DynamoDB 25 GB, Lambda 1M requests/month).",
            "12 months free — new accounts get free usage for 12 months (EC2 t2.micro 750 hours/month, S3 5GB).",
            "Trials — short-term free trials for specific services (Amazon Inspector 15 days, Redshift 2 months).",
          ],
        },
        {
          heading: "EC2 purchasing models",
          table: {
            columns: ["Model", "Discount", "Best for"],
            rows: [
              { label: "On-Demand", cells: ["None", "Spiky or unknown workloads"] },
              { label: "Reserved Instances", cells: ["Up to 72%", "Steady-state, 1 or 3 year commit"] },
              { label: "Savings Plans", cells: ["Up to 72%", "Flexible — apply to Lambda/Fargate/EC2 by $/hour commit"] },
              { label: "Spot Instances", cells: ["Up to 90%", "Fault-tolerant, batch, CI/CD — can be terminated"] },
              { label: "Dedicated Host", cells: ["Varies", "BYOL licenses, compliance requirements"] },
            ],
          },
        },
        {
          heading: "Cost management tools",
          bullets: [
            "AWS Cost Explorer — visualize cost trends, forecast, filter by tag/service/account.",
            "AWS Budgets — set cost/usage/RI budgets with alerts via SNS.",
            "AWS Cost and Usage Report (CUR) — detailed line-item export to S3.",
            "AWS Pricing Calculator — estimate costs before building.",
            "AWS Cost Anomaly Detection — ML-based alerts when spend deviates.",
            "Billing alarms — CloudWatch alarms on estimated charges.",
          ],
        },
        {
          heading: "Support plans",
          table: {
            columns: ["Plan", "Cost", "Response & features"],
            rows: [
              { label: "Basic", cells: ["Free", "24/7 customer service, docs, whitepapers, forums"] },
              { label: "Developer", cells: ["From $29/mo", "Business-hours email support, 1 contact"] },
              { label: "Business", cells: ["From $100/mo", "24/7 tech support (chat/phone/email), full Trusted Advisor, unlimited contacts"] },
              { label: "Enterprise On-Ramp", cells: ["From $5,500/mo", "Business plus 30-min response on business-critical, pool of Technical Account Managers"] },
              { label: "Enterprise", cells: ["From $15,000/mo", "Designated TAM, 15-min response on critical, Concierge billing"] },
            ],
          },
        },
        {
          heading: "Trusted Advisor",
          body:
            "Automated checks across five pillars. Basic and Developer plans see a limited subset. Business and higher see full checks.",
          bullets: [
            "Cost Optimization — find idle or underutilized resources.",
            "Performance — check for throttled services or missing upgrades.",
            "Security — find exposed ports, root MFA missing, weak IAM policies.",
            "Fault Tolerance — missing Multi-AZ, no backups.",
            "Service Limits — alert when close to account limits.",
          ],
        },
        {
          heading: "Other support resources",
          bullets: [
            "AWS Personal Health Dashboard — events affecting YOUR resources (like Azure Service Health).",
            "AWS Service Health Dashboard — public status page.",
            "AWS re:Post — community Q&A (replaces AWS Forums).",
            "AWS Training and Certification — free and paid learning paths.",
            "AWS Well-Architected Tool — workload reviews against the 6 pillars.",
            "AWS Marketplace — third-party software, billed via AWS.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Reserved Instances vs Savings Plans",
          explanation:
            "RIs apply to specific instance types in a region. Savings Plans commit to $/hour spend and apply flexibly across EC2 families, Lambda, and Fargate. SP is almost always easier to manage.",
        },
        {
          confusion: "Cost Explorer vs Budgets vs CUR",
          explanation:
            "Cost Explorer = visualize. Budgets = alert. CUR = raw detailed export for external analysis.",
        },
        {
          confusion: "Basic support features",
          explanation:
            "Basic includes 24/7 CUSTOMER SERVICE (account, billing). It does NOT include technical support. Developer is the first tier with any tech support.",
        },
        {
          confusion: "Personal Health Dashboard vs Service Health Dashboard",
          explanation:
            "Personal = affecting your account specifically. Service = public status of AWS regions overall. Use Personal for investigating your own issues.",
        },
        {
          confusion: "Trusted Advisor free vs paid",
          explanation:
            "Basic and Developer plans see 7 core checks. Business+ plans see the full ~115 checks across all five pillars.",
        },
      ],
      examTips: [
        "'Pay upfront for 3 years' → Reserved Instance or Savings Plan.",
        "'Up to 90% off but can be interrupted' → Spot Instance.",
        "'Alert when monthly spend hits $500' → AWS Budgets.",
        "'Visualize cost trends' → Cost Explorer.",
        "'First tier with 24/7 tech support' → Business.",
        "'Required for a dedicated TAM' → Enterprise (Enterprise On-Ramp has a pool).",
        "'Find security issues, cost waste, fault tolerance gaps' → Trusted Advisor.",
        "'Third-party software billed through AWS' → AWS Marketplace.",
      ],
    },
  },
];

export const AWS_CCP_QUESTIONS: Question[] = [
  // Cloud Concepts
  {
    id: "q-ccp-cc-1",
    examId: "aws-ccp",
    topicId: "ccp-cloud-concepts",
    prompt:
      "Which of the six advantages of cloud computing describes paying only for resources you consume?",
    choices: [
      "Benefit from massive economies of scale",
      "Trade fixed expense for variable expense",
      "Go global in minutes",
      "Stop guessing capacity",
    ],
    correctIndex: 1,
    explanation:
      "Trading fixed (CapEx) expense for variable (OpEx) expense describes pay-as-you-go cloud billing.",
    difficulty: "easy",
    tags: ["advantages"],
  },
  {
    id: "q-ccp-cc-2",
    examId: "aws-ccp",
    topicId: "ccp-cloud-concepts",
    prompt: "Which pillar of the AWS Well-Architected Framework focuses on avoiding unnecessary costs?",
    choices: ["Operational Excellence", "Performance Efficiency", "Cost Optimization", "Reliability"],
    correctIndex: 2,
    explanation:
      "Cost Optimization is the pillar that targets efficient resource use and avoiding waste.",
    difficulty: "easy",
    tags: ["well-architected"],
  },
  {
    id: "q-ccp-cc-3",
    examId: "aws-ccp",
    topicId: "ccp-cloud-concepts",
    prompt:
      "A company is moving an application from on-prem to AWS without changing any code. Which migration strategy is this?",
    choices: ["Refactor", "Replatform", "Rehost", "Retire"],
    correctIndex: 2,
    explanation:
      "Rehost (lift-and-shift) moves workloads as-is without code changes. Replatform involves minor tweaks; refactor involves re-architecture.",
    difficulty: "easy",
    tags: ["migration"],
  },
  {
    id: "q-ccp-cc-4",
    examId: "aws-ccp",
    topicId: "ccp-cloud-concepts",
    prompt:
      "A startup switches from running email servers to using Microsoft 365. Which migration strategy is this?",
    choices: ["Rehost", "Replatform", "Refactor", "Repurchase"],
    correctIndex: 3,
    explanation:
      "Replacing a self-hosted system with a SaaS alternative is a Repurchase (drop-and-shop) migration.",
    difficulty: "medium",
    tags: ["migration"],
  },
  {
    id: "q-ccp-cc-5",
    examId: "aws-ccp",
    topicId: "ccp-cloud-concepts",
    prompt: "Which Well-Architected pillar was added most recently to address environmental impact?",
    choices: ["Sustainability", "Reliability", "Security", "Performance Efficiency"],
    correctIndex: 0,
    explanation:
      "Sustainability was added as the sixth pillar in 2021 to address environmental impact of cloud workloads.",
    difficulty: "medium",
    tags: ["well-architected"],
  },
  {
    id: "q-ccp-cc-6",
    examId: "aws-ccp",
    topicId: "ccp-cloud-concepts",
    prompt: "What is the main benefit of designing loosely coupled systems?",
    choices: [
      "Lower cost",
      "Failures in one component do not cascade to others",
      "Simpler deployment",
      "Faster network speed",
    ],
    correctIndex: 1,
    explanation:
      "Loose coupling isolates components so failures stay contained and components can scale independently.",
    difficulty: "medium",
    tags: ["design-principles"],
  },
  {
    id: "q-ccp-cc-7",
    examId: "aws-ccp",
    topicId: "ccp-cloud-concepts",
    prompt:
      "Which framework provides high-level guidance for an organization's overall cloud adoption journey?",
    choices: [
      "Well-Architected Framework",
      "AWS Cloud Adoption Framework (CAF)",
      "Shared Responsibility Model",
      "AWS Organizations",
    ],
    correctIndex: 1,
    explanation:
      "CAF addresses organizational transformation; Well-Architected addresses workload-level best practices.",
    difficulty: "hard",
    tags: ["caf"],
  },

  // Security & Compliance
  {
    id: "q-ccp-sc-1",
    examId: "aws-ccp",
    topicId: "ccp-security-compliance",
    prompt: "In the AWS Shared Responsibility Model, which is always the customer's responsibility?",
    choices: [
      "Physical security of datacenters",
      "Hypervisor patching",
      "Customer data and IAM configuration",
      "AWS global network backbone",
    ],
    correctIndex: 2,
    explanation:
      "Customer data and access management are always the customer's responsibility, regardless of service.",
    difficulty: "easy",
    tags: ["shared-responsibility"],
  },
  {
    id: "q-ccp-sc-2",
    examId: "aws-ccp",
    topicId: "ccp-security-compliance",
    prompt: "Which AWS service records every API call for audit purposes?",
    choices: ["AWS Config", "AWS CloudTrail", "Amazon CloudWatch", "AWS Trusted Advisor"],
    correctIndex: 1,
    explanation:
      "CloudTrail records API calls (who, what, when, from where). Config tracks resource state over time.",
    difficulty: "easy",
    tags: ["cloudtrail"],
  },
  {
    id: "q-ccp-sc-3",
    examId: "aws-ccp",
    topicId: "ccp-security-compliance",
    prompt: "Which service uses machine learning to detect malicious activity from VPC flow logs and CloudTrail?",
    choices: ["AWS Shield", "Amazon Inspector", "Amazon GuardDuty", "AWS WAF"],
    correctIndex: 2,
    explanation:
      "GuardDuty is AWS's ML-based threat detection service. Inspector scans for vulnerabilities.",
    difficulty: "medium",
    tags: ["guardduty"],
  },
  {
    id: "q-ccp-sc-4",
    examId: "aws-ccp",
    topicId: "ccp-security-compliance",
    prompt: "What is the best practice for granting EC2 instances access to AWS services?",
    choices: [
      "Store IAM user access keys on the instance",
      "Use the root user's credentials",
      "Assign an IAM role to the instance",
      "Use environment variables with hardcoded credentials",
    ],
    correctIndex: 2,
    explanation:
      "IAM roles give temporary, rotated credentials. Never store access keys on instances.",
    difficulty: "easy",
    tags: ["iam-roles"],
  },
  {
    id: "q-ccp-sc-5",
    examId: "aws-ccp",
    topicId: "ccp-security-compliance",
    prompt: "Where can you download AWS's SOC 2 and ISO 27001 compliance reports?",
    choices: ["AWS Artifact", "AWS Trusted Advisor", "AWS Security Hub", "AWS Config"],
    correctIndex: 0,
    explanation:
      "AWS Artifact is the self-service portal for compliance reports and agreements.",
    difficulty: "medium",
    tags: ["compliance"],
  },
  {
    id: "q-ccp-sc-6",
    examId: "aws-ccp",
    topicId: "ccp-security-compliance",
    prompt:
      "A company wants to enforce 'no root user actions' across all accounts in AWS Organizations. Which feature achieves this?",
    choices: [
      "IAM policies",
      "Service Control Policies (SCPs)",
      "AWS Config rules",
      "Security Groups",
    ],
    correctIndex: 1,
    explanation:
      "SCPs define maximum permissions across an Organization. They can restrict even root user actions.",
    difficulty: "medium",
    tags: ["organizations"],
  },
  {
    id: "q-ccp-sc-7",
    examId: "aws-ccp",
    topicId: "ccp-security-compliance",
    prompt: "Which service discovers and classifies sensitive data (like PII) stored in Amazon S3?",
    choices: ["Amazon Macie", "AWS KMS", "Amazon Inspector", "AWS Secrets Manager"],
    correctIndex: 0,
    explanation:
      "Macie is purpose-built to discover and classify sensitive data in S3 using ML.",
    difficulty: "medium",
    tags: ["macie"],
  },
  {
    id: "q-ccp-sc-8",
    examId: "aws-ccp",
    topicId: "ccp-security-compliance",
    prompt: "AWS Shield Standard is:",
    choices: [
      "A paid add-on with DDoS response team",
      "Automatically enabled for all AWS customers at no cost",
      "Only available in the US regions",
      "A replacement for AWS WAF",
    ],
    correctIndex: 1,
    explanation:
      "Shield Standard is free and automatic. Shield Advanced is paid and adds 24/7 DDoS response.",
    difficulty: "easy",
    tags: ["shield"],
  },

  // Cloud Technology
  {
    id: "q-ccp-ct-1",
    examId: "aws-ccp",
    topicId: "ccp-cloud-tech",
    prompt: "Which AWS compute service lets you run code without provisioning or managing servers?",
    choices: ["Amazon EC2", "AWS Lambda", "Amazon Lightsail", "AWS Batch"],
    correctIndex: 1,
    explanation:
      "Lambda is serverless — AWS handles the infrastructure and bills per ms of execution.",
    difficulty: "easy",
    tags: ["lambda"],
  },
  {
    id: "q-ccp-ct-2",
    examId: "aws-ccp",
    topicId: "ccp-cloud-tech",
    prompt: "Which storage service offers 11 nines of durability and virtually unlimited capacity?",
    choices: ["Amazon EBS", "Amazon EFS", "Amazon S3", "Amazon FSx"],
    correctIndex: 2,
    explanation:
      "S3 is object storage with 11 nines of durability and essentially unlimited capacity.",
    difficulty: "easy",
    tags: ["s3"],
  },
  {
    id: "q-ccp-ct-3",
    examId: "aws-ccp",
    topicId: "ccp-cloud-tech",
    prompt: "A workload needs a shared file system accessible from multiple Linux EC2 instances. Which service fits best?",
    choices: ["Amazon EBS", "Amazon EFS", "Amazon S3", "Amazon FSx for Windows"],
    correctIndex: 1,
    explanation:
      "EFS is a managed NFS file system shareable across many Linux EC2 instances. EBS attaches to one instance.",
    difficulty: "medium",
    tags: ["efs"],
  },
  {
    id: "q-ccp-ct-4",
    examId: "aws-ccp",
    topicId: "ccp-cloud-tech",
    prompt: "Which database service is serverless and designed for single-digit millisecond NoSQL performance at scale?",
    choices: ["Amazon RDS", "Amazon Redshift", "Amazon DynamoDB", "Amazon Aurora"],
    correctIndex: 2,
    explanation:
      "DynamoDB is serverless NoSQL with single-digit ms latency at any scale.",
    difficulty: "easy",
    tags: ["dynamodb"],
  },
  {
    id: "q-ccp-ct-5",
    examId: "aws-ccp",
    topicId: "ccp-cloud-tech",
    prompt:
      "A company needs a dedicated, private network connection from their datacenter to AWS that bypasses the public internet. Which service?",
    choices: ["AWS Site-to-Site VPN", "AWS Direct Connect", "AWS Transit Gateway", "Amazon CloudFront"],
    correctIndex: 1,
    explanation:
      "Direct Connect is a dedicated private fiber circuit. VPN goes over the public internet.",
    difficulty: "medium",
    tags: ["direct-connect"],
  },
  {
    id: "q-ccp-ct-6",
    examId: "aws-ccp",
    topicId: "ccp-cloud-tech",
    prompt: "What is the primary purpose of Amazon CloudFront?",
    choices: [
      "A DNS service",
      "A global content delivery network (CDN)",
      "A virtual private network gateway",
      "A load balancer",
    ],
    correctIndex: 1,
    explanation:
      "CloudFront is AWS's CDN with 400+ edge locations for caching content close to users.",
    difficulty: "easy",
    tags: ["cloudfront"],
  },
  {
    id: "q-ccp-ct-7",
    examId: "aws-ccp",
    topicId: "ccp-cloud-tech",
    prompt:
      "A customer needs to transfer 80 TB of data to AWS but network transfer would take months. Which service fits best?",
    choices: [
      "AWS Storage Gateway",
      "AWS Snowball",
      "AWS Direct Connect",
      "Amazon S3 Transfer Acceleration",
    ],
    correctIndex: 1,
    explanation:
      "Snowball is a physical device for large offline transfers (80 TB per device). Snowmobile handles exabyte-scale.",
    difficulty: "medium",
    tags: ["snow"],
  },
  {
    id: "q-ccp-ct-8",
    examId: "aws-ccp",
    topicId: "ccp-cloud-tech",
    prompt: "Which service decouples microservices by providing a managed message queue?",
    choices: ["Amazon SNS", "Amazon SQS", "Amazon EventBridge", "AWS Step Functions"],
    correctIndex: 1,
    explanation:
      "SQS is a managed message queue for decoupling. SNS is pub/sub for fan-out.",
    difficulty: "medium",
    tags: ["sqs"],
  },
  {
    id: "q-ccp-ct-9",
    examId: "aws-ccp",
    topicId: "ccp-cloud-tech",
    prompt: "An Availability Zone is best described as:",
    choices: [
      "A geographic region",
      "One or more physically separate datacenters within a region with independent power and networking",
      "A collection of edge locations",
      "A single datacenter building",
    ],
    correctIndex: 1,
    explanation:
      "AZs are one or more physically separate DCs within a region, with independent power, cooling, and networking.",
    difficulty: "easy",
    tags: ["global-infra"],
  },

  // Billing & Support
  {
    id: "q-ccp-bs-1",
    examId: "aws-ccp",
    topicId: "ccp-billing-support",
    prompt:
      "A company wants to save up to 72% on EC2 by committing to 1 or 3 years of specific instance types. Which pricing model is this?",
    choices: ["Spot Instances", "On-Demand", "Reserved Instances", "Dedicated Hosts"],
    correctIndex: 2,
    explanation:
      "Reserved Instances offer up to 72% discount for a 1 or 3-year commitment on specific instance types.",
    difficulty: "easy",
    tags: ["pricing"],
  },
  {
    id: "q-ccp-bs-2",
    examId: "aws-ccp",
    topicId: "ccp-billing-support",
    prompt: "Which AWS service visualizes historical spend and forecasts future costs?",
    choices: ["AWS Budgets", "AWS Cost Explorer", "AWS Cost and Usage Report", "AWS Pricing Calculator"],
    correctIndex: 1,
    explanation:
      "Cost Explorer visualizes and forecasts. Budgets alerts. CUR is the raw export. Pricing Calculator estimates future costs.",
    difficulty: "easy",
    tags: ["cost-explorer"],
  },
  {
    id: "q-ccp-bs-3",
    examId: "aws-ccp",
    topicId: "ccp-billing-support",
    prompt:
      "Which AWS Support plan is the cheapest tier to offer 24/7 technical support via phone, chat, and email?",
    choices: ["Basic", "Developer", "Business", "Enterprise"],
    correctIndex: 2,
    explanation:
      "Business is the first tier with 24/7 technical support. Developer only offers business-hours email support.",
    difficulty: "medium",
    tags: ["support"],
  },
  {
    id: "q-ccp-bs-4",
    examId: "aws-ccp",
    topicId: "ccp-billing-support",
    prompt: "Which service provides automated best-practice recommendations across cost, performance, security, fault tolerance, and service limits?",
    choices: [
      "AWS Trusted Advisor",
      "AWS CloudWatch",
      "AWS Config",
      "AWS Personal Health Dashboard",
    ],
    correctIndex: 0,
    explanation:
      "Trusted Advisor runs automated checks across all five pillars. Full checks require Business plan or higher.",
    difficulty: "easy",
    tags: ["trusted-advisor"],
  },
  {
    id: "q-ccp-bs-5",
    examId: "aws-ccp",
    topicId: "ccp-billing-support",
    prompt:
      "Which pricing option offers up to 90% discount but can be interrupted with 2-minute notice?",
    choices: ["Reserved Instances", "Savings Plans", "Spot Instances", "On-Demand"],
    correctIndex: 2,
    explanation:
      "Spot Instances offer up to 90% off but can be reclaimed with 2 minutes' notice. Best for fault-tolerant workloads.",
    difficulty: "easy",
    tags: ["spot"],
  },
  {
    id: "q-ccp-bs-6",
    examId: "aws-ccp",
    topicId: "ccp-billing-support",
    prompt:
      "Which tool would you use BEFORE deploying to estimate the monthly cost of a planned architecture?",
    choices: [
      "AWS Cost Explorer",
      "AWS Pricing Calculator",
      "AWS Budgets",
      "AWS Cost and Usage Report",
    ],
    correctIndex: 1,
    explanation:
      "Pricing Calculator estimates costs before deployment. Cost Explorer shows actual historical spend.",
    difficulty: "easy",
    tags: ["pricing-calc"],
  },
  {
    id: "q-ccp-bs-7",
    examId: "aws-ccp",
    topicId: "ccp-billing-support",
    prompt: "Which dashboard shows events impacting your specific AWS account?",
    choices: [
      "AWS Service Health Dashboard",
      "AWS Personal Health Dashboard",
      "AWS Trusted Advisor",
      "AWS Config",
    ],
    correctIndex: 1,
    explanation:
      "Personal Health Dashboard is personalized to your account. Service Health Dashboard is public.",
    difficulty: "medium",
    tags: ["health"],
  },
  {
    id: "q-ccp-bs-8",
    examId: "aws-ccp",
    topicId: "ccp-billing-support",
    prompt: "Which AWS Support plan includes a designated Technical Account Manager (TAM)?",
    choices: ["Developer", "Business", "Enterprise On-Ramp", "Enterprise"],
    correctIndex: 3,
    explanation:
      "Enterprise plan includes a designated TAM. Enterprise On-Ramp has access to a pool of TAMs but not a dedicated one.",
    difficulty: "hard",
    tags: ["support"],
  },
];

export const AWS_CCP_DIAGNOSTIC = [
  "q-ccp-cc-1",
  "q-ccp-cc-3",
  "q-ccp-cc-5",
  "q-ccp-sc-1",
  "q-ccp-sc-2",
  "q-ccp-sc-4",
  "q-ccp-ct-1",
  "q-ccp-ct-2",
  "q-ccp-ct-5",
  "q-ccp-ct-9",
  "q-ccp-bs-1",
  "q-ccp-bs-3",
];

export const AWS_CCP_LESSONS: Lesson[] = [
  // Cloud Concepts
  {
    id: "l-ccp-cc-1",
    topicId: "ccp-cloud-concepts",
    order: 1,
    title: "Why AWS exists (the six advantages)",
    summary:
      "The business case for cloud — six specific benefits AWS preaches and the exam expects you to recognize.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "The cloud pitch",
        body:
          "AWS makes a specific, repeated case for why cloud beats running your own datacenter. The exam tests whether you can identify each advantage by its scenario.",
      },
      {
        kind: "concept",
        title: "The six advantages",
        bullets: [
          "Trade fixed expense for variable expense (OpEx over CapEx).",
          "Benefit from massive economies of scale.",
          "Stop guessing capacity.",
          "Increase speed and agility.",
          "Stop spending money running and maintaining datacenters.",
          "Go global in minutes.",
        ],
      },
      {
        kind: "example",
        title: "In a scenario",
        body:
          "A startup deploys in 6 AWS regions in an afternoon. Before AWS, that would have meant leasing 6 datacenters. That's 'go global in minutes' AND 'stop spending money on DCs' in one move.",
      },
      {
        kind: "tip",
        title: "Exam pattern",
        bullets: [
          "'Pay only for what you use' → variable expense.",
          "'Scale up or down on demand' → stop guessing capacity.",
          "'Deploy in new regions quickly' → go global in minutes.",
          "'Shared infrastructure drives down costs' → economies of scale.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Six advantages: variable cost, scale, capacity, speed, no DCs, global reach.",
      },
    ],
  },
  {
    id: "l-ccp-cc-2",
    topicId: "ccp-cloud-concepts",
    order: 2,
    title: "Well-Architected Framework — the 6 pillars",
    summary: "AWS's best-practice framework and the pillar each concern maps to.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "A framework, not a product",
        body:
          "The Well-Architected Framework is guidance — a set of questions you ask when building on AWS. Six pillars, each with its own focus.",
      },
      {
        kind: "comparison",
        title: "The six pillars",
        table: {
          columns: ["Pillar", "Focus"],
          rows: [
            { label: "Operational Excellence", cells: ["Run and monitor systems"] },
            { label: "Security", cells: ["Protect data and systems"] },
            { label: "Reliability", cells: ["Recover and meet demand"] },
            { label: "Performance Efficiency", cells: ["Use resources effectively"] },
            { label: "Cost Optimization", cells: ["Avoid unnecessary costs"] },
            { label: "Sustainability", cells: ["Minimize environmental impact"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Quick mapping",
        bullets: [
          "Encryption → Security.",
          "Multi-AZ deployment → Reliability.",
          "Right-sizing EC2 → Cost Optimization or Performance Efficiency.",
          "Automated runbooks → Operational Excellence.",
          "Choosing a greener region → Sustainability.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Six pillars — ops, security, reliability, performance, cost, sustainability.",
      },
    ],
  },
  {
    id: "l-ccp-cc-3",
    topicId: "ccp-cloud-concepts",
    order: 3,
    title: "The 7 Rs of migration",
    summary: "How organizations move workloads to AWS — seven named strategies.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Not every workload moves the same way",
        body:
          "Some workloads get lifted as-is. Some get re-architected. Some get deleted. AWS names seven paths.",
      },
      {
        kind: "concept",
        title: "The 7 Rs",
        bullets: [
          "Retire — turn it off.",
          "Retain — leave on-premises for now.",
          "Rehost — lift-and-shift to EC2, no changes.",
          "Relocate — move VMs using VMware Cloud on AWS.",
          "Replatform — small tweaks (e.g., RDS instead of self-hosted MySQL).",
          "Refactor — re-architect for cloud-native (containers, serverless).",
          "Repurchase — replace with SaaS (drop-and-shop).",
        ],
      },
      {
        kind: "tip",
        title: "Pattern matching",
        bullets: [
          "'No code changes' → Rehost.",
          "'Switch from self-hosted Exchange to M365' → Repurchase.",
          "'Move to containers and Lambda' → Refactor.",
          "'Small adjustments like switching DB engine' → Replatform.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Retire, retain, rehost, relocate, replatform, refactor, repurchase.",
      },
    ],
  },

  // Security
  {
    id: "l-ccp-sc-1",
    topicId: "ccp-security-compliance",
    order: 1,
    title: "The Shared Responsibility Model",
    summary:
      "AWS secures the cloud. You secure what's in it. The single most tested concept on the CCP.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "The line everyone needs to know",
        body:
          "AWS and you split security responsibility. Know which side of the line each concern falls on.",
      },
      {
        kind: "comparison",
        title: "Who owns what",
        table: {
          columns: ["Responsibility", "Owner"],
          rows: [
            { label: "Physical datacenter security", cells: ["AWS"] },
            { label: "Hypervisor and host OS", cells: ["AWS"] },
            { label: "Guest OS patching on EC2", cells: ["You"] },
            { label: "Network and firewall configuration", cells: ["You"] },
            { label: "Encryption choices for your data", cells: ["You"] },
            { label: "IAM users, roles, and policies", cells: ["You"] },
            { label: "Application code on EC2", cells: ["You"] },
          ],
        },
      },
      {
        kind: "concept",
        title: "Changes with the service model",
        body:
          "For managed services like S3 or RDS, AWS takes on more (OS patching on the RDS engine, storage infrastructure). But data, IAM, and configurations remain yours — always.",
      },
      {
        kind: "tip",
        title: "Exam trap",
        bullets: [
          "Data encryption CHOICES are always yours.",
          "Physical security is always AWS's.",
          "Managed-service internals are AWS's; your configuration of them is yours.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "AWS = security OF the cloud. You = security IN the cloud.",
      },
    ],
  },
  {
    id: "l-ccp-sc-2",
    topicId: "ccp-security-compliance",
    order: 2,
    title: "IAM — users, groups, roles, policies",
    summary: "The four building blocks of access control on AWS.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "IAM is global and free",
        body:
          "IAM (Identity and Access Management) is the front door to every AWS service. It's free, global, and always-on.",
      },
      {
        kind: "concept",
        title: "The four primitives",
        bullets: [
          "User — a long-term identity for a human or app.",
          "Group — a collection of users that share a policy set.",
          "Role — a set of permissions another entity can assume. No long-term credentials.",
          "Policy — a JSON document that defines what's allowed or denied.",
        ],
      },
      {
        kind: "example",
        title: "Roles in action",
        body:
          "An EC2 instance needs to read from S3. Instead of storing an IAM user's access keys on the instance, you attach an IAM role. The instance 'assumes' the role and gets temporary, rotating credentials automatically.",
      },
      {
        kind: "tip",
        title: "Best practices",
        bullets: [
          "Enable MFA on root. Don't use root for daily work.",
          "Grant least privilege — start with no access, add what's needed.",
          "Use roles for services, not users with access keys.",
          "Rotate credentials; use IAM Access Analyzer to find unused permissions.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "User = long-term. Role = temporary. Group = share policies. Policy = the rules.",
      },
    ],
  },
  {
    id: "l-ccp-sc-3",
    topicId: "ccp-security-compliance",
    order: 3,
    title: "Detection services — CloudTrail, Config, GuardDuty",
    summary:
      "Three services that get confused constantly. Learn the one-line role of each.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Different questions, different tools",
        body:
          "CloudTrail, Config, and GuardDuty all deal with 'what's happening in my account' — but each answers a different question.",
      },
      {
        kind: "comparison",
        title: "Which one answers which question",
        table: {
          columns: ["Question", "Service"],
          rows: [
            { label: "Who made this API call?", cells: ["CloudTrail"] },
            { label: "What did my resource config look like last week?", cells: ["AWS Config"] },
            { label: "Is there a threat active in my account right now?", cells: ["GuardDuty"] },
            { label: "Central view of all security findings", cells: ["Security Hub"] },
            { label: "Vulnerabilities in my EC2 or ECR images", cells: ["Inspector"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Exam keywords",
        bullets: [
          "'API audit log' → CloudTrail.",
          "'Compliance rules on resource configuration' → Config.",
          "'ML-based threat detection' → GuardDuty.",
          "'Aggregated security findings dashboard' → Security Hub.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "CloudTrail = who did what. Config = what it looked like. GuardDuty = is something wrong.",
      },
    ],
  },

  // Cloud Technology
  {
    id: "l-ccp-ct-1",
    topicId: "ccp-cloud-tech",
    order: 1,
    title: "Regions, AZs, and edge locations",
    summary:
      "AWS's global infrastructure vocabulary. Learn these four terms cold.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "AWS is bigger than you think",
        body:
          "AWS runs 30+ regions, 100+ availability zones, 400+ edge locations. You need to know what each layer does.",
      },
      {
        kind: "concept",
        title: "Region",
        body:
          "A geographic area (e.g., us-east-1, eu-west-1). You choose a region based on latency, compliance, and cost. Most services are region-scoped.",
      },
      {
        kind: "concept",
        title: "Availability Zone (AZ)",
        body:
          "One or more physically separate datacenters inside a region with independent power, cooling, and networking. Most regions have at least 3 AZs.",
      },
      {
        kind: "concept",
        title: "Edge location",
        body:
          "A CloudFront point of presence. 400+ worldwide. Used for caching content, DNS (Route 53), and accelerating traffic (Global Accelerator).",
      },
      {
        kind: "concept",
        title: "Local Zones, Wavelength, Outposts",
        bullets: [
          "Local Zones — AWS infra in major metro areas for ultra-low latency.",
          "Wavelength — AWS embedded in 5G networks for mobile apps.",
          "Outposts — AWS hardware in your own datacenter.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Region = geography. AZ = DC within a region. Edge = CDN point of presence.",
      },
    ],
  },
  {
    id: "l-ccp-ct-2",
    topicId: "ccp-cloud-tech",
    order: 2,
    title: "Compute services — EC2, Lambda, and friends",
    summary:
      "Pick the right compute service based on how much AWS manages for you.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "Compute is a spectrum",
        body:
          "EC2 is raw VMs. Lambda is fully serverless. In between are container services, PaaS offerings, and simpler VPS options. The exam tests your ability to pick based on the scenario.",
      },
      {
        kind: "comparison",
        title: "The main compute services",
        table: {
          columns: ["Service", "Best for"],
          rows: [
            { label: "EC2", cells: ["Full OS control, any workload"] },
            { label: "Lambda", cells: ["Event-driven, short-running code"] },
            { label: "Fargate", cells: ["Containers without managing servers"] },
            { label: "ECS / EKS", cells: ["Container orchestration"] },
            { label: "Elastic Beanstalk", cells: ["Upload web app code, AWS handles infra"] },
            { label: "Lightsail", cells: ["Simple VPS with predictable pricing"] },
            { label: "Batch", cells: ["Queue-based batch jobs"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Keyword shortcuts",
        bullets: [
          "'Run a short function on events' → Lambda.",
          "'Run containers without managing hosts' → Fargate.",
          "'Simple VM with flat pricing' → Lightsail.",
          "'Automated job processing queue' → Batch.",
          "'Upload a web app, AWS does the rest' → Elastic Beanstalk.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "EC2 for control. Lambda for serverless. Fargate for serverless containers. Beanstalk for web PaaS.",
      },
    ],
  },
  {
    id: "l-ccp-ct-3",
    topicId: "ccp-cloud-tech",
    order: 3,
    title: "Storage — S3, EBS, EFS, and when to use each",
    summary:
      "Object, block, and file storage on AWS. Each is for a very specific job.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "Three storage types, three jobs",
        body:
          "Don't memorize every option — memorize the categories and their role.",
      },
      {
        kind: "concept",
        title: "S3 — object storage",
        bullets: [
          "Store files via API, not as a mounted file system.",
          "Virtually unlimited capacity, 11 nines of durability.",
          "Tiers trade storage cost for retrieval cost: Standard, IA, Glacier (Instant/Flexible/Deep Archive).",
          "Best for static websites, images, video, backups, data lakes.",
        ],
      },
      {
        kind: "concept",
        title: "EBS — block storage",
        bullets: [
          "A virtual disk attached to a single EC2 instance.",
          "SSD (gp3, io2) or HDD (st1, sc1).",
          "Persists beyond the instance life.",
          "Snapshots stored in S3.",
        ],
      },
      {
        kind: "concept",
        title: "EFS / FSx — file storage",
        bullets: [
          "EFS: managed NFS, shareable across many Linux EC2 instances. Scales automatically.",
          "FSx for Windows File Server — managed SMB shares.",
          "FSx for Lustre — HPC workloads.",
        ],
      },
      {
        kind: "tip",
        title: "Pattern match",
        bullets: [
          "'Single EC2 needs a disk' → EBS.",
          "'Many Linux EC2s need shared access' → EFS.",
          "'Windows SMB share in AWS' → FSx for Windows File Server.",
          "'Website static assets' → S3.",
          "'Archive for 7 years, retrieve hours' → S3 Glacier Deep Archive.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "S3 = objects via API. EBS = disk for one EC2. EFS = shared NFS. FSx = shared Windows/Lustre.",
      },
    ],
  },

  // Billing & Support
  {
    id: "l-ccp-bs-1",
    topicId: "ccp-billing-support",
    order: 1,
    title: "EC2 pricing models explained",
    summary:
      "On-Demand, Reserved, Savings Plans, Spot, Dedicated — which one when.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "One instance, five ways to pay",
        body:
          "The same EC2 VM has five pricing models. The exam tests whether you pick the right one for the scenario.",
      },
      {
        kind: "comparison",
        title: "The five models",
        table: {
          columns: ["Model", "Discount", "Tradeoff"],
          rows: [
            { label: "On-Demand", cells: ["None", "Pay the list price, no commitment"] },
            { label: "Reserved Instances", cells: ["Up to 72%", "1 or 3 year commit on specific types"] },
            { label: "Savings Plans", cells: ["Up to 72%", "Flexible $/hour commit"] },
            { label: "Spot", cells: ["Up to 90%", "Can be terminated with 2 min notice"] },
            { label: "Dedicated Host", cells: ["Varies", "Physical server reserved for you (BYOL)"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Scenario matching",
        bullets: [
          "'Steady 24/7 workload, commit for 3 years' → Reserved or Savings Plan.",
          "'Fault-tolerant batch jobs, cheapest option' → Spot.",
          "'Need to bring existing Windows Server license' → Dedicated Host.",
          "'Short-term spiky traffic' → On-Demand.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Commit for discounts (RI/SP). Accept interruptions for 90% off (Spot). Go on-demand otherwise.",
      },
    ],
  },
  {
    id: "l-ccp-bs-2",
    topicId: "ccp-billing-support",
    order: 2,
    title: "Cost management tools",
    summary:
      "Four tools that track AWS spend — each answers a different question.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Four tools, four jobs",
        body:
          "AWS gives you separate tools for estimating, visualizing, alerting, and exporting cost data.",
      },
      {
        kind: "comparison",
        title: "Which one, when",
        table: {
          columns: ["Question", "Tool"],
          rows: [
            {
              label: "How much will this deployment cost?",
              cells: ["AWS Pricing Calculator"],
            },
            { label: "How have I been spending?", cells: ["AWS Cost Explorer"] },
            { label: "Alert me when I exceed $500/month", cells: ["AWS Budgets"] },
            { label: "Give me the raw data for my analytics tool", cells: ["Cost and Usage Report (CUR)"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Common exam traps",
        bullets: [
          "'Estimate future cost' ≠ 'visualize historical' — that's Pricing Calculator vs Cost Explorer.",
          "Budgets can alert on cost, usage, or RI utilization.",
          "CUR is for export and external tooling, not for a quick look.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Estimate = Pricing Calculator. Visualize = Cost Explorer. Alert = Budgets. Export = CUR.",
      },
    ],
  },
  {
    id: "l-ccp-bs-3",
    topicId: "ccp-billing-support",
    order: 3,
    title: "AWS Support plans",
    summary: "The five support tiers and what each one gives you.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Five tiers, increasing support",
        body:
          "Basic is free and nearly bare-bones. Enterprise gets you a dedicated Technical Account Manager. Most exam questions hit the Business tier — the first with real tech support.",
      },
      {
        kind: "comparison",
        title: "The five plans",
        table: {
          columns: ["Plan", "Tech support", "Key feature"],
          rows: [
            { label: "Basic", cells: ["None", "Customer service + docs only"] },
            { label: "Developer", cells: ["Business hours, email", "One contact, ~24h response"] },
            { label: "Business", cells: ["24/7 chat/phone/email", "Full Trusted Advisor, unlimited contacts"] },
            {
              label: "Enterprise On-Ramp",
              cells: ["24/7, 30 min critical", "Pool of TAMs, Concierge"],
            },
            { label: "Enterprise", cells: ["24/7, 15 min critical", "Designated TAM, proactive reviews"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Exam pattern",
        bullets: [
          "'Need 24/7 support and full Trusted Advisor' → Business.",
          "'Need a dedicated TAM' → Enterprise (not Enterprise On-Ramp).",
          "'Cheapest with any tech support' → Developer.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Basic → Developer → Business → Enterprise On-Ramp → Enterprise.",
      },
    ],
  },
];
