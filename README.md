ai-excited-01 entry — dragon hatching image

This program copies Justin's curated dragon image to `/output/entry.png` for the ai-excited-01 bounty. Run with:

    mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

Image facts:
- 1024x1024 JPEG
- 444,716 bytes
- sha256: 54da546c73935c65defae6e10971ffc9e0ba6ad42a23b3a5e4dc6254ff95d640

Determinism note: the program writes the image atomically and verifies the bytes; two runs produce byte-identical `/output/entry.png` files.
