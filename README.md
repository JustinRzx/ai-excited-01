ai-excited-01 entry: golden hatch probe

This program copies Justin's curated dragon image to `/output/entry.png` for the ai-excited-01 bounty. Run it like:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Image facts: 1024x1024, 444,716 bytes, sha256 54da546c73935c65defae6e10971ffc9e0ba6ad42a23b3a5e4dc6254ff95d640.

Determinism note: the program writes `entry.png` atomically and verifies the written file matches the source; two runs are byte-identical.
