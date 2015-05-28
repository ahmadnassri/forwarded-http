# Forwarded HTTP [![version][npm-version]][npm-url] [![License][npm-license]][license-url]

Resolves [RFC 7239](https://tools.ietf.org/html/rfc7239) *(Forwarded HTTP Extension)*, with fallback to all legacy & special Forward headers: `X-Forwarded-*`, `X-Real-*`, `Fastly-Client-IP`, `X-Cluster-Client-IP`, and others.

Focuses on resolving to the RFC standard and providing a consistent access to HTTP Forwarded Parameters: `by`, `for`, `host`, `proto`.

[![Build Status][travis-image]][travis-url]
[![Downloads][npm-downloads]][npm-url]
[![Code Climate][codeclimate-quality]][codeclimate-url]
[![Coverage Status][codeclimate-coverage]][codeclimate-url]
[![Dependencies][david-image]][david-url]

## Install

```sh
npm install --save forwarded-http
```

## API

### forwarded(http.IncomingMessage[, options])

```js
var forwarded = require('forwarded-http')

var params = forwarded(req)

// filter IP ranges
var filteredParams = forwarded(req, {
  filter: ['1.0.?.*', '2001:db8:*']
})
```

### `.port`

The final proxied port before hitting this server

```js
var params = forwarded(req)

params.port // '8000'
```

### `.for`

Oject with IPs as key with matching port used as value (if applicable) 

```js
var params = forwarded(req)

params.for // { '0.0.0.1': '8000', '0.0.0.2': '8001' }
```

### `.proto`

The final proxied protocol before hitting this server

```js
var params = forwarded(req)

params.proto // 'https'
```

### `.host`

The proxied host

```js
var params = forwarded(req)

arams.host // 'foo.com'
```

### `.ports`

Array of ports the client is connected through

```js
var params = forwarded(req)

params.ports // ['8000', '8001']
```

### `.ips`

Array of IP addresses the client is connected through

```js
var params = forwarded(req)

params.ips // ['0.0.0.1', '0.0.0.2']
```

## Support

Donations are welcome to help support the continuous development of this project.

[![Gratipay][gratipay-image]][gratipay-url]
[![PayPal][paypal-image]][paypal-url]
[![Flattr][flattr-image]][flattr-url]
[![Bitcoin][bitcoin-image]][bitcoin-url]

## License

[MIT](LICENSE) &copy; [Ahmad Nassri](https://www.ahmadnassri.com)

[license-url]: https://github.com/ahmadnassri/forwarded-http/blob/master/LICENSE

[travis-url]: https://travis-ci.org/ahmadnassri/forwarded-http
[travis-image]: https://img.shields.io/travis/ahmadnassri/forwarded-http.svg?style=flat-square

[npm-url]: https://www.npmjs.com/package/forwarded-http
[npm-license]: https://img.shields.io/npm/l/forwarded-http.svg?style=flat-square
[npm-version]: https://img.shields.io/npm/v/forwarded-http.svg?style=flat-square
[npm-downloads]: https://img.shields.io/npm/dm/forwarded-http.svg?style=flat-square

[codeclimate-url]: https://codeclimate.com/github/ahmadnassri/forwarded-http
[codeclimate-quality]: https://img.shields.io/codeclimate/github/ahmadnassri/forwarded-http.svg?style=flat-square
[codeclimate-coverage]: https://img.shields.io/codeclimate/coverage/github/ahmadnassri/forwarded-http.svg?style=flat-square

[david-url]: https://david-dm.org/ahmadnassri/forwarded-http
[david-image]: https://img.shields.io/david/ahmadnassri/forwarded-http.svg?style=flat-square

[gratipay-url]: https://www.gratipay.com/ahmadnassri/
[gratipay-image]: https://img.shields.io/gratipay/ahmadnassri.svg?style=flat-square

[paypal-url]: https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=UJ2B2BTK9VLRS&on0=project&os0=forwarded-http
[paypal-image]: http://img.shields.io/badge/paypal-donate-green.svg?style=flat-square

[flattr-url]: https://flattr.com/submit/auto?user_id=ahmadnassri&url=https://github.com/ahmadnassri/forwarded-http&title=forwarded-http&language=&tags=github&category=software
[flattr-image]: http://img.shields.io/badge/flattr-donate-green.svg?style=flat-square

[bitcoin-image]: http://img.shields.io/badge/bitcoin-1Nb46sZRVG3or7pNaDjthcGJpWhvoPpCxy-green.svg?style=flat-square
[bitcoin-url]: https://www.coinbase.com/checkouts/ae383ae6bb931a2fa5ad11cec115191e?name=forwarded-http
