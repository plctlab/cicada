import pt from "@cicada-lang/partech"

const preserved = [
  // keywords
  "let",
  "function",
  "return",
  "class",
  "import",
  "datatype",
  "induction",
  // built-in
  "the",
  "is",
  "TODO",
  "Pair",
  "car",
  "cdr",
  "Equal",
  "refl",
  "same",
  "the_same",
  "replace",
  "Trivial",
  "sole",
  "Absurd",
  "absurd_ind",
  "String",
  "Type",
]

export const identifier = pt.grammars.pattern_unless_preserved(
  "identifier",
  preserved
)
