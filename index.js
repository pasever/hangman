var unirest = require('unirest');
var prompt = require('prompt');
var inquirer = require('inquirer');
var keypress = require('keypress');
require('dotenv').config();
keypress(process.stdin);
prompt.start();
var blankWordArray = [];
var guessesLeft = 8;

inquirer.prompt([
  {
    type: "confirm",
    name: "gameStart",
    message: "Welcome to the hagman. Ready to start a new game?"
  }
]).then(function(par) {
  if (par.gameStart) {
    generate(generate);
    console.log(par.gameStart);
  } else {
    process.exit();
  }

});

function generate(callback) {

  unirest.get("https://wordsapiv1.p.mashape.com/words/?random=true").header("X-Mashape-Key", process.env.MASHAPE_KEY).header("Accept", "application/json").end(function(result) {

    //console.log(result.status, result.headers, result.body)
    if (typeof result.body.results === 'undefined') {

      callback(generate);

    } else {

      let newDefinition = result.body.results[0].definition;
      let newPartSpeech = result.body.results[0].partOfSpeech;
      let newWord = result.body.word;
      //let newWordArray = [...newWord];
      newWord = new Random(newWord, newDefinition, newPartSpeech);
      console.log(result.caseless['dict']['x-ratelimit-requests-remaining']);
      
    }
  });
}

function Random(word, definition, partOfSpeech) {
  this.word = word;
  this.definition = definition;
  this.partOfSpeech = partOfSpeech;
  this.blankWordArray = blankWordArray;
  // this.synonyms = false;
  console.log(word);
  let newWordArray = [...word];
  console.log(definition);
  console.log(partOfSpeech);

  for (var i = 0; i < newWordArray.length; i++) {
    blankWordArray.push("_");
  }
  console.log(blankWordArray);
  console.log(blankWordArray.toString());
  userGuess(newWordArray);
}

function Letter(guess) {
  this.guess = guess;
  this.guessesLeft = guessesLeft;
}

function userGuess(a) {
  process.stdin.on('keypress', function(ch, key) {
    console.log('got "keypress"', key);
    // if (key && key.ctrl && key.name == 'c') {
    //   //process.stdin.pause();
    //   console.log(key);
    // }
  });
  for (var i = 0; i < a.length; i++) {
  
    console.log(a);
  }

}

function endGame() {

  console.log("");
  console.log("");

  if (guessesLeft === 0) {

    console.log("###############################################");
    console.log("");
    console.log("Game over. Please try agian");
    console.log("");
    console.log("###############################################");

    process.exit();
  }

}
