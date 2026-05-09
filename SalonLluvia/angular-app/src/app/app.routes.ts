import { Routes } from '@angular/router';

import { Home } from './components/home/home';
import { Gallery } from './components/gallery/gallery';
import { Services } from './components/services/services';
import { About } from './components/about/about';
import { Team } from './components/team/team';
import { Appointment } from './components/appointment/appointment';
import { Login } from './components/login/login';

const salon: string = "- Salon Lluvia";

export const routes: Routes = [
    {
        path: "",
        component: Home,
        title: `Realza su Belleza ${salon}`
    },
    {
        path:"galeria",
        component: Gallery,
        title: `Galería ${salon}`
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
    },
    {
        path: "account/login",
        component: Login,
        title: `Login ${salon}`
    }
];
