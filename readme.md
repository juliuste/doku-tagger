# doku-tagger

Try to match meta data from documentaries fetched using the [dokus](https://github.com/juliuste/dokus/) module with country data.

[![npm version](https://img.shields.io/npm/v/doku-tagger.svg)](https://www.npmjs.com/package/doku-tagger)
[![Build Status](https://travis-ci.org/juliuste/doku-tagger.svg?branch=master)](https://travis-ci.org/juliuste/doku-tagger)
[![dependency status](https://img.shields.io/david/juliuste/doku-tagger.svg)](https://david-dm.org/juliuste/doku-tagger)
[![dev dependency status](https://img.shields.io/david/dev/juliuste/doku-tagger.svg)](https://david-dm.org/juliuste/doku-tagger#info=devDependencies)
[![license](https://img.shields.io/github/license/juliuste/doku-tagger.svg?style=flat)](LICENSE)
[![chat on gitter](https://badges.gitter.im/juliuste.svg)](https://gitter.im/juliuste)

## Usage

The module has a method `all` and a method for each media library supported by the [dokus](https://github.com/juliuste/dokus/) module like `arte`, `mdr`, etc… Each method returns a `Promise` which resolves in a list of objects representing single documentaries:

```javascript
const dokus = require('doku-tagger')

dokus.all().then(…)
```
will resolve in a list of objects which look like this:
```javascript
{
	title: '…',
	description: '…',
	tags: […],
	countries: [ 'eg' ], // list tagged countries (never empty)
	link: '…', // media library url
	image: '…', // thumbnail
	network: 'arte'
}
```

## Similar Projects
- [dokus](https://github.com/juliuste/dokus/) - Fetch documentary meta data from multiple german media libraries.
- [doku-karte](https://github.com/juliuste/doku-karte/) - "German documentaries sorted by country and displayed on a map."
- [match-country-german](https://github.com/juliuste/match-country-german/) - "Try to match given german country name with its ISO code."

## Contributing

If you found a bug, want to propose a feature or feel the urge to complain about your life, feel free to visit [the issues page](https://github.com/juliuste/doku-tagger/issues).
