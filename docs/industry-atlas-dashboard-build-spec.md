# Industry Atlas

## Build Specification for a Living Industry Intelligence Dashboard

### Product premise

Industry Atlas is not a report generator. It is a living, evidence-backed model of the field around a company.

A user enters:

- Company name
- Website, if available
- Plain-language company description
- Geography or market scope
- Target customers, if known
- Strategic horizon
- Optional competitor seeds or industries to include or exclude

The system determines the industry the company actually competes in, researches the surrounding ecosystem, converts the findings into a structured knowledge graph, and renders that graph through Steve Blank's Ten Steps to Map Any Industry.

The ten steps are not ten disconnected answers. They are ten views over one shared model of:

- Companies
- Segments
- Customers
- Suppliers
- Technologies
- Economic relationships
- Talent movement
- Experts and institutions
- Sources and evidence
- Historical changes
- Forecasted changes
- Chokepoints
- Underserved opportunities
- Threats

The primary promise is:

> Enter a company. See the field. Update the map whenever the field changes.

---

# 1. Product name and positioning

## Recommended name

**Industry Atlas**

### Supporting language

- Living industry intelligence
- Map the field before you choose where to play
- A continuously updated model of your market, ecosystem, dependencies, competitors, and opportunities

## Internal product category

Industry Atlas is a combination of:

- Industry research platform
- Competitive intelligence platform
- Knowledge graph
- Strategy dashboard
- Market monitoring system
- AI research agent

It should feel more like a control center than a report.

---

# 2. The core user experience

## First-run workflow

### Step 1: Create a company map

The user sees a focused intake screen.

Fields:

1. Company name
2. Company website
3. Company description
4. Primary geography
5. Target customer size
6. Known products or services
7. Strategic question
8. Forecast horizon
9. Competitors to include
10. Categories to exclude

The only required fields should be company name and description.

Primary button:

**Build Industry Map**

Secondary option:

**Use website to enrich description**

### Step 2: Show the working industry thesis

Before presenting the full dashboard, the system creates three levels of classification:

1. **Stated category**
   - What the company calls itself

2. **Actual competitive arena**
   - The broad ecosystem in which it competes for customer budget

3. **Strategic battlefield**
   - The narrower part of that ecosystem where the company can realistically win

Example:

- Stated category: AI consulting company
- Actual competitive arena: Enterprise AI transformation and implementation services
- Strategic battlefield: AI-native transformation and custom implementation for midmarket and upper-midmarket companies

The user may edit the thesis, but the system should not force an approval step before continuing.

### Step 3: Stream the research process

Show a visible research run with business-language stages:

1. Defining the field
2. Finding segments
3. Identifying companies and institutions
4. Mapping technology dependencies
5. Mapping buyers and money flows
6. Mapping talent and influence
7. Quantifying leaders and growth
8. Verifying evidence
9. Finding chokepoints and whitespace
10. Building the forecast

Do not expose low-level chain-of-thought. Show concise status summaries, discovered entities, source counts, and completed stages.

### Step 4: Open the completed dashboard

The user lands on the Overview page with the map already centered on the focal company.

---

# 3. Dashboard layout

## Global shell

### Top bar

Left:

- Company logo or initials
- Company name
- Actual competitive arena

Center:

- Map confidence
- Data freshness
- Number of verified sources
- Last updated date

Right:

- Ask the Map
- Export
- Share
- Update Map

### Left navigation

1. Overview
2. Ecosystem Map
3. Segments
4. Players
5. Technology Flow
6. Economic Flow
7. Talent Flow
8. Experts and Sources
9. History
10. Forecast
11. Opportunities
12. Change Log
13. Settings

### Persistent right-side intelligence drawer

The drawer changes based on the selected node, edge, company, segment, claim, or alert.

It should show:

- Summary
- Strategic role
- Metrics
- Relationships
- Dependencies
- Substitutes
- Confidence
- Freshness
- Supporting evidence
- Changes since last update
- User notes

---

# 4. Overview page

The Overview page should answer five questions in under one minute:

1. What industry are we actually in?
2. How does the field fit together?
3. Where does our company sit?
4. Who controls the important chokepoints?
5. Where are the best opportunities and threats?

## Suggested layout

