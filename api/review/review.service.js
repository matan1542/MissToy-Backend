const dbService = require('../../services/db.service')
const ObjectId = require('mongodb').ObjectId
const asyncLocalStorage = require('../../services/als.service')
const logger = require('../../services/logger.service')

async function query(filterBy = {}) {
    try {
        // const criteria = _buildCriteria(filterBy)
        const collection = await dbService.getCollection('reviews')

        // const reviews = await collection.find(criteria).toArray()
        var reviews = await collection.aggregate([
            {
                $lookup:
                {
                    localField: 'userId',
                    from: 'users_db',
                    foreignField: '_id',
                    as: 'byUser'
                }
            },
            {
                $unwind: '$byUser'
            },
            {
                $lookup:
                {
                    localField: 'toyId',
                    from: 'toys_db',
                    foreignField: '_id',
                    as: 'aboutToy'
                }
            },
            {
                $unwind: '$aboutToy'
            }
        ]).toArray()
        reviews = reviews.map(review => {
            review.byUser = { _id: review.byUser._id, fullname: review.byUser.fullname }
            review.aboutToy = { _id: review.aboutToy._id, name: review.aboutToy.name }
            delete review.userId
            delete review.toyId
            return review
        })
        reviews = reviews.filter(review => {
            return JSON.stringify(review.aboutToy._id) === JSON.stringify(filterBy._id)
        })

        return reviews
    } catch (err) {
        logger.error('cannot find reviews', err)
        throw err
    }

}

async function remove(reviewId) {
    try {
        // const store = asyncLocalStorage.getStore()
        // console.log('storeeeeeeeeeeeeeeeee',store)
        // const { userId, isAdmin } = store
        const collection = await dbService.getCollection('reviews')
        // remove only if user is owner/admin
        const query = { _id: ObjectId(reviewId) }
        if (!isAdmin) query.byUserId = ObjectId(userId)
        await collection.deleteOne(query)
        // return await collection.deleteOne({ _id: ObjectId(reviewId), byUserId: ObjectId(userId) })
    } catch (err) {
        logger.error(`cannot remove review ${reviewId}`, err)
        throw err
    }
}


async function add(review) {
    try {
        // peek only updatable fields!
        const reviewToAdd = {
            toyId: ObjectId(review.toyId),
            userId: ObjectId(review.userId),
            content: review.content
        }
        console.log(`adding ${reviewToAdd}`)
        const collection = await dbService.getCollection('reviews')
        await collection.insertOne(reviewToAdd)
        return reviewToAdd;
    } catch (err) {
        logger.error('cannot insert review', err)
        throw err
    }
}

function _buildCriteria(filterBy) {
    const criteria = {}
    return criteria
}

module.exports = {
    query,
    remove,
    add
}


