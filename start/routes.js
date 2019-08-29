'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', () => {
  return { greeting: 'Hello world in JSON' }
})

//Ruta para pruebas
Route.post('/pruebas', 'BancaController.pruebas');

//Rutas Funcionando
//Trae al usuario actual via token
Route.get('/actual', 'BancaController.cuentahabiente'); 
Route.post('/registrar', 'BancaController.registrar');
Route.post('/login', 'BancaController.login');
Route.post('/pagos', 'BancaController.pagos');
Route.get('/movimientos', 'BancaController.movimientos');
Route.get('checkLogin', 'BancaController.check');
Route.get('/checkAdmin', 'BancaController.administrador');

//Android
Route.post('/loginAndroid', 'BancaController.loginAndroid');
Route.post('/movimientosAndroid', 'BancaController.movimientosAndroid');