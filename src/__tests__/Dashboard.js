import { fireEvent, screen } from "@testing-library/dom"
import userEvent from '@testing-library/user-event'
import DashboardFormUI from "../views/DashboardFormUI.js"
import DashboardUI from "../views/DashboardUI.js"
import Dashboard, { filteredBills, cards } from "../containers/Dashboard.js"
import { ROUTES } from "../constants/routes"
import { localStorageMock } from "../__mocks__/localStorage.js"
import firebase from "../__mocks__/firebase"
import { bills } from "../fixtures/bills"


describe('Given I am connected as an Admin', () => {
  // Containers : Étant donné que je suis connecté en tant qu'administrateur
  describe('When I am on Dashboard page, there are bills, and there is one pending', () => {
    // Quand je suis sur la page Tableau de bord, il y a des factures, et il y en a une en attente
    test('Then, filteredBills by pending status should return 1 bill', () => {
      // Ensuite, les factures filtrées par statut en attente devraient renvoyer 1 facture
      const filtered_bills = filteredBills(bills, "pending")
      expect(filtered_bills.length).toBe(1)
    })
  })
  describe('When I am on Dashboard page, there are bills, and there is one accepted', () => {
    // Containers : Quand je suis sur la page Tableau de bord, il y a des factures, et il y en a une acceptée
    test('Then, filteredBills by accepted status should return 1 bill', () => {
      // Ensuite, les factures filtrées par statut accepté devraient renvoyer 1 facture
      const filtered_bills = filteredBills(bills, "accepted")
      expect(filtered_bills.length).toBe(1)
    })
  })
  describe('When I am on Dashboard page, there are bills, and there is two refused', () => {
    // Containers : Quand je suis sur la page Tableau de bord, il y a des factures, et il y en a deux refusées
    test('Then, filteredBills by accepted status should return 2 bills', () => {
      // Ensuite, les factures filtrées par statut accepté devraient renvoyer 2 factures
      const filtered_bills = filteredBills(bills, "refused")
      expect(filtered_bills.length).toBe(2)
    })
  })
  describe('When I am on Dashboard page but it is loading', () => {
    // Quand je suis sur la page du tableau de bord mais qu'il se charge
    test('Then, Loading page should be rendered', () => {
      // Ensuite, la page de chargement doit être rendue
      const html = DashboardUI({ loading: true })
      document.body.innerHTML = html
      expect(screen.getAllByText('Loading...')).toBeTruthy()
    })
  })
  describe('When I am on Dashboard page but back-end send an error message', () => {
    // Lorsque je suis sur la page du tableau de bord mais que le back-end envoie un message d'erreur
    test('Then, Error page should be rendered', () => {
      // Ensuite, la page d'erreur doit être rendue
      const html = DashboardUI({ error: 'some error message' })
      document.body.innerHTML = html
      expect(screen.getAllByText('Erreur')).toBeTruthy()
    })
  })

  describe('When I am on Dashboard page and I click on arrow', () => {
    // Containers : Quand je suis sur la page Tableau de bord et que je clique sur la flèche
    test('Then, tickets list should be unfolding, and cards should contain first and lastname', async () => {
      // Ensuite, la liste des billets devrait se dérouler, et les cartes devraient contenir le prénom et le nom.
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))

      const dashboard = new Dashboard({
        document, onNavigate, firestore: null, bills, localStorage: window.localStorage
      })          
      const html = DashboardUI({ data: bills })
   
      document.body.innerHTML = html

      const handleShowTickets1 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 1)) 
      const handleShowTickets2 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 2))    
      const handleShowTickets3 = jest.fn((e) => dashboard.handleShowTickets(e, bills, 3))    

      const icon1 = screen.getByTestId('arrow-icon1')
      const icon2 = screen.getByTestId('arrow-icon2')
      const icon3 = screen.getByTestId('arrow-icon3')

      icon1.addEventListener('click', handleShowTickets1)
      userEvent.click(icon1)
      expect(handleShowTickets1).toHaveBeenCalled()
      userEvent.click(icon1)

      icon2.addEventListener('click', handleShowTickets2)
      userEvent.click(icon2)
      expect(handleShowTickets2).toHaveBeenCalled()

      icon3.addEventListener('click', handleShowTickets3)
      userEvent.click(icon3)
      expect(handleShowTickets3).toHaveBeenCalled()

    })
  })

  describe('When I am on Dashboard page and I click on edit icon of a card', () => {
    // Containers : Lorsque je suis sur la page Tableau de bord et que je clique sur l'icône d'édition d'une carte
    test('Then, right form should be filled', () => {
      // Ensuite, le bon formulaire doit être rempli
      const html = cards(bills)
      document.body.innerHTML = html

      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null

      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const handleEditTicket = jest.fn((e) => dashboard.handleEditTicket(e, bills[0], bills))   
      const iconEdit = screen.getByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      iconEdit.addEventListener('click', handleEditTicket)
      userEvent.click(iconEdit)
      expect(handleEditTicket).toHaveBeenCalled()
      userEvent.click(iconEdit)
      expect(handleEditTicket).toHaveBeenCalled()
    })
  })

  describe('When I am on Dashboard and there are no bills', () => {
    // Containers : Quand je suis sur Dashboard et qu'il n'y a pas de factures
    test('Then, no cards should be shown', () => {
      // Ensuite, aucune carte ne doit être montrée
      const html = cards([])
      document.body.innerHTML = html

      const iconEdit = screen.queryByTestId('open-bill47qAXb6fIm2zOKkLzMro')
      expect(iconEdit).toBeNull()
    })
  })
})

