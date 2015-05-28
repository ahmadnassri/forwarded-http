'use strict'

var forwarded = require('..')

module.exports = function () {
  return function middleware (req, res, next) {
    req.forwarded = forwarded(req)

    next()
  }
}
