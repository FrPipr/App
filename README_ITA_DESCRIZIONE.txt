In questo file verranno spiegati i 3 file principali di cui l'app è composta e verranno spiegate le funzionalità principali di ciascuna

app.py: questo file presente nella cartella principale, è quella che gestisce il chatbot tramite l'interfaccia utente in index.html

questa app intercetta la richiesta scan() inviata dopo aver eseguito la scansione del qr code e invia una richiesta al server
appServer.js presente su lunix. La richiesta avviene su /localhost:3000/readProduct quindi alla funizione readProduc.

Quest'app inoltre legge i messaggi scritti dall'utente tramite ask() e crea una chain, combinando il prompt presente su "prompts_variables_storage.py"
con i messaggi dell' utente e le informazioni del prodotto.

appServer.js: questo è un server presente in linux che permette la comunicazione con il chaincode.
Una volta avviato, questo server si collega automaticamente alla blockchain e esegue 2 transazioni:
initLedger: che si occupa di inizializzare il registro presente su blockchain
createProduct che crea il prodotto dal codice "product0123456789" con dei parametri di test
si possono richiamare/definire anche altre funzioni in base alle esigenze
Questa app si mette in ascolto anche per readProduc inviando una transazione di lettura al chaincode quando richiamata.

supplychain.js è il chaincode stesso presente nel canale, comprende diverse funzioni di creazione, update, letture e cancellazione del prodotto.
Queste funzioni si possono richiamare direttamente tramite comando peer.

Un prodotto è definito tramite i seguenti parametri: id, manufacturer, creationDate, expiryDate, ingredients e allergens.
la funzione initLedger inizializza anche 2 prodotti dal codice "PROD1" e "PROD2".