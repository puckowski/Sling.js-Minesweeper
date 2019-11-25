class StoreGameState {
    constructor() {
        this.score = 0;
        this.state = '';
    }

    getScore() {
        return this.score;
    }

    setScore(newScore) {
        this.score = newScore;
    }

    addScore(additionalScore) {
        this.score += additionalScore;
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        this.state = newState;
    }

    hasState() {
        return this.state !== '';
    }

    resetState() {
        this.state = '';
    }
}

export default StoreGameState;
