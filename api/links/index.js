const { kv } = require('@vercel/kv');
const { seedLinks, uid } = require('../_seed');

const KEY = 'bu3-portal-links';

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
