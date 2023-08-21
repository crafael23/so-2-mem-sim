import {
  IonCol,
  IonList,
  IonItem,
  IonLabel,
  IonChip,
  IonRow,
  IonTitle,
  IonButton,
} from '@ionic/react';
import React from 'react';
import { Proceso } from '../../../Types';

interface Props {
  procesos: Proceso[];
}

const ListaDeProcesos: React.FC<Props> = (props) => {
  const { procesos } = props;
  const procesosEnEspera = procesos.filter((proceso) => {
    return proceso.estado === 'en espera de memoria';
  });

  const procesosEnMemoria = procesos.filter((proceso) => {
    return proceso.estado === 'en memoria';
  });

  const procesosTerminados = procesos.filter((proceso) => {
    return proceso.estado === 'terminado';
  });

  return (
    <>
      <IonCol>
        <IonTitle>Procesos en espera</IonTitle>
      </IonCol>
      {procesosEnEspera.map((proceso) => {
        return (
          <IonCol key={proceso.id}>
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
              <IonLabel>Tiempo en ejecucion</IonLabel>
              <IonChip>{proceso.transcurrido} </IonChip>
            </IonItem>

            <IonItem>
              <IonLabel>Tiempo total en sistema</IonLabel>
              <IonChip>{proceso.tiempoTotalEnSistema}s</IonChip>
            </IonItem>
          </IonCol>
        );
      })}
      <IonCol>
        <IonTitle>Procesos en memoria</IonTitle>
      </IonCol>
      {procesosEnMemoria.map((proceso) => {
        return (
          <IonCol key={proceso.id}>
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
              <IonLabel>Tiempo en ejecucion</IonLabel>
              <IonChip>{proceso.transcurrido} </IonChip>
            </IonItem>

            <IonItem>
              <IonLabel>Tiempo total en sistema</IonLabel>
              <IonChip>{proceso.tiempoTotalEnSistema}s</IonChip>
            </IonItem>
          </IonCol>
        );
      })}

      <IonCol>
        <IonTitle>Procesos Terminados</IonTitle>
      </IonCol>

      {procesosTerminados.map((proceso) => {
        return (
          <IonCol key={proceso.id}>
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
              <IonLabel>Tiempo en ejecucion</IonLabel>
              <IonChip>{proceso.transcurrido} </IonChip>
            </IonItem>

            <IonItem>
              <IonLabel>Tiempo total en sistema</IonLabel>
              <IonChip>{proceso.tiempoTotalEnSistema}s</IonChip>
            </IonItem>
          </IonCol>
        );
      })}
    </>
  );
};

export default ListaDeProcesos;