```text
┌──────────────────────────────────────────────────────────────────────────────┐
│ Tier 4 Intelligence  | Enterprise AI Transformation  | Updated Aug 27      │
│ Confidence 87%       | 214 verified sources          | [Ask] [Update Map]   │
├──────────────┬──────────────────────────────────────────────┬────────────────┤
│ Navigation   │                                              │ Company        │
│              │        INTERACTIVE INDUSTRY MAP              │ Position       │
│ Overview     │                                              │                │
│ Ecosystem    │  Suppliers → Platforms → Services → Buyers  │ Chokepoints    │
│ Players      │                    ★                         │ Dependencies   │
│ Technology   │             Tier 4 Intelligence             │ Substitutes    │
│ Economics    │                                              │ Right to Win   │
│ Talent       │                                              │                │
├──────────────┴──────────────────────────────────────────────┴────────────────┤
│ Market size | Growth | Competition | Concentration | Capital intensity      │
├──────────────────────────────────────┬───────────────────────────────────────┤
│ Biggest opportunities                │ Biggest threats                       │
├──────────────────────────────────────┴───────────────────────────────────────┤
│ What changed since the last update                                           │
└──────────────────────────────────────────────────────────────────────────────┘
```

## Top cards

- Actual industry
- Strategic battlefield
- Market size, with definition and date
- Market growth rate
- Competitive intensity
- Buyer concentration
- Supplier concentration
- Market maturity
- Data confidence
- Map completeness

Each number must have:

- Date
- Scope
- Source
- Confidence
- Definition

This prevents misleading market-size comparisons.

## Primary visual

The interactive ecosystem map should occupy most of the screen.

The map is the product. The cards and prose explain the map.

## Right-side company position card

Show:

- Current segment
- Adjacent segments
- Primary competitors
- Primary substitutes
- Upstream dependencies
- Downstream buyers
- Distribution channels
- Strategic advantages
- Strategic vulnerabilities
- Chokepoint exposure
- Opportunity score

## Bottom panels

### Biggest opportunities

Each opportunity shows:

- Opportunity name
- Buyer pain
- Why it is underserved
- Market evidence
- Tier 4 fit
- Time horizon
- Opportunity score

### Biggest threats

Each threat shows:

- Threat
- Trigger
- Probability
- Impact
- Exposed parts of the business
- Leading indicators to monitor

### What changed

Examples:

- New entrant raised capital
- Market leader launched an adjacent product
- Market-size forecast increased
- Regulatory change became effective
- Important executive changed roles
- Acquisition altered a chokepoint
- New technology reduced a dependency

---

# 5. The ecosystem map

## Core idea

The map is one knowledge graph with selectable layers.

### Node types

- Focal company
- Company
- Market segment
- Customer group
- Supplier group
- Product
- Platform
- Technology
- Data source
- Investor
- Expert
- Institution
- Conference
- Publication
- Regulator
- Standard
- Workforce source
- Adjacent market
- Opportunity
- Threat

### Relationship types

- Competes with
- Sells to
- Buys from
- Supplies
- Builds on
- Integrates with
- Depends on
- Can substitute for
- Distributes
- Partners with
- Invested in
- Acquired
- Regulates
- Influences
- Trains talent for
- Hires from
- Talent moves to
- Enables
- Constrains
- Threatens
- Creates opportunity for

### Map layers

The user can turn layers on and off:

1. Market structure
2. Technology
3. Money
4. Talent
5. Influence
6. Regulation
7. Partnerships
8. Acquisitions and funding
9. Opportunities and threats
10. Forecast scenario

### Edge styling

Use edge thickness and labels to communicate meaning.

Examples:

- Thick edge: high dependency or large economic flow
- Dashed edge: inferred relationship
- Solid edge: verified relationship
- Arrow direction: flow direction
- Edge badge: amount, market share, dependency score, or relationship type

### Node styling

- Focal company: prominent spring-green star or highlighted node
- Chokepoint: heavy border
- High-growth entrant: upward growth indicator
- Stale data: muted freshness badge
- Low confidence: reduced opacity or warning icon
- Material change: small update indicator

Do not use color alone to communicate state.

### Interaction

Clicking any node opens its dossier.

Hovering shows:

- Role
- Segment
- Key metric
- Confidence
- Last verified date

Double-clicking isolates the node and its first-degree relationships.

The user can:

- Search nodes
- Filter node types
- Filter relationship types
- Hide weak relationships
- Show only verified facts
- Compare current map with a prior snapshot
- Pin nodes
- Add notes
- Add or remove an entity manually
- Correct a relationship
- Mark a company as strategically important

---

# 6. Steve Blank's ten steps as one connected model

## Step 1: Diagram the industry and segments

Dashboard output:

- Ecosystem map
- Segment hierarchy
- Suppliers and customers by segment
- Adjacent-market connections

Stored objects:

- Segments
- Entities
- Relationships

## Step 2: Build the glossary

Dashboard output:

- Searchable glossary
- Terms linked to the segment, technology, or company where they matter
- Plain-language definitions
- Synonyms and related terms

Stored objects:

- Terms
- Definitions
- Term-to-entity relationships

## Step 3: Identify experts and institutions

Dashboard output:

- Experts by segment
- Researchers
- Analysts
- Universities
- Think tanks
- Standards bodies
- Regulators

