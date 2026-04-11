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

  try {
    const record = await readBin();
    const messages = record.messages || [];

    if (req.method === 'GET') {
      return res.status(200).json(messages);
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const name = (typeof body.name === 'string' ? body.name : '').trim().slice(0, 40);
      const text = (typeof body.text === 'string' ? body.text : '').trim().slice(0, 200);
      if (!name || !text) return res.status(400).json({ error: 'Invalid' });
      const msg = { name, text, ts: Date.now() };
      messages.push(msg);
      await writeBin({ ...record, messages });
      return res.status(200).json(messages);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error('messages handler error:', e);
    return res.status(500).json({ error: String(e) });
  }
}
