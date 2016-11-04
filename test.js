'use strict'

const t = require('./index.js')
const assert = require('assert')

const h = (network) => (items) => {
	assert(items.length>0, network)
	for(let item of items){
		assert(item.countries.length>0, network)
	}
}

t.arte().then(h('arte'), console.error)
t.swr().then(h('swr'), console.error)
t.mdr().then(h('mdr'), console.error)
t.dw().then(h('dw'), console.error)