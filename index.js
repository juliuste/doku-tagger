'use strict'

const parser = require('feedparser')
const request = require('request')
const intersection = require('array-intersection')

const country = require('./country')

const feed = 'http://www.arte.tv/papi/tvguide-flow/feeds/videos/de.xml?type=ARTE_PLUS_SEVEN&player=true'

const list = []

const push = (array, item) => {
	if(item) array.push(item)
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

const parseKeywords = (keywords) => {
	const countries = []
	if(keywords && keywords['#']){
		for(let tag of keywords['#'].split(',')){
			push(countries, country(tag))
		}
	}
	return countries
}

const isDocumentary = (item) => {
	return intersection(['Dokumentarfilm', 'Dokumentation', 'Dokumentationsreihe'], item.categories).length > 0
}

const req = request(feed)
const rss = new parser()

req.on('error', function(error){throw new Error(error)})
req.on('response', function(res){
	if(res.statusCode!=200) throw new Error
	else res.pipe(rss)
})

rss.on('error', function(error){throw new Error(error)})
rss.on('readable', function(){
	let item
	while(item = rss.read()){
		if(isDocumentary(item)) push(list, parseItem(item))
	}
})
rss.on('end', function(){
	process.stdout.write(JSON.stringify(list))
})