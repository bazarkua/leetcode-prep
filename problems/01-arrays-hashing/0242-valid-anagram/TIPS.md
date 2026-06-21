# 242. Valid Anagram — Tips & Approach Log

> My personal learning log for this problem. **No full solutions here.** The
> goal is to record the step-by-step *thinking* so I learn to solve it myself.
> English + Russian. Code only as small syntax snippets, when I explicitly ask.

| | |
|---|---|
| **LeetCode** | [leetcode.com/problems/valid-anagram](https://leetcode.com/problems/valid-anagram/) |
| **Status** | Solved (own attempt, correct) |
| **Notes (full walkthrough)** | [README.md](README.md) |

---

## Step-by-step approach (no code)

_How to reason from the problem statement to the optimal idea, as plain steps._

**English:**
1. Realize an anagram is defined only by *how many of each letter*, not order.
2. First gate: if the two strings have different lengths, it's instantly not an
   anagram. Return false.
3. Build a frequency table for `s` (count of each character).
4. Walk through `t` and subtract one from the table for each character.
5. If a count ever goes negative, `t` needs a letter `s` doesn't have enough of:
   not an anagram. If everything ends at zero, it is one.

**По-русски:**
1. Понять, что анаграмма определяется только частотой букв (frequencies), а не
   порядком.
2. Первый фильтр, если длины разные, это сразу не анаграмма, вернуть false.
3. Построить таблицу частот для `s` (сколько раз встречается каждый символ).
4. Пройти по `t` и вычитать по единице из таблицы за каждый символ.
5. Если счётчик ушёл в минус, в `t` есть лишняя буква, не анаграмма. Если всё
   обнулилось, анаграмма.

---

## Complexity

| | Brute force (sort) | Optimized (count) |
|---|---|---|
| **Time** | O(n log n) | O(n) |
| **Space** | O(n) | O(1) for fixed a-z (26 slots); O(k) for `Counter` |

**Why (English):** sorting both strings costs the log n factor and only to throw
away ordering we never needed. Counting is one linear pass per string. With a
fixed 26-letter alphabet the count table is constant size, so O(1) space; with a
hash map it's O(k) where k = number of distinct characters.

**Почему (По-русски):** сортировка стоит множитель log n и только ради порядка,
который не нужен. Подсчёт, это линейный проход. Для алфавита из 26 букв таблица
фиксированного размера, значит O(1) память, для хэш-таблицы O(k), где k, число
различных символов.

---

## Syntax snippets (only when I ask)

**Mapping a lowercase letter to an array index 0–25:**

```python
idx = ord(c) - ord('a')   # 'a'->0, 'b'->1, ... 'z'->25
count = [0] * 26          # one slot per letter
count[ord(c) - ord('a')] += 1
```

`ord(c)` is the integer Unicode code point: `ord('a')=97 ... ord('z')=122`.
Subtracting `ord('a')` shifts that range to start at 0 so it can index a list.

**Frequency map via Counter:**

```python
from collections import Counter
counts = Counter(s)       # {'a': 2, 'b': 1, ...}
```

---

## Q&A log

_Every question I asked + the tip I got. Newest first._

### 2026-06-20 — What happens if I `zip` two lists of different size?
**Tip:** It's legal, no error. `zip` stops at the shortest and silently drops the
longer one's tail (`zip([1,2,3],['a','b'])` -> 2 pairs, the `3` is lost). That
silent truncation is exactly why the `len(s) != len(t)` check must come before
the zip loop. To keep everything instead, use `itertools.zip_longest`, which pads
missing slots with `None` (or a `fillvalue`) and runs to the longest. Rule: `zip`
truncates to shortest, `zip_longest` pads to longest.

### 2026-06-20 — What does `all(...)` do? (never seen it before)
**Tip:** `all(iterable)` returns `True` only if every item is truthy, and
short-circuits to `False` at the first falsy one (empty iterable → `True`). So
`all(x == 0 for x in count)` asks "is every slot zero?", the anagram win
condition. The inner `x == 0 for x in count` is a *generator expression* that
yields one boolean per element. Complement is `any(...)` (True if at least one
item is truthy), so `all(x == 0 ...)` == `not any(x != 0 ...)`.

### 2026-06-20 — What does `zip` do in the single-loop version?
**Tip:** `zip(s, t)` pairs the strings position by position, giving one char from
each per iteration (`cs` from `s`, `ct` from `t` at the same index), so I can
count `s` up and `t` down in one loop instead of two. Catch: `zip` stops at the
shorter string and silently drops the longer one's tail (`zip("abc","ab")` yields
only 2 pairs), which is exactly why the `len(s) != len(t)` check must come before
the loop.

### 2026-06-20 — Show me exactly what's happening in the `ord` part.
**Tip:** `ord(c)` returns a character's integer code point. Lowercase letters are
consecutive (`a`=97 ... `z`=122), so `ord(c) - ord('a')` shifts them to indices
`0..25`. `count = [0]*26` is then a frequency table indexed by letter. Add for
each char of `s`, subtract for each char of `t`; if they're anagrams every slot
cancels to 0. It's a hash map whose "hash" is just integer subtraction, which is
why it has no hashing overhead.

### 2026-06-20 — Is the Counter solution better than using `ord`?
**Tip:** Neither wins outright. `ord` array: faster constant factor (no hashing),
true O(1) space (26 slots), but only works for `a-z`. `Counter`: handles any
character (Unicode follow-up), most idiomatic, slightly slower. For this exact
problem (lowercase only) the `ord` array is marginally better and is the classic
interview answer. Strongest move: mention both and state the trade-off out loud.

### 2026-06-20 — Show me a better solution and explain it.
**Tip:** Make the length check explicit (`if len(s) != len(t): return False`),
build one `Counter(s)`, decrement over `t`, and fail the moment a count goes
`< 0`. Same O(n)/O(1) as my version but reads top-to-bottom and is obviously
correct. Shortest idiomatic form: `return Counter(s) == Counter(t)` (loses the
early exit).

### 2026-06-20 — I wrote my own solution; what can be improved and why?
**Tip:** My solution was correct but relied on a hidden invariant (building the
counter from the longer string so the `> 0` end-check implicitly enforces equal
length). Improvements: (1) make the length check explicit, (2) check `!= 0` or
`< 0` instead of `> 0` since `> 0` can't see negative/over-used counts, (3) drop
the longer/shorter branching, it adds reading cost without changing O(n). The
*pattern* I picked (count then verify) was right; the fix is legibility and
provability, not speed.

---

[← Back to topic](../README.md)
