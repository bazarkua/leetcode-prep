# 238. Product of Array Except Self — Tips & Approach Log

> My personal learning log for this problem. **No full solutions here.** The
> goal is to record the step-by-step *thinking* so I learn to solve it myself.
> English + Russian. Code only as small syntax snippets, when I explicitly ask.

| | |
|---|---|
| **LeetCode** | [leetcode.com/problems/product-of-array-except-self](https://leetcode.com/problems/product-of-array-except-self/) |
| **Status** | Solved (own attempt = prefix + suffix arrays via deque; optimal tightens to O(1) extra space) |
| **Notes (full walkthrough)** | [README.md](README.md) |

---

## Step-by-step approach (no code)

_How to reason from the problem statement to the optimal idea, as plain steps so
I can code it myself._

**English:**
1. Forbidden move first: the problem bans the division operation, so the obvious
   "total product ÷ nums[i]" is out. It also breaks on zeros. Don't go there.
2. Core insight: `answer[i] = (product of everything LEFT of i) × (product of
   everything RIGHT of i)`. Every element except `nums[i]` is either left or
   right of `i`, the two groups are disjoint and cover exactly who I need, and
   multiplication is associative so I can multiply group-by-group. `nums[i]` is
   never multiplied in, so no division is needed.
3. Compute the left products in one pass and the right products in another.
   Accumulate with a running variable instead of recomputing from scratch — each
   step is "previous product × one new element."
4. The clean invariant that kills all boundary branches: start the accumulator at
   `1` and **write it into the slot BEFORE folding `nums[i]` in**. `1` is the
   "nothing to the side" case (empty product), handled for free.
5. Space tighten: store the left products directly in the output array, then do
   the right pass with a single scalar variable. No second array, O(1) extra.

**По-русски:**
1. Сначала про запрет: задача запрещает деление (division), так что очевидное
   "общее произведение ÷ nums[i]" не годится. И оно ломается на нулях. Не туда.
2. Главная идея: `answer[i] = (произведение слева) × (произведение справа)`.
   Любой элемент кроме `nums[i]` лежит либо слева, либо справа, группы не
   пересекаются и покрывают всех нужных, а умножение ассоциативно, значит можно
   перемножать по группам. Сам `nums[i]` не входит, деление не нужно.
3. Левые произведения за один проход, правые за другой. Копим бегущей переменной,
   а не пересчитываем заново: каждый шаг это "прошлое произведение × один элемент".
4. Инвариант, который убирает все граничные ветки: начни накопитель с `1` и
   записывай его в ячейку ДО умножения на `nums[i]`. `1` это "слева/справа ничего"
   (пустое произведение), обрабатывается само.
5. Экономия памяти: левые произведения кладём прямо в массив ответа, правый проход
   делаем одной скалярной переменной. Второго массива нет, O(1) доп. памяти.

---

## Complexity

| approach | Time | Space |
|---|---|---|
| Brute force (re-multiply whole array per index) | O(n²) | O(1) extra |
| Division (total product ÷ nums[i]) | O(n) | O(1) extra |
| Prefix + suffix arrays (mine) | O(n) | O(n) extra |
| Prefix in output + running scalar (optimal) | O(n) | O(1) extra |

**Why (English):** brute force has an outer loop over n indices and an inner loop
of n multiplies = n·n = O(n²). The prefix/suffix idea makes 2 single passes plus
one zip pass = O(3n) = O(n). My version stores both prefix and suffix as full
arrays → O(n) extra space; replacing the suffix array with one running variable
drops it to O(1) extra (the output array doesn't count). Division is banned and
mishandles zeros, so it's disqualified despite being O(n).

**Почему (По-русски):** brute force, внешний цикл по n индексам и внутренний по n
умножений = n·n = O(n²). Идея prefix/suffix это 2 одиночных прохода плюс один zip
= O(3n) = O(n). Моя версия держит prefix и suffix как полные массивы → O(n) доп.
памяти; замена suffix-массива одной бегущей переменной снижает до O(1) (массив
ответа не считается). Деление запрещено и ломается на нулях, поэтому не годится,
хоть и O(n).

---

## Syntax snippets (only when I ask)

```python
from collections import deque
suffix = deque()
suffix.appendleft(x)                 # push to the FRONT in O(1)

zip(prefix, suffix)                  # pair up by position: (prefix[i], suffix[i])
[p * s for p, s in zip(prefix, suffix)]   # unpack each pair, no indices

range(len(nums) - 1, -1, -1)         # indices n-1 .. 0 (reverse), NOT (n, 0, -1)
```

`for p, s in zip(...)` is tuple unpacking: each pair `(prefix[i], suffix[i])` is
split straight into `p` and `s`. `zip` returns a one-time iterator — calling
`list()` on it consumes it, so don't reuse it after printing.

---

## Q&A log

_Every question I asked + the tip I got. Newest first._

### 2026-06-27 — Is my prefix/suffix + zip solution optimal? Is it ugly?
**Tip:** Correct (handles zeros for free since no division) and **time-optimal at
O(n)**, but **space is O(n)**, not the O(1) the famous follow-up asks for. It's
ugly for a real reason: the `i-2`/`i-1`/`i+1`/`i+2` branching is manual
gymnastics to handle the first/second-element boundary. The fix is the invariant
"start accumulator at 1, append BEFORE multiplying nums[i]" — that erases every
branch. To reach O(1): store left products in the output array, then fold right
products in with a single running scalar. Say out loud: "I have a working
O(n)/O(n) version, and I can tighten to O(1) extra space with the running-variable
trick."

### 2026-06-27 — Can I do the combine in one line with zip()? `pairs[i][0]*pairs[i][1] for i in pairs`
**Tip:** Three bugs. (1) `zip` is a one-time iterator; `list(pairs)` in the print
exhausts it, so the comprehension below sees nothing. (2) a `zip` object isn't
subscriptable — `pairs[i]` raises TypeError. (3) `for i in pairs` yields the pairs
(tuples), not indices, so `i` is `(p, s)` not `0,1,2`. Clean one-liner: unpack in
the comprehension → `[p * s for p, s in zip(prefix, suffix)]`. No indexing, no
reuse. If you must print, materialize once: `pairs = list(zip(prefix, suffix))`.

### 2026-06-27 — What's wrong with my suffix loop / prefix-suffix attempt?
**Tip:** Prefix was actually correct (just convoluted). The suffix broke on
`for i in range(len(nums), 0, -1)` — for len 4 that yields `4,3,2,1`, but valid
indices are `3,2,1,0`. You start out of range and never reach 0, so suffix is
shifted by one. Fix: `range(len(nums)-1, -1, -1)`. Deeper fix: the `i-2`/`i+1`
juggling is too fragile; the mirror comparisons drifted out of sync. Use
append-before-multiply from `1` and the branches vanish. `deque`/`appendleft`
isn't needed if you write into a pre-sized list by index.

### 2026-06-27 — Why does prefix × suffix give the right answer? Is there math behind it?
**Tip:** Set partition + associativity. "All elements except nums[i]" splits into
two disjoint groups: everything left of i, and everything right of i — every other
element is in exactly one. We want their product, and multiplication is
associative, so (product of left) × (product of right) = product of all-but-i.
nums[i] sits on the boundary, in neither group, so it's excluded with no division.

### 2026-06-27 — Do I need two arrays? I'm confused by left and right.
**Tip:** `left` and `right` are NUMBERS (scalars), not arrays. You need only ONE
array (the output `res`). Two ways: (A) build full `prefix[]` and `suffix[]`
arrays then `res[i] = prefix[i]*suffix[i]` → easy to picture but O(n) extra space;
(B) optimal: store prefix in `res` on pass 1, then a single `right` scalar folds
in the right products on pass 2 → O(1) extra. `left`/`right` replace whole arrays
with one running number.

### 2026-06-27 — Explain log n; I struggle with it (this problem aside).
**Tip:** This problem has NO log n — it's pure O(n). But: `log₂(n)` = "how many
times can I halve n until I reach 1?" 8→4→2→1 is 3, so log₂(8)=3; a million needs
only ~20 halvings — log grows extremely slowly, double the input adds just one
step. In code the tell is a loop variable that's MULTIPLIED/DIVIDED by a constant
(`i *= 2`, `i //= 2`), not added to (`i += 1`). Binary search halves the search
space each step → O(log n). O(n log n) (merge/heap sort) = "do log n work, n
times."

### 2026-06-27 — My division solution (total product // nums[i]) — will it work?
**Tip:** No, two reasons. (1) The problem explicitly bans the division operation —
disqualified by the constraints. (2) Buggy on zeros: with one zero, totalProduct
becomes 0, so every `0 // nums[i]` is 0, and the zero's own slot (which should be
the product of all others) gets wrongly set to 0. E.g. `[1,2,3,0]` gives
`[0,0,0,0]` but the answer is `[0,0,0,6]`. The no-division prefix/suffix approach
handles zeros for free.

---

[← Back to topic](../README.md)
