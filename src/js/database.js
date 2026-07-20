// Knowledge Base Database Manager module
import { STOP_WORDS } from './config.js';

export const DEFAULT_KNOWLEDGE = {
  onboarding: {
    title: "New Joiner Onboarding",
    icon: "briefcase",
    description: "First weeks checklist, portal quick-reference map, mandatory training, and buddy system.",
    articles: [
      {
        id: "onboarding-portals-map",
        title: "Internal Systems & Portals Quick Reference Map",
        keywords: ["portal", "workday", "ask hr", "it service desk", "policy hub", "expense system", "learning hub", "risk event", "system", "login", "access"],
        content: "Amberleigh Private Bank Core Internal Portals:\n• Workday: Request leave, check payslips, update personal details, view org charts, enrol in benefits, track probation.\n• Ask HR: Submit general HR questions to the HR Service Desk.\n• IT Service Desk Portal: Report IT issues, request devices, order hardware, and request building access pass extensions.\n• Policy Hub: Access the HR Policy Handbook, Code of Conduct & Ethics, and business unit policies.\n• Expense System: Submit and track business expense claims within 30 days.\n• Learning Hub: Complete mandatory compliance training (Code of Conduct, AML/CTF, InfoSec).\n• Compliance Advisory Mailbox / Speak-Up Line: Raise compliance concerns or report ethics violations anonymously.\n• Risk Event System: Report and understand risk escalation for an operational incident.",
        lastUpdated: "2026-01-01"
      },
      {
        id: "onboarding-first-week-checklist",
        title: "First Week & Day 1 Checklist for New Joiners",
        keywords: ["first day", "first week", "checklist", "day 1", "welcome email", "buddy", "mfa", "orientation", "pad"],
        content: "Before Day 1: You will receive a Welcome Email 1 week prior with start location, reporting time, and dress code. Pre-employment screening must be finalized. Your IT account and device are provisioned automatically via Workday.\nDay 1: Report to Reception to meet your assigned Buddy or HR Onboarding representative. Collect building access pass, verify right-to-work, and attend New Joiner Orientation.\nFirst Week Checklist:\n1. Complete Day 1 compliance training on Learning Hub within 10 working days.\n2. Set up Multi-Factor Authentication (MFA) for Bank systems.\n3. Meet line manager for 30/60/90-day objectives.\n4. Review HR Policy Handbook and Code of Conduct on Policy Hub.\n5. Enrol in medical/health benefits via Workday within 30 days of start date.\n6. Set up Personal Account Dealing (PAD) profile before trading personal securities.",
        lastUpdated: "2026-01-01"
      },
      {
        id: "onboarding-buddy-probation",
        title: "Buddy System, Line Manager, and Probation Milestones",
        keywords: ["buddy", "manager", "probation", "6 months", "review", "check-in", "milestones", "90 days"],
        content: "Buddy & Manager: Every new joiner is assigned a Buddy (an experienced colleague outside your reporting line for informal questions) and a Line Manager (responsible for formal onboarding, objectives, and probation reviews). Check Workday Inbox or Ask HR for your assigned Buddy.\nProbation Period: Permanent employees serve a 6-month probation period; fixed-term contracts serve 3 months.\nFirst 90 Days Milestones:\n• Day 10: Complete all mandatory training on Learning Hub.\n• Day 30: Benefits enrolment deadline in Workday & initial objectives agreed with manager.\n• Week 4-6: First informal check-in with line manager.\n• Month 3: Mid-probation review with Line Manager & HR.",
        lastUpdated: "2026-01-01"
      }
    ]
  },
  hr_policies: {
    title: "HR Policy & Employment Terms",
    icon: "user-check",
    description: "HR-POL-001: Leave entitlements, working hours, performance ratings, notice periods, and HR escalation matrix.",
    articles: [
      {
        id: "employment-terms-notice-working-hours",
        title: "Employment Classifications, Notice Periods & Working Hours",
        keywords: ["notice period", "working hours", "full time", "part time", "fixed term", "hybrid", "remote work", "probation"],
        content: "Employment Classifications & Notice Periods:\n• Permanent Full Time / Part Time: 6 months probation | 3 months notice period.\n• Fixed-Term Contract (6-24 mos): 3 months probation | 1 month notice period.\n• Graduate / Intern: N/A probation | 2 weeks notice period.\nWorking Hours & Hybrid Policy:\n• Standard working week is 40 hours (9:00 - 17:30, Mon-Fri).\n• Hybrid Working: Minimum 3 days per week in the office. Permanent remote work outside country of employment requires HR, Legal, and Tax sign-off.\nOvertime: Non-exempt staff must record overtime in timesheets with prior manager approval.",
        lastUpdated: "2026-01-01"
      },
      {
        id: "leave-entitlements-schedule",
        title: "Leave Entitlements & Carry-Over Rules",
        keywords: ["vacation", "annual leave", "sick leave", "maternity", "paternity", "parental leave", "sabbatical", "study leave", "compassionate"],
        content: "Leave Entitlements (Requested via Workday):\n• Annual Leave: 25 working days per calendar year. Carry-over max 5 days into Q1 of following year.\n• Sick Leave: Up to 20 days on full pay per rolling 12 months. Self-certify up to 3 days; medical certificate required beyond.\n• Primary Carer Parental Leave: 16 weeks paid + statutory entitlement.\n• Secondary Carer Parental Leave: 4 weeks paid.\n• Compassionate Leave: Up to 5 days paid per event.\n• Study Leave: Up to 5 days paid (subject to L&D approval).\n• Sabbatical: Unpaid 1-6 months (minimum 3 years service required).",
        lastUpdated: "2026-01-01"
      },
      {
        id: "performance-management-grievance",
        title: "Performance Rating Scale, Grievance & Disciplinary Matrix",
        keywords: ["performance", "rating", "pip", "grievance", "disciplinary", "escalation matrix", "response time", "payroll"],
        content: "Performance Ratings (Workday Talent):\n• Exceptional: Consistently exceeds expectations.\n• Strong: Meets and frequently exceeds expectations.\n• Solid: Meets expectations.\n• Development Needed: Meets some expectations; formal development plan required.\n• Unsatisfactory: Managed via Performance Improvement Plan (PIP).\nGrievances & Escalation Response Times:\n• Payroll discrepancy: Ask HR Service Desk (2 working days)\n• Leave balance query: Workday / Ask HR (1 working day)\n• Benefits enrolment: Benefits Team via HR Hub (3 working days)\n• Formal Grievance: HR Advisory via Grievance Portal (3 working days to acknowledge)\n• Harassment / Discrimination: Speak-Up Line or HR Advisory (24 hours to acknowledge)",
        lastUpdated: "2026-01-01"
      }
    ]
  },
  expenses_travel: {
    title: "Expense & Travel Policy",
    icon: "credit-card",
    description: "FIN-POL-008: Business expense standards, air/rail travel entitlements, approval thresholds, and meal caps.",
    articles: [
      {
        id: "expense-approval-thresholds",
        title: "Expense Approval Thresholds & General Principles",
        keywords: ["expense", "approval", "threshold", "receipt", "claim", "limit", "finance director", "30 days"],
        content: "General Principles:\n• Claims must be submitted in the Expense system within 30 days of incurring the cost. Claims past 90 days require Finance Director approval and may be treated as taxable income.\n• Itemised original receipts are required for all expenses over GBP 25 (card statements are insufficient).\n• Claims must never be split into smaller amounts to circumvent approval limits.\nApproval Thresholds:\n• Up to GBP 500: Line Manager approval.\n• GBP 500 - GBP 2,500: Line Manager + Department Head approval.\n• Above GBP 2,500: Department Head + Finance Business Partner approval.\n• Client Entertainment > GBP 500/head: Department Head + Compliance (Gifts & Hospitality Register).",
        lastUpdated: "2026-01-01"
      },
      {
        id: "travel-booking-entitlements",
        title: "Air Travel, Rail, Hotel, and Ground Transport Policy",
        keywords: ["travel", "flight", "air travel", "economy", "business class", "hotel", "rail", "taxi", "tmc", "mileage"],
        content: "Travel Booking: All travel must be booked through the Travel Management Company (TMC) portal.\nFlight Entitlements:\n• Flights under 6 hours: Economy Class.\n• Flights 6 - 9 hours: Premium Economy Class.\n• Flights over 9 hours: Business Class.\n• Managing Director (MD) and above: Business Class for any flight duration.\nRail & Ground Transport: Standard Class rail is default (First Class allowed if journey exceeds 3 hours or for confidential work with manager approval). Taxis/ride-hailing reimbursable outside public transport hours or with heavy client materials.\nHotel Accommodation: Booked via TMC portal subject to city nightly rate caps.\nMileage Rates: GBP 0.45 per mile for the first 10,000 miles in a tax year; GBP 0.25 per mile thereafter. Commuting is not reimbursable.",
        lastUpdated: "2026-01-01"
      },
      {
        id: "meals-entertainment-nonreimbursable",
        title: "Daily Meal Caps, Client Entertainment, and Non-Reimbursable Items",
        keywords: ["meals", "breakfast", "lunch", "dinner", "entertainment", "non-reimbursable", "corporate card", "daily cap"],
        content: "Daily Meal Caps (per person, inclusive of tax/service, exclusive of alcohol):\n• Breakfast: Domestic GBP 15 | International GBP 20\n• Lunch: Domestic GBP 20 | International GBP 30\n• Dinner: Domestic GBP 40 | International GBP 60\nClient Entertainment: Must have genuine business purpose. Claims must log names, organisations of attendees, and meeting purpose.\nNon-Reimbursable Items:\n• Mini-bar, in-room movies, personal entertainment.\n• Traffic fines, parking fines, penalty fares.\n• Travel insurance for personal trip extensions.\n• Spa, gym, or wellness billed to hotel room.\n• Unapproved First Class flights or family member expenses.\nCorporate Card: Must be used exclusively for business expenses. Statements reconciled monthly in Expense system.",
        lastUpdated: "2026-01-01"
      },
      {
        id: "expense-faqs",
        title: "Expense & Travel FAQs",
        keywords: ["expense faq", "lost receipt", "working lunch", "delayed flight", "loyalty points"],
        content: "Expense & Travel FAQs:\n• Lost receipt: A signed Missing Receipt Declaration can be used for claims under GBP 25. Above GBP 25 requires approver discretion with Finance sign-off.\n• Working lunch with colleague: Internal working meals are NOT reimbursable except during approved offsite events.\n• Delayed flight extra costs: Reasonable additional costs directly caused by flight delays are reimbursable; keep documentation.\n• Loyalty points: Personal loyalty points from business travel may be retained, provided booking choices do not increase cost to the Bank.",
        lastUpdated: "2026-01-01"
      }
    ]
  },
  medical_health: {
    title: "Medical & Health Benefits",
    icon: "shield",
    description: "HR-POL-006: Health insurance plan tiers, dental & vision cover, sick pay schedule, and EAP support.",
    articles: [
      {
        id: "medical-plan-tiers",
        title: "Medical Insurance Tiers, Deductibles, and Enrolment",
        keywords: ["medical", "health insurance", "tiers", "essential", "standard", "premium", "deductible", "out of pocket", "enrolment"],
        content: "Eligibility & Enrolment: Permanent employees eligible from date of hire; fixed-term contractors (6+ months) eligible from 2nd month. Enrol during November Annual Enrolment or within 30 days of a qualifying life event in Workday Benefits module.\nPlan Tiers:\n1. Essential Tier: 0% employee contribution (100% Bank-funded). Deductible: GBP 500 individual / GBP 1,000 family. Max out-of-pocket: GBP 2,500.\n2. Standard Tier: 15% employee contribution. Deductible: GBP 250 individual / GBP 500 family. Max out-of-pocket: GBP 1,500.\n3. Premium Tier: 30% employee contribution. Deductible: GBP 0. Max out-of-pocket: GBP 750 (includes single-room hospitalisation & expanded international network).\nCoverage: All tiers include hospitalisation, outpatient, prescription drugs, maternity care, and mental health. Pre-existing conditions are covered from Day 1.",
        lastUpdated: "2026-01-01"
      },
      {
        id: "eap-occupational-health-wellbeing",
        title: "Employee Assistance Programme (EAP) & Sick Leave Pay Schedule",
        keywords: ["eap", "counselling", "sick leave", "sick pay", "occupational health", "mental health", "long term absence"],
        content: "Employee Assistance Programme (EAP):\n• Free 24/7 confidential phone and web portal access for employees and household members.\n• Up to 8 confidential counselling sessions per issue per year (mental health, family, legal, financial). Usage is completely anonymous and not shared with managers.\nSick Leave & Absence Pay Schedule:\n• Absences >3 days require a medical certificate; notify manager before start time in Workday.\n• Weeks 1 - 4: Full Pay\n• Weeks 5 - 12: Full Pay (subject to Occupational Health engagement)\n• Weeks 13 - 26: Half Pay (topped up by statutory/insured benefit)\n• Beyond 26 weeks: Statutory pay / Income Protection Insurance.",
        lastUpdated: "2026-01-01"
      },
      {
        id: "dental-vision-parental-support",
        title: "Dental, Vision, Health Screenings, and Fertility Cover",
        keywords: ["dental", "vision", "health screening", "flu vaccine", "fertility", "parental", "retirees"],
        content: "Dental & Vision Add-Ons (Selectable during Annual Enrolment):\n• Dental Cover (GBP 12/month): 2 free check-ups/year; 50% co-pay on restorative work up to GBP 1,000/year.\n• Vision Cover (GBP 6/month): Free annual eye test; GBP 150 allowance toward glasses or lenses.\nHealth Screenings & Flu Shots: Free annual preventive screening for Standard/Premium tiers; subsidised autumn flu shots on-site for all tiers.\nParental & Fertility Support: Standard and Premium tiers include up to GBP 5,000 lifetime allowance toward fertility treatment and adoption costs, plus returner coaching.\nLeavers & Retirees: Cover continuation up to 3 months via COBRA-equivalent option. Retirees (10+ years service at retirement age) eligible for Retiree Medical Plan.",
        lastUpdated: "2026-01-01"
      }
    ]
  },
  infosec_privacy: {
    title: "Information Security & Data Privacy",
    icon: "lock",
    description: "ISEC-POL-005: Data classification, password standards, MFA, GDPR privacy principles, and security incident reporting.",
    articles: [
      {
        id: "data-classification-handling",
        title: "Data Classification Tiers & Handling Standards",
        keywords: ["infosec", "classification", "public", "internal", "confidential", "restricted", "mnpi", "encryption", "dlp"],
        content: "Data Classification Tiers:\n1. Public: Approved for external release (press releases, public rates).\n2. Internal: For internal Bank use only (memos, org charts). No external distribution.\n3. Confidential: Sensitive business data (client portfolios, deal terms). Minimum control: Encryption at rest and in transit, access logging.\n4. Restricted: Highest sensitivity (client identity documents, MNPI, credentials). Minimum control: Encryption, need-to-know access, DLP monitoring.\nAccess Management: Granted strictly on need-to-know basis via IAM. Access reviewed quarterly (UAR). Revoked within 24 hours of exit (immediately for involuntary termination).",
        lastUpdated: "2026-01-01"
      },
      {
        id: "password-authentication-standards",
        title: "Password Standards, MFA & Remote Access Controls",
        keywords: ["password", "mfa", "lockout", "session timeout", "authentication", "remote access", "byod", "vpn"],
        content: "Password & Authentication Controls:\n• Minimum Password Length: 14 characters.\n• Multi-Factor Authentication (MFA): Mandatory for all remote access and privileged (admin) accounts.\n• Password History: Last 12 passwords cannot be reused.\n• Account Lockout: Locked after 5 failed attempts within 15 minutes.\n• Session Timeout: 15 minutes of inactivity for systems handling Confidential or Restricted data.\nAcceptable Use & Remote Work: Use Bank devices for business. Personal email or unsanctioned cloud storage (personal Dropbox/Gmail) to store/send Restricted data is strictly prohibited. Remote workers must connect via approved VPN / Zero Trust and lock screens when unattended.",
        lastUpdated: "2026-01-01"
      },
      {
        id: "privacy-gdpr-incident-reporting",
        title: "Data Privacy Rights (GDPR) & SOC Incident Reporting",
        keywords: ["gdpr", "privacy", "data subject rights", "soc", "incident", "phishing", "breach", "lost device", "hotline"],
        content: "Data Privacy Principles (GDPR):\n• Processing must follow lawfulness, purpose limitation, data minimisation, accuracy, storage limitation, and integrity.\n• Data Subject Rights: Any request (access, rectification, erasure) must be forwarded to the Data Privacy Office within 24 hours.\nSecurity Incident Reporting (Report to Security Operations Centre / SOC 24/7 Hotline):\n• Suspected Phishing / Malware: Report immediately to SOC.\n• Lost or Stolen Device: Report within 1 hour to SOC + IT Service Desk for remote wipe.\n• Confirmed Personal Data Breach: Report immediately to Data Privacy Office + SOC + MLRO.\n• Unauthorised Restricted Access: Report immediately to SOC + Data Owner.\nNote: Do NOT use unapproved AI tools or browser extensions for Confidential/Restricted data.",
        lastUpdated: "2026-01-01"
      }
    ]
  },
  compliance_aml: {
    title: "Compliance & AML / KYC",
    icon: "shield-alert",
    description: "COMP-POL-003: Client Due Diligence (CDD), risk ratings, Enhanced Due Diligence (EDD), SARs, and sanctions.",
    articles: [
      {
        id: "cdd-risk-ratings-review",
        title: "Client Due Diligence (CDD) Risk Ratings & Review Frequency",
        keywords: ["aml", "kyc", "cdd", "risk rating", "pep", "politically exposed person", "low risk", "high risk", "review frequency"],
        content: "Client Due Diligence (CDD) Review Schedule:\n• Low Risk Clients: Review every 5 years (Approval: Relationship Manager + KYC Analyst).\n• Standard Risk Clients: Review every 3 years (Approval: Relationship Manager + Team Head).\n• High Risk Clients: Review annually (Approval: Team Head + Compliance / MLRO delegate).\n• Politically Exposed Persons (PEPs): Review annually (Approval: Senior Management + MLRO).\n• Prohibited / Restricted: Relationships strictly not permitted.\nEnhanced Due Diligence (EDD): Mandatory for High Risk, PEPs, Higher-Risk Country List jurisdictions, and complex trust/foundation structures. Requires verified source of wealth/funds documentary evidence and senior management approval prior to onboarding.",
        lastUpdated: "2026-01-01"
      },
      {
        id: "kyc-docs-sar-sanctions",
        title: "KYC Documentation, Transaction Monitoring, SARs & Sanctions",
        keywords: ["kyc docs", "proof of address", "sar", "suspicious activity", "tipping off", "sanctions", "record retention", "5 years"],
        content: "Required KYC Documentation:\n• Certified ID for all account holders, beneficial owners (25%+), and authorised signatories.\n• Proof of address dated within the last 3 months.\n• Legal entities: Certificate of incorporation, register of directors/shareholders, tax self-certification (CRS/FATCA).\nSuspicious Activity Reports (SARs) & Tipping Off:\n• Unusual activity must be reported via an internal SAR in the Compliance Case Management tool without delay.\n• Tipping Off: Informing a client or third party that a SAR was filed is a criminal offence.\nSanctions & Record Retention:\n• Real-time screening of all payment transactions. Escalation of matches to Sanctions team.\n• Record Retention: KYC, transaction, and SAR filings must be retained for a minimum of 5 years post-relationship.",
        lastUpdated: "2026-01-01"
      }
    ]
  },
  code_of_conduct: {
    title: "Code of Conduct & Ethics",
    icon: "award",
    description: "COMP-POL-002: Core ethics, gifts & hospitality thresholds, Personal Account Dealing (PAD), and Whistleblowing.",
    articles: [
      {
        id: "gifts-hospitality-thresholds",
        title: "Gifts & Entertainment Disclosure and Pre-Approval Thresholds",
        keywords: ["gifts", "hospitality", "entertainment", "threshold", "pre-approval", "public official", "disclosure", "conflicts"],
        content: "Core Principles: Integrity, Client Interest, Market Conduct, Confidentiality, Accountability.\nGifts & Hospitality Disclosure & Approval Thresholds:\n• Gift received from client/vendor: Disclosure > GBP 50 | Pre-Approval > GBP 150.\n• Entertainment received (meals/events): Disclosure > GBP 100 | Pre-Approval > GBP 300.\n• Gift or entertainment given to client: Disclosure > GBP 100 | Pre-Approval > GBP 500.\n• Gifts to/from Public Officials: Disclosure ANY value | Pre-Approval MANDATORY for any value.\nNote: Cash or cash equivalent gifts are strictly prohibited. Log all gifts in the Gifts & Hospitality Register on Policy Hub.",
        lastUpdated: "2026-01-01"
      },
      {
        id: "pad-whistleblowing-outside-interests",
        title: "Personal Account Dealing (PAD), Outside Interests & Whistleblowing",
        keywords: ["pad", "personal account dealing", "insider trading", "mnpi", "whistleblowing", "speak up", "outside business", "relationship"],
        content: "Personal Account Dealing (PAD):\n• All personal securities trades must be pre-cleared in the PAD module.\n• Minimum holding period: 30 calendar days. No trading while in possession of MNPI or on Restricted/Insider lists.\nOutside Business Interests & Relationships:\n• External directorships, trusteeships, or family business roles require prior approval from Manager & Compliance in Workday.\n• Personal relationships with colleagues affecting reporting/appraisal lines must be declared to HR.\nSpeak-Up (Whistleblowing) Line:\n• Report misconduct or policy breaches via Line Manager, HR, Compliance Mailbox, or the 24/7 confidential/anonymous Speak-Up Line. Retaliation is strictly prohibited.",
        lastUpdated: "2026-01-01"
      }
    ]
  },
  careers: {
    title: "Careers & Talent",
    icon: "user-check",
    description: "Global job opportunities, Graduate Programmes, and engineering hubs.",
    articles: [
      {
        id: "graduate-program-2026",
        title: "Global Graduate Programme 2026 Applications",
        keywords: ["graduate", "internship", "analyst", "student", "apply", "careers", "jobs", "hiring"],
        content: "Applications are open for the Amberleigh Private Bank Global Graduate Programme 2026. Training, mentorship, and analyst opportunities exist across Corporate Bank, Investment Advisory, Private Wealth Management, Technology, and Risk. Apply online at amberleigh.com/careers.",
        lastUpdated: "2026-07-01"
      },
      {
        id: "technology-roles",
        title: "Technology & Software Engineering Hubs",
        keywords: ["technology", "it jobs", "software engineer", "developer", "cloud", "ai", "pune", "frankfurt", "london"],
        content: "Amberleigh Private Bank continues to hire software engineers, data scientists, cloud architects, and cyber security specialists across global tech centers in Frankfurt, London, New York, Pune, and Bucharest.",
        lastUpdated: "2026-06-15"
      }
    ]
  },
  investor_relations: {
    title: "Investor Relations & Financials",
    icon: "trending-up",
    description: "Financial performance, quarterly earnings, dividend policy, and shareholder disclosures.",
    articles: [
      {
        id: "q1-results-2026",
        title: "Q1 2026 Financial Results: Record Profit of €2.2 Billion",
        keywords: ["q1", "earnings", "profit", "results", "net income", "financial performance", "revenue"],
        content: "Amberleigh Private Bank reported record financial results for Q1 2026 with post-tax profit rising 8% year-on-year to a quarterly record of €2.2 billion on net revenues of €8.7 billion. CET1 capital ratio was 13.8%.",
        lastUpdated: "2026-04-29"
      },
      {
        id: "financial-calendar",
        title: "Investor Relations Calendar 2026",
        keywords: ["calendar", "dates", "agm", "earnings release", "q2 results"],
        content: "Key IR Calendar Dates: July 29, 2026 - Q2 2026 Results Release; October 28, 2026 - Q3 2026 Results Release. Reports and webcasts are available at investor-relations.amberleigh.com.",
        lastUpdated: "2026-07-01"
      }
    ]
  },
  contact: {
    title: "Contact Directories",
    icon: "mail",
    description: "Global headquarters, HR helplines, IT support desk, and emergency lines.",
    articles: [
      {
        id: "corporate-headquarters",
        title: "Amberleigh Private Bank Group Headquarters & Emergency Hotlines",
        keywords: ["headquarters", "address", "frankfurt", "germany", "phone number", "main office", "emergency"],
        content: "Group Headquarters: Amberleigh Private Bank AG, Taunusanlage 12, 60325 Frankfurt am Main, Germany. Telephone: +49 69 910-00. Email: press@amberleigh.com (Press) or ir@amberleigh.com (Investor Relations).\nInternal Helplines:\n• Ask HR Service Desk: Workday / HR Hub\n• IT Service Desk Hotline: 24/7 internal IT hotline\n• Card Blocking Line: +49 1805 021 021 (available 24/7 for lost/stolen cards)\n• EAP Confidential Line: 24/7 hotline via HR Hub.\n• Security Operations Centre (SOC) 24/7 Hotline: Report security incidents / lost devices.",
        lastUpdated: "2026-01-01"
      }
    ]
  }
};

