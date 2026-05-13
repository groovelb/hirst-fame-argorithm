"""
inspect_mouth_boundary.py

본체 head 영역(z<-2.0) vertex의 y-z 분포를 ASCII heatmap으로 출력해
입의 외곽(lip line) 위치를 정량 식별.

또한:
  - 이빨 mesh의 bbox와 vertex 분포 출력
  - 이빨 mesh 인접 body vertex (입 가장자리 후보) 식별
"""
import bpy
import math
from collections import defaultdict

INPUT_PATH = '/Users/ddd/Desktop/daily vibe/hirst/public/crysis_shark.glb'

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=INPUT_PATH)

body = teeth = eye = None
for obj in bpy.data.objects:
    if obj.type != 'MESH': continue
    mn = obj.data.materials[0].name.lower() if obj.data.materials and obj.data.materials[0] else ''
    if 'teeth' in mn: teeth = obj
    elif 'eye' in mn: eye = obj
    elif 'shark' in mn: body = obj

# Head region body verts (z < -2.0)
body_head_verts = [(v.co.x, v.co.y, v.co.z) for v in body.data.vertices if v.co.z < -2.0]
print(f'\n=== Body head region (z<-2.0): {len(body_head_verts)} verts ===')

# Y-Z distribution (sagittal section through head)
Y_MIN, Y_MAX = -3.0, 2.2
Z_MIN, Z_MAX = -5.0, -2.0
ROWS = 30  # y bins
COLS = 50  # z bins
y_step = (Y_MAX - Y_MIN) / ROWS
z_step = (Z_MAX - Z_MIN) / COLS

grid = [[0] * COLS for _ in range(ROWS)]
for (x, y, z) in body_head_verts:
    if Y_MIN <= y < Y_MAX and Z_MIN <= z < Z_MAX:
        yi = int((y - Y_MIN) / y_step)
        zi = int((z - Z_MIN) / z_step)
        grid[yi][zi] += 1

# ASCII heatmap
chars = ' .:-=+*#%@'

print(f'\n=== ASCII heatmap (Body head region, side view) ===')
print(f'  Y axis ↓: {Y_MIN} (DORSAL/등) to {Y_MAX} (VENTRAL/배)')
print(f'  Z axis →: {Z_MIN} (HEAD/머리) to {Z_MAX} (꼬리쪽)')
print()
print('         ' + 'Z ->'.center(COLS))
max_count = max((max(row) if row else 0) for row in grid) or 1
for yi in range(ROWS):
    y_val = Y_MIN + (yi + 0.5) * y_step
    row_chars = ''
    for zi in range(COLS):
        c = grid[yi][zi]
        idx = min(len(chars) - 1, int(c / max_count * (len(chars) - 1) + 0.5))
        row_chars += chars[idx]
    label = f'y={y_val:+.2f}'
    print(f'  {label:8s} |{row_chars}|')

# Teeth bbox + 인접 body verts
teeth_verts = [(v.co.x, v.co.y, v.co.z) for v in teeth.data.vertices]
tx = [p[0] for p in teeth_verts]; ty = [p[1] for p in teeth_verts]; tz = [p[2] for p in teeth_verts]
print(f'\n=== Teeth bbox ===')
print(f'  x: {min(tx):+.3f} .. {max(tx):+.3f}')
print(f'  y: {min(ty):+.3f} .. {max(ty):+.3f}')
print(f'  z: {min(tz):+.3f} .. {max(tz):+.3f}')

# Find body verts NEAR teeth (입 외곽 후보)
TEETH_Y_MIN, TEETH_Y_MAX = min(ty), max(ty)
TEETH_Z_MIN, TEETH_Z_MAX = min(tz), max(tz)
print(f'\n=== Body verts in teeth y-z bounding region (입 외곽 후보) ===')
margin = 0.1
near_count = 0
y_distribution = defaultdict(int)
for (x, y, z) in body_head_verts:
    if (TEETH_Z_MIN - margin <= z <= TEETH_Z_MAX + margin and
        TEETH_Y_MIN - margin <= y <= TEETH_Y_MAX + margin):
        near_count += 1
        y_bin = round(y, 2)
        y_distribution[y_bin] += 1
print(f'  count: {near_count}')
print(f'  y distribution (입 외곽 vertex의 y 분포):')
for y_b in sorted(y_distribution.keys()):
    cnt = y_distribution[y_b]
    bar = '█' * cnt
    print(f'    y={y_b:+.2f}: {bar} ({cnt})')

# 같은 z, x에 있는 가까운 y 쌍 찾기 (lip line 후보)
print(f'\n=== 가까운 y 쌍 (lip seam 후보) ===')
# Group by (x_rounded, z_rounded), look for pairs with close y
groups = defaultdict(list)
for (x, y, z) in body_head_verts:
    if TEETH_Z_MIN - 0.2 <= z <= TEETH_Z_MAX + 0.2:
        key = (round(x, 1), round(z, 2))
        groups[key].append(y)

seam_y_values = []
for key, ys in groups.items():
    if len(ys) >= 2:
        ys_sorted = sorted(ys)
        for i in range(len(ys_sorted) - 1):
            gap = ys_sorted[i+1] - ys_sorted[i]
            if gap < 0.1:  # 매우 가까운 y 쌍
                seam_y_values.append((ys_sorted[i] + ys_sorted[i+1]) / 2)

if seam_y_values:
    avg_seam_y = sum(seam_y_values) / len(seam_y_values)
    min_seam_y = min(seam_y_values)
    max_seam_y = max(seam_y_values)
    print(f'  근접 pair 개수: {len(seam_y_values)}')
    print(f'  seam y 평균: {avg_seam_y:+.3f}')
    print(f'  seam y 범위: {min_seam_y:+.3f} ~ {max_seam_y:+.3f}')
else:
    print('  근접 pair 없음 — 모델이 입을 명시적으로 닫은 형태가 아닐 수 있음')
