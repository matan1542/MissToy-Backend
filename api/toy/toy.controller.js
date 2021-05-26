const toyService = require('./toy.service')
async function onLoadToys(req, res) {
    try {
        const toys = await toyService.query(req.query)
        res.send(toys)
    } catch (err) {
        throw Error('No toys at this point');
    }

}
async function onSave(req, res) {
    const toy = req.body
    console.log('toyyyyyy', toy)
    try {
        const savedToy = await toyService.save(toy)
        res.json(savedToy)
    } catch (err) {
        console.log(err)
        res.status(401).send('Cannot create toy')
    }
}

async function onGetById(req, res) {
    const { toyId } = req.params
    try {
        const toy = await toyService.getById(toyId)
        res.json(toy)
    } catch (err) {
        throw new Error('You had problem with getById FUNC ');
    }
}

async function onRemove(req, res) {
    const { toyId } = req.params
    try {
        await toyService.remove(toyId)
        res.send()
    } catch (err) {
        console.log(err)
        res.status(401).send('Cannot delete toy')
    }

}

module.exports = {
    onSave,
    onGetById,
    onRemove,
    onLoadToys
}