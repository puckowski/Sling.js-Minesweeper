import NavbarComponent from './minesweeper/components/navbar.component.js';
import GameBoardComponent from './minesweeper/components/game-board.component.js';
import StoreGameState from './minesweeper/store/game-state.store.js';
import ScoreboardComponent from './minesweeper/components/scoreboard.component.js';

let state = new StoreGameState();
s.setState(state);

let compNavbar = new NavbarComponent();
s.mount('divNavbar', compNavbar);

let compScoreboard = new ScoreboardComponent();
s.mount('divScoreboard', compScoreboard);

let compGameBoard = new GameBoardComponent();
s.mount('gameBoard', compGameBoard);

s.autoUpdate('divScoreboard', compScoreboard);
s.autoUpdate('gameBoard', compGameBoard);
