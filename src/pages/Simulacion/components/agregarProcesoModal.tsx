import React, { useState } from 'react';
import {
  IonButton,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonInput,
  IonLabel,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToast,
} from '@ionic/react';
import { Estado, Proceso } from '../../../Types';



interface Props {
  isOpen: boolean;
  onClose: () => void;
  onAgregar: (proceso: Proceso) => void;
  tamañoMaximoProceso: number;
  tiempoMaximoProceso: number;
  tiempoMinimoProceso: number;
}

const AgregarProcesoModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onAgregar,
  tamañoMaximoProceso,
  tiempoMaximoProceso,
  tiempoMinimoProceso,
}) => {
  const [id, setId] = useState<number>(0);
  const [nombre, setNombre] = useState<string>('');
  const [memoria, setMemoria] = useState<number>(0);
  const [estado, setEstado] = useState<Estado>('en espera de memoria');

  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');

  const handleToastDismiss = () => {
    setShowToast(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !id ||
      id === 0 ||
      !nombre ||
      nombre === '' ||
      !memoria ||
      memoria === 0
    ) {
      setShowToast(true);
      setToastMessage('Los datos no están configurados correctamente');
      return;
    }

    const proceso: Proceso = {
      id: id,
      nombre: nombre,
      memoria: memoria,
      estado: estado,
      duracion: getRandomNumber(tiempoMinimoProceso, tiempoMaximoProceso),
      transcurrido: 0,
      tiempoCreacion: new Date(),
      tiempoTotalEnSistema: 0,
      tiempoFinalizacion: new Date(),
    };
    onAgregar(proceso);
    setMemoria(0);
    onClose();
  };

  const handleIdChange = (event: CustomEvent) => {
    const valor = event.detail.value as number;
    setId(valor);
  };

  const handleNombreChange = (event: CustomEvent) => {
    const valor = event.detail.value as string;
    setNombre(valor);
  };

  const handleMemoriaChange = (event: CustomEvent) => {
    const valor = event.detail.value as number;
    if (valor > tamañoMaximoProceso) {
      setMemoria(memoria);
      setShowToast(true);
      setToastMessage('El proceso es demasiado grande');
    } else {
      setMemoria(valor);
    }
  };

  function getRandomNumber(min: number, max: number): number {
    const random = Math.random();
    const range = max - min;
    const finalRandom = (random * range + min).toFixed(2);
    return parseFloat(finalRandom);
  }

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onClose}>
      <IonHeader>
        <IonGrid>
          <IonRow className="ion-justify-content">
            <IonCol>
              <IonTitle>Agregar Proceso</IonTitle>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>Ingresa los datos del proceso</IonText>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonText>Memoria maxima: {tamañoMaximoProceso}</IonText>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonHeader>

      <IonContent>
        <IonGrid>
          <form onSubmit={handleSubmit}>
            <IonRow className="ion-justify-content-center">
              <IonCol size="%">
                <IonLabel>ID</IonLabel>
              </IonCol>
              <IonCol size="%">
                <IonInput
                  aria-label="IDtext"
                  type="number"
                  required
                  onIonChange={handleIdChange}
                ></IonInput>
              </IonCol>
            </IonRow>
            <IonRow className="ion-justify-content-center">
              <IonCol size="%">
                <IonLabel>Nombre</IonLabel>
              </IonCol>
              <IonCol size="%">
                <IonInput
                  aria-label="NombreText"
                  required
                  onIonChange={handleNombreChange}
                ></IonInput>
              </IonCol>
            </IonRow>

            <IonRow className="ion-justify-content-center">
              <IonCol size="%">
                <IonLabel>Memoria</IonLabel>
              </IonCol>
              <IonCol size="%">
                <IonInput
                  aria-label="MemoriaText"
                  type="number"
                  placeholder="En Megabytes"
                  required
                  value={memoria}
                  onIonChange={handleMemoriaChange}
                ></IonInput>
              </IonCol>
            </IonRow>
            <IonRow className="ion-justify-content-center">
              <IonCol size="%">
                <IonButton type="submit">Agregar</IonButton>
              </IonCol>
              <IonCol size="%">
                <IonButton onClick={onClose}>cancelar</IonButton>
              </IonCol>
            </IonRow>
          </form>
        </IonGrid>
      </IonContent>
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        onDidDismiss={handleToastDismiss}
        duration={1000}
      />
    </IonModal>
  );
};

export default AgregarProcesoModal;
