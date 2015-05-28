'use strict'

var debug = require('debug')('forwarded-http')

module.exports = [
  // xff
  {
    ip: 'x-forwarded-for',
    host: 'x-forwarded-host',
    port: 'x-forwarded-port',
    proto: 'x-forwarded-proto'
  },

  // xff-alt
  {
    proto: 'x-forwarded-protocol'
  },

  // zscaler
  {
    ip: 'z-forwarded-for',
    host: 'z-forwarded-host',
    port: 'z-forwarded-port',
    proto: 'z-forwarded-proto'
  },

  // zscaler-alt
  {
    proto: 'z-forwarded-protocol'
  },

  // fastly
  {
    ip: 'fastly-client-ip',
    port: 'fastly-client-port'
  },

  // nginx
  {
    ip: 'x-real-ip',
    port: 'x-real-port',
    proto: 'x-real-proto'
  },

  // nginx-alt
  {
    proto: 'x-url-scheme'
  },

  // rackspace
  {
    ip: 'x-cluster-client-ip'
  },

  // cloudflare
  {
    ip: 'cf-connecting-ip'
  },

  // special headers
  {
    proto: function (req) {
      if (req.headers['front-end-https'] === 'on') {
        return 'https'
      }

      if (req.headers['x-forwarded-ssl'] === 'on') {
        return 'https'
      }

      // fastly
      if (~['1', 'true'].indexOf(req.headers['fastly-ssl'])) {
        return 'https'
      }

      // cloudflare
      if (req.headers['cf-visitor']) {
        try {
          var cf = JSON.parse(req.headers['cf-visitor'])
          return cf.scheme ? cf.scheme : false
        } catch (e) {
          debug('could not parse "cf-visitor" header: %s', req.headers['cf-visitor'])
        }
      }

      return false
    }
  }
]
