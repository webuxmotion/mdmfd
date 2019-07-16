const express = require('express')
const mongoose = require('mongoose')
const passport = require('passport')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const keys = require('./config/keys')
const app = express()

const authRoutes = require('./routes/auth')
const categoryRoutes = require('./routes/category')
const deskRoutes = require('./routes/desk')
const positionRoutes = require('./routes/position')

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.connect(keys.mongoURI, { useNewUrlParser: true })
  .then(() => console.log('MongoDB connected.'))
  .catch(error => console.log(error))

app.use('/uploads', express.static('uploads'))

app.use(passport.initialize())
require('./middleware/passport')(passport)

app.use(morgan('dev'))
app.use(cors())

app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/desk', deskRoutes)
app.use('/api/position', positionRoutes)

module.exports = app
