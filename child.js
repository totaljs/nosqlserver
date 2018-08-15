global.MAINTOKEN = '{1}';
const options = {};
options.port = {2};
require('total.js').http('release', options);

ROUTE('/{0}/{db}/{op}/', function(name, op) {
	var self = this;
	self.success(true);
}, ['post'], 1024 * 5); // Max. 5 MB

process.on('message', function(msg) {
	if (msg && msg.TYPE === 'token')
		global.MAINTOKEN = msg.value;
});