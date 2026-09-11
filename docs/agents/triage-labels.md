# Triage Labels

The skills speak in terms of five canonical triage roles. This file maps those roles to the label strings this repo uses in its issue tracker.

| Label in mattpocock/skills | Label in this repo | Meaning                                  |
| -------------------------- | ------------------ | ---------------------------------------- |
| `needs-triage`             | `needs-triage`     | Maintainer needs to evaluate this issue  |
| `needs-info`               | `needs-info`       | Waiting on reporter for more information |
| `ready-for-agent`          | `ready-for-agent`  | Fully specified, ready for an AFK agent  |
| `ready-for-human`          | `ready-for-human`  | Requires human implementation            |
| `wontfix`                  | `wontfix`          | Will not be actioned                     |

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from this table.

## Provisioning

All five exist in this repo's tracker: `wontfix` is a GitHub default, and the other four were created for this workflow. `gh label list` shows the current set.

A fresh tracker — a fork, or a re-created repo — needs the four that GitHub does not ship by default, because `/triage` cannot apply a label that does not exist and does not create labels itself (its own words: the mapping "should have been provided to you").

```sh
gh label create needs-triage
gh label create needs-info
gh label create ready-for-agent
gh label create ready-for-human
```
