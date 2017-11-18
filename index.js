var unirest = require('unirest');
var prompt = require('prompt');
var inquirer = require('inquirer');
require('dotenv').config();
let end = false;
guessesLeft = 8;
var winArray = [];

function Word(word, definition, partOfSpeech, blankWordArray) {

  this.word = word;
  this.definition = definition;
  this.partOfSpeech = partOfSpeech;
  this.blankWordArray = blankWordArray;
  this.finalWord = [...(word.toUpperCase())];
}

prompt.start();

inquirer.prompt([
  {
    type: "confirm",
    name: "gameStart",
    message: "Welcome to the hangman. Ready to start a new game?"
  }
]).then(function(par) {
  if (par.gameStart) {
    guessesLeft = 8;
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
      let dailyQuote = result.caseless['dict']['x-ratelimit-requests-remaining'];
      console.log("You have " + dailyQuote + " games left for today");
      let currWord = new Word(newWord, newDefinition, newPartSpeech, arr, dailyQuote);
      
      //console.log(result.caseless['dict']['x-ratelimit-requests-remaining']);
      game(currWord);

    }
  });

}

function game(word) {

  let myWord = word;
  let leng = myWord.word.length;
  //console.log(myDailyQuote);
  //console.log(myWord);
  console.log("");
  console.log("Definition: " + myWord.definition);
  console.log("");
  console.log("! Hint: use <space> to guess all the dashes in your guessing word!");

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
          //console.log(myWord.blankWordArray);
          //console.log(myWord.finalWord);

          if (winArray.length === myWord.blankWordArray.length) {

            console.log("###############################################");
            
            console.log("Congratulations!!");
            console.log("You won!!!!!!");
            console.log("");
            //console.log(myDailyQuote + "games left");
            console.log("###############################################");            
            console.log("");

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
                //console.log(myDailyQuote + "games left");
                console.log("###############################################");
                process.exit();
              }
            });
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
        //console.log(myWord.blankWordArray);

        if (guessesLeft === 0) {

          console.log("###############################################");
          console.log("");
          console.log("Game over");
          console.log("");
          console.log("###############################################");
          console.log("");

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
              console.log("");
              console.log("That was fun. Come back soon!");
              console.log("");
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