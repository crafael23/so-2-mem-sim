import {
  IonButton,
  IonButtons,
  IonChip,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';

import { useLocation } from 'react-router-dom';
import DetallesConfig from './components/detallesconfig';
import ConfiguracionParticiones from './components/configuracionParticiones';
import ParticionesCards from './components/particionesCard';
import ProcesosModal from './components/procesosModal';
import ListaDeProcesos from './components/listaDeProcesos';
import { Proceso } from '../../Types';


//se crea un nuevo worker para poder utilizar el archivo webworker.js el cual se encarga de realizar la simulacion de memoria
// se le pasa como parametro el archivo webworker.js y se le pasa un objeto con el tipo de worker que es, en este caso es un modulo
// En este caso este seria el 'Hilo' que el navegador va a lanzar para ejecutar el código del archivo webworker.js en paralelo con el hilo principal de la aplicación.
const worker = new Worker('src/webworker.js', {
  type: 'module',
});

const Simulacion: React.FC = () => {
  // Obtener la ubicación actual de la URL utilizando el hook useLocation
  const location = useLocation();

  // Crear un objeto URLSearchParams para manejar los parámetros de búsqueda de la URL
  const searchParams = new URLSearchParams(location.search);

  // utiliza el objeto URLSearchParams para obtener los parámetros de búsqueda de la URL actual y asignarlos a variables. En este caso, se están obteniendo los valores de los parámetros memoria, particiones, mejorAjuste, primerAjuste, politica, lowerValue y upperValue. Estos valores se pueden utilizar posteriormente en la lógica de la aplicación para realizar simulaciones de memoria.

  const memoria = searchParams.get('memoria');
  const particiones = searchParams.get('particiones');
  const mejorAjuste = searchParams.get('mejorAjuste');
  const primerAjuste = searchParams.get('primerAjuste');
  const politica = searchParams.get('politica');
  const lowerValue = searchParams.get('lowerValue');
  const upperValue = searchParams.get('upperValue');

  const [showConfig, setShowConfig] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [showPartitionSetup, setShowPartitionSetup] = useState(false);

  //el proposito de este arreglo es simplemente guardar el valor de total de memoria que cada particion puede almacenar
  const [particionesConfiguradas, setParticionesConfiguradas] = useState<
    number[]
  >([]);
  //Se utiliza en el modal de configuracion de particciones el cual retorna un arreglo con el total de memoria que cada particion puede almacenar

  const [simulacionIniciada, setSimulacionIniciada] = useState(false);

  const [tamañoMaximoProceso, setTamañoMaximoProceso] = useState<number>(0);

  // El hook useEffect de React permite ejecutar efectos secundarios en un componente funcional después
  // de que se renderice, como realizar peticiones a una API o suscribirse a eventos, controlando
  // su activación basada en cambios específicos en las propiedades o estado.

  useEffect(() => {
    //esto solo verifica si la variable que inicializamos antes es verdadera, si es verdera significa que es la primera vez que se renderiza el componente por lo cual tenemos que llamar al ccomponente modal para configurar particiones
    if (firstRender) {
      setShowPartitionSetup(true);
      setFirstRender(false);
    }
    //si por alguna razon la variable llegase a cambiar otravez no se hara nada porque ya no es la primera vez que se renderiza el componente
  }, [firstRender]);

  //estosolo describe como tienen que ser los objetos de particcion cuando ya esten configuradas
  interface ParticionEjecutada {
    id: number;
    MemoriaDeParticion: number;
    Proceso?: string;
    UtilizacionPorcentaje?: number;
    Libre?: boolean;
  }

  //esta funcion se encarga de cerrar el modal de configuracion de particiones y de configurar recibir los datos que se configuraron en el modal de configuracion de particiones.
  const handleClosePartitionSetup = async (
    TamañoMaximoProceso: number,
    particiones?: number[],
  ) => {
    setShowPartitionSetup(false);
    if (particiones) {
      setTamañoMaximoProceso(TamañoMaximoProceso);
      setParticionesConfiguradas(particiones);
    }
  };

  //este useEffect revisa si hay cambios en particciones configuradas(el cual solo va a ocurrir cuando se configuren el tamaño de las particiones) y llama a la funcion mapDataToParticiones el cual configura los demaas aspectos de las particciones para poder desplegarlas en la pantalla y darles uso dentro de la simulaciion

  useEffect(() => {
    if (particionesConfiguradas.length > 0) {
      mapDataToParticiones();
    }
  }, [particionesConfiguradas]);

  //esta funcion se encarga de configurar las particiones para que puedan ser utilizadas en la simulacion
  // mapeando el dato que hay en particionesConfiguradas y creando un nuevo arreglo de objetos con los datos que se necesitan para la simulacion

  const [particionesEjecutadas, setParticionesEjecutadas] = useState<
    ParticionEjecutada[]
  >([]);
  const mapDataToParticiones = () => {
    const newParticionesEjecutadas = particionesConfiguradas.map(
      (memoriaDeParticion, index) => ({
        id: index + 1,
        MemoriaDeParticion: memoriaDeParticion,
        Proceso: undefined,
        UtilizacionPorcentaje: undefined,
        Libre: true,
      }),
    );
    setParticionesEjecutadas(newParticionesEjecutadas);
  };

  const handlePartitionDismiss = () => {
    setShowPartitionSetup(false);
  };

  const handleShowConfig = () => {
    setShowConfig(true);
  };
  const handleCloseConfig = () => {
    setShowConfig(false);
  };

  //Inicializammos nuestro arreglo, o cola de procesos con un valor inicial de arreglo vacio
  const [procesos, setProcesos] = useState<Proceso[]>([]);

  // Simplemnente se encarga de mostrar el modal de procesos que contiene una lista de procesos y la habilidad de agregar nuevos procesos
  const [showModalProcesos, setShowModalProcesos] = useState(false);

  //esto ccambia el estado de la variable que se encarga de mostrar el modal de procesos
  // y si la simulacion ya esta iniciada detiene la simulacion

  const handleShowModalProcesos = () => {
    if (simulacionIniciada) {
      detener();
    }
    setShowModalProcesos(true);
  };

  const handleDismissModalProcesos = () => {
    setShowModalProcesos(false);
  };

  //esta variable se encarga de verificar si se agrego un nuevo proceso para poder iniciar la simulacion
  const [nuevoProcesoAgregado, setNuevoProcesoAgregado] =
    useState<boolean>(false);

  //esta funcion se encarga de recibir los procesos que se agregaron en el modal de procesos y de verificar si la simulacion ya esta iniciada para poder iniciar la simulacion
    const handleAgregarProceso = (procesosReturn: Proceso[]) => {
    if (procesosReturn == procesos) {
      return;
    } else {
      if (simulacionIniciada) {
        setNuevoProcesoAgregado(true);
      }
      setProcesos(procesosReturn);
    }
  };

  //este useEffect se encarga de verificar si se agrego un nuevo proceso y si la simulacion ya esta iniciada para poder iniciar la simulacion
  useEffect(() => {
    if (nuevoProcesoAgregado && simulacionIniciada) {
      setNuevoProcesoAgregado(false);
      simular();
    }
  }, [nuevoProcesoAgregado]);



  //esta funcion se encarga de enviar los datos de la simulacion al worker para que este pueda realizar la simulacion
  const simular = () => {
    const continuar = true;
    // le mandamos la cola de procesos , las particiones y la politica de asignacion de memoria
    // junto con un Flag que nos indica si la simulacion debe continuar o detenerse
    const data = {
      procesos,
      particionesEjecutadas,
      continuar,
      politica,
    };

    // le decimos la aplicacion que la simulacion ya esta iniciada
    setSimulacionIniciada(true);
    
    // le enviamos los datos al worker
    worker.postMessage(data);

  };

  //este evento se encarga de recibir los datos que el worker nos envia y de actualizar las particiones y los procesos
  worker.onmessage = (event: MessageEvent) => {
    const modifiedArrays: any = event.data;
    setParticionesEjecutadas(modifiedArrays.particiones);
    setProcesos(modifiedArrays.procesos);
  };

  //esta funcion se encarga de detener la simulacion
  const detener = () => {
    const continuar = false;
    const data = {
      continuar,
    };
    worker.postMessage(data);
  };

  return (
    <>
      <IonPage id="Simulacion">
        <IonHeader>
          <IonToolbar>
            <IonGrid>
              <IonRow className="ion-justify-content-center">
                <IonCol>
                  <IonTitle>Simulación</IonTitle>
                </IonCol>
              </IonRow>
              <IonRow className="ion-justify-content-center">
                <IonCol>
                  <IonButton onClick={handleShowConfig}>
                    Mostrar Configuracion
                  </IonButton>
                </IonCol>
              </IonRow>
              <IonRow className="ion-justify-content-center">
                <IonCol>
                  <IonButton onClick={handleShowModalProcesos}>
                    Mostrar Procesos
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              {particionesEjecutadas.length > 0 && (
                <ParticionesCards
                  particionesEjecutadas={particionesEjecutadas}
                />
              )}
            </IonRow>

            <IonRow>
              <IonCol className="ion-justify-content-center">
                <IonButton onClick={simular}>Simular</IonButton>
              </IonCol>
              <IonCol>
                <IonButton onClick={detener}>Detener</IonButton>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol className="ion-justify-content-center">
                <IonTitle>Tabla de procesos</IonTitle>
              </IonCol>
            </IonRow>

            {procesos.length > 0 && <ListaDeProcesos procesos={procesos} />}
          </IonGrid>
        </IonContent>
      </IonPage>

      <IonModal isOpen={showConfig} onDidDismiss={handleCloseConfig}>
        <DetallesConfig
          memoria={memoria}
          particiones={particiones}
          mejorAjuste={mejorAjuste}
          primerAjuste={primerAjuste}
          politica={politica}
          lowerValue={lowerValue}
          upperValue={upperValue}
          onDismiss={handleCloseConfig}
        />
      </IonModal>

      <ConfiguracionParticiones
        isOpen={showPartitionSetup}
        onDismiss={handlePartitionDismiss}
        onConfirm={handleClosePartitionSetup}
        memoriaDisponible={memoria as unknown as number}
        numParticiones={particiones as unknown as number}
      />

      <ProcesosModal
        handleAgregarProceso={handleAgregarProceso}
        isOpen={showModalProcesos}
        onDidDismiss={handleDismissModalProcesos}
        procesos={procesos}
        tamañoMaximoProceso={tamañoMaximoProceso}
        tiempoMaximo={parseInt(upperValue as string)}
        tiempoMinimo={parseInt(lowerValue as string)}
      />
    </>
  );
};

export default Simulacion;
