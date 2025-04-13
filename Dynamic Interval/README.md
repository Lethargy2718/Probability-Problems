# Dynamic Interval

I love recursive probability problems, so I had to solve this when I came across it. Here, I showcase the problem, my solution and its implementation in `JS`.

---

## Table of Contents
- [Problem Description](#problem-description)
- [Objective](#objective)
- [Solution](#solution)
- [JavaScript Implementation](#javascript-implementation)
- [Time Complexity](#time-complexity)
- [Space Complexity](#space-complexity)
- [Future Plans](#future-plans)

---

## Problem Description

You are given an interval `[0, 1]`.

Every second, you are to pick an integer that belongs to that interval. All numbers are equally likely.

Once you pick that number (let's call it `max`), the interval becomes `[0, max + 1]`, where `max + 1` becomes the new max.

### Example

```
Step 1: Range = [0, 1] → pick 1
Step 2: Range = [0, 2] → pick 2
Step 3: Range = [0, 3] → pick 0
Step 4: Range = [0, 1] → ...
```

---

## Objective

Let `F(n, k)` denote the probability that the number `k` is selected at second `n`.

Find `F(n, k)`.

---

## Solution

First off, the biggest possible interval in a second `n` is `[0, n]`. This is achievable by picking the largest number of the interval every single time.

In conclusion, the possible intervals at a second n are:

```
[0, 1], [0, 2], ..., [0, n] (1)
```

Let's look at an example: `F(3, 2)`

How many ways can `2` be picked in the third second anyway? To figure that out, using `(1)`, let's look at all the possible intervals:

```
[0, 1], [0, 2], [0, 3]
```

Since `2` cannot be picked from the interval `[0, 1]`, then it is discarded.

In conclusion, the valid intervals for `F(n, k)` are:

```
[0, k], [0, k + 1], ..., [0, n] (2)
```

Since all numbers in an interval are equally likely to be picked, then the probability of picking a number `k` that belongs to an interval = `1 / (intervalLength + 1)` (3)

We add `1` because the intervals are 0-indexed.

So for example, if the current interval is `[0, 2]`, then the probability of picking `2` is `1 / 3`.

From (1), (2). Using the law of total probability (LOTP):

```
F(3, 2) = F(3, 2 | [0, 1]) * P([0, 1]) + F(3, 2 | [0, 2]) * P([0, 2]) + P(3, 2 | [0, 3]) * P([0, 3])
```

Using sum notation:

```
F(n, k) = ∑ (from i = k to n) F(n, k | [0, i])P([0, i]) (4)
```

This aligns with everything we've said so far. According to **LOTP**, _the probability of picking a number at a certain second = the sum of all the ways that number could be picked_.

Futhermore, it is valid to condition on the current interval; since the intervals are **disjoint** (we can only have one at a second) and **exhaustive** (their sum covers the entire sample space).

From (3), `F(n, k | [0, i])` is simply `1 / (i + 1)`. (5)

Then what about `P([0, i])`?

The only way for the current interval to be `[0, i]` is to have picked `i - 1` in the previous second, which is the `(n - 1)th` second. In other words:

```
P([0, i]) = F(n - 1, i - 1) (6)
```

Substituting (5), (6) into (4):

For integers `n ≥ 1` and `0 ≤ k ≤ n`:

```
F(n, k) = ∑ (from i = k to n) [ 1 / (i + 1) ] * F(n - 1, i - 1)
```

A recurrence relation.

Now that we have figured out it is a recurrence relation, we need to find the base cases.

- `P(1, 0) = P(1, 1) = 0.5`
- `P(n, k) = 0` if `k < 0` or `k > n`

And with that, the function is complete.

---

## JavaScript Implementation

```js
function F(n, k, dp = {}) {
    if (k < 0 || k > n) return 0;
    if (n === 1) return (k === 0 || k === 1) ? 0.5 : 0;

    if (!dp[n]) dp[n] = {};
    if (dp[n][k] !== undefined) return dp[n][k];

    let sum = 0;
    for (let i = k; i <= n; i++) {
        sum += (1 / (i + 1)) * F(n - 1, i - 1, dp);
    }
    dp[n][k] = sum;
    return sum;
}
```

---

## Time Complexity

I use memoization here due to the repeated calculation of the probabilities of intervals.

For each possible interval `[0, i]`, there exists N recursive calls, each of which has N - 1 more recursive calls, and so on.

This means the time complexity before memoization is:

```
O(N) * O(N - 1) * ... * O(1) = O(N!)
```

After memoization, each interval is only counted once. `n` can range from `1` to `N` where `N` is the total number of seconds.For each `n`, `k` ranges from `0` to `n`.

That means the total number of **unique** `(n, k)` pairs = `1 + 2 + 3 + ... + N = O(N^2)`.

For each pair, we loop between `i = k` until `n`. In the worst case `(k = 0, n = N)`, the loop runs for `N` iterations = `O(N)`.

Then the time complexity after memoization is:

```
O(N^2) * O(N) = O(N^3)
```

---

## Space Complexity

Before memoization, the only variable created is the `sum` variable which has a space complexity of `O(1)`, while the main space used is the call stack depth, which is `N`, so that has a space complexity of `O(N)`.

Then the total space complexity before memoization is:

```
O(1) * O(N) = O(N)
```

After memoization, we store the repeated calculations in a 2D memo `(dp)`. Since `k ≤ n`, the space complexity is:

```
O(N^2)
```
---

## Future Plans

I might revisit this problem someday and solve it using markov chains.