Stored objects:

- People
- Institutions
- Influence relationships

## Step 4: Identify sources and information channels

Dashboard output:

- Publications
- Conferences
- Websites
- Databases
- Primary data sources
- Paid sources
- Open sources

Stored objects:

- Sources
- Events
- Source quality scores

## Step 5: Identify market leaders and entrants

Dashboard output:

- Leader table
- Entrant watchlist
- Funding and revenue cards
- Growth comparison
- Market-share view where trustworthy data exists

Stored objects:

- Companies
- Metrics
- Funding events
- Acquisitions

## Step 6: Map technology flow

Dashboard output:

- Technology layer on the graph
- Critical dependencies
- Replaceable dependencies
- Technology stack by segment
- Build-on-top-of relationships

Stored objects:

- Technologies
- Platforms
- Dependencies
- Substitutes

## Step 7: Map economic flow

Dashboard output:

- Buyer and supplier relationships
- Revenue models
- Who pays whom
- Demand drivers
- Capital intensity
- Margin structures
- Procurement paths

Stored objects:

- Economic relationships
- Buyer groups
- Revenue models
- Demand drivers

## Step 8: Map talent flow

Dashboard output:

- Talent-source map
- Universities and training institutions
- Movement between companies and segments
- Scarce roles
- Wage or hiring signals where available

Stored objects:

- Roles
- Institutions
- Talent movement relationships

## Step 9: Explain historical change

Dashboard output:

- Industry timeline
- Prior versions of the map
- Important causal events
- Technology and regulation milestones

Stored objects:

- Events
- Snapshots
- Causal relationships

## Step 10: Forecast the next five years

Dashboard output:

- Base, upside, and disruption scenarios
- Forecasted nodes and relationships
- Leading indicators
- Probability and impact
- Implications for the focal company

Stored objects:

- Forecasts
- Scenarios
- Indicators
- Opportunities
- Threats

---

# 7. Entity dossier

Every important company, technology, segment, expert, institution, or regulator should have a dossier.

## Company dossier

- Name
- Logo
- Website
- Description
- Headquarters
- Geography
- Founded date
- Employee estimate
- Revenue
- Funding
- Valuation
- Growth
- Market share
- Products
- Customers
- Partners
- Investors
- Acquisitions
- Technology dependencies
- Talent sources
- Strategic role
- Competitive relationship to focal company
- Threat score
- Partnership score
- Acquisition relevance
- Last verified date
- Evidence list

Do not show a metric without showing the period and evidence.

## Segment dossier

- Definition
- Scope
- Included companies
- Excluded categories
- Market size
- Growth rate
- Buyer groups
- Demand drivers
- Suppliers
- Capital intensity
- Competitive intensity
- Margin model
- Major technologies
- Trends
- Chokepoints
- Opportunities

## Technology dossier

- What it does
- Who controls it
- Who builds on it
- Criticality
- Replaceability
- Switching cost
- Adoption signal
- Cost trend
- Regulatory exposure
- Related companies

---

# 8. Ask the Map

A grounded conversational interface should sit above the dashboard.

Examples:

- Who controls distribution in this industry?
- Which suppliers have the most leverage over us?
- Show the three most attractive underserved segments.
- What changed during the last update?
- Which companies could acquire us?
- Which partners already sell to our target buyers?
- Which competitors are moving downstream?
- What would have to become true for this market to collapse?
- Which chokepoint should we try to own?
- Show only claims supported by primary sources.

The answer should:

- Use the stored graph and claims first
- Search the web when fresh information is needed
- Cite every material claim
- Distinguish fact, estimate, inference, and forecast
- Offer to pin the result to the dashboard

Users should be able to convert an answer into:

- Watchlist item
- Opportunity
- Threat
- Note
- Research task
- Alert rule

---

# 9. Research engine

## Do not use one giant prompt

The engine should be an orchestrated pipeline of smaller, schema-constrained passes.

Recommended pipeline:

### Pass 1: Scope and classification

Input:

- Company information
- User constraints

Output:

- Stated category
- Actual arena
- Strategic battlefield
- Industry boundaries
- Included segments
- Excluded segments
- Initial search plan

### Pass 2: Segment discovery

Output:

- Segment hierarchy
- Segment descriptions
- Upstream and downstream relationships
- Adjacent markets

### Pass 3: Entity discovery

Output:

- Companies
- Platforms
- Technologies
- Customers
- Suppliers
- Experts
- Institutions
- Regulators
- Sources

### Pass 4: Entity enrichment

For every important entity, retrieve:

- Identity
- Role
- Geography
- Metrics
- Products
- Funding
- Relationships
- Sources

### Pass 5: Relationship extraction

Create graph edges for:

