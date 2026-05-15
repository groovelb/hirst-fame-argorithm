# Specimen Infographic Image Plan

Purpose: generate eight square editorial assets for a Damien Hirst specimen-count infographic. Match the existing `public/images/hirst/grotesque-bitmap-rgb-background-backup` look: 1254 x 1254 PNG, black RGB background, etched/engraved linework, and clinical grotesque specimen logic. Final assets must be post-processed into the project's cool black/blue token palette.

Target folder: `/public/images/hirst/specimen-infographic/`

## Shared Art Direction

- Format: PNG, 1254 x 1254 px, RGB, black background baked in.
- Palette: use `src/styles/themes/tokens.js`: `TOKENS.bg.dark`, `TOKENS.text.onDark`, `TOKENS.accent.brand`, and `TOKENS.accent.brandLight`. Avoid warm ivory, cream, sepia, green, or beige drift.
- Style: clinical grotesque monoline engraving, taxonomic museum plate, surgical annotation, specimen-count infographic, measured symmetry, quiet archival unease.
- Line handling: thin continuous strokes, sharp joins, etched cross-hatching only where it supports form; no broad filled shapes beyond the black background.
- Composition: leave a central read and enough negative space for overlaid numeric counts, labels, or UI copy; avoid dense texture behind likely text zones.
- Text inside image: avoid readable words and numbers unless explicitly needed later. Use placeholder ticks, blank label plaques, serial marks, and brackets instead.
- Required post-process: run `node scripts/retint-hirst-specimen-infographic.mjs` after generation. The script backs warm originals up to `/public/images/hirst/specimen-infographic/_warm-original/` and remaps luminance to the cool design tokens.

## Shared Negative Prompt

`blood, gore, splatter, exposed viscera, horror poster, jump scare, cartoon, cute, comic book, anime, neon, saturated color, colorful palette, gradients, bokeh, soft blobs, smoke effects, lens flare, photorealistic, 3D render, glossy plastic, painterly brushwork, large filled color blocks, beige paper background, white background, decorative frame, ornate flourish, illegible clutter, readable typography, watermark, logo`

## Asset Concepts

1. `/public/images/hirst/specimen-infographic/specimen-butterfly-reliquary.png`
   - Role: hero image for total animal/insect count and 2012 Tate butterfly scale.
   - Motifs: butterfly wing symmetry, reliquary geometry, pin-board taxonomy, ritual circle.

2. `/public/images/hirst/specimen-infographic/specimen-shark-vitrine.png`
   - Role: shark ledger thumbnail.
   - Motifs: formaldehyde vitrine, long suspended shark, liquid ticks, glass case.

3. `/public/images/hirst/specimen-infographic/specimen-ruminant-plate.png`
   - Role: sheep and bovine ledger thumbnail.
   - Motifs: sheep/calf plate, divided body logic, specimen pins, measurement marks.

4. `/public/images/hirst/specimen-infographic/specimen-pig.png`
   - Role: pig ledger thumbnail.
   - Motifs: isolated pig specimen, side profile, pin stand, measurement frame.

5. `/public/images/hirst/specimen-infographic/specimen-zebra.png`
   - Role: zebra ledger thumbnail.
   - Motifs: isolated zebra specimen, side profile, stripe detail, pin stand, measurement frame.

6. `/public/images/hirst/specimen-infographic/specimen-dove.png`
   - Role: dove ledger thumbnail.
   - Motifs: isolated dove specimen, side profile, vitrine frame, pin stand, measurement frame.

7. `/public/images/hirst/specimen-infographic/specimen-cockerel.png`
   - Role: cockerel ledger thumbnail.
   - Motifs: isolated cockerel specimen, side profile, tail-feather engraving, pin stand, measurement frame.

8. `/public/images/hirst/specimen-infographic/specimen-uncounted-cycle.png`
   - Role: uncounted lifecycle and live aquatic category image.
   - Motifs: flies, maggots, fish silhouettes, circular lifecycle, ghosted count marks.

## Complete Prompts

### specimen-butterfly-reliquary.png

Create a square raster engraving for a Damien Hirst specimen-count feature: nine pinned butterflies arranged as a clinical reliquary plate. Use a black museum-interface background and etched linework that will be post-processed into the project's cool white/brand-blue token palette. The image must look like a gritty bitmap mezzotint/scratchboard engraving, not SVG, not vector, not pencil. Use a ritual circle, specimen pins, blank plaques, and measured symmetry. No readable text.

Negative prompt: use the shared negative prompt.

### specimen-shark-vitrine.png

Create a square raster engraving of a preserved tiger shark suspended inside a formaldehyde vitrine. Use a black museum-interface background and etched linework that will be post-processed into the project's cool white/brand-blue token palette. Long horizontal shark, rectangular tank, faint liquid ticks, clinical measurement marks, large negative space. No ocean scene, no gore, no readable text.

Negative prompt: use the shared negative prompt.

### specimen-ruminant-plate.png

Create a square raster engraving combining a sheep and a calf/cow profile as a clinical ruminant specimen plate. Use a black museum-interface background and etched linework that will be post-processed into the project's cool white/brand-blue token palette. Include subtle bisected-body guide logic, vitrine brackets, blank plaques, specimen pins, and measurement marks. No farm scene, no gore, no readable text.

Negative prompt: use the shared negative prompt.

### specimen-pig.png

Create a square raster engraving of one isolated preserved pig specimen, side profile on a specimen plinth, held by thin clinical pins inside a measurement frame. Use a black museum-interface background and etched linework that will be post-processed into the project's cool white/brand-blue token palette. No other animals, no farm scene, no gore, no readable text.

Negative prompt: use the shared negative prompt.

### specimen-zebra.png

Create a square raster engraving of one isolated preserved zebra specimen, side profile on a specimen plinth, with precise stripe detail, thin clinical pins, blank plaque, and measurement frame. Use a black museum-interface background and etched linework that will be post-processed into the project's cool white/brand-blue token palette. No other animals, no savannah scene, no gore, no readable text.

Negative prompt: use the shared negative prompt.

### specimen-dove.png

Create a square raster engraving of one isolated preserved dove specimen, side profile on a specimen plinth, held by thin clinical pins inside a vitrine-like measurement frame. Use a black museum-interface background and etched linework that will be post-processed into the project's cool white/brand-blue token palette. No other animals, no sky scene, no gore, no readable text.

Negative prompt: use the shared negative prompt.

### specimen-cockerel.png

Create a square raster engraving of one isolated preserved cockerel specimen, side profile on a specimen plinth, with detailed comb and tail feathers, thin clinical pins, blank plaque, and measurement frame. Use a black museum-interface background and etched linework that will be post-processed into the project's cool white/brand-blue token palette. No other animals, no farm scene, no gore, no readable text.

Negative prompt: use the shared negative prompt.

### specimen-uncounted-cycle.png

Create a square raster engraving of an uncountable lifecycle diagram: flies, larvae, eggs, and small freshwater fish arranged in a clinical circular specimen system. Use a black museum-interface background and etched linework that will be post-processed into the project's cool white/brand-blue token palette. Include ghosted cycle arcs, blank plaques, and measurement ticks. No aquarium scene, no gore, no readable text.

Negative prompt: use the shared negative prompt.
