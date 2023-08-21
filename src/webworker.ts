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

addEventListener('message', async (event) => {
  const data = event.data;
  if (!data.continuar) {
    continuar = data.continuar;
    return;
  }
  continuar = data.continuar;
  // const { procesos, particionesEjecutadas, politica} = event.data;

  const procesos: Proceso[] = event.data.procesos;

  const particionesEjecutadas: ParticionEjecutada[] = event.data.particionesEjecutadas;

  const politica: 'MejorAjuste' | 'PrimerAjuste' = event.data.politica;


  modificarDatos(procesos, particionesEjecutadas, politica);
});

async function modificarDatos(
  procesos: Proceso[],
  particionesEjecutadas: ParticionEjecutada[],
  politica: 'MejorAjuste' | 'PrimerAjuste',
) {
  const manager = new managerDeMemoria(particionesEjecutadas, procesos);
  do {
    manager.procesos.forEach(async (proceso) => {

      const Proceso = proceso;
      if (proceso.estado === 'terminado') return;

      if (proceso.estado === 'en espera de memoria') {
        if (politica === 'MejorAjuste') {
          proceso = manager.asignarProcesoMejorAjuste(proceso);
        } else {
          proceso = manager.asignarProcesoPrimerAjuste(proceso);
        }
      }
      if (proceso.estado === 'en memoria') {
        if (proceso.transcurrido >= proceso.duracion) {
          proceso = await manager.liberarProceso(proceso);
          return;
        }
        proceso.transcurrido++;
      }
      proceso.tiempoTotalEnSistema= (new Date().getTime() - proceso.tiempoCreacion.getTime())/1000;
    });

    self.postMessage(manager.getData());
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (manager.procesos.every((proceso) => proceso.estado === 'terminado'))
      break;
  } while (continuar);
  console.log('loop terminado');
}

class managerDeMemoria {
  particiones: ParticionEjecutada[];
  procesos: Proceso[];

  constructor(particiones: ParticionEjecutada[], procesos: Proceso[]) {
    this.particiones = particiones;
    this.procesos = procesos;
  }

  asignarProcesoPrimerAjuste(proceso: Proceso): Proceso {
    if (proceso.estado === 'terminado') return proceso;
    if (proceso.estado === 'en memoria') return proceso;

    for (let i = 0; i < this.particiones.length; i++) {
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

  asignarProcesoMejorAjuste(proceso: Proceso): Proceso {
    if (proceso.estado === 'terminado') return proceso;
    if (proceso.estado === 'en memoria') return proceso;

    let indiceMejorParticion = -1;
    let menorDiferencia = Number.MAX_VALUE;

    for (let i = 0; i < this.particiones.length; i++) {
      if (
        this.particiones[i].Libre &&
        this.particiones[i].MemoriaDeParticion >= proceso.memoria
      ) {
        const diferencia =
          this.particiones[i].MemoriaDeParticion - proceso.memoria;
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
  }

  async liberarProceso(proceso: Proceso): Promise<Proceso> {
    if (proceso.estado === 'terminado') return proceso;

    for (let i = 0; i < this.particiones.length; i++) {
      if (this.particiones[i].Proceso === proceso.nombre) {
        const tiempoInicial = proceso.tiempoCreacion;
        console.log(tiempoInicial);
        const tiempoFinal = new Date();
        console.log(tiempoFinal);

        proceso.tiempoFinalizacion = tiempoFinal;

        const tiempoTotalEnSistema =
          tiempoFinal.getTime() - tiempoInicial.getTime();

        console.log(tiempoTotalEnSistema/1000);

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
  getData() {
    return {
      particiones: this.particiones,
      procesos: this.procesos,
    };
  }
}
