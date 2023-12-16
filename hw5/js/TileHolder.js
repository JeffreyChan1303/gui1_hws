/*
Author: Jeffrey Chan
Email: jeffrey_chan2@student.uml.edu
Created: 12/10/2023
File Description: Javascript file for TileHolder class
*/
import { SCRABBLE_TILE_MAP, Z_INDEX_ON_DRAG } from './constants.js';

export default class TileHolder {
  holderArray = [];
  tilesHeld = 0;
  tileHolderWrapperElement = undefined;
  userTileWrapperElement = undefined;
  scrabbleBoard = undefined;
  constructor(scrabbleBoard) {
    this.scrabbleBoard = scrabbleBoard;
    // make the holder droppable
    this.tileHolderWrapperElement = $('.tile-holder-wrapper');
    this.userTileWrapperElement = $('#user-tile-wrapper');
    const self = this;
    this.tileHolderWrapperElement.droppable({
      activeClass: 'dragHighlight',
      hoverClass: 'hoverHighlight',
      tolerance: 'touch',
      drop: function (event, ui) {
        // check if the tile was already on the board
        const previousIndex = ui.draggable.attr('index');
        ui.draggable.attr('index', null);
        if (previousIndex) {
          self.scrabbleBoard.clearIndex(previousIndex);

          // update the tileholder if tile was dragged from the board
          const letter = ui.draggable.attr('letter');
          self.insertTiles([letter]);

          // also update the possible placement of a word
          self.scrabbleBoard.updatePossiblePlacement();

          // update the word and score
          self.scrabbleBoard.updateWordHtml();

          // add the tile back into the board
          $(ui.draggable).css('top', '');
          $(ui.draggable).css('left', '');
          // $(this).append(ui.draggable);
          // $(this).children()[1].append(ui.draggable);
          $('#user-tile-wrapper').append(ui.draggable);

          // update word and current score
          self.scrabbleBoard.isWordValid();
        }
      }
    });
  }

  generateTileHolderHTML() {
    // empty the tile holder html
    this.userTileWrapperElement.empty();
    console.log(this.holderArray);

    for (let i = 0; i < this.holderArray.length; i++) {
      const newUserTile = $(
        `<img src="${SCRABBLE_TILE_MAP[this.holderArray[i]].img}" class="user-tile" alt="Scrabble user tile" letter="${
          this.holderArray[i]
        }"/>`
      );

      newUserTile.draggable({
        revertDuration: 200, // msec
        start: function (event, ui) {
          // Tile should be on top of everything else when being dragged.
          $(this).css('z-index', Z_INDEX_ON_DRAG);

          // Revert option needs to be manually reset because it may be modified by droppables
          // to force reverting after dropping has occured.
          $(this).draggable('option', 'revert', 'invalid');
        },
        stop: function () {
          // Once finished dragging, revert the z-index.
          $(this).css('z-index', '');
        }
      });

      this.userTileWrapperElement.append(newUserTile);
    }
    return this.userTileWrapperElement;
  }

  insertTiles(tileArr) {
    for (let i = 0; i < tileArr.length; i++) {
      this.holderArray.push(tileArr[i]);
    }
    this.tilesHeld += tileArr.length;
  }
  removeTiles(tileArr) {
    for (let i = 0; i < tileArr.length; i++) {
      this.holderArray.splice(this.holderArray.indexOf(tileArr[i]), 1);
    }
    this.tilesHeld -= tileArr.length;
  }
  removeAllTiles() {
    this.tilesHeld = 0;
    this.holderArray = [];
  }
  getTilesHeld() {
    return this.tilesHeld;
  }
  injectScrabbleBoard(scrabbleBoard) {
    this.scrabbleBoard = scrabbleBoard;
  }
}
