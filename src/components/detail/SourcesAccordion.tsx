import { useState } from 'react';
import { Minus, Plus } from 'lucide-react';
import type { Bird, SourceItem } from '../../types/bird';

interface SourcesAccordionProps {
  sources: Bird['sources'];
}

const GROUPS: { key: keyof Bird['sources']; label: string }[] = [
  { key: 'birdInfo', label: '새 정보 출처' },
  { key: 'birdPhotos', label: '새 사진 출처' },
  { key: 'habitatPhoto', label: '서식지 사진 출처' },
  { key: 'audio', label: '울음소리 출처' },
];

function SourceRow({ item }: { item: SourceItem }) {
  return (
    <li className="text-[0.85rem] leading-relaxed text-muted">
      {item.url ? (
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline underline-offset-2 hover:opacity-80"
        >
          {item.title || item.url}
        </a>
      ) : (
        <span className="font-medium text-text">{item.title || '출처'}</span>
      )}
      {(item.author || item.license) && (
        <span className="ml-2 text-muted">
          {[item.author && `저작자: ${item.author}`, item.license && `라이선스: ${item.license}`]
            .filter(Boolean)
            .join(' · ')}
        </span>
      )}
    </li>
  );
}

/**
 * BIRD DETAIL - 접이식 출처 영역 (PDF p.5, p.9, p.19 기준)
 * - 준비되지 않은 출처는 임의로 만들어내지 않는다.
 */
export function SourcesAccordion({ sources }: SourcesAccordionProps) {
  const [open, setOpen] = useState(false);

  const populated = GROUPS.filter((g) => sources[g.key].length > 0);

  return (
    <section aria-label="출처" className="mt-8">
      <div className="rounded-[1.25rem] bg-neutral px-5 py-3.5">
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="flex w-full items-center justify-between py-0.5 text-left text-[0.95rem] font-medium text-text"
        >
          <span>출처</span>
          {open ? <Minus size={16} aria-hidden /> : <Plus size={16} aria-hidden />}
        </button>

        {open && (
          <div className="mt-3 border-t border-line pt-3">
            {populated.length === 0 ? (
              <p className="text-[0.86rem] text-muted">등록된 출처 정보가 아직 없어요.</p>
            ) : (
              <div className="space-y-3">
                {populated.map(({ key, label }) => (
                  <div key={key}>
                    <h3 className="text-[0.84rem] font-bold text-text">{label}</h3>
                    <ul className="mt-1 space-y-1">
                      {sources[key].map((item, idx) => (
                        <SourceRow key={`${key}-${idx}`} item={item} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
