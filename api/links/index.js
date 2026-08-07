const { Redis } = require('@upstash/redis');
const { seedLinks, seedColumns, uid } = require('../_seed');

const KEY = 'bu3-portal-links';
const COL_KEY = 'bu3-portal-columns';

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      let links = await kv.get(KEY);
      if (!links) {
        links = seedLinks();
        await kv.set(KEY, links);
      }
      res.status(200).json({ links });
      return;
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const { mainCategory, accessType, group, sub, url, desc } = body;

      if (!mainCategory || !accessType || !group || !url) {
        res.status(400).json({ error: '대분류, 접근범위, 중분류, URL은 필수입니다.' });
        return;
      }
      if (!/^https?:\/\//i.test(url)) {
        res.status(400).json({ error: 'URL은 http:// 또는 https:// 로 시작해야 합니다.' });
        return;
      }

      const columns = (await kv.get(COL_KEY)) || seedColumns();
      const validColumn = columns.find((c) => c.mainCategory === mainCategory && c.accessType === accessType);
      if (!validColumn) {
        res.status(400).json({ error: '존재하지 않는 카테고리(그룹)입니다. 먼저 카테고리 관리에서 그룹을 추가해주세요.' });
        return;
      }

      let links = (await kv.get(KEY)) || seedLinks();
      const newLink = {
        id: uid(),
        mainCategory,
        accessType,
        group: String(group).trim(),
        sub: sub ? String(sub).trim() : '',
        url: String(url).trim(),
        desc: desc ? String(desc).trim() : ''
      };
      links.push(newLink);
      await kv.set(KEY, links);
      res.status(201).json({ link: newLink });
      return;
    }

    res.setHeader('Allow', 'GET, POST');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
