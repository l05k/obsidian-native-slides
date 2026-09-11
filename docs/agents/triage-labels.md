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

## Provision the labels before first use

As of this change only `wontfix` exists in the tracker — it is a GitHub default. `needs-triage`, `needs-info`, `ready-for-agent` and `ready-for-human` do not, and `/triage` cannot apply a label that does not exist, so they are created before the first triage run:

```sh
gh label list          # check which of the five already exist
gh label create needs-triage
gh label create needs-info
gh label create ready-for-agent
gh label create ready-for-human
```

`/triage` says the mapping "should have been provided to you" and does not create labels itself, so provisioning is a one-off maintainer step rather than part of a triage run.
