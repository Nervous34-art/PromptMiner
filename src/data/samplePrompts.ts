import { AnalysisResult, SamplePreset } from '../types';

export const SAMPLE_PRESETS: SamplePreset[] = [
  {
    id: 'saas_marketer',
    label: 'SaaS Founder & Marketer',
    description: '12 prompts regarding churn analysis, cold email workflows, and onboarding friction.',
    prompts: [
      'Write a Python script that pulls cancellation feedback from Stripe and categorizes reasons into UI, price, or missing features.',
      'Help me draft a 3-part re-engagement email sequence for users who signed up 7 days ago but never invited a team member.',
      'How can I calculate net revenue retention (NRR) in Postgres given subscriptions and invoice tables?',
      'Critique this landing page copy for a B2B SaaS tool that monitors PostgreSQL query bottlenecks.',
      'Generate 10 programmatic SEO title tag formulas for comparing developer tooling alternatives.',
      'I need an automated workflow that pings our customer success Slack channel whenever a user drops below 3 active days a week.',
      'Rewrite these onboarding survey questions to increase completion rate without losing demographic clarity.',
      'Write an SQL query to find cohorts with highest upgrade rate from Free tier to Pro tier within 30 days.',
      'Draft a polite email asking enterprise customers for a 15-minute product feedback interview offering a $50 gift card.',
      'Summarize common complaints about customer onboarding in product-led growth (PLG) software.',
      'Create an Excel formula or Python snippet to compute customer lifetime value with variable churn rates.',
      'How to set up webhook alerts when payment fails twice in Stripe so we can trigger a dunning email sequence?',
    ],
  },
  {
    id: 'developer_freelancer',
    label: 'Full-Stack Freelancer',
    description: '10 prompts solving client invoicing, API rate limits, and deployment boilerplate.',
    prompts: [
      'Write a Node.js script using Puppeteer to generate clean PDF invoices from JSON order objects.',
      'How do I implement Redis token bucket rate limiting on an Express REST API endpoint with per-IP and per-API-key quotas?',
      'Create a reusable docker-compose.yml file with PostgreSQL 16, Redis 7, and MinIO for local S3 simulation.',
      'Draft a freelance web development statement of work (SOW) template protecting against scope creep in change requests.',
      'Write a bash script to backup remote Postgres database every night at 2 AM and upload encrypted tarball to Cloudflare R2.',
      'How to handle Stripe Connect payout schedules and 1099 compliance for a marketplace client project?',
      'Build a lightweight status page component in React and Tailwind that polls healthcheck endpoints every 60 seconds.',
      'Write an OpenAPI 3.0 spec for a multi-tenant client project management API.',
      'Generate a standardized client kickoff questionnaire to collect API credentials, DNS access, and brand assets securely.',
      'Create an automated script that audits npm packages for licenses incompatible with commercial proprietary client delivery.',
    ],
  },
  {
    id: 'creator_researcher',
    label: 'Content Creator & Researcher',
    description: '9 prompts dealing with video transcripts, newsletter repurposing, and citation workflows.',
    prompts: [
      'Extract the key 5 mental models from this 45-minute YouTube interview transcript and turn each into a Twitter/X hook.',
      'Write a Python script using ffmpeg and Whisper to automatically generate subtitle SRT files with word-level timestamps.',
      'Summarize this 30-page PDF on transformer attention mechanisms into 3 core takeaways suitable for a weekly newsletter.',
      'Help me structure a Notion database schema for tracking newsletter sponsors, CPM rates, and ad copy deadlines.',
      'Convert this deep-dive blog post into an engaging 8-slide carousel script for LinkedIn.',
      'How can I auto-sync highlights from Readwise or Kindle directly into Markdown files formatted for Obsidian?',
      'Draft a sponsor media kit one-pager highlighting 45,000 monthly active subscribers with 48% open rates.',
      'Write a regex to find all academic citations in APA format in this raw text and format them as Markdown links.',
      'Generate a 30-day editorial calendar covering AI agent architecture for senior engineering managers.',
    ],
  },
];

