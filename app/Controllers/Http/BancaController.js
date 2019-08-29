'use strict'
const Cuentahabiente = use('App/Models/Cuentahabiente');
const Movimiento = use('App/Models/Movimiento');
const Database = use('Database');
const Hash = use('Hash');

class BancaController {

    //Pruebas de controlador
    async pruebas({request, response, auth}){
        let numero1 = parseFloat(request.input('numero1'));
        let ca = await Cuentahabiente.findBy('tarjeta', '7918');
        let numero2 = parseFloat(ca.fondos);
        let numero3 = numero1+numero2;
        return response.json(numero3);
    }

    //Registrar Cuentahabiente
    async registrar({request, response}){
        try {
            const CA = new Cuentahabiente();
            let cadena="";
            for (let index = 0; index < 4; index++) {
                let numero = Math.floor(Math.random() * 10) + 1;
                if(numero==10){
                    numero=numero-9;
                    cadena+=numero;
                }
                else{
                    cadena+=numero;
                }
            }
            CA.tarjeta=cadena;
            CA.password=request.input('password');
            CA.tipo="Usuario";
            CA.nombre=request.input('nombre');
            CA.calle=request.input('calle');
            CA.colonia=request.input('colonia');
            CA.numero=request.input('numero');
            CA.fondos=request.input('fondos');
            await CA.save();
            return response.json(CA);
            
        } catch (error) {
            return response.json(error);
        }
    }

    //Login
    async login({request, response, auth}){
        try {
            const tarjeta=request.input('tarjeta');
            const password=request.input('password');
            let token = await auth.attempt(tarjeta, password);
            return response.json(token);
        } catch (error) {
            return response.json(error);
        }
    }

    //Registro y actualizaciones correspondientes de pagos y movimientos
    async pagos({request, response, auth}){
        try {
            const mov = new Movimiento();
            let ca1 = await auth.getUser();
            let tipo = request.input('tipo');
            let receptor = request.input('receptor');
            let cantidad = parseFloat(request.input('cantidad'));
            let concepto = request.input('concepto');
            let ca2 = await Cuentahabiente.findBy('tarjeta', receptor);
            if(parseFloat(ca1.fondos)>cantidad){
                mov.concepto = concepto;
                mov.abonante = ca1.id;
                mov.receptor = ca2.id;
                mov.tipo = tipo;
                mov.cantidad = cantidad;
                await mov.save();
                let fondos1=parseFloat(ca1.fondos)-cantidad;
                await Cuentahabiente.query().where('tarjeta', ca1.tarjeta).update({fondos: fondos1});
                let fondos2=parseFloat(ca2.fondos)+cantidad;
                await Cuentahabiente.query().where('tarjeta', ca2.tarjeta).update({fondos: fondos2});
                let movimientos = await Database
                                .raw('select m.id, m.concepto, c.nombre as abonante, d.nombre as receptor, m.tipo, m.cantidad,'+
                                ' m.created_at from movimientos as m join cuentahabientes as c on m.abonante = c.id'+
                                ' join cuentahabientes as d on m.receptor = d.id where c.nombre = ? or d.nombre= ? order by m.id DESC', 
                                [ca2.nombre, ca2.nombre]);
            return response.json(movimientos.rows);
            }
            else{
                return response.json({'fondos': "Fondos Insificientes"})
            }
        } catch (error) {
            return response.json(error)
        }
    }

    //Obtiene el Cuentahabiente actual por medio de Auth (jwt)
    async cuentahabiente({response, auth}){
        try {
            return await auth.getUser();
        } catch (error) {
            return response.json(error);
        }
    }

    //Obtiene los Movimientos del Cuentahabiente logeado
    async movimientos({response, auth}){
        try {
            let ca = await auth.getUser();
            let movimientos = await Database
            .raw('select m.id, m.concepto, c.nombre as abonante, d.nombre as receptor, m.tipo, m.cantidad,'+
            ' m.created_at from movimientos as m join cuentahabientes as c on m.abonante = c.id'+
            ' join cuentahabientes as d on m.receptor = d.id where c.nombre = ? or d.nombre= ? order by m.id DESC', 
            [ca.nombre, ca.nombre]);
            return response.json(movimientos.rows);
            
        } catch (error) {
            return response.json(error);
        }
    }
    
    async check({response, auth}){
        try {
            let ca = await auth.getUser();
            if(ca.id>0){
                return response.json({respuesta: "true"});
            }
            else {return response.json({respuest: "false"})};
        } catch (error) {
            return response.json({respuest: "false"});
        }
    }

    //Verifica Permiso De Administrador Para Registro
    async administrador({response, auth}){
        try {
            let ca = await auth.getUser();
            if(ca.tipo =="Admin"){
                return response.json({respuesta: "true"});
            }
            else{ return response.json({respuesta: "false"}); }
        } catch (error) {
            return response.json({respuesta: "false"});
        }
    }

    async loginAndroid({request, response, auth}){
        try {
            let tarjeta = request.input('tarjeta');
            let password = request.input('password');
            const ca = await auth.attempt(tarjeta, password);
            if(ca.token){
                return true;
            }
            else{
                return false;
            }
        } catch (error) {
            return response.json(error)
        }
    }

    async movimientosAndroid({request, response}){
        try {
            const ca = await Cuentahabiente.findBy('tarjeta', request.input('tarjeta'));
            let movimientos = await Database
            .raw('select m.id, m.concepto, c.nombre as abonante, d.nombre as receptor, m.tipo, m.cantidad,'+
            ' m.created_at from movimientos as m join cuentahabientes as c on m.abonante = c.id'+
            ' join cuentahabientes as d on m.receptor = d.id where c.nombre = ? or d.nombre= ? order by m.id DESC', 
            [ca.nombre, ca.nombre]);
            return response.json(movimientos.rows);
        } catch (error) {
            return response.json(error);
        }
    }
}

module.exports = BancaController
