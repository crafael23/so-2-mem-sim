export type Estado = 'en memoria' | 'en espera de memoria' | 'terminado';

export interface Proceso {
  id: number;
  nombre: string;
  memoria: number;
  estado: Estado;
  duracion: number;
  transcurrido: number;
}

export interface ParticionEjecutada {
  id: number;
  MemoriaDeParticion: number;
  Proceso?: string;
  UtilizacionPorcentaje?: number;
  Libre?: boolean;
}
