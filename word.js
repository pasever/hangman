function Word(word, definition, partOfSpeech, blankWordArray) {
  this.word = word;
  this.definition = definition;
  this.partOfSpeech = partOfSpeech;
  this.blankWordArray = blankWordArray;
  this.finalWord = [...(word.toUpperCase())];
}

exports.Word = Word;