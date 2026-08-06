// 최초 배포 시 KV가 비어있을 때 채워지는 초기 데이터
// (BU3 Portal 주소.xlsx 내용을 그대로 옮김)

function uid() {
  return 'l' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function seedLinks() {
  const raw = [
    { mainCategory: '회사', accessType: '사내+외부', group: 'INTEKPLUS Project Portal', sub: '', url: 'https://portal.intekplus.com/', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'CXM', sub: 'LGES', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/CXLGES/boards/1978', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'CXM', sub: 'DISPLAY', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/CXDSP/boards/1980', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'CXM', sub: 'SK', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/CXSK/boards/1979', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'CWM', sub: '공통', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/CWMBAT/list?jql=project+%3D+CWMBAT+ORDER+BY+cf%5B10019%5D+ASC', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'WMS', sub: '업무 현황판', url: 'https://do-intekplus.atlassian.net/jira/dashboards/12673', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'WMS', sub: 'LGES', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/CWLGES/boards/2913', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'WMS', sub: 'DISPLAY', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/CWDSP/boards/2915', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'WMS', sub: 'SK', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/CWSK/boards/2914', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'PMS', sub: '현대JV 외관검사기', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/SJ/boards/4120', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'PMS', sub: 'DUV ERO 검사기', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/DUVERO/boards/4153', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'PMS', sub: 'AKM iPIS-640HX', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/PAI6/boards/5238', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'PMS', sub: 'AKM iSIS-SMTV(NTV) V3', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/PAISV/boards/5239', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'iCOMPASS', sub: '', url: 'https://service.intekplus.com/btrip/', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: 'SQR', sub: '', url: 'https://do-intekplus.atlassian.net/jira/software/c/projects/TSQR/boards/4084', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: '회의록', sub: '', url: 'https://do-intekplus.atlassian.net/wiki/spaces/lbi1bSfvdkX5/pages/1752367120', desc: '' },
    { mainCategory: '회사', accessType: '사내+외부', group: '법인카드', sub: '', url: 'https://service.intekplus.com/card/', desc: '' },
    { mainCategory: '회사', accessType: '사내전용', group: 'MAPS', sub: '', url: 'http://10.0.1.10:35711/spare-parts', desc: '' },
    { mainCategory: 'BU3', accessType: '사내+외부', group: 'Vision Alarm Manager', sub: '', url: 'https://calm-sea-0c34b3500.6.azurestaticapps.net', desc: '' },
    { mainCategory: 'BU3', accessType: '사내+외부', group: '출장일정관리', sub: '', url: 'https://pwc-ship-it.github.io/trip/', desc: '' },
    { mainCategory: 'BU3', accessType: '사내+외부', group: '구매관리', sub: '', url: 'https://intek-purchase-v2.vercel.app/', desc: '' },
    { mainCategory: 'BU3', accessType: '사내전용', group: '대시보드', sub: 'CXM(admin)', url: 'http://10.0.1.19:8001', desc: '' },
    { mainCategory: 'BU3', accessType: '사내전용', group: '대시보드', sub: 'CWM(admin)', url: 'http://10.0.1.19:8000', desc: '' },
    { mainCategory: 'BU3', accessType: '사내전용', group: '대시보드', sub: 'PMS', url: 'http://10.0.1.19:8002', desc: '' },
    { mainCategory: 'BU3', accessType: '사내전용', group: '대시보드', sub: 'SQR', url: 'http://10.0.6.19:3000/', desc: '' }
  ];
  return raw.map((l) => ({ id: uid(), ...l }));
}

module.exports = { seedLinks, uid };
