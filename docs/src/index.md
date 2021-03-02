---
title: relative2link
---

# Relative2link

Command-line tool to convert `import` statement using long relative files to
shorter versions using the [link:
protocol][1]
instead.

Note that you need to have your `link:` configured in your package.json for this
to work, it won't create them automatically for you.

This tool is meant to be used when you need to convert a codebase from one style
to the other.

## Example

```javascript
// package.json
"dependencies": {
"@app/utils": "link:./src/utils",
"@app/main": "link:./src/electron/main",
"@app/renderer": "link:./src/electron/renderer",
"@app/components": "link:./src/electron/renderer/components",
}

// This code in src/electron/renderer/index.ts
import version from '../../utils/version';
import Button from './components/Button'
import events from '../main/events'

// Will be converted to
import version from '@app/utils/version';
import Button from '@app/components/Button'
import events from '@app/main/events'
```

## Usage

Install `relative2link` locally or globally, then run `relative2link
./path/to/files.js`. Make sure you backup your files before running it, just in
case.

[1]: https://yarnpkg.com/features/protocols#why-is-the-link-protocol-recommended-over-aliases-for-path-mapping
