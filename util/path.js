const path = require('path')

// module.exports = path.dirname(process.mainModule);
module.exports = path.dirname(require.main.filename);