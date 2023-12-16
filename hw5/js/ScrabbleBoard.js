/*
Author: Jeffrey Chan
Email: jeffrey_chan2@student.uml.edu
Created: 12/10/2023
File Description: javascript file for ScrabbleBoard class
*/
import { SCRABBLE_TILE_MAP } from './constants.js';

export default class ScrabbleBoard {
  size = 15;
  score = 0;
  boardArray = new Array(this.size).fill(' ');
  isOccupiedArray = new Array(this.size).fill(false);
  possiblePlacement = new Array(2).fill(null);
  boardMultiplierArray = ['1', '1', '2w', '1', '1', '1', '2l', '1', '2l', '1', '1', '1', '2w', '1', '1'];
  tileHolder = undefined;
  wordDict = {};
  constructor() {
    // generate the board slots html
    const boardOverlayWrapper = $('#scrabble-board-overlay-wrapper');
    for (let i = 0; i < 15; i++) {
      const newSlot = document.createElement('span');
      newSlot.classList.add('board-slot');
      newSlot.setAttribute('index', i);
      boardOverlayWrapper.append(newSlot);
    }
    // save a reference to the ScrabbleBoard object
    const self = this;

    // save the dictionary to the scrabble board
    // Do an ajax request for the dictionary file.
    $.ajax({
      url: '../assets/dictionary.txt',
      success: function (result) {
        // Get an array of all the words.
        let words = result.split('\n');

        // all words in the dictionary to the dict for fast lookup
        for (var i = 0; i < words.length; ++i) {
          self.wordDict[words[i].toUpperCase()] = true;
        }
      }
    });

    // Make the board slots droppable.
    $('.board-slot').droppable({
      // This function determines whether the slot gets highlighted as an acceptable dropping zone
      // when a tile is being dragged.
      accept: function (draggable) {
        const slotIndex = $(this).attr('index');
        // if the slot is taken by another element, return false
        if (self.isOccupiedArray[slotIndex]) {
          return false;
        } else {
          return true;
        }
      },
      activeClass: 'dragHighlight',
      hoverClass: 'hoverHighlight',
      drop: function (event, ui) {
        const slotIndex = $(this).attr('index');
        const letter = ui.draggable.attr('letter');
        const previousIndex = ui.draggable.attr('index');

        // if block was already placed onto the board
        if (previousIndex) {
          self.clearIndex(previousIndex);
        }
        // update new board slot with letter, and occupancy, and index on the user-tile
        self.boardArray[slotIndex] = letter;
        self.getWord();
        self.isOccupiedArray[slotIndex] = true;
        ui.draggable.attr('index', slotIndex);

        // update the change to the Tile Holder
        self.tileHolder.removeTiles([letter]);

        // Make the dropped tile snap to the board image.
        $(ui.draggable).css('top', '');
        $(ui.draggable).css('left', '');
        $(this).empty();
        $(this).append(ui.draggable);

        // update the word validation, word, and score?
        self.isWordValid();
        self.updateWordHtml();
        self.updateScoreHtml();

        // update the possible placement of the tiles
        self.updatePossiblePlacement();
      }
    });
  }
  getBoardTileByIndex(index) {
    return this.boardArray[index];
  }
  setBoardTileByIndex(index, tile) {
    this.boardArray[index] = tile;
    return true;
  }
  printBoard() {
    console.log(this.boardArray);
  }
  clearIndex(index) {
    this.boardArray[index] = ' ';
    this.isOccupiedArray[index] = false;
  }
  clearBoard() {
    // reset board array and occupied array
    this.boardArray = Array(this.size).fill(' ');
    this.isOccupiedArray = new Array(this.size).fill(false);
    // clear html in the board slots
    $('.board-slot').empty();
    $('#current-word').html(`Word: `);
  }
  getWord() {
    // get the word from the board array
    let word = this.boardArray.join('').trim();
    console.log(this.boardArray);
    console.log(word);
    return word;
  }
  updatePossiblePlacement() {
    // update the possible placement of the tiles
    const firstOccupancy = this.isOccupiedArray.findIndex((element) => element === true);
    const lastOccupancy = this.isOccupiedArray.findLastIndex((element) => element === true);
    if (firstOccupancy === -1) {
      this.possiblePlacement = [null, null];
    } else {
      this.possiblePlacement = [firstOccupancy, lastOccupancy];
    }
  }
  isWordValid() {
    const wordValidationElement = $('#word-validation');
    wordValidationElement.empty();
    const word = this.getWord().trim();
    let isValid = true;
    // check if the word has a space
    if (word.includes(' ')) {
      wordValidationElement.append($(`<p>Word cannot contain spaces.</p>`));
      isValid = false;
    }
    // check if the word is less than 2 letters
    if (word.length <= 1) {
      wordValidationElement.append($(`<p>Word must be longer than 1 letter.</p>`));
      isValid = false;
    }

    // check if the word is in the dictionary
    if (!this.wordDict[word.toUpperCase()]) {
      wordValidationElement.append($(`<p>Word must be in the english dictionary</p>`));
      isValid = false;
    }
    return isValid;
  }
  calculateScore() {
    let score = 0;
    let wordMultiplier = 1;

    // calculate the score of the word
    this.boardArray.forEach((letter, index) => {
      // if the tile is not occupied, exit
      if (!this.isOccupiedArray[index]) {
        return;
      }

      // calculate the score of the letter
      let letterScore = SCRABBLE_TILE_MAP[letter]['value'];
      // calculate the multiplier of the letter
      const letterMultiplier = this.boardMultiplierArray[index];
      // check the multiplier for 2x word or 2x letter
      if (letterMultiplier === '2l') {
        letterScore *= 2;
      } else if (letterMultiplier === '2w') {
        wordMultiplier *= 2;
      }
      score += letterScore;
    });
    return score * wordMultiplier;
  }
  updateScore(score) {
    this.score += score;
    $('#current-score').html(`Score: ${this.score}`);
  }
  getScore() {
    return this.score;
  }
  updateScoreHtml() {
    $('#current-score').html(`Score: ${this.score} (+${this.calculateScore()})`);
  }
  updateWordHtml() {
    $('#current-word').html(`Word: ${this.getWord()}`);
  }
  injectTileHolder(tileHolder) {
    this.tileHolder = tileHolder;
  }
}