- Competitive relationships
- Supplier relationships
- Technology dependencies
- Economic flows
- Talent flows
- Influence
- Regulation

### Pass 6: Quantification

Add:

- Revenue
- Market size
- Growth
- Funding
- Market share
- Employee count
- Capital intensity
- Demand indicators

### Pass 7: Verification

For each material claim:

- Confirm source quality
- Confirm date
- Confirm scope
- Confirm unit and currency
- Find a second source when necessary
- Flag conflicts
- Reduce confidence when evidence is weak

### Pass 8: Strategic analysis

Calculate:

- Chokepoints
- Dependencies
- Replaceability
- White space
- Threats
- Partnership opportunities
- Acquisition relevance
- Right-to-win

### Pass 9: Historical model

Build:

- Five-to-ten-year timeline
- Prior industry structures
- Causes of major changes

### Pass 10: Forecast

Create:

- Base scenario
- Upside scenario
- Disruption scenario
- Leading indicators
- Focal-company implications

### Pass 11: Synthesis and rendering

Produce:

- Executive summary
- Nodes
- Edges
- Tables
- Cards
- Scores
- Alerts
- Citations

### Pass 12: Diff against prior run

When a prior map exists:

- Compare entities
- Compare metrics
- Compare relationships
- Compare segment definitions
- Compare forecasts
- Classify material changes

---

# 10. Research agents or functions

Use specialist functions inside one orchestrated workflow. Do not create a swarm of agents that independently write long reports.

Recommended specialists:

1. Industry Boundary Analyst
2. Segment Mapper
3. Company and Entity Researcher
4. Market Data Researcher
5. Technology Dependency Analyst
6. Economic Flow Analyst
7. Talent and Influence Analyst
8. Regulation Analyst
9. Forecast Analyst
10. Evidence Verifier
11. Strategic Positioning Analyst
12. Change Detection Analyst

Every specialist returns structured data, not prose-only output.

The synthesis layer turns structured data into readable explanations.

---

# 11. Evidence and trust system

This is essential. Without it, the dashboard becomes a polished hallucination.

## Claim object

Every material claim should be stored independently.

Fields:

- Claim ID
- Subject
- Field
- Claim text
- Normalized value
- Unit
- Period
- Geography
- Claim type
- Source IDs
- Supporting snippets
- Source quality
- Confidence
- Freshness
- Last verified date
- Valid from
- Valid to
- Prior value
- Change status
- Contradicting evidence
- Reviewer status

## Claim types

- Verified fact
- Company-reported fact
- Analyst estimate
- Model inference
- Forecast
- User-provided fact
- Unverified lead

## Source hierarchy

### Tier 1

- Government filings
- Regulatory sources
- Financial filings
- Official standards
- Company investor relations
- Official product documentation

### Tier 2

- Established market research
- Academic research
- Major data providers

### Tier 3

- Reputable business and technology publications

### Tier 4

- Company blog
- Executive interview
- Conference presentation

### Tier 5

- Aggregator
- Social media
- Unverified directory

Tier 5 can generate leads but should not independently support a critical claim.

## Confidence model

Confidence should consider:

- Source quality
- Number of independent sources
- Source recency
- Agreement between sources
- Directness of evidence
- Definition clarity
- Extraction certainty

## Conflict handling

Never silently average conflicting figures.

Show:

- Source A value
- Source B value
- Why they may differ
- Which definition the dashboard selected
- Confidence level

---

# 12. Update Map system

## Primary button

**Update Map**

Clicking it opens three choices:

1. **Quick Update**
   - Refresh stale claims, watched entities, recent funding, market numbers, regulations, acquisitions, and major strategic signals

2. **Update Selected Layer**
   - Technology, economics, talent, players, sources, history, forecast, or opportunities

3. **Full Rebuild**
   - Reconsider the industry boundaries, segments, relationships, and strategic conclusions from scratch

## Refresh behavior

The update process should:

1. Load the last accepted snapshot
2. Identify stale claims and watched entities
3. Search only the required areas
4. Verify new information
5. Compare new and prior values
6. Update the graph
7. Recalculate strategic scores
8. Create a change brief
9. Preserve the prior snapshot
10. Notify the user only about material changes

## Suggested freshness rules

These should be editable by category.

- Public-company financial metrics: refresh after new filing or earnings release
- Private funding and acquisitions: 14 days
- Market leaders and entrants: 30 days
- Product and technology changes: 30 days
- Regulatory developments: 7 to 30 days
- Market-size forecasts: 90 to 180 days
- Conferences: 90 days
- Experts and institutions: 180 days
- Glossary terms: 365 days
- Historical facts: no automatic refresh unless challenged

## Material-change detection

A change is material when it affects:

- Market structure
- Company position
- Chokepoint score
- Opportunity score
- Threat score
- Important metric
- Major relationship
- Regulation
- Forecast probability

