import Trie from "./Trie";
import data from "../dict/data.txt";
import trie from "../dict/trie.txt";

type Schemas = { pos: string; tupa: string; kyonh: string; unt: string };

const m = new Map<string, Schemas>();
const d = Array.from(data);

for (let i = 0; i < d.length; ) {
  let pos = "";
  while (d[i].codePointAt(0)! >= 0x3400 || d[i - 1] === "三") pos += d[i++];
  const code = d[i++] + d[i++] + d[i++];
  let rest = "";
  while (i < d.length && d[i].codePointAt(0)! < 0x3400) rest += d[i++];
  const [tupa, kyonh, unt] = rest.split(" ");
  m.set(code, { pos, tupa, kyonh, unt });
}

const t = new Trie(trie);

function getSchema(schema: keyof Schemas) {
  return (s: string) => m.get(s)![schema];
}

export function getMiddleChineseList(s: string, q: (c: string) => string) {
  return t.get(s).map(a => ((a[1] &&= q(a[1])), a));
}

export function getMiddleChinese(s: string, q: (c: string) => string, f = "(%s)") {
  return t
    .get(s)
    .map(([k, v]) => k + (v ? f.replace("%s", q(v)) : ""))
    .join("");
}

export function getMiddleChineseText(s: string, q: (c: string) => string, sp = " ") {
  return t
    .get(s)
    .map(([, v]) => v && q(v))
    .filter(v => v)
    .join(sp);
}

const pos = getSchema("pos");
const tupa = getSchema("tupa");
const kyonh = getSchema("kyonh");
const unt = getSchema("unt");

export const getPosList = (s: string) => getMiddleChineseList(s, pos);
export const getTupaList = (s: string) => getMiddleChineseList(s, tupa);
export const getKyonhList = (s: string) => getMiddleChineseList(s, kyonh);
export const getUntList = (s: string) => getMiddleChineseList(s, unt);

export const getPos = (s: string) => getMiddleChinese(s, pos);
export const getTupa = (s: string) => getMiddleChinese(s, tupa);
export const getKyonh = (s: string) => getMiddleChinese(s, kyonh);
export const getUnt = (s: string) => getMiddleChinese(s, unt, "[%s]");

export const getPosText = (s: string) => getMiddleChineseText(s, pos);
export const getTupaText = (s: string) => getMiddleChineseText(s, tupa);
export const getKyonhText = (s: string) => getMiddleChineseText(s, kyonh);
export const getUntText = (s: string) => getMiddleChineseText(s, unt, ".");
