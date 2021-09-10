import { ROUTES, ROUTES_PATH } from "../constants/routes"
import { screen } from "@testing-library/dom"

const data = []
const loading = false
const error = null

describe('Given I am connected and I am on some page of the app', () => {
  // Étant donné que je suis connecté et que je suis sur une page de l'application
  describe('When I navigate to Login page', () => {
    // Lorsque je navigue vers la page de connexion
    test(('Then, it should render Login page'), () => {
      // Ensuite, il devrait rendre la page de connexion
      const pathname = ROUTES_PATH['Login']
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Administration')).toBeTruthy()
    })
  })
  describe('When I navigate to Bills page', () => {
    // Lorsque je navigue vers la page Factures
    test(('Then, it should render Bills page'), () => {
      // Ensuite, il devrait rendre la page Bills
      const pathname = ROUTES_PATH['Bills']
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Mes notes de frais')).toBeTruthy()
    })
  })
  describe('When I navigate to NewBill page', () => {
    // Lorsque je navigue vers la page NewBill
    test(('Then, it should render NewBill page'), () => {
      // Ensuite, il devrait rendre la page NewBill
      const pathname = ROUTES_PATH['NewBill']
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
  })
  describe('When I navigate to Dashboard', () => {
    // Lorsque je navigue vers le tableau de bord
    test(('Then, it should render Dashboard page'), () => {
      // Ensuite, il devrait rendre la page du tableau de bord
      const pathname = ROUTES_PATH['Dashboard']
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Validations')).toBeTruthy()
    })
  })
  describe('When I navigate to anywhere else other than Login, Bills, NewBill, Dashboard', () => {
    // Lorsque je navigue ailleurs que sur Login, Bills, NewBill, Dashboard
    test(('Then, it should render Loginpage'), () => {
      // Ensuite, il devrait rendre la page de connexion
      const pathname = '/anywhere-else'
      const html = ROUTES({ 
        pathname,
        data,
        loading,
        error
       })
       document.body.innerHTML = html
       expect(screen.getAllByText('Administration')).toBeTruthy()
    })
  })
})
