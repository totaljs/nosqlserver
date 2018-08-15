const Fs = require('fs');
const MAIN = global.MAIN = {};
const Child = require('child_process');
const HEADERS = { cwd: '' };

try {
	MAIN.meta = Fs.readFileSync(F.path.databases('databases.json')).toString('utf8').parseJSON(true);
	MAIN.meta.items.wait(function(item, next) {
		MAIN.restart(item.name);
		setTimeout(next, 200);
	});
} catch (e) {
	MAIN.meta = { items: [] };
}

MAIN.restart = function(name) {
	var items = MAIN.meta.items;
	var item = items.findItem('name', name);
	if (item !== null) {
		if (item.process)
			item.process.kill('SIGKILL');
		else {
			item.running = new Date();
			item.process = Child.fork(F.path.root('dbms/{0}/index.js'.format(name)), EMPTYARRAY, HEADERS);
			item.process.on('exit', function() {
				EMIT('db.close', name);
				item.process = null;
				item.running = null;
				LOGGER('db', 'db.close', name);
				!F.isKilled && !item.removed && MAIN.restart(name);
			});
			LOGGER('db', 'db.open', name);
			EMIT('db.open', name);
		}
	}
};

MAIN.save = function() {

	var meta = {};
	var items = MAIN.meta.items;

	meta.version = F.config.version;
	meta.items = [];

	for (var i = 0; i < items.length; i++) {

		var item = items[i];
		if (item.removed)
			continue;

		var keys = Object.keys(item);
		var obj = {};

		for (var j = 0; j < keys.length; j++) {
			var key = keys[j];
			if (key !== 'process')
				obj[key] = item[key];
		}

		obj.running = undefined;
		meta.items.push(obj);
	}

	Fs.writeFile(F.path.databases('databases.json'), JSON.stringify(meta), ERROR('MAIN.save()'));
};