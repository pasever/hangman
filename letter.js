function Letter(guess) {
  this.guess = guess;
  this.guessesLeft = guessesLeft;
}

function letterGuessed() {

  for (let j = 0; j < allLetters.lenght; j++) {

    if (guess.userGuess.toUpperCase() === allLetters[j].toUpperCase()) {
      console.log("This letter has been guessed");
    } else {
      return;
    }
  }
}