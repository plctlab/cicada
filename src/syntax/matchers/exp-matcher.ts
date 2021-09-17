import pt from "@cicada-lang/partech"
import { Exp } from "../../exp"
import { nat_from_number } from "../../exps/nat/nat-util"
import * as Exps from "../../exps"
import * as ut from "../../ut"

export function pi_handler(body: { [key: string]: pt.Tree }): Exp {
  const { bindings, ret_t } = body

  return bindings_matcher(bindings)
    .reverse()
    .flatMap(({ given, names, exp }) =>
      names.map((name) => ({ given, name, exp })).reverse()
    )
    .reduce((result, { given, name, exp }) => {
      if (given) {
        if (!(result instanceof Exps.Pi || result instanceof Exps.PiIm)) {
          throw new Error(
            [
              `When reducing given names,`,
              `I expects the result to be Exps.Pi or Exps.PiIm`,
              `  result class name: ${result.constructor.name}`,
            ].join("\n")
          )
        }
        return new Exps.PiIm(name, exp, result)
      } else {
        return new Exps.Pi(name, exp, result)
      }
    }, exp_matcher(ret_t))
}

export function sigma_handler(body: { [key: string]: pt.Tree }): Exp {
  const { bindings, cdr_t } = body

  return bindings_matcher(bindings)
    .reverse()
    .flatMap(({ given, names, exp }) =>
      names.map((name) => ({ given, name, exp })).reverse()
    )
    .reduce((result, { given, name, exp }) => {
      if (given) {
        throw new Error(`The "given" keyword should not be used in sigma`)
      }
      return new Exps.Sigma(name, exp, result)
    }, exp_matcher(cdr_t))
}

export function exp_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "exp:operator": ({ operator }) => operator_matcher(operator),
    "exp:operand": ({ operand }) => operand_matcher(operand),
    "exp:declaration": ({ declaration }) => declaration_matcher(declaration),
  })(tree)
}

export function operator_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operator:var": ({ name }) => new Exps.Var(pt.str(name)),
    "operator:ap": ({ target, args }) =>
      pt.matchers
        .one_or_more_matcher(args)
        .flatMap((args) => args_matcher(args))
        .reduce((result, { given, exp }) => {
          if (given) {
            return new Exps.ApIm(result, exp)
          } else {
            return new Exps.Ap(result, exp)
          }
        }, operator_matcher(target)),
    "operator:fn": ({ names, ret }) =>
      names_matcher(names)
        .reverse()
        .reduce((result, { given, name }) => {
          if (given) {
            if (!(result instanceof Exps.Fn)) {
              throw new Error(
                [
                  `When reducing given names,`,
                  `the names_matcher expects the result to be Exps.Fn`,
                  `result class name: ${result.constructor.name}`,
                ].join("\n")
              )
            }
            return new Exps.FnIm(name, result)
          } else {
            return new Exps.Fn(name, result)
          }
        }, exp_matcher(ret)),
    "operator:car": ({ target }) => new Exps.Car(exp_matcher(target)),
    "operator:cdr": ({ target }) => new Exps.Cdr(exp_matcher(target)),
    "operator:dot_field": ({ target, name }) =>
      new Exps.Dot(operator_matcher(target), pt.str(name)),
    "operator:dot_method": ({ target, name, args }) =>
      pt.matchers
        .one_or_more_matcher(args)
        .flatMap((arg) => exps_matcher(arg))
        .reduce(
          (result, exp) => new Exps.Ap(result, exp),
          new Exps.Dot(operator_matcher(target), pt.str(name))
        ),
    "operator:nat_ind": ({ target, motive, base, step }) =>
      new Exps.NatInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:nat_rec": ({ target, base, step }) =>
      new Exps.NatRec(
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:list_ind": ({ target, motive, base, step }) =>
      new Exps.ListInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:list_rec": ({ target, base, step }) =>
      new Exps.ListRec(
        exp_matcher(target),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:vector_head": ({ target }) =>
      new Exps.VectorHead(exp_matcher(target)),
    "operator:vector_tail": ({ target }) =>
      new Exps.VectorTail(exp_matcher(target)),
    "operator:vector_ind": ({ length, target, motive, base, step }) =>
      new Exps.VectorInd(
        exp_matcher(length),
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base),
        exp_matcher(step)
      ),
    "operator:replace": ({ target, motive, base }) =>
      new Exps.Replace(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base)
      ),
    "operator:absurd_ind": ({ target, motive }) =>
      new Exps.AbsurdInd(exp_matcher(target), exp_matcher(motive)),
    "operator:either_ind": ({ target, motive, base_left, base_right }) =>
      new Exps.EitherInd(
        exp_matcher(target),
        exp_matcher(motive),
        exp_matcher(base_left),
        exp_matcher(base_right)
      ),
    "operator:the": ({ t, exp }) =>
      new Exps.The(exp_matcher(t), exp_matcher(exp)),
    "operator:is": ({ t, exp }) =>
      new Exps.The(exp_matcher(t), exp_matcher(exp)),
  })(tree)
}

