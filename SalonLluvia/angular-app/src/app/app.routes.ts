import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Services } from './components/services/services';

const salon: string = "- Salon Lluvia";

export const routes: Routes = [
    {
        path: "",
        component: Home,
        title: `Realza su Belleza ${salon}`
    },
    {
        path: "servicio",
        component: Services,
        title: `Servicios ${salon}`
    },
];
