import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonChip,
  IonCol,
  IonGrid,
  IonLabel,
  IonRow,
} from '@ionic/react';
import React from 'react';

interface ParticionEjecutada {
  id: number;
  MemoriaDeParticion: number;
  Proceso?: string;
  UtilizacionPorcentaje?: number;
  Libre?: boolean;
}

interface Props {
  particionesEjecutadas: ParticionEjecutada[];
}

const ParticionesCards: React.FC<Props> = (props) => {
  return (
    <>
      {props.particionesEjecutadas.map((particion) => (
        <IonCol key={particion.id} size="%">
          <IonCard
            color={ particion.Libre ? 'success' : 'warning'}
          >
            <IonCardHeader>
              <IonCardTitle>Particion {particion.id}</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonLabel>Memoria</IonLabel>
                    <IonChip color={'light'}>{particion.MemoriaDeParticion}</IonChip>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonLabel>Proceso</IonLabel>
                    <IonChip color={'light'}>{particion.Proceso}</IonChip>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonLabel>Utilizacion</IonLabel>
                    <IonChip color={'light'}>{particion.UtilizacionPorcentaje}</IonChip>
                  </IonCol>
                </IonRow>
                <IonRow>
                  <IonCol>
                    <IonLabel>Libre</IonLabel>
                    <IonChip color={'light'}>{particion.Libre ? 'Si' : 'No'}</IonChip>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCardContent>
          </IonCard>
        </IonCol>
      ))}
    </>
  );
};

export default ParticionesCards;
