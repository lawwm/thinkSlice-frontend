import "cypress-localstorage-commands"
const loginData = {
  username: 'jimijam',
  password: 'password'
}

const modalEditData = {
  bio: "I am cool",
  whatsapp: '87654321',
  tutor: '3',
  available: 'available',
  location: 'west',
  checkbox: 'Arts',
  qualifications: 'Secondary school tutor'
}

const videoEditData = {
  title: 'Amazing video',
  subject: 'Biology',
  description: 'Fake description woop woop'
}

const reviewPostData = {
  title: "Amazing",
  description: "Truly life changing",
  stars: '5'
}

const reviewEditData = {
  title: "Very Amazing",
  description: "Truly the best and life changing",
  stars: '4'
}


describe('Profile', () => {
  beforeEach(() => {
    cy.request('POST', 'localhost:8000/api/auth/login',
      loginData
    ).as('login').then((res) => {
      cy.setLocalStorage('username', res.body.user.username)
      cy.setLocalStorage('token', res.body.token)
      cy.setLocalStorage('user', res.body.user.id)
    })
  })

  it('Edit profile', () => {
    //Go to profile page
    cy.visit('/')
    assert.exists(cy.contains('Profile'), { timeout: 10000 })
    cy.contains('Profile').click({ force: true })

    //Edit modal
    assert.exists(cy.contains('Details', { timeout: 10000 }))
    cy.contains('Details').click({ force: true })
    assert.exists(cy.get('button.btn-modal'))
    cy.get('button.btn-modal').click({ force: true })

    //Input fields
    cy.get('textarea[name=user_bio]').clear().type(modalEditData.bio)
    cy.get('input[name=tutor_whatsapp]').clear().type(modalEditData.whatsapp)
    cy.contains('Page 2').click()
    cy.get('select[name=is_tutor]').select(modalEditData.tutor)
    cy.get('select[name=is_available]').select(modalEditData.available)
    cy.contains('Page 3').click()
    cy.get('select[name=location]').select(modalEditData.location)
    cy.get(`input[id=checkbox-${modalEditData.checkbox}]`).click()
    cy.get('textarea[name=qualifications]').clear().type(modalEditData.qualifications)

    //Save changes
    cy.get('button.btn-modal').click()
    cy.contains(modalEditData.whatsapp, { timeout: 10000 })
  })

  it('Edit Video', () => {
    //Go to profile page
    cy.visit('/')
    cy.contains('Profile').click({ force: true })

    //Input fields
    cy.get('div[class=thumbnail-subject-edit]', { timeout: 10000 })
    cy.get('div[class=thumbnail-subject-edit]').click()
    cy.get('input[name=video_title]').clear().type(videoEditData.title)
    cy.get('select[name=subject]').select(videoEditData.subject)
    cy.get('textarea[name=video_description]').clear().type(videoEditData.description)

    //Save changes
    cy.get('button.btn-review-custom').click()
    cy.contains(videoEditData.title, { timeout: 10000 })
    cy.contains(videoEditData.subject)
  })

  it('Post/Edit/Delete review', () => {
    //Go to review page and open post review modal
    cy.visit('/')
    cy.get('div[class="thumbnail-photo"]', { timeout: 10000 })
    cy.get('div[class="thumbnail-photo"]').first().click()
    assert.exists(cy.contains('Reviews', { timeout: 10000 }))
    cy.contains('Reviews').click({ force: true })
    assert.exists(cy.contains('Post review', { timeout: 20000 }))
    cy.contains('Post review').click()

    //Enter post review input
    cy.get('input[name=review_title]').clear().type(reviewPostData.title)
    cy.get('textarea[name=review_essay]').clear().type(reviewPostData.description)
    cy.get('[data-testid=star]').last().click()
    cy.get('button[type="Submit"]').click()

    //Check review has been created
    cy.contains(reviewPostData.title, { timeout: 10000 })

    //Enter edit review input
    cy.get('button[aria-label="show edit modal"]').click()
    cy.get('input[name=review_title]').clear().type(reviewEditData.title)
    cy.get('textarea[name=review_essay]').clear().type(reviewEditData.description)
    cy.get('[data-testid=star]').first().click()
    cy.get('button[aria-label="submit edit modal"]').click()

    //Check review has been edited
    cy.contains(reviewEditData.title)

    //Delete review
    cy.get('button[aria-label="show delete modal"]').click()
    cy.get('button[aria-label="submit delete modal"]').click()

    //Check that review has been deleted
    cy.contains(reviewEditData.title).should('not.exist')
  })

})