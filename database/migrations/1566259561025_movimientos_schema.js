'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MovimientosSchema extends Schema {
  up () {
    this.create('movimientos', (table) => {
      table.increments()
      table.string('concepto', '100').nullable()
      table.integer('abonante').references('id').inTable('cuentahabientes')
      table.integer('receptor').references('id').inTable('cuentahabientes')
      table.string('tipo', 30).notNullable()
      table.float('cantidad', 8, 2).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('movimientos')
  }
}

module.exports = MovimientosSchema
