import { Redirect, Route } from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { ellipse, square, triangle } from 'ionicons/icons';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

// Este código es un archivo de entrada de una aplicación de React que utiliza el framework Ionic para construir una interfaz de usuario.
import PaginaPrincipal from './pages/PaginaPrincipal/paginaprincipal';

/* Theme variables */
import './theme/variables.css';
import Simulacion from './pages/Simulacion/Simulacion';
setupIonicReact();

// Primero, se importan varios componentes de Ionic y se establece la configuración de IonicReact. Luego, se define el componente principal de la aplicación, App, que es una función de componente de React que devuelve una estructura de elementos de Ionic.

const App: React.FC = () => (
  // Dentro de App, se utiliza IonReactRouter para establecer la navegación de la aplicación y IonRouterOutlet para renderizar las páginas de la aplicación.

  // Se definen dos rutas utilizando Route y se especifica qué componente se debe renderizar para cada ruta. En este caso, PaginaPrincipal se renderiza para la ruta raíz y Simulacion se renderiza para la ruta "/simulacion".
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route exact path="">
          <PaginaPrincipal />
        </Route>
        <Route exact path="/simulacion">
          <Simulacion />
        </Route>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
