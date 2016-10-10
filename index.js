'use strict'

const arte = require('./arte')
const swr = require('./swr')
const dw = require('./dw')

const concatLists = (list) => {
	let result = []
	for(let sublist of list){
		result = result.concat(sublist)
	}
	return result
}

const all = () => Promise.all([arte(), swr(), dw()]).then((data) => concatLists(data), (err) => {throw new Error(err)})

module.exports = {all, arte, swr, dw}