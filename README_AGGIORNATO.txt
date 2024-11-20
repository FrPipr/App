In questo documento verranno spiegati i file e le cartelle principali di cui l'app sviluppata in questo branch è composta:

[ product-tracking ] -> contiene il frontend React. Ogni pagina di questo frontend inoltrerà richieste al server Flask

[ app.py ] -> riceve tutte le richieste del frontend e le inoltra al server Node che gestisce il chaincode, previa autenticazione/autorizzazione.
Tiene traccia degli utenti e dei modelli 3D nei file users.json e models.json
Contiene un endpoint /initLedger che se chiamata al primo avvio della blockchain, registra i prodotti esempio contenuti in sampleData.json.
Si noti che il progetto originale prevede un'interfaccia html per questo server, che è stata mantenuta, e che consente di interagire con il modello AI.

[ appServer.js ] -> questo è un server presente in Linux che permette la comunicazione con il chaincode.
Una volta avviato, questo server si collega automaticamente alla blockchain e carica i prodotti prova AGRI_X e FIN_X.
Espone al server Flask tutte le operazioni di lettura e scrittura dei prodotti e dei relativi sensor/movement/certification data.

[ supplychain.js ] è il chaincode stesso presente nel canale, comprende diverse funzioni di creazione, update, letture e cancellazione del prodotto.
Queste funzioni si possono richiamare direttamente tramite comando peer.