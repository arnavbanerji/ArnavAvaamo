const https = require('https');
const fs = require('fs');
var mapOfWords = {};


	fs.readFile('./norvig.txt', function(err, data) {
		if(err) {
			response.writeHead(404);
            respone.write('File not found!');
		}
		else {
			let multiLineArray = data.toString().split("\n");
			console.log('Processing.....');
			for(i in multiLineArray) {
				let lineArray = multiLineArray[i].toString().match(/\b([A-Za-z]+)\b/g);
				for(j in lineArray) {
					let lowercaseWord = lineArray[j].toLowerCase();
					if(mapOfWords.hasOwnProperty(lowercaseWord)) {
						let currentCount = mapOfWords[lowercaseWord];
						mapOfWords[lowercaseWord] = currentCount+1;
					} else {
						mapOfWords[lowercaseWord] = 1;
					}
				}
			}

			let wordsSorted = Object.keys(mapOfWords).sort(function(a,b) {
				return mapOfWords[b]-mapOfWords[a];
			});
			
			let topTenWordsSorted = wordsSorted.slice(0,10);
			
			let outputWordsList = {};
			
			for(let i=0 ; i<topTenWordsSorted.length ; i++) {
				let subList = {};
				subList.Word = topTenWordsSorted[i];
				let output = {};
				output.count = mapOfWords[topTenWordsSorted[i]];
				subList.output = output;
				outputWordsList[i+1] = subList;

				https.get(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=dict.1.1.20170610T055246Z.0f11bdc42e7b693a.eefbde961e10106a4efa7d852287caa49ecc68cf&lang=en-en&text=${topTenWordsSorted[i].toString()}`, (res) => {
				let body = ''
				res.on('data', (d) => {
					body+=d;

				}).on('error', (e) => {
					console.error(e);
				}).on('end', function () {
					let jsonBody = JSON.parse(body);
					//console.log(`jsonBody is ${JSON.stringify(jsonBody)}`);
					//console.log(`jsonBody of def[0] is ${JSON.stringify(jsonBody.def[0])}`);
					// for(ary in jsonBody.def[0]['tr']) {
						// console.log(`ary is ${JSON.stringify(ary)}`);
						// if(ary.hasOwnProperty('syn')) {
							// outputWordsList.jsonKey.output.synonym = ary.syn;
							// console.log(`synonym and pos of ${topTenWordsSorted[i]} is: ${JSON.stringify(ary.syn)}`);
						// }
					// }
					//console.log(`word "${topTenWordsSorted[i]}" in JSON format: ${body}`);

				});
				
				});
				
			}
				console.log(`outputWordsList:: ${JSON.stringify(outputWordsList)}`);
				console.log('\n');
		}

	});