export const DEMO_ANALYSIS_RESULT: AnalysisResult = {
  summary:
    'The analyzed prompt history demonstrates heavy concentration around customer lifecycle automation, churn telemetry, and recurring dunning workflows. The user consistently seeks programmatic methods to bridge Stripe event telemetry with customer communication channels (Slack, automated email sequences, and survey feedback). There is an acute unmet need for an opinionated, developer-friendly customer retention hub tailored for early-stage B2B SaaS builders who lack enterprise customer success tooling.',
  clusters: [
    {
      name: 'Churn Analytics & Subscription Telemetry',
      frequency: 5,
      painPoint:
        'Founders manually query relational databases and export Stripe logs to understand why customers leave and calculate NRR/LTV.',
      evidence: [
        'Write a Python script that pulls cancellation feedback from Stripe and categorizes reasons',
        'How can I calculate net revenue retention (NRR) in Postgres given subscriptions and invoice tables?',
        'Write an SQL query to find cohorts with highest upgrade rate from Free tier to Pro tier',
      ],
    },
    {
      name: 'Automated Lifecycle & Re-Engagement Sequences',
      frequency: 4,
      painPoint:
        'Struggling to trigger timely behavioral nudges (e.g. stalled onboarding, team invite drops) without installing heavy enterprise CDPs.',
      evidence: [
        'Help me draft a 3-part re-engagement email sequence for users who signed up 7 days ago but never invited a team member',
        'I need an automated workflow that pings our customer success Slack channel whenever a user drops below 3 active days',
        'How to set up webhook alerts when payment fails twice in Stripe so we can trigger a dunning email sequence?',
      ],
    },
    {
      name: 'Customer Feedback & Onboarding Optimization',
      frequency: 3,
      painPoint:
        'Difficulty collecting clean feedback from cancelling or inactive users without sounding overly corporate or spammy.',
      evidence: [
        'Rewrite these onboarding survey questions to increase completion rate without losing demographic clarity',
        'Draft a polite email asking enterprise customers for a 15-minute product feedback interview offering a $50 gift card',
      ],
    },
  ],
  ideas: [
    {
      title: 'DunnFlow: Autonomous Dunning & Churn Diagnostic Agent',
      oneLiner: 'Plug-and-play Stripe webhook listener that catches payment failures and churn signals to run smart retention micro-campaigns.',
      problem:
        'Early-stage SaaS founders lose 4-9% of MRR every month to failed credit cards and silent user disengagement, but tools like ProfitWell or ChurnZero are either discontinued, expensive, or enterprise-bloated.',
      targetUser: 'Bootstrapped and Seed-stage B2B SaaS founders & indie hackers with 50-1,000 paid subscribers.',
      mvpFeatures: [
        '1-Click Stripe Connect integration with instant historical churn audit',
        'Configurable smart dunning sequence with dynamic payment recovery links',
        'In-app cancellation exit intent modal that logs categorical reasons to Postgres/Slack',
        'Weekly executive digest summarizing Recovered MRR, At-Risk Accounts, and Churn Causes',
      ],
      monetization: '$49/month flat fee + 1% recovered revenue guarantee, with 14-day free trial.',
      difficulty: 'Medium',
      scores: {
        frequency: 92,
        willingnessToPay: 94,
        feasibility: 88,
        competition: 82,
        overall: 89,
      },
      whyItFits:
        'Directly addresses 70% of the recurring prompts regarding Stripe event processing, failed charge notifications, and automated recovery messaging.',
      evidence: [
        'How to set up webhook alerts when payment fails twice in Stripe so we can trigger a dunning email sequence?',
        'Write a Python script that pulls cancellation feedback from Stripe and categorizes reasons',
      ],
    },
    {
      title: 'CohortPilot: SQL-Free SaaS Health & Milestone Alerter',
      oneLiner: 'Zero-config analytics daemon that connects to Postgres and pushes cohort drops, NRR, and expansion triggers to Slack.',
      problem:
        'Founders write repetitive SQL queries or prompt LLMs weekly to calculate cohort retention and spot activation bottlenecks because Mixpanel and PostHog require hours of tracking code.',
      targetUser: 'Technical founders and solo product managers managing PostgreSQL backends.',
      mvpFeatures: [
        'Read-only PostgreSQL connection with automated schema introspection for users & subscriptions',
        'Pre-calculated dashboards for NRR, cohort retention curves, and LTV trends',
        'Slack & Discord webhooks triggered when accounts reach milestone inactivity thresholds',
        'CSV/Markdown export for investor updates and team retrospectives',
      ],
      monetization: '$29/mo starter tier up to 5,000 users; $79/mo growth tier with custom SQL alerts.',
      difficulty: 'Low',
      scores: {
        frequency: 85,
        willingnessToPay: 82,
        feasibility: 95,
        competition: 75,
        overall: 84,
      },
      whyItFits:
        'Solves the frequent SQL calculation queries and Postgres metrics questions found directly in prompt logs.',
      evidence: [
        'How can I calculate net revenue retention (NRR) in Postgres given subscriptions and invoice tables?',
        'Write an SQL query to find cohorts with highest upgrade rate from Free tier to Pro tier within 30 days',
      ],
    },
    {
      title: 'NudgeCraft: Behavioral Micro-Onboarding Engine',
      oneLiner: 'Lightweight JS snippet that detects user stall points and displays contextual interactive micro-checklists.',
      problem:
        'New users bounce after signing up without completing key activation actions (like team invites), requiring founders to build custom email crons or pay for Appcues.',
      targetUser: 'Product-led growth (PLG) SaaS teams aiming to increase free-to-paid conversion rates.',
      mvpFeatures: [
        '1KB client-side tracking script with event-based checklist triggers',
        'Visual editor for non-intrusive modal nudges and team invitation prompts',
        'Automatic fallback email trigger via Resend/Postmark if user abandons mid-onboarding',
        'A/B test dashboard comparing activation rate uplift',
      ],
      monetization: '$39/month up to 2,500 monthly active users (MAUs).',
      difficulty: 'High',
      scores: {
        frequency: 78,
        willingnessToPay: 80,
        feasibility: 72,
        competition: 68,
        overall: 75,
      },
      whyItFits:
        'Directly maps to the recurring prompts on user onboarding, 7-day re-engagement emails, and survey completion optimization.',
      evidence: [
        'Help me draft a 3-part re-engagement email sequence for users who signed up 7 days ago but never invited a team member',
        'Rewrite these onboarding survey questions to increase completion rate without losing demographic clarity',
      ],
    },
  ],
  buildPlan: {
    prd: `# DunnFlow: Autonomous Dunning & Churn Diagnostic Agent - Product Requirements Document (PRD)

## 1. Executive Summary & Problem
Early-stage B2B SaaS startups experience 4-9% voluntary and involuntary churn every single month. Involuntary churn (expired credit cards, temporary bank declines) accounts for nearly half of customer attrition. Most early founders either ignore failed payment webhooks or attempt to manually contact users. DunnFlow bridges Stripe webhook events with customizable, frictionless payment recovery workflows and an automated exit survey.

## 2. Target Audience & Personas
- **Solo SaaS Builders & Indie Hackers**: Need a set-and-forget solution that protects recurring MRR without requiring complex engineering.
- **Small B2B SaaS Operators ($5k - $50k MRR)**: Want branded email notifications, localized payment links, and diagnostic cancellation insights.

## 3. Core Functional Capabilities
- **Stripe Account Sync**: OAuth Connect to listen for 'invoice.payment_failed', 'customer.subscription.deleted', and 'charge.refunded'.
- **Dynamic Dunning Logic**: Trigger customizable multi-step retry schedules (Day 1 polite reminder, Day 3 urgency notice, Day 7 final grace period warning).
- **One-Click Update Link**: Direct authenticated URL allowing customers to update billing cards without logging into the main application.
- **Cancellation Reason Telemetry**: Lightweight hosted micro-page or embeddable modal presenting a 30-second cancellation feedback flow.
- **Revenue Recovery Dashboard**: Real-time counter of saved accounts, recovered MRR, and common churn driver distributions.

## 4. Success Metrics & KPIs
- **Recovery Rate**: ≥55% of failed card transactions successfully recovered within 7 days.
- **Time to Setup**: <5 minutes from signing up to receiving live Stripe test webhooks.
- **ROI**: Demonstrable 5x-10x return on investment over the $49/mo base subscription.`,
    techStack: [
      'Next.js / React 19',
      'TypeScript',
      'Tailwind CSS v4',
      'PostgreSQL (Supabase or Neon)',
      'Drizzle ORM',
      'Stripe Node.js SDK & Webhooks',
      'Resend API (Transactional Email)',
      'Vercel / Cloud Run Serverless',
    ],
    schema: `-- DunnFlow Database Schema (PostgreSQL)

CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    stripe_account_id VARCHAR(255) UNIQUE,
    stripe_access_token TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    stripe_customer_id VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    status VARCHAR(50) DEFAULT 'active',
    mrr_cents INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT unique_org_customer UNIQUE(org_id, stripe_customer_id)
);

CREATE TABLE failed_invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    stripe_invoice_id VARCHAR(255) NOT NULL,
    amount_due_cents INTEGER NOT NULL,
    attempt_count INTEGER DEFAULT 1,
    recovery_status VARCHAR(50) DEFAULT 'pending', -- pending, recovered, abandoned
    hosted_recovery_token VARCHAR(255) UNIQUE NOT NULL,
    next_retry_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    recovered_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE dunning_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_id UUID NOT NULL REFERENCES failed_invoices(id) ON DELETE CASCADE,
    channel VARCHAR(50) NOT NULL, -- email, in_app, slack
    step_number INTEGER NOT NULL,
    delivered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    opened_at TIMESTAMP WITH TIME ZONE,
    clicked_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE churn_feedbacks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
    reason_category VARCHAR(100) NOT NULL, -- 'pricing', 'missing_feature', 'switched_product', 'technical_issues'
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_failed_invoices_status ON failed_invoices(org_id, recovery_status);
CREATE INDEX idx_customers_stripe_id ON customers(stripe_customer_id);`,
    sprint: [
      'Day 1 (Architecture & Stripe Webhooks): Initialize repository, set up Postgres schema, implement Stripe OAuth Connect and webhook endpoint verifying signatures for invoice.payment_failed.',
      'Day 2 (Recovery Pipeline & Token Generator): Build secure one-time billing update token generator and connect Resend API with initial "Card Update Required" HTML email template.',
      'Day 3 (Customer Portal & Hosted Card Update): Develop minimalist public page (/pay/[token]) with Stripe Elements allowing users to submit updated payment credentials without password login.',
      'Day 4 (Exit Survey Modal & Webhook): Build lightweight embeddable JavaScript snippet and hosted survey route for cancellation feedback collection.',
      'Day 5 (Dashboard & Recovery Analytics): Assemble founder dashboard displaying Recovered MRR, Active Dunning Cases, and categorical churn reason breakdown.',
      'Day 6 (Integration Testing & Edge Cases): Test Stripe webhook retries, expired tokens, card decline scenarios, and rate limiting.',
      'Day 7 (Production Deployment & Demo Launch): Deploy to production, write documentation, publish launch tweet with video demo, and verify live test transaction.',
    ],
  },
};
