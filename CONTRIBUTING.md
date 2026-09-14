# Contributing

Help readers find evidence they can inspect and tools that solve a distinct problem.

## What earns a place

A working homepage and a neutral sentence are necessary, but not sufficient. Explain the gap in this list and provide something a reviewer can inspect: source code, a documented method, a public sample report, a usable diagnostic, or an original dataset with provenance.

- Prefer primary research, provider documentation, reproducible tools, and useful public data.
- New commercial tools must add a distinct use case or inspectable evidence beyond the monitoring features already represented here.
- Free tools must identify what is free, whether an account is required, and whether paid APIs or services are needed.
- Open-source claims must match the linked code and license. Do not describe a paid feature as part of the free project.
- Research must state its source, date, sample, method, and material limitations. Separate measured results from hypotheses and causal claims.
- Readiness scores, crawler probes, and sampled AI answers must not be presented as interchangeable measures of visibility.

## Affiliation and promotion

Disclose if you own, work for, contribute to, or are paid by the resource. Self-submission is allowed, but affiliation does not earn a listing. Competitor status is not a reason for rejection either; reader value and evidence decide.

We do not accept paid placements, reciprocal-link arrangements, affiliate links, promotional listicles, guaranteed ranking claims, or services built around undisclosed promotional posting. A new tool with the same generic feature list as existing entries may be declined even if it is legitimate.

Trakkr maintains this repository and is listed first in commercial tools. Its research is labeled as maintainer-published work. The same evidence standards apply to Trakkr resources.

## Adding an entry

1. Add one resource per pull request unless the links are tightly related.
2. Explain the reader problem it solves and which existing entries you compared it with.
3. Link to the original product, source repository, paper abstract, dataset, or documentation. Avoid referral and tracking parameters.
4. Use the resource name as the link text and one short, factual sentence as its description. Omit superlatives and unsupported outcome claims.
5. Use the most specific section and sort alphabetically unless the section states a different order.
6. Regenerate the machine-readable index from the README:

   ```sh
   python3 scripts/export_resources.py
   ```

7. Include both `README.md` and `resources.json` in your change. CI checks that they agree.

The Start here section is an editorial reading path. Suggest changes when they improve that path, rather than adding another product placement.

## Corrections and removals

Flag broken, parked, misleading, abandoned, or out-of-scope resources. Provide the affected URL and evidence for the correction. Temporary timeouts and bot-blocking responses are not proof that a resource is dead.

Do not link private data, leaked documents, or sources that were not intended to be public. Explain a concern without reposting sensitive material.

## Review and maintenance

Submissions are reviewed in batches. Inclusion is editorial, not automatic; a declined submission can be reconsidered when its evidence or usefulness changes.

The weekly link check retries transient failures and maintains one open report. It closes that report after a successful check. Bot-blocking responses such as HTTP 403 or 429 are tolerated by automation and still require human judgment; a green check is not an endorsement or proof of content quality.

Before submitting, run:

```sh
python3 scripts/export_resources.py
node --test scripts/sync-link-issue.test.cjs
git diff --check
```

## License

By contributing, you agree that your contribution is released under the [CC0 1.0 Universal](LICENSE) license.
