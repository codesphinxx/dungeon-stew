export default [
    {
        id: 0,
        name: 'Country boy',
        texture: 'boy-a',
        frames: [0,1,2,1],
        body: {
            x: 16,
            y: 16,
            radius: 8
        },
        conversation:[
            {
                line: '',
                choice: {
                    variable: '{variable-name}',
                    items:['Yes', 'No']
                }
            }
        ]
    }
]