'use strict'
const Cuentahabiente = use('App/Models/Cuentahabiente');

class BancaController {

    async pruebas(response){
        try{
            let cadena = "";
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
            return cadena;
        }
        catch(error){
            return response.json(error);
        }
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

}

module.exports = BancaController