const STORAGE_KEY = 'amberleigh_chatbot_knowledge_base_v2';
let backupInMemoryKnowledge = null;

export const KnowledgeBase = {
  // Load policy database directly from live backend JSON files in /data directory
  loadFromBackend: async function() {
    const jsonFiles = [
      'data/onboarding_guide.json',
      'data/expense_travel_policy.json',
      'data/medical_health_benefits.json',
      'data/infosec_data_privacy.json',
      'data/compliance_aml_kyc.json',
      'data/code_of_conduct_ethics.json',
      'data/hr_policy_handbook.json',
      'data/corporate_overview.json'
    ];
    
    let backendData = {};
    
    for (const filePath of jsonFiles) {
      try {
        const response = await fetch(filePath + '?v=' + Date.now());
        if (response.ok) {
          const json = await response.json();
          if (json.sectionKey) {
            backendData[json.sectionKey] = json;
          } else if (json.sections) {
            Object.assign(backendData, json.sections);
          }
        }
      } catch (err) {
        // Fallback silently if running locally without HTTP server
      }
    }
    
    if (Object.keys(backendData).length > 0) {
      console.log("Loaded policy database live from backend JSON files:", Object.keys(backendData));
      backupInMemoryKnowledge = backendData;
      this.save(backendData);
      return backendData;
    }
    return this.get();
  },

  get: function() {
    if (backupInMemoryKnowledge) {
      return backupInMemoryKnowledge;
    }
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.expenses_travel && parsed.infosec_privacy && parsed.code_of_conduct && parsed.onboarding) {
          backupInMemoryKnowledge = parsed;
          return backupInMemoryKnowledge;
        }
      }
    } catch (e) {
      console.warn("localStorage read blocked. Using default/in-memory database.", e);
    }
    
    // Store defaults
    const defaults = JSON.parse(JSON.stringify(DEFAULT_KNOWLEDGE));
    this.save(defaults);
    return defaults;
  },

  save: function(data) {
    backupInMemoryKnowledge = data;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return true;
    } catch (e) {
      console.warn("localStorage write blocked. Changes saved in memory only.", e);
      return false;
    }
  },

  reset: function() {
    const defaults = JSON.parse(JSON.stringify(DEFAULT_KNOWLEDGE));
    this.save(defaults);
    return defaults;
  },

  saveArticle: function(sectionKey, article) {
    const data = this.get();
    if (!data[sectionKey]) {
      data[sectionKey] = {
        title: sectionKey.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        icon: "file-text",
        description: `Custom department for ${sectionKey}`,
        articles: []
      };
    }

    const articles = data[sectionKey].articles;
    const existingIndex = articles.findIndex(a => a.id === article.id);

    if (existingIndex > -1) {
      articles[existingIndex] = { ...articles[existingIndex], ...article, lastUpdated: new Date().toISOString().split('T')[0] };
    } else {
      articles.push({
        ...article,
        id: article.id || `art-${Date.now()}`,
        lastUpdated: new Date().toISOString().split('T')[0]
      });
    }

    this.save(data);
    return data;
  },

  deleteArticle: function(sectionKey, articleId) {
    const data = this.get();
    if (data[sectionKey]) {
      data[sectionKey].articles = data[sectionKey].articles.filter(a => a.id !== articleId);
      this.save(data);
    }
    return data;
  },

  addSection: function(sectionKey, title, icon, description) {
    const data = this.get();
    if (!data[sectionKey]) {
      data[sectionKey] = {
        title: title,
        icon: icon || "file-text",
        description: description || `Corporate section for ${title}`,
        articles: []
      };
      this.save(data);
    }
    return data;
  },

  deleteSection: function(sectionKey) {
    const data = this.get();
    if (data[sectionKey]) {
      delete data[sectionKey];
      this.save(data);
    }
    return data;
  }
};

