export interface Route {
    path: string;
    url?: string;
    label: string;
  }
  
  export const routes: Route[] = [
    { path: '/logo', label: 'Logo' },
    { path: '/inicio', url: 'http://192.168.0.197:3000/', label: 'Inicio' },
    { path: '/nosotros', label: 'Sobre Nosotros' },
    { path: '/servicios', label: 'Áreas de Investigación' },
    { path: '/formacion', label: 'Formación y Capacitación' },
    { path: '/alianzas', label: 'Alianzas Estratégicas' },
    { path: '/participa', label: 'Participa con Nosotros' },
    { path: '/divulgacion', label: 'Divulgación Cientifica' },
    { path: '/contacto', label: 'Contacto' },
  ];
  