// organize-imports-ignore

export * from "./var/var"
export * from "./var/var-core"
export * from "./var/var-neutral"

export * from "./built-in/built-in-core"
export * from "./built-in/built-in-value"

// NOTE Even with built-in `the`, well still need the following
// - `Exps.The` -- used by matchers to handle `let_the`
// - `Exps.TheCore` -- used by `Value.readback` to handle special case on `AbsurdValue`
// TODO Maybe we should improve this by
// - handle `let_the` in different way
// - handle `Value.readback` special case on `AbsurdValue` in different way
export * from "./the/the"
export * from "./the/the-core"
export * from "./the/the-value"

export * from "./todo/todo-value"
export * from "./todo/todo-note-value"

export * from "./type/type-value"

export * from "./sequence/begin"
export * from "./sequence/let"
export * from "./sequence/let-core"

export * from "./not-yet/not-yet-value"

export * from "./pi/pi"
export * from "./pi/pi-core"
export * from "./pi/pi-value"
export * from "./pi/fn"
export * from "./pi/fn-core"
export * from "./pi/fn-value"
export * from "./pi/ap"
export * from "./pi/ap-core"
export * from "./pi/ap-neutral"
export * from "./pi/arg-entry"
export * from "./pi/multi-ap"

export * from "./implicit-pi/implicit-pi"
export * from "./implicit-pi/implicit-pi-core"
export * from "./implicit-pi/implicit-pi-value"
export * from "./implicit-pi/implicit-fn"
export * from "./implicit-pi/implicit-fn-core"
export * from "./implicit-pi/implicit-fn-value"
export * from "./implicit-pi/implicit-ap"
export * from "./implicit-pi/implicit-ap-core"
export * from "./implicit-pi/implicit-ap-neutral"

export * from "./vague-pi/vague-pi"
export * from "./vague-pi/vague-pi-core"
export * from "./vague-pi/vague-pi-value"
export * from "./vague-pi/vague-fn"
export * from "./vague-pi/vague-fn-core"
export * from "./vague-pi/vague-fn-value"
export * from "./vague-pi/vague-ap"
export * from "./vague-pi/vague-ap-core"
export * from "./vague-pi/vague-ap-neutral"

export * from "./sigma/sigma"
export * from "./sigma/sigma-core"
export * from "./sigma/sigma-value"
export * from "./sigma/pair-value"
export * from "./sigma/cons"
export * from "./sigma/cons-core"
export * from "./sigma/cons-value"
export * from "./sigma/car"
export * from "./sigma/car-core"
export * from "./sigma/car-neutral"
export * from "./sigma/cdr"
export * from "./sigma/cdr-core"
export * from "./sigma/cdr-neutral"

export * from "./equal/equal-value"
export * from "./equal/refl-value"
export * from "./equal/same-value"
export * from "./equal/the-same-value"
export * from "./equal/same-as-chart"
export * from "./equal/replace-neutral"
export * from "./equal/replace-value"

export * from "./absurd/absurd-value"
export * from "./absurd/from-falsehood-anything-neutral"
export * from "./absurd/from-falsehood-anything-value"

export * from "./str/str-value"
export * from "./str/quote"
export * from "./str/quote-core"
export * from "./str/quote-value"

export * from "./datatype/data-ctor-binding"
export * from "./datatype/type-ctor"
export * from "./datatype/type-ctor-core"
export * from "./datatype/type-ctor-value"
export * from "./datatype/curried-type-ctor-value"
export * from "./datatype/datatype-value"
export * from "./datatype/data-ctor-value"
export * from "./datatype/curried-data-ctor-value"
export * from "./datatype/data-value"
export * from "./datatype/case-entry"
export * from "./datatype/induction"
export * from "./datatype/induction-core"
export * from "./datatype/induction-neutral"

// NOTE subclass must follow abstract class
export * from "./cls/cls"
export * from "./cls/nil-cls"
export * from "./cls/cons-cls"
export * from "./cls/fulfilled-cls"
export * from "./cls/ext"
export * from "./cls/cls-core"
export * from "./cls/nil-cls-core"
export * from "./cls/cons-cls-core"
export * from "./cls/fulfilled-cls-core"
export * from "./cls/cls-value"
export * from "./cls/nil-cls-value"
export * from "./cls/cons-cls-value"
export * from "./cls/fulfilled-cls-value"
export * from "./cls/obj"
export * from "./cls/obj-core"
export * from "./cls/obj-value"
export * from "./cls/dot"
export * from "./cls/dot-core"
export * from "./cls/dot-neutral"

export * from "./trivial/trivial-value"
export * from "./trivial/sole-value"

// NOTE `built-ins` imports concrete built-in-values,
//   thus must follow them.
export * from "./built-in/built-ins"
