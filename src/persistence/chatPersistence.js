const MessageRepository = require('./repository/MessageRepository')
const messageRepository = new MessageRepository()
const { normalize, schema } = require('normalizr')

function getAllMessages() {
  return messageRepository.getAll()
}

function addMessage({ email, firstName, lastName, message, date }) {
  const newMessage = { email, firstName, lastName, message, date }
  return messageRepository.save(newMessage)
}

async function getAllMessagesNormalized() {
  try {
    const authorSchema = new schema.Entity('authors')
    const messageSchema = new schema.Entity('messages', {
      author: authorSchema,
    })
    const chat = new schema.Entity('chat', {
      messages: [messageSchema],
    })
    const messages = await messageRepository.getAll()
    const data = { id: 'general', messages }
    const dataNormalized = await normalize(data, chat)
    return dataNormalized
  } catch (error) {
    throw new Error(error)
  }
}

function addMessageWithAuthor({
  email,
  firstName,
  lastName,
  age,
  text,
}) {
  const newMessage = {
    author: { id: email, firstName, lastName, age },
    text,
    date: Date.now(),
  }
  return messageRepository.save(newMessage)
}

module.exports = {
  getAllMessages,
  addMessage,
  addMessageWithAuthor,
  getAllMessagesNormalized,
}
