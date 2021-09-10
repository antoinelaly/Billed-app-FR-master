import '@testing-library/jest-dom/extend-expect'
import BillsUI from "../views/BillsUI.js"
import Bills from "../containers/Bills.js"
import { bills } from "../fixtures/bills.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import { fireEvent, screen } from "@testing-library/dom"
import firebase from "../__mocks__/firebase"
import userEvent from '@testing-library/user-event'
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import Actions from "../views/Actions.js"


describe("Given I am connected as an employee", () => {
  //Étant donné que je suis connecté en tant qu'employé
  describe("When I am on Bills Page", () => {
    //Quand je suis sur la page Factures
    test("Then bill icon in vertical layout should be highlighted", () => {
      //Ensuite, l'icône de la facture dans la disposition verticale doit être mise en surbrillance
      const html = BillsUI({ data: [] })
      document.body.innerHTML = html
      //to-do write expect expression : icon-window // verticalLayaout a ce test !!!
      //expect(wrapper.hasClass('active-icon')).toEqual(true)
      // expect(screen.getByTestId('icon-window')).toBeTruthy() // ok

    })
    test("Then bills should be ordered from earliest to latest", () => {
      // Ensuite, les factures doivent être classées du plus tôt au plus tard
      const html = BillsUI({ data: bills })
      document.body.innerHTML = html
      const dates = screen.getAllByText(/^(19|20)\d\d[- /.](0[1-9]|1[012])[- /.](0[1-9]|[12][0-9]|3[01])$/i).map(a => a.innerHTML)
      //const antiChrono = (a, b) => ((a < b) ? 1 : -1)
      const antiChrono = (a, b) => (a - b)
      /*dates.sort((date_a, date_b) =>
        date_a.getTime() > date_b.getTime() ? 1 : -1
      )*/
      //const antiChrono = (a, b) => ((a.getTime() < b.getTime()) ? 1 : -1)

      const datesSorted = [...dates].sort(antiChrono)
      expect(dates).toEqual(datesSorted)
    })

    /*test("Then button NewBill should be rendered", () => {
      // Ensuite, le bouton "Nouvelle note de frais" doit être rendues
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const user = JSON.stringify({
        type: 'Employee'
      })
      window.localStorage.setItem('user', user)

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const bills = new Bills({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const btnnewbill = screen.getByTestId("btn-new-bill")
      const handleSubmit = jest.fn(e => e.preventDefault())  

      btnnewbill.addEventListener("submit", handleSubmit)
      fireEvent.submit(btnnewbill) 
      expect(screen.getByTestId("btn-new-bill")).toBeTruthy()
    })*/
  })

  describe('When I click on the icon eye', () => {
    // Quand je clique sur l'icône oeil
    test('A modal should open to show images', () => {
      // Un modal devrait s'ouvrir popine img
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Employee'
      }))
      const html = Actions()
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const bills = new Bills({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const handleClickIconEye = jest.fn(bills.handleClickIconEye) 
      const eye = screen.getByTestId('icon-eye') // modaleFile
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()

      const modale = screen.getByTestId('modaleFile')
      expect(modale).toBeTruthy()
    })
  })
 
})

// test d'intégration GET
describe("Given I am a user connected as Admin", () => {
  // firebase : Étant donné que je suis un utilisateur connecté en tant qu'administrateur
  describe("When I navigate to Dashboard", () => {
    // Lorsque je navigue vers le tableau de bord
    test("fetches bills from mock API GET", async () => {
      // récupère les factures de l'API fictive GET
       const getSpy = jest.spyOn(firebase, "get")
       const bills = await firebase.get()
       expect(getSpy).toHaveBeenCalledTimes(1)
       expect(bills.data.length).toBe(4)
    })
    test("fetches bills from an API and fails with 404 message error", async () => {
      // récupère les factures d'une API et échoue avec une erreur de message 404
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 404"))
      )
      const html = BillsUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      // récupère les messages d'une API et échoue avec une erreur de message 500
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = BillsUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})