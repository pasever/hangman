var unirest = require('unirest');
var prompt = require('prompt');
var inquirer = require('inquirer');
//var keypress = require('keypress');
require('dotenv').config();
//keypress(process.stdin);
//prompt.start();


inquirer.prompt([
  {
    type: "confirm",
    name: "gameStart",
    message: "Welcome to the hagman. Ready to start a new game?"
  }
]).then(function(par) {
  if (par.gameStart) {
    generate(generate);
  } else {
    console.log("See you next time then...");
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
      
      new Game(newWord, newDefinition, newPartSpeech);
      //console.log(result.caseless['dict']['x-ratelimit-requests-remaining']);
      
    }
  });
}


function Game(word, definition, partOfSpeech) {
  
  this.word = word;
  this.definition = definition;
  this.partOfSpeech = partOfSpeech;
  this.blankWordArray = [];
  this.guessesLeft = 8;
  
  console.log(this.word);
  
  // this.synonyms = false;
  let newWordArray = [...this.word];
  console.log("Definition: " + definition);
  //console.log(partOfSpeech);

  for (var i = 0; i < newWordArray.length; i++) {
    this.blankWordArray.push("_");
  }
  
  console.log(this.blankWordArray);
  //console.log(blankWordArray.toString());
  //userGuess(newWordArray);
  
  this.endGame = function() {

    console.log("");
    console.log("");

    if (this.guessesLeft === 0) {

      console.log("###############################################");
      console.log("");
      console.log("Game over. Please play agian");
      console.log("");
      console.log("###############################################");

      process.exit();
      
      
    } else {
      
      this.guessLetter();
      
    }
    //guessLetter(newWordArray);
  }
  
  this.guessLetter = function() {
    
    inquirer.prompt([
      {
        type: "input",
        name: "userGuess",
        message: "Please, guess a letter"
      }
    ]).then(function(guess) {
      //console.log(guess.guessLetter);
      var found = false;
      
      for (var i = 0; i < this.word.length; i++){
        
        
        if ( guess.userGuess.toLowerCase() === this.word[i].toLowerCase() ){
        
          console.log("Great job!");
          found = true;
          // Add to array
          
        }
        
      }
      
      if (!found) {
        this.guessesLeft--;
      }
      
      this.endGame(); //Check if game over
      
    }) 
  }
  
  this.guessLetter();
  
}