## Change log

For each update, show:

- Added entities
- Removed or inactive entities
- Changed relationships
- Changed metrics
- New funding or acquisition events
- New regulations
- Revised forecasts
- Opportunities promoted or downgraded
- Threats promoted or downgraded
- Sources added
- Claims that lost confidence

Each item should support a before-and-after view.

---

# 13. Strategic scoring

Scores should be transparent and editable.

## Chokepoint score

Recommended factors:

- Dependency criticality: 25%
- Market concentration: 20%
- Switching cost: 20%
- Control over customer, data, or distribution: 15%
- Lack of substitutes: 10%
- Regulatory or contractual control: 10%

Output:

- 0 to 100 score
- Explanation
- Evidence
- Affected nodes
- Possible mitigation
- Opportunity to own or bypass the chokepoint

## Opportunity score

Recommended factors:

- Pain urgency: 20%
- Budget availability: 15%
- Market growth: 15%
- Competitive whitespace: 15%
- Focal-company fit: 15%
- Repeatability: 10%
- Recurring-revenue potential: 10%

Apply a separate implementation-risk penalty.

## Threat score

Recommended factors:

- Probability
- Impact
- Time proximity
- Exposure
- Ability to respond

## Right-to-win score

Recommended factors:

- Buyer access
- Domain knowledge
- Proprietary data or context
- Technical capability
- Delivery credibility
- Distribution advantage
- Workflow ownership
- Switching cost created
- Repeatability

Do not present scores as objective truth. Show the assumptions and allow manual adjustment.

---

# 14. Forecast system

Forecasts should not be mixed with verified facts.

Each forecast must include:

- Forecast statement
- Scenario
- Time horizon
- Probability
- Confidence
- Drivers
- Counter-drivers
- Leading indicators
- Affected segments
- Affected companies
- Focal-company implication
- Recommended preparation
- Source evidence

## Scenario views

1. Current state
2. Base case
3. Upside case
4. Disruption case

A time slider should let the user see how nodes, relationships, and market power could change.

Forecast nodes and edges should be visually distinct from verified current-state nodes and edges.

---

# 15. Opportunity workspace

The dashboard should not stop at research. It should help the user decide what to do.

## Opportunity board

Columns:

- Watching
- Validating
- Prioritized
- Testing
- Active initiative
- Rejected

Each opportunity includes:

- Name
- Problem
- Customer
- Trigger
- Market evidence
- Competitive gap
- Focal-company advantage
- Offer concept
- Required capabilities
- Partners
- Risks
- Score
- Owner
- Next action

## Strategic actions generated from the map

- Enter segment
- Avoid segment
- Partner
- Build capability
- Acquire capability
- Create content position
- Launch offer
- Monitor competitor
- Reduce dependency
- Own chokepoint
- Create data advantage

---

# 16. Watchlists and alerts

Users should be able to watch:

- Company
- Segment
- Technology
- Executive
- Regulation
- Funding event
- Acquisition signal
- Market metric
- Opportunity
- Threat
- Forecast indicator

Example alerts:

- Notify me when a new agent-governance company raises more than $10 million
- Notify me when a competitor launches a product for companies under 5,000 employees
- Notify me when Microsoft adds a feature that substitutes for one of our custom builds
- Notify me when a target partner announces a new AI-services program
- Notify me when evidence changes the probability of this forecast

---

# 17. Data model

A relational database is sufficient for the first version. Store the graph as entity and relationship tables in Postgres.

Do not start with a separate graph database unless traversal requirements prove Postgres inadequate.

## Core tables

### projects

- id
- organization_id
- name
- company_name
- company_url
- company_description
- geography
- customer_scope
- strategic_question
- forecast_horizon
- created_at
- updated_at

### industry_theses

- id
- project_id
- stated_category
- actual_arena
- strategic_battlefield
- inclusion_rules
- exclusion_rules
- confidence
- run_id
- accepted_at

### research_runs

- id
- project_id
- run_type
- status
- prior_run_id
- started_at
- completed_at
- current_stage
- source_count
- claim_count
- entity_count
- relationship_count
- estimated_cost
- actual_cost
- summary
- error

### entities

- id
- project_id
- entity_type
- name
- slug
- description
- website
- geography
- parent_entity_id
- metadata_json
- confidence
- freshness
- first_seen_at
- last_verified_at
- active

### relationships

- id
- project_id
- source_entity_id
- target_entity_id
- relationship_type
- label
- direction
- strength
- criticality
- replaceability
- economic_value
- value_unit
- valid_from
- valid_to
- confidence
- freshness
- inferred
- run_id

### segments

