# Scheme Source Inventory

This file tracks official and semi-official sources for farmer-related government schemes.

No adapter should be built for a source until its legal/access status is reviewed.

## Source status values

- `approved` → confirmed safe/legal to use
- `needs_review` → promising but not yet approved
- `manual_only` → no structured source; admin entry only
- `rejected` → cannot be used safely/legally

## Candidate sources

| Source | Type | URL | Access method | Status | Priority | Notes |
|---|---:|---|---|---|---|---|
| data.gov.in | Open data platform | https://data.gov.in | API / datasets | needs_review | High | Best first place to check for agriculture and welfare scheme datasets. |
| myScheme | Scheme repository/search portal | https://myscheme.gov.in | API or structured pages if permitted | needs_review | High | Listed as primary/default source in the project plan. Must verify terms/API availability. |
| Ministry of Agriculture & Farmers Welfare | Central ministry portal | Verify exact official URL | HTML / circulars / guidelines | needs_review | High | Useful for scheme guidelines, notifications, and official rule documents. |
| PM-KISAN | Central scheme portal | https://pmkisan.gov.in | HTML / official docs | needs_review | High | Use only public scheme-rule information. Do not access beneficiary/personal data. |
| PMFBY | Crop insurance scheme | https://pmfby.gov.in | HTML / official docs | needs_review | Medium | Important central scheme for farmers. |
| Kisan Credit Card (KCC) | Central scheme/financial scheme | Ministry/RBI/NABARD/bank pages | HTML / guidelines | needs_review | Medium | Rules may be spread across multiple institutions. |
| State agriculture department portals | State-specific schemes | State-specific | HTML / open-data portal if available | needs_review | High after state selection | Needed for schemes missing from central portals. |
| State open data portals | State datasets | State-specific | API / datasets | needs_review | Medium | Prefer these over raw HTML scraping when available. |
| Manual admin entry | Local/district schemes | N/A | Admin dashboard | approved | Ongoing | Required for schemes with no official online listing. |

## Legal/access checklist before building any adapter

Before marking a source as `approved`, check:

1. Does the source provide an official API?
2. Does the source provide open data with a license?
3. Does the website terms of use allow structured access?
4. Does `robots.txt` allow the pages we need?
5. Are we only reading public scheme information?
6. Are we avoiding personal/beneficiary data?
7. Can we rate-limit politely?
8. Can we store source URL and last-seen timestamp for audit?

## Rule

A source adapter may only run if the source is marked `legal_ok = TRUE` in the database.

This prevents accidental scraping of unapproved sources.
