'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Movimiento extends Model {
    cuentahabiente(){
        return this.belongsTo('App/Models/Cuentahabiente')
    }
}

module.exports = Movimiento
