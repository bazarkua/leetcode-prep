# 238. Product of Array Except Self

| | |
|---|---|
| **Topic** | [Arrays & Hashing](../README.md) |
| **Difficulty** | Medium |
| **LeetCode** | [leetcode.com/problems/product-of-array-except-self](https://leetcode.com/problems/product-of-array-except-self/) |
| **Pattern** | Prefix product × suffix product (no division) |

---

## Problem (restated)

Given an integer array `nums`, return an array `answer` where `answer[i]` is the
product of every element of `nums` **except** `nums[i]`. You must not use the
division operation, and the intended solution runs in O(n) time. Follow-up: do it
in O(1) extra space (the output array doesn't count).

**По-русски:** Дан массив (array) `nums`. Вернуть массив `answer`, где
`answer[i]` это произведение всех элементов, **кроме** `nums[i]`. Деление
(division) использовать нельзя, нужно O(n) по времени. Дополнительно (follow-up),
O(1) дополнительной памяти (массив ответа не считается).

---

## Example walkthrough

`nums = [1, 2, 3, 4]`

- `answer[0] = 2·3·4 = 24`
- `answer[1] = 1·3·4 = 12`
- `answer[2] = 1·2·4 = 8`
- `answer[3] = 1·2·3 = 6`

So `answer = [24, 12, 8, 6]`. Notice each output excludes exactly one input, and
nothing is divided.

---

## Why prefix × suffix works (the math)

For index `i`, every other element is **either left of `i` or right of `i`** —
never both, and `nums[i]` itself is in neither group. So "all elements except
`nums[i]`" splits into two disjoint groups that together cover exactly who we
need. Multiplication is associative, so we can multiply each group separately and
then multiply the two results:

```
answer[i] = (product of everything LEFT of i) × (product of everything RIGHT of i)
```

`nums[i]` is never multiplied in, which is why no division is required.

**По-русски:** Для индекса `i` любой другой элемент лежит либо слева, либо справа,
а сам `nums[i]` ни там, ни там. Значит "всё кроме `nums[i]`" разбивается на две
непересекающиеся группы (partition). Умножение ассоциативно, поэтому перемножаем
группы по отдельности и затем между собой. `nums[i]` не участвует, деление не
нужно.

---

## Approach 1 — Brute force

For each index `i`, loop over the whole array again and multiply everything except
`nums[i]`.

```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = []
        for i in range(n):
            prod = 1
            for j in range(n):
                if i != j:
                    prod *= nums[j]      # skip the element at i
            res.append(prod)
        return res
```

**Time:** O(n²). Outer loop runs n times; for each, the inner loop does ~n
multiplies → n·n.
**Space:** O(1) extra (the output is required and doesn't count).

**Why this is wasteful:** every index rebuilds the product from scratch, redoing
multiplications that overlap heavily between neighbors. We never reuse work.

**По-русски:** Подход "в лоб" (brute force), для каждого `i` заново проходим весь
массив. Внешний цикл n раз, внутренний n раз, итого O(n²). Память O(1) (массив
ответа обязателен). Плохо, потому что произведение каждый раз считается заново, без
переиспользования.

---

## Approach 2 — Prefix and suffix arrays

Compute, for each `i`, the product of everything to its left (`prefix`) and to its
right (`suffix`), then multiply them. The trick that makes each pass O(n): a
**running accumulator** starting at `1`, written into the slot **before** folding
in the current element (so `nums[i]` is excluded automatically).

```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        prefix, suffix = [], [0] * n

        cur = 1
        for i in range(n):              # left products
            prefix.append(cur)          # product of everything before i
            cur *= nums[i]

        cur = 1
        for i in range(n - 1, -1, -1):  # right products
            suffix[i] = cur             # product of everything after i
            cur *= nums[i]

        return [p * s for p, s in zip(prefix, suffix)]
```

**Time:** O(n). Two single passes (O(n) each) plus one zip pass (O(n)) = O(3n) =
O(n).
**Space:** O(n) extra for the two helper arrays.

**Key idea:** accumulate left and right products in single sweeps instead of
recomputing per index. The `append`-before-`multiply` ordering is what excludes
`nums[i]` from its own slot, removing every boundary special-case.

**По-русски:** Считаем для каждого `i` произведение слева (`prefix`) и справа
(`suffix`), потом перемножаем. Накопитель начинается с `1` и пишется в ячейку
*до* умножения на `nums[i]`, поэтому сам элемент исключается. Время O(n), память
O(n) на два массива.

> This is essentially the solution I wrote on my own (with a `deque` and manual
> boundary branches). It is correct and time-optimal; the version above is the
> cleaned-up form of the same idea.

---

## Approach 3 — O(1) extra space (the follow-up)

Store the left products directly in the output array, then make the right pass
with a **single scalar variable** instead of a second array.

```python
class Solution:
    def productExceptSelf(self, nums: List[int]) -> List[int]:
        n = len(nums)
        res = [1] * n

        for i in range(1, n):           # res[i] = product of everything LEFT of i
            res[i] = res[i - 1] * nums[i - 1]

        right = 1
        for i in range(n - 1, -1, -1):  # fold in product of everything RIGHT of i
            res[i] *= right
            right *= nums[i]

        return res
```

**Time:** O(n). Two single passes.
**Space:** O(1) extra. Only the scalar `right` beyond the required output array.

**Key idea:** the output array doubles as the prefix storage, and one running
variable replaces the entire suffix array. Same math as Approach 2, no helper
arrays.

**По-русски:** Левые произведения кладём прямо в массив ответа, правый проход
делаем одной переменной `right` вместо второго массива. Время O(n), доп. память
O(1). Та же математика, что в подходе 2, но без вспомогательных массивов.

---

## Edge cases

- **Single element** `[5]` → `[1]`. The product of nothing is `1` (empty product),
  which the `1`-initialized accumulator gives for free.
- **Contains one zero** `[1, 2, 0, 4]` → `[0, 0, 8, 0]`. Only the zero's own slot
  is non-zero (product of the others). The prefix/suffix method handles this with
  no special case, unlike division.
- **Contains two or more zeros** → all-zeros output, also handled automatically.
- **Negative numbers** → signs multiply through normally; nothing special needed.
- **Why not division** `total // nums[i]`: banned by the constraints, and it
  divides by zero / mishandles zeros even if it were allowed.

---

## How to say it out loud (interview script)

"I can't use division, so instead of dividing the total product by each element, I
note that the answer for index `i` is the product of everything to its left times
the product of everything to its right — every other element falls into exactly one
of those two groups. I compute left products in one forward pass and right products
in one backward pass, each in O(n). The clean way is to start an accumulator at 1
and write it into the slot before multiplying the current element in, which
excludes the element itself. For O(1) extra space I store the left products in the
output array and replace the right-products array with a single running variable."

**По-русски:** "Деление нельзя, поэтому ответ для `i` это произведение слева
умножить на произведение справа, любой другой элемент попадает ровно в одну из
групп. Левые произведения считаю прямым проходом, правые обратным, каждый O(n).
Чисто, начать накопитель с 1 и писать в ячейку до умножения на текущий элемент,
тогда сам элемент исключается. Для O(1) памяти храню левые произведения в массиве
ответа, а правые заменяю одной бегущей переменной."

---

## Pattern tag

`Prefix/suffix products (no division)` — the same "accumulate from both ends"
idea shows up in `trapping-rain-water` (max height from left and right) and in any
problem asking for an aggregate over "everything but this element."

[← Back to Arrays & Hashing](../README.md)
