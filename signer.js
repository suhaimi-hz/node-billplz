'use strict';

/**
 * For more information about this process check the following link:
 * https://www.billplz.com/api#x_signature
 */

const _ = require('lodash')
const crypto = require('crypto')

function toPlainPairs (object, parentKey, result) {
  parentKey = parentKey || ''
  return _.reduce(object, (accum, value, key) => {
    if (_.isPlainObject(value)) {
      toPlainPairs(value, `${parentKey}${key}`, accum)
    } else if (_.isArray(value)) {
      _.each(value, item => {
        toPlainPairs(item, `${parentKey}${key}`, accum)
      })
    } else {
      accum.push({ key: `${parentKey}${key}`, value })
    }
    return accum
  }, result || [])
}


function serializeObject (object) {
  let plainPairs = toPlainPairs(payload)
  plainPairs = _.sortBy(plainPairs, item => {
    return item.key.toUpperCase()
  })

  return _.reduce(plainPairs, (result, item) => {
    const fieldStr = `${item.key}${item.value}`
    return result ? `${result}|${fieldStr}` : `${fieldStr}`
  }, '')
}

module.exports = function signObject (object, signatureKey) {
  const sourceString = serializeObject(object)

  return crypto.createHmac('sha256', signatureKey)
          .update(sourceString)
          .digest('hex')
}