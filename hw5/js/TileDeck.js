/*
Author: Jeffrey Chan
Email: jeffrey_chan2@student.uml.edu
Created: 12/10/2023
File Description: javascript file for TileDeck Class
*/
import { SCRABBLE_TILE_MAP } from './constants.js';
export default class TileDeck {
  tilesRemaining = 0;
  tilesRemainingMap = {};
  constructor() {
    // create a deck of remaining tiles
    for (let key in SCRABBLE_TILE_MAP) {
      this.tilesRemainingMap[key] = SCRABBLE_TILE_MAP[key]['original-distribution'];
      this.tilesRemaining += SCRABBLE_TILE_MAP[key]['original-distribution'];
    }
  }

  // get a specific number of tiles from the deck
  getTilesFromDeck(num = 0) {
    const hand = [];
    // check if there are any more tiles in the deck
    if (num > this.tilesRemaining) {
      num = tilesRemaining;
    }

    // loop through num times, and retrieve random tiles
    for (let i = 0; i < num; i++) {
      const randomIndex = Math.floor(Math.random() * Object.keys(this.tilesRemainingMap).length);
      const randomLetter = Object.keys(this.tilesRemainingMap)[randomIndex];
      // if this is that last of that letter, remove from the tiles remaining object
      if (this.tilesRemainingMap[randomLetter] === 1) {
        delete this.tilesRemainingMap[randomLetter];
      } else {
        this.tilesRemainingMap[randomLetter] -= 1;
      }
      hand.push(randomLetter);
      this.tilesRemaining -= 1;
    }
    return hand;
  }

  getRemainingTiles() {
    return this.tilesRemaining;
  }
}