// RAG search engine matching logic
export function searchKnowledgeBase(kbData, query) {
  const cleanTokens = query
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(token => token.length > 0 && !STOP_WORDS.has(token));
    
  if (cleanTokens.length === 0) return null;
  
  let bestMatch = null;
  let highestScore = 0;
  
  Object.keys(kbData).forEach(sectionKey => {
    const section = kbData[sectionKey];
    if (!section.articles) return;
    
    section.articles.forEach(article => {
      let score = 0;
      const titleLower = article.title.toLowerCase();
      const contentLower = article.content.toLowerCase();
      const titleWords = titleLower.split(/\s+/);
      const contentWords = contentLower.split(/\s+/);
      
      cleanTokens.forEach(token => {
        const isShort = token.length < 4;
        
        if (isShort ? titleWords.includes(token) : titleLower.includes(token)) {
          score += 15;
        }
        
        if (article.keywords && article.keywords.some(kw => isShort ? kw === token : kw.includes(token))) {
          score += 20;
        }
        
        if (isShort ? contentWords.includes(token) : contentLower.includes(token)) {
          score += 5;
        }
      });
      
      const cleanQuery = query.toLowerCase().replace(/[^\w\s]/g, '');
      if (titleLower.includes(cleanQuery)) score += 40;
      if (contentLower.includes(cleanQuery)) score += 30;
      
      if (score > highestScore && score >= 5) {
        highestScore = score;
        bestMatch = {
          content: article.content,
          source: {
            sectionKey: sectionKey,
            sectionTitle: section.title,
            articleTitle: article.title
          }
        };
      }
    });
  });
  
  return bestMatch;
}
