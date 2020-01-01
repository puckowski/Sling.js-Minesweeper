const DEFAULT_MINE_COUNT = 40;
const DEFAULT_BOARD_WIDTH = 20;
const MAX_TRANSITION_DELAY_MILLIS = 200;
const MAX_TRANSITION_STEPS = 4;
const DEFAULT_TRANSITION_INCREMENT = 50;

class GameBoardComponent {

    constructor() {
        this.mineMap = [];
        this.minesVisible = false;
        this.victory = false;
    }

    slOnInit() {
        this.createMineMap();
    }

    createMineMap() {
        let i, n;

        // init 2d array
        for (i = 0; i < DEFAULT_BOARD_WIDTH; ++i) {
            this.mineMap[i] = new Array(DEFAULT_BOARD_WIDTH);

            for (n = 0; n < DEFAULT_BOARD_WIDTH; ++n) {
                this.mineMap[i][n] = { mine: 0, value: null, clicked: false, row: i, col: n };
            }
        }

        let row, col;

        // add mine locations randomly
        for (i = 0; i < DEFAULT_MINE_COUNT; ++i) {
            row = Math.floor(Math.random() * DEFAULT_BOARD_WIDTH);
            col = Math.floor(Math.random() * DEFAULT_BOARD_WIDTH);

            if (this.mineMap[row][col].mine === 1) {
                i--;
            } else {
                this.mineMap[row][col].mine = 1;
            }
        }
    }

    revealMines() {
        this.minesVisible = true;
    }

    clickCell(context, data, mouseEvent, transitionDelay = DEFAULT_TRANSITION_INCREMENT, transitionStep = 0) {
        if (this.victory === true || this.minesVisible === true) {
            return;
        }

        if (data.mine === 1) {
            this.revealMines();

            let state = s.getState();
            state.setState('Game over!');
            s.setState(state);
        } else {
            data.clicked = true;

            let state = s.getState();
            state.addScore(10);
            s.setState(state);

            let mineCount = 0;
            const cellRow = data.row;
            const cellCol = data.col;
            let i, j;
            for (i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, DEFAULT_BOARD_WIDTH - 1); i++) {
                for (j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, DEFAULT_BOARD_WIDTH - 1); j++) {
                    if (this.mineMap[i][j].mine === 1) {
                        mineCount++;
                    }
                }
            }
            data.value = mineCount;

            if (mineCount === 0) {
                for (i = Math.max(cellRow - 1, 0); i <= Math.min(cellRow + 1, DEFAULT_BOARD_WIDTH - 1); i++) {
                    for (j = Math.max(cellCol - 1, 0); j <= Math.min(cellCol + 1, DEFAULT_BOARD_WIDTH - 1); j++) {
                        if (this.mineMap[i][j].value === null) {
                            if (transitionStep < MAX_TRANSITION_STEPS) {
                                transitionStep++;

                                s.pureSetTimeout(function (i, j) {
                                    this.clickCell(this, this.mineMap[i][j], null, transitionDelay, transitionStep);
                                }.bind(this, i, j), transitionDelay);

                                if (transitionDelay < MAX_TRANSITION_DELAY_MILLIS) {
                                    transitionDelay += DEFAULT_TRANSITION_INCREMENT;
                                }
                            } else {
                                this.clickCell(this, this.mineMap[i][j], null);
                            }
                        }
                    }
                }

                if (transitionStep === MAX_TRANSITION_STEPS) {
                    setTimeout(function() {
                        // This will trigger change detection
                    }, (MAX_TRANSITION_DELAY_MILLIS * MAX_TRANSITION_STEPS) + 1);
                }
            }

            this.checkLevelCompletion();
        }
    }

    checkLevelCompletion() {
        let levelComplete = true;

        checkComplete:
        for (let i = 0; i < DEFAULT_BOARD_WIDTH; i++) {
            for (let j = 0; j < DEFAULT_BOARD_WIDTH; j++) {
                if (this.mineMap[i][j].clicked === false && this.mineMap[i][j].mine !== 1) {
                    levelComplete = false;
                    break checkComplete;
                }
            }
        }

        if (levelComplete === true && this.victory === false) {
            this.victory = true;
            
            let state = s.getState();
            state.setState('You win!');
            s.setState(state);

            this.revealMines();
        }
    }

    reset() {
        this.minesVisible = false;
        this.victory = false;
        this.createMineMap();

        document.querySelectorAll('#gameBoard td').forEach(node => {
            node.textContent = '';
        });

        let state = s.getState();
        state.resetState();
        state.setScore(0);
        s.setState(state);
    }

    view() {
        return s.markup('div', {
            attrs: {
                id: 'gameBoard',
                class: 'content'
            },
            children: [
                s.markup('table', {
                    attrs: {

                        class: 'table-minesweeper'
                    },
                    children: [
                        ...Array.from(this.mineMap, (row) =>
                            s.markup('tr', {
                                attrs: {

                                },
                                children: [
                                    ...Array.from(row, (col) =>
                                        s.markup('td', {
                                            attrs: {
                                                ...col.clicked === true && { class: 'clicked' },
                                                ...this.minesVisible === true && col.mine === 1 && { class: 'mine' },
                                                onclick: this.clickCell.bind(this, this, col)
                                            },
                                            children: [
                                                ...(col.value !== null ? [s.textNode(col.value)] : []),
                                            ]
                                        })
                                    )
                                ]
                            })
                        )
                    ]
                }),

                s.markup('div', {
                    attrs: {

                    },
                    children: [
                        s.markup('button', {
                            attrs: {
                                onclick: this.reset.bind(this),
                                class: 'pure-button',
                                style: 'background-color:red;color:white;'
                            },
                            children: [
                                s.textNode('New board')
                            ]
                        })
                    ]
                }),
            ]
        });
    }
}

export default GameBoardComponent;