import { screen } from "@testing-library/dom"
import NewBillUI from "../views/NewBillUI.js"
import NewBill from "../containers/NewBill.js"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"

describe("Given I am connected as an employee", () => {
  // Étant donné que je suis connecté en tant qu'employé
  describe("When I am on NewBill Page", () => {
    // Quand je suis sur la page NewBill
    test("Then 'Envoyer une note de frais' text should render ", () => {
      const html = NewBillUI()
      document.body.innerHTML = html
      expect(screen.getAllByText('Envoyer une note de frais')).toBeTruthy()
    })
    test("A modal should open ", () => {
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
    const newbill = new NewBill({
      document, onNavigate, firestore, localStorage: window.localStorage
    }) 
    // form-new-bill

    })
    test("Then button NewBill should be rendered", () => {
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
      const newbill = new NewBill({
        document, onNavigate, firestore, localStorage: window.localStorage
      })

      const datepicker = screen.getByTestId("datepicker")
      const handleSubmit = jest.fn(e => e.preventDefault())  

      /*datepicker.addEventListener("submit", handleSubmit)
      fireEvent.submit(datepicker) 
      expect(screen.getByTestId("btn-new-bill")).toBeTruthy()*/
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
  })
})