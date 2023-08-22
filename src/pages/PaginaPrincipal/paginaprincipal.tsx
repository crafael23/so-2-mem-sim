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

// Este código es un componente de React que define la página principal.

// En la importación se incluyen varios componentes de Ionic que se utilizan para construir la interfaz de usuario, como IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonCol, IonContent, IonFab, IonFabButton, IonFooter, IonGrid, IonHeader, IonIcon, IonPage, IonRow y IonToolbar.

// El componente PaginaPrincipal es una función que devuelve un JSX que representa la estructura de la página principal. En este caso, se define una página con un encabezado vacío y un contenido que contiene un IonGrid con dos IonRow. La primera IonRow contiene un IonCol que a su vez contiene un componente personalizado llamado CardDescripcion. La segunda IonRow contiene un IonCol que a su vez contiene un componente personalizado llamado Configuracion.

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
                {/* esto solo llama al componente que describe que es el programa */}
                <CardDescripcion />
              </IonCol>
            </IonRow>
            <IonRow className="ion-justify-content-center">
              <IonCol>
                <Configuracion />
                {/* Esto llama al componente que permite configurar el programa */}
                {/* para accesar este componente dentro de la carpeta de esta pagina */}
                {/* hay varios archivos de componentes, configuracion.tsx es el que este llama*/}
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    </div>
  );
};

export default PaginaPrincipal;
