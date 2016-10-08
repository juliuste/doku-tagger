'use strict'

const got = require('got')
const country = require('match-country-german')

const baseURL = 'http://www.dw.com'
const listURL = 'http://www.dw.com/de/media-center/alle-inhalte/s-100814?filter=&programs=293837&sort=date&results=1000'

const err = (error) => {throw new Error(error)}
const push = (array, item) => {if(item) array.push(item)}

const parseKeywords = (keywords) => {
	const countries = []
	for(let tag of keywords){
		push(countries, country(tag))
	}
	return countries
}

const removeEmpty = (list) => {
	const newList = []
	for(let el of list){
		if(el) newList.push(el)
	}
	return newList
}

const parseListHTML = (res) => {
	let html = res.body.replace(/\s/g, "")
	const re = /divclass="newssearchreshov"><ahref="([^"]+)"/g
	let match = re.exec(html)
	const links = []
	while (match != null) {
		links.push(match[1])
		match = re.exec(html)
	}
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
	re = /<meta property="og:title" content="([^"]+) | Alle Inhalte | DW.COM"/g
	match = re.exec(html)
	const title = []
	while (match != null) {
		title.push(match[1])
		match = re.exec(html)
	}
	title[0] = title[0].replace(" | Alle Inhalte | DW.COM |", "")

	// Description
	re = /<meta name="description" content="([^"]+)"/g
	match = re.exec(html)
	const description = []
	while (match != null) {
		description.push(match[1])
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