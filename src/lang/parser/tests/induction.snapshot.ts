import { tester } from "../parser-tester-instance"

tester.echo_stmts(`

induction (x) {
  (_) => MyNat
  case my_zero => y
  case my_add1(_prev, almost) => MyNat.my_add1(almost.prev)
}

induction (x) {
  (length, _target) => MyVector(E, add(length, yl))
  case my_null => y
  case my_cons(head, _tail, almost) => MyVector.my_cons(head, almost.tail)
}

`)
