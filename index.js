const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion } = require("@whiskeysockets/baileys")
const P = require("pino")
const express = require("express")

const app = express()
const PORT = process.env.PORT || 3000

const prefix = "."
const owner = "255763071896"

app.get("/", (req,res)=>{
res.send("MUNGA JR BOT RUNNING ✅")
})

async function startBot(){

const { state, saveCreds } = await useMultiFileAuthState("session")
const { version } = await fetchLatestBaileysVersion()

const sock = makeWASocket({
version,
auth: state,
logger: P({ level: "silent" })
})

sock.ev.on("creds.update", saveCreds)

sock.ev.on("messages.upsert", async ({ messages }) => {

const msg = messages[0]
if(!msg.message) return

const from = msg.key.remoteJid
const isGroup = from.endsWith("@g.us")

const body =
msg.message.conversation ||
msg.message.extendedTextMessage?.text ||
""

if(!body.startsWith(prefix)) return

const command = body.slice(1).split(" ")[0].toLowerCase()
const args = body.split(" ").slice(1)

switch(command){

case "menu":

sock.sendMessage(from,{
text:`
╔═══〔 MUNGA JR BOT 〕═══╗
║
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

sock.sendMessage(from,{ text:"🏓 Pong! Bot iko online." })

break


case "time":

sock.sendMessage(from,{
text:"⏰ "+new Date().toLocaleString()
})

break


case "owner":

sock.sendMessage(from,{
text:"👑 Owner: 0763071896"
})

break


case "joke":

sock.sendMessage(from,{
text:"😂 Programmer mmoja aliulizwa kwanini analala saa 8 usiku. Akasema: bugs hulala mchana!"
})

break


case "tagall":

if(!isGroup){
sock.sendMessage(from,{ text:"Hii command ni ya group tu." })
return
}

const metadata = await sock.groupMetadata(from)
let teks = "👥 TAG ALL\n\n"

let members = []

for(let mem of metadata.participants){
members.push(mem.id)
teks += "@" + mem.id.split("@")[0] + "\n"
}

sock.sendMessage(from,{
text: teks,
mentions: members
})

break


case "ai":

if(!args[0]){
sock.sendMessage(from,{
text:"Uliza swali baada ya .ai"
})
return
}

let question = args.join(" ")

sock.sendMessage(from,{
text:"🤖 AI Response:\n\nNimepokea swali lako: "+question+"\n\n(unganisha AI API baadaye)"
})

break

}

})

}

startBot()

app.listen(PORT,()=>{
console.log("Server running on port "+PORT)
})
