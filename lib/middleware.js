'use strict'

var forwarded = require('..')

module.exports = function (options) {
  return function middleware (req, res, next) {
    req.forwarded = forwarded(req, options)

    next()
  }
}
