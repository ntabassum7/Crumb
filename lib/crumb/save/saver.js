class Saver {

    constructor() {
    }

    save() {
        throw new Error('Class must override save()');
    }

}

module.exports = Saver;