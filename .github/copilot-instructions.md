# Git 메시지 생성 규칙

Git 커밋 또는 Pull Request 메시지(제목과 본문)를 생성하거나 수정할 때마다 아래 저장소 가이드를 먼저 읽고 반드시 준수합니다.

- 커밋 메시지: `ai/prompts/commit-message-guidelines.md`
- Pull Request 제목/설명: `ai/prompts/pr-message-guidelines.md`

커밋 메시지는 가이드의 범위 규칙에 따라 Stage 영역의 변경만 분석합니다. PR 메시지는 가이드에 지정된 target branch 대비 변경 범위를 사용합니다. 가이드의 형식, 한국어 작성 규칙, type/scope 선정, 본문·footer 조건을 따르며 diff에 없는 내용을 추측하지 않습니다.

두 종류의 메시지를 함께 요청받으면 두 가이드를 모두 읽고 각각 적용합니다. 가이드가 없거나 기준을 적용할 수 없는 경우 임의로 규칙을 만들지 말고 사용자에게 확인합니다.