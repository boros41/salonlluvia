import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Services } from './components/services/services';
import { About } from './components/about/about';
import { Team } from './components/team/team';
import { Appointment } from './components/appointment/appointment';

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
    {
        path: "nosotros",
        component: About,
        title: `Sobre Nosotros ${salon}`
    },
    {
        path: "equipo",
        component: Team,
        title: `Equipo ${salon}`
    },
    {
        path: "cita",
        component: Appointment,
        title: `Cita ${salon}`
    }
];
