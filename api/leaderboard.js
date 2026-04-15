const BIN_ID = '69d75c89aaba882197dc5ee2';
const MASTER_KEY = '$2a$10$v2j06aVyWZMNAkxaPsNA7uligf2reBc/zHjnH0ULm6hshQJNs8GZ2';
const BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

const VALID_GAMES = ['duck', 'balloon', 'memory', 'whack', 'simon', 'trivia'];
const MAX_ENTRIES = 10;

async function readBin() {
  const res = await fetch(BASE + '/latest', {
    headers: { 'X-Master-Key': MASTER_KEY },
  });
  const data = await res.json();
  return data.record || {};
}

async function writeBin(record) {
  await fetch(BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
    body: JSON.stringify(record),
  });
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
    const record = await readBin();
    const leaderboards = record.leaderboards || {};
    const entries = leaderboards[game] || [];

    if (req.method === 'GET') {
      return res.status(200).json(entries);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const name = (typeof body.name === 'string' ? body.name : '').trim().slice(0, 30);
      const score = parseInt(body.score, 10);
      if (!name || isNaN(score) || score < 0) {
        return res.status(400).json({ error: 'Invalid entry' });
      }
      const entry = { name, score, ts: Date.now() };
      entries.push(entry);
      entries.sort((a, b) => b.score - a.score);
      leaderboards[game] = entries.slice(0, MAX_ENTRIES);
      await writeBin({ ...record, leaderboards });
      return res.status(200).json(leaderboards[game]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('leaderboard handler error:', e);
    return res.status(500).json({ error: String(e) });
  }
}