export function operand_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "operand:pi": pi_handler,
    "operand:sigma": sigma_handler,
    "operand:cons": ({ car, cdr }) =>
      new Exps.Cons(exp_matcher(car), exp_matcher(cdr)),
    "operand:cls": ({ entries }) =>
      pt.matchers
        .zero_or_more_matcher(entries)
        .map(cls_entry_matcher)
        .reverse()
        .reduce(
          (rest_t, entry) =>
            entry.field
              ? new Exps.ClsFulfilled(
                  entry.field_name,
                  entry.field_name,
                  entry.field_t,
                  entry.field,
                  rest_t
                )
              : new Exps.ClsCons(
                  entry.field_name,
                  entry.field_name,
                  entry.field_t,
                  rest_t
                ),
          new Exps.ClsNil()
        ),
    "operand:ext": ({ parent, entries }) =>
      new Exps.Ext(
        operator_matcher(parent),
        pt.matchers
          .zero_or_more_matcher(entries)
          .map(cls_entry_matcher)
          .reverse()
          .reduce(
            (rest_t, entry) =>
              entry.field
                ? new Exps.ClsFulfilled(
                    entry.field_name,
                    entry.field_name,
                    entry.field_t,
                    entry.field,
                    rest_t
                  )
                : new Exps.ClsCons(
                    entry.field_name,
                    entry.field_name,
                    entry.field_t,
                    rest_t
                  ),
            new Exps.ClsNil()
          )
      ),
    "operand:obj": ({ properties }) =>
      new Exps.Obj(
        pt.matchers.zero_or_more_matcher(properties).map(property_matcher)
      ),
    "operand:nat": () => new Exps.Nat(),
    "operand:zero": () => new Exps.Zero(),
    "operand:add1": ({ prev }) => new Exps.Add1(exp_matcher(prev)),
    "operand:number": ({ value }, { span }) => {
      const n = Number.parseInt(pt.str(value))
      if (Number.isNaN(n)) {
        throw new pt.ParsingError(
          `Expecting number, instead of: ${ut.inspect(n)}`,
          { span }
        )
      } else {
        return nat_from_number(n)
      }
    },
    "operand:list": ({ elem_t }) => new Exps.List(exp_matcher(elem_t)),
    "operand:nil": () => new Exps.Nil(),
    "operand:nil_sugar": () => new Exps.Nil(),
    "operand:li": ({ head, tail }) =>
      new Exps.Li(exp_matcher(head), exp_matcher(tail)),
    "operand:li_sugar": ({ exps }) =>
      exps_matcher(exps)
        .reverse()
        .reduce((list, exp) => new Exps.Li(exp, list), new Exps.Nil()),
    "operand:vector": ({ elem_t, length }) =>
      new Exps.Vector(exp_matcher(elem_t), exp_matcher(length)),
    "operand:vecnil": () => new Exps.Vecnil(),
    "operand:vec": ({ head, tail }) =>
      new Exps.Vec(exp_matcher(head), exp_matcher(tail)),
    "operand:vec_sugar": ({ exps }) =>
      exps_matcher(exps)
        .reverse()
        .reduce((vector, exp) => new Exps.Vec(exp, vector), new Exps.Vecnil()),
    "operand:equal": ({ t, from, to }) =>
      new Exps.Equal(exp_matcher(t), exp_matcher(from), exp_matcher(to)),
    "operand:same": () => new Exps.Same(),
    "operand:trivial": () => new Exps.Trivial(),
    "operand:sole": () => new Exps.Sole(),
    "operand:absurd": () => new Exps.Absurd(),
    "operand:str": () => new Exps.Str(),
    "operand:quote": ({ value }) =>
      new Exps.Quote(pt.trim_boundary(pt.str(value), 1)),
    "operand:todo": ({ value }) =>
      new Exps.Todo(pt.trim_boundary(pt.str(value), 1)),
    "operand:either": ({ left_t, right_t }) =>
      new Exps.Either(exp_matcher(left_t), exp_matcher(right_t)),
    "operand:inl": ({ left }) => new Exps.Inl(exp_matcher(left)),
    "operand:inr": ({ right }) => new Exps.Inr(exp_matcher(right)),
    "operand:type": () => new Exps.Type(),
  })(tree)
}

