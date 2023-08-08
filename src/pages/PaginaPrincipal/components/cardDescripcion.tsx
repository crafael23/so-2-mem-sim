import {
  IonCol,
  IonCard,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCardContent,
} from '@ionic/react';
import React from 'react';

const CardDescripcion: React.FC = () => {
  return (
    <div>
      <IonCard color="dark">
        <IonCardHeader>
          <IonCardSubtitle>Claudio Vasquez 20192002377</IonCardSubtitle>
          <IonCardTitle>Simulacion Memoria</IonCardTitle>
        </IonCardHeader>
        <IonCardContent>
          Proyecto para SO2, simulacion de memoria con representaciones graficas de lo que sucede.
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default CardDescripcion;
