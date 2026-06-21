# 242. Valid Anagram

| | |
|---|---|
| **Topic** | [Arrays & Hashing](../README.md) |
| **Difficulty** | Easy |
| **LeetCode** | [leetcode.com/problems/valid-anagram](https://leetcode.com/problems/valid-anagram/) |
| **Pattern** | Character frequency counting with a hash map; equal counts ⇒ anagram |

---

## Problem (restated)

Given two strings `s` and `t`, return `True` if `t` is an anagram of `s`, that
is, `t` uses exactly the same letters as `s` with the same frequencies, just
possibly reordered. Otherwise `False`.

Key constraint to say out loud: **anagrams must have equal length.** If lengths
differ, the answer is immediately `False`. (LeetCode's base version is lowercase
English letters; the follow-up asks about Unicode.)

**По-русски:** Даны две строки `s` и `t`. Вернуть `True`, если `t`, это
анаграмма `s`, то есть в `t` ровно те же буквы с теми же частотами, просто
переставленные. Иначе `False`. Важно, у анаграмм длины равны, разная длина сразу
даёт `False`.

---

## Example walkthrough

`s = "anagram"`, `t = "nagaram"`

Count letters in `s`: `a:3, n:1, g:1, r:1, m:1`.
Count letters in `t`: `a:3, n:1, g:1, r:1, m:1`.

Identical frequency maps → `True`.

Counter-example: `s = "rat"`, `t = "car"`. Same length, but `s` has `t:1` while
`t` has `c:1`. The maps differ → `False`.

---

## Brute force

Sort both strings and compare. Two strings are anagrams iff their sorted forms
are identical.

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return sorted(s) == sorted(t)
```

`sorted("rat") == ['a','r','t']`, `sorted("car") == ['a','c','r']` → not equal →
`False`.

**Time:** O(n log n) — the sort dominates.
**Space:** O(n) — `sorted` builds a new list of characters (Python's sort isn't
in-place on a string; it returns a list).

**Why this is wasteful:** sorting throws away the only thing we care about
(*how many* of each letter) and pays a `log n` factor to do it. We don't need
the letters in order, we just need their counts.

**По-русски:** Подход "в лоб" (brute force), отсортировать обе строки и сравнить.
Анаграммы, это строки с одинаковой сортировкой. Время O(n log n), память O(n).
Расточительно, потому что сортировка даёт нам порядок, который не нужен, нам
важны только частоты букв (frequencies), а за сортировку мы платим лишний
множитель log n.

---

## Optimized approach

Count the frequency of each character with a **hash map** (Python's
`collections.Counter` is exactly this), then check that both strings produce the
same counts.

**Time:** O(n) — one pass to count `s`, one pass to count `t`, one pass to
compare.
**Space:** O(1) if the alphabet is fixed (26 lowercase letters → at most 26
keys); O(n) in the general Unicode case.

**Key idea:** an anagram is defined purely by character frequencies, so the
moment two frequency maps are equal, you're done. No ordering needed.

```python
from collections import Counter

class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        return Counter(s) == Counter(t)
```

`Counter(s) == Counter(t)` compares the two maps key-by-key. If lengths differ,
some key's count won't match, so it correctly returns `False` without a separate
length check (though an explicit early `if len(s) != len(t): return False` is a
nice O(1) fast-path).

**По-русски:** Оптимально, считаем частоту каждого символа хэш-таблицей (hash
map), в Python это `Counter`, и сравниваем две карты частот. Равны, значит
анаграмма. Время O(n), память O(1) для фиксированного алфавита из 26 букв (или
O(n) для Unicode). Главная идея, анаграмма определяется только частотами, порядок
не нужен.

---

## Your approach (what you wrote)

```python
class Solution:
    def isAnagram(self, s: str, t: str) -> bool:
        if len(s) > len(t):
            letterCounter = Counter(s)
            x = t
        else:
            letterCounter = Counter(t)
            x = s
        for letter in x:
            if letter in letterCounter:
                letterCounter[letter] -= 1
        for key in letterCounter:
            if letterCounter[key] > 0:
                return False
        return True
```

**Verdict: this is correct.** It passes. Nice work, especially building the
counter from the longer string. But it's correct for a *subtle* reason, and that
subtlety is exactly what to improve.

### Why it actually works (the hidden invariant)

You build the counter from the longer (or equal) string `A`, decrement once per
matching letter in the shorter string `x`, then fail if any count is still
positive. The reason this is right:

- The sum of all counts starts at `len(A)`. Each decrement removes 1, so after
  the loop the sum equals `len(A) − (letters of x that exist in A)`.
- If lengths differ, `A` is strictly longer, so the sum stays **> 0**, meaning
  some key is still positive → returns `False`. Correct.
- If lengths are equal, the only way every count lands at exactly 0 is if every
  letter of `x` matched a letter of `A` with identical frequencies → a true
  anagram.

So the length-asymmetry trick is silently standing in for an explicit length
check. It works, but you'd have to *prove* all that to an interviewer, and a
reviewer reading it has to reverse-engineer the invariant.

### What can be improved and why

1. **Make the length check explicit.** `if len(s) != len(t): return False` up
   front is an O(1) early exit and removes the need for the longer/shorter
   branching entirely. Clearer intent, easier to defend.
   *Почему:* явная проверка длины убирает хитрую логику и сразу отсекает
   неравные длины.

2. **`> 0` hides negative counts.** Your check only catches *leftover* letters,
   not *over-used* ones (a count going negative). It's safe here only because of
   the length argument above. With an explicit length check you can check
   `!= 0`, which is the honest condition and doesn't depend on the trick.
   *Почему:* `> 0` пропускает отрицательные значения, корректно только из-за
   инварианта длины, проверка `!= 0` честнее.

3. **The branching adds cognitive load for zero benefit.** Building from the
   longer string doesn't change the O(n) complexity. One counter + decrement is
   simpler:

   ```python
   from collections import Counter

   class Solution:
       def isAnagram(self, s: str, t: str) -> bool:
           if len(s) != len(t):
               return False
           counts = Counter(s)
           for ch in t:
               counts[ch] -= 1
               if counts[ch] < 0:        # t has a letter s doesn't have enough of
                   return False
           return True
   ```

   *Почему:* меньше веток, та же сложность, логика читается сверху вниз.

4. **Or just use equality** — `return Counter(s) == Counter(t)` (with the length
   check folded in automatically). Shortest, most idiomatic, and obviously
   correct at a glance.

Bottom line: your instinct (count letters, then verify) is exactly the right
pattern. The improvement is about *legibility and provability*, not correctness
or speed.

---

## Edge cases

- **Different lengths** `s="a"`, `t="ab"` → not anagrams → `False`. (Your version
  catches this via the longer-string trick; the explicit check is clearer.)
- **Both empty** `s=""`, `t=""` → `True` (vacuously equal).
- **Same letters, different counts** `s="aab"`, `t="abb"` → `False`.
- **Identical strings** `s="abc"`, `t="abc"` → `True` (a string is its own
  anagram).
- **Unicode follow-up** — `Counter`/dict handles arbitrary characters; a fixed
  26-slot array would not.

---

## How to say it out loud (interview script)

"Anagrams are defined entirely by character frequency, order doesn't matter. So
first I check the lengths, if they differ it's an instant `False`. Then I count
the characters of `s` in a hash map and decrement for each character in `t`; if
any count goes negative, `t` has a letter `s` can't cover, so `False`. If I
finish clean, they match. That's O(n) time and O(1) space for a fixed alphabet,
versus the O(n log n) sort-and-compare brute force."

**По-русски:** "Анаграмма определяется только частотой символов, порядок не важен.
Сначала проверяю длины, разные, сразу `False`. Потом считаю символы `s` в
хэш-таблице (hash map) и уменьшаю счётчик для каждого символа `t`, если ушёл в
минус, значит в `t` есть лишняя буква, `False`. Дошёл до конца чисто, значит
анаграмма. Время O(n), память O(1) для фиксированного алфавита, против O(n log n)
у сортировки."

---

## Pattern tag

`Character frequency map; equal counts ⇒ match` — the same "count things with a
hash map and compare" move appears in [Group Anagrams](../0049-group-anagrams/README.md)
(use the sorted string or count-tuple as a dictionary key) and
[Top K Frequent Elements](../0347-top-k-frequent-elements/README.md) (count
frequencies, then pick the largest). It builds directly on the hash-set idea
from [Contains Duplicate](../0217-contains-duplicate/README.md).

[← Back to Arrays & Hashing](../README.md)
