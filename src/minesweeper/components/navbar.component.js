class NavbarComponent {

    constructor() {

    }

    view() {
        return s.markup('div', {
            attrs: {
                style: 'width:100%;height:60px;background-color:rgba(0,0,0,0.6);'
            },
            children: [
                s.markup('h3', {
                    attrs: {
                        class: 'navbar'
                    },
                    children: [
                        s.textNode('Minesweeper')
                    ]
                })
            ]
        });
    }
}

export default NavbarComponent;