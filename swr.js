'use strict'

const got = require('got')
const country = require('match-country-german')
const he = require('he')

const baseURL = 'http://swrmediathek.de/'
const listURL = 'http://swrmediathek.de/content/doku.htm'

const err = (error) => {throw new Error(error)}
const push = (array, item) => {if(item) array.push(item)}

const removeDuplicates = (list) => Array.from(new Set(list))

const removeEmpty = (list) => {
	const newList = []
	for(let el of list){
		if(el) newList.push(el)
	}
	return newList
}

const parseKeywords = (keywords) => {
	const countries = []
	for(let tag of keywords){
		push(countries, country(tag.trim()))
	}
	return countries
}


const parseListHTML = (res) => {
	let html = res.body.replace(/\s/g, "")
	const re = /player.htm\?show=([^"]+)"/g
	let match = re.exec(html)
	let links = []
	while (match != null) {
		links.push('player.htm?show='+match[1])
		match = re.exec(html)
	}
	links = removeDuplicates(links)
	return links
}

const parseItemHTML = (res) => {
	let html = res.body

	// Tags
	let re = /<meta name="keywords" content="([^"]+)"/g
	let match = re.exec(html)
	const tags = []
	while (match != null) {
		tags.push(match[1])
		match = re.exec(html)
	}
	let countries = []
	if(tags.length) countries = parseKeywords(tags[0].split(','))

	// Title
	re = /<meta property="og:title" content="([^"]+)"/g
	match = re.exec(html)
	const title = []
	while (match != null) {
		title.push(match[1])
		match = re.exec(html)
	}

	// Description
	re = /<meta name="description" content="([^"]+)"/g
	match = re.exec(html)
	const description = []
	while (match != null) {
		description.push(he.decode(match[1]))
		match = re.exec(html)
	}

	// Image
	re = /<meta property="og:image" content="([^"]+)"/g
	match = re.exec(html)
	const image = []
	while (match != null) {
		image.push(match[1])
		match = re.exec(html)
	}

	return (countries.length) ? {link: res.requestUrl, countries: countries, title: title[0], description: description[0], image: image[0], network: 'dw'} : null
}

const getURLs = () => got(listURL).then(parseListHTML, err)
const getTags = (url) => got(baseURL+url).then(parseItemHTML, err)

const main = () => getURLs().then((links) => Promise.all(links.map(getTags)).then((tags) => removeEmpty(tags), err), err)

module.exports = main