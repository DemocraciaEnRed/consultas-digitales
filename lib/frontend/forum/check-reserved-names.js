import config from 'lib/config/config'
import reservedNames from 'lib/backend/models/forum/reserved-names'

export default function checkReservedNames (reservedNames, name) {
  if (!config.multiForum) return true
  if (!~reservedNames.indexOf(name)) return true
  return false
}
