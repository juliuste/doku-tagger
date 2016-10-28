'use strict'

const dokus = require('dokus')
const country = require('match-country-german')

const push = (array, item) => {if(item) array.push(item)}

const parseTags = (item) => {
	if(item.tags){
		const countries = []
		for(let tag of item.tags){
			push(countries, country(tag.trim()))
		}
		if(countries) item.countries = countries
	}
	return item
}

const byTag= (list) => {
	const resList = list.map(parseTags)
	return resList.filter((el) => (el.countries && el.countries.length))
}

// i'm sorry for what's below this line... it was an accident :D
const all = () => dokus.all().then(byTag, (err) => {throw new Error(err)})
const arte = () => dokus.arte().then(byTag, (err) => {throw new Error(err)})
const dw = () => dokus.dw().then(byTag, (err) => {throw new Error(err)})
const mdr = () => dokus.mdr().then(byTag, (err) => {throw new Error(err)})
const swr = () => dokus.swr().then(byTag, (err) => {throw new Error(err)})

module.exports = {all, arte, mdr, swr, dw}