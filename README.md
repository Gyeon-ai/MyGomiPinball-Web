# 곰이 핀볼

마이곰이 발바닥 아이콘 공으로 게임이나 당첨자를 뽑는 방송용 웹 핀볼입니다. [Marble Roulette](https://github.com/lazygyu/roulette)를 기반으로 하며 서버나 데이터베이스 없이 정적 파일로 동작합니다.

- 웹사이트: https://gyeon-ai.github.io/MyGomiPinball-Web/
- GitHub: https://github.com/Gyeon-ai/MyGomiPinball-Web

## 주요 기능

- 쉼표 또는 줄바꿈으로 후보 입력
- `이름*3` 형식으로 같은 후보의 공 개수 지정
- 첫 번째, 마지막 또는 지정 순위 당첨자 선택
- 여러 핀볼 맵과 경기 중 `1x`·`2x`·`5x` 배속
- 마이곰이 발바닥 시안 16종을 이름별로 고정 배정
- 원본 이미지의 투명 여백을 감지해 36×36 공에 비율을 유지하며 맞춤
- 당첨자 확정 후 직접 시작하는 카운트다운 타이머
- `?names=게임1,게임2` URL 매개변수로 명단 자동 입력
- 브라우저 로컬 저장 및 배포 시 최신 버전 자동 반영

## 실행과 빌드

Node.js 20 이상과 pnpm이 필요하다.

```powershell
pnpm install
pnpm dev
pnpm build
```

개발 주소는 `http://localhost:1235`이며, 정적 배포 파일은 `dist` 폴더에 생성된다.

## 이미지와 라이선스

핀볼 엔진은 [Marble Roulette](https://github.com/lazygyu/roulette)를 기반으로 하며 소스코드는 [MIT License](LICENSE)를 따른다. `Marble Roulette`와 `마블 룰렛` 명칭은 원본 프로젝트를 식별하기 위해서만 사용한다.

마이곰이 아이콘과 발바닥 시안은 MIT License 적용 대상이 아니며 각 이미지의 권리는 해당 권리자에게 있습니다. 제3자 구성요소와 이미지 사용 범위는 [NOTICE.md](NOTICE.md)를 확인하세요.
