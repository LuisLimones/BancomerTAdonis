'use strict'

const BaseModel = use('MongooseModel')

/**
 * @class pruebasMongo
 */
class pruebasMongo extends BaseModel {
  static boot ({ schema }) {
    // Hooks:
    // this.addHook('preSave', () => {})
    // this.addHook('preSave', 'pruebasMongoHook.method')
    // Indexes:
    // this.index({}, {background: true})
  }
  /**
   * pruebasMongo's schema
   */
  static get schema () {
    return {
      title:  String,
      author: String,
      body:   String

    }
  }
}

module.exports = pruebasMongo.buildModel('pruebasMongo')