export function declaration_matcher(tree: pt.Tree): Exp {
  return pt.matcher<Exp>({
    "declaration:let": ({ name, exp, ret }) =>
      new Exps.Let(pt.str(name), exp_matcher(exp), exp_matcher(ret)),
    "declaration:let_the": ({ name, t, exp, ret }) =>
      new Exps.Let(
        pt.str(name),
        new Exps.The(exp_matcher(t), exp_matcher(exp)),
        exp_matcher(ret)
      ),
    "declaration:let_fn": ({ name, bindings, ret_t, ret, body }) => {
      const fn = bindings_matcher(bindings)
        .reverse()
        .flatMap(({ given, names }) =>
          names.map((name) => ({ given, name })).reverse()
        )
        .reduce((result, { given, name }) => {
          if (given) {
            if (!(result instanceof Exps.Fn || result instanceof Exps.FnIm)) {
              throw new Error(
                [
                  `When reducing given names,`,
                  `I expects the result to be Exps.Fn or Exps.FnIm`,
                  `  result class name: ${result.constructor.name}`,
                ].join("\n")
              )
            }
            return new Exps.FnIm(name, result)
          } else {
            return new Exps.Fn(name, result)
          }
        }, exp_matcher(ret))

      return new Exps.Let(
        pt.str(name),
        new Exps.The(pi_handler({ bindings, ret_t }), fn),
        exp_matcher(body)
      )
    },
  })(tree)
}

export function cls_entry_matcher(tree: pt.Tree): {
  field_name: string
  field_t: Exp
  field?: Exp
} {
  return pt.matcher({
    "cls_entry:field_demanded": ({ name, t }) => ({
      field_name: pt.str(name),
      field_t: exp_matcher(t),
    }),
    "cls_entry:field_fulfilled": ({ name, t, exp }) => ({
      field_name: pt.str(name),
      field_t: exp_matcher(t),
      field: exp_matcher(exp),
    }),
    "cls_entry:method_demanded": ({ name, bindings, ret_t }) => ({
      field_name: pt.str(name),
      field_t: pi_handler({ bindings, ret_t }),
    }),
    "cls_entry:method_fulfilled": ({ name, bindings, ret_t, ret }) => {
      const fn = bindings_matcher(bindings)
        .reverse()
        .flatMap(({ given, names }) =>
          names.map((name) => ({ given, name })).reverse()
        )
        .reduce((result, { given, name }) => {
          if (given) {
            if (!(result instanceof Exps.Fn || result instanceof Exps.FnIm)) {
              throw new Error(
                [
                  `When reducing given names,`,
                  `I expects the result to be Exps.Fn or Exps.FnIm`,
                  `  result class name: ${result.constructor.name}`,
                ].join("\n")
              )
            }
            return new Exps.FnIm(name, result)
          } else {
            return new Exps.Fn(name, result)
          }
        }, exp_matcher(ret))

      return {
        field_name: pt.str(name),
        field_t: pi_handler({ bindings, ret_t }),
        field: fn,
      }
    },
  })(tree)
}

