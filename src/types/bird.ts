/**
 * 새 한 종의 데이터 타입.
 * - 실제 정보가 없는 항목은 빈 문자열("") / null / 빈 배열([])로 둔다.
 * - 빈 값은 화면에서 지정된 대체 문구로 표시된다.
 */

/** 출처 항목 1개 */
export interface SourceItem {
  /** 출처명 (예: 사이트·기관·도서명) */
  title: string;
  /** 원본 링크 */
  url: string;
  /** 저작자 */
  author: string;
  /** 라이선스 (예: CC BY-SA 4.0) */
  license: string;
}

/** 주요 서식 지역 1개 (세계지도 강조 단위: 국가) */
export interface HabitatRegion {
  /** ISO 3166-1 alpha-2 국가 코드 (예: KR, JP, CN) */
  code: string;
  /** 화면에 표시할 지역명 (예: 대한민국) */
  name: string;
  /** 지역 설명 (없으면 "정보를 준비하고 있어요.") */
  description: string;
}

export interface Bird {
  /** 고유 ID: 영문 소문자·숫자·하이픈. 파일명·미디어 폴더명과 동일해야 한다. */
  id: string;
  nameKo: string;
  nameEn: string;
  scientificName: string;
  info: {
    /** 특징 */
    features: string;
    /** 먹이 */
    diet: string;
    /** 서식지 */
    habitat: string;
    /** 분류 */
    taxonomy: string;
  };
  media: {
    /** 새 사진 목록 (최대 5장, 첫 번째가 대표 사진) */
    photos: string[];
    /** 대표 울음소리 파일 */
    audio: string | null;
    /** 대표 서식지 풍경 사진 */
    habitatPhoto: string | null;
  };
  habitatRegions: HabitatRegion[];
  sources: {
    birdInfo: SourceItem[];
    birdPhotos: SourceItem[];
    habitatPhoto: SourceItem[];
    audio: SourceItem[];
  };
}
