const OP = {};

exports.install = function() {
	ROUTE('/dbms/{db}/', action, ['post']);
};

function action(db) {
	var self = this;
	var db = MAIN.meta.items.findItem('name', db);
	db.send(self.body);
}