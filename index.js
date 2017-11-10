var unirest = require('unirest');
require('dotenv').config();
var blankWordArray = [];

function generate(callback) {

  unirest.get("https://wordsapiv1.p.mashape.com/words/?random=true")
  .header("X-Mashape-Key", process.env.MASHAPE_KEY)
  .header("Accept", "application/json")
  .end(function(result) {

    //console.log(result.status, result.headers, result.body)
    if (typeof result.body.results === 'undefined') {

      callback(generate);
      //generate();

    } else {

      let newDefinition = result.body.results[0].definition;
      let newPartSpeech = result.body.results[0].partOfSpeech;
      let newWord = result.body.word;
      //let newWordArray = [...newWord];
      newWord = new Random(newWord, newDefinition, newPartSpeech);
      //console.log(result.caseless.dict);
    }
  });
}

generate(generate);

function Random(word, definition, partOfSpeech) {
  this.word = word;
  this.definition = definition;
  this.partOfSpeech = partOfSpeech;
  // this.length = length;
  // this.synonyms = false;
  console.log(word);
  console.log(definition);
  console.log(partOfSpeech);
}

//console.log(newWord);
// for (var i = 0; i < newWordArray.length; i++){
//   blankWordArray.push("_");
// }