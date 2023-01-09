import Trie from "./Trie";
import pos from "./dict/pos.dict.yaml";
import tupa from "./dict/tupa.dict.yaml";
import kyonh from "./dict/kyonh.dict.yaml";
import unt from "./dict/unt.dict.yaml";

function loadDict(data: string): Trie {
  const t = new Trie();
  data
    .trim()
    .split("\n")
    .forEach(a => {
      const [k, v] = a.split("\t");
      t.set(k, v);
    });
  return t;
}

export function getMiddleChineseList(s: string, t: Trie) {
  return t.get(s);
}

export function getMiddleChinese(s: string, t: Trie, f = "(%s)") {
  return t
    .get(s)
    .map(([k, v]) => k + (v ? f.replace("%s", v) : ""))
    .join("");
}

export function getMiddleChineseText(s: string, t: Trie, sp = " ") {
  return t
    .get(s)
    .map(([, v]) => v)
    .filter(v => v)
    .join(sp);
}

const dictPos = loadDict(pos);
const dictTupa = loadDict(tupa);
const dictKyonh = loadDict(kyonh);
const dictUnt = loadDict(unt);

export const getPosList = (s: string) => getMiddleChineseList(s, dictPos);
export const getTupaList = (s: string) => getMiddleChineseList(s, dictTupa);
export const getKyonhList = (s: string) => getMiddleChineseList(s, dictKyonh);
export const getUntList = (s: string) => getMiddleChineseList(s, dictUnt);

export const getPos = (s: string) => getMiddleChinese(s, dictPos);
export const getTupa = (s: string) => getMiddleChinese(s, dictTupa);
export const getKyonh = (s: string) => getMiddleChinese(s, dictKyonh);
export const getUnt = (s: string) => getMiddleChinese(s, dictUnt, "[%s]");

export const getPosText = (s: string) => getMiddleChineseText(s, dictPos);
export const getTupaText = (s: string) => getMiddleChineseText(s, dictTupa);
export const getKyonhText = (s: string) => getMiddleChineseText(s, dictKyonh);
export const getUntText = (s: string) => getMiddleChineseText(s, dictUnt, ".");
