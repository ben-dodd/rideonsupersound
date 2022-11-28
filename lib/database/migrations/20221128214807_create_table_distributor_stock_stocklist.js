exports.up = function(knex, Promise) {
	return knex.schema.createTable('distributor_stock_stocklist', function (table) {
		table.integer('distributor_stocklist_id', 11).notNullable();
		table.integer('distributor_stock_id', 11).notNullable();
	});
};

exports.down = function (knex, Promise) {
	return knex.schema.dropTable('distributor_stock_stocklist');
};
