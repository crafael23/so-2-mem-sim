import { IonCol, IonList, IonItem, IonLabel, IonChip } from '@ionic/react';
import React from 'react';
import { Proceso } from '../../../Types';


interface Props {
  procesos: Proceso[];
}

const ListaDeProcesos: React.FC<Props> = (props) => {
  const { procesos } = props;
  return (
    <>
      {procesos.map((proceso) => (
        <IonCol className="ion-justify-content-center" key={proceso.id}>
          <IonList >
            <IonItem>
              <IonLabel>Id</IonLabel>
              <IonChip>{proceso.id}</IonChip>
            </IonItem>
            <IonItem>
              <IonLabel>Nombre</IonLabel>
              <IonChip>{proceso.nombre}</IonChip>
            </IonItem>
            <IonItem>
              <IonLabel>Memoria</IonLabel>
              <IonChip>{proceso.memoria}</IonChip>
            </IonItem>
            <IonItem>
              <IonLabel>Estado</IonLabel>
              <IonChip>
                {proceso.estado === 'en espera de memoria'
                  ? 'Esperando'
                  : proceso.estado === 'en memoria'
                  ? 'Ejecutandose'
                  : 'Terminado'}
              </IonChip>
            </IonItem>
            <IonItem>
              <IonLabel>Duracion</IonLabel>
              <IonChip>{proceso.duracion}</IonChip>
            </IonItem>
            <IonItem>
              <IonLabel>Transcurrido</IonLabel>
              <IonChip>{proceso.transcurrido} </IonChip>
            </IonItem>
          </IonList>
        </IonCol>
      ))}
    </>
  );
};

export default ListaDeProcesos;
