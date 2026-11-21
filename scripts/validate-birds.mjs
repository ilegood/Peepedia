// 새 데이터 검사 스크립트: npm run validate-data
// - JSON 형식, ID 규칙, ID 중복, 파일명=ID 일치
// - 사진 최대 5장, 미디어 파일 실제 존재 여부
// - 서식 지역 코드 형식, 출처 링크 형식
// 오류(error)가 있으면 빌드를 중단하고, 경고(warn)는 표시만 한다.
import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const birdsDir = join(root, 'src', 'data', 'birds');
const publicDir = join(root, 'public');

const errors = [];
const warns = [];
const ids = new Map();

const ID_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const isStr = (v) => typeof v === 'string';

function checkMedia(file, label, path) {
  if (!path) return;
  if (!isStr(path) || !path.startsWith('/media/')) {
    errors.push(`${file}: ${label} 경로는 "/media/..." 로 시작해야 해요 → ${path}`);
    return;
  }
  if (!existsSync(join(publicDir, path))) {
    errors.push(`${file}: ${label} 파일이 없어요 → public${path}`);
  }
}

function checkSources(file, key, list) {
  if (list === undefined) return;
  if (!Array.isArray(list)) {
    errors.push(`${file}: sources.${key} 는 배열이어야 해요`);
    return;
  }
  list.forEach((s, i) => {
    if (s?.url && !/^https?:\/\//.test(s.url)) {
      errors.push(`${file}: sources.${key}[${i}].url 형식이 올바르지 않아요 → ${s.url}`);
    }
  });
}

const files = readdirSync(birdsDir).filter((f) => f.endsWith('.json'));

for (const file of files) {
  let data;
  try {
    data = JSON.parse(readFileSync(join(birdsDir, file), 'utf8'));
  } catch (e) {
    errors.push(`${file}: JSON 형식 오류 → ${e.message}`);
    continue;
  }

  const expectedId = file.replace(/\.json$/, '');
  const id = data.id;
  if (!isStr(id) || !ID_RE.test(id)) {
    errors.push(`${file}: id 는 영문 소문자·숫자·하이픈만 사용해요 → ${id}`);
  } else if (id !== expectedId) {
    errors.push(`${file}: id("${id}")와 파일명("${expectedId}")이 같아야 해요`);
  }
  if (ids.has(id)) errors.push(`${file}: id 중복 → "${id}" (${ids.get(id)})`);
  ids.set(id, file);

  if (!data.nameKo) warns.push(`${file}: 한국어 이름(nameKo)이 비어 있어요`);
  if (!data.nameEn) warns.push(`${file}: 영어 이름(nameEn)이 비어 있어요`);
  if (!data.scientificName) warns.push(`${file}: 학명(scientificName)이 비어 있어요`);

  const media = data.media ?? {};
  const photos = Array.isArray(media.photos) ? media.photos : [];
  if (photos.length > 5) errors.push(`${file}: 사진은 최대 5장이에요 (현재 ${photos.length}장)`);
  photos.forEach((p, i) => checkMedia(file, `사진 ${i + 1}`, p));
  checkMedia(file, '울음소리', media.audio);
  checkMedia(file, '서식지 사진', media.habitatPhoto);

  (Array.isArray(data.habitatRegions) ? data.habitatRegions : []).forEach((r, i) => {
    if (!/^[A-Z]{2}$/.test(r?.code ?? '')) {
      errors.push(`${file}: habitatRegions[${i}].code 는 대문자 2글자 국가 코드예요 (예: KR) → ${r?.code}`);
    }
  });

  const sources = data.sources ?? {};
  for (const key of ['birdInfo', 'birdPhotos', 'habitatPhoto', 'audio']) checkSources(file, key, sources[key]);
}

console.log(`\n🐦 Peepedia 데이터 검사: 새 ${files.length}종`);
if (warns.length) {
  console.log(`\n⚠️  경고 ${warns.length}건`);
  warns.forEach((w) => console.log('  - ' + w));
}
if (errors.length) {
  console.log(`\n❌ 오류 ${errors.length}건`);
  errors.forEach((e) => console.log('  - ' + e));
  process.exit(1);
}
console.log('\n✅ 오류 없음\n');
