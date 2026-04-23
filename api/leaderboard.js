const SUPABASE_URL = process.env.SUPABASE_URL || 'https://aqleksrbvrqueaqgsavk.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbGVrc3JidnJxdWVhcWdzYXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDg4MjUsImV4cCI6MjA5MjUyNDgyNX0.r2YsdGGc-Rz4rX3p1fIPlTXMGdvAWB7mQNZ5kE7UEL0';

const VALID_GAMES = ['duck', 'balloon', 'memory', 'whack', 'simon', 'trivia'];
const MAX_ENTRIES = 10;

const headers = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

async function getEntries(game) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/leaderboard?game=eq.${game}&select=name,score&order=score.desc&limit=${MAX_ENTRIES}`,
    { headers }
  );
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const game = (req.query?.game || '').toLowerCase();
  if (!VALID_GAMES.includes(game)) {
    return res.status(400).json({ error: 'Invalid game' });
  }

  try {
    if (req.method === 'GET') {
      return res.status(200).json(await getEntries(game));
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const name = (typeof body.name === 'string' ? body.name : '').trim().slice(0, 30);
      const score = parseInt(body.score, 10);
      if (!name || isNaN(score) || score < 0) {
        return res.status(400).json({ error: 'Invalid entry' });
      }

      const r = await fetch(`${SUPABASE_URL}/rest/v1/leaderboard`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ game, name, score }),
      });
      if (!r.ok) throw new Error(await r.text());
      return res.status(200).json(await getEntries(game));
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('leaderboard handler error:', e);
    return res.status(500).json({ error: String(e) });
  }
}
