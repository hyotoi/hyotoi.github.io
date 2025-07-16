# 📚 목차

- [공통 가이드](#공통-가이드)
  - 홈페이지 구조 이해
  - 컨텐츠 수정 방법
  - 컨텐츠 반영/배포 방법

- [메뉴별 작성법](#메뉴별-작성법)
  - [소개](#소개)
    - 비전
    - 인사말
    - 단원소개
  - [공연안내](#공연안내)
    - 공연 일정
    - 지난 공연
  - [미디어](#미디어)
    - 공연 사진
    - 공연 영상
    - 언론보도
  - [고객지원](#고객지원)
    - 문의하기
    - 공지사항

- [부록](#부록)
  - 자주 묻는 질문
  - 참고 자료



# Usage

## Workflow

```shell
📦 A 저장소 (muse_profile)
   └─ Release 발생 (published)
        ↓
   trigger-dispatch.yml → repository_dispatch("sync_triggered") 전송
        ↓
🚀 B 저장소 (hyotoi.github.io)
   └─ sync.yml → muse_profile로부터 코드 clone + commit + push
        ↓
   publishing_page.yml → sync.yml 성공 시 배포 수행
```