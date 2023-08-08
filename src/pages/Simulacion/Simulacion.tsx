import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonModal,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from '@ionic/react';
import React, { useState } from 'react';

import { useLocation } from 'react-router-dom';
import DetallesConfig from './components/detallesconfig';

const Simulacion: React.FC = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);

  const [showConfig, setShowConfig] = useState(false);

  const memoria = searchParams.get('memoria');
  const particiones = searchParams.get('particiones');
  const mejorAjuste = searchParams.get('mejorAjuste');
  const primerAjuste = searchParams.get('primerAjuste');
  const politica = searchParams.get('politica');
  const lowerValue = searchParams.get('lowerValue');
  const upperValue = searchParams.get('upperValue');

  const handleShowConfig = () => {
    setShowConfig(true);
  };

  const handleCloseConfig = () => {
    setShowConfig(false);
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
                  <IonButton>Agregar Proceso</IonButton>
                </IonCol>
              </IonRow>
              <IonRow className="ion-justify-content-center">
                <IonCol>
                  <IonButton onClick={handleShowConfig}>Mostrar Configuracion</IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding">
          <IonGrid>
            
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
    </>
  );
};

export default Simulacion;
