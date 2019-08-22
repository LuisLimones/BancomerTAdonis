'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CuentahabientesSchema extends Schema {
  up () {
    this.create('cuentahabientes', (table) => {
      table.increments()
      table.string('tarjeta', 255).notNullable().unique()
      table.string('password', 255).notNullable()
      table.string('tipo', 11).notNullable()
      table.string('nombre', 255).notNullable()
      table.string('calle', 100).notNullable()
      table.string('colonia', 100).notNullable()
      table.string('numero', 20).notNullable()
      table.float('fondos', 8, 2).notNullable()
      table.timestamps()
    })
  }

  down () {
    this.drop('cuentahabientes')
  }
}

module.exports = CuentahabientesSchema
