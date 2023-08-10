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

type Estado = 'en memoria' | 'en espera de memoria' | 'terminado';
interface Proceso {
  id: number;
  nombre: string;
  memoria: number;
  estado: Estado;
}
interface ProcesosModalProps {
  isOpen: boolean;
  onDidDismiss: () => void;
  handleAgregarProceso: (procesosReturn: Proceso[]) => void;
  procesos: Proceso[];
  tamañoMaximoProceso: number;
}

const ProcesosModal: React.FC<ProcesosModalProps> = (props) => {
  const { isOpen, onDidDismiss, handleAgregarProceso } = props;

  const [procesos, setProcesos] = useState<Proceso[]>(props.procesos);

  const [showModalAgregarProceso, setShowModalAgregarProceso] = useState(false);
  
  const { tamañoMaximoProceso } = props;

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
