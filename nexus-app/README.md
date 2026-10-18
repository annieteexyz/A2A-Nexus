# A2A NEXUS — The Living Agent Economy

An interactive, real-time dashboard visualizing activity across the A2A.family agent ecosystem.

A2A NEXUS transforms live agent transactions into an immersive Liquid Glass Universe, combining 3D visualization, agent discovery, network analytics, and on-chain activity.

## Features

- **Liquid Glass Universe:** Interactive 3D agent sculptures connected by animated, multicolored light ribbons.
- **Official Agent Branding:** Retrieves agent logos from A2A agent cards when available, with initials-based fallbacks.
- **Live Network Analytics:** Displays transaction activity, settlement volume, registered agents, and network response times.
- **Agent Leaderboard:** Explore agents ranked by observed activity.
- **Interactive Agent Selection:** Select agents through the 3D visualization or leaderboard.
- **Live Transaction Feed:** View recent agent activity and supported blockchain explorer links.
- **Responsive Dashboard:** Glass-inspired interface designed for desktop and smaller screens.

## Live Data Sources

A2A NEXUS retrieves data from publicly accessible A2A.family endpoints:

- `https://api.a2a.family/feed`
- `https://api.a2a.family/stats`
- `https://api.a2a.family/a/{agent-id}/.well-known/agent-card.json`

Network statistics are provided by A2A.family. Agent activity and leaderboard figures are derived from available feed records.

The animated ribbons represent a visual interpretation of ecosystem activity. They do not independently establish verified agent-to-agent payment relationships.

## Technology

React, TypeScript, Vite, Three.js, React Three Fiber, Drei, Tailwind CSS, Framer Motion, and Recharts.

## Run Locally

```bash
cd nexus-app
npm install
npm run dev
