/*
Author: Jeffrey Chan
Email: jeffrey_chan2@student.uml.edu
Created: 12/10/2023
File Description: Main javascript files for scrabble game
*/
'use strict';
import TileHolder from './TileHolder.js';
import TileDeck from './TileDeck.js';
import ScrabbleBoard from './ScrabbleBoard.js';

let tileHolder;
let tileDeck;
let scrabbleBoard;

$(document).ready(() => {
  // create my objects and original state of the game
  scrabbleBoard = new ScrabbleBoard();
  tileHolder = new TileHolder();
  tileDeck = new TileDeck();

  tileHolder.injectScrabbleBoard(scrabbleBoard);
  scrabbleBoard.injectTileHolder(tileHolder);

  tileHolder.insertTiles(tileDeck.getTilesFromDeck(7));
  tileHolder.generateTileHolderHTML();

  $('#restart-button').click(() => {
    // clear tiles ont he board and holder
    scrabbleBoard.clearBoard();
    tileHolder.removeAllTiles();
    // make a brand new deck, and generate new tiles in hand
    tileDeck = new TileDeck();
    tileHolder.insertTiles(tileDeck.getTilesFromDeck(7));
    tileHolder.generateTileHolderHTML();
    scrabbleBoard.updateScoreHtml();
  });
  $('#next-word-button').click(() => {
    if (!scrabbleBoard.isWordValid()) {
      alert('Invalid word! Please try again.');
      return;
    }
    // calculate the score!! and update the score!!
    scrabbleBoard.updateScore(scrabbleBoard.calculateScore());

    // clear tiles ont he board
    scrabbleBoard.clearBoard();
    // insert missing tiles into the hand, and generate them
    console.log(tileHolder.getTilesHeld());
    tileHolder.insertTiles(tileDeck.getTilesFromDeck(7 - tileHolder.getTilesHeld()));
    tileHolder.generateTileHolderHTML();
  });
});