describe('Given I am connected as Admin, and I am on Dashboard page, and I clicked on a pending bill', () => {
  // Containers : Étant donné que je suis connecté en tant qu'administrateur et que je suis sur la page du tableau de bord, j'ai cliqué sur une facture en attente
  describe('When I click on accept button', () => {
    // Quand je clique sur le bouton accepter
    test('I should be sent on Dashboard with big billed icon instead of form', () => {
      // Je devrais être envoyé sur le tableau de bord avec une grosse icône de facturation au lieu du formulaire
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardFormUI(bills[0])
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const acceptButton = screen.getByTestId("btn-accept-bill-d")
      const handleAcceptSubmit = jest.fn((e) => dashboard.handleAcceptSubmit(e, bills[0]))
      acceptButton.addEventListener("click", handleAcceptSubmit)
      fireEvent.click(acceptButton)
      expect(handleAcceptSubmit).toHaveBeenCalled()
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })
  describe('When I click on refuse button', () => {
    // Containers : Quand je clique sur le bouton refuser
    test('I should be sent on Dashboard with big billed icon instead of form', () => {
      // Je devrais être envoyé sur le tableau de bord avec une grosse icône de facturation au lieu du formulaire
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardFormUI(bills[0])
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })
      const refuseButton = screen.getByTestId("btn-refuse-bill-d")
      const handleRefuseSubmit = jest.fn((e) => dashboard.handleRefuseSubmit(e, bills[0]))
      refuseButton.addEventListener("click", handleRefuseSubmit)
      fireEvent.click(refuseButton)
      expect(handleRefuseSubmit).toHaveBeenCalled()
      const bigBilledIcon = screen.queryByTestId("big-billed-icon")
      expect(bigBilledIcon).toBeTruthy()
    })
  })
})

describe('Given I am connected as Admin and I am on Dashboard page and I clicked on a bill', () => {
  // Containers : Étant donné que je suis connecté en tant qu'administrateur et que je suis sur la page du tableau de bord et que j'ai cliqué sur une facture
  describe('When I click on the icon eye', () => {
    // Quand je clique sur l'icône oeil
    test('A modal should open', () => {
      // Un modal devrait s'ouvrir
      Object.defineProperty(window, 'localStorage', { value: localStorageMock })
      window.localStorage.setItem('user', JSON.stringify({
        type: 'Admin'
      }))
      const html = DashboardFormUI(bills[0])
      document.body.innerHTML = html
      const onNavigate = (pathname) => {
        document.body.innerHTML = ROUTES({ pathname })
      }
      const firestore = null
      const dashboard = new Dashboard({
        document, onNavigate, firestore, bills, localStorage: window.localStorage
      })

      const handleClickIconEye = jest.fn(dashboard.handleClickIconEye) // handleClickIconEye
      const eye = screen.getByTestId('icon-eye-d')
      eye.addEventListener('click', handleClickIconEye)
      userEvent.click(eye)
      expect(handleClickIconEye).toHaveBeenCalled()

      const modale = screen.getByTestId('modaleFileAdmin')
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
      const html = DashboardUI({ error: "Erreur 404" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 404/)
      expect(message).toBeTruthy()
    })
    test("fetches messages from an API and fails with 500 message error", async () => {
      // récupère les messages d'une API et échoue avec une erreur de message 500
      firebase.get.mockImplementationOnce(() =>
        Promise.reject(new Error("Erreur 500"))
      )
      const html = DashboardUI({ error: "Erreur 500" })
      document.body.innerHTML = html
      const message = await screen.getByText(/Erreur 500/)
      expect(message).toBeTruthy()
    })
  })
})