- id
- project_id
- name
- description
- parent_segment_id
- inclusion_rules
- exclusion_rules
- size_value
- size_currency
- size_period
- growth_rate
- capital_intensity
- competitive_intensity
- confidence
- last_verified_at

### entity_segments

- entity_id
- segment_id
- role
- confidence

### claims

- id
- project_id
- subject_type
- subject_id
- field_name
- claim_text
- value_json
- normalized_number
- unit
- currency
- period_start
- period_end
- geography
- claim_type
- confidence
- freshness
- valid_from
- valid_to
- last_verified_at
- prior_claim_id
- change_type
- reviewer_status

### sources

- id
- url
- domain
- title
- publisher
- author
- published_at
- accessed_at
- source_type
- source_tier
- credibility_score
- content_hash

### claim_sources

- claim_id
- source_id
- supporting_snippet
- relationship_to_claim
- extraction_confidence

### metrics

- id
- project_id
- subject_type
- subject_id
- metric_type
- value
- unit
- currency
- period
- geography
- claim_id

### terms

- id
- project_id
- term
- definition
- plain_language_definition
- synonyms
- related_entity_ids
- confidence

### forecasts

- id
- project_id
- scenario
- statement
- probability
- confidence
- horizon_date
- drivers
- counter_drivers
- leading_indicators
- focal_company_implication
- preparation_action
- run_id

### opportunities

- id
- project_id
- name
- description
- buyer
- pain
- evidence
- whitespace_reason
- opportunity_score
- implementation_risk
- status
- owner
- next_action

### threats

- id
- project_id
- name
- description
- trigger
- probability
- impact
- proximity
- threat_score
- response

### snapshots

- id
- project_id
- run_id
- created_at
- graph_json
- dashboard_json
- executive_summary

### alerts

- id
- project_id
- name
- watch_type
- criteria_json
- frequency
- active
- last_checked_at
- last_triggered_at

### notes

- id
- project_id
- target_type
- target_id
- author_id
- body
- created_at

---

# 18. Structured output contracts

The AI should never directly control the visual layout. It returns typed data. The application renders the data.

## Graph node

```ts
type IndustryNode = {
  id: string;
  type:
    | "focal_company"
    | "company"
    | "segment"
    | "customer"
    | "supplier"
    | "technology"
    | "platform"
    | "expert"
    | "institution"
    | "regulator"
    | "opportunity"
    | "threat";
  label: string;
  description: string;
  segmentId?: string;
  strategicRole?: string;
  metrics: MetricSummary[];
  confidence: number;
  freshness: number;
  isChokepoint: boolean;
  isWatched: boolean;
  sourceIds: string[];
};
```

## Graph edge

```ts
type IndustryEdge = {
  id: string;
  source: string;
  target: string;
  type:
    | "competes_with"
    | "sells_to"
    | "buys_from"
    | "supplies"
    | "builds_on"
    | "depends_on"
    | "substitutes_for"
    | "integrates_with"
    | "partners_with"
    | "funds"
    | "acquired"
    | "regulates"
    | "influences"
    | "hires_from"
    | "talent_moves_to";
  label: string;
  direction: "forward" | "reverse" | "bidirectional";
  strength: number;
  criticality?: number;
  replaceability?: number;
  economicValue?: number;
  economicUnit?: string;
  confidence: number;
  inferred: boolean;
  sourceIds: string[];
};
```

## Material claim

```ts
type MaterialClaim = {
  id: string;
  subjectId: string;
  field: string;
  text: string;
  value?: string | number;
  unit?: string;
  period?: string;
  geography?: string;
  type:
    | "verified_fact"
    | "company_reported"
    | "analyst_estimate"
    | "inference"
    | "forecast"
    | "user_provided"
    | "unverified_lead";
  confidence: number;
  freshness: number;
  lastVerifiedAt: string;
  sourceIds: string[];
  conflictingClaimIds: string[];
};
```

---

# 19. API surface

## Projects

- `POST /api/projects`
- `GET /api/projects/:projectId`
- `PATCH /api/projects/:projectId`

## Research

- `POST /api/projects/:projectId/research`
- `POST /api/projects/:projectId/refresh`
- `GET /api/research-runs/:runId`
- `POST /api/research-runs/:runId/cancel`

## Dashboard

- `GET /api/projects/:projectId/dashboard`
- `GET /api/projects/:projectId/graph`
- `GET /api/projects/:projectId/changes`
- `GET /api/projects/:projectId/snapshots`

## Entities and evidence

- `GET /api/entities/:entityId`
- `GET /api/entities/:entityId/relationships`
- `GET /api/claims/:claimId`
- `GET /api/sources/:sourceId`

## Ask the Map

- `POST /api/projects/:projectId/ask`
- `POST /api/projects/:projectId/pin-answer`

## Watchlists

