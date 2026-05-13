"""
Blender 좌표계 확인 v2 — 부모 hierarchy + LOCAL vertex coords 출력.
"""
import bpy

INPUT_PATH = '/Users/ddd/Desktop/daily vibe/hirst/public/crysis_shark.glb'

bpy.ops.wm.read_factory_settings(use_empty=True)
bpy.ops.import_scene.gltf(filepath=INPUT_PATH)

print('\n=== 부모 hierarchy ===\n')
for obj in bpy.data.objects:
    parent_chain = []
    p = obj.parent
    while p:
        parent_chain.append(p.name)
        p = p.parent
    print(f'{obj.name} ({obj.type})  parents={parent_chain}')
    print(f'  loc={tuple(round(v,3) for v in obj.location)}  rot_euler={tuple(round(v,3) for v in obj.rotation_euler)}')
    print(f'  matrix_world:')
    for row in obj.matrix_world:
        print(f'    {tuple(round(v,3) for v in row)}')
    print()

print('\n=== Body LOCAL vs WORLD vertex 비교 (앞쪽 5개) ===\n')
body = None
for obj in bpy.data.objects:
    if obj.type == 'MESH':
        mn = obj.data.materials[0].name.lower() if obj.data.materials and obj.data.materials[0] else ''
        if 'shark' in mn and 'teeth' not in mn and 'eye' not in mn:
            body = obj
            break

if body:
    for i, v in enumerate(body.data.vertices[:8]):
        local = v.co
        world = body.matrix_world @ v.co
        print(f'  vert[{i}]  local=({local.x:+.3f}, {local.y:+.3f}, {local.z:+.3f})   world=({world.x:+.3f}, {world.y:+.3f}, {world.z:+.3f})')

    # 모든 verts의 LOCAL bbox
    lxs = [v.co.x for v in body.data.vertices]
    lys = [v.co.y for v in body.data.vertices]
    lzs = [v.co.z for v in body.data.vertices]
    print(f'\n  LOCAL bbox: x [{min(lxs):+.3f}, {max(lxs):+.3f}]  y [{min(lys):+.3f}, {max(lys):+.3f}]  z [{min(lzs):+.3f}, {max(lzs):+.3f}]')
