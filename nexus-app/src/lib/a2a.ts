const API_BASE = 'https://api.a2a.family';

export interface A2ATransaction {
  tx: string;
  caller: string | null;
  payer: string;
  payTo: string;
  agent: string;
  agentName: string;
  skill: string;
  amount: string;
  asset: string;
  usd: number;
  scheme: string;
  ms: number;
  block: number;
  at: string;
  explorer: string;
}

export interface A2AStats {
  calls24h: number;
  settled24h: number;
  callsAll: number;
  settledAll: number;
  p50ms: number;
  agents: number;
  live: number;
}

export interface A2AFeed {
  rows: A2ATransaction[];
}

async function fetchJSON<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${API_BASE}/${endpoint}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`A2A API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getA2AData() {
  const [feed, stats] = await Promise.all([
    fetchJSON<A2AFeed>('feed'),
    fetchJSON<A2AStats>('stats'),
  ]);

  return { feed, stats };
}
