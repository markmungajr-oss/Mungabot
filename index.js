const { default: makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const P = require("pino");

const prefix = "."
const owner = "255763071896"

async function startBot(){
const { state, saveCreds } = await useMultiFileAuthState("session")

const sock = makeWASocket({
auth: state,
logger: P({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("messages.upsert", async ({ messages }) => {
const msg = messages[0]
if(!msg.message) return

const from = msg.key.remoteJid
const body = msg.message.conversation || msg.message.extendedTextMessage?.text || ""

if(!body.startsWith(prefix)) return

const command = body.slice(1).split(" ")[0].toLowerCase()
const args = body.split(" ").slice(1)

switch(command){

case "menu":
sock.sendMessage(from,{
text:`
╔═══〔 MUNGA JR BOT 〕═══╗
║ 🤖 AI
║ .ai swali
║
║ 🛠 TOOLS
║ .ping
║ .time
║ .owner
║
║ 👥 GROUP
║ .tagall
║
║ 🎮 FUN
║ .joke
║
╚══════════════════════╝
⚡ Powered by Munga Jr Tech
`
})
break

case "ping":
sock.sendMessage(from,{text:"🏓 Pong! Bot iko online."})
break

case "time":
sock.sendMessage(from,{text:"⏰ "+new Date().toLocaleString()})
break

case "owner":
sock.sendMessage(from,{text:"👑 Owner: 0763071896"})
break

case "joke":
sock.sendMessage(from,{text:"😂 Programmer mmoja aliulizwa: kwanini unakaa usiku? Akasema bugs hulala mchana!"})
break

case "ai":
if(!args[0]) return sock.sendMessage(from,{text:"Uliza swali baada ya .ai"})
sock.sendMessage(from,{text:"🤖 AI: Nafanyiwa kazi... (utaunganisha API baadaye)"})
break

}
})

}

startBot()
