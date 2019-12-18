import config from 'lib/config/config'
import reservedNames from '../models/forum/reserved-names'

export default function checkReservedNames (name) {
  if (!config.multiForum) return
  if (!~reservedNames.indexOf(name)) return
  window.location.reload(false)
}
