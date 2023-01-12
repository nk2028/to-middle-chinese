type Node = Map<string, Node> & { v?: string };

export default class Trie {
  t: Node = new Map();
  constructor(s?: string) {
    if (!s) return;
    const d = Array.from(s);
    const n = [this.t];
    for (let i = 1; n.length; ) {
      const k: string[] = [];
      while (d[i].codePointAt(0)! >= 256) k.push(d[i++]);
      const f = k.reduce((t, c) => {
        const u: Node = new Map();
        t.set(c, u);
        return u;
      }, n[n.length - 1]);
      let p = "";
      while (d[i].codePointAt(0)! < 123) p += d[i++];
      if (p.length) f.v = p;
      if (d[i] === "{") i++, n.push(f);
      else if (d[i] === "}") i++, n.pop();
    }
  }

  set(k: string, v: string) {
    Array.from(k).reduce((t, c) => {
      let u = t.get(c);
      if (!u) t.set(c, (u = new Map()));
      return u;
    }, this.t).v = v;
  }

  get(s: string) {
    const r: [string, string | null][] = [];
    for (let a = Array.from(s), i = 0; i < a.length; ) {
      let t = this.t,
        c = "",
        k = i + 1;
      for (let j = i; j < a.length; j++) {
        const u = t.get(a[j]);
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

  serialize() {
    return (function recursive(t: Node) {
      let result = "";
      if (t.v) result += t.v;
      if (t.size > +!t.v) result += "{";
      t.forEach((v, k) => {
        result += k + recursive(v);
      });
      if (t.size > +!t.v) result += "}";
      return result;
    })(this.t);
  }
}
