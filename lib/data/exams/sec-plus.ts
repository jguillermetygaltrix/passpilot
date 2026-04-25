import type { Lesson, Question, Topic } from "../../types";

// ─────────────────────────────────────────────────────────────────
// CompTIA Security+ (SY0-701) — current exam version (2023+ refresh)
// ─────────────────────────────────────────────────────────────────

export const SEC_PLUS_TOPICS: Topic[] = [
  {
    id: "secp-concepts",
    examId: "sec-plus",
    name: "General Security Concepts",
    shortName: "Concepts",
    weight: 0.12,
    summary:
      "Foundational vocabulary: the CIA triad, security control categories, the change-management process, and zero-trust principles.",
    subtopics: [
      "CIA triad (Confidentiality, Integrity, Availability) and AAA (Authentication, Authorization, Accounting)",
      "Control categories: Technical, Managerial, Operational, Physical",
      "Control types: Preventive, Deterrent, Detective, Corrective, Compensating, Directive",
      "Gap analysis and security posture",
      "Zero Trust pillars (control plane vs data plane)",
      "Change management (approval process, ownership, scope)",
      "Cryptographic concepts (PKI, hashing, salting, key stretching, blockchain)",
    ],
    keyFacts: [
      "CIA = Confidentiality, Integrity, Availability. AAA = Authentication, Authorization, Accounting.",
      "Control categories: Technical, Managerial, Operational, Physical.",
      "Control types: Preventive, Deterrent, Detective, Corrective, Compensating, Directive.",
      "Zero Trust: never trust, always verify; separate control plane from data plane.",
      "Non-repudiation = sender can't deny they sent it (achieved via digital signatures).",
      "PKI uses asymmetric crypto: public key encrypts/verifies, private key decrypts/signs.",
      "Hashing is one-way; salting prevents rainbow-table attacks; key stretching slows brute force.",
    ],
    cramSheet: [
      "CIA triad: Confidentiality, Integrity, Availability.",
      "Categories vs types: categories = WHO/WHERE (Technical/Managerial/Operational/Physical), types = WHAT (Preventive/Detective/etc).",
      "Detective control = finds something happened (logs, IDS). Preventive = stops it (firewall, MFA).",
      "Compensating control = alternative when primary isn't feasible.",
      "Zero Trust: subjects + systems → policy enforcement → policy decision → resources.",
      "Digital signature = sign with sender's PRIVATE key, verify with sender's PUBLIC key.",
    ],
    review: {
      examWeight: "12% of the exam",
      overview:
        "The smallest domain by weight, but it sets up vocabulary used everywhere else. The CIA triad is the most-tested single concept in the entire exam — every scenario can be framed as protecting one of those three. Beyond CIA, focus on the difference between control *categories* (where they live: technical, managerial, operational, physical) and control *types* (what they do: preventive, detective, corrective, etc). Zero Trust and change management round it out — both newer additions to SY0-701.",
      sections: [
        {
          heading: "The CIA triad and AAA",
          body:
            "Every security control is fundamentally protecting one of these. Memorize what each means and what attacks compromise each.",
          table: {
            columns: ["Property", "What it means", "Attack that breaks it"],
            rows: [
              { label: "Confidentiality", cells: ["Only authorized parties can read", "Eavesdropping, data theft, shoulder surfing"] },
              { label: "Integrity", cells: ["Data hasn't been altered", "Tampering, MITM, malware injection"] },
              { label: "Availability", cells: ["Data/service is reachable when needed", "DoS, ransomware, hardware failure"] },
              { label: "Authentication", cells: ["Prove who you are", "Credential theft, phishing"] },
              { label: "Authorization", cells: ["What you can do once authenticated", "Privilege escalation"] },
              { label: "Accounting", cells: ["Track what you did", "Log tampering, audit trail gaps"] },
            ],
          },
        },
        {
          heading: "Control categories vs control types",
          body:
            "Categories describe WHERE the control lives. Types describe WHAT the control does. Every control has both attributes.",
          bullets: [
            "Technical (logical) — implemented in software/hardware: firewalls, encryption, MFA.",
            "Managerial (administrative) — policies, procedures, risk assessments, security awareness training.",
            "Operational — day-to-day human-driven: change management, incident response procedures.",
            "Physical — locks, fences, badge readers, security guards.",
            "Preventive — stops the incident (firewall blocks port).",
            "Deterrent — discourages it (warning signs, visible cameras).",
            "Detective — alerts when it happens (IDS, log monitoring).",
            "Corrective — restores after (backup restore, patching).",
            "Compensating — substitute when primary control isn't feasible.",
            "Directive — guides behavior (policy, AUP).",
          ],
        },
        {
          heading: "Zero Trust",
          body:
            "Old model: trust the internal network. Zero Trust: never trust, always verify. Every request is authenticated and authorized regardless of network location.",
          bullets: [
            "Subjects/Systems initiate requests.",
            "Policy Enforcement Point (PEP) — gateway that allows or blocks based on the decision.",
            "Policy Decision Point (PDP) — evaluates trust signals and returns allow/deny.",
            "Control plane vs data plane — control plane decides; data plane executes.",
            "Adaptive identity — risk-based access decisions per request.",
            "Threat scope reduction — limit blast radius of any compromise.",
          ],
        },
        {
          heading: "Cryptographic foundations",
          body:
            "Crypto underpins every other domain. The exam tests recognition (which algorithm? which goal?) more than math.",
          bullets: [
            "Symmetric — same key for encrypt and decrypt (AES, ChaCha20). Fast, key-exchange problem.",
            "Asymmetric — public/private key pair (RSA, ECC). Slower, solves key exchange.",
            "Hashing — one-way fingerprint (SHA-256, SHA-3). For integrity, not encryption.",
            "Salting — random data added to a password before hashing; defeats rainbow tables.",
            "Key stretching — slow hash (bcrypt, scrypt, Argon2, PBKDF2) makes brute force expensive.",
            "PKI — Public Key Infrastructure: CAs issue certificates binding identity to public keys.",
            "Digital signature — sign with sender's private key; anyone with public key can verify.",
            "Non-repudiation — sender can't deny sending; achieved via digital signature.",
            "Blockchain — distributed immutable ledger; integrity via chained hashes.",
          ],
        },
        {
          heading: "Change management",
          body:
            "Newer addition to SY0-701. Recognize that proper change management is itself a security control — uncontrolled change introduces vulnerabilities.",
          bullets: [
            "Approval process — RFC submitted, reviewed, approved/rejected.",
            "Ownership — who owns the change and the rollback.",
            "Stakeholders — who needs to know and when.",
            "Impact analysis — what breaks if this change goes wrong?",
            "Test results required before production.",
            "Backout (rollback) plan mandatory.",
            "Maintenance window — defined off-hours change time.",
            "Standard operating procedure (SOP) — repeatable change pattern.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Authentication vs Authorization vs Accounting",
          explanation:
            "Authentication = prove who you are (password, MFA). Authorization = what you can do (RBAC, ACLs). Accounting = log what you did (audit trail).",
        },
        {
          confusion: "Control category vs type",
          explanation:
            "Category answers WHO/WHERE (technical, managerial, operational, physical). Type answers WHAT (preventive, detective, etc). A firewall is technical AND preventive. Security awareness training is managerial AND directive.",
        },
        {
          confusion: "Deterrent vs Preventive",
          explanation:
            "Preventive STOPS the action (locked door, firewall). Deterrent DISCOURAGES the action (warning sign, visible camera). A camera is BOTH detective AND deterrent — it records (detective) and discourages (deterrent).",
        },
        {
          confusion: "Hashing vs Encryption",
          explanation:
            "Hashing is one-way — you can't get the original back. Encryption is two-way — decrypt restores the original. Use hashing for passwords (compare hashes) and integrity. Use encryption for confidentiality.",
        },
        {
          confusion: "Public vs Private key — which does what",
          explanation:
            "Encrypt for confidentiality: encrypt with recipient's PUBLIC key, recipient decrypts with their PRIVATE key. Sign for non-repudiation: sign with sender's PRIVATE key, verify with sender's PUBLIC key. Confusing because the directions are opposite.",
        },
        {
          confusion: "Salting vs Key stretching",
          explanation:
            "Salt = random per-user data added before hashing (defeats rainbow tables). Key stretching = intentionally slow hash function (defeats brute force). Modern password storage uses both: salt + bcrypt/Argon2.",
        },
      ],
      examTips: [
        "'Eavesdropping on network traffic' → confidentiality compromised.",
        "'Data was altered in transit' → integrity compromised.",
        "'Server unreachable due to flood' → availability compromised.",
        "'Cannot deny sending the email' → non-repudiation (digital signature).",
        "'Stops the action from occurring' → preventive control.",
        "'Records that an action occurred' → detective control.",
        "'Substitute when primary control unavailable' → compensating control.",
        "'Policy that guides behavior' → directive control.",
        "'Slow password hashing function' → key stretching (bcrypt, Argon2).",
        "'Random data added before hashing' → salt.",
        "'Verify identity at every request regardless of network' → Zero Trust.",
      ],
    },
  },
  {
    id: "secp-threats",
    examId: "sec-plus",
    name: "Threats, Vulnerabilities & Mitigations",
    shortName: "Threats",
    weight: 0.22,
    summary:
      "The threat actors, attack vectors, and vulnerabilities you'll be asked to identify and mitigate. The largest second-tier domain.",
    subtopics: [
      "Threat actors: nation-state, organized crime, insider, hacktivist, script kiddie, unskilled, shadow IT",
      "Threat vectors and attack surfaces (message-based, image-based, file-based, voice call, removable device, vulnerable software)",
      "Malware types: ransomware, trojan, worm, rootkit, spyware, bloatware, virus, keylogger, logic bomb",
      "Social engineering: phishing, vishing, smishing, pharming, BEC, pretexting, watering hole, typosquatting",
      "Network attacks: DDoS, DNS poisoning, ARP poisoning, MITM, replay, on-path",
      "Application attacks: SQLi, XSS, CSRF, buffer overflow, race condition, directory traversal, injection",
      "Cryptographic attacks: birthday, collision, downgrade, brute force, dictionary",
      "Hardware/firmware vulnerabilities: side channel, TOCTOU, supply chain",
      "Mitigation: segmentation, ACLs, patching, hardening, EDR, application allowlisting",
    ],
    keyFacts: [
      "Threat actor motivations: financial, political/ideological, espionage, retaliation, philosophical/ethical, disruption/chaos.",
      "Phishing = email. Vishing = voice. Smishing = SMS. Pharming = redirected to fake site.",
      "BEC (Business Email Compromise) is the highest-loss social engineering attack by dollar value.",
      "RAT = Remote Access Trojan; PUP = Potentially Unwanted Program.",
      "SQL injection = unsanitized input concatenated into SQL queries; mitigation = parameterized queries.",
      "XSS = malicious script in web page; mitigation = input validation + output encoding + CSP.",
      "CSRF = forced action via authenticated session; mitigation = anti-CSRF tokens.",
      "Buffer overflow = writing past allocated memory; mitigation = ASLR, DEP, bounds checking.",
      "Race condition (TOCTOU = Time of Check to Time of Use) — exploit gap between check and use.",
    ],
    cramSheet: [
      "Phishing (email), vishing (voice), smishing (SMS), pharming (DNS to fake site).",
      "BEC = financial loss leader. Don't confuse with whaling (specific target = exec).",
      "Worm = self-propagates. Virus = needs host file/user action.",
      "Ransomware → backups (offline, immutable, tested) are the answer.",
      "SQLi → parameterized queries / prepared statements.",
      "XSS → output encoding + Content Security Policy.",
      "Race condition = TOCTOU.",
      "Side-channel = info leakage via timing, power, EM emissions.",
    ],
    review: {
      examWeight: "22% of the exam",
      overview:
        "This domain is identification: name the attack from a scenario, name the threat actor from a motive, name the mitigation from an attack. Memorize the 'phishing family' (phishing, vishing, smishing, pharming, whaling, spear phishing, BEC) cold — they appear in every exam in multiple variations. Same with the malware family (virus, worm, trojan, ransomware, rootkit, spyware, RAT). Application attacks (SQLi, XSS, CSRF, buffer overflow) require knowing both the attack and the standard mitigation.",
      sections: [
        {
          heading: "Threat actors",
          table: {
            columns: ["Actor", "Sophistication", "Motivation"],
            rows: [
              { label: "Nation-state (APT)", cells: ["Highest", "Espionage, disruption, geopolitical"] },
              { label: "Organized crime", cells: ["High", "Financial"] },
              { label: "Insider threat", cells: ["Variable (legitimate access)", "Financial, retaliation, ideology"] },
              { label: "Hacktivist", cells: ["Medium", "Political/ideological"] },
              { label: "Unskilled / Script kiddie", cells: ["Low", "Notoriety, curiosity"] },
              { label: "Shadow IT", cells: ["N/A (not malicious)", "Internal user adopts unsanctioned tech"] },
            ],
          },
        },
        {
          heading: "Phishing family — know each variant",
          table: {
            columns: ["Attack", "Channel", "Defining feature"],
            rows: [
              { label: "Phishing", cells: ["Email", "Mass / generic"] },
              { label: "Spear phishing", cells: ["Email", "Targeted to specific person/role"] },
              { label: "Whaling", cells: ["Email", "Targets executives"] },
              { label: "Vishing", cells: ["Voice call", "Often spoofed caller ID"] },
              { label: "Smishing", cells: ["SMS", "Often delivery / urgent action lures"] },
              { label: "BEC", cells: ["Email", "Impersonates exec to authorize wire transfer"] },
              { label: "Pharming", cells: ["DNS / hosts file", "Redirects user to fake site"] },
              { label: "Watering hole", cells: ["Compromised website", "Targets users who frequent that site"] },
              { label: "Typosquatting", cells: ["Domain", "Lookalike URL (g00gle.com)"] },
            ],
          },
        },
        {
          heading: "Malware types",
          bullets: [
            "Virus — code that needs a host file and user action to spread.",
            "Worm — self-propagating across networks without user action.",
            "Trojan — disguised as legitimate software; opens a backdoor.",
            "Ransomware — encrypts files, demands payment for decryption.",
            "Rootkit — hides itself and other malware at OS or kernel level.",
            "Spyware — monitors user activity, collects data.",
            "Keylogger — records keystrokes.",
            "Logic bomb — payload triggered by specific condition (date, event).",
            "Bloatware — pre-installed unwanted software (PUP).",
            "RAT — Remote Access Trojan; gives attacker full remote control.",
            "Cryptominer — uses victim's resources to mine cryptocurrency.",
          ],
        },
        {
          heading: "Network attacks",
          bullets: [
            "DDoS — distributed denial of service; volumetric, protocol, or application layer.",
            "DNS poisoning — corrupt DNS cache to redirect traffic.",
            "ARP poisoning — link-layer attack that sends false ARP messages.",
            "MITM (on-path) — attacker intercepts communications between two parties.",
            "Replay — capture and re-send valid auth tokens or messages.",
            "Wireless: rogue AP, evil twin, deauthentication attack, jamming.",
            "BGP hijacking — false BGP announcements reroute traffic.",
          ],
        },
        {
          heading: "Application attacks and mitigations",
          table: {
            columns: ["Attack", "What it does", "Mitigation"],
            rows: [
              { label: "SQL Injection", cells: ["Unsanitized input becomes part of SQL", "Parameterized queries / prepared statements"] },
              { label: "XSS (Reflected/Stored/DOM)", cells: ["Inject script into web page", "Output encoding, input validation, CSP"] },
              { label: "CSRF", cells: ["Force authenticated user to make request", "Anti-CSRF tokens, SameSite cookies"] },
              { label: "Buffer overflow", cells: ["Write past allocated memory", "Bounds checking, ASLR, DEP"] },
              { label: "Race condition (TOCTOU)", cells: ["Exploit gap between check and use", "Atomic operations, locks"] },
              { label: "Directory traversal", cells: ["../../etc/passwd to access files outside webroot", "Input validation, chroot/jail"] },
              { label: "XXE", cells: ["Malicious XML external entity", "Disable external entity parsing"] },
              { label: "SSRF", cells: ["Force server to make requests on attacker's behalf", "Allowlist outbound destinations"] },
            ],
          },
        },
        {
          heading: "Cryptographic and hardware attacks",
          bullets: [
            "Brute force — try every key.",
            "Dictionary — try common passwords from a list.",
            "Birthday attack — exploit collision probability in hashes.",
            "Collision — two inputs produce the same hash (broken in MD5/SHA-1).",
            "Downgrade — force protocol or cipher to weaker version (POODLE, FREAK).",
            "Side-channel — extract secrets from timing, power, EM emissions.",
            "Supply chain — compromise upstream component (SolarWinds-style).",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "Spear phishing vs whaling vs BEC",
          explanation:
            "Spear phishing = targeted to a specific person. Whaling = targets executives specifically. BEC = impersonates an exec (or supplier) to authorize wire transfer. BEC is the highest-dollar variant.",
        },
        {
          confusion: "Virus vs worm",
          explanation:
            "Virus needs a host file and (usually) user action. Worm is self-propagating across networks without user action. WannaCry was a worm.",
        },
        {
          confusion: "Pharming vs phishing",
          explanation:
            "Phishing tricks the user with a lure. Pharming redirects them to a fake site without their knowledge (DNS or hosts file poisoning).",
        },
        {
          confusion: "SQL injection mitigation",
          explanation:
            "Input validation alone is insufficient. The standard answer is parameterized queries (a.k.a. prepared statements) — never concatenate user input into SQL.",
        },
        {
          confusion: "TOCTOU",
          explanation:
            "TOCTOU = Time of Check to Time of Use. A race condition where the system checks a condition, then uses the resource — but the attacker changes the resource in between.",
        },
        {
          confusion: "ARP poisoning vs DNS poisoning",
          explanation:
            "ARP poisoning is layer 2 (link layer) — false MAC address claims on a LAN. DNS poisoning is application layer — false DNS responses or cache corruption.",
        },
      ],
      examTips: [
        "'Email pretending to be from CEO authorizing wire transfer' → BEC.",
        "'Phone call asking for password reset' → vishing.",
        "'Self-propagating malware across SMB shares' → worm.",
        "'Encrypts files for payment' → ransomware. Mitigation = offline immutable backups.",
        "'Unsanitized input becomes part of database query' → SQL injection. Mitigation = parameterized queries.",
        "'Script in browser stealing cookies' → XSS. Mitigation = output encoding + CSP.",
        "'Force user's logged-in session to perform action' → CSRF. Mitigation = anti-CSRF tokens.",
        "'../../../etc/passwd in a URL' → directory traversal.",
        "'Power-analysis to extract crypto key' → side-channel attack.",
        "'Compromised software update from a vendor' → supply chain attack.",
      ],
    },
  },
  {
    id: "secp-architecture",
    examId: "sec-plus",
    name: "Security Architecture",
    shortName: "Architecture",
    weight: 0.18,
    summary:
      "Designing secure systems: cloud, virtualization, IoT, network architecture, data classification, and resilience patterns.",
    subtopics: [
      "Cloud models (IaaS/PaaS/SaaS, public/private/hybrid)",
      "Cloud-specific risks: misconfiguration, shared responsibility, lateral movement",
      "Network segmentation: VLAN, screened subnet (DMZ), microsegmentation, zero-trust network",
      "Firewall types: stateful, NGFW, WAF, UTM",
      "Secure protocols: HTTPS/TLS, SSH, SFTP, DNSSEC, IPSec, S/MIME",
      "Network access control: 802.1X, NAC, port security",
      "Data classification: public, internal, confidential, restricted",
      "Data at rest, in transit, in use",
      "Resilience: high availability, redundancy, RAID, load balancing, geographic dispersal",
      "Backup strategies: full/incremental/differential, 3-2-1, immutable, offsite",
      "Hardware: HSM, TPM, secure enclave",
      "IoT and OT/SCADA security considerations",
    ],
    keyFacts: [
      "Shared responsibility: cloud provider secures the cloud; you secure what's IN the cloud.",
      "DMZ / screened subnet — public-facing services live here, isolated from internal LAN.",
      "Microsegmentation — fine-grained segmentation at workload level (typical in SDN / Zero Trust).",
      "Stateful firewall tracks connection state. NGFW adds app awareness, IPS, threat intel.",
      "WAF protects against L7 web app attacks (SQLi, XSS).",
      "HSM = Hardware Security Module — tamper-resistant device for keys.",
      "TPM = Trusted Platform Module — chip on motherboard for full disk encryption keys.",
      "3-2-1 backup rule: 3 copies, 2 different media, 1 offsite.",
    ],
    cramSheet: [
      "Shared responsibility shifts more to YOU as you go SaaS → PaaS → IaaS (more layers to manage).",
      "DMZ = public facing zone. Internal LAN = trusted zone. Internet = untrusted zone.",
      "WAF = layer 7 web app firewall. NGFW = layer 7 next-gen firewall.",
      "HSM stores keys; TPM measures boot; secure enclave isolates app secrets.",
      "RAID 1 = mirror. RAID 5 = parity. RAID 6 = double parity. RAID 10 = mirrored stripe.",
      "Immutable backup = can't be modified or deleted within retention period (ransomware defense).",
      "RPO = how much data can you lose. RTO = how fast must you recover.",
    ],
    review: {
      examWeight: "18% of the exam",
      overview:
        "This domain rewards knowing the right architecture for the requirement. Cloud + network segmentation + firewall types are the densest topics. Memorize the cloud shared-responsibility split, the segmentation hierarchy (VLAN → screened subnet → microsegmentation), and the firewall ladder (basic → stateful → NGFW → WAF). Resilience adds RAID levels, RPO/RTO, and the 3-2-1 backup rule. Hardware roots of trust (HSM, TPM, secure enclave) round it out — know which protects what.",
      sections: [
        {
          heading: "Cloud and shared responsibility",
          body:
            "Shared responsibility shifts depending on service model. Memorize who manages what in IaaS vs PaaS vs SaaS.",
          table: {
            columns: ["Layer", "On-prem", "IaaS", "PaaS", "SaaS"],
            rows: [
              { label: "Application", cells: ["You", "You", "You", "Provider"] },
              { label: "Data", cells: ["You", "You", "You", "You"] },
              { label: "Runtime", cells: ["You", "You", "Provider", "Provider"] },
              { label: "OS / Middleware", cells: ["You", "You", "Provider", "Provider"] },
              { label: "Virtualization", cells: ["You", "Provider", "Provider", "Provider"] },
              { label: "Servers / Storage / Networking", cells: ["You", "Provider", "Provider", "Provider"] },
              { label: "Physical DC", cells: ["You", "Provider", "Provider", "Provider"] },
            ],
          },
        },
        {
          heading: "Network segmentation",
          bullets: [
            "VLAN — logical L2 separation; broadcast domain isolation.",
            "Screened subnet (DMZ) — buffer zone hosting public-facing services (web, mail).",
            "Network segmentation — separate environments by trust (prod/dev, finance/HR).",
            "Microsegmentation — workload-level segmentation enforced by SDN/host firewall.",
            "East-west vs north-south — east-west = lateral within DC; north-south = in/out of DC.",
            "Air gap — physically isolated network (used for OT/SCADA, classified networks).",
          ],
        },
        {
          heading: "Firewall ladder",
          table: {
            columns: ["Type", "Operates at", "What it inspects"],
            rows: [
              { label: "Packet filter", cells: ["L3/L4", "5-tuple only — no state"] },
              { label: "Stateful", cells: ["L3/L4", "Tracks connection state"] },
              { label: "NGFW", cells: ["L3-L7", "Adds app awareness, IPS, AV, threat intel"] },
              { label: "WAF", cells: ["L7 (HTTP/S)", "Web app attacks: SQLi, XSS, CSRF"] },
              { label: "UTM", cells: ["Multi-layer", "All-in-one (FW, AV, AS, IPS, VPN)"] },
            ],
          },
        },
        {
          heading: "Secure protocols — replace these old ones",
          table: {
            columns: ["Insecure", "Secure replacement", "Port"],
            rows: [
              { label: "Telnet", cells: ["SSH", "22"] },
              { label: "FTP", cells: ["SFTP / FTPS", "22 / 990"] },
              { label: "HTTP", cells: ["HTTPS (TLS 1.2+)", "443"] },
              { label: "SNMP v1/v2", cells: ["SNMPv3", "161/162"] },
              { label: "POP3 / IMAP", cells: ["POP3S / IMAPS", "995 / 993"] },
              { label: "DNS (plain)", cells: ["DNSSEC, DoH, DoT", "53, 443, 853"] },
              { label: "LDAP", cells: ["LDAPS", "636"] },
            ],
          },
        },
        {
          heading: "Resilience and backup",
          bullets: [
            "RPO (Recovery Point Objective) — max data loss tolerable (e.g., 1 hour).",
            "RTO (Recovery Time Objective) — max downtime tolerable (e.g., 4 hours).",
            "MTTR (Mean Time to Repair), MTBF (Mean Time Between Failures).",
            "RAID 0 = stripe (no redundancy, performance only).",
            "RAID 1 = mirror (redundancy, no performance gain).",
            "RAID 5 = stripe with single parity (3+ disks; 1-disk failure tolerance).",
            "RAID 6 = stripe with double parity (4+ disks; 2-disk failure tolerance).",
            "RAID 10 = mirror + stripe (best performance + redundancy, costliest).",
            "3-2-1 backup: 3 copies, 2 different media types, 1 offsite.",
            "Immutable backup = WORM media; ransomware can't encrypt or delete.",
            "Cold / Warm / Hot site — recovery readiness on a spectrum.",
          ],
        },
        {
          heading: "Hardware roots of trust",
          table: {
            columns: ["Component", "Role"],
            rows: [
              { label: "TPM", cells: ["Motherboard chip; stores BitLocker keys, attests boot integrity"] },
              { label: "HSM", cells: ["Tamper-resistant module; high-assurance key storage and crypto operations"] },
              { label: "Secure enclave", cells: ["CPU-isolated execution environment (Intel SGX, ARM TrustZone)"] },
              { label: "Secure Boot", cells: ["UEFI verifies bootloader signature before executing"] },
            ],
          },
        },
      ],
      gotchas: [
        {
          confusion: "TPM vs HSM",
          explanation:
            "TPM is a chip on the motherboard — for things like BitLocker disk encryption keys, measured boot. HSM is a separate tamper-resistant appliance for high-assurance key storage and crypto ops at scale.",
        },
        {
          confusion: "DMZ vs internal LAN",
          explanation:
            "DMZ (screened subnet) hosts public-facing services. Internal LAN is trusted, never directly reachable from the internet. Internet → DMZ → internal — never internet → internal.",
        },
        {
          confusion: "WAF vs NGFW",
          explanation:
            "WAF is web-app specific (HTTP/S, SQLi, XSS). NGFW is general L3-L7 with app awareness and IPS. Both can coexist; use WAF in front of web apps.",
        },
        {
          confusion: "RPO vs RTO",
          explanation:
            "RPO = how much DATA loss is tolerable (drives backup frequency). RTO = how much DOWNTIME is tolerable (drives recovery infrastructure).",
        },
        {
          confusion: "RAID 5 vs RAID 6",
          explanation:
            "RAID 5 = single parity, survives one disk failure. RAID 6 = double parity, survives two simultaneous failures. RAID 6 costs more storage but matters as drives get larger (rebuild times).",
        },
      ],
      examTips: [
        "'Public-facing web server zone' → DMZ / screened subnet.",
        "'Encrypted DNS lookups' → DNSSEC or DoH/DoT.",
        "'Hardware that stores BitLocker keys on a laptop' → TPM.",
        "'Hardware key store for a CA' → HSM.",
        "'Tolerate one disk failure with parity' → RAID 5.",
        "'No single point of failure for a web app' → load balancer + multi-AZ deployment.",
        "'Backup that ransomware cannot delete' → immutable / WORM.",
        "'How much data can be lost' → RPO. 'How fast must we recover' → RTO.",
        "'Replace plaintext file transfer' → SFTP or FTPS.",
        "'Stop SQL injection at the network edge' → WAF.",
      ],
    },
  },
  {
    id: "secp-ops",
    examId: "sec-plus",
    name: "Security Operations",
    shortName: "Operations",
    weight: 0.28,
    summary:
      "The biggest domain — day-to-day security work: monitoring, hardening, vulnerability management, incident response, identity and access management, automation.",
    subtopics: [
      "Asset management and configuration baselines",
      "Hardening: disable services, default deny, least functionality",
      "Vulnerability scanning, CVE / CVSS, patch management",
      "Logging, SIEM, log aggregation, log retention",
      "Monitoring: NetFlow, SNMP, packet capture, syslog",
      "EDR / XDR / UEBA / DLP / CASB",
      "Identity: provisioning, deprovisioning, access reviews, JIT, PAM",
      "MFA factors: something you know / have / are / do / where you are",
      "SSO and federation: SAML, OAuth 2.0, OIDC, Kerberos",
      "Authorization models: RBAC, ABAC, MAC, DAC, rule-based",
      "Incident response phases (Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned)",
      "Digital forensics: order of volatility, chain of custody, e-discovery",
      "Automation: scripts, playbooks, SOAR, secure orchestration",
    ],
    keyFacts: [
      "CVSS = 0-10 severity scale. CVE = unique vulnerability ID.",
      "False positive = scanner says vuln, actually safe. False negative = scanner misses real vuln.",
      "EDR = Endpoint Detection & Response (host-level). XDR = Extended (cross-domain). UEBA = behavior analytics.",
      "DLP = Data Loss Prevention. CASB = Cloud Access Security Broker.",
      "MFA factors: knowledge (password), possession (token), inherence (biometric), location, behavior.",
      "SAML for federated SSO web. OAuth 2.0 for delegated authorization. OIDC = identity layer on OAuth.",
      "RBAC by role. ABAC by attributes. MAC enforced by system (labels). DAC owner-controlled.",
      "Order of volatility: registers/cache → RAM → routing table/ARP/process tables → temp files → disk → remote/archived.",
    ],
    cramSheet: [
      "CVSS scores: Low 0.1-3.9, Medium 4-6.9, High 7-8.9, Critical 9-10.",
      "Patch Tuesday = Microsoft (2nd Tuesday of month). Don't deploy directly to prod.",
      "Incident response: PICERL (Prepare, Identify, Contain, Eradicate, Recover, Lessons).",
      "Order of volatility: most volatile first (RAM before disk).",
      "Chain of custody: who handled the evidence, when, where, why.",
      "JIT (Just-In-Time) = elevate privileges only when needed. PAM = Privileged Access Management.",
      "SAML = XML, web SSO. OAuth = JSON, API authorization. OIDC = OAuth + identity.",
    ],
    review: {
      examWeight: "28% of the exam — the biggest domain",
      overview:
        "Operations is where security work actually happens. The exam tests breadth: vulnerability management, monitoring, identity/access, incident response, and digital forensics all live here. Memorize the incident response phase order (PICERL is one common mnemonic), the order of volatility for forensics, the MFA factor categories, and the difference between SAML / OAuth / OIDC. Authorization models (RBAC/ABAC/MAC/DAC) appear in every exam — know what differentiates each.",
      sections: [
        {
          heading: "Vulnerability management lifecycle",
          bullets: [
            "Discovery — asset inventory and authenticated scans.",
            "Identification — CVE lookup, CVSS scoring.",
            "Prioritization — risk-based (severity + asset value + exposure).",
            "Remediation — patch, mitigate, or accept.",
            "Verification — re-scan to confirm fix.",
            "Reporting — track metrics (mean time to remediate, backlog).",
          ],
        },
        {
          heading: "Monitoring and detection stack",
          table: {
            columns: ["Tool", "Scope", "What it does"],
            rows: [
              { label: "SIEM", cells: ["Logs from many sources", "Aggregation, correlation, alerts"] },
              { label: "EDR", cells: ["Endpoint", "Behavioral detection + response on hosts"] },
              { label: "XDR", cells: ["Cross-domain (endpoint + network + cloud + identity)", "Unified detection + response"] },
              { label: "UEBA", cells: ["User + entity behavior", "Anomaly-based detection"] },
              { label: "SOAR", cells: ["Workflow automation", "Playbooks for IR triage and response"] },
              { label: "DLP", cells: ["Data flows", "Block / log sensitive data exfil"] },
              { label: "CASB", cells: ["Cloud apps (SaaS)", "Visibility, policy enforcement, shadow IT discovery"] },
            ],
          },
        },
        {
          heading: "Identity and access",
          bullets: [
            "Provisioning / deprovisioning — automated lifecycle for accounts.",
            "Periodic access reviews — recertify who has what.",
            "Least privilege — only what's needed for the role.",
            "Just-in-time access — elevate temporarily, time-bound.",
            "PAM (Privileged Access Management) — vault for admin credentials, session recording.",
            "MFA factors: something you know (password), have (token), are (biometric), do (typing pattern), where (geolocation).",
            "FIDO2 / passkeys — phishing-resistant authentication.",
            "Conditional access — risk-based per-request decisions.",
          ],
        },
        {
          heading: "Federation protocols",
          table: {
            columns: ["Protocol", "Purpose", "Format"],
            rows: [
              { label: "SAML 2.0", cells: ["Web SSO (browser-based)", "XML"] },
              { label: "OAuth 2.0", cells: ["Delegated authorization (API access)", "JSON / JWT"] },
              { label: "OIDC", cells: ["Identity layer on top of OAuth 2.0", "JSON / JWT"] },
              { label: "Kerberos", cells: ["Windows-domain SSO (ticket-based)", "Binary"] },
              { label: "RADIUS / TACACS+", cells: ["Network device AAA", "UDP / TCP"] },
            ],
          },
        },
        {
          heading: "Authorization models",
          bullets: [
            "DAC (Discretionary) — owner sets permissions (NTFS, UNIX file modes).",
            "MAC (Mandatory) — system enforces labels (Top Secret, Secret); owner can't override.",
            "RBAC (Role-Based) — permissions assigned to roles, users assigned to roles.",
            "ABAC (Attribute-Based) — policy evaluates attributes (user dept, time, location, device).",
            "Rule-Based — explicit if/then rules (firewall ACLs).",
          ],
        },
        {
          heading: "Incident response — phases",
          bullets: [
            "Preparation — runbooks, contact lists, tools, training.",
            "Identification — confirm an incident occurred (vs benign anomaly).",
            "Containment — isolate the affected systems (short-term + long-term).",
            "Eradication — remove the root cause (malware, exploited vuln).",
            "Recovery — restore systems to normal operation, monitor for recurrence.",
            "Lessons Learned — post-incident review; update runbooks and controls.",
          ],
        },
        {
          heading: "Digital forensics",
          bullets: [
            "Order of volatility (capture most-volatile first): CPU registers/cache → RAM → routing/ARP/process tables → temp files → disk → remote/archived.",
            "Chain of custody — documented who, what, when, where, why for every handling event.",
            "Hashing — calculate hash before and after acquisition to prove integrity.",
            "Write blockers — ensure source media isn't modified during acquisition.",
            "Imaging tools: dd, FTK Imager, EnCase.",
            "Legal hold / e-discovery — preserve evidence when litigation is anticipated.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "EDR vs XDR vs SIEM",
          explanation:
            "EDR = endpoint focused. XDR = unified across endpoints + network + cloud + identity. SIEM = log aggregation/correlation engine — a building block under both.",
        },
        {
          confusion: "SAML vs OAuth 2.0 vs OIDC",
          explanation:
            "SAML is XML-based, designed for browser-based SSO. OAuth 2.0 is JSON-based for delegated authorization (think: 'let app X access my data on service Y'). OIDC adds an identity (authentication) layer on top of OAuth 2.0.",
        },
        {
          confusion: "RBAC vs ABAC",
          explanation:
            "RBAC: permissions tied to roles, users assigned to roles. ABAC: policies evaluate attributes (user, resource, environment) at access time. ABAC is more flexible but more complex.",
        },
        {
          confusion: "MAC vs DAC",
          explanation:
            "MAC = system enforces labels (military classification). DAC = owner sets permissions (typical filesystem). MAC is non-discretionary — even the data owner can't grant access.",
        },
        {
          confusion: "Order of volatility",
          explanation:
            "Always capture the MOST volatile first: CPU registers and cache, then RAM, then network state, then temporary files, then disk, then remote/archived. RAM is gone the moment you power off.",
        },
        {
          confusion: "Containment vs Eradication",
          explanation:
            "Containment = stop the bleeding (isolate the host, block the IP). Eradication = remove the root cause (delete the malware, patch the vuln). Containment is short-term; eradication is the cure.",
        },
      ],
      examTips: [
        "'CVSS 9.5' → Critical severity.",
        "'False negative' → scanner missed a real vulnerability.",
        "'Aggregates logs from many sources for correlation' → SIEM.",
        "'Behavioral detection on a laptop' → EDR.",
        "'Visibility into shadow IT SaaS use' → CASB.",
        "'Block credit card numbers from leaving the network' → DLP.",
        "'Browser-based SSO with XML assertions' → SAML.",
        "'Let app X access my Google data without my password' → OAuth 2.0.",
        "'Phishing-resistant authentication' → FIDO2 / passkeys.",
        "'Permissions assigned to roles' → RBAC.",
        "'Per-request decision based on user dept and device posture' → ABAC.",
        "'Capture RAM before disk during forensic acquisition' → order of volatility.",
        "'Document who handled the evidence at each step' → chain of custody.",
        "'Phase right after Identification' → Containment.",
      ],
    },
  },
  {
    id: "secp-program",
    examId: "sec-plus",
    name: "Security Program Management & Oversight",
    shortName: "Program",
    weight: 0.20,
    summary:
      "Governance, risk, and compliance — how security programs are run, measured, and held accountable. Frameworks, audits, vendor risk, third parties.",
    subtopics: [
      "Governance: structures (boards, committees), policies, standards, procedures, guidelines",
      "Risk management: identification, assessment, treatment (accept, avoid, transfer, mitigate)",
      "Risk register and risk matrix",
      "Quantitative vs qualitative risk; SLE, ARO, ALE",
      "Business impact analysis (BIA)",
      "Third-party risk: vendor assessment, SLA, MSA, NDA, BPA, MOU/MOA",
      "Compliance: PCI DSS, HIPAA, GDPR, SOX, GLBA, FERPA, CMMC",
      "Frameworks: NIST CSF, ISO 27001/27002, CIS Controls, OWASP",
      "Privacy: PII, PHI, data subject rights, data residency, anonymization vs pseudonymization",
      "Security awareness training, phishing simulations, role-based training",
      "Audit vs assessment vs attestation",
    ],
    keyFacts: [
      "SLE = Single Loss Expectancy. ALE = Annualized Loss Expectancy = SLE × ARO.",
      "Risk treatments: accept, avoid, transfer (insurance), mitigate (controls).",
      "Inherent risk = before controls. Residual risk = after controls.",
      "BIA identifies critical processes and their RTO/RPO.",
      "GDPR = EU privacy. PCI DSS = card data. HIPAA = US healthcare. SOX = US financial.",
      "NIST CSF functions: Identify, Protect, Detect, Respond, Recover, Govern (added 2.0).",
      "Pseudonymization is reversible; anonymization is permanent.",
    ],
    cramSheet: [
      "ALE = SLE × ARO. Memorize this formula.",
      "Risk = Likelihood × Impact.",
      "Risk treatments (4): Accept, Avoid, Transfer, Mitigate.",
      "Compliance acronyms: PCI=cards, HIPAA=health, GDPR=EU privacy, SOX=financial.",
      "NIST CSF 2.0 has 6 functions (added Govern).",
      "MOU/MOA = informal intent. SLA = contractual service levels.",
      "Pseudonymized = reversible mapping. Anonymized = irreversible.",
    ],
    review: {
      examWeight: "20% of the exam",
      overview:
        "This domain is about running the program, not the daily ops. Risk management math (SLE × ARO = ALE) shows up reliably. Compliance frameworks come up by abbreviation — know which framework covers what (PCI cards, HIPAA health, GDPR EU privacy, SOX US financial reporting). Third-party risk and vendor agreements (MSA, SLA, BPA, MOU) appear in scenario questions about contracts and procurement.",
      sections: [
        {
          heading: "Governance hierarchy",
          bullets: [
            "Policy — high-level mandate, signed by senior leadership ('we will protect customer data').",
            "Standard — specific requirement ('AES-256 for data at rest').",
            "Procedure — step-by-step how-to ('how to rotate the storage encryption key').",
            "Guideline — recommended best practice (not mandatory).",
            "Baseline — minimum required configuration.",
          ],
        },
        {
          heading: "Risk management lifecycle",
          bullets: [
            "Identify — inventory assets, threats, vulnerabilities.",
            "Assess — likelihood × impact = risk score.",
            "Treat — accept / avoid / transfer / mitigate.",
            "Monitor — re-assess as conditions change.",
            "Risk appetite (overall tolerance) and risk tolerance (per category).",
          ],
        },
        {
          heading: "Quantitative risk math",
          body:
            "Quantitative risk uses dollars. Memorize the formulas — exam tests them with numeric scenarios.",
          bullets: [
            "AV (Asset Value) — what the asset is worth.",
            "EF (Exposure Factor) — % of asset value lost in an incident.",
            "SLE (Single Loss Expectancy) = AV × EF.",
            "ARO (Annualized Rate of Occurrence) — how often per year.",
            "ALE (Annualized Loss Expectancy) = SLE × ARO.",
            "Example: AV $100k × EF 25% = SLE $25k × ARO 0.5 = ALE $12.5k/yr.",
          ],
        },
        {
          heading: "Compliance frameworks",
          table: {
            columns: ["Framework", "What it covers"],
            rows: [
              { label: "PCI DSS", cells: ["Payment card data — required for any merchant"] },
              { label: "HIPAA", cells: ["US healthcare PHI"] },
              { label: "HITECH", cells: ["Strengthens HIPAA breach notification + EHR"] },
              { label: "GDPR", cells: ["EU personal data; consent, data subject rights, breach notification within 72h"] },
              { label: "CCPA / CPRA", cells: ["California consumer privacy"] },
              { label: "SOX", cells: ["US public company financial reporting controls"] },
              { label: "GLBA", cells: ["US financial services privacy + safeguards"] },
              { label: "FERPA", cells: ["US student education records"] },
              { label: "CMMC", cells: ["US DoD contractor cybersecurity maturity"] },
              { label: "NIST CSF / 800-53", cells: ["US federal info systems controls catalog"] },
              { label: "ISO 27001/27002", cells: ["Internationally recognized ISMS standard"] },
            ],
          },
        },
        {
          heading: "Third-party agreements",
          bullets: [
            "MSA (Master Service Agreement) — overarching contract terms.",
            "SOW (Statement of Work) — specifics of one engagement under MSA.",
            "SLA (Service Level Agreement) — measurable service commitments (uptime, response time).",
            "BPA (Business Partner Agreement) — terms for ongoing partnerships.",
            "NDA (Non-Disclosure Agreement) — confidentiality.",
            "MOU / MOA (Memorandum of Understanding/Agreement) — non-binding intent.",
            "Vendor due diligence — SOC 2 reports, ISO certs, pen test results, financial health.",
          ],
        },
        {
          heading: "Privacy concepts",
          bullets: [
            "PII — personally identifiable information.",
            "PHI — protected health information (HIPAA).",
            "Pseudonymization — replace identifiers with tokens; reversible with mapping.",
            "Anonymization — permanently remove ability to re-identify.",
            "Data minimization — collect only what you need.",
            "Purpose limitation — use only for the stated purpose.",
            "Data residency / sovereignty — data must stay in a specific jurisdiction.",
            "Right to erasure ('right to be forgotten') — GDPR Article 17.",
          ],
        },
      ],
      gotchas: [
        {
          confusion: "SLE vs ALE",
          explanation:
            "SLE = single-incident loss. ALE = annualized expected loss. ALE = SLE × ARO. The exam will give you AV, EF, and ARO and ask for ALE.",
        },
        {
          confusion: "Inherent vs residual risk",
          explanation:
            "Inherent = before controls. Residual = after controls. Risk acceptance applies to residual risk that's still too high to fully mitigate but tolerable.",
        },
        {
          confusion: "Pseudonymization vs anonymization",
          explanation:
            "Pseudonymization keeps a mapping that lets you re-identify (still PII under GDPR). Anonymization removes that ability permanently (no longer PII).",
        },
        {
          confusion: "MOU vs SLA",
          explanation:
            "MOU is non-binding intent ('we'll cooperate on X'). SLA is contractual ('99.9% uptime or service credit'). Don't confuse intent with enforceable commitment.",
        },
        {
          confusion: "Policy vs Standard vs Procedure",
          explanation:
            "Policy says WHAT and WHY ('protect customer data'). Standard says specifically HOW MUCH ('AES-256, rotate keys yearly'). Procedure says step-by-step HOW ('go to portal X, click Y, ...').",
        },
        {
          confusion: "Compliance vs Audit vs Assessment",
          explanation:
            "Assessment = internal review. Audit = independent verification, often required for compliance. Attestation = third-party assertion (e.g., SOC 2 attestation).",
        },
      ],
      examTips: [
        "'Loss per incident' → SLE.",
        "'Annual expected loss' → ALE = SLE × ARO.",
        "'Buy insurance against the loss' → risk transfer.",
        "'Decide the risk is small enough to live with' → risk acceptance.",
        "'EU personal data + 72-hour breach notification' → GDPR.",
        "'Card data merchant requirements' → PCI DSS.",
        "'US healthcare patient records' → HIPAA.",
        "'Reversible identifier replacement' → pseudonymization.",
        "'Permanent removal of identity' → anonymization.",
        "'High-level intent without contract' → MOU.",
        "'Measurable uptime commitment' → SLA.",
        "'Independent third-party verification' → audit.",
      ],
    },
  },
];

// ─────────────────────────────────────────────────────────────────
// QUESTIONS
// ─────────────────────────────────────────────────────────────────

export const SEC_PLUS_QUESTIONS: Question[] = [
  // ── Concepts ───────────────────────────────────────────────────
  {
    id: "q-secp-c-1",
    examId: "sec-plus",
    topicId: "secp-concepts",
    prompt: "An attacker successfully reads sensitive emails in transit between two servers. Which element of the CIA triad has been compromised?",
    choices: ["Confidentiality", "Integrity", "Availability", "Accountability"],
    correctIndex: 0,
    explanation:
      "Reading data the attacker shouldn't see is a confidentiality breach. Integrity would involve altering the data; availability would involve disrupting access.",
    difficulty: "easy",
    tags: ["cia"],
  },
  {
    id: "q-secp-c-2",
    examId: "sec-plus",
    topicId: "secp-concepts",
    prompt: "Visible CCTV cameras in a parking lot serve which two control purposes?",
    choices: ["Preventive and corrective", "Detective and deterrent", "Compensating and directive", "Managerial and physical"],
    correctIndex: 1,
    explanation:
      "Cameras detect (record) actions and deter (discourage) people from acting because they're being watched.",
    difficulty: "medium",
    tags: ["controls"],
  },
  {
    id: "q-secp-c-3",
    examId: "sec-plus",
    topicId: "secp-concepts",
    prompt: "Which property is achieved when a sender cannot deny sending a message?",
    choices: ["Authentication", "Authorization", "Non-repudiation", "Integrity"],
    correctIndex: 2,
    explanation:
      "Non-repudiation prevents the sender from denying their action — typically achieved with digital signatures.",
    difficulty: "easy",
    tags: ["cia", "crypto"],
  },
  {
    id: "q-secp-c-4",
    examId: "sec-plus",
    topicId: "secp-concepts",
    prompt: "A hashing algorithm is used to store user passwords. To defeat rainbow-table attacks, what is the standard mitigation?",
    choices: ["Use a longer hash output", "Add a unique salt before hashing", "Encrypt the hash with AES", "Hash the password twice"],
    correctIndex: 1,
    explanation:
      "Salting adds unique random data per user before hashing, defeating pre-computed rainbow tables.",
    difficulty: "medium",
    tags: ["crypto"],
  },
  {
    id: "q-secp-c-5",
    examId: "sec-plus",
    topicId: "secp-concepts",
    prompt: "Under Zero Trust, what makes the access decision for each request?",
    choices: ["The firewall ACL", "The Policy Decision Point (PDP)", "The user's domain group", "The device's MAC address"],
    correctIndex: 1,
    explanation:
      "In Zero Trust, the PDP evaluates trust signals and returns allow/deny, which the PEP enforces.",
    difficulty: "medium",
    tags: ["zero-trust"],
  },
  {
    id: "q-secp-c-6",
    examId: "sec-plus",
    topicId: "secp-concepts",
    prompt: "When you sign a document with a digital signature, which key do you use, and which key does the verifier use?",
    choices: [
      "Sign with sender's public key, verify with sender's private key.",
      "Sign with sender's private key, verify with sender's public key.",
      "Sign with recipient's public key, verify with recipient's private key.",
      "Sign with shared secret, verify with shared secret.",
    ],
    correctIndex: 1,
    explanation:
      "Signing uses the sender's private key. Verification uses the sender's public key. (Encryption is the opposite — you encrypt with the recipient's public key.)",
    difficulty: "hard",
    tags: ["crypto", "pki"],
  },

  // ── Threats ────────────────────────────────────────────────────
  {
    id: "q-secp-t-1",
    examId: "sec-plus",
    topicId: "secp-threats",
    prompt: "An employee receives a text message claiming a package delivery requires immediate confirmation by clicking a link. What attack is this?",
    choices: ["Phishing", "Vishing", "Smishing", "Whaling"],
    correctIndex: 2,
    explanation:
      "Smishing is phishing via SMS. Vishing is voice; phishing is email; whaling targets executives.",
    difficulty: "easy",
    tags: ["social-engineering"],
  },
  {
    id: "q-secp-t-2",
    examId: "sec-plus",
    topicId: "secp-threats",
    prompt: "An attacker convinces an accounts payable clerk via email to wire $250,000 to a 'new vendor account', impersonating the CFO. Which attack is this?",
    choices: ["Spear phishing", "Business Email Compromise (BEC)", "Whaling", "Smishing"],
    correctIndex: 1,
    explanation:
      "BEC impersonates an executive (or trusted vendor) to authorize fraudulent financial transactions. It's the highest-loss social engineering category by dollar value.",
    difficulty: "medium",
    tags: ["social-engineering", "bec"],
  },
  {
    id: "q-secp-t-3",
    examId: "sec-plus",
    topicId: "secp-threats",
    prompt: "Which malware type self-propagates across a network without requiring user interaction?",
    choices: ["Trojan", "Virus", "Worm", "Logic bomb"],
    correctIndex: 2,
    explanation:
      "Worms self-propagate. Viruses need a host file; trojans require the user to run them; logic bombs trigger on a condition.",
    difficulty: "easy",
    tags: ["malware"],
  },
  {
    id: "q-secp-t-4",
    examId: "sec-plus",
    topicId: "secp-threats",
    prompt: "A web app concatenates user input directly into SQL queries. Which mitigation is the standard answer?",
    choices: ["Input validation only", "Web application firewall (WAF)", "Parameterized queries / prepared statements", "Disable JavaScript"],
    correctIndex: 2,
    explanation:
      "Parameterized queries (prepared statements) keep input separate from SQL syntax. Input validation and WAFs are useful layers but the primary fix is parameterized queries.",
    difficulty: "medium",
    tags: ["app-attacks", "sqli"],
  },
  {
    id: "q-secp-t-5",
    examId: "sec-plus",
    topicId: "secp-threats",
    prompt: "An attacker forces an authenticated user's browser to perform an unwanted action on a site where the user is logged in. What attack is this?",
    choices: ["XSS", "CSRF", "SSRF", "SQL injection"],
    correctIndex: 1,
    explanation:
      "CSRF (Cross-Site Request Forgery) leverages a user's existing authenticated session. Mitigation is anti-CSRF tokens and SameSite cookies.",
    difficulty: "medium",
    tags: ["app-attacks", "csrf"],
  },
  {
    id: "q-secp-t-6",
    examId: "sec-plus",
    topicId: "secp-threats",
    prompt: "An exploit takes advantage of the gap between when a system checks a file's permissions and when it accesses the file. What is this called?",
    choices: ["Buffer overflow", "Race condition (TOCTOU)", "Side-channel attack", "Logic bomb"],
    correctIndex: 1,
    explanation:
      "TOCTOU (Time of Check to Time of Use) is a race condition exploited by changing the resource between the check and the use.",
    difficulty: "hard",
    tags: ["app-attacks"],
  },
  {
    id: "q-secp-t-7",
    examId: "sec-plus",
    topicId: "secp-threats",
    prompt: "Which threat actor type is characterized by the highest sophistication, long-term persistence, and strategic geopolitical objectives?",
    choices: ["Hacktivist", "Script kiddie", "Nation-state (APT)", "Insider threat"],
    correctIndex: 2,
    explanation:
      "Nation-state actors (often labeled APTs) have the resources and patience for long-running, highly sophisticated operations against strategic targets.",
    difficulty: "easy",
    tags: ["threat-actors"],
  },
  {
    id: "q-secp-t-8",
    examId: "sec-plus",
    topicId: "secp-threats",
    prompt: "A trusted software update is compromised by an attacker, distributing malware to all customers who install the update. What attack class is this?",
    choices: ["Ransomware", "Supply chain attack", "Insider threat", "Watering hole"],
    correctIndex: 1,
    explanation:
      "Supply chain attacks target an upstream component or vendor to reach many downstream targets. SolarWinds is the canonical example.",
    difficulty: "medium",
    tags: ["threat-actors"],
  },

  // ── Architecture ───────────────────────────────────────────────
  {
    id: "q-secp-a-1",
    examId: "sec-plus",
    topicId: "secp-architecture",
    prompt: "Where would you typically deploy a public-facing web server in a traditional network architecture?",
    choices: ["Inside the internal LAN", "On the internet directly", "In the screened subnet (DMZ)", "On the management VLAN"],
    correctIndex: 2,
    explanation:
      "Public-facing services live in the DMZ — buffered between the internet and the internal LAN.",
    difficulty: "easy",
    tags: ["network-arch"],
  },
  {
    id: "q-secp-a-2",
    examId: "sec-plus",
    topicId: "secp-architecture",
    prompt: "Which firewall type is designed specifically to detect and block web application attacks like SQL injection and XSS?",
    choices: ["Packet filter", "Stateful firewall", "Web Application Firewall (WAF)", "UTM appliance"],
    correctIndex: 2,
    explanation:
      "WAFs operate at L7 specifically for HTTP/S traffic and target web app attack patterns. NGFWs are general L7 with broader scope; WAFs are specialized.",
    difficulty: "easy",
    tags: ["firewalls"],
  },
  {
    id: "q-secp-a-3",
    examId: "sec-plus",
    topicId: "secp-architecture",
    prompt: "Which RAID level provides single-parity protection and survives the failure of one disk in the array?",
    choices: ["RAID 0", "RAID 1", "RAID 5", "RAID 6"],
    correctIndex: 2,
    explanation:
      "RAID 5 stripes with single parity, surviving one disk failure. RAID 6 has double parity (two-disk failure tolerance).",
    difficulty: "medium",
    tags: ["resilience", "raid"],
  },
  {
    id: "q-secp-a-4",
    examId: "sec-plus",
    topicId: "secp-architecture",
    prompt: "An organization wants to ensure ransomware cannot encrypt or delete its backups. Which backup property addresses this?",
    choices: ["Differential", "Compressed", "Immutable (WORM)", "Incremental"],
    correctIndex: 2,
    explanation:
      "Immutable / WORM (Write Once Read Many) backups can't be modified or deleted within their retention period — defeating ransomware.",
    difficulty: "medium",
    tags: ["resilience", "backups"],
  },
  {
    id: "q-secp-a-5",
    examId: "sec-plus",
    topicId: "secp-architecture",
    prompt: "Which device is a tamper-resistant chip on a motherboard that can store BitLocker disk encryption keys and attest to boot integrity?",
    choices: ["HSM", "TPM", "Secure enclave", "FIPS 140-3 module"],
    correctIndex: 1,
    explanation:
      "TPM lives on the motherboard. HSM is a separate appliance. Secure enclave is a CPU-isolated execution environment (Intel SGX, ARM TrustZone).",
    difficulty: "medium",
    tags: ["hardware"],
  },
  {
    id: "q-secp-a-6",
    examId: "sec-plus",
    topicId: "secp-architecture",
    prompt: "In the IaaS shared-responsibility model, who manages the operating system?",
    choices: ["Cloud provider", "Customer", "Both equally", "Neither — it's automated"],
    correctIndex: 1,
    explanation:
      "In IaaS, the customer manages OS, runtime, and applications. The provider manages virtualization and below. (In PaaS, the provider takes the OS.)",
    difficulty: "easy",
    tags: ["cloud"],
  },

  // ── Operations ─────────────────────────────────────────────────
  {
    id: "q-secp-o-1",
    examId: "sec-plus",
    topicId: "secp-ops",
    prompt: "A vulnerability scanner reports a critical issue, but investigation reveals the system isn't actually vulnerable. What is this called?",
    choices: ["False negative", "False positive", "True positive", "Risk acceptance"],
    correctIndex: 1,
    explanation:
      "False positive = scanner says vuln, but it's safe. False negative = scanner missed a real vuln (more dangerous).",
    difficulty: "easy",
    tags: ["vuln-mgmt"],
  },
  {
    id: "q-secp-o-2",
    examId: "sec-plus",
    topicId: "secp-ops",
    prompt: "Which protocol is XML-based and designed for browser-based single sign-on (SSO)?",
    choices: ["OAuth 2.0", "OIDC", "SAML 2.0", "Kerberos"],
    correctIndex: 2,
    explanation:
      "SAML uses XML for browser-based SSO. OAuth 2.0 (JSON) is delegated authorization; OIDC adds identity on top of OAuth.",
    difficulty: "medium",
    tags: ["federation"],
  },
  {
    id: "q-secp-o-3",
    examId: "sec-plus",
    topicId: "secp-ops",
    prompt: "Which authorization model assigns permissions to roles, and assigns users to those roles?",
    choices: ["DAC", "MAC", "RBAC", "ABAC"],
    correctIndex: 2,
    explanation:
      "RBAC = role-based access control. DAC is owner-discretionary; MAC enforces classification labels; ABAC evaluates attributes per request.",
    difficulty: "easy",
    tags: ["authorization"],
  },
  {
    id: "q-secp-o-4",
    examId: "sec-plus",
    topicId: "secp-ops",
    prompt: "During incident response, which phase comes IMMEDIATELY after Identification?",
    choices: ["Eradication", "Containment", "Recovery", "Lessons Learned"],
    correctIndex: 1,
    explanation:
      "PICERL: Preparation → Identification → Containment → Eradication → Recovery → Lessons Learned. Containment is right after Identification.",
    difficulty: "medium",
    tags: ["incident-response"],
  },
  {
    id: "q-secp-o-5",
    examId: "sec-plus",
    topicId: "secp-ops",
    prompt: "When acquiring forensic evidence from a running system, which artifact should you capture FIRST?",
    choices: ["Hard drive image", "Network packet capture", "Contents of RAM (memory dump)", "Browser history"],
    correctIndex: 2,
    explanation:
      "Order of volatility — most volatile first. RAM is gone the moment you power off; capture it before disk imaging.",
    difficulty: "medium",
    tags: ["forensics"],
  },
  {
    id: "q-secp-o-6",
    examId: "sec-plus",
    topicId: "secp-ops",
    prompt: "Which technology provides a vault for privileged credentials with session recording and just-in-time elevation?",
    choices: ["MFA", "PAM", "DLP", "CASB"],
    correctIndex: 1,
    explanation:
      "PAM (Privileged Access Management) vaults admin credentials, supports JIT elevation, and records privileged sessions.",
    difficulty: "medium",
    tags: ["identity"],
  },
  {
    id: "q-secp-o-7",
    examId: "sec-plus",
    topicId: "secp-ops",
    prompt: "Which authentication factor is something you ARE?",
    choices: ["Password", "Hardware token", "Fingerprint", "Geolocation"],
    correctIndex: 2,
    explanation:
      "Inherence (something you ARE) = biometric. Knowledge = password. Possession = token. Location = geolocation.",
    difficulty: "easy",
    tags: ["mfa"],
  },
  {
    id: "q-secp-o-8",
    examId: "sec-plus",
    topicId: "secp-ops",
    prompt: "A SIEM differs from a SOAR primarily in that:",
    choices: [
      "SIEM stores logs; SOAR automates response workflows.",
      "SIEM works on endpoints; SOAR works on the network.",
      "SIEM is open source; SOAR is commercial.",
      "SIEM is for compliance; SOAR is for performance.",
    ],
    correctIndex: 0,
    explanation:
      "SIEM aggregates logs and correlates events. SOAR orchestrates automated response playbooks (often triggered by SIEM alerts).",
    difficulty: "medium",
    tags: ["monitoring"],
  },

  // ── Program ────────────────────────────────────────────────────
  {
    id: "q-secp-p-1",
    examId: "sec-plus",
    topicId: "secp-program",
    prompt: "A server worth $200,000 has an exposure factor of 30% per incident, with an annualized rate of occurrence of 0.25 (once every 4 years). What is the ALE?",
    choices: ["$15,000", "$60,000", "$50,000", "$30,000"],
    correctIndex: 0,
    explanation:
      "SLE = AV × EF = $200,000 × 0.30 = $60,000. ALE = SLE × ARO = $60,000 × 0.25 = $15,000.",
    difficulty: "hard",
    tags: ["risk-math"],
  },
  {
    id: "q-secp-p-2",
    examId: "sec-plus",
    topicId: "secp-program",
    prompt: "An organization decides to purchase cyber insurance to handle the financial impact of a potential ransomware incident. Which risk treatment is this?",
    choices: ["Accept", "Avoid", "Transfer", "Mitigate"],
    correctIndex: 2,
    explanation:
      "Insurance moves the financial impact to a third party — that's risk transfer. Acceptance does nothing; avoidance eliminates the activity; mitigation reduces likelihood/impact.",
    difficulty: "easy",
    tags: ["risk-treatment"],
  },
  {
    id: "q-secp-p-3",
    examId: "sec-plus",
    topicId: "secp-program",
    prompt: "Which regulation governs the protection of card-holder data for any merchant that processes payment cards?",
    choices: ["HIPAA", "GDPR", "SOX", "PCI DSS"],
    correctIndex: 3,
    explanation:
      "PCI DSS is the contractual security standard for payment card data, required by card brands of any merchant processing cards.",
    difficulty: "easy",
    tags: ["compliance"],
  },
  {
    id: "q-secp-p-4",
    examId: "sec-plus",
    topicId: "secp-program",
    prompt: "Under GDPR, what is the maximum time allowed to notify the supervisory authority of a personal data breach?",
    choices: ["24 hours", "72 hours", "7 days", "30 days"],
    correctIndex: 1,
    explanation:
      "GDPR Article 33 requires notification within 72 hours of becoming aware of a personal data breach.",
    difficulty: "medium",
    tags: ["compliance", "gdpr"],
  },
  {
    id: "q-secp-p-5",
    examId: "sec-plus",
    topicId: "secp-program",
    prompt: "An organization replaces customer email addresses with random tokens but retains a separate mapping table that could be used to re-identify customers. Which technique is this?",
    choices: ["Anonymization", "Pseudonymization", "Encryption", "Tokenization-only"],
    correctIndex: 1,
    explanation:
      "Pseudonymization is reversible because the mapping is retained. Anonymization is irreversible. Pseudonymized data is still considered PII under GDPR.",
    difficulty: "medium",
    tags: ["privacy"],
  },
  {
    id: "q-secp-p-6",
    examId: "sec-plus",
    topicId: "secp-program",
    prompt: "Which type of agreement contains the contractual measurable service commitments (uptime, response time)?",
    choices: ["MOU", "NDA", "SLA", "BPA"],
    correctIndex: 2,
    explanation:
      "SLA = Service Level Agreement, contractual measurable commitments. MOU is non-binding intent; NDA is confidentiality; BPA is general business partnership terms.",
    difficulty: "easy",
    tags: ["agreements"],
  },
];

// ─────────────────────────────────────────────────────────────────
// DIAGNOSTIC SET — 8 questions across all 5 domains
// ─────────────────────────────────────────────────────────────────

export const SEC_PLUS_DIAGNOSTIC = [
  "q-secp-c-1",
  "q-secp-c-6",
  "q-secp-t-2",
  "q-secp-t-4",
  "q-secp-a-3",
  "q-secp-o-2",
  "q-secp-o-5",
  "q-secp-p-1",
];

// ─────────────────────────────────────────────────────────────────
// LESSONS
// ─────────────────────────────────────────────────────────────────

export const SEC_PLUS_LESSONS: Lesson[] = [
  // Concepts
  {
    id: "l-secp-c-1",
    topicId: "secp-concepts",
    order: 1,
    title: "The CIA triad and the AAA framework",
    summary:
      "The single most-tested concept in the entire exam. Master CIA + AAA and you have a mental hook for every other domain.",
    minutes: 4,
    cards: [
      {
        kind: "intro",
        title: "Why this comes first",
        body:
          "Every security control protects one of three properties: Confidentiality, Integrity, Availability. Every access decision involves the AAA framework: Authentication, Authorization, Accounting. Memorize both and you have the vocabulary the entire exam runs on.",
      },
      {
        kind: "concept",
        title: "CIA — what each means and what attacks break each",
        bullets: [
          "Confidentiality — only authorized parties read. Breached by eavesdropping, theft, shoulder surfing.",
          "Integrity — data hasn't been altered. Breached by tampering, MITM, malware.",
          "Availability — service is reachable when needed. Breached by DoS, ransomware, hardware failure.",
        ],
      },
      {
        kind: "concept",
        title: "AAA — the access trio",
        bullets: [
          "Authentication — prove who you are (password, MFA).",
          "Authorization — what you're allowed to do (RBAC, ACLs).",
          "Accounting — log what you did (audit trail).",
        ],
      },
      {
        kind: "tip",
        title: "Non-repudiation",
        body:
          "Non-repudiation = the sender cannot deny sending. Achieved with digital signatures (private key signs, public key verifies). It's a property derived from integrity + authentication.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Every breach maps to C, I, or A. Every access decision involves Authentication, Authorization, Accounting.",
      },
    ],
  },
  {
    id: "l-secp-c-2",
    topicId: "secp-concepts",
    order: 2,
    title: "Control categories vs control types",
    summary:
      "Two attributes every control has. The exam tests both — sometimes in the same question.",
    minutes: 4,
    cards: [
      {
        kind: "comparison",
        title: "Categories — WHERE the control lives",
        bullets: [
          "Technical (logical) — software/hardware: firewalls, MFA, encryption.",
          "Managerial — policies, risk assessments, training programs.",
          "Operational — day-to-day human: change management, incident response.",
          "Physical — locks, badges, fences, cameras, security guards.",
        ],
      },
      {
        kind: "comparison",
        title: "Types — WHAT the control does",
        bullets: [
          "Preventive — stops it (firewall, MFA).",
          "Deterrent — discourages it (warning sign, visible camera).",
          "Detective — alerts when it happens (IDS, log monitor).",
          "Corrective — restores after (backup restore, patch).",
          "Compensating — alternative when primary unavailable.",
          "Directive — guides behavior (policy, AUP).",
        ],
      },
      {
        kind: "example",
        title: "A camera is two things at once",
        body:
          "A visible CCTV camera is BOTH detective (records what happens) AND deterrent (discourages bad behavior). Many controls have multiple purposes. The exam will tell you which to identify.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Categories = where (Tech/Mgr/Ops/Phys). Types = what (Prev/Det/Corr/...). Every control has both attributes.",
      },
    ],
  },
  {
    id: "l-secp-c-3",
    topicId: "secp-concepts",
    order: 3,
    title: "Crypto foundations in 5 minutes",
    summary:
      "Symmetric vs asymmetric, hashing, salting, key stretching, PKI. Just enough to handle the exam questions.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Symmetric vs Asymmetric",
        body:
          "Symmetric = same key encrypts and decrypts (AES, ChaCha20). Fast but key-exchange is the problem. Asymmetric = public/private key pair (RSA, ECC). Slower but solves key exchange.",
      },
      {
        kind: "concept",
        title: "Hashing is one-way",
        body:
          "Hash functions (SHA-256, SHA-3) produce a fixed-size fingerprint. You can't get the original back. Used for password storage and integrity verification.",
      },
      {
        kind: "concept",
        title: "Salt + Key stretch = modern password storage",
        bullets: [
          "Salt — random data added per user before hashing. Defeats rainbow tables.",
          "Key stretching — slow hash function (bcrypt, scrypt, Argon2, PBKDF2). Defeats brute force.",
          "Modern best practice: bcrypt or Argon2 with a per-user salt.",
        ],
      },
      {
        kind: "tip",
        title: "Public vs Private key — directionality",
        body:
          "ENCRYPT for confidentiality: encrypt with the recipient's PUBLIC key (only they can decrypt with their private). SIGN for non-repudiation: sign with sender's PRIVATE key (anyone with their public can verify).",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Symmetric = fast, key-exchange problem. Asymmetric = slow, solves key exchange. Hashing for integrity, salt+stretch for passwords.",
      },
    ],
  },

  // Threats
  {
    id: "l-secp-t-1",
    topicId: "secp-threats",
    order: 1,
    title: "The phishing family",
    summary:
      "Phishing, vishing, smishing, pharming, whaling, BEC. Memorize these cold — they appear in every exam.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "Channel-based variants",
        bullets: [
          "Phishing — email. Generic mass campaign.",
          "Vishing — voice call. Often spoofed caller ID.",
          "Smishing — SMS. 'Package delivery' lures are common.",
          "Pharming — DNS or hosts file redirect to a fake site (no email needed).",
        ],
      },
      {
        kind: "concept",
        title: "Targeting-based variants",
        bullets: [
          "Spear phishing — targeted to a specific person.",
          "Whaling — specifically targets executives.",
          "BEC (Business Email Compromise) — impersonates an exec or vendor to authorize a wire transfer. Highest-loss variant by dollar value.",
          "Watering hole — compromise a site the target frequents.",
          "Typosquatting — register lookalike domains (g00gle.com).",
        ],
      },
      {
        kind: "tip",
        title: "BEC vs Whaling distinction",
        body:
          "Whaling = the TARGET is an executive. BEC = the IMPERSONATOR is an executive or trusted vendor (target may be an A/P clerk).",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Match channel + targeting. Phishing = email/mass. Vishing = voice. Smishing = SMS. BEC = impersonate exec for wire fraud.",
      },
    ],
  },
  {
    id: "l-secp-t-2",
    topicId: "secp-threats",
    order: 2,
    title: "Application attacks and standard mitigations",
    summary:
      "SQLi, XSS, CSRF, buffer overflow, race condition. Each has a textbook mitigation — know both.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "SQL injection",
        body:
          "Unsanitized user input concatenated into SQL queries. Standard mitigation: parameterized queries (a.k.a. prepared statements). WAF and input validation are layers — parameterized queries are the answer.",
      },
      {
        kind: "concept",
        title: "Cross-Site Scripting (XSS)",
        body:
          "Malicious script injected into a page rendered to other users. Three flavors: Reflected (in URL), Stored (saved to DB), DOM-based (client-side). Mitigation: input validation, output encoding, Content Security Policy (CSP).",
      },
      {
        kind: "concept",
        title: "Cross-Site Request Forgery (CSRF)",
        body:
          "Forces an authenticated user's browser to perform an action on a site they're logged into. Mitigation: anti-CSRF tokens and SameSite cookie attribute.",
      },
      {
        kind: "concept",
        title: "Buffer overflow + Race condition",
        bullets: [
          "Buffer overflow — write past allocated memory. Mitigation: bounds checking, ASLR, DEP.",
          "Race condition (TOCTOU) — exploit gap between check and use. Mitigation: atomic operations, locks.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "SQLi → parameterized queries. XSS → output encoding + CSP. CSRF → anti-CSRF tokens. Memorize the mitigation pairs.",
      },
    ],
  },

  // Architecture
  {
    id: "l-secp-a-1",
    topicId: "secp-architecture",
    order: 1,
    title: "Network segmentation and the firewall ladder",
    summary:
      "VLAN → DMZ → microsegmentation. Packet filter → stateful → NGFW → WAF.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Segmentation hierarchy",
        bullets: [
          "VLAN — logical L2 separation; broadcast domain isolation.",
          "Screened subnet (DMZ) — buffer for public-facing services.",
          "Internal segmentation — separate prod/dev, finance/HR.",
          "Microsegmentation — workload-level, SDN-enforced.",
          "Air gap — physically isolated network.",
        ],
      },
      {
        kind: "concept",
        title: "Firewall types",
        table: {
          columns: ["Type", "Layer", "Use"],
          rows: [
            { label: "Packet filter", cells: ["L3/L4", "Stateless 5-tuple"] },
            { label: "Stateful", cells: ["L3/L4", "Tracks connections"] },
            { label: "NGFW", cells: ["L3-L7", "App-aware + IPS"] },
            { label: "WAF", cells: ["L7 HTTP/S", "Web app attacks"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "Where each fits",
        body:
          "Packet filter at edge is rare today. Stateful for general traffic. NGFW at perimeter for app awareness. WAF in front of web apps.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Segmentation isolates blast radius. The right firewall depends on what you're protecting.",
      },
    ],
  },
  {
    id: "l-secp-a-2",
    topicId: "secp-architecture",
    order: 2,
    title: "Resilience — RAID, RPO/RTO, immutable backups",
    summary:
      "Hardware redundancy (RAID), recovery objectives (RPO/RTO), and ransomware-defending backups (immutable).",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "RAID at a glance",
        bullets: [
          "RAID 0 — stripe (no redundancy, performance).",
          "RAID 1 — mirror (full redundancy, slow writes).",
          "RAID 5 — single parity (1-disk failure tolerance).",
          "RAID 6 — double parity (2-disk failure tolerance).",
          "RAID 10 — mirrored stripe (best performance + redundancy, costliest).",
        ],
      },
      {
        kind: "concept",
        title: "Recovery objectives",
        bullets: [
          "RPO (Recovery Point Objective) — max data loss tolerable. Drives backup frequency.",
          "RTO (Recovery Time Objective) — max downtime tolerable. Drives recovery infrastructure.",
        ],
      },
      {
        kind: "tip",
        title: "Ransomware-proof backups",
        body:
          "3-2-1 rule: 3 copies, 2 different media, 1 offsite. Make at least one IMMUTABLE (WORM) so ransomware can't encrypt or delete it.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "RAID for hardware redundancy. RPO/RTO for design targets. Immutable for ransomware defense.",
      },
    ],
  },

  // Operations
  {
    id: "l-secp-o-1",
    topicId: "secp-ops",
    order: 1,
    title: "Identity, MFA, and federation",
    summary:
      "MFA factor types, SAML vs OAuth vs OIDC, RBAC vs ABAC. Identity is the new perimeter.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "MFA factors",
        bullets: [
          "Knowledge — something you KNOW (password).",
          "Possession — something you HAVE (token, phone).",
          "Inherence — something you ARE (biometric).",
          "Behavior — something you DO (typing pattern, mouse movement).",
          "Location — somewhere you ARE (GPS, IP geolocation).",
        ],
      },
      {
        kind: "comparison",
        title: "SAML vs OAuth 2.0 vs OIDC",
        table: {
          columns: ["Protocol", "Purpose", "Format"],
          rows: [
            { label: "SAML 2.0", cells: ["Browser-based SSO", "XML"] },
            { label: "OAuth 2.0", cells: ["Delegated authorization", "JSON / JWT"] },
            { label: "OIDC", cells: ["Identity (auth) on top of OAuth", "JSON / JWT"] },
          ],
        },
      },
      {
        kind: "concept",
        title: "Authorization models",
        bullets: [
          "DAC — owner sets permissions (NTFS).",
          "MAC — system enforces classification labels (no override).",
          "RBAC — permissions tied to roles, users assigned to roles.",
          "ABAC — policy evaluates attributes per request.",
        ],
      },
      {
        kind: "tip",
        title: "Phishing-resistant auth",
        body:
          "FIDO2 / passkeys use cryptographic challenges that can't be replayed or phished. The future of MFA.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Know the MFA factor categories, the federation protocols, and the auth model differences cold.",
      },
    ],
  },
  {
    id: "l-secp-o-2",
    topicId: "secp-ops",
    order: 2,
    title: "Incident response and digital forensics",
    summary:
      "PICERL phases + order of volatility + chain of custody. Don't lose evidence.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Incident response phases (PICERL)",
        bullets: [
          "Preparation — runbooks, contact lists, training.",
          "Identification — confirm an incident actually occurred.",
          "Containment — stop the bleeding (isolate, block).",
          "Eradication — remove root cause (delete malware, patch vuln).",
          "Recovery — restore to normal, monitor for recurrence.",
          "Lessons Learned — post-incident review, update runbooks.",
        ],
      },
      {
        kind: "concept",
        title: "Order of volatility (capture most-volatile first)",
        bullets: [
          "CPU registers / cache",
          "RAM (memory)",
          "Routing table / ARP cache / process tables",
          "Temporary files",
          "Disk (filesystem)",
          "Remote logging / archived",
        ],
      },
      {
        kind: "concept",
        title: "Chain of custody",
        body:
          "Document who handled the evidence, when, where, and why for every event. Without an unbroken chain, the evidence may be inadmissible. Hash the evidence at acquisition and verify before/after every step.",
      },
      {
        kind: "tip",
        title: "Containment vs Eradication",
        body:
          "Containment = isolate the host now. Eradication = remove the malware and the underlying vulnerability. Don't conflate them.",
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "PICERL is the phase order. Most-volatile first. Chain of custody documents every handoff.",
      },
    ],
  },

  // Program
  {
    id: "l-secp-p-1",
    topicId: "secp-program",
    order: 1,
    title: "Risk math — SLE, ARO, ALE",
    summary:
      "The quantitative risk formulas. Memorize the math; it's testable.",
    minutes: 4,
    cards: [
      {
        kind: "concept",
        title: "The formulas",
        bullets: [
          "AV (Asset Value) — what the asset is worth.",
          "EF (Exposure Factor) — % of AV lost per incident.",
          "SLE (Single Loss Expectancy) = AV × EF.",
          "ARO (Annualized Rate of Occurrence) — expected events per year.",
          "ALE (Annualized Loss Expectancy) = SLE × ARO.",
        ],
      },
      {
        kind: "example",
        title: "Worked example",
        body:
          "$200,000 server. EF = 30%. ARO = 0.25 (once every 4 years). SLE = $200,000 × 0.30 = $60,000. ALE = $60,000 × 0.25 = $15,000/year. If a control costs $20K/yr, it doesn't pencil out (you'd be spending more than the expected loss).",
      },
      {
        kind: "concept",
        title: "Risk treatments — the four choices",
        bullets: [
          "Accept — risk is low enough to live with.",
          "Avoid — eliminate the activity that causes the risk.",
          "Transfer — shift to a third party (insurance).",
          "Mitigate — apply controls to reduce likelihood or impact.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "ALE = SLE × ARO. Compare ALE against control cost to justify spend.",
      },
    ],
  },
  {
    id: "l-secp-p-2",
    topicId: "secp-program",
    order: 2,
    title: "Compliance frameworks and privacy",
    summary:
      "PCI / HIPAA / GDPR / SOX — know which framework covers what. Privacy: pseudonymization vs anonymization.",
    minutes: 5,
    cards: [
      {
        kind: "concept",
        title: "Frameworks by industry",
        table: {
          columns: ["Framework", "Industry / Region"],
          rows: [
            { label: "PCI DSS", cells: ["Card payment merchants"] },
            { label: "HIPAA / HITECH", cells: ["US healthcare"] },
            { label: "GDPR", cells: ["EU personal data"] },
            { label: "SOX", cells: ["US public-company financial reporting"] },
            { label: "GLBA", cells: ["US financial services"] },
            { label: "FERPA", cells: ["US education records"] },
            { label: "CMMC", cells: ["US DoD contractors"] },
            { label: "NIST CSF / 800-53", cells: ["US federal info systems (and broadly adopted)"] },
            { label: "ISO 27001", cells: ["International ISMS standard"] },
          ],
        },
      },
      {
        kind: "tip",
        title: "GDPR specifics often tested",
        body:
          "72-hour breach notification to supervisory authority. Right to erasure (Article 17). Data minimization. Lawful basis for processing required.",
      },
      {
        kind: "concept",
        title: "Pseudonymization vs Anonymization",
        bullets: [
          "Pseudonymization — reversible (mapping retained). Still PII under GDPR.",
          "Anonymization — irreversible. Not PII.",
        ],
      },
      {
        kind: "recap",
        title: "Takeaway",
        highlight:
          "Match framework to industry/region. GDPR = EU + 72h. Pseudonymization is reversible; anonymization is not.",
      },
    ],
  },
];
