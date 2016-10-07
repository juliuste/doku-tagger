'use strict'

const countries = require('./countries.json')
const slug = require('slug')
const levenshtein = require('fast-levenshtein').get

const equals = (one, two) => {
	return levenshtein(slug(one, ''), slug(two, '')) <= 1
}

const search = (name) => {
	for(let country in countries){
		if(equals(country, name)) return countries[country].toLowerCase()
	}
	return null
}


module.exports = search