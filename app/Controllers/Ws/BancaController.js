'use strict'

class BancaController {
  constructor ({ socket, request }) {
    this.socket = socket
    this.request = request
  }

  onNotificacion(movimientos){
    this.socket.broadcast("notificaciones", movimientos);
  }

  onActualizar(movimientos){
    console.log('Llega Actualizar Socket');
    this.socket.broadcast("movimientos", movimientos);
  }
}

module.exports = BancaController
