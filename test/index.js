/* global describe, beforeEach, it */

'use strict'

var forwarded = require('..')
var http = require('http')
var should = require('should')

var fixture = new http.IncomingMessage()

describe('Forwarded', function () {
  beforeEach(function (done) {
    fixture.headers = {}
    fixture.connection = {
      remoteAddress: '0.0.0.0',
      remotePort: '8000',
      encrypted: false
    }

    done()
  })

  it('should throw an exception when invalid request is passed', function (done) {
    var params

    /*eslint-disable no-extra-parens */
    (function () {
      params = forwarded({})
    }).should.throw('a request of type: "http.IncomingMessage" is required')

    should.not.exist(params)

    done()
  })

  describe('incomingMessage', function () {
    it('should detect default values', function (done) {
      var params = forwarded(fixture)

      params.port.should.equal('8000')
      params.ports.should.eql(['8000'])
      params.ips.should.eql(['0.0.0.0'])
      params.for.should.eql({'0.0.0.0': '8000'})
      params.proto.should.eql('http')
      should.not.exist(params.host)

      done()
    })

    it('should assign protocol to https', function (done) {
      fixture.connection.encrypted = true
      var params = forwarded(fixture)

      params.proto.should.equal('https')

      done()
    })

    it('should assign default host', function (done) {
      fixture.headers.host = 'foo.com'

      var params = forwarded(fixture)

      params.host.should.equal('foo.com')

      done()
    })
  })

  describe('x-forwarded-*', function () {
    it('should parse "x-forwarded-for"', function (done) {
      fixture.headers['x-forwarded-for'] = '0.0.1.1, 0.0.1.2'

      var params = forwarded(fixture)

      params.port.should.equal('8000')
      params.ports.should.eql(['8000'])
      params.ips.should.eql(['0.0.0.0', '0.0.1.1', '0.0.1.2'])
      params.for.should.eql({'0.0.0.0': '8000', '0.0.1.1': '8000', '0.0.1.2': '8000'})
      params.proto.should.eql('http')

      done()
    })

    it('should parse "x-forwarded-port"', function (done) {
      fixture.headers['x-forwarded-port'] = '8001'

      var params = forwarded(fixture)

      params.port.should.equal('8001')
      params.ports.should.eql(['8000', '8001'])
      params.ips.should.eql(['0.0.0.0'])
      params.for.should.eql({'0.0.0.0': '8001'})
      params.proto.should.eql('http')

      done()
    })

    it('should parse "x-forwarded-proto"', function (done) {
      fixture.headers['x-forwarded-proto'] = 'https'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })

    it('should parse "x-forwarded-protocol"', function (done) {
      fixture.headers['x-forwarded-protocol'] = 'https'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })

    it('should parse "x-forwarded-host"', function (done) {
      fixture.headers['x-forwarded-host'] = 'foo.com'

      var params = forwarded(fixture)

      params.host.should.eql('foo.com')

      done()
    })
  })

  describe('z-forwarded-*', function () {
    it('should parse "z-forwarded-for"', function (done) {
      fixture.headers['z-forwarded-for'] = '0.0.2.1, 0.0.2.2'

      var params = forwarded(fixture)

      params.port.should.equal('8000')
      params.ports.should.eql(['8000'])
      params.ips.should.eql(['0.0.0.0', '0.0.2.1', '0.0.2.2'])
      params.for.should.eql({'0.0.0.0': '8000', '0.0.2.1': '8000', '0.0.2.2': '8000'})
      params.proto.should.eql('http')

      done()
    })

    it('should parse "z-forwarded-port"', function (done) {
      fixture.headers['z-forwarded-port'] = '8002'

      var params = forwarded(fixture)

      params.port.should.equal('8002')
      params.ports.should.eql(['8000', '8002'])
      params.ips.should.eql(['0.0.0.0'])
      params.for.should.eql({'0.0.0.0': '8002'})
      params.proto.should.eql('http')

      done()
    })

    it('should parse "z-forwarded-proto"', function (done) {
      fixture.headers['z-forwarded-proto'] = 'https'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })

    it('should parse "z-forwarded-protocol"', function (done) {
      fixture.headers['z-forwarded-protocol'] = 'https'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })

    it('should parse "z-forwarded-host"', function (done) {
      fixture.headers['z-forwarded-host'] = 'foo.com'

      var params = forwarded(fixture)

      params.host.should.eql('foo.com')

      done()
    })
  })

  describe('fastly', function () {
    it('should parse "fastly-client-ip"', function (done) {
      fixture.headers['fastly-client-ip'] = '0.0.3.1, 0.0.3.2'

      var params = forwarded(fixture)

      params.port.should.equal('8000')
      params.ports.should.eql(['8000'])
      params.ips.should.eql(['0.0.0.0', '0.0.3.1', '0.0.3.2'])
      params.for.should.eql({'0.0.0.0': '8000', '0.0.3.1': '8000', '0.0.3.2': '8000'})
      params.proto.should.eql('http')

      done()
    })

    it('should parse "fastly-client-port"', function (done) {
      fixture.headers['fastly-client-port'] = '8003'

      var params = forwarded(fixture)

      params.port.should.equal('8003')
      params.ports.should.eql(['8000', '8003'])
      params.ips.should.eql(['0.0.0.0'])
      params.for.should.eql({'0.0.0.0': '8003'})
      params.proto.should.eql('http')

      done()
    })

    it('should parse "fastly-ssl: 1"', function (done) {
      fixture.headers['fastly-ssl'] = '1'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })

    it('should parse "fastly-ssl: true"', function (done) {
      fixture.headers['fastly-ssl'] = 'true'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })
  })

  describe('x-real-*', function () {
    it('should parse "x-real-ip"', function (done) {
      fixture.headers['x-real-ip'] = '0.0.4.1, 0.0.4.2'

      var params = forwarded(fixture)

      params.port.should.equal('8000')
      params.ports.should.eql(['8000'])
      params.ips.should.eql(['0.0.0.0', '0.0.4.1', '0.0.4.2'])
      params.for.should.eql({'0.0.0.0': '8000', '0.0.4.1': '8000', '0.0.4.2': '8000'})
      params.proto.should.eql('http')

      done()
    })

    it('should parse "x-real-port"', function (done) {
      fixture.headers['x-real-port'] = '8004'

      var params = forwarded(fixture)

      params.port.should.equal('8004')
      params.ports.should.eql(['8000', '8004'])
      params.ips.should.eql(['0.0.0.0'])
      params.for.should.eql({'0.0.0.0': '8004'})
      params.proto.should.eql('http')

      done()
    })

    it('should parse "x-real-proto"', function (done) {
      fixture.headers['x-real-proto'] = 'https'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })

    it('should parse "x-url-scheme"', function (done) {
      fixture.headers['x-url-scheme'] = 'https'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })
  })

  describe('x-cluster-client-ip', function () {
    it('should parse "x-cluster-client-ip"', function (done) {
      fixture.headers['x-cluster-client-ip'] = '0.0.5.1, 0.0.5.2'

      var params = forwarded(fixture)

      params.port.should.equal('8000')
      params.ports.should.eql(['8000'])
      params.ips.should.eql(['0.0.0.0', '0.0.5.1', '0.0.5.2'])
      params.for.should.eql({'0.0.0.0': '8000', '0.0.5.1': '8000', '0.0.5.2': '8000'})
      params.proto.should.eql('http')

      done()
    })
  })

  describe('cf-connecting-ip', function () {
    it('should parse "cf-connecting-ip"', function (done) {
      fixture.headers['cf-connecting-ip'] = '0.0.6.1, 0.0.6.2'

      var params = forwarded(fixture)

      params.port.should.equal('8000')
      params.ports.should.eql(['8000'])
      params.ips.should.eql(['0.0.0.0', '0.0.6.1', '0.0.6.2'])
      params.for.should.eql({'0.0.0.0': '8000', '0.0.6.1': '8000', '0.0.6.2': '8000'})
      params.proto.should.eql('http')

      done()
    })
  })

  describe('special headers', function () {
    it('should parse "front-end-https"', function (done) {
      fixture.headers['front-end-https'] = 'on'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })

    it('should parse "x-forwarded-ssl"', function (done) {
      fixture.headers['x-forwarded-ssl'] = 'on'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })

    it('should parse "cf-visitor"', function (done) {
      fixture.headers['cf-visitor'] = '{"scheme": "https"}'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })

    it('should not fail on a bad "cf-visitor"', function (done) {
      fixture.headers['cf-visitor'] = '{}'

      var params = forwarded(fixture)

      params.proto.should.eql('http')

      done()
    })

    it('should not fail on an invalid "cf-visitor"', function (done) {
      fixture.headers['cf-visitor'] = 'foo'

      var params = forwarded(fixture)

      params.proto.should.eql('http')

      done()
    })
  })

  describe('RFC7239', function () {
    it('should parse "Forwarded: for=0.0.7.1,For=0.0.7.2"', function (done) {
      fixture.headers['forwarded'] = 'for=0.0.7.1,For=0.0.7.2'

      var params = forwarded(fixture)

      params.port.should.equal('8000')
      params.ports.should.eql(['8000'])
      params.ips.should.eql(['0.0.0.0', '0.0.7.1', '0.0.7.2'])
      params.for.should.eql({'0.0.0.0': '8000', '0.0.7.1': '8000', '0.0.7.2': '8000'})

      done()
    })

    it('should parse "Forwarded: for=0.0.7.1:8007,For=0.0.7.2:8008,for=1::8,for=1::8,for=secret"', function (done) {
      fixture.headers['forwarded'] = 'for=0.0.7.1:8007,For=0.0.7.2:8008,for=1::7,for=1::8,for=secret'

      var params = forwarded(fixture)

      params.port.should.equal('8000')
      params.ports.should.eql(['8000', '8007', '8008'])
      params.ips.should.eql(['0.0.0.0', '0.0.7.1', '0.0.7.2', '1::7', '1::8'])
      params.for.should.eql({
        '0.0.0.0': '8000',
        '0.0.7.1': '8007',
        '0.0.7.2': '8008',
        '1::7': '8000',
        '1::8': '8000',
        'secret': '8000'
      })

      done()
    })

    it('should parse "Forwarded: proto=https"', function (done) {
      fixture.headers['forwarded'] = 'proto=https'

      var params = forwarded(fixture)

      params.proto.should.eql('https')

      done()
    })

    it('should parse "Forwarded: host=foo.com"', function (done) {
      fixture.headers['forwarded'] = 'host=foo.com'

      var params = forwarded(fixture)

      params.host.should.eql('foo.com')

      done()
    })

    it('should parse "Forwarded: by=1.0.0.0"', function (done) {
      fixture.headers['forwarded'] = 'by=1.0.0.0'

      var params = forwarded(fixture)

      params.by.should.eql('1.0.0.0')

      done()
    })

    it('should parse "Forwarded: for=secret"', function (done) {
      fixture.headers['forwarded'] = 'for=secret'

      var params = forwarded(fixture)

      params.ips.should.eql(['0.0.0.0'])
      params.for.should.eql({ '0.0.0.0': '8000', secret: '8000' })

      done()
    })
  })

  describe('IP Filtering', function () {
    it('should list only valid IPv4 & IPv6 addresses', function (done) {
      fixture.headers['forwarded'] = 'for=0.0.8.1, for=private, for=0.0.8.2, for=1::8'

      var params = forwarded(fixture)

      params.ips.should.eql(['0.0.0.0', '0.0.8.1', '0.0.8.2', '1::8'])
      params.for.should.eql({
        '1::8': '8000',
        '0.0.0.0': '8000',
        '0.0.8.1': '8000',
        '0.0.8.2': '8000',
        'private': '8000'
      })

      done()
    })

    it('should parse list only approved IPv4 addresses', function (done) {
      fixture.headers['forwarded'] = 'for=0.0.8.1, for=private, for=0.0.8.2, for=1::8'

      var params = forwarded(fixture, {
        filter: ['0.0.8.*']
      })

      params.ips.should.eql(['0.0.8.1', '0.0.8.2'])
      params.for.should.eql({
        '0.0.8.1': '8000',
        '0.0.8.2': '8000'
      })

      done()
    })

    it('should parse list only approved IPv6 addresses', function (done) {
      fixture.headers['forwarded'] = 'for=0.0.8.1, for=private, for=0.0.8.2, for=1::8'

      var params = forwarded(fixture, {
        filter: ['1::*']
      })

      params.ips.should.eql(['1::8'])
      params.for.should.eql({
        '1::8': '8000'
      })

      done()
    })

    it('should list only public addresses', function (done) {
      fixture.headers['forwarded'] = 'for=127.0.0.1, for=0.0.8.1, for=1::8'

      var params = forwarded(fixture, {
        allowPrivate: false
      })

      params.ips.should.eql(['0.0.0.0', '0.0.8.1', '1::8'])
      params.for.should.eql({
        '1::8': '8000',
        '0.0.0.0': '8000',
        '0.0.8.1': '8000'
      })

      done()
    })
  })
})
