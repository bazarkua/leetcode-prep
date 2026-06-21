# 217. Contains Duplicate

|                |                                                                                               |
| -------------- | --------------------------------------------------------------------------------------------- |
| **Topic**      | [Arrays & Hashing](../README.md)                                                              |
| **Difficulty** | Easy                                                                                          |
| **LeetCode**   | [leetcode.com/problems/contains-duplicate](https://leetcode.com/problems/contains-duplicate/) |
| **Pattern**    | Hash set for O(1) membership check, early exit on first repeat                                |

---

## Problem (restated)

Given an integer array `nums`, return `True` if any value appears **at least
twice**, and `False` if every element is distinct.

Constraints worth saying out loud: the array can be large (up to ~10^5),
values can be negative, and an empty or single-element array trivially has no
duplicate.

**По-русски:** Дан массив (array) целых чисел `nums`. Вернуть `True`, если
хотя бы одно значение встречается два или более раз, иначе `False`. Массив
может быть большим, значения могут быть отрицательными, а пустой массив или
массив из одного элемента дубликатов не имеет.

---

## Example walkthrough

`nums = [1, 2, 3, 1]`

| step | num | set before | seen before? | action |
|---|---|---|---|---|
| 1 | 1 | `{}` | no | add 1 → `{1}` |
| 2 | 2 | `{1}` | no | add 2 → `{1,2}` |
| 3 | 3 | `{1,2}` | no | add 3 → `{1,2,3}` |
| 4 | 1 | `{1,2,3}` | **yes** | return `True` |

We stop the moment we hit the second `1`, we never even look past it.

---

## Brute force

The "obvious" approach: check every possible pair of positions. For each index
`i`, look at every later index `j` and ask "are these two equal?". If any pair
matches, there is a duplicate.

```python
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        n = len(nums)
        for i in range(n):                # pick the first element of the pair
            for j in range(i + 1, n):     # compare against every element after it
                if nums[i] == nums[j]:    # same value at two positions -> duplicate
                    return True
        return False                      # no pair matched -> all distinct
```

**Walking the code on `[1, 2, 3, 1]`:**
- `i = 0` (value `1`): compare with `2`, `3`, `1` → matches `nums[3] == 1` → `True`.

We start `j` at `i + 1` (not `0`) so we never compare an element with itself and
never re-check a pair in both orders. That is why it is `i+1`, not `i`.

**Time:** O(n^2) — in the worst case (all distinct) the inner loop runs for
every `i`, giving roughly n + (n-1) + ... + 1 ≈ n^2 / 2 comparisons.
**Space:** O(1) — we only use the two index counters, no extra structure.

**Why this is wasteful:** for each element we re-scan the rest of the array,
redoing comparisons we have effectively already made. We never *remember*
anything about the elements we have already seen, so we keep re-discovering the
same values. That repeated work is exactly what the hash set below removes.

**По-русски:** Подход "в лоб" (brute force), сравнить каждую пару элементов
двойным циклом, внешний индекс `i` и внутренний `j`, начинающийся с `i + 1`
(чтобы не сравнивать элемент сам с собой и не проверять пару дважды). Если
`nums[i] == nums[j]`, дубликат найден. Время O(n^2) (в худшем случае около
n^2 / 2 сравнений), память O(1). Медленно, потому что для каждого элемента мы
заново просматриваем массив и ничего не запоминаем о том, что уже видели. Эту
повторную работу и убирает hash set ниже.

---

## Optimized approach

Walk through the array once, keeping a **hash set** of values we have already
seen. For each `num`: if it is already in the set, we found a duplicate, return
`True` immediately. Otherwise add it and keep going. If we finish the loop, no
duplicates existed → `False`.

A hash set gives us **O(1) average membership check** (`num in seen`). That is
the whole trick: trade O(n) extra memory for turning the inner O(n) scan into a
single O(1) lookup.

**Time:** O(n)
**Space:** O(n)

**Key idea:** a hash set turns "have I seen this value before?" from a full
re-scan into a constant-time lookup, so one pass is enough.

**По-русски:** Оптимальный подход, один проход по массиву и множество (hash set)
уже увиденных значений. Если значение уже в множестве, дубликат найден, сразу
`True`. Иначе добавляем и идём дальше. Главное, что даёт нам hash set, это
проверка принадлежности (membership check) за O(1) в среднем. Мы меняем
дополнительную память O(n) на скорость, превращая внутренний цикл в одну
быструю проверку. Время O(n), память O(n).

---

## Code

```python
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        seen = set()
        for num in nums:
            if num in seen:
                return True
            seen.add(num)
        return False
```

This is exactly the solution you wrote, just with the `if/else` collapsed: check
membership first and return early, otherwise add. Same O(n) / O(n), same logic.

**Even shorter (interview one-liner):** compare the length of the array to the
length of its set. If they differ, a duplicate was collapsed away.

```python
class Solution:
    def containsDuplicate(self, nums: List[int]) -> bool:
        return len(set(nums)) != len(nums)
```

Trade-off to mention: the one-liner is clean but always builds the full set and
scans the whole array (no early exit), so the explicit loop can finish sooner
when a duplicate appears early. Both are O(n) time and O(n) space.

---

## Edge cases

- **Empty array** `[]` → loop never runs → `False`. Correct.
- **Single element** `[7]` → one iteration, nothing seen yet → `False`. Correct.
- **All duplicates** `[2, 2, 2]` → second `2` triggers `True` on iteration 2.
- **Negative numbers** `[-1, -1]` → sets hash negatives fine → `True`.
- **All distinct, large input** → full O(n) pass, no early exit, returns `False`.

---

## How to say it out loud (interview script)

"I want a fast way to check 'have I seen this number before' as I scan, so I'll
use a hash set, which gives O(1) average lookups and inserts. I iterate once: if
the current number is already in the set I return `True` right away, otherwise I
add it. If I get through the whole array, there were no duplicates, so I return
`False`. That's O(n) time and O(n) space, versus the O(n^2) brute force that
compares every pair. The space is the trade-off for the speed."

**По-русски:** "Мне нужно быстро проверять, видел ли я уже это число во время
прохода, поэтому беру множество (hash set), оно даёт вставку и проверку за O(1)
в среднем. Прохожу массив один раз, если число уже в множестве, сразу возвращаю
`True`, иначе добавляю его. Если дошёл до конца, дубликатов нет, возвращаю
`False`. Это O(n) по времени и O(n) по памяти против O(n^2) у перебора всех пар.
Память, это плата за скорость."

---

## Pattern tag

`Hash set for O(1) membership + early exit` — the same "remember what you've
seen in a set" move powers [Two Sum](../0001-two-sum/README.md) (store
complements in a hash map), [Valid Anagram](../0242-valid-anagram/README.md)
(count characters), and [Longest Consecutive Sequence](../0128-longest-consecutive-sequence/README.md)
(set membership to find sequence starts).

[← Back to Arrays & Hashing](../README.md)
