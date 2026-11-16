ai-excited-01 entry

This program copies Justin's curated dragon image into the grader output directory as `/output/entry.png` for the ai-excited-01 bounty. To run locally: `mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts`.

Image facts:
- Size: 1024x1024
- Bytes: 444,716
- SHA256: 54da546c73935c65defae6e10971ffc9e0ba6ad42a23b3a5e4dc6254ff95d640

Determinism: the program writes the same bytes on every run (the grader runs it twice from different working directories and the copies are byte-identical).

