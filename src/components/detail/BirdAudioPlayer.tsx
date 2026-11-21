import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from 'lucide-react';
import { TEXT } from '../../data/siteConfig';

interface BirdAudioPlayerProps {
  src: string | null;
  birdName: string;
}

function formatSec(sec: number): string {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, '0')}`;
}

/**
 * BIRD DETAIL - 새 울음소리 플레이어 (PDF p.4, p.9, p.18, p.22 기준)
 * - 직접 재생 버튼 클릭, 재생/일시정지, 진행 바, 현재/전체 시간
 * - 다른 새 상세 페이지로 이동하거나 언마운트되면 기존 재생 자동 중단
 * - 울음소리 없을 때: "아직 등록된 울음소리가 없어요."
 */
export function BirdAudioPlayer({ src, birdName }: BirdAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [loading, setLoading] = useState(false);
  const [current, setCurrent] = useState(0);
  const [duration, setDuration] = useState(0);

  // src 변경(다른 새로 이동) 또는 언마운트 시 즉시 재생 중단 및 초기화
  useEffect(() => {
    setPlaying(false);
    setLoading(false);
    setCurrent(0);
    setDuration(0);
    const el = audioRef.current;
    return () => {
      if (el) {
        el.pause();
        el.currentTime = 0;
      }
    };
  }, [src]);

  if (!src) {
    return (
      <div className="mt-5 flex items-center gap-3.5 rounded-[1.25rem] bg-sage px-4 py-3.5">
        <span
          aria-hidden="true"
          className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-muted/45 text-white"
        >
          <Play size={16} className="ml-0.5 fill-current" />
        </span>
        <span className="text-[0.9rem] text-muted">{TEXT.audioMissing}</span>
      </div>
    );
  }

  const togglePlay = async () => {
    const el = audioRef.current;
    if (!el) return;
    if (playing) {
      el.pause();
      setPlaying(false);
    } else {
      try {
        setLoading(true);
        await el.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = Number(e.target.value);
    setCurrent(next);
    if (audioRef.current) audioRef.current.currentTime = next;
  };

  const progress = duration > 0 ? (current / duration) * 100 : 0;

  return (
    <div className="mt-5 flex items-center gap-3.5 rounded-[1.25rem] bg-sage px-4 py-3.5">
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration || 0)}
        onTimeUpdate={(e) => setCurrent(e.currentTarget.currentTime)}
        onWaiting={() => setLoading(true)}
        onCanPlay={() => setLoading(false)}
        onEnded={() => {
          setPlaying(false);
          setCurrent(0);
        }}
        onError={() => {
          setPlaying(false);
          setLoading(false);
        }}
      />

      <button
        type="button"
        onClick={togglePlay}
        aria-label={playing ? `${birdName} 울음소리 일시정지` : `${birdName} 울음소리 재생`}
        className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-on-primary shadow-soft transition-transform hover:scale-105 active:scale-95"
      >
        {playing ? (
          <Pause size={16} className="fill-current" aria-hidden />
        ) : (
          <Play size={16} className="ml-0.5 fill-current" aria-hidden />
        )}
      </button>

      {loading && (
        <div
          aria-label="울음소리 불러오는 중"
          className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-sage-strong/40 border-t-primary"
        />
      )}

      <span className="w-9 shrink-0 text-right text-[0.82rem] text-muted tabular-nums">
        {formatSec(current)}
      </span>

      <input
        type="range"
        min={0}
        max={duration || 0}
        step={0.1}
        value={current}
        onChange={handleSeek}
        aria-label={`${birdName} 울음소리 재생 위치`}
        style={{
          background: `linear-gradient(to right, var(--pp-primary) ${progress}%, var(--pp-sage-strong) ${progress}%)`,
        }}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full accent-primary opacity-80"
      />

      <span className="w-9 shrink-0 text-[0.82rem] text-muted tabular-nums">
        {formatSec(duration)}
      </span>
    </div>
  );
}
