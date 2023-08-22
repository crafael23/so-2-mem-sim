import React, { useEffect, useState } from 'react';
import {
  IonButton,
  IonChip,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonLabel,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import AgregarProcesoModal from './agregarProcesoModal';
import { Proceso } from '../../../Types';

interface ProcesosModalProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  handleAgregarProceso: (procesosReturn: Proceso[]) => void;
  procesos: Proceso[];
  tamañoMaximoProceso: number;
  tiempoMaximo: number;
  tiempoMinimo: number;
}

const ProcesosModal: React.FC<ProcesosModalProps> = (props) => {
  const { isOpen, onDidDismiss, handleAgregarProceso } = props;

  const [procesos, setProcesos] = useState<Proceso[]>(props.procesos);

  const [showModalAgregarProceso, setShowModalAgregarProceso] = useState(false);

  const { tamañoMaximoProceso } = props;

  useEffect(() => {
    setProcesos(props.procesos);
  }, [props.procesos]);


  const handleShowModalAgregarProceso = () => {
    setShowModalAgregarProceso(true);
  };

  const handleDismissModalAgregarProceso = () => {
    setShowModalAgregarProceso(false);
  };

  const handleAgregarProcesoModal = (proceso: Proceso) => {
    const newProcesos = [...procesos, proceso];
    setProcesos(newProcesos);
  };

  const handleOnDismiss = () => {
    handleAgregarProceso(procesos);
    onDidDismiss();
  };

  const generarProcesos = () => {
    const proccesos: Proceso[] = [];
    for (let o = 0; o < 10; o++) {
      const proceso: Proceso = {
        id: o + 1,
        nombre: `proceso ${o + 1}`,
        memoria: Math.floor(Math.random() * tamañoMaximoProceso) + 1,
        estado: 'en espera de memoria',
        duracion: 5,
        tiempoCreacion : new Date(),
        tiempoTotalEnSistema: 0,
        transcurrido: 0,
      };
      proccesos.push(proceso);
    }
    setProcesos(proccesos);
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={handleOnDismiss}>
      <IonHeader>
        <IonToolbar>
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol>
                <IonTitle>Procesos</IonTitle>
              </IonCol>
            </IonRow>

            <IonRow className="ion-justify-content-center">
              <IonCol>
                <IonButton onClick={handleShowModalAgregarProceso}>
                  Agregar Proceso
                </IonButton>
              </IonCol>

              <IonButton onClick={generarProcesos}>Generar proccesos</IonButton>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid>
          {procesos.map((proceso) => {
            return (
              <IonRow key={proceso.id}>
                <IonCol size="%">
                  <IonLabel>ID</IonLabel>
                  <IonChip>{proceso.id}</IonChip>
                </IonCol>
                <IonCol size="%">
                  <IonLabel>Nombre</IonLabel>
                  <IonChip>{proceso.nombre}</IonChip>
                </IonCol>
                <IonCol size="%">
                  <IonLabel>Memoria</IonLabel>
                  <IonChip>{proceso.memoria}</IonChip>
                </IonCol>
                <IonCol>
                  <IonLabel>Estado</IonLabel>
                  <IonChip>{proceso.estado}</IonChip>
                </IonCol>
                <IonCol>
                  <IonLabel>duracion</IonLabel>
                  <IonChip>{proceso.duracion}s</IonChip>
                </IonCol>

                <IonCol>
                  <IonLabel>TiempoCreacion</IonLabel>
                  <IonChip>{proceso.tiempoCreacion.toString()}s</IonChip>
                </IonCol>
              </IonRow>
            );
          })}
        </IonGrid>
      </IonContent>
      <AgregarProcesoModal
        isOpen={showModalAgregarProceso}
        onAgregar={handleAgregarProcesoModal}
        onClose={handleDismissModalAgregarProceso}
        tamañoMaximoProceso={tamañoMaximoProceso}
        tiempoMaximoProceso={props.tiempoMaximo}
        tiempoMinimoProceso={props.tiempoMinimo}
      />

      <IonFooter>
        <IonToolbar>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton onClick={handleOnDismiss}>Cerrar</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default ProcesosModal;
