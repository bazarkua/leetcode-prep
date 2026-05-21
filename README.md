# LeetCode Prep — NeetCode 150

My structured run through the [NeetCode 150](https://neetcode.io/practice) on the way to crushing technical interviews. Bilingual walkthroughs (English + Russian), one folder per problem, progress tracked in a live HTML roadmap.

![NeetCode 150 roadmap](https://img.shields.io/badge/Problems-150-4F4ED8) ![Languages](https://img.shields.io/badge/Languages-Python%20%7C%20EN%20%7C%20RU-38b676)

## What's here

- **`index.html`** — single-file roadmap. Open it in any browser. You get the full NeetCode tree (Arrays & Hashing → ... → Math & Geometry), with a progress bar under every topic node and clickable jumps to the problem tables below.
- **`solutions/`** — 18 topic folders, 150 problem folders. Each problem has its own `README.md` (notes) and `index.html` (renders the notes locally).
- **`assets/`** — vendored [marked.js](https://github.com/markedjs/marked) for client-side Markdown rendering.

## Folder layout

```
.
├── index.html                        # the roadmap
├── README.md
├── assets/
│   └── marked.min.js
└── solutions/
    ├── README.md                     # topic index
    ├── 01-arrays-hashing/
    │   ├── README.md                 # problems in this topic
    │   ├── 01-contains-duplicate/
    │   │   ├── README.md             # the walkthrough
    │   │   └── index.html            # local renderer
    │   ├── 02-valid-anagram/
    │   │   ├── README.md
    │   │   └── index.html
    │   └── ...
    ├── 02-two-pointers/
    │   ├── README.md
    │   ├── 01-valid-palindrome/
    │   └── ...
    └── ...
```

Folders are zero-padded so directory listings sort in the recommended NeetCode order.

## How to use it

1. Open `index.html` in your browser.
2. Pick the next unsolved problem from the topic table.
3. Click the LeetCode link to solve it.
4. Click the 📝 link to read the walkthrough (rendered Markdown).

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
