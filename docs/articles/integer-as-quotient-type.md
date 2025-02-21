---
title: Integer as quotient type
author: Xie Yuheng
date: 2021-10-19
---

Firstly, we define `Integer` as a class (record type).

An integer is defined as a pair of natural numbers, `left` and `right`.
The intention of our definition, is to view the integer as equal to `left` minus `right`.

```cicada
datatype Nat {
  zero: Nat
  add1(prev: Nat): Nat
}

class Integer {
  left: Nat
  right: Nat
}
```

Secondly, we need the help of `add` to define the equivalence between `Integer`.

Given `x: Integer` and `y: Integer`.

We say `x` is equivalent to `y`,
iff `x.left` minus `x.right` is equal to `y.left` minus `y.right`,
after transposition, we have `add(x.left, y.right)` equal `add(y.left, x.right)`.

```cicada
function add(x: Nat, y: Nat): Nat {
  return recursion (x) {
    case zero => y
    case add1(prev, almost) => Nat.add1(almost.prev)
  }
}

function IntegerEqual(x: Integer, y: Integer): Type {
  return Equal(Nat, add(x.left, y.right), add(y.left, x.right))
}
```

Example of equivalent integers:

```cicada
let zero = Nat.zero
let one = Nat.add1(zero)
let two = Nat.add1(one)
let three = Nat.add1(two)
let four = Nat.add1(three)
let five = Nat.add1(four)
let six = Nat.add1(five)
let seven = Nat.add1(six)
let eight = Nat.add1(seven)
let nine = Nat.add1(eight)
let ten = Nat.add1(nine)

compute the(
  IntegerEqual(
    { left: eight, right: five },
    { left: ten, right: seven }),
  refl)
```

This concludes our demonstration of the basic idea of quotient type.

But to work with quotient types well,
we still need some helps from the language.

# Quotient as a function

We know quotient is about equivalent class,
and an equivalence class can always be captured by a function,
say `f: (X) -> Y`,
the inverse image of `b: Y` can be viewed as a subset of `X`,
and an equivalence class.

Can we directly define the structure of integer by the built-in equivalent `Equal`,
and use a function to capture quotient type?

This means that the classification problem of the equivalence class is solved,
which might not always be the case.

```cicada
datatype Int {
  zero: Int
  add1(n: Nat): Int
  neg_sub1(n: Nat): Int
}

function classify(x: Integer): Int {
  return TODO
}
```
