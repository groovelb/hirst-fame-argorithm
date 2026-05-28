# Kling: vitrine-forms (shark → empty vitrine)

- service: fal.ai · kling-video / o1
- mode: image-to-image transition
- input: generated-images/hero-keyframes-v2/02_front_shark_no_tank.png
- output: generated-videos/hero-motion-kling-o1/01-vitrine-forms.mp4
- used by: scripts/generate-hirst-kling-motion.mjs (default 2-step sequence, step 1)

## prompt

Use @Image1 as the exact first frame and @Image2 as the exact last frame.

Locked-off front-facing clinical museum object shot on a pure white catalogue background. The preserved frontal shark remains fixed in the same pose, scale, anatomy, open mouth, fins, and unsettling taxidermy texture. Do not morph the shark.

The motion is a physical construction transition: transparent glass planes and a thick white portrait-oriented vitrine frame assemble naturally around the shark. The chamber becomes a deep front-end tunnel with side glass planes, angled inner corners, rivet-like round details, a smaller rear rectangle, thick side and top borders, and a heavier bottom plinth.

Keep the camera completely still. No zoom, no rotation, no pan, no gallery floor, no wall, no people, no labels, no text, no watermark. The end frame must remain an empty clear tank with no turquoise liquid yet.
