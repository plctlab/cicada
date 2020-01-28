import * as Env from "./env"
import * as Top from "./top"
import * as Err from "./err"
import * as Scope from "./scope"
import { evaluate } from "./evaluate"
import { infer } from "./infer"
import { check } from "./check"
import * as pretty from "./pretty"

export function run(
  top_list: Array<Top.Top>,
  config: { [key: string]: any },
): void {
  try {
    top_list_check_and_evaluate(top_list, config)
  }

  catch (error) {
    if (error instanceof Err.Report) {
      report_print(error, config)
      process.exit(1)
    }

    else {
      throw error
    }
  }
}

function report_print(
  report: Err.Report,
  config: { [key: string]: any },
): void {
  console.log(report.message)
}

function top_list_check_and_evaluate(
  top_list: Array<Top.Top>,
  config: { [key: string]: any },
): void {
  let local_env = new Env.Env()

  for (let top of top_list) {
    if (top instanceof Top.TopNamedScopeEntry) {
      let { name, entry } = top

      if (entry instanceof Scope.Entry.Let) {
        let exp = entry.value

        let found = local_env.lookup_value(name)
        if (found !== undefined) {
          throw new Err.Report([
            `name: ${name} is already defined to value: ${pretty.pretty_value(found)}\n`])
        }
        let t = infer(local_env, exp)
        let value = evaluate(local_env, exp)
        local_env = local_env.ext(name, { t, value })
        if (config["verbose"] !== undefined) {
          console.log(`${name} = ${pretty.pretty_exp(exp)}`)
          console.log(`${name} = ${pretty.pretty_value(value)} : ${pretty.pretty_value(t)}`)
          console.log()
        }
      }

      else if (entry instanceof Scope.Entry.Given) {
        throw new Error(
          "run fail\n" +
            `can not handle top level Entry.Given\n`)
      }

      else if (entry instanceof Scope.Entry.Define) {
        let t_exp = entry.t
        let exp = entry.value
        let found = local_env.lookup_value(name)
        if (found !== undefined) {
          throw new Err.Report([
            `name: ${name} is already defined to value: ${pretty.pretty_value(found)}\n`])
        }
        let t_expected = evaluate(local_env, t_exp)
        check(local_env, exp, t_expected)
        local_env = local_env.ext_rec(name, { t: t_exp, value: exp, env: local_env })
        let value = evaluate(local_env, exp)
        if (config["verbose"] !== undefined) {
          console.log(`${name} : ${pretty.pretty_exp(t_exp)} = ${pretty.pretty_exp(exp)}`)
          console.log(`${name} : ${pretty.pretty_exp(t_exp)} = ${pretty.pretty_value(value)}`)
          console.log()
        }
      }

      else {
        throw new Error(
          "run fail\n" +
            `unhandled class of Scope.Entry: ${entry.constructor.name}\n`)
      }
    }

    //     case TopKeywordRefuse(exp, t_exp) =>
    //       let t_expected = evaluate(local_env, t_exp)
    //     Try {
    //       check(local_env, exp, t_expected)
    //       console.log("@refuse")
    //       console.log("v: ${pretty.pretty_value(evaluate(local_env, exp))}")
    //       console.log("t_expected: ${pretty.pretty_value(t_expected)}")
    //       console.log("@refuse raw Value")
    //       console.log("v: ${evaluate(local_env, exp)}")
    //       console.log("t_expected: ${t_expected}")
    //     } match {
    //       case Success(()) =>
    //         throw Report(Array(
    //           "should refuse the following type membership assertion\n" +
    //             "@refuse ${pretty.pretty_exp(exp)} : ${pretty.pretty_exp(t_exp)}\n"
    //         ))
    //       case Failure(_report: Report) =>
    //         if (config.get("--verbose") !== undefined) {
    //           console.log("@refuse ${pretty.pretty_exp(exp)} : ${pretty.pretty_exp(t_exp)}")
    //         }
    //       case Failure(error) =>
    //         throw error
    //     }

    //     case TopKeywordAccept(exp, t_exp) =>
    //       let t_expected = evaluate(local_env, t_exp)
    //     Try {
    //       check(local_env, exp, t_expected)
    //     } match {
    //       case Success(()) =>
    //         if (config.get("--verbose") !== undefined) {
    //           console.log("@accept ${pretty.pretty_exp(exp)} : ${pretty.pretty_exp(t_exp)}")
    //         }
    //       case Failure(report: Report) =>
    //         report_print(report, config)
    //       throw Report(Array(
    //         "should accept the following type membership assertion\n" +
    //           "@accept ${pretty.pretty_exp(exp)} : ${pretty.pretty_exp(t_exp)}\n"
    //       ))
    //       case Failure(error) =>
    //         throw error
    //     }

    //     case TopKeywordShow(exp) =>
    //       let t = infer(local_env, exp)
    //     let value = evaluate(local_env, exp)
    //     console.log("@show ${pretty.pretty_exp(exp)}")
    //     console_print_with_color_when {
    //       config.get("--nocolor") == None
    //     } (Console.CYAN) {
    //       case () =>
    //         console.log("@show ${pretty.pretty_value(value)} : ${pretty.pretty_value(t)}")
    //       console.log()
    //     }

    //     case TopKeywordEq(rhs: Exp, lhs: Exp) =>
    //       infer(local_env, rhs)
    //     infer(local_env, lhs)
    //     Try {
    //       equivalent(evaluate(local_env, rhs), evaluate(local_env, lhs))
    //     } match {
    //       case Success(()) =>
    //         if (config.get("--verbose") !== undefined) {
    //           console.log("@eq ${pretty.pretty_exp(rhs)} = ${pretty.pretty_exp(lhs)}")
    //         }
    //       case Failure(report: Report) =>
    //         report_print(report, config)
    //       throw Report(Array(
    //         "should accept the following equivalent assertion\n" +
    //           "@eq ${pretty.pretty_exp(rhs)} = ${pretty.pretty_exp(lhs)}\n"
    //       ))
    //       case Failure(error) =>
    //         throw error
    //     }

  }
}
