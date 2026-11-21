# 새 데이터 관리 가이드

> ⚠️ 현재 이 폴더의 데이터는 **개발용 테스트 데이터**입니다.
> PDF 시안 예시 종(참새·까치·박새 등 9종)은 이름·학명만 들어 있고, `test-bird-XX.json`은 페이지네이션 확인용 가짜 데이터입니다.
> 실제 새 목록이 정해지면 이 폴더의 JSON 파일을 통째로 교체하면 됩니다.

## 새 한 종 추가하기

1. `src/data/birds/` 에 **`<id>.json`** 파일을 만든다. (예: `parus-minor.json`)
2. 사진·울음소리는 **`public/media/birds/<id>/`** 폴더에 넣는다.
3. `npm run validate-data` 로 오류가 없는지 확인한다.

코드는 수정할 필요가 없습니다. 폴더 안의 JSON 파일은 자동으로 도감에 포함됩니다.

## ID 규칙

- 영문 소문자, 숫자, 하이픈(`-`)만 사용 → 학명을 소문자+하이픈으로 바꾸는 방식을 권장 (예: `Parus minor` → `parus-minor`)
- **JSON 파일명 = `id` 값 = 미디어 폴더명** 세 가지가 같아야 합니다.
- ID는 상세 페이지 주소(`/birds/parus-minor`)와 즐겨찾기 저장값으로 쓰이므로, 한번 정하면 바꾸지 않는 것을 권장합니다.

## JSON 형식

```json
{
  "id": "parus-minor",
  "nameKo": "박새",
  "nameEn": "Japanese Tit",
  "scientificName": "Parus minor",
  "info": {
    "features": "",
    "diet": "",
    "habitat": "",
    "taxonomy": "참새목 박새과"
  },
  "media": {
    "photos": ["/media/birds/parus-minor/01.webp", "/media/birds/parus-minor/02.webp"],
    "audio": "/media/birds/parus-minor/sound.mp3",
    "habitatPhoto": "/media/birds/parus-minor/habitat.webp"
  },
  "habitatRegions": [
    { "code": "KR", "name": "대한민국", "description": "" }
  ],
  "sources": {
    "birdInfo": [],
    "birdPhotos": [
      { "title": "출처명", "url": "https://...", "author": "저작자", "license": "CC BY-SA 4.0" }
    ],
    "habitatPhoto": [],
    "audio": []
  }
}
```

| 항목 | 설명 | 비어 있을 때 화면 |
| --- | --- | --- |
| `info.features / diet / habitat / taxonomy` | 특징 / 먹이 / 서식지 / 분류 | "정보를 준비하고 있어요." |
| `media.photos` | 사진 1~5장, **첫 번째가 대표 사진** | 통일된 대체 이미지 |
| `media.audio` | 대표 울음소리 1개 (`null` 가능) | "아직 등록된 울음소리가 없어요." |
| `media.habitatPhoto` | 서식지 풍경 사진 1장 (`null` 가능) | 통일된 대체 이미지 |
| `habitatRegions` | 주요 서식 국가. `code`는 ISO 국가 코드 2글자(대문자) | 지도에 강조 없음 |
| `sources.*` | 새 정보 / 새 사진 / 서식지 사진 / 울음소리 출처 | 해당 항목 미표시 |

- 모르는 정보는 **빈 문자열 `""`**, 없는 파일은 **`null`**, 없는 목록은 **`[]`** 로 둡니다. 임의로 채우지 않습니다.

## 미디어 파일 규칙

```
public/media/birds/<id>/
  01.webp ~ 05.webp   사진 (01 = 대표 사진)
  habitat.webp        서식지 풍경
  sound.mp3           울음소리
```

- 권장 형식: 사진 `.webp`(또는 `.jpg`), 긴 변 1600px 내외 / 오디오 `.mp3`
- 사진은 화면에서 3:2 프레임 안에 **원본 비율 그대로** 표시되므로 미리 자를 필요가 없습니다.
