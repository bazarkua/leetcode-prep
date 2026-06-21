# 1. Two Sum — Tips & Approach Log

> My personal learning log for this problem. **No full solutions here.** The
> goal is to record the step-by-step *thinking* so I learn to solve it myself.
> English + Russian. Code only as small syntax snippets, when I explicitly ask.

| | |
|---|---|
| **LeetCode** | [leetcode.com/problems/two-sum](https://leetcode.com/problems/two-sum/) |
| **Status** | Solved (own attempt, correct & optimal) |
| **Notes (full walkthrough)** | [README.md](README.md) |

---

## Step-by-step approach (no code)

_How to reason from the problem statement to the optimal idea, as plain steps so
I can code it myself._

**English — One-pass hash map:**
1. Brute force is "check every pair," which is O(n^2). To go faster, trade a bit
   of memory for speed.
2. Iterate through the array a single time, using a hash map to remember the
   numbers seen so far together with their indices (`{number: index}`).
3. For each element, compute the **complement** you'd need to hit the target:
   `complement = target - current_number`.
4. Check if that complement is already a **key** in the hash map.
5. If it exists, you found the answer: the map gives the complement's index, and
   you have the current index, return those two immediately.
6. If it doesn't exist, store the current number and its index in the map. This
   sets up future iterations, in case the current number is the complement for a
   number you haven't reached yet.
7. This one pass is fast because every hash-map lookup is O(1) on average.

**По-русски — Хэш-таблица за один проход:**
1. Перебор всех пар, это O(n^2). Чтобы быстрее, меняем немного памяти на скорость.
2. Проходим массив один раз, в хэш-таблице (hash map) запоминаем уже увиденные
   числа вместе с их индексами (`{число: индекс}`).
3. Для каждого элемента считаем нужное дополнение (complement):
   `complement = target - текущее_число`.
4. Проверяем, есть ли это дополнение уже как **ключ** в таблице.
5. Есть, значит ответ найден: в таблице лежит индекс дополнения, а текущий индекс
   у нас есть, сразу возвращаем эти два индекса.
6. Нет, кладём текущее число и его индекс в таблицу, чтобы будущие элементы могли
   найти его как своё дополнение.
7. Один проход быстрый, потому что просмотр хэш-таблицы, это O(1) в среднем.

---

## Complexity

| | Brute force | Optimized (one-pass hash map) |
|---|---|---|
| **Time** | O(n^2) | O(n) |
| **Space** | O(1) | O(n) |

**Why (English):** brute force checks every pair, ~n^2/2 comparisons. The hash
map turns "find the complement" from an O(n) scan into an O(1) average lookup, so
one linear pass suffices. Space is O(n) because, worst case, we store nearly all
n elements before the matching pair appears (e.g. it's the last two numbers).

**Почему (По-русски):** перебор проверяет все пары (~n^2/2). Хэш-таблица
превращает поиск дополнения из прохода за O(n) в просмотр за O(1) в среднем, так
что хватает одного линейного прохода. Память O(n), потому что в худшем случае
храним почти все n элементов, пока не встретится нужная пара (например, это два
последних числа).

---

## Syntax snippets (only when I ask)

**`enumerate` — index + value together:**

```python
for idx, num in enumerate(nums):   # idx = 0,1,2...  num = nums[idx]
    ...
```

`enumerate(nums)` yields `(index, value)` pairs, so you get the position without
a manual counter. Equivalent to looping `range(len(nums))` and indexing, but
cleaner.

**Dict membership / lookup:**

```python
if complement in seen:    # checks KEYS, O(1) average
    i = seen[complement]  # fetch the stored value (here, an index)
seen[num] = idx           # insert / store
```

---

## Q&A log

_Every question I asked + the tip I got. Newest first._

### 2026-06-21 — I solved it; review my one-pass hash map and how should tips look?
**Tip:** Solution is correct and optimal (O(n) / O(n)). Optional polish: the
`else` is redundant since the `if` branch returns, and add a trailing `return []`
for readers/type-checkers. Storing `num → idx` (by value) is the right choice and
handles duplicates. Going forward, the "Step-by-step approach" section here is
written as a no-code numbered explanation (like the One-Pass Hash Map writeup I
liked) so I can code it up myself.

---

[← Back to topic](../README.md)
