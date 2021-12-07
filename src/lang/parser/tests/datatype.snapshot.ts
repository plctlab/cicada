import { tester } from "../parser-tester-instance"

// TODO The examples should be fixed after the `prelude` feature.

tester.echo_stmts(`

datatype MyNat {
  my_zero: MyNat
  my_add1(prev: MyNat): Nat
}

datatype List(E: Type) {
  null: List(E)
  cons(head: E, tail: List(E)): List(E)
}

datatype MyVector(E: Type) (length: Nat) {
  null: Vector(E, MyNat.my_zero)
  cons(
    head: E,
    implicit prev: Nat,
    tail: Vector(E, prev),
  ): Vector(E, MyNat.my_add1(prev))
}

datatype LessThan() (j: Nat, k: Nat) {
  zero_smallest(n: Nat): LessThan(MyNat.my_zero, MyNat.my_add1(n))
  add1_smaller(
    j: Nat, k: Nat,
    prev_smaller: LessThan(j, k),
  ): LessThan(MyNat.my_add1(j), MyNat.my_add1(k))
}

`)
