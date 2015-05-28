'use strict'

var debug = require('debug')('forwarded-http')
var http = require('http')
var rfc7239 = require('./rfc7239')
var schemas = require('./schemas')

module.exports = function (req) {
  if (!req || !(req instanceof http.IncomingMessage)) {
    throw new TypeError('a request of type: "http.IncomingMessage" is required')
  }

  // start with default values
  var forwarded = {
    ips: [req.connection.remoteAddress],
    port: req.connection.remotePort,
    ports: [req.connection.remotePort],
    proto: req.connection.encrypted ? 'https' : 'http',
    host: req.headers && req.headers.host ? req.headers.host : undefined
  }

  // construct "for" object
  forwarded.for = {}

  // set default value
  forwarded.for[req.connection.remoteAddress] = req.connection.remotePort

  // exit early
  if (Object.keys(req.headers).length === 0) {
    return forwarded
  }

  // loop through schemas
  schemas.forEach(function (schema) {
    // detect host
    if (schema.host && req.headers[schema.host]) {
      debug('found %s header', schema.host)

      forwarded.host = req.headers[schema.host]
    }

    // detect protocol
    if (schema.proto) {
      var proto = false

      if (typeof schema.proto === 'function') {
        proto = schema.proto(req)
      } else {
        if (req.headers[schema.proto]) {
          debug('found %s header', schema.proto)

          proto = req.headers[schema.proto]
        }
      }

      // overwrite
      if (proto) {
        forwarded.proto = proto
      }
    }

    // detect ports
    if (schema.port && req.headers[schema.port]) {
      debug('found %s header', schema.port)

      var port = req.headers[schema.port]

      // attach to global list
      forwarded.ports.push(port)

      // TODO: how to determine priority / final value?
      forwarded.port = port
    }

    // detect IPs
    if (schema.ip && req.headers[schema.ip]) {
      debug('found %s header', schema.ip)

      var ips = req.headers[schema.ip].split(/ *, */)

      // attach to global list
      Array.prototype.push.apply(forwarded.ips, ips)

      // construct "for"
      ips.forEach(function (ip) {
        forwarded.for[ip] = forwarded.port
      })
    }
  })

  // append missing ips to forward.for
  var diff = forwarded.ips.filter(function (ip) {
    return forwarded.for[ip] !== undefined
  })

  diff.forEach(function (ip) {
    forwarded.for[ip] = forwarded.port
  })

  // process RFC7239 and use to overwrite
  if (req.headers.forwarded) {
    var rfc = rfc7239(req.headers.forwarded)

    if (rfc.for) {
      rfc.for.forEach(function (node) {
        var parts = /(?:(?:(\[[\w:]+\]):?(\d+)?)|(?:([\d\.]+):?(\d+)?))/g.exec(node)

        if (parts === null) {
          forwarded.ips.push(node)
          forwarded.for[node] = forwarded.port
          return
        }

        var ip = parts[1] || parts[3]
        var port = parts[2] || parts[4] || forwarded.port

        forwarded.ips.push(ip)
        forwarded.ports.push(port)
        forwarded.for[ip] = port
      })
    }

    if (rfc.proto) {
      forwarded.proto = rfc.proto
    }

    if (rfc.host) {
      forwarded.host = rfc.host
    }

    if (rfc.by) {
      forwarded.by = rfc.by
    }
  }

  // clear out duplicate port entries
  var uniqueFilter = function (value, index, self) {
    return self.indexOf(value) === index
  }

  forwarded.ips = forwarded.ips.filter(uniqueFilter)
  forwarded.ports = forwarded.ports.filter(uniqueFilter)

  return forwarded
}
