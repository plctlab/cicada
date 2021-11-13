export const stmts = {
  $grammar: {
    "stmts:stmts": [{ stmts: { $ap: ["zero_or_more", "stmt"] } }],
  },
}

export const stmt = {
  $grammar: {
    "stmt:define": [{ name: "identifier" }, '"="', { exp: "exp" }],
    "stmt:define_the": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"="',
      { exp: "exp" },
    ],
    "stmt:define_the_flower_bracket": [
      { name: "identifier" },
      '":"',
      { t: "exp" },
      '"{"',
      { exp: "exp" },
      '"}"',
    ],
    "stmt:define_fn": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
      '"{"',
      { ret: "exp" },
      '"}"',
    ],
    "stmt:show_operator": [{ operator: "operator" }],
    "stmt:show_operand": [{ operand: "operand" }],
    "stmt:class": [
      '"class"',
      { name: "identifier" },
      '"{"',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"}"',
    ],
    "stmt:class_extends": [
      '"class"',
      { name: "identifier" },
      '"extends"',
      { parent: "operator" },
      '"{"',
      { entries: { $ap: ["zero_or_more", "cls_entry"] } },
      '"}"',
    ],
    "stmt:import": [
      '"import"',
      '"{"',
      { entries: { $ap: ["zero_or_more", "import_entry"] } },
      '"}"',
      '"from"',
      { path: { $pattern: ["string"] } },
    ],
    "stmt:datatype": [
      '"datatype"',
      { name: "identifier" },
      '"{"',
      { ctors: { $ap: ["one_or_more", "ctor"] } },
      '"}"',
    ],
    "stmt:datatype_parameters": [
      '"datatype"',
      { name: "identifier" },
      '"("',
      { parameters: "simple_bindings" },
      '")"',
      '"{"',
      { ctors: { $ap: ["one_or_more", "ctor"] } },
      '"}"',
    ],
    "stmt:datatype_parameters_indexes": [
      '"datatype"',
      { name: "identifier" },
      '"("',
      { parameters: "simple_bindings" },
      '")"',
      '"("',
      { indexes: "simple_bindings" },
      '")"',
      '"{"',
      { ctors: { $ap: ["one_or_more", "ctor"] } },
      '"}"',
    ],
    "stmt:datatype_indexes": [
      '"datatype"',
      { name: "identifier" },
      '"("',
      '")"',
      '"("',
      { indexes: "simple_bindings" },
      '")"',
      '"{"',
      { ctors: { $ap: ["one_or_more", "ctor"] } },
      '"}"',
    ],
  },
}

export const import_entry = {
  $grammar: {
    "import_entry:name": [{ name: "identifier" }, { $ap: ["optional", '","'] }],
    "import_entry:name_alias": [
      { name: "identifier" },
      '":"',
      { alias: "identifier" },
      { $ap: ["optional", '","'] },
    ],
  },
}

export const ctor = {
  $grammar: {
    "ctor:field": [{ name: "identifier" }, '":"', { t: "exp" }],
    "ctor:method": [
      { name: "identifier" },
      '"("',
      { bindings: "bindings" },
      '")"',
      '":"',
      { ret_t: "exp" },
    ],
  },
}
