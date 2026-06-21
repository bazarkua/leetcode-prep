# 347. Top K Frequent Elements

| | |
|---|---|
| **Topic** | [Arrays & Hashing](../README.md) |
| **Difficulty** | Medium |
| **LeetCode** | [leetcode.com/problems/top-k-frequent-elements](https://leetcode.com/problems/top-k-frequent-elements/) |
| **Pattern** | Count frequencies, then select top k (sort / heap / bucket sort) |

---

## Problem (restated)

Given an integer array `nums` and integer `k`, return the `k` most frequent
elements. The answer is guaranteed unique; order of the output doesn't matter.

**По-русски:** Дан массив (array) `nums` и число `k`. Вернуть `k` самых частых
элементов. Ответ единственный, порядок вывода не важен.

---

## Example walkthrough

`nums = [1, 1, 1, 2, 2, 3]`, `k = 2`

Frequencies: `{1: 3, 2: 2, 3: 1}`. The two most frequent are `1` (×3) and `2`
(×2) → `[1, 2]`.

Let `n` = length of `nums`, `m` = number of **distinct** values (`m ≤ n`). Every
approach starts by counting frequencies in O(n); they differ in how they pick the
top `k`.

---

## Approach 1 — Brute force (count by scanning, then sort)

Without a hash map: for each distinct value, count its occurrences by scanning
the whole array, then sort those counts and take the top `k`.

```python
class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        freqs = []
        for x in set(nums):                 # each distinct value
            freqs.append((nums.count(x), x))  # nums.count scans all n -> O(n)
        freqs.sort(reverse=True)            # sort by count desc
        return [x for _, x in freqs[:k]]
```

**Time:** O(n · m + m log m). `nums.count(x)` is O(n), done for each of `m`
distinct values → O(n·m), which is O(n²) when many values are distinct.
**Space:** O(m).

**Why this is wasteful:** `nums.count(x)` re-scans the entire array for every
distinct value, recomputing counts we could have tallied in a single pass. A hash
map fixes this.

**По-русски:** Подход "в лоб" (brute force), для каждого уникального значения
считаем его вхождения, сканируя весь массив (`nums.count` это O(n)), потом
сортируем. Время O(n·m) (до O(n²)), память O(m). Плохо, потому что для каждого
значения заново проходим весь массив.

---

## Approach 2 — Count with a hash map, then sort (YOUR solution)

```python
from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = Counter(nums)
        sorted_count = dict(sorted(count.items(), key=lambda item: item[1], reverse=True))
        return list(sorted_count.keys())[:k]
```

**Correct.** `Counter(nums)` tallies all frequencies in one O(n) pass. Then you
sort the `(value, freq)` pairs by frequency descending and take the first `k`
keys.

**Time:** O(n + m log m), which is **O(n log n)** in the worst case (all distinct
→ m = n). **Space:** O(m).

**Your complexity comment was `O(n) * log k`, which isn't right** — the cost is
**additive, not multiplied** (count is O(n), sort is O(m log m)), and the sort is
over **m** items with a **log m** factor, not `log k`. You sort *everything*, then
slice, so `k` doesn't reduce the sort cost. Quick fixes / notes:

- You don't need to rebuild a `dict`. Sorting already gives an ordered list; just
  slice it. Rebuilding the dict relies on dict preserving insertion order (true in
  Python 3.7+) but adds a pointless O(m) copy:

  ```python
  count = Counter(nums)
  ordered = sorted(count.items(), key=lambda kv: kv[1], reverse=True)
  return [val for val, _ in ordered[:k]]
  ```

**New syntax here:**
- `count.items()` → the `(value, frequency)` pairs of the Counter.
- `key=lambda item: item[1]` → `lambda` is a tiny inline function; `item` is one
  `(value, freq)` pair and `item[1]` is its frequency, so `sorted` orders by
  frequency. `reverse=True` makes it descending.

**По-русски:** Твоё решение корректно. `Counter(nums)`, это подсчёт за O(n), потом
сортировка пар `(значение, частота)` по частоте и срез первых `k` ключей. Время
O(n + m log m) = O(n log n) в худшем случае. Твой комментарий `O(n) * log k`
неверен, стоимости складываются (не умножаются), а сортировка идёт по `m`
элементам с множителем `log m`, не `log k`. Перестраивать `dict` не нужно,
сортировка уже даёт упорядоченный список, просто срез. `lambda item: item[1]`, это
маленькая функция, берущая частоту из пары для сортировки.

---

## Approach 3 — Heap (good when k ≪ n)

Keep only the `k` largest by frequency using a heap. Python's `heapq.nlargest`
does this directly.

```python
import heapq
from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = Counter(nums)
        return heapq.nlargest(k, count.keys(), key=count.get)
```

`nlargest(k, ...)` maintains a heap of size `k` while scanning the `m` distinct
values, so each push/pop is O(log k).

**Time:** O(n + m log k) — count is O(n), selecting top k is O(m log k).
**Space:** O(m + k).

**Why it beats the sort** when `k` is small: `log k` is smaller than `log m`, you
never fully sort. (`Counter.most_common(k)` does essentially the same internally.)

**По-русски:** Куча (heap). Держим только `k` самых частых. `heapq.nlargest`
поддерживает кучу размера `k`, каждое добавление O(log k). Время O(n + m log k),
лучше сортировки, когда `k` мал, потому что `log k < log m`.

---

## Approach 4 — Bucket sort (optimal, O(n))

A frequency can be at most `n`. So make an array of buckets indexed by frequency
`0..n`; put each value into the bucket equal to its count. Then walk buckets from
highest frequency down, collecting values until you have `k`.

```python
from collections import Counter

class Solution:
    def topKFrequent(self, nums: List[int], k: int) -> List[int]:
        count = Counter(nums)
        buckets = [[] for _ in range(len(nums) + 1)]   # index = frequency
        for val, freq in count.items():
            buckets[freq].append(val)
        result = []
        for freq in range(len(buckets) - 1, 0, -1):    # high freq -> low
            for val in buckets[freq]:
                result.append(val)
                if len(result) == k:
                    return result
        return result
```

**Time:** O(n) — counting is O(n), filling buckets is O(m), the final scan visits
each bucket slot and each value once, O(n). No sorting, no `log` factor.
**Space:** O(n) — the buckets.

**Key idea:** frequencies are bounded by `n`, so we can *index by frequency*
instead of sorting by it. Indexing is O(1), which removes the `log` entirely.

**По-русски:** Блочная сортировка (bucket sort), оптимально. Частота не больше
`n`, поэтому делаем массив корзин (buckets) с индексом, равным частоте. Кладём
каждое значение в корзину своей частоты, потом идём от высоких частот к низким и
собираем `k` значений. Время O(n), памяти O(n). Главное, частоты ограничены `n`,
поэтому индексируем по частоте (O(1)) вместо сортировки по ней, и `log` исчезает.

---

## Comparison

| approach | Time | Space | when to use |
|---|---|---|---|
| Brute force | O(n·m) ≈ O(n²) | O(m) | never (teaching baseline) |
| Counter + sort (yours) | O(n log n) | O(m) | simplest correct answer |
| Heap | O(n + m log k) | O(m + k) | k much smaller than n |
| Bucket sort | **O(n)** | O(n) | optimal; the answer to give |

---

## Edge cases

- **k == number of distinct values** → return all of them.
- **All elements equal** `[5,5,5], k=1` → `{5:3}` → `[5]`.
- **All distinct, k = n** → every element qualifies.
- **Single element** `[7], k=1` → `[7]`.

---

## How to say it out loud (interview script)

"First I count frequencies with a hash map in O(n). The simplest finish is to
sort the pairs by frequency and take k, that's O(n log n). If k is small I'd use
a heap of size k for O(n + m log k). But the optimal is bucket sort: a
frequency is at most n, so I index buckets by frequency and walk from the top
collecting k elements, no sorting, so O(n) time and O(n) space."

**По-русски:** "Сначала считаю частоты хэш-таблицей за O(n). Простейший финал,
отсортировать пары по частоте и взять k, это O(n log n). Если k мал, куча размера
k даёт O(n + m log k). Но оптимально, bucket sort, частота не больше n, поэтому
индексирую корзины по частоте и иду сверху, собирая k элементов, без сортировки,
O(n) время и O(n) память."

---

## Pattern tag

`Count then select top-k (sort / heap / bucket)` — the count-frequencies step is
the same hash-map move as [Valid Anagram](../0242-valid-anagram/README.md) and
[Group Anagrams](../0049-group-anagrams/README.md). The heap variant connects to
[Kth Largest Element in an Array](../../09-heap-priority-queue/0215-kth-largest-element-in-an-array/README.md);
bucket sort reappears whenever a value's range is bounded.

[← Back to Arrays & Hashing](../README.md)
