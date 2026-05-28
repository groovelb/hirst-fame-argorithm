# Kling: mouth-to-portrait (shark mouth closeup → Hirst etching portrait)

- service: fal.ai · kling-video / o1
- mode: image-to-image transition
- input: shark mouth closeup (start) → monochrome etched Hirst portrait (end)
- output: generated-videos/hero-motion-kling-o1/03-mouth-to-hirst-portrait.mp4
- used by: scripts/generate-hirst-kling-motion.mjs (`--mode mouth-to-portrait`)

## prompt

Use @Image1 as the exact first frame and @Image2 as the exact last frame.

Create a smooth cinematic transition from inside the shark's open mouth into a black engraved portrait. The camera pushes forward into the dark hollow of the shark mouth. The teeth and wet gums start large at the frame edges, then slide outward and disappear as the viewer moves deeper into the black throat. The whole screen gradually becomes deep black, not by a hard cut, but through natural darkness inside the mouth.

Inside the darkness, fine white etched lines begin to appear slowly like scratches emerging from black paper. These lines coalesce into the exact monochrome portrait from the final image: centered face, black knit cap, intense eyes, shoulders fading into black. The portrait should emerge from the darkness as if drawn by light, first subtle facial contours and eyes, then the cap texture, skin hatching, beard, and clothing lines.

Keep the motion continuous and atmospheric. Preserve the first frame's shark mouth scale, teeth placement, wet preserved texture, and green-black color at the beginning. Preserve the final frame's centered portrait composition, black background, high-contrast white etched line style, serious expression, knit cap, and shoulders fading into black. No extra faces, no text, no logos, no watermark, no sudden cuts, no camera shake, no cartoon effects. The transition should feel like entering the shark mouth and finding the portrait inside the darkness.
