# GitHub Actions Scripts

Helper scripts for CI/CD workflows.

## Calendar Change Detection

These scripts detect changes to the xHain calendar by checking the CalDAV CTag (Collection Tag). The CTag changes whenever any event is added, modified, or deleted, allowing efficient change detection without fetching all events.

### fetch-calendar-ctag.sh

Fetches the current CTag from the CalDAV server.

```bash
# Usage
.github/scripts/fetch-calendar-ctag.sh [output-file]

# Example
.github/scripts/fetch-calendar-ctag.sh new.ctag
# → CTag: http://sabre.io/ns/sync/2530
```

**Arguments:**

- `output-file` (optional): Where to write the CTag. Defaults to `new.ctag`

**Behavior:**

- Makes a PROPFIND request to the public calendar endpoint
- Extracts the CTag value from the XML response
- Falls back to a timestamp-based CTag if the request fails

### compare-ctag.sh

Compares old and new CTag files to determine if a rebuild is needed.

```bash
# Usage
.github/scripts/compare-ctag.sh [old-file] [new-file] [force]

# Example
export GITHUB_OUTPUT=/dev/stdout  # For local testing
.github/scripts/compare-ctag.sh old.ctag new.ctag false
# → changed=true or changed=false
```

**Arguments:**

- `old-file` (optional): Previous CTag file. Defaults to `old.ctag`
- `new-file` (optional): New CTag file. Defaults to `new.ctag`
- `force` (optional): Set to `true` to force a rebuild. Defaults to `false`

**Output:**

- Writes `changed=true` or `changed=false` to `$GITHUB_OUTPUT`
