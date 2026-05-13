"""
pose_shark_hirst.py — v6 Enhanced Method A (7-phase pipeline)

Phase 1: Lip Ring 식별 (teeth → body K-nearest)
Phase 2: Upper/Lower 분리 (per-tooth y 비교)
Phase 3: Geodesic BFS (mesh edge 위 hop 거리)
Phase 4: Side 할당 (geodesic dist 비교)
Phase 5: Hinge 회전 (입 뒤 corner = teeth z_max)
Phase 6: Reversal check (seam pair 사후 검증)
Phase 7: Laplacian smoothing (anchor 유지 + 주변 평활화)
"""

import bpy
import bmesh
import math
import sys
from mathutils import kdtree
from collections import defaultdict, deque

# =========================================================================
# Parameters
# =========================================================================

INPUT_PATH = '/Users/ddd/Desktop/daily vibe/hirst/public/crysis_shark.glb'
OUTPUT_PATH = '/Users/ddd/Desktop/daily vibe/hirst/public/shark_hirst_pose.glb'

K_NEAREST = 3                    # teeth→body 최근접 K개
LIP_SEAM_TOLERANCE = 0.02        # |V.y - T.y| < eps → seam (분류 제외)
MAX_INFLUENCE_HOP = 6            # geodesic 영향 최대 hop
UPPER_JAW_ANGLE_DEG = -42        # 음수 = 상악 위로
LOWER_JAW_ANGLE_DEG = +58        # 양수 = 하악 아래로
HINGE_Z_OVERRIDE = -3.40         # 입 뒤 corner z (teeth z_max)
SMOOTH_HOPS = 3                  # 평활화 hop 반경
SMOOTH_ITERATIONS = 2
SMOOTH_FACTOR = 0.35
SEAM_PAIR_XZ_THRESHOLD = 0.08    # seam pair xz 인접 임계
TEETH_FOLLOW_RATIO = 0.85        # 이빨이 jaw 회전 따라가는 비율


# =========================================================================
# Helpers
# =========================================================================

def smoothstep(t):
    t = max(0.0, min(1.0, t))
    return t * t * (3 - 2 * t)


def rotate_yz(y, z, pivot_y, pivot_z, angle_rad):
    yr = y - pivot_y
    zr = z - pivot_z
    c = math.cos(angle_rad)
    s = math.sin(angle_rad)
    return (yr * c - zr * s + pivot_y, yr * s + zr * c + pivot_z)


# =========================================================================
# 0. Reset + Import
# =========================================================================

print('\n=== Reset + Import ===')
bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=INPUT_PATH)

body = teeth = eye = None
for obj in bpy.data.objects:
    if obj.type != 'MESH':
        continue
    mn = obj.data.materials[0].name.lower() if obj.data.materials and obj.data.materials[0] else ''
    if 'teeth' in mn: teeth = obj
    elif 'eye' in mn: eye = obj
    elif 'shark' in mn: body = obj

if not (body and teeth and eye):
    print('ERROR: meshes not identified', file=sys.stderr); sys.exit(1)

print(f'body={body.name}, teeth={teeth.name}, eye={eye.name}')

bpy.context.view_layer.objects.active = body
body.select_set(True)
bpy.ops.object.mode_set(mode='EDIT')
bm = bmesh.from_edit_mesh(body.data)
bm.verts.ensure_lookup_table()
bm.edges.ensure_lookup_table()

N = len(bm.verts)


# =========================================================================
# Phase 1: LIP_RING 식별
# =========================================================================

print('\n=== Phase 1: Lip Ring identification (K-nearest from teeth) ===')

body_kd = kdtree.KDTree(N)
for v in bm.verts:
    body_kd.insert(v.co, v.index)
body_kd.balance()

lip_ring = set()
for tv in teeth.data.vertices:
    nearest = body_kd.find_n(tv.co, K_NEAREST)
    for (_, idx, _) in nearest:
        lip_ring.add(idx)

print(f'  K={K_NEAREST}, LIP_RING size = {len(lip_ring)}')


