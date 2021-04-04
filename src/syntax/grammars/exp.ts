export const exp = {
  $grammar: {
    "exp:var": [{ name: "identifier" }],
    "exp:pi": [
      { $ap: ["optional", '"@"', '"forall"'] },
      { bindings: "bindings" },
      '"-"',
      '">"',
      { ret_t: "exp" },
    ],
    "exp:fn": [
      '"("',
      { name: "identifier" },
      '")"',
      '"="',
      '">"',
      { ret: "exp" },
    ],
    "exp:ap": [
      { target: "identifier" },
      { args: { $ap: ["one_or_more", '"("', "exp", '")"'] } },
    ],
    "exp:sigma": [
      { $ap: ["optional", '"@"', '"exists"'] },
      '"("',
      { name: "identifier" },
      '":"',
      { car_t: "exp" },
      '"*"',
      { cdr_t: "exp" },
      '")"',
    ],
    "exp:pair": ['"("', { car_t: "exp" }, '"*"', { cdr_t: "exp" }, '")"'],
    "exp:cons": ['"cons"', '"("', { car: "exp" }, '","', { cdr: "exp" }, '")"'],
    "exp:car": ['"car"', '"("', { target: "exp" }, '")"'],
    "exp:cdr": ['"cdr"', '"("', { target: "exp" }, '")"'],
    "exp:cls": [
      '"["',
      { demanded: { $ap: ["zero_or_more", "property"] } },
      '"]"',
    ],
    "exp:obj": [
      '"{"',
      { properties: { $ap: ["zero_or_more", "property"] } },
      '"}"',
    ],
    "exp:dot": [{ target: "exp" }, '"."', { name: "identifier" }],
    "exp:nat": ['"Nat"'],
    "exp:zero": ['"zero"'],
    "exp:add1": ['"add1"', '"("', { prev: "exp" }, '")"'],
    "exp:number": [{ value: { $pattern: ["number"] } }],
    "exp:nat_ind": [
      '"nat_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '","',
      { step: "exp" },
      '")"',
    ],
    "exp:equal": [
      '"Equal"',
      '"("',
      { t: "exp" },
      '","',
      { from: "exp" },
      '","',
      { to: "exp" },
      '")"',
    ],
    "exp:same": ['"same"'],
    "exp:replace": [
      '"replace"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '","',
      { base: "exp" },
      '")"',
    ],
    "exp:trivial": ['"Trivial"'],
    "exp:sole": ['"sole"'],
    "exp:absurd": ['"Absurd"'],
    "exp:absurd_ind": [
      '"absurd_ind"',
      '"("',
      { target: "exp" },
      '","',
      { motive: "exp" },
      '")"',
    ],
    "exp:str": ['"String"'],
    "exp:quote": [{ value: { $pattern: ["string"] } }],
    "exp:type": ['"Type"'],
    "exp:let": [
      '"@"',
      '"let"',
      { name: "identifier" },
      { exp: "exp" },
      { ret: "exp" },
    ],
    "exp:the": ['"@"', '"the"', { t: "exp" }, { exp: "exp" }],
  },
}

export const bindings = {
  $grammar: {
    "bindings:bindings": [
      '"("',
      { entries: { $ap: ["zero_or_more", "binding_entry", '","'] } },
      { last_entry: "binding_entry" },
      { $ap: ["optional", '","'] },
      '")"',
    ],
  },
}

export const binding_entry = {
  $grammar: {
    "binding_entry:named": [{ name: "identifier" }, '":"', { exp: "exp" }],
    "binding_entry:nameless": [{ exp: "exp" }],
  },
}

export const property = {
  $grammar: {
    "property:property": [
      { name: "identifier" },
      '":"',
      { exp: "exp" },
      { $ap: ["optional", '","'] },
    ],
  },
}
