# 49. Group Anagrams

| | |
|---|---|
| **Topic** | [Arrays & Hashing](../README.md) |
| **Difficulty** | Medium |
| **LeetCode** | [leetcode.com/problems/group-anagrams](https://leetcode.com/problems/group-anagrams/) |
| **Pattern** | Canonical key (sorted word or letter-count tuple) → hash map bucketing |

---

## Problem (restated)

Given an array of strings `strs`, group together the ones that are anagrams of
each other. Return a list of groups (order of groups and of words within a group
doesn't matter).

**По-русски:** Дан массив строк `strs`. Сгруппировать те, что являются анаграммами
друг друга. Вернуть список групп (порядок групп и слов внутри не важен).

---

## Example walkthrough

`strs = ["eat", "tea", "tan", "ate", "nat", "bat"]`

Compute a fingerprint per word (sorted letters):

| word | sorted key | bucket after |
|---|---|---|
| eat | `aet` | `{aet: [eat]}` |
| tea | `aet` | `{aet: [eat, tea]}` |
| tan | `ant` | `{aet:[...], ant: [tan]}` |
| ate | `aet` | `{aet: [eat, tea, ate], ant:[...]}` |
| nat | `ant` | `{aet:[...], ant: [tan, nat]}` |
| bat | `abt` | `{..., abt: [bat]}` |

Answer = the buckets: `[[eat, tea, ate], [tan, nat], [bat]]`.

---

## Brute force

Compare every word to every group's representative; if it's an anagram (e.g.
sorted forms match), drop it in that group, else start a new group.

**Time:** O(m^2 · k log k) — for each of `m` words you may compare against every
existing group, and each anagram check sorts `k` chars.
**Space:** O(m · k).

**Why this is wasteful:** the outer comparison against every group repeats work.
If each word can compute *its own* group key directly, we skip all the pairwise
comparisons and just look the key up.

**По-русски:** Подход "в лоб" (brute force), сравнивать каждое слово с
представителем каждой группы. Время O(m^2 · k log k), память O(m · k).
Расточительно из-за попарных сравнений, если слово само вычисляет свой ключ
группы, сравнения не нужны.

---

## Optimized approach — canonical key + hash map

Every anagram of a word shares the same letters with the same counts. So map each
word to a **canonical key** that is identical for anagrams and different for
non-anagrams, then bucket words by that key in a hash map. The answer is the
map's values.

Two ways to build the key:

### A) Sorted-string key (simplest)

```python
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)          # key -> list of words
        for word in strs:
            key = "".join(sorted(word))     # "eat" -> "aet"
            groups[key].append(word)
        return list(groups.values())
```

- `defaultdict(list)` auto-creates an empty list for a missing key, so
  `groups[key].append(word)` works on first sight of a key (no membership check).
- `sorted(word)` returns a **list** of chars in order; `"".join(...)` glues it
  into a string. We need a string because a **list can't be a dict key**.

**Time:** O(m · k log k) · **Space:** O(m · k)

### B) Letter-count-tuple key (faster, no sort)

```python
from collections import defaultdict

class Solution:
    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:
        groups = defaultdict(list)
        for word in strs:
            count = [0] * 26                     # a-z tally
            for c in word:
                count[ord(c) - ord('a')] += 1    # ord trick from 242
            groups[tuple(count)].append(word)    # tuple is hashable, list isn't
        return list(groups.values())
```

- Build the 26-letter count signature (the `ord(c) - ord('a')` indexing from
  Valid Anagram). Equal counts ⇒ anagrams.
- `tuple(count)` makes the list **hashable** so it can be a dict key (a `list`
  cannot, a `tuple` is immutable and hashable).

**Time:** O(m · k) · **Space:** O(m · k)

**Key idea:** turn "are these anagrams?" into "do these produce the same key?",
then let the hash map do the grouping in one pass.

**По-русски:** Каждая анаграмма слова имеет те же буквы с теми же частотами.
Сопоставляем каждому слову канонический ключ, одинаковый для анаграмм, и
группируем по нему в хэш-таблице (hash map), ответ, значения таблицы. Ключ, это
либо отсортированные буквы (строка), либо кортеж (tuple) из 26 счётчиков. Список
(list) ключом быть не может (unhashable), кортеж может. Вариант со счётчиками
быстрее, O(m · k) против O(m · k log k), без сортировки.

---

## New constructs used

- **`defaultdict(list)`** — a dict that creates a default value (empty list) for
  any missing key on first access. Replaces the `if key not in d: d[key] = []`
  boilerplate.
- **`"".join(iterable)`** — concatenates an iterable of strings into one string
  using the separator on the left (`""` = no separator).
- **`tuple(seq)`** — converts a sequence to an immutable tuple, which (unlike a
  list) is hashable and usable as a dict key.

---

## Edge cases

- **Empty input** `[]` → no words → return `[]`.
- **Single word** `["abc"]` → one bucket → `[["abc"]]`.
- **Empty string** `[""]` → key is `""` (or all-zero count tuple) → `[[""]]`.
- **No anagrams at all** → every word is its own bucket.
- **All identical** `["a","a"]` → same key → one bucket `[["a","a"]]`.

---

## How to say it out loud (interview script)

"Anagrams share identical letter frequencies, so I map each word to a canonical
key, either its sorted letters or a 26-length letter-count tuple, and bucket
words by that key in a hash map. One pass groups everything; I return the map's
values. Sorting the key is O(k log k) per word; if I want to drop the sort I use
the count tuple for O(k) per word. Overall O(m·k log k) or O(m·k)."

**По-русски:** "Анаграммы имеют одинаковые частоты букв, поэтому сопоставляю
каждому слову канонический ключ, отсортированные буквы или кортеж из 26 счётчиков,
и группирую по нему в хэш-таблице. Один проход группирует всё, возвращаю значения
таблицы. Сортировка ключа, O(k log k) на слово, кортеж счётчиков, O(k). Итого
O(m·k log k) или O(m·k)."

---

## Pattern tag

`Canonical key → hash map bucketing` — the "reduce each item to a key that's
equal iff items belong together, then group in a map" move. Built on the letter
counting from [Valid Anagram](../0242-valid-anagram/README.md); same hash-map
family as [Two Sum](../0001-two-sum/README.md) and
[Top K Frequent Elements](../0347-top-k-frequent-elements/README.md) (count, then
group/pick).

[← Back to Arrays & Hashing](../README.md)
