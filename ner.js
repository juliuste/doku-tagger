'use strict'

const ner = require('dbpedia-spotlight')

const annotate = (input) => {
	return new Promise((resolve, reject) => {
		ner.annotate(input, function(result){
			if(result && result.error===0 && result.language==='german' && result.response) resolve(result.response)
			else reject({error: 'invalid result', reqResult: result})
		})
	})
}

module.exports = annotate