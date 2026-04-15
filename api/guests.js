const BIN_ID = '69d75c89aaba882197dc5ee2';
const MASTER_KEY = '$2a$10$v2j06aVyWZMNAkxaPsNA7uligf2reBc/zHjnH0ULm6hshQJNs8GZ2';
const BASE = `https://api.jsonbin.io/v3/b/${BIN_ID}`;

async function readBin() {
  const res = await fetch(BASE + '/latest', {
    headers: { 'X-Master-Key': MASTER_KEY },
  });
  const data = await res.json();
  return data.record || {};
}

async function writeGuests(record, guests) {
  await fetch(BASE, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Master-Key': MASTER_KEY },
    body: JSON.stringify({ ...record, guests }),
  });
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const record = await readBin();
    const guests = record.guests || [];

    if (req.method === 'GET') {
      return res.status(200).json(guests);
    }

    const body = req.body || {};

    if (req.method === 'POST') {
      const name = (typeof body.name === 'string' ? body.name : '').trim().slice(0, 40);
      if (!name) return res.status(400).json({ error: 'Invalid name' });
      if (!guests.includes(name)) {
        guests.push(name);
        await writeGuests(record, guests);
      }
      return res.status(200).json(guests);
    }

    if (req.method === 'DELETE') {
      const { name, password } = body;
      if (password !== 'gabi') return res.status(403).json({ error: 'wrong_password' });
      const updated = guests.filter(g => g !== name);
      await writeGuests(record, updated);
      return res.status(200).json(updated);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('handler error:', e);
    return res.status(500).json({ error: String(e) });
  }
}
