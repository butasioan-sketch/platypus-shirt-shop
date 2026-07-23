#!/usr/bin/env python3
# PLATYPUS — Blender headless: Import Mesh → weißes Material → GLB
# Usage (from project root):
#   blender --background --python scripts/export_glb.py -- input.glb output.glb
#   blender --background --python scripts/export_glb.py -- input.obj output.glb
#   blender --background --python scripts/export_glb.py -- input.fbx output.glb
#
# Nur bpy (Blender). Keine pip-Pakete.

import sys
from pathlib import Path

import bpy


def parse_args():
    # Everything after "--" is ours
    if "--" in sys.argv:
        args = sys.argv[sys.argv.index("--") + 1 :]
    else:
        args = []
    if len(args) < 2:
        print(
            "Usage: blender --background --python scripts/export_glb.py -- <input> <output.glb>",
            file=sys.stderr,
        )
        sys.exit(1)
    return Path(args[0]).expanduser().resolve(), Path(args[1]).expanduser().resolve()


def clear_scene():
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)
    for block in bpy.data.meshes:
        bpy.data.meshes.remove(block)
    for block in bpy.data.materials:
        bpy.data.materials.remove(block)


def import_mesh(path: Path):
    ext = path.suffix.lower()
    if ext in (".glb", ".gltf"):
        bpy.ops.import_scene.gltf(filepath=str(path))
    elif ext == ".obj":
        # Blender 4.0: wm.obj_import
        if hasattr(bpy.ops.wm, "obj_import"):
            bpy.ops.wm.obj_import(filepath=str(path))
        else:
            bpy.ops.import_scene.obj(filepath=str(path))
    elif ext == ".fbx":
        bpy.ops.import_scene.fbx(filepath=str(path))
    else:
        raise SystemExit(f"Unsupported format: {ext} (use .glb .gltf .obj .fbx)")


def make_white_material():
    mat = bpy.data.materials.new(name="PlatypusWhite")
    mat.use_nodes = True
    nodes = mat.node_tree.nodes
    links = mat.node_tree.links
    nodes.clear()
    out = nodes.new("ShaderNodeOutputMaterial")
    bsdf = nodes.new("ShaderNodeBsdfPrincipled")
    bsdf.inputs["Base Color"].default_value = (1.0, 1.0, 1.0, 1.0)
    bsdf.inputs["Metallic"].default_value = 0.0
    # Blender 4: Specular/Roughness naming
    if "Roughness" in bsdf.inputs:
        bsdf.inputs["Roughness"].default_value = 0.8
    links.new(bsdf.outputs["BSDF"], out.inputs["Surface"])
    return mat


def center_and_unit_scale(mesh_objs):
    """Join → Origin Geometry → Unit-Scale max dim 1 → Location 0 (Shop-Kamera)."""
    bpy.ops.object.select_all(action="DESELECT")
    for obj in mesh_objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objs[0]
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    if len(mesh_objs) > 1:
        bpy.ops.object.join()
    obj = bpy.context.view_layer.objects.active
    if not obj or obj.type != "MESH":
        raise SystemExit("join/center failed: no active mesh")
    bpy.ops.object.origin_set(type="ORIGIN_GEOMETRY", center="BOUNDS")
    obj.location = (0.0, 0.0, 0.0)
    max_dim = max(obj.dimensions.x, obj.dimensions.y, obj.dimensions.z, 1e-6)
    s = 1.0 / max_dim
    obj.scale = (s, s, s)
    bpy.ops.object.transform_apply(location=True, rotation=True, scale=True)
    obj.location = (0.0, 0.0, 0.0)
    print(f"center_and_unit_scale: max_dim_was={max_dim:.4f} scale={s:.6f} dims_now={tuple(obj.dimensions)}")


def apply_white_to_all_meshes():
    mat = make_white_material()
    mesh_objs = [o for o in bpy.context.scene.objects if o.type == "MESH"]
    if not mesh_objs:
        raise SystemExit("No mesh objects after import")
    for obj in mesh_objs:
        obj.data.materials.clear()
        obj.data.materials.append(mat)
        bpy.context.view_layer.objects.active = obj
        obj.select_set(True)
        try:
            bpy.ops.object.mode_set(mode="EDIT")
            bpy.ops.mesh.select_all(action="SELECT")
            bpy.ops.mesh.normals_make_consistent(inside=False)
            bpy.ops.object.mode_set(mode="OBJECT")
        except Exception as e:
            print("normals warn:", e)
            try:
                bpy.ops.object.mode_set(mode="OBJECT")
            except Exception:
                pass
    center_and_unit_scale(mesh_objs)
    bpy.ops.object.select_all(action="DESELECT")
    for obj in mesh_objs:
        obj.select_set(True)
    bpy.context.view_layer.objects.active = mesh_objs[0]
    return mesh_objs


def export_glb(path: Path):
    path.parent.mkdir(parents=True, exist_ok=True)
    # Blender 4.0 glTF export kwargs
    kwargs = dict(
        filepath=str(path),
        export_format="GLB",
        use_selection=True,
        export_texcoords=True,
        export_normals=True,
        export_materials="EXPORT",
        export_colors=False,
        export_cameras=False,
        export_lights=False,
        export_apply=True,
    )
    # Draco optional — three.js needs decoder; Shop paints materials in Shirt3D.
    # Prefer NO draco for max compatibility with useGLTF without extra loader setup.
    if "export_draco_mesh_compression_enable" in dir(bpy.ops.export_scene.gltf.get_rna_type().properties):
        kwargs["export_draco_mesh_compression_enable"] = False
    bpy.ops.export_scene.gltf(**kwargs)


def main():
    inp, out = parse_args()
    if not inp.is_file():
        raise SystemExit(f"Input not found: {inp}")
    print(f"Import: {inp}")
    clear_scene()
    import_mesh(inp)
    apply_white_to_all_meshes()
    print(f"Export: {out}")
    export_glb(out)
    print(f"OK size={out.stat().st_size} bytes")


if __name__ == "__main__":
    main()
