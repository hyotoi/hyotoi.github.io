import pandas as pd
import yaml
import os
import re
from unidecode import unidecode
from PIL import Image
from openpyxl import load_workbook
from io import BytesIO

# 🎼 악기 약어 변환
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
    "bn": "Bassoon",
}

def slugify(korean_name):
    return unidecode(korean_name).lower().replace(" ", "")

def clean_html_like_tags(text):
    return re.sub(r'<([^<>]+)>', r'『\1』', text)

def split_lines(cell):
    if pd.isna(cell):
        return []
    lines = re.split(r'[\r\n]+', str(cell))
    return [clean_html_like_tags(line.strip()) for line in lines if line.strip()]

def extract_instrument_and_role(value):
    if pd.isna(value):
        return "", ""
    val = str(value).strip().lower().replace(" ", "")
    match = re.match(r'([a-z]+)(.+)?', val)
    if match:
        instr = match.group(1)
        role = match.group(2) if match.group(2) else "단원"
        return instrument_map.get(instr, instr), role
    return value, "단원"

# 🔧 파일 경로 설정
xlsx_path = "ignore/members.xlsx"
image_output_dir = "assets/images/members"
yaml_path = "_data/members.yml"
os.makedirs(image_output_dir, exist_ok=True)

# 📖 워크북 로딩
wb = load_workbook(xlsx_path)
ws = wb.active

# 🖼 이미지 좌표 맵
img_map = {}
for image in ws._images:
    row = image.anchor._from.row + 1
    img_map[row] = image

# 📊 엑셀 데이터 로딩
df = pd.read_excel(xlsx_path)
df.columns = [col.strip() for col in df.columns]

yaml_data = []

for idx, row in df.iterrows():
    korean_name = str(row.get("이름", "")).strip()
    eng_name = slugify(korean_name)
    row_num = idx + 2

    # 이미지 저장
    image_path = f"{image_output_dir}/{eng_name}.jpg"
    if row_num in img_map:
        pil_img = img_map[row_num]._data()
        if isinstance(pil_img, bytes):
            try:
                img = Image.open(BytesIO(pil_img)).convert("RGB")
                img.save(image_path)
                print(f"🖼️ 이미지 저장 완료: {image_path}")
            except Exception as e:
                print(f"❌ 이미지 저장 실패: {eng_name} - {e}")
    else:
        print(f"⚠️ 이미지 없음: {korean_name}")

    # 악기/직책 분리
    instrument_raw = row.get("악기", "")
    instrument, role = extract_instrument_and_role(instrument_raw)

    member = {
        "order": idx + 1,
        "name": korean_name,
        "instrument": instrument,
        "role": role,
        "education": split_lines(row.get("학력")),
        "concours": split_lines(row.get("수상내역")),
        "experience": split_lines(row.get("경력")),
        "current": split_lines(row.get("현재")),
        "image": f"/assets/images/members/{eng_name}.jpg"
    }

    yaml_data.append(member)

# YAML 저장
with open(yaml_path, "w", encoding="utf-8") as f:
    yaml.dump(yaml_data, f, allow_unicode=True, sort_keys=False)

print(f"✅ YAML 저장 완료: {yaml_path}")
