#!/usr/bin/env python3
import os
import yaml
import re

POSTS_DIR = "_posts/concert"
ASSETS_ROOT = "assets/images/concert"

def find_posts():
    posts = []
    for fname in os.listdir(POSTS_DIR):
        if fname.endswith(".md"):
            posts.append(os.path.join(POSTS_DIR, fname))
    return posts

def update_gallery(post_path):
    # 파일명에서 slug 추출: YYYY-MM-DD-slug.md → YYYY-MM-DD-slug
    fname = os.path.basename(post_path)
    slug_match = re.match(r"(.+?)\.md$", fname)
    if not slug_match:
        print(f"[WARN] slug를 추출할 수 없습니다: {fname}")
        return
    slug = slug_match.group(1)
    images_dir = os.path.join(ASSETS_ROOT, slug)

    if not os.path.isdir(images_dir):
        print(f"[WARN] 이미지 디렉토리가 없습니다: {images_dir}")
        return

    # 이미지 리스트 구성
    image_files = sorted(
        f for f in os.listdir(images_dir)
        if os.path.isfile(os.path.join(images_dir, f))
        and f.lower() != "poster.png"
        and f.lower().endswith((".png", ".jpg", ".jpeg", ".gif"))
    )
    gallery = [
        {
            "url": f"/{images_dir}/{img}",
            "image_path": f"/{images_dir}/{img}",
        }
        for img in image_files
    ]

    print(f"[INFO] {fname}: {len(gallery)}개의 이미지 발견.")

    # 포스트 Front Matter 읽기
    with open(post_path, "r", encoding="utf-8") as f:
        content = f.read()

    # YAML Front Matter 구분
    match = re.match(r"(?s)^---\n(.*?)\n---\n(.*)$", content)
    if not match:
        print(f"[WARN] Front Matter를 찾을 수 없습니다: {fname}")
        return

    front_matter_raw, post_body = match.groups()
    front_matter = yaml.safe_load(front_matter_raw)

    # gallery 갱신
    front_matter["gallery"] = gallery

    # 새로운 파일 내용 작성
    new_front_matter_raw = yaml.dump(front_matter, sort_keys=False, allow_unicode=True)
    new_content = f"---\n{new_front_matter_raw}---\n{post_body}"

    with open(post_path, "w", encoding="utf-8") as f:
        f.write(new_content)
    print(f"[SUCCESS] Front Matter 갱신 완료: {post_path}")

def main():
    posts = find_posts()
    print(f"[INFO] 총 {len(posts)}개의 포스트를 찾았습니다.")
    for post in posts:
        update_gallery(post)

if __name__ == "__main__":
    main()
