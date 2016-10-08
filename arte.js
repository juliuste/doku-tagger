'use strict'

const intersection = require('array-intersection')
const rss = require('simple-rss')
const country = require('match-country-german')

const feedURL = 'http://www.arte.tv/papi/tvguide-flow/feeds/videos/de.xml?type=ARTE_PLUS_SEVEN&player=true'

const err = (error) => {throw new Error(error)}
const push = (array, item) => {if(item) array.push(item)}
const isDocumentary = (item) => (intersection(['Dokumentarfilm', 'Dokumentation', 'Dokumentationsreihe'], item.categories).length > 0)

const parseKeywords = (keywords) => {
	const countries = []
	if(keywords && keywords['#']){
		for(let tag of keywords['#'].split(',')){
			push(countries, country(tag))
		}
	}
	return countries
}

const parseItem = (item) => {
	const countries = parseKeywords(item['media:keywords'])
	if(countries.length>0){
		return {
			title: item.title,
			description: item.description,
			date: item.date,
			link: item.link,
			image: item.image.url,
			countries: countries,
			network: 'arte'
		}
	}
	return null
}

const parseItems = (items) => {
	const result = []
	for(let item of items){
		if(isDocumentary(item)) push(result, parseItem(item))
	}
	return result
}

const main = () => rss(feedURL).then(parseItems, err)

module.exports = main