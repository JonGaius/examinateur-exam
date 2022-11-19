import Setting from "../views/page/account/Setting"
import Login from "../views/page/auth/Login"
import ErrorPage from "../views/page/errors/ErrorPage"
import Appel from "../views/page/exam/Appel"
import Composition from "../views/page/exam/Composition"
import Finish from "../views/page/exam/Finish"
import Introduce from "../views/page/exam/Introduce"
import Test from "../views/page/exam/Test"
import Etats from "../views/page/examen/Etats"
import Examen from "../views/page/examen/Examen"
import Home from "../views/page/home/Home"

export const links = {
    home: "/",
    login: "/connexion",
    examens: "/liste-des-examens",
    examIntro: "/introduction-examen",
    examAppel: "/appel-examen",
    examTest: "/test-examen",
    examComposition: "/composition-examen",
    examCompositionFinish: "/fin-composition-examen",
    error: "/*",
    account: "/parametres-du-compte",
    etats: "/etats",
}

export const routes = [
    {
        path: links.home,
        Component: Home,
        exact: true,
    },
    {
        path: links.login,
        Component: Login,
        exact: true,
    },
    {
        path: links.examens,
        Component: Examen,
        exact: true,
    },
    {
        path: links.examIntro,
        Component: Introduce,
        exact: true,
    },
    {
        path: links.examAppel,
        Component: Appel,
        exact: true,
    },
    {
        path: links.examTest,
        Component: Test,
        exact: true,
    },
    {
        path: links.examComposition,
        Component: Composition,
        exact: true,
    },
    {
        path: links.examCompositionFinish,
        Component: Finish,
        exact: true,
    },
    {
        path: links.account,
        Component: Setting,
        exact: true,
    },
    {
        path: links.etats,
        Component: Etats,
        exact: true,
    },
    {
        path: links.error,
        Component: ErrorPage,
        exact: false,
    },
]