type Estado = 'en memoria' | 'en espera de memoria' | 'terminado';

interface Proceso {
  id: number;
  nombre: string;
  memoria: number;
  estado: Estado;
  duracion: number;
  transcurrido: number;
  tiempoCreacion: Date;
  tiempoFinalizacion?: Date;
  tiempoTotalEnSistema: number;
}

interface ParticionEjecutada {
  id: number;
  MemoriaDeParticion: number;
  Proceso?: string;
  UtilizacionPorcentaje?: number;
  Libre?: boolean;
}

let continuar: boolean;

// este evento se ejecuta cuando se recibe un mensaje desde el hilo principal
addEventListener('message', async (event) => {
  const data = event.data;

  // si el mensaje es para detener el proceso, se detiene
  if (!data.continuar) {
    continuar = data.continuar;
    return;
  }

  // si el mensaje es para continuar el proceso, se continua
  continuar = data.continuar;


  // se obtienen los datos del mensaje
  const procesos: Proceso[] = event.data.procesos;
  
  const particionesEjecutadas: ParticionEjecutada[] = event.data.particionesEjecutadas;

  const politica: 'MejorAjuste' | 'PrimerAjuste' = event.data.politica;

 //Se ejecuta la funcion de modificar datos
  modificarDatos(procesos, particionesEjecutadas, politica);
});

//Esta clase es la encargada de manejar la memoria
class managerDeMemoria {
  particiones: ParticionEjecutada[];
  procesos: Proceso[];

  constructor(particiones: ParticionEjecutada[], procesos: Proceso[]) {
    this.particiones = particiones;
    this.procesos = procesos;
  }

  //Esta funcion asigna un proceso a una particion de memoria utilizando primer ajuste
  asignarProcesoPrimerAjuste(proceso: Proceso): Proceso {
    //Si el proceso ya esta terminado no se hace nada
    if (proceso.estado === 'terminado') return proceso;
    //Si el proceso ya esta en memoria no se hace nada
    if (proceso.estado === 'en memoria') return proceso;

    // Se recorre el lista de particiones
    for (let i = 0; i < this.particiones.length; i++) {
      // Si la particion esta libre y tiene suficiente memoria para el proceso
      // se asigna el proceso a la particion
      if (
        this.particiones[i].Libre &&
        this.particiones[i].MemoriaDeParticion >= proceso.memoria
      ) {
        proceso.estado = 'en memoria';
        this.particiones[i].Libre = false;
        this.particiones[i].Proceso = proceso.nombre;
        this.particiones[i].UtilizacionPorcentaje =
          (proceso.memoria / this.particiones[i].MemoriaDeParticion) * 100;
        return proceso;
      }
    }
    return proceso;
  }


  //Esta funcion asigna un proceso a una particion de memoria utilizando mejor ajuste
  asignarProcesoMejorAjuste(proceso: Proceso): Proceso {
    if (proceso.estado === 'terminado') return proceso;
    if (proceso.estado === 'en memoria') return proceso;

    //Se inicializa el indice de la mejor particion en -1
    let indiceMejorParticion = -1;
    
    //Se inicializa la diferencia en el maximo valor posible de un numero en javascript 
    let menorDiferencia = Number.MAX_VALUE;

    //Se recorre la lista de particiones
    for (let i = 0; i < this.particiones.length; i++) {
      if (
        this.particiones[i].Libre &&
        this.particiones[i].MemoriaDeParticion >= proceso.memoria
      ) {
        //Se calcula la diferencia entre la memoria de la particion y la memoria del proceso
        const diferencia =
          this.particiones[i].MemoriaDeParticion - proceso.memoria;

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
  }

  //Esta funcion libera un proceso de la memoria
  async liberarProceso(proceso: Proceso): Promise<Proceso> {
    if (proceso.estado === 'terminado') return proceso;

    //Se recorre la lista de particiones
    for (let i = 0; i < this.particiones.length; i++) {

      //Si la particion tiene el proceso se libera la particion
      if (this.particiones[i].Proceso === proceso.nombre) {
        const tiempoInicial = proceso.tiempoCreacion;

        const tiempoFinal = new Date();

        proceso.tiempoFinalizacion = tiempoFinal;

        const tiempoTotalEnSistema =
          tiempoFinal.getTime() - tiempoInicial.getTime();

        proceso.tiempoTotalEnSistema = tiempoTotalEnSistema / 1000;
        this.particiones[i].Libre = true;
        this.particiones[i].Proceso = '';
        this.particiones[i].UtilizacionPorcentaje = 0;
        proceso.estado = 'terminado';

        return proceso;
      }
    }
    return proceso;
  }

  //Esta funcion retorna los datos de la del estado de la simulacion actualmente
  getData() {
    return {
      particiones: this.particiones,
      procesos: this.procesos,
    };
  }
}


//Esta funcion corre un loop que se ejecuta cada segundo
//La unica razon por la cual es asincrona es porque requere de un await para esperar a que pase el tiempo para la simulacion y pueda seguir con el siguiente loop
//es asincronaa para permitir que el hilo principal pueda enviar mensajes al web worker mientras se ejecuta el loop
async function modificarDatos(
  procesos: Proceso[],
  particionesEjecutadas: ParticionEjecutada[],
  politica: 'MejorAjuste' | 'PrimerAjuste',
) {
  // Se inicializa el manager de memoria
  const manager = new managerDeMemoria(particionesEjecutadas, procesos);
  
  //Se ejecuta el loop
  do {
    //Se recorre la lista de procesos
    manager.procesos.forEach(async (proceso) => {

      //Si el proceso esta terminado no se hace nada
      if (proceso.estado === 'terminado') return;

      //Si el proceso esta en espera de memoria se asigna a una particion de memoria
      // llamando a la funcion de asignar proceso
      // dependiendo de la politica de asignacion de memoria
      if (proceso.estado === 'en espera de memoria') {
        if (politica === 'MejorAjuste') {
          proceso = manager.asignarProcesoMejorAjuste(proceso);
        } else {
          proceso = manager.asignarProcesoPrimerAjuste(proceso);
        }
      }

      //Si el proceso esta en memoria se aumenta el tiempo transcurrido
      if (proceso.estado === 'en memoria') {
        //Si el tiempo transcurrido es igual a la duracion que debe de tener el proceso en ejecucion se da por terminado el proceso
        if (proceso.transcurrido >= proceso.duracion) {
          proceso = await manager.liberarProceso(proceso);
          return;
        }
        proceso.transcurrido++;
      }
      proceso.tiempoTotalEnSistema= (new Date().getTime() - proceso.tiempoCreacion.getTime())/1000;
    });

    //Se envian los datos al hilo principal
    //self.postMessage es la funcion que se utiliza para enviar mensajes al hilo principal
    // self hace referencia al objeto de worker que esta utilizando este archivo
    self.postMessage(manager.getData());

    //Se espera un segundo para continuar con el loop
    await new Promise((resolve) => setTimeout(resolve, 1000));

    //Se revisa si todos los procesos estan terminados, si es asi se detiene el loop
    if (manager.procesos.every((proceso) => proceso.estado === 'terminado'))
      break;
  } while (continuar);
  //el while revisa si continuar es true, si es true continua el loop, si es false se detiene
  //continuar se recibe del hilo principal cuando se tiene ue detener el proceso o cuando se tiene que empezar la simulacion
}

