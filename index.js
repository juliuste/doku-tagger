'use strict'

const arte = require('./arte')
const dw = require('./dw')

const concatLists = (list) => {
	let result = []
	for(let sublist of list){
		result = result.concat(sublist)
	}
	return result
}

const all = () => Promise.all([arte(), dw()]).then((data) => concatLists(data), (err) => {throw new Error(err)})

module.exports = {all, arte, dw}