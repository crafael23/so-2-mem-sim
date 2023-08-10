import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCheckbox,
  IonChip,
  IonCol,
  IonGrid,
  IonInput,
  IonItem,
  IonList,
  IonRange,
  IonRow,
  IonTitle,
  IonToast,
} from '@ionic/react';
import React, { useEffect, useState } from 'react';
import Confirmacion from './confirmacion';
import { useHistory } from 'react-router-dom';

const Configuracion: React.FC = () => {
  

  const [cantidadMemoria, setCantidadMemoria] = useState('');
  const [cantidadParticiones, setCantidadParticiones] = useState('');
  const [politica, setPolitica] = useState('');

  const [mejorAjuste, setMejorAjuste] = useState<boolean>();
  const [primerAjuste, setPrimerAjuste] = useState<boolean>();

  const [showModal, setShowModal] = useState<boolean>(false);

  const [lowerValue, setLowerValue] = useState<number>(2);
  const [upperValue, setUpperValue] = useState<number>(8);

  const [toastMessage, setToastMessage] = useState<string>('');
  const [showToast, setShowToast] = useState<boolean>(false);

  const handleMemoriaChange = (event: CustomEvent) => {
    setCantidadMemoria(event.detail.value!);
  };

  const handleParticionesChange = (event: CustomEvent) => {
    setCantidadParticiones(event.detail.value!);
  };

  const handleMejorAjusteChange = (event: CustomEvent) => {
    const valor = event.detail.checked;
    if (valor === true) {
      setPrimerAjuste(false);
      setPolitica('MejorAjuste');
    }
    setMejorAjuste(valor);
  };

  const handlePrimerAjusteChange = (event: CustomEvent) => {
    const valor = event.detail.checked;

    if (valor === true) {
      setMejorAjuste(false);
      setPolitica('PrimerAjuste');
    }
    setPrimerAjuste(valor);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (event.currentTarget.checkValidity() && validateCheckboxes()) {
      setShowModal(true);
    } else {
      setToastMessage('Faltan campos por llenar');
      setShowToast(true);
    }
  };

  const history = useHistory();
  
  const handleConfirm = () => {

    setShowModal(false);

    const params = new URLSearchParams({
      memoria: cantidadMemoria,
      particiones: cantidadParticiones,
      mejorAjuste: mejorAjuste ? 'true' : 'false',
      primerAjuste: primerAjuste ? 'true' : 'false',
      politica: politica,
      lowerValue: lowerValue.toString(),
      upperValue: upperValue.toString(),
    });
    history.push(`/simulacion?${params.toString()}`); 
  };

  const handleDismiss = () => {
    setShowModal(false);
  };

  const validateCheckboxes = () => {
    return mejorAjuste || primerAjuste;
  };
  const handleToastDismiss = () => {
    setShowToast(false);
    setLowerValue(lowerValue);
    setUpperValue(upperValue);
  };
  return (
    <>
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Configuracion</IonCardTitle>
          <IonCardSubtitle>Paramtetros de manejo de memoria</IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent>
          <form onSubmit={handleSubmit}>
            <IonList>
              <IonItem>
                <IonInput
                  label="Cantidad de memoria"
                  type="number"
                  required
                  placeholder="(En Megabytes)"
                  onIonChange={handleMemoriaChange}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonInput
                  label="Cantidad de particiones"
                  type="number"
                  required
                  placeholder="(numeros enteros)"
                  onIonChange={handleParticionesChange}
                ></IonInput>
              </IonItem>
              <IonItem>
                <IonGrid>
                  <IonRow className="ion-justify-content-center">
                    <IonCol>
                      <IonCheckbox
                        labelPlacement="start"
                        justify="start"
                        onIonChange={handleMejorAjusteChange}
                        checked={mejorAjuste}
                      >
                        Mejor Ajuste
                      </IonCheckbox>
                    </IonCol>
                    <IonCol>
                      <IonCheckbox
                        labelPlacement="start"
                        justify="start"
                        onIonChange={handlePrimerAjusteChange}
                        checked={primerAjuste}
                      >
                        Primer Ajuste
                      </IonCheckbox>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonItem>

              <IonItem>
                <IonGrid>
                  <IonRow className="ion-justify-content-center">
                    <h2> Seleccione minimo y maximo de tiempo por proceso</h2>
                  </IonRow>
                  <IonRow>
                    <IonCol size="2">Minimo</IonCol>
                    <IonCol>
                      <IonRange
                        aria-label="Valor Inferior"
                        ticks={true}
                        snaps={true}
                        min={0}
                        max={10}
                        value={lowerValue}
                        onIonChange={({ detail }) => {
                          const value = detail.value as number;
                          if (value < upperValue) {
                            setLowerValue(value);
                          } else {
                            setToastMessage(
                              'El valor mínimo no puede ser mayor que el valor máximo',
                            );
                            setShowToast(true);
                          }
                        }}
                      ></IonRange>
                    </IonCol>
                  </IonRow>
                  <IonRow>
                    <IonCol size="2">Maximo</IonCol>
                    <IonCol>
                      <IonRange
                        aria-label="Valor superior"
                        ticks={true}
                        snaps={true}
                        min={0}
                        max={10}
                        value={upperValue}
                        onIonChange={({ detail }) => {
                          const value = detail.value as number;
                          if (value > lowerValue) {
                            setUpperValue(value);
                          } else {
                            setToastMessage(
                              'El valor máximo no puede ser menor que el valor mínimo',
                            );
                            setShowToast(true);
                          }
                        }}
                      ></IonRange>
                    </IonCol>
                  </IonRow>
                  <IonRow className="ion-justify-content-center">
                    <IonItem>
                      <IonChip slot="start">Min: {lowerValue}s</IonChip>
                    </IonItem>
                    <IonItem>
                      <IonChip slot="end">Max: {upperValue}s</IonChip>
                    </IonItem>
                  </IonRow>
                </IonGrid>
              </IonItem>
            </IonList>
            <IonButton type="submit">Continuar</IonButton>
          </form>
        </IonCardContent>
      </IonCard>

      <Confirmacion
        isOpen={showModal}
        onDismiss={handleDismiss}
        onConfirm={handleConfirm}
        memoria={cantidadMemoria}
        particiones={cantidadParticiones}
        mejorAjuste={mejorAjuste}
        primerAjuste={primerAjuste}
        minimoTiempo={lowerValue}
        maximoTiempo={upperValue}
      />
      <IonToast
        isOpen={showToast}
        onDidDismiss={handleToastDismiss}
        message={toastMessage}
        duration={1500}
      />
    </>
  );
};

export default Configuracion;
