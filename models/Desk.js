const mongoose = require('mongoose')
const Schema = mongoose.Schema

const deskSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  user: {
    ref: 'users',
    type: Schema.Types.ObjectId
  }
})

module.exports = mongoose.model('desks', deskSchema)