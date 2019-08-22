'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/** @type {import('@adonisjs/framework/src/Hash')} */
const Hash = use('Hash')

class Cuentahabiente extends Model {

    static boot(){
        super.boot()
        this.addHook('beforeSave', async (cuentahabienteInstance) =>{
            if(cuentahabienteInstance.password){
                cuentahabienteInstance.password=await Hash.make(cuentahabienteInstance.password)
            }
        })
    }

    movimiento(){
        return this.hasMany('App/Models/Movimiento')
    }
}

module.exports = Cuentahabiente
