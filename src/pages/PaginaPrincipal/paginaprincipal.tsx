import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonToolbar,
} from '@ionic/react';
import React from 'react';
import CardDescripcion from './components/cardDescripcion';
import './paginprincipal.css';
import Configuracion from './components/configuracion';

const PaginaPrincipal: React.FC = () => {
  return (
    <div>
      <IonPage id="main-content">
        <IonHeader>
          <IonToolbar></IonToolbar>
        </IonHeader>
        <IonContent>
          <IonGrid fixed={true}>
            <IonRow className="ion-justify-content-center">
              <IonCol size="4">
                <CardDescripcion />
              </IonCol>
            </IonRow>
            <IonRow className="ion-justify-content-center">
              <IonCol>
                <Configuracion />
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </div>
  );
};

export default PaginaPrincipal;
