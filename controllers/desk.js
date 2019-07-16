const Desk = require('../models/Desk')
const errorHandler = require('../utils/errorHandler')
const fs = require('fs')


module.exports.getAll = async function(req, res) {
  try {
    const desks = await Desk.find({user: req.user.id})
    res.status(200).json(desks)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.getById = async function(req, res) {
  try {
    const desk = await Desk.findById(req.params.id)
    res.status(200).json(desk)
    
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.create = async function(req, res) {
  const desk = new Desk({
    name: req.body.name,
    user: req.user.id
  })
  console.log(req.body.name)

  try {
    await desk.save()
    res.status(201).json(desk)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.update = async function(req, res) {

  const updated = {
    name: req.body.name
  }

  try {
    const desk = await Desk.findOneAndUpdate(
      {_id: req.params.id},
      {$set: updated},
      {new: true}
    )
    res.status(200).json(desk)
  } catch (e) {
    errorHandler(res, e)
  }
}

module.exports.remove = async function(req, res) {
  try {
    await Desk.remove({_id: req.params.id})
      res.status(200).json({
        message: 'Доска удалена.'
      })
    
  } catch (e) {
    errorHandler(res, e)
  }
}