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

// Este código define un componente de React llamado Configuracion que muestra un formulario para que el usuario configure los parámetros de manejo de memoria de una aplicación. El formulario incluye campos para la cantidad de memoria, la cantidad de particiones y la selección de algoritmos de asignación de memoria (mejor ajuste o primer ajuste). También incluye dos controles deslizantes para seleccionar el tiempo mínimo y máximo por proceso. Cuando el usuario envía el formulario, se muestra un modal de confirmación con los valores seleccionados. Si el usuario intenta seleccionar un valor mínimo mayor que el valor máximo o un valor máximo menor que el valor mínimo, se muestra un mensaje de error en un toast.

const Configuracion: React.FC = () => {
  // El hook useState de React permite a los componentes funcionales gestionar y mantener su estado interno de manera dinámica.

  // es basicamente para permitirle a react saber cuando el estado de una
  // variable cambia y asi poder actualizar el valor en el siguiente ciclo
  // de renderizado
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

  //estos handle___Change son para actualizar el valor de las variables
  // cuando el usuario cambia el valor de los inputs en los espacios especificados

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

  // este handleSubmit es para cuando el usuario envia el formulario
  // se verifica que todos los campos esten llenos y que al menos uno
  // de los algoritmos de asignacion de memoria este seleccionado
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (event.currentTarget.checkValidity() && validateCheckboxes()) {
      setShowModal(true); // si todo esta bien se muestra el modal de confirmacion
    } else {
      setToastMessage('Faltan campos por llenar');
      setShowToast(true); // si no se muestra un toast con un mensaje de error
    }
  };

  const history = useHistory();
  //El hook useHistory es un hook de React Router que permite acceder al objeto history y utilizarlo para navegar entre las diferentes rutas de la aplicación. El objeto history contiene información sobre la sesión de navegación actual, como la ubicación actual y el historial de navegación.

  // En este caso, el hook useHistory se utiliza para obtener acceso al objeto history y poder utilizarlo en la función handleConfirm para redirigir al usuario a la página de simulación con los parámetros seleccionados en el formulario de configuración.

  const handleConfirm = () => {
    setShowModal(false);
    // se crea un objeto de tipo URLSearchParams que permite crear una URL con los parametros especificados
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
    // se redirige al usuario a la pagina de simulacion con los parametros especificados
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


      {/* este es el componente modal de confirmacion que se muestra cuando el usuario envia el formulario */}
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
      {/* su unica funcion es para revisar que todo esta bien y que el usuario
      quiere continuar con los parametros especificados
      se utiliza el handleConfirm para redirigir al usuario a la pagina de simulacion con los parametros especificados */}
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