# =========================================================================
# Phase 2: Upper / Lower 분리
# =========================================================================

print('\n=== Phase 2: Upper/Lower classification ===')

teeth_kd = kdtree.KDTree(len(teeth.data.vertices))
for i, v in enumerate(teeth.data.vertices):
    teeth_kd.insert(v.co, i)
teeth_kd.balance()

lip_upper = set()
lip_lower = set()
for v_idx in lip_ring:
    v_co = bm.verts[v_idx].co
    (_, t_idx, _) = teeth_kd.find(v_co)
    t_co = teeth.data.vertices[t_idx].co
    dy = v_co.y - t_co.y
    if dy < -LIP_SEAM_TOLERANCE:
        lip_upper.add(v_idx)
    elif dy > LIP_SEAM_TOLERANCE:
        lip_lower.add(v_idx)
    # else: seam, no rotation

print(f'  upper={len(lip_upper)}, lower={len(lip_lower)}, seam={len(lip_ring) - len(lip_upper) - len(lip_lower)}')


# =========================================================================
# Phase 3: Geodesic BFS
# =========================================================================

print('\n=== Phase 3: Geodesic BFS ===')

adj = defaultdict(list)
for e in bm.edges:
    a = e.verts[0].index
    b = e.verts[1].index
    adj[a].append(b)
    adj[b].append(a)


def bfs(sources):
    dist = [float('inf')] * N
    q = deque()
    for s in sources:
        dist[s] = 0
        q.append(s)
    while q:
        u = q.popleft()
        for nb in adj[u]:
            if dist[nb] > dist[u] + 1:
                dist[nb] = dist[u] + 1
                q.append(nb)
    return dist


dist_upper = bfs(lip_upper)
dist_lower = bfs(lip_lower)

reachable_upper = sum(1 for d in dist_upper if d != float('inf'))
reachable_lower = sum(1 for d in dist_lower if d != float('inf'))
print(f'  reachable: upper={reachable_upper}, lower={reachable_lower}')


# =========================================================================
# Phase 4: Side 할당
# =========================================================================

print('\n=== Phase 4: Side assignment ===')

sides = [None] * N  # 'upper'/'lower'/None
for i in range(N):
    du = dist_upper[i]
    dl = dist_lower[i]
    if du < dl:
        sides[i] = 'upper'
    elif du > dl:
        sides[i] = 'lower'
    # equal → None (corner, neutral)

u_cnt = sides.count('upper')
l_cnt = sides.count('lower')
n_cnt = sides.count(None)
print(f'  upper-side={u_cnt}, lower-side={l_cnt}, neutral={n_cnt}')


# =========================================================================
# Phase 5: Hinge + Rotation 적용
# =========================================================================

print('\n=== Phase 5: Rotation ===')

# Hinge y = lip_ring 평균, Hinge z = 입 뒤 corner (override)
hinge_y = sum(bm.verts[i].co.y for i in lip_ring) / len(lip_ring)
hinge_z = HINGE_Z_OVERRIDE
print(f'  hinge: y={hinge_y:.3f}, z={hinge_z:.3f}')

# 원본 좌표 snapshot (Phase 6용)
orig = {i: (v.co.x, v.co.y, v.co.z) for i, v in enumerate(bm.verts)}

upper_rad = math.radians(UPPER_JAW_ANGLE_DEG)
lower_rad = math.radians(LOWER_JAW_ANGLE_DEG)

rotated = 0
for i, v in enumerate(bm.verts):
    side = sides[i]
    if side is None:
        continue
    d = dist_upper[i] if side == 'upper' else dist_lower[i]
    if d > MAX_INFLUENCE_HOP:
        continue
    t = 1.0 - d / MAX_INFLUENCE_HOP
    influence = smoothstep(t)
    angle = (upper_rad if side == 'upper' else lower_rad) * influence
    if abs(angle) < 1e-5:
        continue
    ny, nz = rotate_yz(v.co.y, v.co.z, hinge_y, hinge_z, angle)
    v.co.y = ny
    v.co.z = nz
    rotated += 1

