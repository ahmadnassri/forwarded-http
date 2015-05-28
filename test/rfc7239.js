/* global describe, it */

'use strict'

var rfc7239 = require('../lib/rfc7239')

require('should')

describe('RFC7239 Util', function () {
  it('Forwarded: for="_gazonk"', function (done) {
    var result = rfc7239('for="_gazonk"')

    result.for.should.eql('_gazonk')

    done()
  })

  it('Forwarded: For="[2001:db8:cafe::17]:4711"', function (done) {
    var result = rfc7239('For="[2001:db8:cafe::17]:4711"')

    result.for.should.eql('[2001:db8:cafe::17]:4711')

    done()
  })

  it('Forwarded: for=192.0.2.60;proto=http;by=203.0.113.43', function (done) {
    var result = rfc7239('for=192.0.2.60;proto=http;by=203.0.113.43')

    result.for.should.eql('192.0.2.60')
    result.proto.should.eql('http')
    result.by.should.eql('203.0.113.43')

    done()
  })

  it('Forwarded: for=192.0.2.43, for=198.51.100.17', function (done) {
    var result = rfc7239('for=192.0.2.43, for=198.51.100.17')

    result.for.should.eql(['192.0.2.43', '198.51.100.17'])

    done()
  })

  it('Forwarded: INVALID', function (done) {
    var result = rfc7239('INVALID')

    result.should.eql({})

    done()
  })
})
