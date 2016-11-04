'use strict'

const dokus = require('dokus')
const country = require('match-country-german')
const ner = require('./ner')

//const err = (error) => {throw new Error(error)}
const err = console.error
const push = (array, item) => {if(item) array.push(item)}
const removeDuplicates = (list) => Array.from(new Set(list))

const addCountries = (item) => (tags) => {
	if(item && tags && tags.length) item.countries = removeDuplicates(tags.concat(item.countries || []))
	return item
}
const tagsToCountries = (tags) => {
	if(tags && tags.length){
		let countries = []
		for(let tag of tags){
			push(countries, country(tag.trim()))
		}
		if(countries.length) return removeDuplicates(countries)
	}
	return null
}
const nerToTags = (ner) => {
	const res = []
	if(ner&&ner.Resources){
		for(let e of ner.Resources){
			if(e['@URI'] && e['@types'] && e['@types'].split(',').indexOf('DBpedia:Country')>=0)
				res.push(e['@URI'].split('/').pop().split('_').join(' '))
		}
	}
	return res
}

const parseByKeywords = (item) => {
	if(item.tags){
		return addCountries(item)(tagsToCountries(item.tags))
	}
	return item
}
const byKeywords = (list) => {
	const resList = list.map(parseByKeywords)
	return resList.filter((el) => (el.countries && el.countries.length))
}

const parseByDescription = (item) => {
	if(item.description){
		return ner(item.description)
		.then(nerToTags, (err) => Promise.resolve(null))
		.then(tagsToCountries, err)
		.then(addCountries(item), err)
	}
	return item
}
const byDescription = (list) => {
	const resList = Promise.all(list.map(parseByDescription))
	return resList.then((list) => list.filter((el) => (el && el.countries && el.countries.length)), err)
}

const main = (list) => {
	list = byKeywords(list)
	return byDescription(list)
}

// i'm sorry for what's below this line... it was an accident :D
const all = () => dokus.all().then(main, (err) => {throw new Error(err)})
const arte = () => dokus.arte().then(main, (err) => {throw new Error(err)})
const dw = () => dokus.dw().then(main, (err) => {throw new Error(err)})
const mdr = () => dokus.mdr().then(main, (err) => {throw new Error(err)})
const swr = () => dokus.swr().then(main, (err) => {throw new Error(err)})

module.exports = {all, arte, mdr, swr, dw}