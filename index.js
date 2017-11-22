var unirest = require('unirest');
var prompt = require('prompt');
var inquirer = require('inquirer');
require('dotenv').config();
let end = false;
var guessesLeft = 8;
var winArray = [];
const readline = require('readline');
var clearScreen;

//the word constructor
function Word(word, definition, partOfSpeech, blankWordArray) {
  this.word = word;
  this.definition = definition;
  this.partOfSpeech = partOfSpeech;
  this.blankWordArray = blankWordArray;
  this.finalWord = [...(word.toUpperCase())];
}

prompt.start();

//starting the game
inquirer.prompt([
  {
    type: "confirm",
    name: "gameStart",
    message: "Welcome to hangman. Ready to start a new game?"
  }
]).then(function(par) {
  if (par.gameStart) {
    winArray = [];
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
      guessesLeft = 8;
      end = false;
      let dailyQuote = result.caseless['dict']['x-ratelimit-requests-remaining'];
      console.log("");
      console.log("You have " + dailyQuote + " games left for today");
      let currWord = new Word(newWord, newDefinition, newPartSpeech, arr, dailyQuote);
      game(currWord);

    }
  });

}

function game(word) {

  let myWord = word;
  let leng = myWord.word.length;
  console.log("");
  console.log("Definition: " + myWord.definition);
  console.log("");
  console.log("Hint: You word might contain spaces. Use <space button>");

  for (var i = 0; i < leng; i++) {
    myWord.blankWordArray.push("*");
  }

  guessLetter(myWord, leng);

}

function guessLetter(myWord, leng) {
  console.log("");
  console.log(myWord.blankWordArray.join(" "));
  console.log("");

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
          winArray.push(guess.userGuess.toUpperCase());
          console.log("");
          console.log("Great job!");
          // letterFound = guess.userGuess.toUpperCase()
          if (winArray.length === myWord.blankWordArray.length) {

            end = true;
            console.log("###############################################");
            console.log("");
            console.log("Congratulations!!");
            console.log("You won!!!!!!");
            console.log("");
            console.log("###############################################");
            console.log("");

            restartGame();
            return;
          }
        }
      }
      if (!found) {

        console.log("");
        console.log("Please try again!");
        guessesLeft--;
        console.log("");
        console.log("You have " + guessesLeft + " attempts left");
        console.log("");

        if (guessesLeft === 0) {

          end = true;
          console.log("###############################################");
          console.log("");
          console.log("Game over");
          console.log("");
          console.log("Correct word was: " + myWord.word);
          console.log("");
          console.log("###############################################");
          console.log("");

          restartGame();
          return;
        }
      }

      if (guessesLeft) {

        clearScreen = setTimeout(() => {
          readline.cursorTo(process.stdout, 0, 0);
          readline.clearScreenDown(process.stdout);
          console.log("Definition: " + myWord.definition);
          console.log("");
          console.log("You have " + guessesLeft + " attempts left");
          console.log("Correct word was: " + myWord.word);
          guessLetter(myWord, leng);
        }, 1000);

      }

    });

  } else {

    return;
  }
}

function restartGame() {

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
      console.log("###############################################");
      console.log("");
      console.log("That was fun. Come back soon!");
      console.log("");
      console.log("###############################################");
      process.exit();
    }
  });
}
// after its closed
// if(found) {
// console.log("Good guess")}
//
// if(wordGuessed) {
// whatever it takes to restart a game or offer restart
// }
//
// if(wordGuessed) {
//  callInquirer()
//  put code for propting user to start another game inside this if after loop is over
//  It will run if wordGuessed is true
//  SEt wordGuessed to TRUE in the loop
// }