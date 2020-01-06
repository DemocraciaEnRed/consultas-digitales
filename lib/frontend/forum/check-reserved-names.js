import config from 'lib/config/config'

export default function checkReservedNames (reservedNames, name) {
  if (!config.multiForum) return true
  if (!~reservedNames.indexOf(name)) return true
  return false
}
