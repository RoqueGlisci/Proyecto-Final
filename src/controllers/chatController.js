const chatService= require('../business/chatService')

async function getAllMessages(req, res) {
  try {
    const allMessages = await chatService.allMessages();
    res.json(allMessages);
  } catch (error) {
    res.json([]);
  }
}

async function getTestMessages(req, res) {
  try {
    const messages = await chatService.getAllMessagesNormalized()
    res.json(messages)
  } catch (error) {
    res.json([])
  }
}

async function postMessage(req, res) {
  try {
    const { email, firstname, lastName, age, nick, avatar, text } = req.body
    const messageID = await chatService.addMessage({ email, firstname, lastName, age, nick, avatar, text })
    res.json({ messageID })
  } catch (error) {
    res.status(500).json({ error: error.message || 'Error al agregar mensaje' })
  }
}

module.exports = {
  getAllMessages,
  postMessage,
  getTestMessages,
}
