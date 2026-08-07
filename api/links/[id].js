const { Redis } = require('@upstash/redis');
const { seedLinks, seedColumns } = require('../_seed');

const KEY = 'bu3-portal-links';
const COL_KEY = 'bu3-portal-columns';

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

module.exports = async function handler(req, res) {
  const { id } = req.query;

  try {
    let links = (await kv.get(KEY)) || seedLinks();
    const idx = links.findIndex((l) => l.id === id);

    if (idx === -1) {
      res.status(404).json({ error: '해당 링크를 찾을 수 없습니다.' });
      return;
    }

    if (req.method === 'PUT') {
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

      links[idx] = {
        ...links[idx],
        mainCategory,
        accessType,
        group: String(group).trim(),
        sub: sub ? String(sub).trim() : '',
        url: String(url).trim(),
        desc: desc ? String(desc).trim() : ''
      };
      await kv.set(KEY, links);
      res.status(200).json({ link: links[idx] });
      return;
    }

    if (req.method === 'DELETE') {
      const removed = links[idx];
      links.splice(idx, 1);
      await kv.set(KEY, links);
      res.status(200).json({ link: removed });
      return;
    }

    res.setHeader('Allow', 'PUT, DELETE');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
