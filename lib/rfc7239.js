'use strict'

module.exports = function (str) {
  var forwarded = {}

  str.split(/ *; */).forEach(function (element) {
    element.split(/ *, */).forEach(function (part) {

      var pair = part.split('=')

      var name = pair[0].toLowerCase()
      var value = pair[1]

      if (value) {
        value = value.replace(/"/g, '')

        switch (typeof forwarded[name]) {
          case 'undefined':
            forwarded[name] = value
            break

          // convert to array
          case 'string':
            forwarded[name] = [forwarded[name], value]
            break

          case 'object':
            forwarded[name].push(value)
            break
        }
      }
    })
  })

  if (typeof forwarded.for === 'string') {
    forwarded.for = [forwarded.for]
  }

  return forwarded
}
