# wedgie-loogie-tank

Loogies swimming on a [wedgie](https://wedgie.dev). No NFT: the loogies your Safe owns go in the tank.

1. Put **Loogie Tank** on your wedgie (wedgie.dev/connect, Apps from a GitHub repo:
   `austintgriffith/wedgie-loogie-tank`).
2. Open the page (`index.html`, https://austintgriffith.github.io/wedgie-loogie-tank/), paste your
   Safe's address, Find, plug the wedgie in, Send.

On the wedgie: joystick picks a loogie (its number shows), press makes bubbles.

- `tank/tank.py` the app. Save `tank`: `{"loogies": [["op", 7, "4fc822", 81, 188], ...]}`
  (chain, id, color, chubbiness, mouthLength). No save: demo loogies. Up to 16.
- USB: `{"id":1,"type":"tank","loogies":[...]}` -> `{"id":1,"type":"tank_ok","n":16}`.
- `loogies.mjs` reads an address's loogies (browser or `node loogies.mjs 0x...`).
- Loogies (mainnet) `0xE203cDC6011879CDe80c6a1DcF322489e4786eB3`,
  OptimisticLoogies (Optimism) `0x006eB613cc586198003a119485594ECbbDf41230`.

Not signed by wedgie.dev: installed from this repo it runs with full access to your wedgie.
