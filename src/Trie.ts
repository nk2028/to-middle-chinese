import { OpenCC } from "opencc";
import { resolve } from "path";

const ccS = new OpenCC("s2t.json");
const ccHK = new OpenCC(resolve(__dirname, "../src/dict/hk2t.json"));

type Node = Map<string, Node> & { v?: string };

export default class Trie {
  t: Node = new Map();

  set(k: string, v: string) {
    Array.from(k).reduce((t, c) => {
      let u = t.get(c);
      if (!u) t.set(c, (u = new Map()));
      return u;
    }, this.t).v = v;
  }

  get(s: string) {
    const r: [string, string | null][] = [];
    for (let a = Array.from(s), b = Array.from(ccHK.convertSync(ccS.convertSync(s))), i = 0; i < a.length; ) {
      let t = this.t,
        c = "",
        k = i + 1;
      for (let j = i; j < b.length; j++) {
        const u = t.get(b[j]);
        if (!u) break;
        if ((t = u).v) {
          c = t.v;
          k = j + 1;
        }
      }
      if (k === i + 1) r.push([a[i++], c || null]);
      else for (const d = c.split(" "), n = i; i < k; i++) r.push([a[i], d[i - n]]);
    }
    return r;
  }
}
