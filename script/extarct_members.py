import pandas as pd
import yaml
import os
import re
from unidecode import unidecode
from PIL import Image
from openpyxl import load_workbook
from openpyxl.drawing.image import Image as XLImage
from io import BytesIO


# 악기 약어 변환 (대소문자 구분 X)
instrument_map = {
    "fl": "Flute",
    "cl": "Clarinet",
    "ob": "Oboe",
    "fg": "Bassoon",
    "hr": "Horn",
    "trp": "Trumpet",
    "trb": "Trombone",
    "tub": "Tuba",
    "vn": "Violin",
    "va": "Viola",
    "vc": "Cello",
    "cb": "Double Bass",
    "db": "Double Bass",
    "pf": "Piano",
    "perc": "Percussion",
    "hp": "Harp",
    "sax": "Saxophone",
    "cond": "Conductor",
    "timp": "Timpani",
    "euph": "Euphonium",
    "bsn": "Bassoon",
}

# 슬러그용 영문 이름 생성
def slugify(korean_name):
    return unidecode(korean_name).lower().replace(" ", "")


# <...> → 『...』로 변환
def clean_html_like_tags(text):
    return re.sub(r'<([^<>]+)>', r'『\1』', text)

# 줄 나누기 (newline 기준만 사용)
def split_lines(cell):
    if pd.isna(cell):
        return []
    lines = re.split(r'[\r\n]+', str(cell))
    return [clean_html_like_tags(line.strip()) for line in lines if line.strip()]


# Excel + 이미지 포함 처리
xlsx_path = "ignore/members.xlsx"
image_output_dir = "assets/images/members"
os.makedirs(image_output_dir, exist_ok=True)

# 워크북 로딩 (이미지 포함용)
wb = load_workbook(xlsx_path)
ws = wb.active

# 이미지 맵핑 (좌표 기준)
img_map = {}
for image in ws._images:
    row = image.anchor._from.row + 1  # openpyxl의 row index는 0-based
    img_map[row] = image

# 데이터프레임 로딩 (pandas)
df = pd.read_excel(xlsx_path)
df.columns = [col.strip() for col in df.columns]

# YAML 변환
yaml_data = []

for idx, row in df.iterrows():
    korean_name = str(row.get("이름", "")).strip()
    eng_name = slugify(korean_name)

    #     row_num = idx + 2  # openpyxl은 1-index + header 고려
    image_path = f"{image_output_dir}/{eng_name}.jpg"

    if row_num in img_map:
        pil_img = img_map[row_num]._data()
        if isinstance(pil_img, bytes):
            try:
                img = Image.open(BytesIO(pil_img)).convert("RGB")  # RGBA → RGB 변환
                img.save(image_path)
                print(f"🖼️ 이미지 저장 완료: {image_path}")
            except Exception as e:
                print(f"❌ 이미지 저장 실패: {eng_name} - {e}")
        else:
            print(f"⚠️ 이미지 데이터가 bytes가 아님: {eng_name}")
    else:
        print(f"⚠️ 이미지 없음: {korean_name}")

    # (대소문자 무시)
    raw_instr = str(row.get("악기", "")).strip().lower()
    instrument = instrument_map.get(raw_instr, raw_instr)

    member = {
        "name": korean_name,
        "instrument": instrument,
        "role": "단원",
        "education": split_lines(row.get("학력")),
        "concours": split_lines(row.get("수상내역")),
        "experience": split_lines(row.get("경력")),
        "current": split_lines(row.get("현재")),
        "image": f"/assets/images/members/{eng_name}.jpg"
    }

    yaml_data.append(member)

# YAML 파일로 저장
yaml_path = "_data/members.yml"
with open(yaml_path, "w", encoding="utf-8") as f:
    yaml.dump(yaml_data, f, allow_unicode=True, sort_keys=False)

print(f"✅ YAML 저장 완료: {yaml_path}")
