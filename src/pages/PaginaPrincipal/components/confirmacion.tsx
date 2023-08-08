import React from 'react';

import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
} from '@ionic/react';
import './confirmacion.css';

interface ConfirmacionProps {
  isOpen: boolean;
  onDismiss: () => void;
  onConfirm: () => void;
  memoria: string;
  particiones: string;
  mejorAjuste: boolean | undefined;
  primerAjuste: boolean | undefined;
  minimoTiempo: number | number;
  maximoTiempo: number | number;
}

const Confirmacion: React.FC<ConfirmacionProps> = ({
  isOpen,
  onDismiss,
  onConfirm,
  memoria,
  particiones,
  mejorAjuste,
  primerAjuste,
  minimoTiempo,
  maximoTiempo,
}) => {
  const politica = mejorAjuste
    ? 'Mejor Ajuste'
    : primerAjuste
    ? 'Primer Ajuste'
    : '';

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Confirmación</IonCardTitle>
          <IonCardSubtitle>
            Por favor, confirme si los siguientes datos son correctos:
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          <IonList>
            <IonItem>
              <IonLabel>Cantidad de memoria:</IonLabel>
              <IonLabel>{memoria} MB</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Cantidad de particiones:</IonLabel>
              <IonLabel>{particiones}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Política de asignación:</IonLabel>
              <IonLabel>{politica}</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Tiempo minimo de proceso</IonLabel>
              <IonItem> {minimoTiempo}</IonItem>
            </IonItem>
            <IonItem>
              <IonLabel>Tiempo maximo de proceso</IonLabel>
              <IonItem> {maximoTiempo}</IonItem>
            </IonItem>
          </IonList>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton onClick={onConfirm}>Confirmar</IonButton>
                <IonButton onClick={onDismiss}>Cancelar</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCardContent>
      </IonCard>
    </IonModal>
  );
};

export default Confirmacion;