export function bindings_matcher(tree: pt.Tree): Array<{
  given: boolean
  names: Array<string>
  exp: Exp
}> {
  return pt.matcher({
    "bindings:bindings": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(binding_entry_matcher),
      binding_entry_matcher(last_entry),
    ],
  })(tree)
}

export function binding_entry_matcher(tree: pt.Tree): {
  given: boolean
  names: Array<string>
  exp: Exp
} {
  return pt.matcher({
    "binding_entry:nameless": ({ exp }) => ({
      given: false,
      names: ["_"],
      exp: exp_matcher(exp),
    }),
    "binding_entry:named": ({ name, exp }) => ({
      given: false,
      names: [pt.str(name)],
      exp: exp_matcher(exp),
    }),
    "binding_entry:given_named": ({ name, exp }) => ({
      given: true,
      names: [pt.str(name)],
      exp: exp_matcher(exp),
    }),
  })(tree)
}

export function names_matcher(
  tree: pt.Tree
): Array<{ given: boolean; name: string }> {
  return pt.matcher({
    "names:names": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(name_entry_matcher),
      name_entry_matcher(last_entry),
    ],
    "names:names_bracket_separated": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(name_entry_matcher),
      name_entry_matcher(last_entry),
    ],
  })(tree)
}

export function name_entry_matcher(tree: pt.Tree): {
  given: boolean
  name: string
} {
  return pt.matcher({
    "name_entry:name_entry": ({ name }) => ({
      given: false,
      name: pt.str(name),
    }),
    "name_entry:given_name_entry": ({ name }) => ({
      given: true,
      name: pt.str(name),
    }),
  })(tree)
}

export function exps_matcher(tree: pt.Tree): Array<Exp> {
  return pt.matcher({
    "exps:exps": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(exp_matcher),
      exp_matcher(last_entry),
    ],
  })(tree)
}

export function args_matcher(tree: pt.Tree): Array<{
  given: boolean
  exp: Exp
}> {
  return pt.matcher({
    "args:args": ({ entries, last_entry }) => [
      ...pt.matchers.zero_or_more_matcher(entries).map(arg_entry_matcher),
      arg_entry_matcher(last_entry),
    ],
  })(tree)
}

export function arg_entry_matcher(tree: pt.Tree): {
  given: boolean
  exp: Exp
} {
  return pt.matcher({
    "arg_entry:arg_entry": ({ exp }) => ({
      given: false,
      exp: exp_matcher(exp),
    }),
    "arg_entry:given_arg_entry": ({ exp }) => ({
      given: true,
      exp: exp_matcher(exp),
    }),
  })(tree)
}

export function property_matcher(tree: pt.Tree): Exps.Prop {
  return pt.matcher<Exps.Prop>({
    "property:field_shorthand": ({ name }) =>
      new Exps.FieldShorthandProp(pt.str(name)),
    "property:field": ({ name, exp }) =>
      new Exps.FieldProp(pt.str(name), exp_matcher(exp)),
    "property:method": ({ name, bindings, ret_t }) =>
      new Exps.FieldProp(pt.str(name), pi_handler({ bindings, ret_t })),
    "property:spread": ({ exp }) => new Exps.SpreadProp(exp_matcher(exp)),
  })(tree)
}
