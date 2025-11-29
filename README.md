# avalanche-rush
On-chain PvP game MVP on Avalanche Fuji (smart contracts + Node backend + React frontend)
Abbiamo costruito un MVP end‑to‑end di una dApp di gioco su Avalanche Fuji, con tre layer: smart contract, backend Node.js/Express e frontend React/Vite, più integrazione con il wallet tramite ethers.js.[1][2]

## Smart contract e logica on‑chain

- È stato sviluppato e deployato su Avalanche Fuji un contratto `PlayerRegistry` che gestisce la registrazione dei giocatori con username univoco e mantiene statistiche base: vittorie, sconfitte, oggetti raccolti e timestamp di registrazione.[1]
- Il contratto espone funzioni di scrittura `registerPlayer(string _username)` e `updateStats(address _player, bool _won, uint256 _itemsEarned)`, oltre alla funzione di lettura `getPlayer(address _player)` che restituisce una struct con i dati del giocatore, e una `mapping(address => Player) public players` per accesso diretto on‑chain.[3][1]

## Backend: Node.js + Express + ethers

- È stato creato un backend Node.js con Express che si collega alla rete Avalanche Fuji tramite ethers.js, utilizzando l’indirizzo del contratto `PlayerRegistry` e un’ABI allineata alla firma reale di `registerPlayer` e `getPlayer`.[4][1]
- Il backend espone endpoint REST:
  - `GET /` per health‑check del servizio.
  - `GET /player/:address` che invoca `getPlayer(address)` sul contratto e dovrebbe restituire in JSON username, wins, losses, itemsCollected e registeredAt per l’indirizzo richiesto; al momento l’endpoint è implementato ma ritorna un errore di lettura per un problema residuo di coerenza dati/require sul contratto.[4][1]
  - `GET /inventory/:address` che interroga un contratto ERC‑1155 di tipo `GameItems` per leggere i balance degli item principali (es. sword, shield, potion, coin) e li espone come struttura `items` consumabile dal frontend.[5][3]

## Frontend: React + Vite + ethers

- È stata realizzata una single‑page app con React e Vite che si collega al wallet dell’utente (MetaMask/Core) tramite `ethers.BrowserProvider(window.ethereum)` e lavora sulla rete Avalanche Fuji.[6][2]
- La UI fornisce tre sezioni principali:
  - **Registrazione Player**: campo `Username`, pulsante `Register Player` che invia una transazione a `PlayerRegistry.registerPlayer`, e pulsante `Load Player Data` che chiama il backend `/player/:address` e visualizza i dati del giocatore (address, username, wins, losses, itemsCollected) quando la lettura ha esito positivo.[2][1]
  - **Match Demo**: campo `Opponent address` con pulsante `Create Match` che interagisce con il contratto `MatchManager` per aprire una partita, e campo `Match ID` con pulsante `Complete Match (demo)` che chiama `completeMatch` per simulare la conclusione di un match e l’aggiornamento delle statistiche on‑chain.[5][1]
  - **Inventory**: pulsante `Load Inventory` che chiama `/inventory/:address` sul backend e mostra i quantitativi di oggetti ERC‑1155 (sword, shield, potion, coin) associati al giocatore, integrando così la dimensione NFT/equipaggiamento nel profilo.[3][5]

## Stato attuale e cosa manca per giocare

- L’architettura completa della dApp è pronta: contratti deployati su Fuji, backend che fa da ponte tra blockchain e frontend, e interfaccia React che gestisce la connessione del wallet, l’invio di transazioni di gioco e la lettura dei dati del profilo e dell’inventario.[2][1]
- Sono già possibili azioni on‑chain come la registrazione del player e la creazione/completamento di match, e la struttura per leggere stats e inventario è implementata; resta da correggere il flusso di lettura `GET /player/:address` (require `Player not registered` su `getPlayer`) per avere una versione pienamente giocabile con aggiornamento in tempo reale delle statistiche dopo ogni partita.[1][4]

[1](https://build.avax.network/docs/dapps/end-to-end/fuji-workflow)
[2](https://www.opcito.com/blogs/steps-to-build-a-web3-application-with-react-vite-and-ethersjs)
[3](https://soliditydeveloper.com/erc-1155)
[4](https://docs.mode.network/tutorials)
[5](https://dev.to/truongpx396/blockchain-nft-erc1155-from-basics-to-production-13o4)
[6](https://support.metamask.io/develop/building-with-infura/javascript-typescript/infuraprovider-metamaskwalletprovider-react-ethersjs)
[7](https://developers.circle.com/cctp/transfer-usdc-on-testnet-from-ethereum-to-avalanche)
[8](https://ardordocs.jelurida.com/Asset_to_ERC1155_Bridge)
[9](https://wagmi.sh/react/guides/ethers)
[10](https://github.com/alessandroaw/ethersjs-examples)
MVP della webapp:http://localhost:5173/
Explorer Snowface per verificare il corretto deploy dei contratti:https://testnet.snowtrace.io/address/0xd8CcC9f498028B05D1a7EEeA2726DC97B56Ef386
