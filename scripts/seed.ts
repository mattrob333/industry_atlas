import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  // Hidden test account
  const testPassword = await bcrypt.hash('gWAAVvsp6@', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'abacus-a92abe40@example.com' },
    update: {},
    create: {
      email: 'abacus-a92abe40@example.com',
      password: testPassword,
      name: 'Test Admin',
    },
  })

  // Demo project
  const project = await prisma.project.upsert({
    where: { id: 'demo-tier4' },
    update: {},
    create: {
      id: 'demo-tier4',
      userId: testUser.id,
      name: 'Tier 4 Intelligence',
      companyName: 'Tier 4 Intelligence',
      companyDescription: 'AI-native consulting firm focused on enterprise AI transformation and implementation for midmarket and upper-midmarket companies. We help organizations move from AI pilots to production-grade AI systems.',
      geography: 'North America',
      customerScope: 'Midmarket 200-5000 employees',
      strategicQuestion: 'Where should we focus to differentiate from large consultancies?',
      forecastHorizon: '2-3 years',
    },
  })

  // Thesis
  await prisma.industryThesis.upsert({
    where: { projectId: project.id },
    update: {},
    create: {
      projectId: project.id,
      statedCategory: 'AI Consulting',
      actualArena: 'Enterprise AI transformation and implementation services',
      strategicBattlefield: 'AI-native transformation for midmarket and upper-midmarket enterprises',
      confidence: 0.82,
    },
  })

  // Segments
  const segData = [
    { name: 'Enterprise AI Strategy & Advisory', description: 'High-level AI strategy, roadmapping, and executive alignment', sizeValue: '$12B', growthRate: '18%', competitiveIntensity: 'High', capitalIntensity: 'Low' },
    { name: 'Custom AI Development & Integration', description: 'Building and deploying custom AI/ML models and integrations', sizeValue: '$28B', growthRate: '25%', competitiveIntensity: 'High', capitalIntensity: 'Medium' },
    { name: 'AI Operations & Governance', description: 'MLOps, AI governance frameworks, compliance, monitoring', sizeValue: '$5B', growthRate: '35%', competitiveIntensity: 'Medium', capitalIntensity: 'Medium' },
    { name: 'Midmarket AI Transformation', description: 'End-to-end AI transformation packages for mid-sized enterprises', sizeValue: '$8B', growthRate: '30%', competitiveIntensity: 'Low', capitalIntensity: 'Low' },
  ]
  const segments: any[] = []
  for (const s of segData) {
    const seg = await prisma.segment.upsert({
      where: { id: `seg-${s.name.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}` },
      update: {},
      create: {
        id: `seg-${s.name.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`,
        projectId: project.id,
        ...s,
      },
    })
    segments.push(seg)
  }

  // Entities
  const entityData = [
    { id: 'ent-tier4', entityType: 'focal_company', name: 'Tier 4 Intelligence', description: 'AI-native consulting firm focused on enterprise AI transformation for midmarket companies', geography: 'North America', revenue: '$15M', employees: '80', founded: '2021', strategicRole: 'Focal company - AI transformation specialist for midmarket' },
    { id: 'ent-accenture', entityType: 'company', name: 'Accenture', description: 'Global professional services company with major AI and digital transformation practice', geography: 'Global', revenue: '$64B', employees: '738,000', founded: '1989', strategicRole: 'Dominant incumbent with massive scale and enterprise relationships' },
    { id: 'ent-mckinsey', entityType: 'company', name: 'McKinsey Digital', description: 'Strategy consulting firm with growing AI/ML implementation capabilities', geography: 'Global', revenue: '$15B', employees: '45,000', founded: '1926', strategicRole: 'Premium strategy advisor expanding into AI implementation' },
    { id: 'ent-deloitte', entityType: 'company', name: 'Deloitte AI', description: 'Big Four firm with enterprise AI practice covering strategy through implementation', geography: 'Global', revenue: '$65B', employees: '457,000', founded: '1845', strategicRole: 'Full-stack competitor with audit/compliance advantage' },
    { id: 'ent-bcgx', entityType: 'company', name: 'BCG X', description: 'BCGs tech build and design arm combining strategy with engineering', geography: 'Global', revenue: '$12B', employees: '32,000', founded: '2022', strategicRole: 'Strategy-plus-build model competing for same C-suite access' },
    { id: 'ent-scalai', entityType: 'company', name: 'Scale AI', description: 'Data labeling and AI infrastructure company', geography: 'North America', revenue: '$750M', employees: '600', founded: '2016', funding: '$600M+', strategicRole: 'Key data infrastructure supplier for AI development' },
    { id: 'ent-palantir', entityType: 'company', name: 'Palantir', description: 'Data analytics and AI platform company focused on government and enterprise', geography: 'Global', revenue: '$2.2B', employees: '3,800', founded: '2003', strategicRole: 'Platform competitor with deep government relationships expanding enterprise' },
    { id: 'ent-openai', entityType: 'platform', name: 'OpenAI', description: 'Leading AI research lab and provider of GPT models and APIs', geography: 'Global', revenue: '$3.4B', employees: '1,500', founded: '2015', strategicRole: 'Critical foundation model provider - ecosystem dependency' },
    { id: 'ent-anthropic', entityType: 'platform', name: 'Anthropic', description: 'AI safety company building Claude foundation models', geography: 'North America', revenue: '$850M', employees: '800', founded: '2021', strategicRole: 'Alternative foundation model provider - safety-focused differentiation' },
    { id: 'ent-azure', entityType: 'platform', name: 'Microsoft Azure', description: 'Cloud computing platform with deep OpenAI integration', geography: 'Global', revenue: '$80B', employees: '220,000', founded: '2010', strategicRole: 'Primary cloud and AI infrastructure platform' },
    { id: 'ent-aws', entityType: 'platform', name: 'AWS', description: 'Amazon Web Services - dominant cloud infrastructure provider', geography: 'Global', revenue: '$90B', employees: '100,000', founded: '2006', strategicRole: 'Alternative cloud infrastructure - Bedrock AI services' },
    { id: 'ent-gcloud', entityType: 'platform', name: 'Google Cloud', description: 'Cloud platform with Vertex AI and Gemini model access', geography: 'Global', revenue: '$35B', employees: '50,000', founded: '2008', strategicRole: 'Cloud platform with first-party AI models' },
    { id: 'ent-midmarket', entityType: 'customer', name: 'Midmarket Enterprises', description: 'Companies with 200-2000 employees seeking AI transformation', geography: 'North America', strategicRole: 'Primary buyer segment - underserved by large consultancies' },
    { id: 'ent-uppermid', entityType: 'customer', name: 'Upper Midmarket Enterprises', description: 'Companies with 2000-5000 employees with budget for significant AI programs', geography: 'North America', strategicRole: 'Secondary buyer segment - target for expansion' },
    { id: 'ent-mleng', entityType: 'supplier', name: 'AI/ML Engineers', description: 'Machine learning engineers and data scientists', geography: 'Global', strategicRole: 'Critical talent pool - high demand, limited supply' },
    { id: 'ent-universities', entityType: 'institution', name: 'MIT, Stanford, CMU', description: 'Top research universities producing AI talent and research', geography: 'North America', strategicRole: 'Primary talent source and research influence' },
    { id: 'ent-gartner', entityType: 'institution', name: 'Gartner', description: 'Technology research and advisory firm', geography: 'Global', revenue: '$5.9B', strategicRole: 'Industry influencer - shapes buyer perception and vendor ranking' },
    { id: 'ent-forrester', entityType: 'institution', name: 'Forrester', description: 'Technology and market research company', geography: 'Global', revenue: '$500M', strategicRole: 'Secondary industry influencer and analyst firm' },
    { id: 'ent-ftc', entityType: 'regulator', name: 'FTC AI Division', description: 'Federal Trade Commission AI oversight and regulation', geography: 'United States', strategicRole: 'Primary US AI regulator - enforcement actions affect market' },
    { id: 'ent-euai', entityType: 'regulator', name: 'EU AI Act Authority', description: 'European Union AI regulatory body enforcing the AI Act', geography: 'Europe', strategicRole: 'Major international regulator shaping compliance requirements' },
    { id: 'ent-opp-agent', entityType: 'opportunity', name: 'Agent Governance & Operations', description: 'Helping enterprises govern and operationalize AI agents', strategicRole: 'Emerging whitespace as autonomous AI agents proliferate' },
    { id: 'ent-opp-midmkt', entityType: 'opportunity', name: 'Midmarket AI Transformation', description: 'Packaged AI transformation for underserved midmarket', strategicRole: 'Primary go-to-market opportunity - low competition' },
    { id: 'ent-opp-pilot', entityType: 'opportunity', name: 'Pilot-to-Production Rescue', description: 'Converting stalled AI pilots into production systems', strategicRole: 'Tactical entry point - immediate pain for many enterprises' },
    { id: 'ent-threat-consult', entityType: 'threat', name: 'Large Consultancies Moving Downmarket', description: 'Accenture, Deloitte, McKinsey creating smaller engagement models', strategicRole: 'Major competitive threat as incumbents adapt' },
    { id: 'ent-threat-platform', entityType: 'threat', name: 'AI Platforms Absorbing Use Cases', description: 'OpenAI, Microsoft, Google building turnkey solutions that eliminate custom work', strategicRole: 'Platform risk - commoditization of common AI implementations' },

    // --- Experts & Sources (shown on the Experts & Sources page, hidden from the map) ---
    { id: 'ent-exp-ng', entityType: 'expert', name: 'Andrew Ng', description: 'Founder of DeepLearning.AI and Landing AI; one of the most influential voices on applied enterprise AI.', website: 'https://www.deeplearning.ai/', strategicRole: 'Thought leader', metadataJson: { sourceCategory: 'expert', role: 'Founder & Educator' } },
    { id: 'ent-exp-huyen', entityType: 'expert', name: 'Chip Huyen', description: 'Author of "Designing Machine Learning Systems"; writes widely on ML in production.', website: 'https://huyenchip.com/', strategicRole: 'Author & Practitioner', metadataJson: { sourceCategory: 'expert', role: 'Author' } },
    { id: 'ent-exp-benaich', entityType: 'expert', name: 'Nathan Benaich', description: 'Investor and author of the annual State of AI Report, tracking commercial and research trends.', website: 'https://www.stateof.ai/', strategicRole: 'Investor & Analyst', metadataJson: { sourceCategory: 'expert', role: 'Investor' } },
    { id: 'ent-an-gartner', entityType: 'analyst', name: 'Gartner AI Research', description: 'Advisory practice covering enterprise AI adoption, the AI hype cycle and vendor Magic Quadrants.', strategicRole: 'Enterprise AI adoption', metadataJson: { sourceCategory: 'analyst', coverage: 'Enterprise AI adoption' } },
    { id: 'ent-an-cbinsights', entityType: 'analyst', name: 'CB Insights', description: 'Market intelligence on AI startups, funding and emerging categories.', strategicRole: 'Startup & funding data', metadataJson: { sourceCategory: 'analyst', coverage: 'Startups & funding' } },
    { id: 'ent-pub-import', entityType: 'publication', name: 'Import AI', description: 'Jack Clark’s weekly newsletter summarizing the most important AI research and policy developments.', website: 'https://importai.substack.com/', strategicRole: 'Newsletter', metadataJson: { sourceCategory: 'publication', mediaType: 'Newsletter' } },
    { id: 'ent-pub-batch', entityType: 'publication', name: 'The Batch (DeepLearning.AI)', description: 'Weekly newsletter on AI news and practical implications for businesses.', website: 'https://www.deeplearning.ai/the-batch/', strategicRole: 'Newsletter', metadataJson: { sourceCategory: 'publication', mediaType: 'Newsletter' } },
    { id: 'ent-pub-twiml', entityType: 'publication', name: 'TWIML AI Podcast', description: 'Interviews with ML practitioners on real-world deployments and research.', website: 'https://twimlai.com/', strategicRole: 'Podcast', metadataJson: { sourceCategory: 'publication', mediaType: 'Podcast' } },
    { id: 'ent-ev-transform', entityType: 'conference', name: 'VentureBeat Transform', description: 'Enterprise AI conference focused on applied AI strategy for business leaders.', geography: 'San Francisco, USA', strategicRole: 'Annual', metadataJson: { sourceCategory: 'event', cadence: 'Annual', location: 'San Francisco, USA' } },
    { id: 'ent-ev-aisummit', entityType: 'conference', name: 'The AI Summit', description: 'Business-focused AI event series connecting enterprise buyers with vendors.', website: 'https://newyork.theaisummit.com/', geography: 'New York / London', strategicRole: 'Annual', metadataJson: { sourceCategory: 'event', cadence: 'Annual', location: 'New York / London' } },
    { id: 'ent-ev-neurips', entityType: 'conference', name: 'NeurIPS', description: 'Premier academic AI/ML research conference; where cutting-edge talent and research surface.', website: 'https://neurips.cc/', geography: 'Rotating', strategicRole: 'Annual', metadataJson: { sourceCategory: 'event', cadence: 'Annual', location: 'Rotating' } },
    { id: 'ent-com-rml', entityType: 'community', name: 'r/MachineLearning', description: 'Large Reddit community of ML researchers and engineers discussing tools and techniques.', website: 'https://www.reddit.com/r/MachineLearning/', strategicRole: 'Reddit', metadataJson: { sourceCategory: 'community', platform: 'Reddit', audience: 'ML engineers & researchers evaluating approaches and tools' } },
    { id: 'ent-com-artificial', entityType: 'community', name: 'r/artificial', description: 'General AI discussion community spanning business, ethics and applications.', website: 'https://www.reddit.com/r/artificial/', strategicRole: 'Reddit', metadataJson: { sourceCategory: 'community', platform: 'Reddit', audience: 'Business & tech decision-makers curious about AI' } },
    { id: 'ent-com-mlops', entityType: 'community', name: 'MLOps Community', description: 'Active Slack community of practitioners deploying ML in production — a hub of prospective buyers.', website: 'https://mlops.community/', strategicRole: 'Slack', metadataJson: { sourceCategory: 'community', platform: 'Slack', audience: 'Data/ML leaders responsible for production AI — strong buyer signal' } },
    { id: 'ent-com-cdo', entityType: 'community', name: 'Chief Data Officer LinkedIn Groups', description: 'LinkedIn groups where midmarket data & AI leaders share challenges and vendors.', strategicRole: 'LinkedIn', metadataJson: { sourceCategory: 'community', platform: 'LinkedIn', audience: 'Midmarket CDOs/CIOs — your core buyer persona' } },
  ]

  const entities: any[] = []
  for (const e of entityData) {
    const created = await prisma.entity.upsert({
      where: { id: e.id },
      update: {},
      create: {
        ...e,
        projectId: project.id,
        confidence: e.entityType === 'focal_company' ? 0.95 : 0.75,
        isChokepoint: ['ent-openai', 'ent-azure', 'ent-mleng'].includes(e.id),
        chokepointScore: ['ent-openai', 'ent-azure', 'ent-mleng'].includes(e.id) ? 0.85 : 0,
      },
    })
    entities.push(created)
  }

  // Relationships
  const relData = [
    { src: 'ent-tier4', tgt: 'ent-accenture', type: 'competes_with', strength: 0.6 },
    { src: 'ent-tier4', tgt: 'ent-mckinsey', type: 'competes_with', strength: 0.5 },
    { src: 'ent-tier4', tgt: 'ent-deloitte', type: 'competes_with', strength: 0.6 },
    { src: 'ent-tier4', tgt: 'ent-bcgx', type: 'competes_with', strength: 0.5 },
    { src: 'ent-tier4', tgt: 'ent-palantir', type: 'competes_with', strength: 0.4 },
    { src: 'ent-tier4', tgt: 'ent-openai', type: 'depends_on', strength: 0.9 },
    { src: 'ent-tier4', tgt: 'ent-anthropic', type: 'depends_on', strength: 0.7 },
    { src: 'ent-tier4', tgt: 'ent-azure', type: 'depends_on', strength: 0.8 },
    { src: 'ent-tier4', tgt: 'ent-aws', type: 'depends_on', strength: 0.6 },
    { src: 'ent-tier4', tgt: 'ent-gcloud', type: 'depends_on', strength: 0.5 },
    { src: 'ent-tier4', tgt: 'ent-midmarket', type: 'sells_to', strength: 0.9 },
    { src: 'ent-tier4', tgt: 'ent-uppermid', type: 'sells_to', strength: 0.7 },
    { src: 'ent-accenture', tgt: 'ent-midmarket', type: 'sells_to', strength: 0.4 },
    { src: 'ent-accenture', tgt: 'ent-uppermid', type: 'sells_to', strength: 0.8 },
    { src: 'ent-mckinsey', tgt: 'ent-uppermid', type: 'sells_to', strength: 0.7 },
    { src: 'ent-deloitte', tgt: 'ent-uppermid', type: 'sells_to', strength: 0.8 },
    { src: 'ent-scalai', tgt: 'ent-tier4', type: 'supplies', strength: 0.5 },
    { src: 'ent-universities', tgt: 'ent-mleng', type: 'hires_from', strength: 0.8 },
    { src: 'ent-tier4', tgt: 'ent-mleng', type: 'hires_from', strength: 0.9 },
    { src: 'ent-gartner', tgt: 'ent-tier4', type: 'influences', strength: 0.6 },
    { src: 'ent-forrester', tgt: 'ent-tier4', type: 'influences', strength: 0.4 },
    { src: 'ent-ftc', tgt: 'ent-tier4', type: 'regulates', strength: 0.5 },
    { src: 'ent-euai', tgt: 'ent-tier4', type: 'regulates', strength: 0.4 },
    { src: 'ent-openai', tgt: 'ent-azure', type: 'partners_with', strength: 0.95 },
    { src: 'ent-accenture', tgt: 'ent-openai', type: 'depends_on', strength: 0.7 },
    { src: 'ent-bcgx', tgt: 'ent-openai', type: 'depends_on', strength: 0.6 },
  ]

  for (const r of relData) {
    await prisma.relationship.upsert({
      where: { id: `rel-${r.src}-${r.tgt}-${r.type}` },
      update: {},
      create: {
        id: `rel-${r.src}-${r.tgt}-${r.type}`,
        projectId: project.id,
        sourceEntityId: r.src,
        targetEntityId: r.tgt,
        relationshipType: r.type,
        strength: r.strength,
        confidence: 0.8,
      },
    })
  }

  // Opportunities
  const oppData = [
    { name: 'Agent Governance & Operations', buyerPain: 'Enterprises deploying AI agents have no governance framework', whyUnderserved: 'Too new for incumbents to have packaged offerings', marketEvidence: 'Agent adoption growing 200%+ YoY in enterprise', focalFit: 'Strong - aligns with AI-native positioning', timeHorizon: '6-18 months', opportunityScore: 0.85 },
    { name: 'Midmarket AI Transformation', buyerPain: 'Midmarket companies cannot afford Big Four pricing but need AI help', whyUnderserved: 'Large consultancies focus on enterprise; boutiques lack AI depth', marketEvidence: '70% of midmarket companies plan AI investment within 2 years', focalFit: 'Very strong - exact target market', timeHorizon: '0-12 months', opportunityScore: 0.9 },
    { name: 'Pilot-to-Production Rescue', buyerPain: '87% of AI projects never make it to production', whyUnderserved: 'Most consultancies sell new projects rather than rescue existing ones', marketEvidence: 'Widespread pilot fatigue across industries', focalFit: 'Strong - demonstrates implementation capability', timeHorizon: '0-6 months', opportunityScore: 0.78 },
  ]
  for (const o of oppData) {
    await prisma.opportunity.upsert({
      where: { id: `opp-${o.name.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}` },
      update: {},
      create: {
        id: `opp-${o.name.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`,
        projectId: project.id,
        ...o,
      },
    })
  }

  // Threats
  const threatData = [
    { name: 'Large Consultancies Moving Downmarket', trigger: 'Accenture or Deloitte launch midmarket AI packages under $500K', probability: 0.65, impact: 0.8, threatScore: 0.72, exposedAreas: 'Core midmarket positioning', indicators: 'New product launches, pricing changes, midmarket hiring' },
    { name: 'AI Platforms Absorbing Common Use Cases', trigger: 'OpenAI or Microsoft ships turnkey enterprise AI solutions', probability: 0.75, impact: 0.7, threatScore: 0.73, exposedAreas: 'Standardized implementation work', indicators: 'Platform feature announcements, customer self-service growth' },
  ]
  for (const t of threatData) {
    await prisma.threat.upsert({
      where: { id: `threat-${t.name.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}` },
      update: {},
      create: {
        id: `threat-${t.name.toLowerCase().replace(/\s+/g, '-').slice(0, 30)}`,
        projectId: project.id,
        ...t,
      },
    })
  }

  // Research run
  await prisma.researchRun.upsert({
    where: { id: 'run-demo' },
    update: {},
    create: {
      id: 'run-demo',
      projectId: project.id,
      runType: 'standard',
      status: 'completed',
      stageNumber: 10,
      totalStages: 10,
      entityCount: entityData.length,
      sourceCount: entityData.length + relData.length,
      summary: 'Tier 4 Intelligence operates in the Enterprise AI transformation and implementation services arena, competing against large consultancies while targeting the underserved midmarket. Key opportunities exist in agent governance, midmarket AI transformation packages, and pilot-to-production rescue services.',
      startedAt: new Date(),
      completedAt: new Date(),
    },
  })

  console.log('Seed complete: demo project with', entityData.length, 'entities and', relData.length, 'relationships')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
