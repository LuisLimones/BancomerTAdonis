'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class Conversaciones
 */
class Conversaciones extends BaseModel {
  /**
   * conversaciones's schema
   */
  static get schema () {
    return {
      id_chat: Number,
      usuarios: {},
      mensajes: [{emisor: String, msj: String, estado: Number, tipo: Number}]
    }
  }
}

module.exports = Conversaciones.buildModel('Conversaciones')
