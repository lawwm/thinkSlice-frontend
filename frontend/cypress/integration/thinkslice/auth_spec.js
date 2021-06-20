//yarn run cypress open
const loginData = {
  username: 'jimijam',
  password: 'password'
}

const registerData = {
  username: 'testacc',
  password: 'password',
  email: 'fakeacc@gmail.com'
}

Cypress.Commands.add('login', () => {
  cy.request('POST', 'localhost:8000/api/auth/login',
    loginData
  ).as('login').then((res) => {
    window.localStorage.setItem('username', res.body.user.username)
    window.localStorage.setItem('token', res.body.token)
    window.localStorage.setItem('user', res.body.user.id)
    cy.log(window.localStorage)
  })
})

describe('Authentication', () => {
  it('can login', () => {
    cy.visit('/login')

    cy.get('input[name=username]').type(loginData.username)
    cy.get('input[name=password]').type(`${loginData.password}`)
    cy.contains('Submit').click()

    //Alert show login successful, navbar shows profile
    cy.contains('Profile', { timeout: 10000 })
  })

  it('can logout', () => {
    cy.login()
    cy.contains('Logout').click({ force: true })

    //Alert show see u next time, navbar shows register, login
    cy.contains('See you next time!')
    cy.contains('Register')
    cy.contains('Login')
  })

  it('can register and delete profile', () => {
    cy.visit('/register')

    cy.get('input[name=username]').type(registerData.username)
    cy.get('input[name=email]').type(registerData.email)
    cy.get('input[name=password]').type(`${registerData.password}`)
    cy.get('input[name=confirmPassword]').type(`${registerData.password}`)
    cy.contains('Submit').click()

    assert.exists(cy.get('div[class="home-video-row"]', { timeout: 10000 }))
    cy.contains('Profile').click({ force: true })
    assert.exists(cy.contains('Details', { timeout: 10000 }))
    cy.contains('Details').click()
    assert.exists(cy.contains('Delete account'))
    cy.contains('Delete account').click()
    cy.contains('Delete my account').click()
    assert.exists(cy.contains('Log in to start learning', { timeout: 10000 }))
  })
})