print(f'  rotated: {rotated} verts')


# =========================================================================
# Phase 6: Reversal check
# =========================================================================

print('\n=== Phase 6: Reversal check (seam pair) ===')

seam_pairs = []
upper_list = list(lip_upper)
lower_list = list(lip_lower)

for u_idx in upper_list:
    ux, _, uz = orig[u_idx]
    for l_idx in lower_list:
        lx, _, lz = orig[l_idx]
        dxz = ((ux - lx) ** 2 + (uz - lz) ** 2) ** 0.5
        if dxz < SEAM_PAIR_XZ_THRESHOLD:
            seam_pairs.append((u_idx, l_idx))

reversed_pairs = 0
edge_max_stretch = 0.0
for (u, l) in seam_pairs:
    uy_new = bm.verts[u].co.y
    ly_new = bm.verts[l].co.y
    if uy_new > ly_new:
        reversed_pairs += 1
    # edge length check
    u_co_new = bm.verts[u].co
    l_co_new = bm.verts[l].co
    new_dist = ((u_co_new.x - l_co_new.x) ** 2 + (u_co_new.y - l_co_new.y) ** 2 + (u_co_new.z - l_co_new.z) ** 2) ** 0.5
    u_co_old = orig[u]
    l_co_old = orig[l]
    old_dist = ((u_co_old[0] - l_co_old[0]) ** 2 + (u_co_old[1] - l_co_old[1]) ** 2 + (u_co_old[2] - l_co_old[2]) ** 2) ** 0.5
    if old_dist > 1e-6:
        stretch = new_dist / old_dist
        edge_max_stretch = max(edge_max_stretch, stretch)

print(f'  seam pairs: {len(seam_pairs)}')
print(f'  reversed (upper.y > lower.y): {reversed_pairs}')
print(f'  max stretch ratio: {edge_max_stretch:.2f}x')

if reversed_pairs > 0:
    print(f'  ⚠️  WARNING: {reversed_pairs} pairs reversed — consider reducing angles')


# =========================================================================
# Phase 7: Laplacian smoothing
# =========================================================================

print('\n=== Phase 7: Laplacian smoothing ===')

smooth_indices = set()
for i in range(N):
    if i in lip_ring:
        continue  # anchor, 고정
    if min(dist_upper[i], dist_lower[i]) <= SMOOTH_HOPS:
        smooth_indices.add(i)

smooth_verts = [bm.verts[i] for i in smooth_indices]
print(f'  smoothing {len(smooth_verts)} verts, {SMOOTH_ITERATIONS} iterations, factor={SMOOTH_FACTOR}')

for it in range(SMOOTH_ITERATIONS):
    bmesh.ops.smooth_vert(
        bm,
        verts=smooth_verts,
        factor=SMOOTH_FACTOR,
        use_axis_x=True,
        use_axis_y=True,
        use_axis_z=True,
    )

bmesh.update_edit_mesh(body.data)
bpy.ops.mesh.normals_make_consistent(inside=False)
bpy.ops.object.mode_set(mode='OBJECT')


# =========================================================================
# Teeth rotation (자기 자신 y 기준으로 upper/lower)
# =========================================================================

print('\n=== Teeth: split + follow ===')

t_upper = 0
t_lower = 0
for v in teeth.data.vertices:
    dy = v.co.y - hinge_y
    if dy < -0.005:
        angle = upper_rad * TEETH_FOLLOW_RATIO
        t_upper += 1
    elif dy > 0.005:
        angle = lower_rad * TEETH_FOLLOW_RATIO
        t_lower += 1
    else:
        continue
    ny, nz = rotate_yz(v.co.y, v.co.z, hinge_y, hinge_z, angle)
    v.co.y = ny
    v.co.z = nz

print(f'  teeth: upper={t_upper}, lower={t_lower}, follow ratio={TEETH_FOLLOW_RATIO}')


# =========================================================================
# Eye: 그대로
# =========================================================================

print('\n=== Eye: unchanged ===')


# =========================================================================
# Export
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
