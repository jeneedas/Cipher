# Cipher

Cipher is a behavioural coordination analysis platform designed to identify suspicious patterns across large collections of online posts.

Instead of determining whether individual claims are true or false, Cipher focuses on how information spreads. It examines temporal activity, narrative similarity, and account overlap to surface patterns that may indicate coordinated behaviour.

## Overview

Coordinated information campaigns are difficult to identify through traditional fact-checking alone. Individual posts may appear unrelated when viewed independently, while their timing and behavioural patterns reveal a larger structure.

Cipher provides an analysis workspace for exploring these coordination signals and reviewing potentially suspicious clusters.

## Core Analysis Signals

- Temporal synchronisation
- Narrative similarity
- Account overlap
- Coordination cluster detection
- Behavioural risk indicators

## Current Features

- Behavioural analysis dashboard
- Coordination signal overview
- Recent analysis tracking
- Risk-level indicators
- Cluster and network navigation
- Supabase-inspired analytical interface

## Tech Stack

- React
- TypeScript
- Vite
- CSS
- Lucide React

## Project Structure

```text
src/
├── components/
│   ├── Layout.tsx
│   └── Sidebar.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── NewAnalysis.tsx
│   └── Results.tsx
├── services/
│   └── Analysis.ts
├── types/
│   └── index.ts
├── App.tsx
└── main.tsx

##Development

Clone the repository and install the required dependencies.

npm install
npm run dev

The development server will start locally using Vite.

Project Status

Cipher is currently under active development. The frontend analysis workspace and dashboard interface are being developed first, followed by dataset ingestion and behavioural coordination analysis.

Disclaimer

Cipher identifies behavioural coordination patterns. It does not classify individual claims as true or false and should not be used as an automated fact-checking system.