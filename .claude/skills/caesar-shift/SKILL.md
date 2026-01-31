---
name: wordle-caesar-shift
description: Compute the Wordle position-aware Caesar shift used for solution hashes.
---

# Wordle Caesar Shift

## Purpose
Compute the Wordle "shift" (a position-aware Caesar cipher) by shifting each letter
forward by **6 + its zero-based position**. This matches the behavior used in
`static/tools/ios-shortcut.js` and described in `content/shifts/_index.md`.

## Steps
1. Normalize the input word to lowercase ASCII letters.
2. For each character at position `i`, shift it forward by `6 + i` positions in the
   alphabet (`a`–`z`), wrapping around modulo 26.
3. Join the shifted letters into the encoded shift string.

## Example
Input: `eight`

- e (pos 0) → k
- i (pos 1) → p
- g (pos 2) → o
- h (pos 3) → q
- t (pos 4) → d

Output: `kpoqd`
