import type { Bird, HabitatRegion, SourceItem } from '../types/bird';

/**
 * src/data/birds/*.json 을 자동으로 모두 불러온다.
 * 새를 추가할 때는 JSON 파일 하나만 추가하면 되고, 이 파일은 수정하지 않는다.
 */
const modules = import.meta.glob<{ default: unknown }>('./birds/*.json', { eager: true });

const str = (v: unknown): string => (typeof v === 'string' ? v.trim() : '');
const strOrNull = (v: unknown): string | null => {
  const s = str(v);
  return s === '' ? null : s;
};
const arr = (v: unknown): unknown[] => (Array.isArray(v) ? v : []);
const obj = (v: unknown): Record<string, unknown> =>
  v && typeof v === 'object' && !Array.isArray(v) ? (v as Record<string, unknown>) : {};

const toSources = (v: unknown): SourceItem[] =>
  arr(v)
    .map((s) => {
      const o = obj(s);
      return { title: str(o.title), url: str(o.url), author: str(o.author), license: str(o.license) };
    })
    .filter((s) => s.title || s.url || s.author || s.license);

const toRegions = (v: unknown): HabitatRegion[] =>
  arr(v)
    .map((r) => {
      const o = obj(r);
      return { code: str(o.code).toUpperCase(), name: str(o.name), description: str(o.description) };
    })
    .filter((r) => r.code || r.name);

/**
 * 일부 값이 빠지거나 형식이 틀려도 화면 전체가 깨지지 않도록
 * 모든 항목을 안전한 기본값으로 정규화한다.
 */
export function normalizeBird(raw: unknown, fallbackId: string): Bird {
  const o = obj(raw);
  const info = obj(o.info);
  const media = obj(o.media);
  const sources = obj(o.sources);
  return {
    id: str(o.id) || fallbackId,
    nameKo: str(o.nameKo),
    nameEn: str(o.nameEn),
    scientificName: str(o.scientificName),
    info: {
      features: str(info.features),
      diet: str(info.diet),
      habitat: str(info.habitat),
      taxonomy: str(info.taxonomy),
    },
    media: {
      photos: arr(media.photos).map(str).filter(Boolean).slice(0, 5),
      audio: strOrNull(media.audio),
      habitatPhoto: strOrNull(media.habitatPhoto),
    },
    habitatRegions: toRegions(o.habitatRegions),
    sources: {
      birdInfo: toSources(sources.birdInfo),
      birdPhotos: toSources(sources.birdPhotos),
      habitatPhoto: toSources(sources.habitatPhoto),
      audio: toSources(sources.audio),
    },
  };
}

const fileId = (path: string) => path.replace(/^.*\/([^/]+)\.json$/, '$1');

/** 전체 새 목록 (파일 순서와 무관, 정렬은 화면에서 처리) */
export const birds: Bird[] = Object.entries(modules).map(([path, mod]) =>
  normalizeBird(mod.default, fileId(path)),
);

const byId = new Map(birds.map((b) => [b.id, b]));

export function getBirdById(id: string | undefined): Bird | undefined {
  return id ? byId.get(id) : undefined;
}
