import {
  IonButton,
  IonCardSubtitle,
  IonChip,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonRange,
  IonRow,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/react';
import { cloudyNightOutline } from 'ionicons/icons';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

interface Props {
  isOpen: boolean;
  onDismiss: () => void;
  onConfirm: (
    TamañoMaximoProceso: number,
    particiones?: number[],
  ) => Promise<void>;
  numParticiones: number;
  memoriaDisponible: number;
}

const ConfiguracionParticiones: React.FC<Props> = (props) => {
  const history = useHistory();

  const { isOpen, onDismiss, onConfirm, numParticiones, memoriaDisponible } =
    props;

  const numeros = [];

  for (let i = 0; i < numParticiones; i++) {
    numeros.push(NaN);
  }

  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleToastDismiss = () => {
    setParticiones(particiones);
    setShowToast(false);
  };

  const [memDisponible, setMemDisponible] = useState<number>(memoriaDisponible);

  const [particiones, setParticiones] = useState<number[]>(numeros);

  const [particionMayor, setParticionMayor] = useState<number>(0);

  useEffect(() => {
    let mayor = 0;
    particiones.forEach((particion) => {
      if (particion > mayor) {
        mayor = particion;
        setParticionMayor(mayor);
      }
    });
  }, [particiones]);

  const handleChange = (key: number, value: string) => {
    const newParticiones = [...particiones];
    newParticiones[key] = parseInt(value);
    setParticiones(newParticiones);
  };

  const handleInputChange = (key: number) => (event: CustomEvent) => {
    const cantidad = parseInt(event.detail.value!);

    let MemoriaDisponible = memDisponible;

    if (Number.isNaN(cantidad) || cantidad === 0) {
      console.log('el numero es NaN o es cero');
      const newParticiones = [...particiones];

      if (particiones[key] === undefined || Number.isNaN(particiones[key])) {
        return;
      } else if (particiones[key] > 0) {
        setMemDisponible(memDisponible + particiones[key]);
        newParticiones[key] = NaN;
        setParticiones(newParticiones);
      }
      return;
    }

    if (particiones[key] > 0 && !Number.isNaN(particiones[key])) {
      console.log('esa particcion ya tiene un vaalor asignado, borrando');
      MemoriaDisponible = MemoriaDisponible + particiones[key];
    }

    console.log(MemoriaDisponible);
    if (cantidad <= MemoriaDisponible) {

      console.log("cantidad menor a memoria disponible");
      MemoriaDisponible = MemoriaDisponible - cantidad;
      setMemDisponible(MemoriaDisponible);
      handleChange(key, event.detail.value!);
    } else {
      setToastMessage(
        'La cantidad de memoria asignada supera la memoria disponible',
      );
      setShowToast(true);
    }
  };
  const particionItems = [];

  for (let i = 0; i < numParticiones; i++) {
    particionItems.push(
      <IonItem key={i}>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="4">
              <IonLabel>Particion {i + 1}</IonLabel>
            </IonCol>
            <IonCol size="4">
              <IonInput
                placeholder="numeros enteros"
                type="number"
                aria-label="Textfield"
                value={particiones[i]}
                onIonChange={handleInputChange(i)}
              ></IonInput>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonItem>,
    );
  }

  const handleConfirm = () => {
    onConfirm(particionMayor, particiones);
  };

  const handleCancel = () => {
    onDismiss();
    history.push('/');
  };

  return (
    <IonModal isOpen={isOpen} onDidDismiss={onDismiss}>
      <IonToolbar>
        <IonGrid>
          <IonRow className="ion-justify-content-center">
            <IonCol size="%">
              <IonTitle>Configuracion de particiones</IonTitle>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonList>
                <IonItem>
                  <IonGrid>
                    <IonRow className="ion-justify-content-center">
                      <IonCol size="%">
                        <IonLabel>Memoria disponible</IonLabel>
                      </IonCol>
                      <IonCol size="%">
                        <IonChip>{memDisponible} MB</IonChip>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonItem>
                <IonItem>
                  <IonGrid>
                    <IonRow className="ion-justify-content-center">
                      <IonCol size="%">
                        <IonLabel>Numero de particiones</IonLabel>
                      </IonCol>
                      <IonCol size="%">
                        <IonChip>{numParticiones}</IonChip>
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonItem>
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonToolbar>
      <IonContent>
        <IonList>{particionItems}</IonList>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonGrid>
            <IonRow className="ion-justify-content-center">
              <IonCol size="%">
                <IonButton onClick={handleConfirm}>Confirmar</IonButton>
              </IonCol>
              <IonCol size="%">
                <IonButton onClick={handleCancel}>Cancelar</IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>
      <IonToast
        isOpen={showToast}
        message={toastMessage}
        onDidDismiss={handleToastDismiss}
        duration={1000}
      />
    </IonModal>
  );
};

export default ConfiguracionParticiones;
