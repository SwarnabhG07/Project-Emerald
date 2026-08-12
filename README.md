# Farmer–Government Scheme Matching Tool
## Full Plan v2 — with Data Pipeline, Explainability, Escalation, and Offline Support

---

## 0. What's New in This Version

The original revised plan fixed the core mistakes (hashing vs encryption, similarity-search vs rule-based
eligibility, caste vs category, tenant vs owner). This version adds six features that turn the tool from a
single-service app into a proper multi-layer system:

1. Multi-source scheme aggregation pipeline
2. Scheme versioning & change tracking
3. Admin/verification dashboard
4. Partial-eligibility explainability graph
5. Escalation to human helpline
6. Offline-first / low-connectivity sync

Everything from the original plan (login via OTP+PIN, farmer profile fields, document photo upload,
encrypted storage, two-step matching, deadline SMS, regional language, duplicate-claim checks) stays as-is
and is not repeated in full here except where it connects to the new features.

---

## 1. Scheme Data Layer

### 1.1 Multi-Source Aggregation Pipeline

**Problem it solves:** Relying on one source (myScheme) means missing state-specific or ministry-specific
schemes that aren't listed there, or lagging when myScheme itself is slow to update.

**Sources to pull from:**
- myScheme (primary/default source — most schemes, well-structured)
- State agriculture department portals (state-specific schemes myScheme may not carry)
- Central schemes published directly by sponsoring ministries (PM-KISAN, PMFBY, KCC, etc.)
- Manually submitted schemes (via the admin dashboard, for local/district schemes with no online listing)

**Pipeline design:**
- Each source has its own **adapter** that converts its format into one common internal schema:
  `{name, ministry, state, category, benefits, eligibility_text, documents_needed, link, source, last_seen}`
- A **reconciliation step** runs after ingestion: schemes from different sources are matched by
  name-similarity + ministry + state, and flagged as "possible duplicate" for a human to confirm merge —
  never auto-merged silently, since a wrong merge could combine two different schemes' eligibility rules.
- A **freshness check**: each scheme record stores when it was last confirmed against its source. Schemes
  not re-confirmed within a set window (e.g., 30/60 days) are flagged for review, not silently kept.

**Why this stays safe:** No source is scraped in a way that violates site terms; adapters are built for
sources that permit structured access (open data portals, published APIs, or the admin dashboard for manual
entry when nothing else exists).

---

### 1.2 Scheme Versioning & Change Tracking

**Problem it solves:** Scheme rules change — income limits get revised, deadlines extend, new documents get
required. Farmers shown "why you qualify" need that explanation to stay accurate historically, and the team
needs to know exactly what changed and when.

**How it works:**
- Every scheme record is versioned. A change to eligibility text, benefit amount, or deadline creates a
  **new version**, not an overwrite. Old versions are kept, never deleted.
- Each version stores: what changed, when, and which source triggered the change (aggregation pipeline vs
  manual admin edit).
- The matching engine always uses the **current active version** for a live query, but every eligibility
  decision shown to a farmer stores a reference to the exact version used — so if a farmer disputes a
  rejection weeks later, the team can pull up precisely what rule was applied at that time.
- If a scheme is revised in a way that changes a farmer's existing eligibility (positively or negatively),
  they get a notification: "Rules for [Scheme] changed — you may now qualify" or "Rules changed — please
  recheck your eligibility."

---

### 1.3 Admin / Verification Dashboard

**Problem it solves:** Automated ingestion and rule-conversion (turning eligibility text into yes/no logic)
will make mistakes. A human review layer is mandatory before anything reaches farmers, since a wrong
eligibility rule can mislead someone's livelihood decision.

**Core functions:**
- **Ingestion queue:** newly pulled or updated schemes sit here until an admin approves the auto-generated
  rule logic (or edits it) before it goes live.
- **Duplicate/merge review:** confirms or rejects the aggregation pipeline's "possible duplicate" flags.
- **Manual scheme entry:** for local/district schemes with no digital source.
- **Rule editor:** a simple interface (not raw code) for a non-technical admin to adjust rule fields
  (state, category, income range, land size, age range, etc.) with a preview of "how many farmers in the
  system would now qualify" before publishing, as a sanity check.
- **Audit log:** every admin action (approve, edit, merge, reject) is logged with who did it and when.
- **Farmer feedback triage:** disputes/reports from farmers (e.g., "I was rejected but should qualify")
  route here for a human to check against the rule and either fix the rule or explain the rejection.

---

## 2. Matching Engine

### 2.1 Partial-Eligibility Explainability Graph

**Problem it solves:** The original "how can I qualify for more schemes" feature showed a flat list of
missing conditions per scheme. This doesn't show how one change (e.g., updating a certificate) can unlock
multiple schemes at once, or in what order changes are most impactful.

**How it works:**
- Model each farmer's missing conditions as **nodes** in a small dependency graph, where an edge connects a
  missing condition (e.g., "category certificate not uploaded") to every scheme it blocks.
- This lets the app say, instead of listing per-scheme gaps separately:
  *"Uploading your OBC certificate unlocks 4 additional schemes. Registering your land document unlocks 2
  more."*
- Conditions are ranked by **impact** (how many schemes they unlock) so the farmer sees the highest-value,
  easiest action first — not just an alphabetical or random list.
- The graph is rebuilt whenever the farmer's profile changes or scheme rules are updated (via the versioning
  system above), so it never goes stale.
