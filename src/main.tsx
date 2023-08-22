import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

//Este código importa React y la función createRoot de react-dom/client. Luego importa el componente App desde el archivo App.tsx.

// Después, se obtiene el elemento con el id root del documento HTML y se crea una raíz de React con createRoot. Finalmente, se renderiza el componente App dentro de un React.StrictMode en el elemento root.

// En resumen, este código inicializa una aplicación de React y renderiza el componente App en el elemento con el id root.
