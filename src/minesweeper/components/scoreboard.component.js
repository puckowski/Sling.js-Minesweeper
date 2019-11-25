class ScoreboardComponent {

    constructor() {

    }

    view() {
        return s.markup('div', {
            attrs: {
                id: 'divScoreboard',
                class: 'scoreboard'
            },
            children: [
                s.markup('span', {
                    attrs: {
                    },
                    children: [
                        s.textNode('Score: ' + s.getState().getScore()),
                        ...(s.getState().hasState() === true ? [s.textNode(' ' + s.getState().getState())] : []),
                    ]
                })
            ]
        })
    }
}

export default ScoreboardComponent;