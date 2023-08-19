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

const worker = new Worker('src/webworker.ts', {
  type: 'module',
});

const Simulacion: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

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
  const [particionesConfiguradas, setParticionesConfiguradas] = useState<
    number[]
  >([]);

  const [simulacionIniciada, setSimulacionIniciada] = useState(false);

  const [tamañoMaximoProceso, setTamañoMaximoProceso] = useState<number>(0);

  useEffect(() => {
    if (firstRender) {
      setShowPartitionSetup(true);
      setFirstRender(false);
    }
  }, [firstRender]);
  interface ParticionEjecutada {
    id: number;
    MemoriaDeParticion: number;
    Proceso?: string;
    UtilizacionPorcentaje?: number;
    Libre?: boolean;
  }
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
  useEffect(() => {
    if (particionesConfiguradas.length > 0) {
      mapDataToParticiones();
    }
  }, [particionesConfiguradas]);

  const handlePartitionDismiss = () => {
    setShowPartitionSetup(false);
  };

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

  const handleShowConfig = () => {
    setShowConfig(true);
  };
  const handleCloseConfig = () => {
    setShowConfig(false);
  };

  const [particionesEjecutadas, setParticionesEjecutadas] = useState<
    ParticionEjecutada[]
  >([]);

  const [procesos, setProcesos] = useState<Proceso[]>([]);

  const [showModalProcesos, setShowModalProcesos] = useState(false);

  const handleShowModalProcesos = () => {
    if (simulacionIniciada) {
      detener();
    }
    setShowModalProcesos(true);
  };

  const handleDismissModalProcesos = () => {
    setShowModalProcesos(false);
  };
  const [nuevoProcesoAgregado, setNuevoProcesoAgregado] =
    useState<boolean>(false);
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

  useEffect(() => {
    if (nuevoProcesoAgregado && simulacionIniciada) {
      setNuevoProcesoAgregado(false);
      simular();
    }
  }, [nuevoProcesoAgregado]);

  const simular = () => {
    console.log('simular');
    const continuar = true;
    const data = {
      procesos,
      particionesEjecutadas,
      continuar,
      politica,
    };
    setSimulacionIniciada(true);
    worker.postMessage(data);
  };

  worker.onmessage = (event: MessageEvent) => {
    const modifiedArrays: any = event.data;

    console.log(modifiedArrays);
    setParticionesEjecutadas(modifiedArrays.particiones);
    setProcesos(modifiedArrays.procesos);
  };

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
            <IonRow>
              {procesos.length > 0 && <ListaDeProcesos procesos={procesos} />}
            </IonRow>
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
