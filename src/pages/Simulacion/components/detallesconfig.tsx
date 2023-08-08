import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonChip,
  IonCol,
  IonGrid,
  IonLabel,
  IonList,
  IonRoute,
  IonRow,
} from '@ionic/react';
import React from 'react';
interface SimulationParams {
  memoria: string | null;
  particiones: string | null;
  mejorAjuste: string | null;
  primerAjuste: string | null;
  politica: string | null;
  lowerValue: string | null;
  upperValue: string | null;
  onDismiss: () => void;
}

const DetallesConfig: React.FC<SimulationParams> = ({
  memoria,
  particiones,
  mejorAjuste,
  primerAjuste,
  politica,
  lowerValue,
  upperValue,
  onDismiss,
}) => {
  return (
    <div>
      <IonCardHeader>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <IonCardTitle>Detalles de la Configuración</IonCardTitle>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonCol>
              <IonCardSubtitle>
                Parametros de configuracion de la simulacion
              </IonCardSubtitle>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardHeader>
      <IonCardContent>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonLabel>Memoria Disponible</IonLabel>
              <IonChip>{memoria}</IonChip>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>Cantidad de Particiones</IonLabel>
              <IonChip>{particiones}</IonChip>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>Politica de ubicacion</IonLabel>
              <IonChip>{politica}</IonChip>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>Tiempo de proceso</IonLabel>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonLabel>Min</IonLabel>
              <IonChip>{lowerValue} s</IonChip>
              <IonLabel>Max</IonLabel>
              <IonChip>{upperValue} s</IonChip>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton expand="block" onClick={onDismiss}>
                Cerrar
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonCardContent>
    </div>
  );
};

export default DetallesConfig;
