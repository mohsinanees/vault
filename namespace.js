
const { createHash } = require('crypto')

const VAULT_FAMILY = 'vault'
const VERSION = '0.9.1'
const _hash = (x) =>
  createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)

const VAULT_NAMESPACE = _hash(VAULT_FAMILY).substring(20, 26)

const _genVaultAddress = (x) => VAULT_NAMESPACE + _hash(x)

module.exports = {
  VAULT_FAMILY,
  VERSION,
  VAULT_NAMESPACE,
  _genVaultAddress
};
