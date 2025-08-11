import os
import subprocess
import json

VIDEO_DIR = "./assets/video"  # 작업할 폴더

def needs_conversion(filepath):
    """
    ffprobe로 moov atom 위치와 픽셀 포맷을 확인하여 변환 필요 여부 판단
    """
    try:
        # ffprobe로 mp4 메타데이터 가져오기
        cmd = [
            "ffprobe", "-v", "error",
            "-print_format", "json",
            "-show_streams",
            "-show_format",
            filepath
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        info = json.loads(result.stdout)

        # 픽셀 포맷이 yuv420p가 아니면 변환 필요
        video_streams = [s for s in info.get("streams", []) if s.get("codec_type") == "video"]
        if video_streams:
            pix_fmt = video_streams[0].get("pix_fmt", "")
            if pix_fmt != "yuv420p":
                return True

        # moov atom이 front에 있는지 확인
        # ffprobe로 moov atom 위치 직접 확인하기 어렵지만, metadata에 "isom" major_brand 체크
        # 여기서는 단순히 major_brand나 tag를 통해 faststart 적용 여부를 추정
        format_tags = info.get("format", {}).get("tags", {})
        major_brand = format_tags.get("major_brand", "")
        if "isom" not in major_brand.lower():
            return True

    except Exception as e:
        print(f"[WARN] 파일 분석 실패: {filepath}, {e}")
        return True  # 분석 실패 시 변환

    return False


def convert_video(input_path, output_path):
    """
    ffmpeg 변환 실행
    """
    cmd = [
        "ffmpeg", "-i", input_path,
        "-c:v", "libx264", "-preset", "slow", "-crf", "22", "-pix_fmt", "yuv420p",
        "-c:a", "aac", "-b:a", "128k", "-ac", "2",
        "-movflags", "+faststart",
        output_path
    ]
    subprocess.run(cmd, check=True)


def main():
    for filename in os.listdir(VIDEO_DIR):
        if filename.lower().endswith(".mp4"):
            file_path = os.path.join(VIDEO_DIR, filename)
            print(f"▶ 파일 검사 중: {file_path}")

            if needs_conversion(file_path):
                base, ext = os.path.splitext(filename)
                output_file = os.path.join(VIDEO_DIR, f"{base}_change.mp4")

                print(f"🔄 변환 시작: {file_path} → {output_file}")
                convert_video(file_path, output_file)

                # 원본 삭제
                os.remove(file_path)
                print(f"🗑 원본 삭제 완료: {file_path}")
            else:
                print(f"✅ 변환 불필요: {file_path}")


if __name__ == "__main__":
    main()