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
addEventListener('message', function (event) { return __awaiter(_this, void 0, void 0, function () {
    var data, _a, procesos, particionesEjecutadas, politica;
    return __generator(this, function (_b) {
        data = event.data;
        if (!data.continuar) {
            continuar = data.continuar;
            return [2 /*return*/];
        }
        continuar = data.continuar;
        _a = event.data, procesos = _a.procesos, particionesEjecutadas = _a.particionesEjecutadas, politica = _a.politica;
        modificarDatos(procesos, particionesEjecutadas, politica);
        return [2 /*return*/];
    });
}); });
function modificarDatos(procesos, particionesEjecutadas, politica) {
    return __awaiter(this, void 0, void 0, function () {
        var manager;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    manager = new managerDeMemoria(particionesEjecutadas, procesos);
                    _a.label = 1;
                case 1:
                    manager.procesos.forEach(function (proceso) {
                        if (proceso.estado === 'terminado')
                            return;
                        if (proceso.estado === 'en espera de memoria') {
                            if (politica === 'MejorAjuste') {
                                proceso = manager.asignarProcesoMejorAjuste(proceso);
                            }
                            else {
                                proceso = manager.asignarProcesoPrimerAjuste(proceso);
                            }
                        }
                        if (proceso.estado === 'en memoria') {
                            if (proceso.transcurrido >= proceso.duracion) {
                                proceso = manager.liberarProceso(proceso);
                                return;
                            }
                            proceso.transcurrido++;
                        }
                        proceso.tiempoTotalEnSistema++;
                    });
                    self.postMessage(manager.getData());
                    return [4 /*yield*/, new Promise(function (resolve) { return setTimeout(resolve, 4000); })];
                case 2:
                    _a.sent();
                    if (manager.procesos.every(function (proceso) { return proceso.estado === 'terminado'; }))
                        return [3 /*break*/, 4];
                    _a.label = 3;
                case 3:
                    if (continuar) return [3 /*break*/, 1];
                    _a.label = 4;
                case 4:
                    console.log('loop terminado');
                    return [2 /*return*/];
            }
        });
    });
}
var managerDeMemoria = /** @class */ (function () {
    function managerDeMemoria(particiones, procesos) {
        this.particiones = particiones;
        this.procesos = procesos;
    }
    managerDeMemoria.prototype.asignarProcesoPrimerAjuste = function (proceso) {
        if (proceso.estado === 'terminado')
            return proceso;
        if (proceso.estado === 'en memoria')
            return proceso;
        for (var i = 0; i < this.particiones.length; i++) {
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
    managerDeMemoria.prototype.asignarProcesoMejorAjuste = function (proceso) {
        if (proceso.estado === 'terminado')
            return proceso;
        if (proceso.estado === 'en memoria')
            return proceso;
        var indiceMejorParticion = -1;
        var menorDiferencia = Number.MAX_VALUE;
        for (var i = 0; i < this.particiones.length; i++) {
            if (this.particiones[i].Libre &&
                this.particiones[i].MemoriaDeParticion >= proceso.memoria) {
                var diferencia = this.particiones[i].MemoriaDeParticion - proceso.memoria;
                if (diferencia < menorDiferencia) {
                    menorDiferencia = diferencia;
                    indiceMejorParticion = i;
                }
            }
        }
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
    managerDeMemoria.prototype.liberarProceso = function (proceso) {
        if (proceso.estado === 'terminado')
            return proceso;
        for (var i = 0; i < this.particiones.length; i++) {
            if (this.particiones[i].Proceso === proceso.nombre) {
                var tiempoInicial = proceso.tiempoCreacion;
                var tiempoFinal = new Date();
                this.procesos[i].tiempoFinalizacion = tiempoFinal;
                console.log(this.procesos[i].tiempoFinalizacion);
                var tiempoTotalEnSistema = tiempoFinal.getTime() - tiempoInicial.getTime();
                this.procesos[i].tiempoTotalEnSistema = tiempoTotalEnSistema;
                this.particiones[i].Libre = true;
                this.particiones[i].Proceso = '';
                this.particiones[i].UtilizacionPorcentaje = 0;
                proceso.estado = 'terminado';
            }
        }
        return proceso;
    };
    managerDeMemoria.prototype.getData = function () {
        return {
            particiones: this.particiones,
            procesos: this.procesos,
        };
    };
    return managerDeMemoria;
}());
