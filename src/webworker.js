var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var _this = this;
var continuar;
// este evento se ejecuta cuando se recibe un mensaje desde el hilo principal
addEventListener('message', function (event) { return __awaiter(_this, void 0, void 0, function () {
    var data, procesos, particionesEjecutadas, politica;
    return __generator(this, function (_a) {
        data = event.data;
        // si el mensaje es para detener el proceso, se detiene
        if (!data.continuar) {
            continuar = data.continuar;
            return [2 /*return*/];
        }
        // si el mensaje es para continuar el proceso, se continua
        continuar = data.continuar;
        procesos = event.data.procesos;
        particionesEjecutadas = event.data.particionesEjecutadas;
        politica = event.data.politica;
        //Se ejecuta la funcion de modificar datos
        modificarDatos(procesos, particionesEjecutadas, politica);
        return [2 /*return*/];
    });
}); });
//Esta clase es la encargada de manejar la memoria
var managerDeMemoria = /** @class */ (function () {
    function managerDeMemoria(particiones, procesos) {
        this.particiones = particiones;
        this.procesos = procesos;
    }
    //Esta funcion asigna un proceso a una particion de memoria utilizando primer ajuste
    managerDeMemoria.prototype.asignarProcesoPrimerAjuste = function (proceso) {
        //Si el proceso ya esta terminado no se hace nada
        if (proceso.estado === 'terminado')
            return proceso;
        //Si el proceso ya esta en memoria no se hace nada
        if (proceso.estado === 'en memoria')
            return proceso;
        // Se recorre el lista de particiones
        for (var i = 0; i < this.particiones.length; i++) {
            // Si la particion esta libre y tiene suficiente memoria para el proceso
            // se asigna el proceso a la particion
            if (this.particiones[i].Libre &&
                this.particiones[i].MemoriaDeParticion >= proceso.memoria) {
                proceso.estado = 'en memoria';
                this.particiones[i].Libre = false;
                this.particiones[i].Proceso = proceso.nombre;
                this.particiones[i].UtilizacionPorcentaje =
                    (proceso.memoria / this.particiones[i].MemoriaDeParticion) * 100;
                return proceso;
            }
        }
        return proceso;
    };
    //Esta funcion asigna un proceso a una particion de memoria utilizando mejor ajuste
    managerDeMemoria.prototype.asignarProcesoMejorAjuste = function (proceso) {
        if (proceso.estado === 'terminado')
            return proceso;
        if (proceso.estado === 'en memoria')
            return proceso;
        //Se inicializa el indice de la mejor particion en -1
        var indiceMejorParticion = -1;
        //Se inicializa la diferencia en el maximo valor posible de un numero en javascript 
        var menorDiferencia = Number.MAX_VALUE;
        //Se recorre la lista de particiones
        for (var i = 0; i < this.particiones.length; i++) {
            if (this.particiones[i].Libre &&
                this.particiones[i].MemoriaDeParticion >= proceso.memoria) {
                //Se calcula la diferencia entre la memoria de la particion y la memoria del proceso
                var diferencia = this.particiones[i].MemoriaDeParticion - proceso.memoria;
                //Si la diferencia es menor a la menor diferencia se actualiza la menor diferencia y el indice de la mejor particion
                if (diferencia < menorDiferencia) {
                    menorDiferencia = diferencia;
                    indiceMejorParticion = i;
                }
            }
        }
        //Si se encontro una particion se asigna el proceso a la particion
        if (indiceMejorParticion !== -1) {
            proceso.estado = 'en memoria';
            this.particiones[indiceMejorParticion].Libre = false;
            this.particiones[indiceMejorParticion].Proceso = proceso.nombre;
            this.particiones[indiceMejorParticion].UtilizacionPorcentaje =
                (proceso.memoria /
                    this.particiones[indiceMejorParticion].MemoriaDeParticion) *
                    100;
        }
        return proceso;
    };
    //Esta funcion libera un proceso de la memoria
    managerDeMemoria.prototype.liberarProceso = function (proceso) {
        return __awaiter(this, void 0, void 0, function () {
            var i, tiempoInicial, tiempoFinal, tiempoTotalEnSistema;
            return __generator(this, function (_a) {
                if (proceso.estado === 'terminado')
                    return [2 /*return*/, proceso];
                //Se recorre la lista de particiones
                for (i = 0; i < this.particiones.length; i++) {
                    //Si la particion tiene el proceso se libera la particion
                    if (this.particiones[i].Proceso === proceso.nombre) {
                        tiempoInicial = proceso.tiempoCreacion;
                        tiempoFinal = new Date();
                        proceso.tiempoFinalizacion = tiempoFinal;
                        tiempoTotalEnSistema = tiempoFinal.getTime() - tiempoInicial.getTime();
                        proceso.tiempoTotalEnSistema = tiempoTotalEnSistema / 1000;
                        this.particiones[i].Libre = true;
                        this.particiones[i].Proceso = '';
                        this.particiones[i].UtilizacionPorcentaje = 0;
                        proceso.estado = 'terminado';
                        return [2 /*return*/, proceso];
                    }
                }
                return [2 /*return*/, proceso];
            });
        });
    };
    //Esta funcion retorna los datos de la del estado de la simulacion actualmente
    managerDeMemoria.prototype.getData = function () {
        return {
            particiones: this.particiones,
            procesos: this.procesos,
        };
    };
    return managerDeMemoria;
}());
//Esta funcion corre un loop que se ejecuta cada segundo
//La unica razon por la cual es asincrona es porque requere de un await para esperar a que pase el tiempo para la simulacion y pueda seguir con el siguiente loop
//es asincronaa para permitir que el hilo principal pueda enviar mensajes al web worker mientras se ejecuta el loop
function modificarDatos(procesos, particionesEjecutadas, politica) {
    return __awaiter(this, void 0, void 0, function () {
        var manager;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manager = new managerDeMemoria(particionesEjecutadas, procesos);
                    _a.label = 1;
                case 1:
                    //Se recorre la lista de procesos
                    manager.procesos.forEach(function (proceso) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    //Si el proceso esta terminado no se hace nada
                                    if (proceso.estado === 'terminado')
                                        return [2 /*return*/];
                                    //Si el proceso esta en espera de memoria se asigna a una particion de memoria
                                    // llamando a la funcion de asignar proceso
                                    // dependiendo de la politica de asignacion de memoria
                                    if (proceso.estado === 'en espera de memoria') {
                                        if (politica === 'MejorAjuste') {
                                            proceso = manager.asignarProcesoMejorAjuste(proceso);
                                        }
                                        else {
                                            proceso = manager.asignarProcesoPrimerAjuste(proceso);
                                        }
                                    }
                                    if (!(proceso.estado === 'en memoria')) return [3 /*break*/, 3];
                                    if (!(proceso.transcurrido >= proceso.duracion)) return [3 /*break*/, 2];
                                    return [4 /*yield*/, manager.liberarProceso(proceso)];
                                case 1:
                                    proceso = _a.sent();
                                    return [2 /*return*/];
                                case 2:
                                    proceso.transcurrido++;
                                    _a.label = 3;
                                case 3:
                                    proceso.tiempoTotalEnSistema = (new Date().getTime() - proceso.tiempoCreacion.getTime()) / 1000;
                                    return [2 /*return*/];
                            }
                        });
                    }); });
                    //Se envian los datos al hilo principal
                    //self.postMessage es la funcion que se utiliza para enviar mensajes al hilo principal
                    // self hace referencia al objeto de worker que esta utilizando este archivo
                    self.postMessage(manager.getData());
                    //Se espera un segundo para continuar con el loop
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 1000); })];
                case 2:
                    //Se espera un segundo para continuar con el loop
                    _a.sent();
                    //Se revisa si todos los procesos estan terminados, si es asi se detiene el loop
                    if (manager.procesos.every(function (proceso) { return proceso.estado === 'terminado'; }))
                        return [3 /*break*/, 4];
                    _a.label = 3;
                case 3:
                    if (continuar) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4: return [2 /*return*/];
            }
        });
    });
}
