Please note to check whether npm install also includes:
    npm install cross-env --save-dev

Script for installing both client and server dependancies at the same time:
    cd client/ && npm install && cd ../server/ && npm install && cd ..



    ---
    CLIENT SIDE:
    // npm install react-router-dom (client-kaustas)
/* nb! kuna meil on (minu pärast) vana vite, siis installimisel toob
esile vite-i 1 high-risk murekoha. 
gemini sõnul see vaid murekoht arenduse ajal serveripoolel (kui häkker samas
võrgus tahaks salafailidele ligi pääseda, siis potentsiaalselt saaks), kuid
mis ei kandu lõpptootesse üle.

npm audit fix uuendaks vite-i, aga kuna mul juust arvuti, siis pliis
ärme vaheta vite versiooni :D
*/