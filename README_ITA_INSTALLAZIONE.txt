Guida installazione apps, (testata con sistema ibrido windows+linux)

L'applicazione comprende 3 diversi file principali: app.py presente nella directory principale, appServer.js e supplychain.js
presenti nella cartella in "linux_files".

App.py ha bisogno di Ollama https://ollama.com/download, una volta scaricato bisogna scaricare uno dei LLM che si vogliono utilizzare:
consiglio: llama3 o gemma2.

-ollama run llama3

questo comando scaricherà il modello llama3, dopodichè bisogna installare i requirements, tramite:

-pip install requirements.txt

questo comando dovrebbe installare langchain_commmunity, flask e requests. Nel caso non funzioni importare singolarmente ciascuno.

Una volta eseguito ciò si può già provare a lanciare il programma app.py, che una volta scannerizzato il qr code restituirà errore in quanto
non potrà connettersi a nessun server.

Per connettersi ai server c'è necessità di installare linux (il programma è stato testato su ubuntu 22.04).
una volta installato navigare nella directory home e installare i prerequisiti di hyperledger fabric la cui guida è presente qua:
https://hyperledger-fabric.readthedocs.io/en/latest/prereqs.html

una volta fatto ciò bisogna installare fabric e fabric samples:

-mkdir -p $HOME/go/src/github.com/<your_github_userid>
-cd $HOME/go/src/github.com/<your_github_userid>

-curl -sSLO https://raw.githubusercontent.com/hyperledger/fabric/main/scripts/install-fabric.sh && chmod +x install-fabric.sh
-./install-fabric.sh

una volta fatto questo, bisogna copiare la cartella "myapp" e la cartella "mychaincode" all'interno della cartella fabric-samples
appena creata.

Il percorso di myapp dovrebbe essere una cosa simile a questa:
\\wsl.localhost\Ubuntu-22.04\home\user\go\src\github.com\FrPipr\fabric-samples\myapp

posizionarsi all'interno della cartella myapp ed eseguire il seguente comando:

-npm install

ripetere l'operazione anche per la cartella mychaincode.

posizionarsi all'interno della cartella test-network e eseguire i seguenti comandi:

-./network.sh down

successivamente creare un canale tramite il seguente comando:

-./network.sh up createChannel -c mychannel -ca

infine, si fa il deployment del chaincode per le organizzazioni org0 e org1 presenti all'interno del fabric-samples

-./network.sh deployCC -ccn basic -ccp ../mychaincode/ -ccl javascript

ora il chaincode sarà disponibile e verrà approvato da entrambe le organizzazioni. 

infine, bisogna avviare il server che permette di interfacciarsi con il chaincode, posizionarsi all'interno della cartella myapp
eseguire il seguente comando:

-npm start

questo avvierà il server che farà logging delle transazioni

a questo punto, si può avviare la blockchain e scannerizzare i qrcode, si possono ottenere delle info del prodotto "product0123456789" già presente su blockchain


