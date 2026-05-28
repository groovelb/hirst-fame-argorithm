# Kling: water-fills (empty vitrine → water-filled vitrine)

- service: fal.ai · kling-video / o1
- mode: image-to-image transition
- input: generated-images/hero-keyframes-v2/03_front_empty_frame_no_water.png
- output: generated-videos/hero-motion-kling-o1/02-water-fills.mp4
- used by: scripts/generate-hirst-kling-motion.mjs (default 2-step sequence, step 2)

## prompt

Use @Image1 as the exact first frame and @Image2 as the exact last frame.

Locked-off front-facing clinical museum object shot on a pure white catalogue background. The shark, white vitrine frame, glass tunnel perspective, rivets, angled corners, and rear rectangle remain fixed. Do not morph the shark anatomy, mouth, teeth, fins, frame, or camera.

The motion is a continuous liquid-filling process inside the existing vitrine: blue-green formaldehyde enters from the lower/back chamber and rises through the glass volume until the whole tank is filled. The liquid must look volumetric, not like a flat overlay. As the tank fills, the shark gradually becomes visibly submerged behind the front pane with cyan-green absorption, lower contrast, softened edges, subtle suspended particles, slight haze, glass thickness, and mild refraction distortion.

No splashing outside the tank, no bubbles dominating the image, no new objects, no floor, no wall, no people, no labels, no text, no watermark. The final frame should match the completed turquoise formaldehyde vitrine.
