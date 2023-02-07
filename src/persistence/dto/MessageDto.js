class MessageDto {
  constructor({ id, date, message, email, firstName, lastName, age }) {
    this.id = id
    this.date = date
    this.message = message
    this.email = email,
    this.firstName = firstName,
    this.lastName = lastName,
    this.age = age
  }
}

module.exports = function formatDTO(messages) {
  if (Array.isArray(messages)) {
    return messages.map(obj => new MessageDto(obj))
  } else {
    return new MessageDto(messages)
  }
}