const Fs = require('fs');

NEWSCHEMA('Database', function(schema) {

	schema.define('name', 'String', true);
	schema.define('token', 'String', true);
	schema.define('port', Number, true);

	schema.setSave(function($) {
		var model = $.model;
		var path = F.path.root('dbms/' + model.name + '/');
		F.path.mkdir(path);
		Fs.writeFile(path + 'index.js', Fs.readFileSync('child.js').toString('utf8').format(model.name, model.token, model.port), ERROR('Database.save()'));
		$.success();
	});

	var obj = schema.create();
	obj.name = 'marketplace';
	obj.token = '123456';
	obj.port = 9000;
	obj.$save(console.log);
});