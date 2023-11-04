const express = require("express");
const app = express();
const { toBuffer } = require("qrcode");
const CryptoJS = require("crypto-js");
const {
  default: makeWASocket,
  useSingleFileAuthState,
  Browsers,
  delay,
} = require("@whiskeysockets/baileys");

const pino = require("pino");
let PORT = process.env.PORT || 3030;

const PastebinAPI = require("pastebin-js"),
  pastebin = new PastebinAPI("h4cO2gJEMwmgmBoteYufW6_weLvBYCqT");
app.get("/", (req, res) => {
  const authfile = `./tmp/${makeid()}.json`;
  const { state } = useSingleFileAuthState(authfile, pino({ level: "silent" }));
  function Queen() {
    try {
      let session = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: "silent" }),
        browser: Browsers.macOS("Desktop"),
        downloadHistory: false,
        syncFullHistory: false,
      });

      session.ev.on("connection.update", async (s) => {
        if (s.qr) {
          res.end(await toBuffer(s.qr));
        }
        const { connection, lastDisconnect } = s;
        if (connection == "open") {
          await delay(500 * 10);
          let link = await pastebin.createPasteFromFile(
            authfile,
            "Queen-MD session",
            null,
            0,
            "N"
          );
          let data = link.replace("https://pastebin.com/", "");
          let code = btoa(data);
          var words = code.split("");
          var ress = words[Math.floor(words.length / 2)];
          let c = code.split(ress).join(ress + "");

          const ripo = ('𝚀𝚄𝙴𝙴𝙽 𝙼𝚄𝙻𝚃𝙸-𝙳𝙴𝚅𝙸𝙲𝙴 𝚆𝙷𝙰𝚃𝚂𝙰𝙿𝙿 𝙱𝙾𝚃');
          const templateMessage = {
            text: `\nᴅᴇᴀʀ ᴜsᴇʀ ᴛʜɪs ɪs ʏᴏᴜʀ sᴇssɪᴏɴ ɪᴅ`,
            footer: ripo,
          };

          await session.sendMessage(session.user.id, templateMessage);
          await session.sendMessage(session.user.id, { text: "Subscribe :- https://www.youtube.com/@darkwinzo" });
          await session.sendMessage(session.user.id, {text:`${c}`});

          await delay(3000 * 10);
          process.send("reset");
        }
        if (
          connection === "close" &&
          lastDisconnect &&
          lastDisconnect.error &&
          lastDisconnect.error.output.statusCode != 401
        ) {
          Queen();
        }
      });
    } catch (err) {
      console.log(
        err + "Unknown Error Occured Please report to Owner and Stay tuned"
      );
    }
  }

  Queen();
});
app.listen(PORT, () => console.log("App listened on port", PORT));

const encrypt = (text) => {
  return CryptoJS.AES.encrypt(text, (passphrase = "123")).toString();
};

const decrypt = (text) => {
  return CryptoJS.AES.decrypt(text, passphrase).toString();
};

function makeid(num = 9) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var characters9 = characters.length;
  for (var i = 0; i < num; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters9));
  }
  return result;
};

let encode = (f) => {
  return f.replace("=", "");
};
