const API_KEY = 'HDEV-b94d67b5-51d2-4bad-9970-c248122841bf';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const { name, tag, region } = req.query;
  if (!name || !tag || !region) return res.status(400).json({ error: 'Missing name, tag or region' });

  const headers = { 'Authorization': API_KEY };
  const n = encodeURIComponent(name);
  const t = encodeURIComponent(tag);

  try {
    const [accRes, mmrRes, matchRes] = await Promise.all([
      fetch(`https://api.henrikdev.xyz/valorant/v2/account/${n}/${t}`, { headers }),
      fetch(`https://api.henrikdev.xyz/valorant/v3/mmr/${region}/pc/${n}/${t}`, { headers }),
      fetch(`https://api.henrikdev.xyz/valorant/v4/matches/${region}/pc/${n}/${t}?size=20`, { headers }),
    ]);

    const account = await accRes.json();
    const mmr = await mmrRes.json();
    const matches = await matchRes.json();

    return res.status(200).json({ account, mmr, matches });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
