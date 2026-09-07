# BU3 Site Directory

회사 · BU3 사내 시스템 링크를 모아 보여주는 포털입니다.
- 프론트엔드: 정적 `index.html` (프레임워크 없음)
- 백엔드: Vercel 서버리스 함수 (`/api/links`)
- 데이터 저장소: **Upstash Redis** (Vercel Marketplace를 통해 연결, 예전 "Vercel KV"의 후속 상품)

---

## 1. GitHub에 올리기

1. GitHub에서 새 저장소를 만듭니다 (Public/Private 아무거나 무방).
2. 이 폴더 전체를 그 저장소에 push 합니다.

```bash
cd bu3-portal
git init
git add .
git commit -m "init: BU3 site directory"
git branch -M main
git remote add origin <내 GitHub 저장소 URL>
git push -u origin main
```

## 2. Vercel에 배포하기

1. https://vercel.com 접속 → 로그인 (GitHub 계정으로 로그인하면 편함)
2. **Add New… → Project**
3. 방금 push한 GitHub 저장소를 **Import**
4. Framework Preset은 자동으로 "Other"로 잡힙니다. 별도 설정 없이 **Deploy** 클릭
5. 배포가 끝나면 `https://your-project.vercel.app` 같은 주소가 생깁니다.
   (이 시점에는 아직 KV가 연결 안 되어 있어서 `/api/links` 호출이 에러가 날 수 있습니다 — 3번 단계까지 마쳐야 정상 동작합니다.)

## 3. Upstash Redis 연결하기 (예전 "Vercel KV" 자리)

Vercel은 자체 KV 상품을 없애고, Marketplace를 통해 Upstash Redis를 연결하는 방식으로 바꿨습니다. 기능은 동일합니다.

1. 방금 만든 프로젝트 화면에서 **Storage** 탭 클릭
2. **Create Database** 클릭
3. "Marketplace Database Providers" 목록에서 **Upstash — Serverless DB (Redis, Vector, Queue, Search)** 선택
4. Upstash 계정 연결/로그인 화면이 나오면 진행 (Vercel 계정으로 바로 가입 가능)
5. Redis 데이터베이스를 새로 만들고, 지금 이 프로젝트에 **Connect**
   → `KV_REST_API_URL`, `KV_REST_API_TOKEN` 환경변수가 프로젝트에 자동으로 추가됩니다.
6. 연결 후 **Deployments** 탭 → 최신 배포 옆 `...` → **Redeploy**로 한 번 더 배포합니다.
7. 배포된 URL로 접속해서 링크 목록이 뜨는지 확인합니다. (최초 접속 시 엑셀에서 가져온 기본 25개 링크가 자동으로 채워집니다.)

## 4. 접근 범위

- 별도 로그인/비밀번호 없이, **URL만 알면 누구나 접속 가능**한 상태로 배포됩니다 (요청하신 대로).
- 나중에 접근을 제한하고 싶어지면 Vercel 프로젝트 Settings → **Deployment Protection** 에서 비밀번호/SSO 보호를 켤 수 있습니다.

## 5. 이후 업데이트 방식

- **링크 추가/수정/삭제**: 배포된 사이트에서 바로 하면 됩니다. Vercel KV에 즉시 저장되고, 접속하는 모든 사람에게 공유됩니다. 코드/GitHub 커밋과는 무관합니다.
- **디자인/기능 변경** (버튼 위치, 카테고리 구조 변경 등): 기존에 하시던 방식대로, 저에게 요청하시면 수정된 파일을 드릴 테니 그걸 GitHub 저장소에 커밋 → push 하면 Vercel이 자동으로 재배포합니다.

## 로컬에서 미리 테스트해보고 싶다면

```bash
npm i -g vercel
cd bu3-portal
npm install
vercel dev
```
`vercel dev`는 실행 중 Vercel 계정 연동을 요구하며, KV 사용을 위해 `vercel env pull`로 환경변수를 로컬로 받아와야 합니다. 로컬 테스트가 번거로우면 바로 2~3단계로 배포해서 실제 환경에서 확인하는 것을 추천합니다.
