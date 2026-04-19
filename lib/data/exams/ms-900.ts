import type { Lesson, Question, Topic } from "../../types";

// ─────────────────────────────────────────────────────────────────
// Microsoft 365 Fundamentals (MS-900)
// ─────────────────────────────────────────────────────────────────

export const MS900_TOPICS: Topic[] = [
  {
    id: "ms9-cloud-concepts",
    examId: "ms-900",
    name: "Cloud Concepts",
    shortName: "Cloud Concepts",
    weight: 0.1,
    summary:
      "The cloud vocabulary that frames everything else on MS-900 — service models, deployment models, and the benefits Microsoft pitches for Microsoft 365.",
    subtopics: [
      "Benefits of the cloud (high availability, scalability, agility)",
      "Cloud service models: IaaS, PaaS, SaaS",
      "Cloud deployment models: public, private, hybrid",
      "Microsoft 365 as a SaaS productivity cloud",
      "Shared responsibility for Microsoft 365 customers",
    ],
    keyFacts: [
      "Microsoft 365 is a SaaS product — Microsoft manages the apps, you manage data and identities.",
      "Cloud characteristics: scalability, elasticity, reliability, predictability, security, governance.",
      "IaaS = infrastructure (Azure VMs). PaaS = platform (App Service). SaaS = software (M365).",
      "Hybrid cloud connects on-prem with cloud services — useful for identity and mail migrations.",
      "Customer always owns data and identities in SaaS.",
    ],
    cramSheet: [
      "Microsoft 365 = SaaS productivity suite on Azure.",
      "SaaS = provider runs everything; you just use the app.",
      "Data and identities = always the customer's responsibility.",
      "Hybrid = public + private. Multi-cloud = multiple providers.",
      "Benefits: scale, availability, pay-as-you-go, speed to deploy.",
    ],
    review: {
      examWeight: "5–10% of the exam (smallest domain)",
      overview:
        "The smallest MS-900 domain. You only need the basics: what SaaS is, why Microsoft 365 qualifies, and the split of responsibility between Microsoft and you. If you've done any cloud fundamentals work before (AZ-900, AWS CCP), this domain is almost free points.",
      sections: [
        {
          heading: "Microsoft 365 is SaaS",
          body:
            "Microsoft 365 bundles productivity apps (Word, Excel, Teams, Outlook), collaboration tools (SharePoint, OneDrive), and management/security tools (Entra ID, Defender, Intune) — all delivered as a service over the internet. You don't install a server. Microsoft runs everything; you configure settings, manage users, and protect your data.",
        },
        {
          heading: "Cloud service models in one picture",
          table: {
            columns: ["Model", "Example", "What you manage"],
            rows: [
              { label: "IaaS", cells: ["Azure VMs", "OS, runtime, apps, data"] },
              { label: "PaaS", cells: ["Azure App Service", "Apps + data"] },
              { label: "SaaS", cells: ["Microsoft 365", "Data + identities only"] },
            ],
          },
        },
        {
          heading: "Deployment models",
          bullets: [
            "Public cloud — shared infrastructure, lowest cost, highest scale.",
            "Private cloud — dedicated to one org, more control, higher cost.",
            "Hybrid cloud — public + private connected. Common during M365 migrations when you still have on-prem AD or Exchange.",
          ],
        },
        {
          heading: "Benefits of cloud (Microsoft's pitch)",
          bullets: [
            "Scalability — grow or shrink as demand changes.",
            "Reliability — services recover from failures automatically.",
            "Predictability — consistent performance and cost.",
            "Security — built-in compliance and data protection.",
            "Governance — central policy and administration.",
            "Manageability — portal, APIs, infrastructure-as-code.",
          ],
        },
        {
          heading: "Shared responsibility in Microsoft 365",
          body:
            "Microsoft handles the infrastructure and application software. You're responsible for: data retention, access control (Conditional Access, MFA), user training, compliance configuration, and protecting accounts from compromise. Microsoft's job is to make the service run. Your job is to configure it safely and use it wisely.",
        },
      ],
      gotchas: [
        {
          confusion: "Microsoft 365 vs Azure",
          explanation:
            "Microsoft 365 is SaaS productivity on top of Azure infrastructure. Azure is the IaaS/PaaS cloud platform. They're sold separately but deeply connected via Entra ID.",
        },
        {
          confusion: "Data backup in SaaS",
          explanation:
            "Microsoft replicates M365 data for service durability, but accidental deletion by users is YOUR problem. Third-party backup tools exist for this reason.",
        },
        {
          confusion: "Public vs Multi-tenant",
          explanation:
            "Public cloud means anyone can sign up and share the underlying infrastructure. Multi-tenant means separate customers' data is logically isolated but runs on shared infrastructure. All public cloud is multi-tenant.",
        },
      ],
      examTips: [
        "'Productivity apps delivered over the internet' → SaaS.",
        "'Connect on-prem AD to cloud identity' → Hybrid.",
        "'Data owner in a SaaS app' → Customer.",
        "'Protect against user-initiated data loss in M365' → Customer (third-party backup).",
      ],
    },
  },
  {
    id: "ms9-m365-apps",
    examId: "ms-900",
    name: "Microsoft 365 Apps & Services",
    shortName: "Apps & Services",
    weight: 0.33,
    summary:
      "The products that make up Microsoft 365 — productivity apps, collaboration tools, device management, and analytics.",
    subtopics: [
      "Productivity: Word, Excel, PowerPoint, Outlook",
      "Collaboration: Teams, SharePoint, OneDrive, Loop",
      "Exchange Online and email protection",
      "Viva (Insights, Connections, Learning, Topics, Goals)",
      "Windows 365 and Cloud PC",
      "Microsoft Intune and endpoint management",
      "Microsoft Copilot integrations",
    ],
    keyFacts: [
      "Teams is the hub for team-based communication — chat, meetings, calls, files.",
      "SharePoint is the backend for Teams file storage; OneDrive is personal cloud storage.",
      "Exchange Online provides mailboxes; Outlook is the client.",
      "Intune manages devices (MDM) and apps (MAM) on Windows, macOS, iOS, Android.",
      "Windows 365 delivers a Cloud PC — a streamed Windows desktop.",
      "Copilot is the generative AI assistant integrated across M365 apps.",
    ],
    cramSheet: [
      "Teams = chat, meetings, files (backed by SharePoint).",
      "SharePoint = team sites and document libraries.",
      "OneDrive = personal files in the cloud.",
      "Exchange Online = mailboxes. Outlook = mail client.",
      "Intune = MDM + MAM. Endpoint Manager is the admin umbrella.",
      "Viva = employee experience platform (Insights, Learning, Topics, etc.).",
    ],
    review: {
      examWeight: "30–35% of the exam — one of the two biggest domains",
      overview:
        "The service-recognition domain. You need to know what each Microsoft 365 product does, who the user is (end-user, admin, developer), and how the products fit together. Many questions read 'a user needs to do X' and ask which tool fits. Memorize the purpose of each named service and you'll pick most of them off cleanly.",
      sections: [
        {
          heading: "Productivity apps",
          body:
            "The familiar lineup: Word (documents), Excel (spreadsheets), PowerPoint (presentations), Outlook (email and calendar), OneNote (notebooks). Available in web, desktop, and mobile versions. Included in most Microsoft 365 plans.",
        },
        {
          heading: "Collaboration tools",
          table: {
            columns: ["Service", "What it does"],
            rows: [
              {
                label: "Microsoft Teams",
                cells: ["Chat, video meetings, voice, file sharing — the hub for teamwork"],
              },
              {
                label: "SharePoint Online",
                cells: ["Team sites, document libraries, intranet pages"],
              },
              {
                label: "OneDrive for Business",
                cells: ["Personal cloud storage synced across devices"],
              },
              {
                label: "Microsoft Loop",
                cells: ["Real-time collaborative components across apps"],
              },
              {
                label: "Yammer / Viva Engage",
                cells: ["Company-wide social and community conversations"],
              },
              {
                label: "Microsoft Planner",
                cells: ["Visual team task management"],
              },
              {
                label: "Microsoft Project",
                cells: ["Professional project management"],
              },
            ],
          },
        },
        {
          heading: "Exchange Online and email",
          bullets: [
            "Exchange Online hosts mailboxes; Outlook is the client.",
            "Exchange Online Protection (EOP) blocks spam and malware; Defender for Office 365 adds phishing, safe links, safe attachments.",
            "Retention policies and litigation hold live here too.",
            "Bookings lets users self-schedule appointments.",
          ],
        },
        {
          heading: "Microsoft Viva — employee experience",
          bullets: [
            "Viva Connections — internal comms inside Teams.",
            "Viva Insights — personal and team productivity analytics.",
            "Viva Learning — learning content aggregator (LinkedIn Learning, Udemy, custom).",
            "Viva Topics — AI-driven knowledge management.",
            "Viva Goals — OKRs.",
            "Viva Engage — community conversations (the new Yammer).",
          ],
        },
        {
          heading: "Endpoint management — Intune and Microsoft Endpoint Manager",
          bullets: [
            "Intune MDM — manage enrolled devices (Windows, macOS, iOS, Android).",
            "Intune MAM — manage apps without managing the whole device (BYOD scenario).",
            "Configuration profiles, compliance policies, app protection policies.",
            "Integrates with Conditional Access — block non-compliant devices from M365.",
          ],
        },
        {
          heading: "Windows 365 and Azure Virtual Desktop",
          bullets: [
            "Windows 365 Cloud PC — a dedicated Windows desktop streamed to any device, fixed per-user monthly price.",
            "Azure Virtual Desktop (AVD) — flexible, consumption-based virtual desktops in Azure.",
            "Windows 365 = simple. AVD = advanced, customizable.",
          ],
        },
        {
          heading: "Microsoft Copilot",
          body:
            "Generative AI assistant integrated across Microsoft 365. Compose docs in Word, build decks in PowerPoint, summarize meetings in Teams, write formulas in Excel, manage inbox in Outlook. Copilot for Microsoft 365 is a paid add-on license. Grounded in your organization's data via Microsoft Graph, with permission inheritance respected.",
        },
      ],
      gotchas: [
        {
          confusion: "OneDrive vs SharePoint",
          explanation:
            "OneDrive is personal files (your 'My Documents' in the cloud). SharePoint is team/org files (shared document libraries). Teams files ARE SharePoint under the hood.",
        },
        {
          confusion: "Outlook vs Exchange Online",
          explanation:
            "Exchange Online is the mail server (the back-end service). Outlook is the client application (Windows, Mac, Web, Mobile). Users open Outlook to read mail hosted on Exchange Online.",
        },
        {
          confusion: "Yammer vs Viva Engage",
          explanation:
            "Viva Engage is the new name for Yammer. Same product, new branding under the Viva umbrella.",
        },
        {
          confusion: "Windows 365 vs Azure Virtual Desktop",
          explanation:
            "Windows 365 = fixed Cloud PC per user, simple billing. AVD = flexible desktop infrastructure, pay for Azure compute and storage consumed.",
        },
        {
          confusion: "Copilot licensing",
          explanation:
            "Copilot for Microsoft 365 is an ADD-ON license (extra monthly fee per user) that requires a qualifying M365 plan underneath.",
        },
      ],
      examTips: [
        "'Hub for team chat and meetings' → Microsoft Teams.",
        "'Personal cloud storage synced to a PC' → OneDrive.",
        "'Intranet site and document library' → SharePoint.",
        "'Manage iPhones in a BYOD scenario' → Intune MAM.",
        "'Streamed Windows desktop with fixed per-user pricing' → Windows 365.",
        "'Track OKRs' → Viva Goals.",
        "'Summarize a Teams meeting with AI' → Microsoft Copilot.",
      ],
    },
  },
  {
    id: "ms9-security-compliance",
    examId: "ms-900",
    name: "Security, Compliance, Privacy & Trust",
    shortName: "Security & Compliance",
    weight: 0.3,
    summary:
      "Microsoft's security and compliance stack for Microsoft 365 — identity protection, threat protection, and compliance solutions.",
    subtopics: [
      "Zero Trust principles in Microsoft 365",
      "Microsoft Entra ID and identity protection",
      "Multi-factor authentication and Conditional Access",
      "Microsoft Defender XDR (Defender for Office 365, Defender for Endpoint, Defender for Cloud Apps, Defender for Identity)",
      "Microsoft Purview for compliance, eDiscovery, DLP, Information Protection",
      "Microsoft Priva for privacy management",
      "Microsoft Service Trust Portal and compliance offerings",
    ],
    keyFacts: [
      "Zero Trust: verify explicitly, least privilege, assume breach.",
      "Conditional Access evaluates signals and enforces access decisions.",
      "Defender XDR unifies Defender products under one portal.",
      "Purview handles compliance, governance, eDiscovery, and DLP.",
      "Priva is the newer privacy management product.",
      "Compliance Manager scores your tenant and recommends improvements.",
    ],
    cramSheet: [
      "Zero Trust = verify, least privilege, assume breach.",
      "MFA + Conditional Access = identity defense pillar 1.",
      "Defender for Office 365 = email/collab threats. Defender for Endpoint = device threats.",
      "Purview = compliance + DLP + eDiscovery + Information Protection.",
      "Service Trust Portal = audit reports (SOC, ISO).",
    ],
    review: {
      examWeight: "25–30% of the exam",
      overview:
        "Security and compliance on MS-900 tests whether you can name the right tool for each job. The Defender family, Purview suite, and Conditional Access show up in almost every question. Build a mental map: identity defense, device defense, data defense, compliance. Each Microsoft product slots into one of those.",
      sections: [
        {
          heading: "Zero Trust — the security philosophy",
          body:
            "Microsoft's security model. Three principles: verify explicitly (authenticate every request, not just trusted networks), use least-privilege access (minimum rights, just-in-time elevation), and assume breach (segment, encrypt, monitor). Zero Trust is NOT a product — it's a design principle that shapes how you configure M365.",
        },
        {
          heading: "Microsoft Entra ID — the identity foundation",
          bullets: [
            "Every Microsoft 365 tenant sits on top of Entra ID.",
            "Manages users, groups, guests, devices, and app registrations.",
            "Authentication methods: passwords, MFA, passwordless (Windows Hello, FIDO2, Authenticator).",
            "Entra Connect syncs on-prem AD to the cloud for hybrid identity.",
            "Entra ID B2B = invite external collaborators. B2C = consumer-facing authentication for your apps.",
          ],
        },
        {
          heading: "Conditional Access — the policy engine",
          body:
            "Sits between sign-in and access. Evaluates signals and enforces decisions.",
          bullets: [
            "Signals: user, device state (compliant?), location (trusted?), app, sign-in risk.",
            "Decisions: allow, block, require MFA, require compliant device, require password change.",
            "Example policy: 'Require MFA when accessing M365 from outside the corporate network.'",
          ],
        },
        {
          heading: "Microsoft Defender XDR — the threat protection suite",
          table: {
            columns: ["Product", "Protects"],
            rows: [
              {
                label: "Defender for Office 365",
                cells: ["Email (phishing, malware, safe links, safe attachments), Teams, SharePoint"],
              },
              {
                label: "Defender for Endpoint",
                cells: ["Windows, macOS, Linux, iOS, Android — EDR"],
              },
              {
                label: "Defender for Identity",
                cells: ["On-prem AD — detects lateral movement, pass-the-hash"],
              },
              {
                label: "Defender for Cloud Apps",
                cells: ["CASB — visibility and control for third-party SaaS"],
              },
            ],
          },
        },
        {
          heading: "Microsoft Purview — compliance, governance, and DLP",
          bullets: [
            "Compliance Manager — scores your compliance posture; recommends improvements.",
            "Data Loss Prevention (DLP) — detects and blocks sharing of sensitive data.",
            "Information Protection (sensitivity labels) — classify and encrypt content.",
            "Records Management — retention labels and automatic retention.",
            "eDiscovery — legal hold and search across mailboxes, SharePoint, Teams.",
            "Insider Risk Management — detect risky internal behavior.",
            "Communication Compliance — scan for policy violations in Teams/Outlook.",
          ],
        },
        {
          heading: "Microsoft Priva — privacy management",
          bullets: [
            "Priva Privacy Risk Management — discovers personal data and identifies risk.",
            "Priva Subject Rights Requests — manage data subject requests under GDPR, CCPA.",
          ],
        },
        {
          heading: "Trust and compliance resources",
          bullets: [
            "Microsoft Service Trust Portal — audit reports, trust docs, compliance offerings.",
            "Microsoft 365 Admin Center — central admin UI.",
            "Compliance offerings — 90+ standards: GDPR, HIPAA, ISO 27001, FedRAMP, SOC 2, etc.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Which Defender for what?",
          explanation:
            "For Office 365 = email/collab. For Endpoint = devices. For Identity = on-prem AD. For Cloud Apps = third-party SaaS. Match the target to pick the right one.",
        },
        {
          confusion: "Purview vs Defender",
          explanation:
            "Defender = threat protection (block attacks). Purview = compliance and governance (manage data, meet standards).",
        },
        {
          confusion: "MFA vs Conditional Access",
          explanation:
            "MFA is an authentication METHOD. Conditional Access is the POLICY ENGINE that decides when to require MFA. CA can require MFA based on risk, location, etc.",
        },
        {
          confusion: "Entra ID vs on-prem AD",
          explanation:
            "Entra ID is cloud identity (OAuth, SAML, OIDC). AD DS is on-prem (Kerberos, LDAP). They coexist via Entra Connect but don't replace each other.",
        },
        {
          confusion: "DLP vs Information Protection",
          explanation:
            "Information Protection classifies and labels content. DLP uses those classifications (plus content inspection) to block risky sharing. They work together.",
        },
      ],
      examTips: [
        "'Require MFA when outside the corporate network' → Conditional Access.",
        "'Detect phishing email in Outlook' → Defender for Office 365.",
        "'Protect iPhones and Macs from malware' → Defender for Endpoint.",
        "'Classify a document as Confidential' → Information Protection sensitivity label.",
        "'Search Teams and SharePoint for litigation' → eDiscovery (in Purview).",
        "'Score our compliance with GDPR' → Compliance Manager.",
        "'Download our ISO 27001 report' → Service Trust Portal.",
      ],
    },
  },
  {
    id: "ms9-pricing-support",
    examId: "ms-900",
    name: "Pricing, Licensing & Support",
    shortName: "Pricing & Support",
    weight: 0.27,
    summary:
      "How Microsoft 365 is sold, the plan tiers, licensing models, and the support resources available to admins.",
    subtopics: [
      "Microsoft 365 Business plans (Basic, Standard, Premium, Apps for business)",
      "Microsoft 365 Enterprise plans (E3, E5, F3 Frontline)",
      "Add-on licensing (Copilot, Teams Premium, Defender)",
      "Microsoft 365 Admin Center",
      "Cloud Solution Provider (CSP) vs direct purchasing",
      "Service Level Agreement (SLA) and financial credits",
      "Support plans and incident management",
    ],
    keyFacts: [
      "Business plans cap at 300 users. Enterprise plans have no user cap.",
      "E3 adds Azure Information Protection, Intune, and compliance. E5 adds advanced security, analytics, and phone.",
      "F3 (Frontline) is for deskless/frontline workers at a lower price.",
      "Microsoft 365 E5 bundles the most: Defender XDR + Purview advanced + Copilot-ready.",
      "Financial SLA is 99.9% uptime; credits are service credits, not cash.",
      "Copilot for Microsoft 365 requires a qualifying M365 plan + the add-on license.",
    ],
    cramSheet: [
      "Business plans ≤ 300 users. Enterprise = unlimited.",
      "E3 = standard bundle. E5 = everything.",
      "F3 = frontline workers.",
      "CSP = partner buys and resells; you get a partner relationship.",
      "Copilot = add-on; requires qualifying M365 plan.",
      "SLA = 99.9% uptime → service credits if missed.",
    ],
    review: {
      examWeight: "25–30% of the exam",
      overview:
        "This domain is detail-heavy. You need to know which plan covers which features, what the user cap is, and how licensing add-ons work. The exam leans on the Business vs Enterprise distinction and the E3 vs E5 feature gap. A couple of memorized facts gets most of this domain.",
      sections: [
        {
          heading: "Microsoft 365 Business plans (≤300 users)",
          table: {
            columns: ["Plan", "What's included"],
            rows: [
              {
                label: "Business Basic",
                cells: ["Web/mobile Office apps, Exchange, Teams, SharePoint, OneDrive (no desktop apps)"],
              },
              {
                label: "Business Standard",
                cells: ["Business Basic + desktop Office apps + Publisher + Access"],
              },
              {
                label: "Business Premium",
                cells: ["Business Standard + Intune + Entra ID P1 + Defender for Business + Information Protection"],
              },
              {
                label: "Apps for Business",
                cells: ["Desktop Office apps only — no Teams, email, or collaboration backend"],
              },
            ],
          },
        },
        {
          heading: "Microsoft 365 Enterprise plans (no user cap)",
          table: {
            columns: ["Plan", "What's included"],
            rows: [
              {
                label: "Microsoft 365 E3",
                cells: ["Full Office apps, Exchange, Teams, SharePoint + Intune + Entra ID P1 + basic compliance + Information Protection"],
              },
              {
                label: "Microsoft 365 E5",
                cells: ["E3 + Defender XDR suite + Purview advanced + Entra ID P2 + Power BI Pro + Teams phone"],
              },
              {
                label: "Microsoft 365 F3",
                cells: ["Frontline/deskless workers — web Office, Teams, SharePoint, Exchange (limited mailbox), Intune"],
              },
            ],
          },
        },
        {
          heading: "Add-on licenses",
          bullets: [
            "Copilot for Microsoft 365 — generative AI across apps; requires qualifying M365 plan.",
            "Teams Premium — advanced meetings (intelligent recap, webinars, meeting templates).",
            "Defender for Office 365 Plan 1 / Plan 2 — email threat protection tiers.",
            "Entra ID P1 / P2 — identity protection tiers (P2 adds PIM, risk-based Conditional Access).",
            "Windows 365 Cloud PC — separate subscription per user.",
          ],
        },
        {
          heading: "Buying channels",
          bullets: [
            "Direct from Microsoft — commit via Microsoft portal or volume licensing agreement.",
            "Cloud Solution Provider (CSP) — a partner sells and manages your licenses, provides first-line support.",
            "Enterprise Agreement (EA) — commitment-based licensing for large organizations.",
          ],
        },
        {
          heading: "SLA and service credits",
          body:
            "Microsoft's financial SLA for Microsoft 365 is 99.9% uptime. If they miss it, you receive SERVICE CREDITS (not cash refunds). Planned maintenance doesn't count against uptime.",
        },
        {
          heading: "Support resources",
          bullets: [
            "Microsoft 365 Admin Center — the main admin portal.",
            "Microsoft 365 service health dashboard — real-time status of services.",
            "Message center — proactive notifications about upcoming changes.",
            "Microsoft Learn — free training and docs.",
            "Microsoft 365 community and Tech Community — forums.",
            "Partner support (for CSP customers).",
            "Direct Microsoft support (Severity A/B/C/D ticket levels; response times vary).",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Business Premium vs Enterprise E3",
          explanation:
            "Business Premium is limited to 300 users. E3 has no user cap and adds some advanced features. If the scenario is 'growing past 300 users' → Enterprise.",
        },
        {
          confusion: "E3 vs E5",
          explanation:
            "E3 = productivity + basic compliance. E5 adds Defender XDR, Purview advanced, Entra ID P2, Power BI Pro, and Teams Phone. E5 is effectively the full bundle.",
        },
        {
          confusion: "Apps for Business / Enterprise",
          explanation:
            "'Apps' SKUs include only the Office desktop/mobile apps. No Teams, no email, no collaboration backend. For scenarios where only Office apps are needed.",
        },
        {
          confusion: "F3 vs E3",
          explanation:
            "F3 is for frontline/deskless workers with limited needs (smaller mailbox, web-only Office). E3 is for information workers with full Office.",
        },
        {
          confusion: "SLA credit vs cash refund",
          explanation:
            "Missed SLA gives you service credits (discount on next bill). Microsoft does not issue cash refunds for downtime.",
        },
      ],
      examTips: [
        "'Up to 300 users, needs Defender and Intune' → Microsoft 365 Business Premium.",
        "'Unlimited users, productivity + basic security' → Microsoft 365 E3.",
        "'Full security suite + Power BI + Teams Phone' → Microsoft 365 E5.",
        "'Retail workers on shared devices' → Microsoft 365 F3.",
        "'Office apps only, no email' → Apps for Business/Enterprise.",
        "'Partner buys and manages licenses for us' → CSP.",
        "'Required to use Copilot' → qualifying M365 plan + Copilot add-on.",
      ],
    },
  },
];

export const MS900_QUESTIONS: Question[] = [
  // Cloud Concepts
  {
    id: "q-ms9-cc-1",
    examId: "ms-900",
    topicId: "ms9-cloud-concepts",
    prompt: "Which cloud service model best describes Microsoft 365?",
    choices: ["IaaS", "PaaS", "SaaS", "FaaS"],
    correctIndex: 2,
    explanation:
      "Microsoft 365 is Software as a Service — Microsoft manages everything except your data and identities.",
    difficulty: "easy",
    tags: ["service-models"],
  },
  {
    id: "q-ms9-cc-2",
    examId: "ms-900",
    topicId: "ms9-cloud-concepts",
    prompt:
      "A company wants to keep some data on-prem but use Microsoft 365 for email. Which deployment model is this?",
    choices: ["Public cloud", "Private cloud", "Hybrid cloud", "Multi-cloud"],
    correctIndex: 2,
    explanation:
      "Hybrid combines on-prem and public cloud — exactly this scenario.",
    difficulty: "easy",
    tags: ["deployment"],
  },
  {
    id: "q-ms9-cc-3",
    examId: "ms-900",
    topicId: "ms9-cloud-concepts",
    prompt: "In SaaS, what is the customer always responsible for?",
    choices: [
      "Hypervisor patching",
      "Physical datacenter security",
      "Data and identities",
      "Load balancer configuration",
    ],
    correctIndex: 2,
    explanation:
      "Data and identities are always the customer's responsibility regardless of service model.",
    difficulty: "easy",
    tags: ["shared-responsibility"],
  },
  {
    id: "q-ms9-cc-4",
    examId: "ms-900",
    topicId: "ms9-cloud-concepts",
    prompt: "What is a key benefit of cloud computing for Microsoft 365 customers?",
    choices: [
      "Complete control over physical servers",
      "One-time license purchase",
      "Scalability and pay-as-you-go pricing",
      "No need for user accounts",
    ],
    correctIndex: 2,
    explanation:
      "Scalability and pay-as-you-go pricing are core cloud benefits.",
    difficulty: "easy",
    tags: ["benefits"],
  },

  // M365 Apps & Services
  {
    id: "q-ms9-ap-1",
    examId: "ms-900",
    topicId: "ms9-m365-apps",
    prompt: "Which service is the 'hub for teamwork' including chat, meetings, and file sharing?",
    choices: ["SharePoint", "OneDrive", "Microsoft Teams", "Outlook"],
    correctIndex: 2,
    explanation:
      "Teams is Microsoft's hub for team communication. It stores files on SharePoint under the hood.",
    difficulty: "easy",
    tags: ["teams"],
  },
  {
    id: "q-ms9-ap-2",
    examId: "ms-900",
    topicId: "ms9-m365-apps",
    prompt:
      "A user needs personal cloud file storage that syncs to their laptop. Which service?",
    choices: ["SharePoint", "OneDrive for Business", "Exchange Online", "Microsoft Loop"],
    correctIndex: 1,
    explanation:
      "OneDrive for Business is personal cloud storage with desktop sync. SharePoint is for team/shared content.",
    difficulty: "easy",
    tags: ["onedrive"],
  },
  {
    id: "q-ms9-ap-3",
    examId: "ms-900",
    topicId: "ms9-m365-apps",
    prompt: "Which service provides organization-wide intranet sites and team document libraries?",
    choices: ["OneDrive", "Teams", "SharePoint Online", "Yammer"],
    correctIndex: 2,
    explanation:
      "SharePoint Online provides intranet sites and shared document libraries.",
    difficulty: "easy",
    tags: ["sharepoint"],
  },
  {
    id: "q-ms9-ap-4",
    examId: "ms-900",
    topicId: "ms9-m365-apps",
    prompt:
      "A company wants to manage iPhones used in a BYOD program without enrolling the entire device. Which feature?",
    choices: [
      "Intune Mobile Device Management (MDM)",
      "Intune Mobile Application Management (MAM)",
      "Exchange ActiveSync",
      "Windows Autopilot",
    ],
    correctIndex: 1,
    explanation:
      "MAM manages apps without requiring full device enrollment — perfect for BYOD.",
    difficulty: "medium",
    tags: ["intune"],
  },
  {
    id: "q-ms9-ap-5",
    examId: "ms-900",
    topicId: "ms9-m365-apps",
    prompt:
      "Which service provides a streamed Windows desktop with fixed per-user monthly pricing?",
    choices: [
      "Azure Virtual Desktop",
      "Windows 365 Cloud PC",
      "Windows Hello",
      "Remote Desktop Services",
    ],
    correctIndex: 1,
    explanation:
      "Windows 365 provides a dedicated Cloud PC with fixed per-user pricing. AVD is consumption-based.",
    difficulty: "medium",
    tags: ["windows-365"],
  },
  {
    id: "q-ms9-ap-6",
    examId: "ms-900",
    topicId: "ms9-m365-apps",
    prompt:
      "Which Viva module is used to track OKRs and organizational goals?",
    choices: ["Viva Insights", "Viva Learning", "Viva Goals", "Viva Topics"],
    correctIndex: 2,
    explanation:
      "Viva Goals manages OKRs. Insights is productivity analytics; Learning aggregates training.",
    difficulty: "medium",
    tags: ["viva"],
  },
  {
    id: "q-ms9-ap-7",
    examId: "ms-900",
    topicId: "ms9-m365-apps",
    prompt:
      "Copilot for Microsoft 365 requires which of the following to operate?",
    choices: [
      "Only a Microsoft account",
      "A qualifying Microsoft 365 plan plus the Copilot add-on license",
      "An Azure subscription",
      "An enterprise Windows license only",
    ],
    correctIndex: 1,
    explanation:
      "Copilot for M365 requires both a qualifying M365 plan and the Copilot add-on license.",
    difficulty: "hard",
    tags: ["copilot"],
  },

  // Security & Compliance
  {
    id: "q-ms9-sc-1",
    examId: "ms-900",
    topicId: "ms9-security-compliance",
    prompt: "Which of the following is a core principle of Zero Trust?",
    choices: [
      "Trust the corporate network by default",
      "Verify explicitly, use least privilege, assume breach",
      "Always require a VPN",
      "Focus exclusively on perimeter security",
    ],
    correctIndex: 1,
    explanation:
      "Zero Trust has three principles: verify explicitly, use least-privilege access, and assume breach.",
    difficulty: "easy",
    tags: ["zero-trust"],
  },
  {
    id: "q-ms9-sc-2",
    examId: "ms-900",
    topicId: "ms9-security-compliance",
    prompt:
      "A policy requires MFA when signing in from an untrusted location. Which feature enforces this?",
    choices: [
      "Intune configuration profile",
      "Conditional Access",
      "Azure Firewall",
      "Entra ID Connect",
    ],
    correctIndex: 1,
    explanation:
      "Conditional Access evaluates signals (location, device, risk) and enforces decisions like requiring MFA.",
    difficulty: "easy",
    tags: ["conditional-access"],
  },
  {
    id: "q-ms9-sc-3",
    examId: "ms-900",
    topicId: "ms9-security-compliance",
    prompt:
      "Which Defender product protects against phishing and malicious attachments in Exchange Online and Teams?",
    choices: [
      "Defender for Endpoint",
      "Defender for Cloud Apps",
      "Defender for Office 365",
      "Defender for Identity",
    ],
    correctIndex: 2,
    explanation:
      "Defender for Office 365 protects email and collaboration (Exchange, Teams, SharePoint) from phishing and malware.",
    difficulty: "medium",
    tags: ["defender"],
  },
  {
    id: "q-ms9-sc-4",
    examId: "ms-900",
    topicId: "ms9-security-compliance",
    prompt:
      "Which Microsoft Purview capability scans documents and blocks sharing of sensitive data externally?",
    choices: [
      "eDiscovery",
      "Data Loss Prevention (DLP)",
      "Compliance Manager",
      "Insider Risk Management",
    ],
    correctIndex: 1,
    explanation:
      "DLP inspects content and blocks or warns about sharing sensitive data. eDiscovery is legal hold/search.",
    difficulty: "medium",
    tags: ["purview"],
  },
  {
    id: "q-ms9-sc-5",
    examId: "ms-900",
    topicId: "ms9-security-compliance",
    prompt: "Where would you download Microsoft's SOC 2 compliance report?",
    choices: [
      "Microsoft 365 Admin Center",
      "Azure Portal",
      "Microsoft Service Trust Portal",
      "Compliance Manager",
    ],
    correctIndex: 2,
    explanation:
      "The Service Trust Portal hosts audit reports (SOC, ISO) and compliance documentation.",
    difficulty: "medium",
    tags: ["compliance"],
  },
  {
    id: "q-ms9-sc-6",
    examId: "ms-900",
    topicId: "ms9-security-compliance",
    prompt:
      "Which tool scores your tenant's compliance posture against standards like GDPR and ISO 27001?",
    choices: [
      "Service Trust Portal",
      "Compliance Manager",
      "Microsoft Purview DLP",
      "Defender XDR",
    ],
    correctIndex: 1,
    explanation:
      "Compliance Manager scores your posture and recommends improvements. Service Trust Portal hosts the source reports.",
    difficulty: "medium",
    tags: ["compliance"],
  },
  {
    id: "q-ms9-sc-7",
    examId: "ms-900",
    topicId: "ms9-security-compliance",
    prompt:
      "A legal team needs to place mailboxes, Teams chats, and SharePoint sites on hold for litigation. Which tool?",
    choices: [
      "DLP",
      "eDiscovery (in Microsoft Purview)",
      "Audit logs in Defender",
      "Compliance Manager",
    ],
    correctIndex: 1,
    explanation:
      "eDiscovery in Purview handles legal holds and cross-source searches for litigation.",
    difficulty: "hard",
    tags: ["ediscovery"],
  },

  // Pricing & Support
  {
    id: "q-ms9-ps-1",
    examId: "ms-900",
    topicId: "ms9-pricing-support",
    prompt: "What is the user cap on a Microsoft 365 Business plan?",
    choices: ["50 users", "100 users", "300 users", "No cap"],
    correctIndex: 2,
    explanation:
      "Microsoft 365 Business plans are capped at 300 users. Enterprise plans have no cap.",
    difficulty: "easy",
    tags: ["business-plans"],
  },
  {
    id: "q-ms9-ps-2",
    examId: "ms-900",
    topicId: "ms9-pricing-support",
    prompt:
      "Which plan provides the full Microsoft Defender XDR security suite and Power BI Pro?",
    choices: [
      "Microsoft 365 Business Premium",
      "Microsoft 365 E3",
      "Microsoft 365 E5",
      "Microsoft 365 F3",
    ],
    correctIndex: 2,
    explanation:
      "E5 includes the full Defender XDR suite, Purview advanced, Entra ID P2, Power BI Pro, and Teams Phone.",
    difficulty: "medium",
    tags: ["e5"],
  },
  {
    id: "q-ms9-ps-3",
    examId: "ms-900",
    topicId: "ms9-pricing-support",
    prompt:
      "A retail company has 2,000 deskless workers who need basic Teams and email. Which plan fits best?",
    choices: [
      "Microsoft 365 Business Basic",
      "Microsoft 365 F3",
      "Microsoft 365 E3",
      "Apps for Business",
    ],
    correctIndex: 1,
    explanation:
      "F3 (Frontline) is purpose-built for deskless workers at a lower price point.",
    difficulty: "medium",
    tags: ["frontline"],
  },
  {
    id: "q-ms9-ps-4",
    examId: "ms-900",
    topicId: "ms9-pricing-support",
    prompt: "Microsoft's financial SLA for Microsoft 365 is:",
    choices: ["99.0% with cash refunds", "99.9% with service credits", "99.99% with cash refunds", "100% with service credits"],
    correctIndex: 1,
    explanation:
      "99.9% uptime SLA, compensated via service credits (not cash).",
    difficulty: "medium",
    tags: ["sla"],
  },
  {
    id: "q-ms9-ps-5",
    examId: "ms-900",
    topicId: "ms9-pricing-support",
    prompt:
      "A partner sells, bills, and provides support for Microsoft 365 licenses. Which channel is this?",
    choices: [
      "Direct purchase",
      "Cloud Solution Provider (CSP)",
      "Enterprise Agreement",
      "Volume Licensing",
    ],
    correctIndex: 1,
    explanation:
      "CSP partners sell, manage, and provide first-line support for Microsoft cloud licenses.",
    difficulty: "medium",
    tags: ["csp"],
  },
  {
    id: "q-ms9-ps-6",
    examId: "ms-900",
    topicId: "ms9-pricing-support",
    prompt:
      "Which portal is used by admins to manage users, licenses, and service health for Microsoft 365?",
    choices: [
      "Azure Portal",
      "Microsoft 365 Admin Center",
      "Microsoft Endpoint Manager",
      "Microsoft Purview",
    ],
    correctIndex: 1,
    explanation:
      "The Microsoft 365 Admin Center is the central admin portal for M365.",
    difficulty: "easy",
    tags: ["admin-center"],
  },
];

export const MS900_DIAGNOSTIC = [
  "q-ms9-cc-1",
  "q-ms9-cc-3",
  "q-ms9-ap-1",
  "q-ms9-ap-2",
  "q-ms9-ap-4",
  "q-ms9-ap-5",
  "q-ms9-sc-1",
  "q-ms9-sc-2",
  "q-ms9-sc-3",
  "q-ms9-ps-1",
  "q-ms9-ps-2",
  "q-ms9-ps-3",
];

export const MS900_LESSONS: Lesson[] = [
  {
    id: "l-ms9-cc-1",
    topicId: "ms9-cloud-concepts",
    order: 1,
    title: "Microsoft 365 is SaaS — what that means",
    summary: "The cloud service model behind M365, and what stays your responsibility.",
    minutes: 3,
    cards: [
      {
        kind: "intro",
        title: "SaaS in 30 seconds",
        body:
          "Software as a Service means the provider runs the entire stack — servers, OS, application — and delivers it over the internet. You just use it.",
      },
      {
        kind: "concept",
        title: "Where Microsoft 365 sits",
        body:
          "Microsoft 365 bundles productivity apps (Word, Excel, Teams), collaboration services (SharePoint, OneDrive), and security/admin tooling (Entra ID, Defender, Intune). All delivered as SaaS.",
      },
      {
        kind: "comparison",
        title: "What you and Microsoft each own",
        table: {
          columns: ["Layer", "Owner"],
          rows: [
            { label: "Apps and runtime", cells: ["Microsoft"] },
            { label: "OS and infrastructure", cells: ["Microsoft"] },
            { label: "Data", cells: ["You"] },
            { label: "Identities & access", cells: ["You"] },
            { label: "Compliance configuration", cells: ["You"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Common trap",
        body:
          "Microsoft replicates M365 data for durability, but user-initiated deletion is your problem. Backup strategy is a customer responsibility.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Microsoft runs the software. You run your data, identities, and policies.",
      },
    ],
  },
  {
    id: "l-ms9-cc-2",
    topicId: "ms9-cloud-concepts",
    order: 2,
    title: "Public, private, hybrid",
    summary:
      "Cloud deployment models — and why hybrid shows up in most real M365 rollouts.",
    minutes: 3,
    cards: [
      {
        kind: "intro",
        title: "Three deployment models",
        body: "Public, private, hybrid. Know which one matches each scenario.",
      },
      {
        kind: "concept",
        title: "Public cloud",
        body: "Infrastructure shared among tenants. Lowest cost, highest scale. Microsoft 365 runs on the public cloud.",
      },
      {
        kind: "concept",
        title: "Private cloud",
        body: "Dedicated to a single organization, on-prem or hosted. Most control, highest cost.",
      },
      {
        kind: "concept",
        title: "Hybrid cloud",
        body:
          "Public and private linked together. Common during M365 migrations — on-prem AD or Exchange coexisting with cloud services.",
      },
      {
        kind: "tip",
        title: "Exam pattern",
        bullets: [
          "'Keep some data on-prem' → hybrid.",
          "'All services in Microsoft's datacenters' → public.",
          "'Dedicated to us, higher control' → private.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Public = shared. Private = dedicated. Hybrid = connected.",
      },
    ],
  },
  {
    id: "l-ms9-ap-1",
    topicId: "ms9-m365-apps",
    order: 1,
    title: "Teams, SharePoint, OneDrive — who does what",
    summary:
      "Three collaboration services that get confused constantly. Learn the one-line role of each.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Three tools, three jobs",
        body:
          "Teams is for real-time teamwork. SharePoint is for team/org sites. OneDrive is for personal files.",
      },
      {
        kind: "comparison",
        title: "The split",
        table: {
          columns: ["Service", "Purpose"],
          rows: [
            { label: "Teams", cells: ["Chat, meetings, calls — workflow hub"] },
            { label: "SharePoint", cells: ["Team sites, document libraries, intranet"] },
            { label: "OneDrive", cells: ["Personal cloud file storage, sync to PC"] },
          ],
        },
      },
      {
        kind: "concept",
        title: "Under the hood",
        body:
          "When you share a file in a Teams channel, it's actually stored in a SharePoint document library associated with that team. OneDrive is for your personal files that you haven't shared with anyone yet.",
      },
      {
        kind: "tip",
        title: "Simple rule",
        bullets: [
          "Personal file? OneDrive.",
          "Team file? SharePoint (via Teams).",
          "Real-time communication? Teams.",
          "Company intranet page? SharePoint.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Teams = talk. SharePoint = share. OneDrive = your stuff.",
      },
    ],
  },
  {
    id: "l-ms9-ap-2",
    topicId: "ms9-m365-apps",
    order: 2,
    title: "Intune — managing devices and apps",
    summary:
      "Microsoft's endpoint management service for Windows, macOS, iOS, Android — and the BYOD angle.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Intune manages the edges",
        body:
          "Every device that touches Microsoft 365 — phones, laptops, tablets — can be managed through Intune.",
      },
      {
        kind: "comparison",
        title: "MDM vs MAM",
        table: {
          columns: ["Mode", "What it does", "Typical use"],
          rows: [
            {
              label: "MDM (device management)",
              cells: ["Manage the whole enrolled device", "Corporate-owned devices"],
            },
            {
              label: "MAM (application management)",
              cells: ["Manage company apps without enrolling the device", "BYOD — personal phones used for work"],
            },
          ],
        },
      },
      {
        kind: "concept",
        title: "What Intune can do",
        bullets: [
          "Deploy configuration profiles (Wi-Fi, email, VPN).",
          "Enforce compliance policies (passcode, encryption, OS version).",
          "Push apps (web, store, custom).",
          "Selectively wipe company data.",
          "Feed compliance status into Conditional Access.",
        ],
      },
      {
        kind: "tip",
        title: "Pair with Conditional Access",
        body:
          "The real power of Intune: send device compliance to Conditional Access, then block non-compliant devices from M365. That's enforceable Zero Trust.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Intune manages devices (MDM) or just apps (MAM) — pair with Conditional Access.",
      },
    ],
  },
  {
    id: "l-ms9-sc-1",
    topicId: "ms9-security-compliance",
    order: 1,
    title: "Zero Trust in Microsoft 365",
    summary:
      "The philosophy that shapes how you configure identity, devices, and data security in M365.",
    minutes: 3,
    cards: [
      {
        kind: "intro",
        title: "Not a product — a principle",
        body:
          "Zero Trust is a security approach, not a single feature. It shapes how Microsoft designs M365's security controls.",
      },
      {
        kind: "concept",
        title: "Three principles",
        bullets: [
          "Verify explicitly — authenticate and authorize based on all available signals.",
          "Use least-privilege access — minimum permissions, just-in-time elevation.",
          "Assume breach — segment, encrypt, monitor continuously.",
        ],
      },
      {
        kind: "example",
        title: "Zero Trust in action",
        body:
          "User logs in from a coffee shop on an unmanaged laptop. Conditional Access sees unusual location and unmanaged device — requires MFA, blocks access to sensitive files, lets email through. That's all three principles at once.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Verify explicitly. Least privilege. Assume breach.",
      },
    ],
  },
  {
    id: "l-ms9-sc-2",
    topicId: "ms9-security-compliance",
    order: 2,
    title: "The Defender family",
    summary:
      "Four Defender products for four different threat surfaces. Learn which protects what.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "One brand, four products",
        body:
          "Microsoft Defender XDR is an umbrella. Under it are four products that each cover a different surface.",
      },
      {
        kind: "comparison",
        title: "Defender for what?",
        table: {
          columns: ["Product", "Protects"],
          rows: [
            {
              label: "Defender for Office 365",
              cells: ["Email, Teams, SharePoint against phishing and malware"],
            },
            {
              label: "Defender for Endpoint",
              cells: ["Windows, macOS, Linux, iOS, Android devices (EDR)"],
            },
            {
              label: "Defender for Identity",
              cells: ["On-premises Active Directory against lateral movement"],
            },
            {
              label: "Defender for Cloud Apps",
              cells: ["Third-party SaaS — CASB-style visibility"],
            },
          ],
        },
      },
      {
        kind: "tip",
        title: "Matching scenarios",
        bullets: [
          "'Block phishing in Outlook' → Defender for Office 365.",
          "'Stop ransomware on Windows laptops' → Defender for Endpoint.",
          "'Detect pass-the-hash in on-prem AD' → Defender for Identity.",
          "'See who's using Dropbox at work' → Defender for Cloud Apps.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Office 365 = email/collab. Endpoint = devices. Identity = on-prem AD. Cloud Apps = third-party SaaS.",
      },
    ],
  },
  {
    id: "l-ms9-sc-3",
    topicId: "ms9-security-compliance",
    order: 3,
    title: "Microsoft Purview — compliance and data protection",
    summary:
      "Microsoft's unified compliance platform. Six capabilities you should know by name.",
    minutes: 5,
    cards: [
      {
        kind: "intro",
        title: "One portal, many capabilities",
        body:
          "Purview bundles Microsoft's compliance and data governance tools. You don't need to master each one — just know what each does.",
      },
      {
        kind: "concept",
        title: "The core capabilities",
        bullets: [
          "Compliance Manager — score your compliance posture.",
          "Data Loss Prevention (DLP) — detect/block sharing of sensitive data.",
          "Information Protection — classify and encrypt content (sensitivity labels).",
          "Records Management — retention labels and disposition.",
          "eDiscovery — legal holds and cross-source search.",
          "Insider Risk Management — detect risky internal behavior.",
          "Communication Compliance — scan Teams and Outlook for policy violations.",
        ],
      },
      {
        kind: "tip",
        title: "Keyword matching",
        bullets: [
          "'Score our GDPR compliance' → Compliance Manager.",
          "'Block outbound email with credit card numbers' → DLP.",
          "'Label a doc as Confidential and encrypt it' → Information Protection.",
          "'Preserve mailboxes for litigation' → eDiscovery.",
          "'Detect suspicious behavior by an employee' → Insider Risk Management.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Purview = compliance + DLP + labels + eDiscovery + insider risk — one portal.",
      },
    ],
  },
  {
    id: "l-ms9-ps-1",
    topicId: "ms9-pricing-support",
    order: 1,
    title: "Business vs Enterprise vs Frontline",
    summary:
      "Three plan families. One split by size, one by seat type.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Three families, three audiences",
        body:
          "Microsoft 365 plans split into Business (SMB), Enterprise (larger orgs), and Frontline (deskless workers).",
      },
      {
        kind: "comparison",
        title: "The split",
        table: {
          columns: ["Family", "Max users", "Target"],
          rows: [
            { label: "Business (Basic / Standard / Premium)", cells: ["300", "SMB"] },
            { label: "Enterprise (E3 / E5)", cells: ["Unlimited", "Information workers at scale"] },
            { label: "Frontline (F3)", cells: ["Unlimited", "Deskless / shift workers"] },
          ],
        },
      },
      {
        kind: "concept",
        title: "Within Business",
        bullets: [
          "Business Basic — web/mobile apps, no desktop Office.",
          "Business Standard — adds desktop Office apps.",
          "Business Premium — adds Intune + Entra ID P1 + Defender for Business.",
        ],
      },
      {
        kind: "concept",
        title: "Within Enterprise",
        bullets: [
          "E3 — full productivity + basic security + Information Protection.",
          "E5 — E3 plus Defender XDR, Purview advanced, Entra ID P2, Power BI Pro, Teams Phone.",
        ],
      },
      {
        kind: "tip",
        title: "Scenario match",
        bullets: [
          "'Small company, 150 users, needs Intune' → Business Premium.",
          "'Large org, wants the full security stack' → E5.",
          "'Grocery chain, 2,000 shift workers' → F3.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight: "Business caps at 300. Enterprise scales. Frontline covers deskless workers.",
      },
    ],
  },
  {
    id: "l-ms9-ps-2",
    topicId: "ms9-pricing-support",
    order: 2,
    title: "Support, SLA, and admin resources",
    summary:
      "Where to get help, how Microsoft backs up M365 availability, and the admin surface area.",
    minutes: 3,
    cards: [
      {
        kind: "intro",
        title: "Ways to get help",
        body:
          "Microsoft provides multiple support channels — self-serve docs, community, CSP partners, direct Microsoft support.",
      },
      {
        kind: "concept",
        title: "Admin surface area",
        bullets: [
          "Microsoft 365 Admin Center — users, licenses, billing, service health.",
          "Message Center — proactive notifications about upcoming changes.",
          "Service Health Dashboard — real-time status of services.",
          "Microsoft Intune Admin Center — endpoint management.",
          "Microsoft Purview Portal — compliance management.",
          "Microsoft Defender Portal — security operations.",
        ],
      },
      {
        kind: "concept",
        title: "SLA and credits",
        body:
          "Microsoft commits to 99.9% monthly uptime. If they miss it, you receive service credits toward your next bill. Cash refunds are not part of the SLA.",
      },
      {
        kind: "tip",
        title: "Purchase channels",
        bullets: [
          "Direct — buy from Microsoft online or via enterprise agreement.",
          "CSP — a partner sells, bills, and provides first-line support.",
          "Volume licensing — for large orgs with negotiated terms.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Admin Center for operations. 99.9% SLA with service credits. CSP for partner-led purchases.",
      },
    ],
  },
];
