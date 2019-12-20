const config = require('lib/config')

require('lib/frontend/admin/boot/routes')(config.multiForum)
require('lib/frontend/settings/boot/routes')(config.multiForum)
require('lib/frontend/site/boot/routes')(config.multiForum)
