// The loogies an address owns, as the tank's save rows: [chain, id, "rrggbb", chubbiness, mouthLength].
// Public RPCs, no keys, no libraries: works in a browser page and in Node.
//   node loogies.mjs 0xSafe...            prints the save for the tank
export const COLLECTIONS = [
  { chain: "eth", name: "Loogies", rpc: "https://ethereum-rpc.publicnode.com", addr: "0xE203cDC6011879CDe80c6a1DcF322489e4786eB3", mouth: false },
  { chain: "op", name: "OptimisticLoogies", rpc: "https://optimism-rpc.publicnode.com", addr: "0x006eB613cc586198003a119485594ECbbDf41230", mouth: true },
];
export const MAX = 16;    // the tank holds 16
const BALANCE_OF = "0x70a08231", TOKEN_OF_OWNER_BY_INDEX = "0x2f745c59";
const COLOR = "0xd4e28c9c", CHUBBINESS = "0xfaa204e1", MOUTH_LENGTH = "0x3f4f8561";   // the contracts' public mappings
const word = (v) => BigInt(v).toString(16).padStart(64, "0");

async function call(url, to, data, tries = 3) {
  try {
    return await call1(url, to, data);
  } catch (e) {
    if (tries <= 1) throw e;
    return call(url, to, data, tries - 1);        // public RPCs drop a call now and then
  }
}

async function call1(url, to, data) {
  const body = { jsonrpc: "2.0", id: 1, method: "eth_call", params: [{ to, data }, "latest"] };
  const r = await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(body), signal: AbortSignal.timeout(8000) });
  const x = await r.json();
  if (x.error || !x.result) throw new Error(x.error?.message || "bad RPC answer");
  return x.result;
}

async function rpc(url, calls) {
  // single eth_calls, 4 at a time (public RPCs choke on batches); answers in order
  const out = new Array(calls.length);
  let next = 0;
  const lane = async () => { while (next < calls.length) { const i = next++; out[i] = await call(url, ...calls[i]); } };
  await Promise.all([lane(), lane(), lane(), lane()]);
  return out;
}

export async function loogiesOf(owner) {
  const o = word(owner);
  const rows = [];
  for (const c of COLLECTIONS) {
    const [bal] = await rpc(c.rpc, [[c.addr, BALANCE_OF + o]]);
    const n = Math.min(MAX - rows.length, Number(BigInt(bal)));
    if (n <= 0) continue;
    const ids = (await rpc(c.rpc, Array.from({ length: n }, (_, i) => [c.addr, TOKEN_OF_OWNER_BY_INDEX + o + word(i)]))).map((x) => Number(BigInt(x)));
    const per = c.mouth ? 3 : 2;
    const got = await rpc(c.rpc, ids.flatMap((id) => [COLOR, CHUBBINESS, MOUTH_LENGTH].slice(0, per).map((f) => [c.addr, f + word(id)])));
    ids.forEach((id, i) => {
      const [color, chub, mouth] = got.slice(i * per, i * per + per);
      rows.push([c.chain, id, color.slice(2, 8), Number(BigInt(chub)), mouth ? Number(BigInt(mouth)) : 0]);
    });
  }
  return rows;
}

if (typeof process !== "undefined" && import.meta.url === `file://${process.argv[1]}`) {
  const owner = process.argv[2];
  if (!/^0x[0-9a-fA-F]{40}$/.test(owner || "")) { console.error("usage: node loogies.mjs 0xAddress"); process.exit(1); }
  console.log(JSON.stringify({ loogies: await loogiesOf(owner) }));
}
