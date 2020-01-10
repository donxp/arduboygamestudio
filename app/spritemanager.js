class SpriteManager {
    constructor() {
        this.sprites = []
    }

    addSprite() {

    }

    static addSpriteButtonHandler() {
        console.log('add sprite')
    }

    static init() {
        $('#add-sprite-button').click(this.addSpriteButtonHandler)
    }
}

module.exports = SpriteManager;