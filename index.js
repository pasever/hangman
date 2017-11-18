var unirest = require('unirest');
var prompt = require('prompt');
var inquirer = require('inquirer');
//var keypress = require('keypress');
require('dotenv').config();
let end = false;
guessesLeft = 8;

function Word(word, definition, partOfSpeech, blankWordArray) {
  this.word = word;
  this.definition = definition;
  this.partOfSpeech = partOfSpeech;
  this.blankWordArray = blankWordArray;
  this.finalWord = [...word];
}

// function Letter(guess) {
//   this.guess = guess;
//   this.guessesLeft = guessesLeft;
// }

prompt.start();

inquirer.prompt([
  {
    type: "confirm",
    name: "gameStart",
    message: "Welcome to the hangman. Ready to start a new game?"
  }
]).then(function(par) {
  if (par.gameStart) {
    generate();
  } else {
    console.log("See you next time then. You are probably are not good at this game anyway...");
    process.exit();
  }
});

function generate() {

  unirest.get("https://wordsapiv1.p.mashape.com/words/?random=true").header("X-Mashape-Key", process.env.MASHAPE_KEY).header("Accept", "application/json").end(function(result) {

    //console.log(result.status, result.headers, result.body)
    if (typeof result.body.results === 'undefined') {

      generate();

    } else {

      let newDefinition = result.body.results[0].definition;
      let newPartSpeech = result.body.results[0].partOfSpeech;
      let newWord = result.body.word;
      let arr = [];
      let currWord = new Word(newWord, newDefinition, newPartSpeech, arr);
      //console.log(result.caseless['dict']['x-ratelimit-requests-remaining']);
      game(currWord);

    }
  });

}

function game(word) {

  let myWord = word;
  let leng = myWord.word.length;
  console.log(myWord);
  console.log("Definition: " + myWord.definition);
  
  for (var i = 0; i < leng; i++) {
    myWord.blankWordArray.push("*");
  }
  guessLetter(myWord, leng);

}

function guessLetter(myWord, leng) {
  console.log(myWord.blankWordArray.join(" "));

  if (!end) {
    inquirer.prompt([
      {
        type: "input",
        name: "userGuess",
        message: "Please, guess a letter"
      }
    ]).then(function(guess) {
      var found = false;
      for (var i = 0; i < leng; i++) {
        if (guess.userGuess.toUpperCase() === myWord.finalWord[i].toUpperCase()) {
          found = true;
          myWord.blankWordArray[i] = guess.userGuess.toUpperCase();
          console.log("Great job!");
          console.log(myWord.blankWordArray);

        }
      }
      if (!found) {
        console.log("Please try again!");
        guessesLeft--;
        console.log("You have " + guessesLeft + " left");
        console.log(myWord.blankWordArray);
        
        if (guessesLeft === 0) {

          console.log("###############################################");
          console.log("");
          console.log("Game over");
          console.log("");
          console.log("###############################################");
          
          inquirer.prompt([
            {
              type: "confirm",
              name: "gameStart",
              message: "Do you want to start another game?"
            }
          ]).then(function(par) {
            if (par.gameStart) {
              generate();
            } else {
              console.log("That was fun. Come back soon!");
              process.exit();
            }
          });
          return;
        }
        
      }
      guessLetter(myWord, leng);
    });

  } else {

    return;
  }
}