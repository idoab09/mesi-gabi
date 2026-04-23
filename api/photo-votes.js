const SUPABASE_URL = process.env.SUPABASE_URL || 'https://aqleksrbvrqueaqgsavk.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxbGVrc3JidnJxdWVhcWdzYXZrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzY5NDg4MjUsImV4cCI6MjA5MjUyNDgyNX0.r2YsdGGc-Rz4rX3p1fIPlTXMGdvAWB7mQNZ5kE7UEL0';

const dbHeaders = {
  'apikey': SUPABASE_ANON_KEY,
  'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
  'Content-Type': 'application/json',
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'no-store');

  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method === 'GET') {
    const session_id = (req.query?.session_id || '').trim().slice(0, 64);
    if (!session_id) return res.status(400).json({ error: 'missing_session_id' });
    try {
      const r = await fetch(
        `${SUPABASE_URL}/rest/v1/photo_votes?session_id=eq.${encodeURIComponent(session_id)}&select=photo_id,vote`,
        { headers: dbHeaders }
      );
      if (!r.ok) throw new Error(await r.text());
      return res.status(200).json(await r.json());
    } catch (e) {
      return res.status(500).json({ error: String(e) });
    }
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const body = req.body || {};
    const photo_id = typeof body.photo_id === 'string' ? body.photo_id.trim() : '';
    const session_id = typeof body.session_id === 'string' ? body.session_id.trim().slice(0, 64) : '';
    const vote = body.vote === 1 ? 1 : body.vote === -1 ? -1 : null;

    if (!photo_id || !session_id || vote === null) {
      return res.status(400).json({ error: 'invalid_params' });
    }

    // Validate photo exists
    const photoCheck = await fetch(
      `${SUPABASE_URL}/rest/v1/photos?id=eq.${encodeURIComponent(photo_id)}&select=id`,
      { headers: dbHeaders }
    );
    if (!photoCheck.ok || !(await photoCheck.json()).length) {
      return res.status(404).json({ error: 'photo_not_found' });
    }

    // Check existing vote for this session+photo
    const existingRes = await fetch(
      `${SUPABASE_URL}/rest/v1/photo_votes?photo_id=eq.${encodeURIComponent(photo_id)}&session_id=eq.${encodeURIComponent(session_id)}&select=id,vote`,
      { headers: dbHeaders }
    );
    const existing = existingRes.ok ? await existingRes.json() : [];

    if (existing.length > 0) {
      if (existing[0].vote === vote) {
        // Same vote again = toggle off (remove)
        await fetch(
          `${SUPABASE_URL}/rest/v1/photo_votes?id=eq.${encodeURIComponent(existing[0].id)}`,
          { method: 'DELETE', headers: dbHeaders }
        );
      } else {
        // Changed vote = update
        await fetch(
          `${SUPABASE_URL}/rest/v1/photo_votes?id=eq.${encodeURIComponent(existing[0].id)}`,
          { method: 'PATCH', headers: dbHeaders, body: JSON.stringify({ vote }) }
        );
      }
    } else {
      // New vote
      await fetch(`${SUPABASE_URL}/rest/v1/photo_votes`, {
        method: 'POST',
        headers: dbHeaders,
        body: JSON.stringify({ photo_id, session_id, vote }),
      });
    }

    // Return updated tally for this photo only
    const tallyRes = await fetch(
      `${SUPABASE_URL}/rest/v1/photo_votes?photo_id=eq.${encodeURIComponent(photo_id)}&select=vote`,
      { headers: dbHeaders }
    );
    const rows = tallyRes.ok ? await tallyRes.json() : [];
    const likes    = rows.filter(r => r.vote ===  1).length;
    const dislikes = rows.filter(r => r.vote === -1).length;

    // Return current session's vote (null if toggled off)
    const myVoteRes = await fetch(
      `${SUPABASE_URL}/rest/v1/photo_votes?photo_id=eq.${encodeURIComponent(photo_id)}&session_id=eq.${encodeURIComponent(session_id)}&select=vote`,
      { headers: dbHeaders }
    );
    const myRows = myVoteRes.ok ? await myVoteRes.json() : [];
    const myVote = myRows.length ? myRows[0].vote : null;

    return res.status(200).json({ photo_id, likes, dislikes, my_vote: myVote });
  } catch (e) {
    console.error('photo-votes error:', e);
    return res.status(500).json({ error: String(e) });
  }
}
