Kuidas kliendi pool tööle saada?
Mine oma projekti kausta (sinna, kuh lood client.js) ja käivita:

npm init -y
npm install socket.io-client

See teeb kaks asja:

Loob npm package.json faili (kui seda veel pole)

Laeb alla socket.io-client paketi kausta node_modules

Kuna kasutad import süntaksit (ES modules), siis peab package.json failis olema:

{
  "type": "module"
}

Kui seda pole, siis Node eeldab CommonJS-i ja võib tekitada teise vea.

---
🛠 Kuidas server tööle saada

Mine projekti kausta ja käivita:
npm init -y
npm install socket.io socket.io-client

Seejärel lisa ise package.json faili:

{
  "type": "module"
}