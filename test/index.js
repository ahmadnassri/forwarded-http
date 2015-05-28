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
    var result

    /*eslint-disable no-wrap-func */
    (function () {
      result = forwarded({})
    }).should.throw('a request of type: "http.IncomingMessage" is required')

    should.not.exist(result)

    done()
  })

  describe('incomingMessage', function () {
    it('should detect default values', function (done) {
      var result = forwarded(fixture)

      result.port.should.equal('8000')
      result.ports.should.eql(['8000'])
      result.ips.should.eql(['0.0.0.0'])
      result.for.should.eql({'0.0.0.0': '8000'})
      result.proto.should.eql('http')
      should.not.exist(result.host)

      done()
    })

    it('should assign protocol to https', function (done) {
      fixture.connection.encrypted = true
      var result = forwarded(fixture)

      result.proto.should.equal('https')

      done()
    })

    it('should assign default host', function (done) {
      fixture.headers.host = 'foo.com'

      var result = forwarded(fixture)

      result.host.should.equal('foo.com')

      done()
    })
  })

  describe('x-forwarded-*', function () {
    it('should parse "x-forwarded-for"', function (done) {
      fixture.headers['x-forwarded-for'] = '0.0.1.1, 0.0.1.2'

      var result = forwarded(fixture)

      result.port.should.equal('8000')
      result.ports.should.eql(['8000'])
      result.ips.should.eql(['0.0.0.0', '0.0.1.1', '0.0.1.2'])
      result.for.should.eql({'0.0.0.0': '8000', '0.0.1.1': '8000', '0.0.1.2': '8000'})
      result.proto.should.eql('http')

      done()
    })

    it('should parse "x-forwarded-port"', function (done) {
      fixture.headers['x-forwarded-port'] = '8001'

      var result = forwarded(fixture)

      result.port.should.equal('8001')
      result.ports.should.eql(['8000', '8001'])
      result.ips.should.eql(['0.0.0.0'])
      result.for.should.eql({'0.0.0.0': '8001'})
      result.proto.should.eql('http')

      done()
    })

    it('should parse "x-forwarded-proto"', function (done) {
      fixture.headers['x-forwarded-proto'] = 'https'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })

    it('should parse "x-forwarded-protocol"', function (done) {
      fixture.headers['x-forwarded-protocol'] = 'https'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })

    it('should parse "x-forwarded-host"', function (done) {
      fixture.headers['x-forwarded-host'] = 'foo.com'

      var result = forwarded(fixture)

      result.host.should.eql('foo.com')

      done()
    })
  })

  describe('z-forwarded-*', function () {
    it('should parse "z-forwarded-for"', function (done) {
      fixture.headers['z-forwarded-for'] = '0.0.2.1, 0.0.2.2'

      var result = forwarded(fixture)

      result.port.should.equal('8000')
      result.ports.should.eql(['8000'])
      result.ips.should.eql(['0.0.0.0', '0.0.2.1', '0.0.2.2'])
      result.for.should.eql({'0.0.0.0': '8000', '0.0.2.1': '8000', '0.0.2.2': '8000'})
      result.proto.should.eql('http')

      done()
    })

    it('should parse "z-forwarded-port"', function (done) {
      fixture.headers['z-forwarded-port'] = '8002'

      var result = forwarded(fixture)

      result.port.should.equal('8002')
      result.ports.should.eql(['8000', '8002'])
      result.ips.should.eql(['0.0.0.0'])
      result.for.should.eql({'0.0.0.0': '8002'})
      result.proto.should.eql('http')

      done()
    })

    it('should parse "z-forwarded-proto"', function (done) {
      fixture.headers['z-forwarded-proto'] = 'https'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })

    it('should parse "z-forwarded-protocol"', function (done) {
      fixture.headers['z-forwarded-protocol'] = 'https'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })

    it('should parse "z-forwarded-host"', function (done) {
      fixture.headers['z-forwarded-host'] = 'foo.com'

      var result = forwarded(fixture)

      result.host.should.eql('foo.com')

      done()
    })
  })

  describe('fastly', function () {
    it('should parse "fastly-client-ip"', function (done) {
      fixture.headers['fastly-client-ip'] = '0.0.3.1, 0.0.3.2'

      var result = forwarded(fixture)

      result.port.should.equal('8000')
      result.ports.should.eql(['8000'])
      result.ips.should.eql(['0.0.0.0', '0.0.3.1', '0.0.3.2'])
      result.for.should.eql({'0.0.0.0': '8000', '0.0.3.1': '8000', '0.0.3.2': '8000'})
      result.proto.should.eql('http')

      done()
    })

    it('should parse "fastly-client-port"', function (done) {
      fixture.headers['fastly-client-port'] = '8003'

      var result = forwarded(fixture)

      result.port.should.equal('8003')
      result.ports.should.eql(['8000', '8003'])
      result.ips.should.eql(['0.0.0.0'])
      result.for.should.eql({'0.0.0.0': '8003'})
      result.proto.should.eql('http')

      done()
    })

    it('should parse "fastly-ssl: 1"', function (done) {
      fixture.headers['fastly-ssl'] = '1'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })

    it('should parse "fastly-ssl: true"', function (done) {
      fixture.headers['fastly-ssl'] = 'true'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })
  })

  describe('x-real-*', function () {
    it('should parse "x-real-ip"', function (done) {
      fixture.headers['x-real-ip'] = '0.0.4.1, 0.0.4.2'

      var result = forwarded(fixture)

      result.port.should.equal('8000')
      result.ports.should.eql(['8000'])
      result.ips.should.eql(['0.0.0.0', '0.0.4.1', '0.0.4.2'])
      result.for.should.eql({'0.0.0.0': '8000', '0.0.4.1': '8000', '0.0.4.2': '8000'})
      result.proto.should.eql('http')

      done()
    })

    it('should parse "x-real-port"', function (done) {
      fixture.headers['x-real-port'] = '8004'

      var result = forwarded(fixture)

      result.port.should.equal('8004')
      result.ports.should.eql(['8000', '8004'])
      result.ips.should.eql(['0.0.0.0'])
      result.for.should.eql({'0.0.0.0': '8004'})
      result.proto.should.eql('http')

      done()
    })

    it('should parse "x-real-proto"', function (done) {
      fixture.headers['x-real-proto'] = 'https'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })

    it('should parse "x-url-scheme"', function (done) {
      fixture.headers['x-url-scheme'] = 'https'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })
  })

  describe('x-cluster-client-ip', function () {
    it('should parse "x-cluster-client-ip"', function (done) {
      fixture.headers['x-cluster-client-ip'] = '0.0.5.1, 0.0.5.2'

      var result = forwarded(fixture)

      result.port.should.equal('8000')
      result.ports.should.eql(['8000'])
      result.ips.should.eql(['0.0.0.0', '0.0.5.1', '0.0.5.2'])
      result.for.should.eql({'0.0.0.0': '8000', '0.0.5.1': '8000', '0.0.5.2': '8000'})
      result.proto.should.eql('http')

      done()
    })
  })

  describe('cf-connecting-ip', function () {
    it('should parse "cf-connecting-ip"', function (done) {
      fixture.headers['cf-connecting-ip'] = '0.0.6.1, 0.0.6.2'

      var result = forwarded(fixture)

      result.port.should.equal('8000')
      result.ports.should.eql(['8000'])
      result.ips.should.eql(['0.0.0.0', '0.0.6.1', '0.0.6.2'])
      result.for.should.eql({'0.0.0.0': '8000', '0.0.6.1': '8000', '0.0.6.2': '8000'})
      result.proto.should.eql('http')

      done()
    })
  })

  describe('special headers', function () {
    it('should parse "front-end-https"', function (done) {
      fixture.headers['front-end-https'] = 'on'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })

    it('should parse "x-forwarded-ssl"', function (done) {
      fixture.headers['x-forwarded-ssl'] = 'on'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })

    it('should parse "cf-visitor"', function (done) {
      fixture.headers['cf-visitor'] = '{"scheme": "https"}'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })

    it('should not fail on a bad "cf-visitor"', function (done) {
      fixture.headers['cf-visitor'] = '{}'

      var result = forwarded(fixture)

      result.proto.should.eql('http')

      done()
    })

    it('should not fail on an invalid "cf-visitor"', function (done) {
      fixture.headers['cf-visitor'] = 'foo'

      var result = forwarded(fixture)

      result.proto.should.eql('http')

      done()
    })
  })

  describe('RFC7239', function () {
    it('should parse "Forwarded: for=0.0.7.1,For=0.0.7.2"', function (done) {
      fixture.headers['forwarded'] = 'for=0.0.7.1,For=0.0.7.2'

      var result = forwarded(fixture)

      result.port.should.equal('8000')
      result.ports.should.eql(['8000'])
      result.ips.should.eql(['0.0.0.0', '0.0.7.1', '0.0.7.2'])
      result.for.should.eql({'0.0.0.0': '8000', '0.0.7.1': '8000', '0.0.7.2': '8000'})

      done()
    })

    it('should parse "Forwarded: for=0.0.7.1:8007,For=0.0.7.2:8008,for=secret"', function (done) {
      fixture.headers['forwarded'] = 'for=0.0.7.1:8007,For=0.0.7.2:8008,for=secret'

      var result = forwarded(fixture)

      result.port.should.equal('8000')
      result.ports.should.eql(['8000', '8007', '8008'])
      result.ips.should.eql(['0.0.0.0', '0.0.7.1', '0.0.7.2', 'secret'])
      result.for.should.eql({'0.0.0.0': '8000', '0.0.7.1': '8007', '0.0.7.2': '8008', 'secret': '8000'})

      done()
    })

    it('should parse "Forwarded: proto=https"', function (done) {
      fixture.headers['forwarded'] = 'proto=https'

      var result = forwarded(fixture)

      result.proto.should.eql('https')

      done()
    })

    it('should parse "Forwarded: host=foo.com"', function (done) {
      fixture.headers['forwarded'] = 'host=foo.com'

      var result = forwarded(fixture)

      result.host.should.eql('foo.com')

      done()
    })

    it('should parse "Forwarded: by=1.0.0.0"', function (done) {
      fixture.headers['forwarded'] = 'by=1.0.0.0'

      var result = forwarded(fixture)

      result.by.should.eql('1.0.0.0')

      done()
    })
  })
})
