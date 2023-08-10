import { IonCol, IonList, IonItem, IonLabel, IonChip } from '@ionic/react';
import React from 'react';

type Estado = 'en memoria' | 'en espera de memoria' | 'terminado';

interface Proceso {
  id: number;
  nombre: string;
  memoria: number;
  estado: Estado;
}
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
          </IonList>
        </IonCol>
      ))}
    </>
  );
};

export default ListaDeProcesos;
