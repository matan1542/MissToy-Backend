const fs = require('fs')
const gUsers = require('../data/users.json')

// Create TEST Data
// save({username: 'babu', password: 'babu1', fullname: 'Babu Le'})
// save({username: 'mamu', password: 'mamu1', fullname: 'Mamu shka'})


function checkLogin(credentials) {
    var user = gUsers.find(user => {
        console.log('credentials', credentials, 'user', user)

        return (user.email === credentials.email &&
            user.password === credentials.password)
    })

    if (user) {
        user = { ...user }
        delete user.password
    }
    return Promise.resolve(user)

}


function getById(userId) {
    const user = gUsers.find(user => user._id === userId)
    return Promise.resolve(user)
}


function save(user, loggedinUserId = null) {
    var savedUser
    if (user._id) {
        // UPDATE
        savedUser = gUsers.find(currUser => currUser._id === loggedinUserId)
        if (savedUser) {
            savedUser.fullname = user.fullname
            savedUser.updatedAt = Date.now()
        } else {
            return Promise.reject('Not your Profile')
        }
    } else {
        // CREATE
        const { fullname, email, password } = user;
        savedUser = {
            _id: _makeId(),
            fullname,
            email,
            password,
            isAdmin: false
        }
        savedUser.createdAt = savedUser.updatedAt = Date.now()
        gUsers.unshift(savedUser)

    }
    return _saveUsersToFile().then(() => {
        savedUser = { ...savedUser }
        delete savedUser.password;
        return savedUser;
    })
}


module.exports = {
    save,
    getById,
    checkLogin
}


function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return txt
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        fs.writeFile('data/user.json', JSON.stringify(gUsers, null, 2), (err) => {
            if (err) {
                console.log(err)
                reject('Cannot write to file')
            } else {
                console.log('Wrote Successfully!')
                resolve()
            }
        })
    })

}