- `POST /api/projects/:projectId/watch`
- `DELETE /api/watch/:watchId`
- `GET /api/projects/:projectId/alerts`

---

# 20. Recommended technical architecture

## Front end

- Next.js App Router
- TypeScript
- Tailwind CSS
- Component system such as shadcn/ui
- React Flow for the interactive graph
- A standard charting library for timelines, rankings, and market metrics

## Backend

- Next.js server routes for synchronous application APIs
- Supabase Postgres for structured data
- Supabase Auth for users and organizations
- Supabase Storage for exports and cached source documents
- Supabase Realtime for research-run status updates
- Postgres vector search for semantic retrieval over claims, notes, sources, and prior research
- Durable job orchestration for long-running research workflows
- Scheduled refresh jobs

## AI and research

- OpenAI Responses API for reasoning, tool use, structured outputs, and grounded synthesis
- Built-in web search or a replaceable search-provider adapter
- A separate source-fetch and extraction layer
- Strict schemas for every research pass
- A verifier pass for material claims
- Model adapter so the system is not locked to one model provider

## Graph rendering

Store entities and relationships in Postgres. Convert them into typed nodes and edges for React Flow.

Do not add Neo4j in the first version.

## Long-running jobs

Do not run full research inside a normal request-response server route.

Use a durable workflow or queue that can:

- Pause
- Retry
- Resume
- Stream progress
- Enforce run budgets
- Cancel safely
- Record partial completion

## Provider adapters

Create interfaces for:

- Search provider
- Page fetcher
- LLM provider
- Embedding provider
- Market-data provider
- Company-data provider

The product should survive vendor changes.

---

# 21. Cost controls

Industry research can become expensive without controls.

Each research run should define:

- Maximum search queries
- Maximum pages fetched
- Maximum tokens
- Maximum model cost
- Maximum number of entities enriched
- Priority entities
- Required source quality
- Stop conditions

## Research modes

### Fast scan

- Narrow source set
- Top entities only
- Lower cost
- Suitable for first look

### Standard map

- Complete ten-step map
- Moderate entity count
- Verification of material claims

### Deep research

- Expanded entity coverage
- Multiple sources per important claim
- Geographic submaps
- More robust market quantification
- Scenario analysis

The user should see the mode and estimated scope before starting, without forcing them to understand tokens.

---

# 22. Human control

The user must be able to correct the model.

Supported actions:

- Change industry boundary
- Merge duplicate entities
- Split a segment
- Reclassify a company
- Correct a relationship
- Replace a metric
- Add a source
- Reject a claim
- Lock an accepted claim
- Mark a fact as confidential or user-provided
- Prevent a future refresh from overwriting a locked item

The system should learn from accepted corrections inside that project.

---

# 23. Visual direction

## Style

- Premium enterprise intelligence product
- Clean and calm
- High information density without feeling crowded
- Large, readable typography
- White or very light canvas
- Dark charcoal navigation
- Spring green primary accent
- Cyan reserved for freshness or live-data states
- Minimal gradients
- No purple
- Clear contrast and accessible interaction states

## Visual hierarchy

1. Industry map
2. Company position
3. Strategic conclusions
4. Supporting metrics
5. Evidence

Do not make the dashboard look like a generic analytics template filled with unrelated cards.

The map should dominate.

---

# 24. MVP scope

## Phase 1: Useful product

Build:

- Company intake
- Industry classification
- Ten-step research pipeline
- Overview dashboard
- Interactive ecosystem map
- Segments
- Players table
- Technology flow
- Economic flow
- Opportunity and threat cards
- Source citations
- Manual Update Map button
- Snapshot history
- Ask the Map

Do not build yet:

- Complex team permissions
- Automated email alerts
- External paid databases
- Separate graph database
- Elaborate forecast animation
- Full CRM integrations

## Phase 2: Living intelligence

Add:

- Scheduled refreshes
- Watchlists
- Change alerts
- Entity dossiers
- Claim conflict resolution
- Opportunity workspace
- Custom scoring weights
- Export to report and presentation
- Collaboration and notes

## Phase 3: Strategic operating system

Add:

- Multiple companies in one portfolio
- Cross-company comparison
- Partner and acquisition matching
- Private-company and paid-data integrations
- Client-facing white-label portals
- Workflow integrations
- Automated strategic briefs
- API access
- Scenario simulation

---

# 25. Acceptance criteria for the first usable version

The product is successful when a user can:

1. Enter a company description and generate a coherent industry thesis.
2. See one connected map of segments, companies, technologies, buyers, suppliers, and institutions.
3. Switch between market, technology, economic, and talent views without loading disconnected reports.
4. Click any important item and see evidence, metrics, confidence, and relationships.
5. Understand where the focal company sits and what it depends on.
6. See ranked chokepoints, opportunities, and threats.
7. Ask a grounded question and receive a cited answer.
8. Click Update Map and see only what changed.
9. Compare the current map with a prior snapshot.
10. Correct the AI without editing the database directly.
11. Export a clean executive brief.
12. Trace every material conclusion back to evidence.

