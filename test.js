'use strict'

const t = require('./index.js')
const assert = require('assert')

const err = (error) => {console.error(error); throw new Error(error)}

const h = (network) => (items) => {
	if(items.length>0)
		for(let item of items){
			assert(item.countries.length>0, network)
		}
}

t.arte().then(h('arte')).catch(err)
