const fs = require('fs')
const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId

async function query(filterBy) {

    const criteria = _buildCriteria(filterBy);

    try {
        const collection = await dbService.getCollection('toys_db');
        let toys = await collection.find(criteria).toArray()
        return toys
    } catch (err) {
        throw Error('Something went wrong with the query function', err);
    }
}

async function save(toy) {
    try {
        const collection = await dbService.getCollection('toys_db');
        if (toy._id) {
            // UPDATE
            toy.updatedAt = Date.now()
            await collection.updateOne({ _id: ObjectId(toy._id) }, { $set: { ...toy, _id: ObjectId(toy._id) } })

        } else {
            // CREATE
            toy.img = toy.img || `https://robohash.org/${toy.name}`
            toy.inStock = true
            toy.createdAt = toy.updatedAt = Date.now()
            await collection.insertOne(toy)
            return toy
        }
        return toy
    } catch (err) {
        throw err;
    }

}

async function getById(toyId) {
    const collection = await dbService.getCollection('toys_db')
    const toy = await collection.findOne({ _id: ObjectId(toyId) })
    return toy
}

async function remove(toyId) {
    try {
        const collection = await dbService.getCollection('toys_db')
        const res = await collection.deleteOne({ _id: ObjectId(toyId) })

    } catch (err) {
        logger.error(`cannot remove toy ${toyId}`, err)
        throw err
    }
}


module.exports = {
    query,
    save,
    getById,
    remove
}


function _buildCriteria(filterBy) {
    console.log('filterBy', filterBy)
    const { name, type, inStock } = filterBy;
    const criteria = {}
    if (type !== 'all') {
        criteria.type = { $regex: type, $options: 'i' }
    }
    if (name) {
        criteria.name = { $regex: name, $options: 'i' }
    }
    if (inStock !== 'all') {
        criteria.inStock = { $exists: JSON.parse(inStock) }
    }
    console.log('criteriaaaaaaaaaaaaaaaaaaaaaaaaaa', criteria)
    return criteria
}
