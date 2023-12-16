### Github URL Link
https://jeffrey-chan-gui1-hw5.netlify.app/

### Repository Links
Part1: https://github.com/JeffreyChan1303/gui1_hws/tree/main/hw5


### Write up
This project was creating a scrabble game. The first thing I looked at was the 
logic of the project, and it seemed like there were three main objects that 
I would need to implement. The scrabble board, the tile deck, and the tile holder.
Because of this, I made 3 separate javascript files to store the logic for thier specific 
component, and had a main file that started up the game and also initialized the 
objects. 

The scrabble board dealt with the main game logic, of generating tiles, and drag and
drop functionality. It also kept score and the current word that was created using our tiles.
The tile deck kept track of the remaining tiles that we had and also had the logic of retrieving
tiles when we needed to go to the next word or restart. Finally, the tile holder held the tiles
that were in the user's hand and allowed them to drag and drop them onto the scrabble board.

