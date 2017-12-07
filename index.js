const unirest = require('unirest');
const prompt = require('prompt');
const inquirer = require('inquirer');
const CFonts = require('cfonts');
require('dotenv').config();
let end = false;
var guessesLeft = 8;
const readline = require('readline');
var clearScreen;
const Word = require('./word.js');

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
    generate();
  } else {
    console.log("See you next time then. You are probably are not good at this game anyway...");
    process.exit();
  }
});

//API call / generating a new word
function generate() {

  unirest.get("https://wordsapiv1.p.mashape.com/words/?random=true").header("X-Mashape-Key", process.env.MASHAPE_KEY).header("Accept", "application/json").end(function(result) {

    //console.log(result.status, result.headers, result.body)
    if (typeof result.body.results === 'undefined') {
      console.log("Loading...")

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
      let currWord = new Word.Word(newWord, newDefinition, newPartSpeech, arr, dailyQuote);
      game(currWord);

    }
  });
}

// passing the generate word to the game function 
// and displaying blank word so the player can start guessing 
function game(word) {
  let winArray = [];
  let myWord = word;
  let leng = myWord.word.length;
  console.log("");
  console.log("Definition: " + myWord.definition);
  console.log("");
  console.log("Hint: Your word might contain spaces. Use <space button>");

  for (var i = 0; i < leng; i++) {
    myWord.blankWordArray.push("_");
  }

  guessLetter(myWord, leng, winArray);

}

//gueesing the letter
function guessLetter(myWord, leng, winArray) {
  console.log("");
  //console.log(myWord.blankWordArray.join(" "));
  console.log("");
  
  CFonts.say(`${myWord.blankWordArray.join(" ")}`, {
      font: 'chrome',                          //define the font face 
      align: 'left',                           //define text alignment 
      colors: ['magenta', 'white', 'cyan'],    //define all colors 
      background: 'black',                     //define the background color 
      letterSpacing: 0,                        //define letter spacing 
      lineHeight: 1,                           //define the line height 
      space: true,                             //define if the output text should have empty lines on top and on the bottom 
      maxLength: '0'                           //define how many character can be on one line 
  });

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
          //console.log("Great job!");
          
          //if word is guessed - player won 
          if (winArray.length === myWord.blankWordArray.length) {

            end = true;
            console.log("###############################################");
            console.log("");
            console.log("Congratulations!!");
            console.log("It was: " + myWord.word);
            console.log("You won!!!!!!");
            console.log("");
            console.log("###############################################");
            console.log("");

            restartGame();
            return;
          }
        }
      }
      
      // if the guess was incorrect
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
      // clears the terminal for a better view but couple of lines 
      if (guessesLeft) {

        clearScreen = setTimeout(() => {
          readline.cursorTo(process.stdout, 0, 0);
          readline.clearScreenDown(process.stdout);
          console.log("Definition: " + myWord.definition);
          console.log("");
          console.log("You have " + guessesLeft + " attempts left");
          //console.log("Correct word was: " + myWord.word);
          guessLetter(myWord, leng, winArray);
        }, 1000);

      }

    });

  } else {

    return;
  }
}

// if player wants to play again
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
