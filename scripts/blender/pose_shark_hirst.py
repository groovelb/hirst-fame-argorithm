"""
pose_shark_hirst.py — v2 힌지 회전 방식

이전(v1)의 문제:
  - vertex를 직선으로 +y 끌어내림 → falloff 너무 약해 mouth가 거의 안 벌어짐
  - teeth 전체를 평행이동 → 위·아래 이빨이 함께 떨어져 '틀니 분리' 현상

v2 접근:
  - 하악 vertex들을 가상 턱관절(hinge) 기준으로 X축 회전
  - 회전 각도가 falloff에 비례 → 매끄러운 jaw drop, 메시 찢어짐 없음
  - 이빨은 건들지 않음 → 벌어진 입 안쪽 윗니 위치에 자연스럽게 남음

좌표계 (Blender LOCAL):
  LOCAL Z: 머리(-4.88) ↔ 꼬리(+7.44)
  LOCAL Y: 등(-3.09)   ↔ 배(+2.07)
  LOCAL X: 좌우 ±2.22
"""

import bpy
import bmesh
import math
import sys

# =========================================================================
# 파라미터
# =========================================================================

INPUT_PATH = '/Users/ddd/Desktop/daily vibe/hirst/public/crysis_shark.glb'
OUTPUT_PATH = '/Users/ddd/Desktop/daily vibe/hirst/public/shark_hirst_pose.glb'

# 가상 턱관절 위치 (LOCAL)
HINGE_Z = -2.8       # 입 뒤쪽 끝 (회전축 위치)
HINGE_Y = -0.2       # 입 윗부분 (회전축 y)

# 하악 영역
JAW_Z_HEAD = -4.88   # 머리 끝 (가장 먼 vertex 위치)
JAW_Y_THRESH = -0.1  # 이 값보다 작은 y는 제외 (등쪽)

# 회전 각도 (degrees) — 작품의 강한 벌림 재현
JAW_MAX_ANGLE_DEG = 45

# 이빨 회전 (하악과 함께 부분적으로 따라가게)
TEETH_ROT_X_DEG = 12   # 이빨도 살짝 따라 회전 (벌어진 입에 어색하지 않게)
TEETH_DROP_Y = 0.15    # 살짝만 ventral
TEETH_FORWARD_Z = 0.05 # 살짝만 뒤로 (jaw가 후퇴하니까)


# =========================================================================
# 0. Reset + Import
# =========================================================================

print('\n=== Reset + Import ===')
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=INPUT_PATH)


# =========================================================================
# 1. 메시 식별
# =========================================================================

body = None
teeth = None
eye = None
for obj in bpy.data.objects:
    if obj.type != 'MESH':
        continue
    mat_name = ''
    if obj.data.materials and obj.data.materials[0]:
        mat_name = obj.data.materials[0].name.lower()
    if 'teeth' in mat_name:
        teeth = obj
    elif 'eye' in mat_name:
        eye = obj
    elif 'shark' in mat_name:
        body = obj

if body is None or teeth is None:
    print('ERROR', file=sys.stderr); sys.exit(1)

print(f'body={body.name}, teeth={teeth.name}, eye={eye.name if eye else "-"}')


# =========================================================================
# 2. Body 하악 vertex 힌지 회전
# =========================================================================

print('\n=== Jaw hinge rotation ===')
print(f'  hinge: (y={HINGE_Y}, z={HINGE_Z})  max angle: {JAW_MAX_ANGLE_DEG}°')

bpy.context.view_layer.objects.active = body
body.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')

bm = bmesh.from_edit_mesh(body.data)
bm.verts.ensure_lookup_table()

max_angle = math.radians(JAW_MAX_ANGLE_DEG)
total_z_range = HINGE_Z - JAW_Z_HEAD  # = 2.08

count = 0
for v in bm.verts:
    # 힌지로부터 z 거리 (양수 = 머리쪽으로 떨어진 거리)
    z_dist = HINGE_Z - v.co.z
    if z_dist <= 0:
        continue  # 힌지 뒤쪽(꼬리쪽)이라 회전 제외
    # 등쪽(y<HINGE_Y-margin)은 제외 (상악은 그대로 유지)
    if v.co.y < JAW_Y_THRESH:
        continue

    # z 기반 smoothstep falloff (head 끝에 가까울수록 강한 회전)
    z_norm = min(1.0, z_dist / total_z_range)
    falloff_z = z_norm * z_norm * (3 - 2 * z_norm)

    # y 기반 falloff (ventral에 가까울수록 강함, 입 위쪽은 약함)
    y_dist = v.co.y - JAW_Y_THRESH
    y_norm = min(1.0, y_dist / 1.0)  # 0~1
    falloff_y = y_norm * y_norm * (3 - 2 * y_norm)

    # 두 falloff 결합 (둘 다 충족해야 강한 회전)
    falloff = falloff_z * (0.3 + 0.7 * falloff_y)  # y는 30% 베이스 + 70% 가변
    angle = falloff * max_angle

    if angle < 1e-5:
        continue

    # 힌지(0, HINGE_Y, HINGE_Z) 기준 X축 회전
    y_rel = v.co.y - HINGE_Y
    z_rel = v.co.z - HINGE_Z
    cos_a = math.cos(angle)
    sin_a = math.sin(angle)
    new_y_rel = y_rel * cos_a - z_rel * sin_a
    new_z_rel = y_rel * sin_a + z_rel * cos_a
    v.co.y = new_y_rel + HINGE_Y
    v.co.z = new_z_rel + HINGE_Z
    count += 1

bmesh.update_edit_mesh(body.data)
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode='OBJECT')
print(f'  rotated vertices: {count}')


# =========================================================================
# 3. Teeth 살짝만 따라가기 (틀니 분리 방지)
# =========================================================================

print('\n=== Teeth subtle follow ===')
bpy.context.view_layer.objects.active = teeth
bpy.ops.object.select_all(action='DESELECT')
teeth.select_set(True)

teeth.location.y += TEETH_DROP_Y
teeth.location.z += TEETH_FORWARD_Z
teeth.rotation_euler.x = math.radians(TEETH_ROT_X_DEG)
bpy.ops.object.transform_apply(location=True, rotation=True, scale=False)

print(f'  teeth: +y={TEETH_DROP_Y}, +z={TEETH_FORWARD_Z}, rot.x={TEETH_ROT_X_DEG}°')


# =========================================================================
# 4. Export
# =========================================================================

print('\n=== Export ===')
bpy.ops.object.select_all(action='SELECT')
bpy.ops.export_scene.gltf(
    filepath=OUTPUT_PATH,
    export_format='GLB',
    use_selection=False,
    export_apply=True,
    export_yup=True,
)
print(f'  exported: {OUTPUT_PATH}')
print('\n=== Done ===')
