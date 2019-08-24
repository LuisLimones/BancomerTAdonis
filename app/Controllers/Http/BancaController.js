'use strict'
const Cuentahabiente = use('App/Models/Cuentahabiente');
const Movimiento = use('App/Models/Movimiento');
const Database = use('Database');

class BancaController {

    async pruebas({request, response, auth}){
        let numero1 = parseFloat(request.input('numero1'));
        let ca = await Cuentahabiente.findBy('tarjeta', '7918');
        let numero2 = parseFloat(ca.fondos);
        let numero3 = numero1+numero2;
        return response.json(numero3);
    }

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
                return response.json(mov);
            }
            else{
                return response.json({'fondos': "Fondos Insificientes"})
            }
        } catch (error) {
            return response.json(error)
        }
    }

    async cuentahabiente({response, auth}){
        try {
            return await auth.getUser();
        } catch (error) {
            return response.json(error);
        }
    }

    async movimientos({response, auth}){
        try {
            let ca = await auth.getUser();
            let movimientos = await Database
            .raw('select m.id, m.concepto, c.nombre as abonante, d.nombre as receptor, m.tipo, m.cantidad,'+
            ' m.created_at from movimientos as m join cuentahabientes as c on m.abonante = c.id'+
            ' join cuentahabientes as d on m.receptor = d.id where c.nombre = ? or d.nombre= ?', 
            [ca.nombre, ca.nombre]);
            return response.json(movimientos.rows);
            
        } catch (error) {
            return response.json(error);
        }
    }
}

module.exports = BancaController
