---
title: Shifts Played
---

## Intro
This list includes all puzzles played with a distinct solution. I call it "shifts" because I use a Caesar Shift or [Caesar Cipher](https://en.wikipedia.org/wiki/Caesar_cipher) to avoid handling or exposing the actual solution words. It is meant to be simple but reversible way to hide the solution words so as not to accidentally spoil a puzzle. It is effective because it requires too much brain effort to decipher at a glance but it is trivial for a compute program to decode.

The actual cipher I use is to shift the letter at each position by six plus the character position, indexed by zero. Shifting differently by character position prevents exposing duplicate letters if they exist. 

A solution "shift" would be encoded as: "yoqod". 

- s -> y
- h -> o
- i -> q
- f -> o
- t -> d
