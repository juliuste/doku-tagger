'use strict'

const ner = require('dbpedia-spotlight')
const queue = require('queue')

ner.configEndpoints({
	"german": {
		host:'model.dbpedia-spotlight.org',
		path:'/de/annotate',
		port:'80',
		confidence:0.5,
		support:0
	}
	// "english": {
	// 	host:'model.dbpedia-spotlight.org',
	// 	path:'/en/annotate',
	// 	port:'80',
	// 	confidence:0.5,
	// 	support:0
	// }
})
ner.fixToEndpoint("german")

const q = queue({autostart: true, concurrency: 32, timeout: 10000})

const annotate = (input) =>
	new Promise((resolve, reject) => {
		q.push((cb) =>
			ner.annotate(input, function(result){
				cb()
				if(result && result.error===0 && result.language==='german' && result.response) resolve(result.response)
				else reject({error: 'invalid result', reqResult: result})
			})
		)
	})


module.exports = annotate