- Every explanation stays grounded in Step 1's hard rules (Section 4 of the original plan) — the graph only
  reorganizes and prioritizes real yes/no conditions, it never introduces a similarity score or fuzzy
  ranking into the eligibility decision itself.

---

## 3. Human-in-the-Loop Layer

### 3.1 Escalation to Human Helpline

**Problem it solves:** No chatbot or automated system should be the final word when a farmer's query touches
something high-stakes (a rejected application, a disputed eligibility, a confusing rule) or when the system
genuinely doesn't know the answer.

**How it works:**
- The chatbot/query system classifies each query by type: navigation ("how do I upload a document"),
  factual lookup ("what schemes am I eligible for" — answered directly from the rule engine, not generated
  text), or dispute/uncertain ("I applied and got rejected, but the app said I qualify").
- Dispute/uncertain queries, and anything the system's confidence falls below a set threshold on, are
  **escalated automatically** — not left for the farmer to hunt for a "contact us" button.
- Escalation options, chosen based on what's available in the farmer's area:
  - Callback request routed to a human helpline agent
  - Handoff to a local agri-extension officer or Common Service Centre (CSC) agent
  - A simple ticket the farmer can track ("your query is being reviewed, expect a response by [date]")
- Every escalated case and its resolution feeds back into the admin dashboard's feedback triage (Section
  1.3), closing the loop between real farmer problems and rule corrections.

---

### 3.2 Offline-First / Low-Connectivity Sync

**Problem it solves:** Rural connectivity is inconsistent. A farmer filling in their profile or checking
schemes shouldn't lose their work or be blocked entirely when signal drops.

**How it works:**
- The app stores profile entries, document photos, and in-progress actions **locally on the device** first,
  independent of network state.
- A background sync process pushes queued changes to the server whenever a connection is available,
  and pulls down any scheme updates relevant to the farmer's profile (state, category, etc.) rather than
  the entire national dataset, to keep sync light on data usage.
- Conflict handling: if the same profile was edited both offline and on the server (e.g., an admin corrected
  a scheme rule while the farmer was offline editing their own profile), the sync process applies
  non-conflicting changes automatically and flags only genuinely conflicting fields for the farmer to
  confirm on next login — it does not overwrite silently in either direction.
- The **most recent successfully-synced scheme list** stays viewable offline (clearly labeled "last updated
  on [date]") so a farmer with no signal can still see their results, understanding they may not be
  current.
- SMS-based fallback for critical actions (OTP login, deadline reminders) continues to work independent of
  the offline sync system, since SMS doesn't need a data connection.

---

## 4. How the Pieces Connect

```
[Scheme Sources] → [Aggregation Pipeline] → [Ingestion Queue] → [Admin Dashboard: review/approve]
                                                                        │
                                                                        ▼
                                                            [Versioned Scheme Database]
                                                                        │
                                                                        ▼
                          [Farmer Profile] ──────────────► [Rule Engine: Step 1 Hard Check]
                                                                        │
                                                        ┌───────────────┴───────────────┐
                                                        ▼                               ▼
                                          [Eligible Schemes: Step 2 Sort]   [Explainability Graph:
                                                        │                     missing conditions]
                                                        ▼                               │
                                              [Farmer sees results]  ◄──────────────────┘
                                                        │
                                          ┌─────────────┼─────────────┐
                                          ▼             ▼             ▼
                                   [Chatbot/Query]  [SMS/IVR]   [Offline Sync Layer]
                                          │
                                   [Escalation to Human Helpline] ──► feeds back into
                                                                       Admin Dashboard
```

---

## 5. Phased Roadmap

### Phase 1 — MVP (core original plan)
- OTP + PIN login
- Farmer profile (all fields, single source: myScheme only)
- Step 1 hard-rule eligibility check
- Basic scheme list screen with reasons shown
- Encrypted data storage
- SMS deadline reminders

### Phase 2 — Data Reliability
- Multi-source aggregation pipeline (add state portals + manual entry)
- Scheme versioning & change tracking
- Admin/verification dashboard (ingestion queue, rule editor, audit log)
- Duplicate claim checks via Household ID

### Phase 3 — Guidance & Explainability
- Partial-eligibility explainability graph (replacing flat missing-condition lists)
- Regional language for scheme content (not just UI)
- Step 2 sorting (BM25/similarity) layered on top of Step 1 results

### Phase 4 — Human & Offline Layers
- Chatbot for navigation/FAQ queries, strictly grounded in the rule engine's own outputs
- Escalation routing to human helpline / CSC agents, with feedback loop to admin dashboard
- Offline-first sync (local storage, background sync, conflict resolution)
- Voice/IVR support

### Phase 5 — Trust & Scale
- Document authenticity checks (OCR + tamper flags for manual review)
- Cross-scheme duplicate/fraud pattern detection
- Policymaker-facing analytics dashboard (aggregate, anonymized "near-miss eligibility" data)

---

## 6. Open Questions for the Team Before Building

- Which state portals are priority for Phase 2's multi-source pipeline — start with the top 3–5 states by
  farmer registration volume, or the states with the most schemes missing from myScheme?
- Who owns the admin dashboard day-to-day — an internal team, or partner NGOs/CSC network staff trained on
  it?
- What's the escalation SLA (how fast must a helpline callback happen) and is there existing helpline
  infrastructure to route into, or does one need to be built/contracted?
- What's the acceptable data cost per sync cycle for offline mode, given farmers' typical data plans?
