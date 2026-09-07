const { Redis } = require('@upstash/redis');
const { seedColumns, uid } = require('../_seed');

const KEY = 'bu3-portal-columns';

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      let columns = await kv.get(KEY);
      if (!columns) {
        columns = seedColumns();
        await kv.set(KEY, columns);
      }
      res.status(200).json({ columns });
      return;
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const { mainCategory, mainColor, accessType, accessStyle } = body;

      if (!mainCategory || !accessType) {
        res.status(400).json({ error: '대분류와 접근범위 이름은 필수입니다.' });
        return;
      }

      const columns = (await kv.get(KEY)) || seedColumns();
      const mc = String(mainCategory).trim();
      const at = String(accessType).trim();

      const dup = columns.find((c) => c.mainCategory === mc && c.accessType === at);
      if (dup) {
        res.status(400).json({ error: '이미 같은 대분류 + 접근범위 조합의 그룹이 있습니다.' });
        return;
      }

      const newColumn = {
        id: uid(),
        mainCategory: mc,
        mainColor: mainColor || '#5fa8ff',
        accessType: at,
        accessStyle: accessStyle === 'internal' ? 'internal' : 'public'
      };
      columns.push(newColumn);
      await kv.set(KEY, columns);
      res.status(201).json({ column: newColumn });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
