# 49. Group Anagrams — Tips & Approach Log

> My personal learning log for this problem. **No full solutions here.** The
> goal is to record the step-by-step *thinking* so I learn to solve it myself.
> English + Russian. Code only as small syntax snippets, when I explicitly ask.

| | |
|---|---|
| **LeetCode** | [leetcode.com/problems/group-anagrams](https://leetcode.com/problems/group-anagrams/) |
| **Status** | Attempting (have the tip, coding it myself) |
| **Notes (full walkthrough)** | [README.md](README.md) |

---

## Step-by-step approach (no code)

_How to reason from the problem statement to the optimal idea, as plain steps so
I can code it myself._

**English — Canonical key + hash map bucketing:**
1. Recognize this is the anagram-counting pattern from 242, used as a *grouping
   key*. Anagrams have identical letter frequencies, so build a "fingerprint"
   that is the same for every anagram of a word but different for non-anagrams.
2. Make a hash map where each **key is the fingerprint** and each **value is the
   list of words** that share it.
3. For each word, compute its fingerprint. Two good options:
   - **Sorted letters**: sort the characters into a string (`"eat"`,`"tea"` ->
     `"aet"`). Same sorted string ⇒ same group.
   - **Letter-count signature**: a length-26 count of `a–z` (the `ord` idea from
     242) made hashable. Same counts ⇒ same group. Faster, no sorting.
4. Append the word to the list under that fingerprint key.
5. After all words, the **answer is all the values (lists)** of the map. The keys
   were only scaffolding for grouping.

Gotcha: a Python **list can't be a dict key** (unhashable). The fingerprint must
be a *string* (sorted word) or a *tuple* (the 26 counts), never a list.

**По-русски — Канонический ключ + группировка хэш-таблицей:**
1. Это паттерн подсчёта букв из 242, но как ключ для группировки. Анаграммы имеют
   одинаковые частоты букв, делаем "отпечаток" (fingerprint), одинаковый для
   анаграмм и разный для не-анаграмм.
2. Заводим хэш-таблицу (hash map): **ключ, отпечаток**, **значение, список слов**.
3. Для каждого слова считаем отпечаток. Два варианта:
   - **Отсортированные буквы**: `"eat"`,`"tea"` -> `"aet"`. Одна сортировка, одна
     группа.
   - **Сигнатура счётчиков**: длина 26, счётчик каждой буквы `a–z` (идея `ord` из
     242), сделанный хэшируемым. Одинаковые счётчики, одна группа. Быстрее.
4. Добавляем слово в список под этим ключом.
5. В конце **ответ, все значения (списки)** таблицы. Ключи нужны были только для
   группировки.

Важно: **список не может быть ключом словаря** в Python (unhashable). Отпечаток,
это строка (отсортированное слово) или кортеж (tuple из 26 счётчиков), не список.

---

## Complexity

Let `m` = number of words, `k` = max word length.

| key choice        | Time           | Space    |
| ----------------- | -------------- | -------- |
| sorted-string key | O(m · k log k) | O(m · k) |
| count-tuple key   | O(m · k)       | O(m · k) |

**Why (English):** sorted key sorts `k` chars for each of `m` words → the
`k log k` factor. Count key tallies letters in one O(k) pass per word, no sort,
so it's linear in total input. Space is O(m · k) either way, every word is stored
once across the buckets.

**Почему (По-русски):** ключ-сортировка сортирует `k` символов для каждого из `m`
слов, отсюда `k log k`. Ключ-счётчик считает буквы за один проход O(k) на слово,
без сортировки, значит линейно по объёму входа. Память O(m · k) в обоих случаях,
каждое слово хранится один раз.

---

## Syntax snippets (only when I ask)

_(none requested yet)_

---

## Q&A log

_Every question I asked + the tip I got. Newest first._

### 2026-06-21 — Show how the groups/keys (defaultdict) building works.
**Tip:** Trace on `["eat","tea","tan","ate","nat","bat"]`. `groups` starts `{}`.
Each word: key = sorted letters; `groups[key].append(word)`. eat→"aet" (new []),
tea→"aet" (append), tan→"ant" (new), ate→"aet" (append), nat→"ant" (append),
bat→"abt" (new). End: `{"aet":[eat,tea,ate], "ant":[tan,nat], "abt":[bat]}`.
`list(groups.values())` drops keys → `[[eat,tea,ate],[tan,nat],[bat]]`. The key
decides the group (anagrams share it); `defaultdict(list)` auto-starts a `[]` for
a new key so append always works. Mental model: sorting mail into PO boxes by
computed box number, then handing back each box's contents.

### 2026-06-21 — What does bare `defaultdict()` do? + log k derivation + ord trace.
**Tip:** (a) `defaultdict()` with no factory has `default_factory = None`, so it
acts like a plain dict and raises `KeyError` on a missing key, useless here. Must
pass a callable: `defaultdict(list)`→`[]`, `defaultdict(int)`→`0`,
`defaultdict(set)`→`set()` (name without parens). (b) Sorting `k` items is
O(k log k) because merge sort splits in half `log₂(k)` times (k=8 → 8→4→2→1 = 3
levels) and each level merges all k items: `log k` levels × `k` = `k log k`.
(c) `ord` trace: `count=[0]*26`; for `"eat"`, e→index4, a→index0, t→index19, all
set to 1 → tuple `(1,0,0,0,1,...,1,...)`. `"tea"` gives the identical tuple (same
letters, different order) → same bucket; `"bat"` gives a different tuple. Wrap as
`tuple(count)` because a list is unhashable and can't be a dict key.

### 2026-06-21 — Explain how time/space complexity is derived, and how `log` works.
**Tip:** `log₂(n)` = how many times you halve `n` to reach 1 (`log₂(8)=3`,
`log₂(1M)≈20`); it grows very slowly and shows up when an algorithm repeatedly
splits in half (binary search) or sorts. Big-O recipe: count operations as a
function of input size, keep the fastest-growing term, drop constants. Sorting
`k` items is O(k log k) (~log k merge levels × k items per level). Group Anagrams
sorted-key = (m words) × (O(k log k) per word) = **O(m·k log k)**. Count-key =
(m words) × (O(k) per word, one pass, no sort) = **O(m·k)** — optimal, since
O(m·k) is just "read every character once." Space O(m·k): the map stores all m
words (≤ k chars each) once.

### 2026-06-21 — Show me and explain the solution.
**Tip:** Two versions, both bucket by a canonical key in a `defaultdict(list)`,
answer = `list(groups.values())`. (A) Sorted key: `"".join(sorted(word))` →
`"eat"`/`"tea"` both become `"aet"`; O(m·k log k). (B) Count key: tally 26 letters
via `ord(c)-ord('a')`, key = `tuple(count)`; O(m·k), faster, no sort. Must use a
string or tuple as the key because a list is unhashable. New constructs:
`defaultdict` (auto-creates missing values), `"".join(...)`, `tuple(...)`.

### 2026-06-21 — Give me a tip for Group Anagrams (no code).
**Tip:** Bucket words by a canonical fingerprint that's identical for anagrams.
Use a hash map `{fingerprint: [words]}`. Fingerprint = either the sorted-letters
string or a length-26 letter-count tuple (the count tuple skips sorting, so it's
O(m·k) vs O(m·k log k)). Append each word under its key; the answer is the map's
values. Remember a list can't be a dict key, use a string or tuple.

---

[← Back to topic](../README.md)
