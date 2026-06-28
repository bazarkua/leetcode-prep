# 347. Top K Frequent Elements — Tips & Approach Log

> My personal learning log for this problem. **No full solutions here.** The
> goal is to record the step-by-step *thinking* so I learn to solve it myself.
> English + Russian. Code only as small syntax snippets, when I explicitly ask.

| | |
|---|---|
| **LeetCode** | [leetcode.com/problems/top-k-frequent-elements](https://leetcode.com/problems/top-k-frequent-elements/) |
| **Status** | Solved (own attempt = Counter + sort; optimal is bucket sort) |
| **Notes (full walkthrough)** | [README.md](README.md) |

---

## Step-by-step approach (no code)

_How to reason from the problem statement to the optimal idea, as plain steps so
I can code it myself._

**English:**
1. Every approach starts the same: count each value's frequency with a hash map
   in one O(n) pass. Let `n` = array length, `m` = number of distinct values.
2. The only question is how to pick the top `k` by frequency. Three finishes:
   - **Sort** the (value, freq) pairs by frequency, take k → O(n log n). Simplest.
   - **Heap** of size k while scanning the m distinct values → O(n + m log k).
     Best when k is much smaller than n.
   - **Bucket sort** (optimal): a frequency can be at most n, so make buckets
     indexed by frequency `0..n`, drop each value into its frequency bucket, then
     walk buckets from high to low collecting k → O(n), no sorting.
3. Insight that unlocks O(n): frequencies are bounded by n, so you can *index by
   frequency* (O(1)) instead of *sorting by* frequency (log factor).

**По-русски:**
1. Все подходы начинаются одинаково, считаем частоту каждого значения хэш-таблицей
   за один проход O(n). `n` = длина массива, `m` = число уникальных значений.
2. Вопрос только в выборе top `k` по частоте. Три варианта финала:
   - **Сортировка** пар (значение, частота) → O(n log n). Проще всего.
   - **Куча (heap)** размера k при проходе по m значениям → O(n + m log k). Лучше,
     когда k много меньше n.
   - **Bucket sort** (оптимально): частота не больше n, делаем корзины с индексом,
     равным частоте, кладём значения, идём сверху вниз, собирая k → O(n).
3. Ключ к O(n): частоты ограничены n, поэтому индексируем по частоте (O(1)) вместо
   сортировки по частоте (множитель log).

---

## Complexity

| approach | Time | Space |
|---|---|---|
| Brute force (`nums.count` per value) | O(n·m) ≈ O(n²) | O(m) |
| Counter + sort (mine) | O(n log n) | O(m) |
| Heap | O(n + m log k) | O(m + k) |
| Bucket sort | O(n) | O(n) |

**Why (English):** counting is O(n) everywhere. Sorting m pairs adds m log m
(= n log n worst case). A size-k heap makes each of m selections O(log k). Bucket
sort indexes by frequency so selection is O(1) per item — no log, total O(n).

**Почему (По-русски):** подсчёт везде O(n). Сортировка m пар добавляет m log m
(= n log n в худшем). Куча размера k делает каждый из m выборов O(log k). Bucket
sort индексирует по частоте, выбор O(1) на элемент, без log, итого O(n).

---

## Syntax snippets (only when I ask)

```python
count.items()                       # (value, frequency) pairs of a Counter
sorted(pairs, key=lambda kv: kv[1], reverse=True)   # sort by 2nd field, desc
heapq.nlargest(k, count.keys(), key=count.get)      # k largest by frequency
buckets = [[] for _ in range(n + 1)]                # one bucket per frequency
```

`lambda kv: kv[1]` is a tiny inline function: input one `(value, freq)` pair `kv`,
return its frequency `kv[1]`, so `sorted` orders by frequency.

---

## Q&A log

_Every question I asked + the tip I got. Newest first._

### 2026-06-21 — Why is it O(n) even with the nested for loop?
**Tip:** Nested loops are NOT automatically O(n²) — what counts is the TOTAL
times the inner body runs, not loop nesting. Outer visits n+1 bucket indices =
O(n). Inner runs once per value in a bucket, and across ALL buckets there are
exactly m values total (each distinct value was placed in exactly one bucket). So
the inner body runs m times TOTAL over the whole outer loop, not m per outer
iteration. Total = (n+1) + m = O(n+m) = O(n) since m ≤ n. This is aggregate
analysis: when Σ(inner iterations) is bounded, you ADD instead of MULTIPLY. Same
reason graph traversal is O(V+E), not O(V·E). Empty buckets cost 1 outer step,
0 inner.

### 2026-06-21 — Does each bucket[freq] hold exactly one value?
**Tip:** No — that was only true for the `[1,1,1,2,2,3]` example because its
frequencies (3,2,1) happened to be distinct. A bucket is a *list* and can hold
many values when they share a frequency. E.g. `[1,1,2,2,3]` → both 1 and 2 have
freq 2, so `buckets[2] = [1, 2]`. That's exactly why the code has the inner
`for val in buckets[freq]` loop — to walk every value in a bucket. Each `append`
still adds one value at a time, but a bucket can have 0, 1, or many.

### 2026-06-21 — Walk me through the bucket sort solution on a LeetCode example.
**Tip:** `nums=[1,1,1,2,2,3], k=2`, n=6. (1) `count={1:3,2:2,3:1}`. (2) make
`n+1=7` empty lists, index = frequency (n+1 because max freq is n; index 0 unused
but keeps alignment). (3) place each value at `buckets[freq]`: buckets[3]=[1],
buckets[2]=[2], buckets[1]=[3] → array is implicitly sorted by frequency via
*addressing, not sorting*. (4) scan `range(6,0,-1)` high→low: indices 6,5,4 empty;
index3→append 1 (len1); index2→append 2 (len2==k) → return [1,2]. O(n) because no
sort — indexing by frequency is O(1) vs sorting's log. Ties: same-frequency values
share one bucket list and the inner loop collects all of them.

### 2026-06-21 — Is my Counter+sort solution the best? Add brute force + others with complexity.
**Tip:** Correct but not optimal. Its cost is O(n + m log m) = **O(n log n)**, not
`O(n)·log k` — costs add (count O(n) + sort O(m log m)), and the sort is over m
items with a log m factor, not log k (slicing k doesn't shrink the sort). Also no
need to rebuild a dict; slice the sorted list directly. Ladder of approaches:
brute force `nums.count` per value O(n·m)≈O(n²); Counter+sort O(n log n) (mine);
heap of size k O(n + m log k); **bucket sort O(n)** = optimal (index buckets by
frequency since freq ≤ n, walk high→low collecting k). Full code + analysis in
README.md.

---

[← Back to topic](../README.md)
