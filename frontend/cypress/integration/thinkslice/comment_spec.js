import "cypress-localstorage-commands"
const loginData = {
  username: 'jimijam',
  password: 'password'
}

const commentData = {
  comment: "Hi I love your videos",
  editComment: "You are really really cool"
}

const replyData = {
  comment: "I agree with your comment",
  editComment: "I disagree with your comment"
}

describe('Comments', () => {
  beforeEach(() => {
    cy.request('POST', 'localhost:8000/api/auth/login',
      loginData
    ).as('login').then((res) => {
      cy.setLocalStorage('username', res.body.user.username)
      cy.setLocalStorage('token', res.body.token)
      cy.setLocalStorage('user', res.body.user.id)
    })
  })

  it('check search and filter works', () => {
    cy.visit('/')
    assert.exists(cy.get('div[class="home-video-row"]', { timeout: 10000 }))
    cy.get('input[aria-label="searchbar"]').type("sauce{enter}")
    assert.exists(cy.contains("Pearsauce", { timeout: 10000 }))
    assert.exists(cy.get('input[id="checkbox-Arts"]'))
    cy.get('input[id="checkbox-Arts"]').click()
    assert.exists(cy.contains("Pearsauce", { timeout: 10000 }))
    cy.contains("Pearsauce").should('have.length', 1)
  })

  it('Post/Edit/Delete comments', () => {
    //Enter watch page
    cy.visit('/')
    assert.exists(cy.get('div[class="home-video-row"]', { timeout: 10000 }))
    cy.get('div[class="home-video-row"]').first().click()

    //Click show comment
    assert.exists(cy.get('button[class=video-description-btn]', { timeout: 10000 }))
    cy.get('button[class=video-description-btn]').click()
    assert.exists(cy.get('div[class=video-add-comment-button]'))
    cy.get('div[class=video-add-comment-button]').click()

    //Post comment input
    assert.exists(cy.get('textarea[class=form-control]'))
    cy.get('textarea[class=form-control]').clear().type(commentData.comment)
    assert.exists(cy.get('button[class="btn-comment-custom btn btn-primary"]'))
    cy.get('button[class="btn-comment-custom btn btn-primary"]').click()

    //Check that comment has been submitted
    assert.exists(cy.contains(commentData.comment, { timeout: 10000 }))

    //Edit comment input
    assert.exists(cy.get('button[aria-label="edit comment show"]'))
    cy.get('button[aria-label="edit comment show"]').first().click()
    cy.get('textarea[class="form-control"]').clear().type(commentData.editComment)
    cy.get('button[aria-label="edit comment submit"]').first().click()

    //Check that comment has been edited
    assert.exists(cy.contains(commentData.editComment, { timeout: 10000 }))

    //Post reply
    assert.exists(cy.get('button[aria-label="reply comment show"]'))
    cy.get('button[aria-label="reply comment show"]').first().click()
    assert.exists(cy.get('textarea[name="reply"]'))
    cy.get('textarea[name="reply"]').type(replyData.comment)
    cy.get('button[aria-label="reply comment submit"]').first().click()

    //Check reply has been created
    assert.exists(cy.get('button[class="replies-button"]', { timeout: 20000 }))
    cy.get('button[class="replies-button"]').first().click()
    cy.contains(replyData.comment, { timeout: 10000 })

    //Edit reply
    assert.exists(cy.get('button[aria-label="edit reply show"]', { timeout: 10000 }))
    cy.get('button[aria-label="edit reply show"]').first().click()
    assert.exists(cy.get('textarea[name="edit"]'))
    cy.get('textarea[name="edit"]').first().clear().type(replyData.editComment)
    cy.get('button[aria-label="edit reply submit"]').click()

    //Check reply has been edited
    assert.exists(cy.contains(replyData.editComment, { timeout: 10000 }))

    //Delete reply
    assert.exists(cy.get('button[aria-label="delete reply show"]'))
    cy.get('button[aria-label="delete reply show"]').first().click()
    assert.exists(cy.get('button[aria-label="delete reply submit"]'))
    cy.get('button[aria-label="delete reply submit"]').first().click()

    //Check that reply does not exist
    cy.contains(replyData.editComment, { timeout: 10000 }).should('not.exist')


    //Delete comment
    assert.exists(cy.get('button[aria-label="delete comment show"]'))
    cy.get('button[aria-label="delete comment show"]').click()
    assert.exists(cy.get('button[aria-label="delete comment submit"]'))
    cy.get('button[aria-label="delete comment submit"]').click()

    //Check that comment does not exist
    cy.contains(commentData.editComment, { timeout: 10000 }).should('not.exist')
  })

})