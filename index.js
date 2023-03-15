// Supports ES6
// import { create, Whatsapp } from 'venom-bot';
const venom = require('venom-bot');

const Atheneum = require("./db")

const EmojiSense = require("./services/emojiSense")

const asdfjkl = require("asdfjkl").default

const MatchService = require("./services/matcher")
const Override = require("./services/override")

venom
  .create({
    session: 'SessionOne', //name of session
    multidevice: true
  })
  .then((client) => start(client))
  .catch((erro) => {
    console.log(erro);
  });

function DieRoll() {
  return Math.floor(Math.random() * 6)
}

function ReplyConditions(message) {
  return ((message.text) && (
    message.text.toLowerCase().includes("bella") ||
    message.text.toLowerCase().includes("everyone") ||
    message.text.toLowerCase().includes("@2348117709515") ||
    message.quotedParticipant === "2348117709515@c.us" ||
    !message.isGroupMsg ||
    DieRoll() === 1
  ))
}

function ReplyMessage(client, chatId, reply, id) {
  client.sendMessageOptions(chatId, reply, {quotedMessageId: id}).then((retorno) => {resp = retorno}).catch((e) => {console.log(e)});
  client.stopTyping(chatId)
}

function start(client) {
  client.onMessage((message) => {
    // console.log(message)

    try {
      let matchIndex = -1;
      let reply = "";
      let keys = [];
      let replies = [];
      let index = -1;

      if (message.text === "Protocol: Meta") {
        reply = "Name: QueenBella\nDesc: WhatsApp bot for DeathTrap ESports.\nVersion: 1.0.5"
        client.startTyping(message.chatId);
        setTimeout(() => ReplyMessage(client, message.chatId, reply, message.id), 3000)
        return;
      }

      if (!ReplyConditions(message) || message.type === "image") return;

      if (message.text.replace("@2348117709515", "").length === 0) {
        replies = ["What?", "What's up?", "Yes?", "Wassup?"]
        reply = replies[Math.floor(Math.random() * replies.length)]
        
        client.startTyping(message.chatId);
        setTimeout(() => ReplyMessage(client, message.chatId, reply, message.id), 3000)
        return;
      }

      matchIndex = MatchService.GetMatch(Override.pictureRequest, message.text, 0.6)
      if (matchIndex >= 0) {
        replies = ["Try not to fall in love 😉", "Here's me 😊", "Queen Bella ❤", "Don't fall in love okay? 😏"]
        reply = replies[Math.floor(Math.random() * replies.length)]
        client.sendFile(message.chatId, './assets/selfies/pfp1.png', 'QueenBella', reply).then((retorno) => {resp = retorno}).catch((erro) => {console.error('Error when sending: ', erro);});
        // client.sendImage(message.chatId, './assets/selfies/pfp1.png', 'QueenBella', reply).catch((error) => {console.log("Image Error: ", error)});
        return;
      }

      if (asdfjkl(message.text) && MatchService.GetMatch(Override.allowedGibberish, message.text, 0.6) < 0) {
        reply = Override.gibberish[Math.floor(Math.random() * Override.gibberish.length)]
        if (reply) {
          client.startTyping(message.chatId);
          setTimeout(() => ReplyMessage(client, message.chatId, reply, message.id), 3000)
        }
        return;
      }

      matchIndex = MatchService.PureMatch(Override.convoTrigger, message.text, 0.6)
      if (matchIndex >= 0) {
        reply = Override.convoStarter[Math.floor(Math.random() * Override.convoStarter.length)]
        if (reply) {
          client.startTyping(message.chatId);
          setTimeout(() => ReplyMessage(client, message.chatId, reply, message.id), 3000)
        }
        return;
      }

      matchIndex = MatchService.PureMatch(Override.jokeTrigger, message.text, 0.6)
      if (matchIndex >= 0) {
        reply = Override.jokes[Math.floor(Math.random() * Override.jokes.length)]
        if (reply) {
          client.startTyping(message.chatId);
          setTimeout(() => ReplyMessage(client, message.chatId, reply, message.id), 3000)
        }
        return;
      }
      
      matchIndex = MatchService.GetMatch(Object.keys(Atheneum), message.text, 0.6)
      if (matchIndex >= 0) {
        keys = Object.keys(Atheneum)
        index = keys.indexOf(keys[matchIndex])
        reply = Atheneum[keys[index]]
        reply = reply[Math.floor(Math.random() * reply.length)]
        if (reply) {
          client.startTyping(message.chatId);
          setTimeout(() => ReplyMessage(client, message.chatId, reply, message.id), 3000)
        }
        return;
      }

      for (let i = 0; i < EmojiSense.length; i++) {
        let range = EmojiSense[i].target;
        for (let x = 0; x < range.length; x++) {
            if (message.text.includes(range[x])) {
                let replies = EmojiSense[i].result;
                let reply = replies[Math.floor(Math.random() * replies.length)]

                if (reply) {
                  client.startTyping(message.chatId);
                  setTimeout(() => ReplyMessage(client, message.chatId, reply, message.id), 3000)
                }
                return;
            }
        }
    }

      return;
    } catch (error) {
      console.log("Error: ", error)
    }
  });

  
  client.onIncomingCall((call) => {
    let replies = ["I can't take calls right now!", "Don't call me! Can't you text?", "I don't take calls..."]
    let reply = replies[Math.floor(Math.random() * replies.length)]
    client.sendText(call.peerJid, reply);
  });

}