# Notes

## Approach

The interpreter lives in `dsl/` and has no React in it. The page calls one
function, `run(text)`, which goes through four steps:

1. **Parse** the text as JSON (`parse.ts`)
2. **Validate** the shape of the query (`validate.ts`)
3. **Find the security** in the data (`repository.ts`)
4. **Evaluate** the expression (`evaluate.ts`)

`run` returns either `{ ok: true, value }` or `{ ok: false, kind, message }`,
so the page doesn't need a try/catch. It just shows the value or the error.

Each kind of failure has its own error type, so the user can tell what went wrong:

| Problem | Kind |
| --- | --- |
| Malformed JSON | `parse` |
| Valid JSON, wrong shape | `validation` |
| Unknown security or attribute | `lookup` |
| Division by zero | `evaluation` |

Operators are defined in one place (`operators.ts`), so adding a new one is a
single line. The validator and the evaluator both read from the same list.

## Decisions

**I implemented all four operators.** The README says to pick one, but the
examples use `*`, `/` and `-`, and they need to give the right answers. Once
the operators were in a single map, adding `+` was one more line, so it felt
odd to leave it out.

**Checking the shape and checking the data are separate steps.** The validator
only cares that an argument is a number, a string or another expression. It
doesn't know whether `sales` actually exists. That gets checked when the
expression is evaluated. Keeping them apart means "your query is the wrong
shape" and "that attribute doesn't exist" show up as different errors, which
is what the README asks for.

**Division by zero is an error.** JavaScript just returns `Infinity`, which
isn't a useful answer to show someone. I gave it its own error kind
(`evaluation`) because the query is valid and the data exists. There just
isn't an answer.

**All the data access goes through a repository.** It's the only place that
knows about the JSON files, and it handles the `security_id` vs `securityId`
mismatch. It also means the evaluator tests can use small fake data sets, and
swapping the files for an API or a database would only touch that one file.

**The operators live in a `Map` rather than a plain object.** With a plain
object, something like `"fn": "toString"` would find a built-in function and
get through the check.

## What I didn't get to

- **Page tests.** There's an end-to-end test for the default multiplication
  example, but not for the other buttons yet. I'd add the rest with an
  `it.each` over the example buttons: division, nested, the three error cases,
  and checking that the result clears when you edit the query.
- **Direct tests for the repository.** It's covered through the evaluator and
  `run` tests, but I'd add a match and a miss for each lookup.
- **Unknown fields in a query are ignored at the moment.** I'd probably reject
  them, so a typo like `"bb"` fails loudly instead of being silently skipped.
- **With more data,** I'd move the query to the server so the data doesn't ship
  to the browser, and index the lookups instead of searching through arrays.

## Things I noticed in the starter project

- `facts.json` uses `security_id` / `attribute_id`, but the `Fact` model uses
  `securityId` / `attributeId`. I map between them in the repository.
- The skipped page test called `fail()`, which current versions of Jest don't
  define. I replaced it with real assertions.
- The font `<link>` in `layout.tsx` wasn't inside a `<head>`, and Next.js
  warns about that. I wrapped it.
- `globals.css` defines `--color-dark-background-1`, but nothing uses it, and
  the background variable isn't set in light mode. I removed the unused one.
