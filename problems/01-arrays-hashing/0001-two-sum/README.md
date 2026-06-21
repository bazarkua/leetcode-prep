# 1. Two Sum

|                |                                                                         |
| -------------- | ----------------------------------------------------------------------- |
| **Topic**      | [Arrays & Hashing](../README.md)                                        |
| **Difficulty** | Easy                                                                    |
| **LeetCode**   | [leetcode.com/problems/two-sum](https://leetcode.com/problems/two-sum/) |
| **Pattern**    | One-pass hash map: store seen numbers, look up the complement in O(1)   |

---

## Problem (restated)

Given an array `nums` and a `target`, return the **indices** of the two numbers
that add up to `target`. Exactly one valid pair is guaranteed, and you can't use
the same element twice. Order of the returned indices doesn't matter.

**По-русски:** Дан массив (array) `nums` и число `target`. Вернуть индексы двух
чисел, сумма которых равна `target`. Гарантирован ровно один ответ, один и тот же
элемент использовать дважды нельзя. Порядок индексов не важен.

---

## Example walkthrough

`nums = [2, 7, 11, 15]`, `target = 9`

| idx | num | complement (9 − num) | seen map before | complement seen? | action |
|---|---|---|---|---|---|
| 0 | 2 | 7 | `{}` | no | store `2 → 0` |
| 1 | 7 | 2 | `{2: 0}` | **yes (at 0)** | return `[0, 1]` |

We find the answer the moment we reach `7`, because its complement `2` is already
in the map.

---

## Brute force

Try every pair `(i, j)` and check if `nums[i] + nums[j] == target`.

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        n = len(nums)
        for i in range(n):
            for j in range(i + 1, n):       # j starts after i: no reuse, no repeats
                if nums[i] + nums[j] == target:
                    return [i, j]
        return []                            # guaranteed not reached
```

**Time:** O(n^2) — every pair is checked.
**Space:** O(1) — only the two index counters.

**Why this is wasteful:** for each `num` we re-scan the rest of the array looking
for its complement, even though we've already *seen* earlier numbers. We're not
remembering them, so we keep searching from scratch.

**По-русски:** Подход "в лоб" (brute force), перебрать все пары двойным циклом.
Время O(n^2), память O(1). Расточительно, потому что для каждого числа мы заново
ищем его дополнение (complement) по всему массиву, хотя ранее уже видели нужные
числа, но не запомнили их.

---

## Optimized approach — one-pass hash map

Trade a little memory for a big speed-up. Iterate once, keeping a **hash map**
(`{number: index}`) of everything seen so far. For each `num`:

1. Compute the **complement** you still need: `complement = target - num`.
2. If the complement is already a key in the map, you're done, return the stored
   index and the current index.
3. Otherwise store `num → idx` and move on, so it can be *someone else's*
   complement later.

The key move: instead of searching the array for the complement (O(n)), you look
it up in the hash map in **O(1) average**. One pass, constant-time lookups.

**Time:** O(n) — one pass, each lookup/insert is O(1) average.
**Space:** O(n) — worst case the map holds nearly all elements before the match.

**Key idea:** "have I already seen the number that completes this pair?" becomes
an O(1) hash-map lookup, so a single pass suffices.

**По-русски:** Оптимально, один проход и хэш-таблица (hash map) `{число: индекс}`
всего увиденного. Для каждого `num` считаем дополнение `complement = target - num`,
если оно уже есть в таблице, возвращаем сохранённый индекс и текущий. Иначе кладём
`num → idx`. Главное, поиск дополнения в массиве за O(n) превращается в просмотр
хэш-таблицы за O(1) в среднем. Время O(n), память O(n).

---

## Your solution (what you wrote)

```python
class Solution:
    def twoSum(self, nums: List[int], target: int) -> List[int]:
        track_complements = {}
        for idx, num in enumerate(nums):
            complement = target - num
            if complement in track_complements:
                return [track_complements[complement], idx]
            else:
                track_complements[num] = idx
```

**Verdict: correct and optimal.** This is the textbook one-pass hash map, O(n)
time, O(n) space. Two tiny, optional polish notes:

- The `else` is unnecessary because the `if` branch `return`s, so control never
  falls through. You can drop it and just `track_complements[num] = idx` at the
  end of the loop. Pure style, identical behavior.
- A trailing `return []` (or `return None`) after the loop is good habit for
  type-checkers and readers, even though the problem guarantees a solution.

That's it, no logic to fix. Nicely done storing **`num → idx`** (not the other
way around), so the complement lookup is by value, which is exactly what you
need.

---

## Edge cases

- **Negative numbers** `nums=[-3, 4, 3], target=0` → complement of `-3` is `3`,
  found at the end → works.
- **Duplicate values** `nums=[3, 3], target=6` → store `3→0`; at idx 1, `3`'s
  complement `3` is in the map → `[0, 1]`. (Storing by value handles this; the
  second `3` finds the first.)
- **Pair is the last two elements** → map fills almost entirely first → still O(n).
- **Same element can't be reused** → handled automatically: you check the map
  *before* inserting the current number, so it can't match itself.

---

## How to say it out loud (interview script)

"Brute force checks every pair in O(n^2). To do better I trade space for time
with a hash map. I walk the array once; for each number I compute the complement
`target - num` and check if I've already seen it, that's an O(1) lookup. If yes,
I return both indices; if no, I store the current number with its index so a
later element can find it. That's O(n) time and O(n) space."

**По-русски:** "Перебор всех пар, это O(n^2). Чтобы быстрее, меняю память на
время с помощью хэш-таблицы (hash map). Прохожу массив один раз, для каждого числа
считаю дополнение `target - num` и проверяю, видел ли я его, это просмотр за O(1).
Если да, возвращаю оба индекса, если нет, сохраняю текущее число с индексом, чтобы
его нашли позже. Время O(n), память O(n)."

---

## Pattern tag

`Hash map of seen values for O(1) complement lookup` — the "store what you've
seen, look up what you need" move generalizes to
[3Sum](../../02-two-pointers/0015-3sum/README.md) (fix one number, two-sum the
rest) and many "find a pair/target" problems. It's the same hash-map family as
[Contains Duplicate](../0217-contains-duplicate/README.md) and
[Valid Anagram](../0242-valid-anagram/README.md).

[← Back to Arrays & Hashing](../README.md)
