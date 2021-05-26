const express = require('express')
const cors = require('cors')
const path = require('path')
const expressSession = require('express-session')
const { connectSockets } = require('./services/socket.service')

const app = express()
const http = require('http').createServer(app)

const session = expressSession({
    secret: 'coding is amazing',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
})
// Express App Config
app.use(express.json())
app.use(session)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')))
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:8080', 'http://localhost:8080', 'http://127.0.0.1:3000', 'http://localhost:3000'],
        credentials: true
    }
    app.use(cors(corsOptions))
}

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/user.routes')
const reviewRoutes = require('./api/review/review.routes')
const toyRoutes = require('./api/toy/toy.routes')

const setupAsyncLocalStorage = require('./middlewares/setupAls.middleware')
app.all('*', setupAsyncLocalStorage)

app.use('/api/toy', toyRoutes)
app.use('/api/auth', authRoutes)
// app.use('/api/user', userRoutes)
app.use('/api/review', reviewRoutes)


//Routes 
app.get('/api/setup-session', (req, res) => {
    req.session.connectedAt = Date.now()
    console.log('setup-session:', req.sessionID);
    res.end()
})
// TOY CRUDL
app.get('/**', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'))
})
connectSockets(http, session)





// ************************* User Routes 
// app.post('/api/login', (req, res)=>{
//     console.log('api login')
//     const credentials = req.body
//     userService.checkLogin(credentials)
//         .then(user =>{
//             if (user) {
//                 req.session.loggedinUser = user;
//                 res.send(user)
//             } else {
//                 res.status(403).send('Invalid username / password')
//             }
//         })
// })
// app.post('/api/signup', (req, res)=>{
//     const userInfo = req.body
//     console.log(userInfo)
//     userService.save(userInfo)
//         .then(user =>{
//             if (user) {
//                 req.session.loggedinUser = user;
//                 res.send(user)
//             } else {
//                 res.status(403).send('Invalid info')
//             }
//         })
// })

// app.post('/api/logout', (req, res)=>{
//     req.session.destroy()
//     res.send()
// })

const logger = require('./services/logger.service')
const port = process.env.PORT || 3030
http.listen(port, () => {
    logger.info('Server is running on port: ' + port)
})
