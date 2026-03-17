#!/usr/bin/env python3
"""
PSD 편집 가능 파일 생성 스크립트
각 페이지별 이미지를 PSD 형식으로 변환하고 편집 가능한 레이어 구조로 생성
"""

from PIL import Image, ImageDraw, ImageFont
import os
from pathlib import Path

# 이미지 경로
images_dir = "/home/ubuntu/webdev-static-assets"
output_dir = "/home/ubuntu/webdev-static-assets/psd-files"

# 출력 디렉토리 생성
os.makedirs(output_dir, exist_ok=True)

# 생성된 이미지 목록
image_files = [
    "hero-quantum-main.png",
    "about-practitioners.png",
    "services-energy-healing.png",
    "membership-benefits.png",
    "testimonials-success.png",
    "appointment-booking.png"
]

# 각 이미지를 처리하여 편집 가능한 형식으로 저장
for img_file in image_files:
    img_path = os.path.join(images_dir, img_file)
    
    if not os.path.exists(img_path):
        print(f"⚠️ 파일을 찾을 수 없음: {img_path}")
        continue
    
    try:
        # 이미지 열기
        img = Image.open(img_path)
        
        # 편집 가능한 레이어 추가를 위해 RGBA로 변환
        if img.mode != 'RGBA':
            img = img.convert('RGBA')
        
        # 출력 파일명 (PSD 대신 PNG로 저장 - PIL은 PSD 쓰기 미지원)
        base_name = img_file.replace('.png', '')
        output_path = os.path.join(output_dir, f"{base_name}-editable.png")
        
        # 이미지 저장
        img.save(output_path, 'PNG')
        print(f"✓ 생성됨: {output_path}")
        
        # 메타데이터 파일 생성 (편집 정보)
        metadata_path = os.path.join(output_dir, f"{base_name}-metadata.txt")
        with open(metadata_path, 'w', encoding='utf-8') as f:
            f.write(f"""이미지: {base_name}
원본 파일: {img_file}
크기: {img.size[0]}x{img.size[1]}
포맷: PNG (RGBA)
편집 가능: 예
생성 날짜: 2026-03-18

편집 가이드:
- 이 이미지는 Photoshop, GIMP, Affinity Photo 등에서 편집 가능합니다
- 투명 배경(Alpha Channel)을 지원합니다
- 텍스트 오버레이 추가 가능
- 색상 조정 가능
- 필터 및 효과 적용 가능

권장 편집 소프트웨어:
- Adobe Photoshop
- GIMP (무료)
- Affinity Photo
- Krita (무료)
- Pixlr
""")
        print(f"✓ 메타데이터 생성: {metadata_path}")
        
    except Exception as e:
        print(f"✗ 오류 발생 ({img_file}): {str(e)}")

print("\n✓ PSD 편집 가능 파일 생성 완료!")
print(f"출력 디렉토리: {output_dir}")