---

# 26. The key strategic design decision

The product should not be built around generating ten sections of prose.

It should be built around creating and maintaining four things:

1. Entities
2. Relationships
3. Claims
4. Evidence

Everything else is a view.

That decision is what makes the system updateable, inspectable, and reusable.

A report generator has to rewrite the report every time.

A living industry model updates the affected entities, relationships, claims, and conclusions, then automatically redraws every view.

---

# 27. Initial Tier 4 Intelligence example

For Tier 4 Intelligence, the center of the graph would be:

- Focal company: Tier 4 Intelligence
- Actual arena: Enterprise AI transformation and implementation services
- Strategic battlefield: AI-native transformation for midmarket and upper-midmarket enterprises

The first strategic cards might identify:

## Chokepoints

- Enterprise buyer trust
- Access to customer data and systems
- Platform distribution
- Security and governance approval
- Senior delivery talent

## Underserved areas

- Pilot-to-production rescue
- Midmarket AI transformation
- Agent governance and operations
- Vendor-neutral AI architecture
- Business-constraint diagnosis before implementation

## Threats

- AI development becoming easier and cheaper
- Incumbent enterprise platforms absorbing common use cases
- Large consultancies moving downmarket
- Customers building stronger internal AI teams
- Model and platform vendors controlling distribution

## Recommended position

- More strategic than a development shop
- Faster and lighter than a global systems integrator
- More technical than a traditional consultancy
- More vendor-neutral than a software platform
- More outcome-oriented than all four

This example should be seed data for development and visual testing.

---

# 28. Copy-paste build brief for an AI coding team

## Objective

Build a production-quality web application called Industry Atlas. A user enters a company name and description. The application researches the industry the company actually competes in, converts the research into a structured knowledge graph, and renders a continuously updateable industry-intelligence dashboard based on Steve Blank's Ten Steps to Map Any Industry.

## Non-negotiable product principles

1. The ten steps must be views over one shared data model, not ten independent AI-generated reports.
2. Every material claim must be connected to evidence, date, source quality, confidence, and freshness.
3. The focal company must be clearly visible in the ecosystem map.
4. The Update Map function must perform differential research and show what changed.
5. Facts, estimates, inferences, and forecasts must be visually and structurally separated.
6. Users must be able to correct the AI and lock accepted facts.
7. The AI must return structured data that the application renders. Do not let the model generate arbitrary interface markup.
8. The first version should use Postgres entity and relationship tables rather than a separate graph database.
9. Long-running research must use a durable background workflow with progress events, retries, cancellation, and run budgets.
10. The interface must feel like a premium enterprise intelligence product, not a generic analytics template.

## Required pages

- New company intake
- Overview
- Ecosystem Map
- Segments
- Players
- Technology Flow
- Economic Flow
- Talent Flow
- Experts and Sources
- History
- Forecast
- Opportunities
- Change Log
- Settings

## Required features

- Company description input
- Working industry thesis
- Structured research pipeline
- Interactive nodes and edges
- Layer filters
- Entity dossier drawer
- Evidence drawer
- Source-quality and confidence indicators
- Chokepoint scoring
- Opportunity scoring
- Threat scoring
- Ask the Map chat
- Update Map
- Quick update, selected-layer update, and full rebuild
- Prior snapshots
- Before-and-after changes
- Manual corrections
- Locked facts
- Exportable executive brief

## Recommended stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- shadcn/ui or equivalent component library
- React Flow
- Supabase Postgres, Auth, Storage, Realtime, vector search, and scheduled jobs
- OpenAI Responses API with structured outputs and web search
- Durable background workflow or queue

## First implementation sequence

1. Create the database schema.
2. Build the company intake and project shell.
3. Create typed AI output schemas.
4. Implement the industry-boundary research pass.
5. Implement segment and entity discovery.
6. Implement entity enrichment and claim storage.
7. Implement relationship extraction.
8. Build the React Flow map.
9. Build the overview and right-side dossier.
10. Add evidence and citation display.
11. Add strategic scoring.
12. Add snapshots and differential refresh.
13. Add Ask the Map.
14. Add exports.
15. Add scheduled refreshes and alerts after the manual workflow is stable.

## Definition of done

A user can enter "Tier 4 Intelligence is an AI consulting company that helps businesses implement AI solutions and builds custom AI systems" and receive a coherent, sourced, interactive, updateable map showing the ecosystem, major players, technologies, money flows, talent flows, history, forecast, Tier 4's position, chokepoints, underserved areas, opportunities, and threats.
