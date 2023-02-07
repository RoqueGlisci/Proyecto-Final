const chatPersistence = require('../persistence/chatPersistence')
const logger = require('../middlewares/logger')

async function allMessages() {
  return chatPersistence.getAllMessages();
}

async function getTestMessages() {
  return chatPersistence.getAllMessagesNormalized()
}

async function addMessage({ email, firstName, lastName, age, text }) {
  try {
    const isError = validateMessage({email, text})
    if(isError) throw new Error(isError)

    const res = chatPersistence.addMessageWithAuthor({ email, firstName, lastName, age, text })
    logger.info(`Registro de mensaje de ${email} exitosa`)
    return res
  } catch (error) {
    logger.error('Error en addMessage: ' + error.message)
    return error
  }
}

function validateMessage({email, text}) {
  const emailFormat =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  if (!email.trim() || !text.trim()) {
    return 'faltan datos en el mensaje'
  } else if (emailFormat.test(email) === false) {
    return 'Correo invalido'
  }
  return false
}

module.exports = {
  allMessages,
  getTestMessages,
  addMessage,
}
