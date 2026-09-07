const { Redis } = require('@upstash/redis');
const { seedColumns, seedLinks } = require('../_seed');

const COL_KEY = 'bu3-portal-columns';
const LINK_KEY = 'bu3-portal-links';

const kv = new Redis({
  url: process.env.KV_REST_API_URL,
  token: process.env.KV_REST_API_TOKEN
});

module.exports = async function handler(req, res) {
  const { id } = req.query;

  try {
    let columns = (await kv.get(COL_KEY)) || seedColumns();
    const idx = columns.findIndex((c) => c.id === id);

    if (idx === -1) {
      res.status(404).json({ error: '해당 그룹을 찾을 수 없습니다.' });
      return;
    }

    if (req.method === 'PUT') {
      const body = req.body || {};
      const { mainCategory, mainColor, accessType, accessStyle } = body;

      if (!mainCategory || !accessType) {
        res.status(400).json({ error: '대분류와 접근범위 이름은 필수입니다.' });
        return;
      }

      const mc = String(mainCategory).trim();
      const at = String(accessType).trim();

      const dup = columns.find((c) => c.id !== id && c.mainCategory === mc && c.accessType === at);
      if (dup) {
        res.status(400).json({ error: '이미 같은 대분류 + 접근범위 조합의 그룹이 있습니다.' });
        return;
      }

      const old = columns[idx];
      const oldMc = old.mainCategory;
      const oldAt = old.accessType;

      columns[idx] = {
        ...old,
        mainCategory: mc,
        mainColor: mainColor || old.mainColor,
        accessType: at,
        accessStyle: accessStyle === 'internal' ? 'internal' : 'public'
      };
      await kv.set(COL_KEY, columns);

      // 이름이 바뀐 경우, 해당 그룹에 속한 링크들의 카테고리 값도 같이 갱신
      let updatedLinks = 0;
      if (oldMc !== mc || oldAt !== at) {
        let links = (await kv.get(LINK_KEY)) || seedLinks();
        links = links.map((l) => {
          if (l.mainCategory === oldMc && l.accessType === oldAt) {
            updatedLinks++;
            return { ...l, mainCategory: mc, accessType: at };
          }
          return l;
        });
        if (updatedLinks > 0) await kv.set(LINK_KEY, links);
      }

      res.status(200).json({ column: columns[idx], updatedLinks });
      return;
    }

    if (req.method === 'DELETE') {
      const removed = columns[idx];
      columns.splice(idx, 1);
      await kv.set(COL_KEY, columns);

      // 이 그룹에 속해 있던 링크도 함께 삭제
      let links = (await kv.get(LINK_KEY)) || seedLinks();
      const before = links.length;
      links = links.filter(
        (l) => !(l.mainCategory === removed.mainCategory && l.accessType === removed.accessType)
      );
      const deletedLinks = before - links.length;
      if (deletedLinks > 0) await kv.set(LINK_KEY, links);

      res.status(200).json({ column: removed, deletedLinks });
      return;
    }

    res.setHeader('Allow', 'PUT, DELETE');
    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: '서버 오류가 발생했습니다.' });
  }
};
