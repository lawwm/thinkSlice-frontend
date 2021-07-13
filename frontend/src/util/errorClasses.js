export class NonFieldError extends Error {
  constructor(message) {
    super(message)

    this.response = new Response(message)
    this.response.data = {
      non_field_errors: [message]
    }
  }
}

export class CustomError extends Error {
  constructor(message) {
    super(message)

    this.response = new Response(message)
    this.response.data = message
  }
}