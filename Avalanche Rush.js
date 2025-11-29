// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { ethers } = require("ethers");

const app = express();
app.use(cors());
app.use(express.json());

// RPC Fuji
const RPC_URL = "https://api.avax-test.network/ext/bc/C/rpc";

// Indirizzi dei contratti su Fuji
const PLAYER_REGISTRY_ADDRESS = "0x359C76aD16d0A421B9566fd728d88C77ca16a1ae";
const GAME_ITEMS_ADDRESS = "0x11a5c3ac51696E6DE28a98F440Ec3871eb522e08";

// ABI minime
const playerRegistryAbi = [
  "function registerPlayer(string _username) external",
  "function getPlayer(address _player) external view returns (string username, uint256 wins, uint256 losses, uint256 itemsCollected, uint256 registeredAt)"
];


const gameItemsAbi = [
  "function balanceOf(address account, uint256 id) external view returns (uint256)",
  "function SWORD() view returns (uint256)",
  "function SHIELD() view returns (uint256)",
  "function POTION() view returns (uint256)",
  "function COIN() view returns (uint256)"
];

const provider = new ethers.JsonRpcProvider(RPC_URL);

const playerRegistry = new ethers.Contract(
  PLAYER_REGISTRY_ADDRESS,
  playerRegistryAbi,
  provider
);

const gameItems = new ethers.Contract(
  GAME_ITEMS_ADDRESS,
  gameItemsAbi,
  provider
);

// Endpoint di test
app.get("/", (req, res) => {
  res.json({ status: "ok", network: "Avalanche Fuji" });
});

// Info giocatore
app.get("/player/:address", async (req, res) => {
  try {
    const addr = req.params.address;
    const [username, wins, losses, itemsCollected, registeredAt] =
      await playerRegistry.getPlayer(addr);

    res.json({
      address: addr,
      username,
      wins: wins.toString(),
      losses: losses.toString(),
      itemsCollected: itemsCollected.toString(),
      registeredAt: registeredAt.toString()
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error reading player data" });
  }
});

// Inventario NFT
app.get("/inventory/:address", async (req, res) => {
  try {
    const addr = req.params.address;

    const swordId = await gameItems.SWORD();
    const shieldId = await gameItems.SHIELD();
    const potionId = await gameItems.POTION();
    const coinId = await gameItems.COIN();

    const [swords, shields, potions, coins] = await Promise.all([
      gameItems.balanceOf(addr, swordId),
      gameItems.balanceOf(addr, shieldId),
      gameItems.balanceOf(addr, potionId),
      gameItems.balanceOf(addr, coinId)
    ]);

    res.json({
      address: addr,
      items: {
        sword: swords.toString(),
        shield: shields.toString(),
        potion: potions.toString(),
        coin: coins.toString()
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error reading inventory" });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Backend listening on http://localhost:${PORT}`);
});
