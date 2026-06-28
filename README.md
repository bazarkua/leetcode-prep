# LeetCode Prep — NeetCode 150

My structured run through the [NeetCode 150](https://neetcode.io/practice) on the way to crushing technical interviews. Bilingual walkthroughs (English + Russian), one folder per problem, progress tracked in a single Markdown file.

![NeetCode 150 roadmap](https://img.shields.io/badge/Problems-150-4F4ED8) ![Languages](https://img.shields.io/badge/Languages-Python%20%7C%20EN%20%7C%20RU-38b676)

## What's here

- **`PROGRESS.md`** — the tracker and roadmap. All 150 problems grouped by the 18 NeetCode topics as clickable task checkboxes. Tick a box in Obsidian and it saves straight to the file. Each line links to the problem on LeetCode and to its local notes.
- **`problems/`** — 18 topic folders, 150 problem folders. Each problem has a `README.md` (full bilingual walkthrough with code) and a `TIPS.md` (no-code step-by-step approach, complexity analysis, and a personal Q&A learning log).
- **`TIME_LOG.md`** — study-session log: date, minutes spent, problems solved.

## Folder layout

```
.
├── PROGRESS.md                         # the tracker (source of truth)
├── TIME_LOG.md                         # study-session time log
├── README.md
└── problems/
    ├── README.md                       # topic index
    ├── 01-arrays-hashing/
    │   ├── README.md                   # problems in this topic
    │   ├── 0001-two-sum/
    │   │   ├── README.md               # the walkthrough (with code)
    │   │   └── TIPS.md                  # no-code approach + Q&A log
    │   ├── 0036-valid-sudoku/
    │   ├── 0049-group-anagrams/
    │   ├── 0128-longest-consecutive-sequence/
    │   ├── 0217-contains-duplicate/
    │   └── ...
    ├── 02-two-pointers/
    │   ├── README.md
    │   ├── 0011-container-with-most-water/
    │   └── ...
    └── ...
```

Topic folders use a sequential `NN-` prefix to follow the recommended NeetCode order. Problem folders use the **actual LeetCode problem number** (zero-padded to 4 digits) so it's instantly clear which problem each directory points to. The recommended study order is preserved in each topic's `README.md` table.

## How to use it

1. Open `PROGRESS.md` in Obsidian.
2. Pick the next unsolved problem from a topic.
3. Click the LeetCode link to solve it.
4. Click the `notes` link to read the walkthrough.
5. Tick the checkbox when solved. (The `(x / y)` topic counts are plain text — update them by hand, or ask Claude to recompute.)

## What each walkthrough contains

Every problem write-up follows the same shape, mirroring how I would explain it in an actual interview:

- **Problem restated** in plain English with constraints called out
- **Example walkthrough** by hand
- **Brute-force approach** with time and space complexity
- **What's wasteful** about the brute force
- **Optimized approach** with the key insight
- **Final complexity**
- **Clean Python solution**
- **Edge cases**
- **How to say it out loud** (2-4 sentences for the interviewer)
- **Pattern tag** for recognizing variants

Each section also has a **По-русски** (Russian) companion so I keep building the English↔Russian technical vocabulary.

## Source

Problem list, recommended order, and topic dependency tree from [neetcode.io/practice](https://neetcode.io/practice). All credit to Navdeep Singh for curating the NeetCode 150.

## License

MIT — see [LICENSE](LICENSE).
