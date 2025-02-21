---
title: Installation
---

**Cicada Language** is designed to be extremely accessible.

Code blocks embedded in Markdown file are interactive on our website.

Hovering over the following code block, you will see a menu button,
by which you can `RUN` the code.

```cicada
let greeting = "Hello, World!"

compute greeting
```

# Git-based Wiki System

Any Markdown file on GitHub or GitLab,
can be rendered as an `Article` by [Readonly.Link](https://readonly.link/),
in which the cicada code blocks are interactive.

We also support rendering `Book` and `Manual`.
Please visit [Readonly.Link](https://readonly.link/) to see instructions.

- For example, the manual you are reading now,
  is rendered as a `Manual` by [Readonly.Link](https://readonly.link/).

Thus our website can be viewed as a git-based wiki of books, articles and more,
by which we can share programs and formalized proofs.

# Command Line Tools

We also provide a set of command line tools.

The command line program is called `cic`,
you can install it using `npm` by the follow command:

```
npm --global install @cicada-lang/cicada
```

After installed the program, run `cic` will open our REPL.

You can also run `cic help` to see help messages
for other commands (such as `run` and `watch`).

For example, you can run a Markdown file:

```
cic run ~/xieyuheng/the-little-typer-exercises/src/02.md
```

and you can also run a URL:

```
cic run "https://readonly.link/files/cicada-lang/cicada/-/docs/manual/datatypes/nat.md"
```
