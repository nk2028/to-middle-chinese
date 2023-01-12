import { access, constants, createReadStream, createWriteStream, unlink } from "fs";
import { createInterface } from "readline";
import { get } from "https";
import { pipeline } from "stream/promises";

import { 音韻地位 } from "qieyun";
// @ts-expect-error Missing Declaration
import { kyonh, unt, tupa } from "qieyun-examples";
// @ts-expect-error Default Export
import OpenCC from "opencc";
import Trie from "./src/Trie.js";

// File Downloading

function download(url: string, path: string): Promise<void> {
  return new Promise((resolve, reject) => {
    access(path, constants.F_OK, error => {
      if (error) {
        console.log(`downloading ${path}`);
        get(url, response => {
          if (response.statusCode === 200) {
            response.pipe(
              createWriteStream(path)
                .on("finish", resolve)
                .on("error", error => unlink(path, () => reject(error)))
            );
          } else {
            reject(new Error(`Server responded with ${response.statusCode}: ${response.statusMessage}`));
          }
        }).on("error", reject);
      } else {
        console.log(`${path} already exists, skip downloading`);
        resolve();
      }
    });
  });
}

// Sorting

function compareFullUnicode(x: string, y: string): number {
  const ix = x[Symbol.iterator]();
  const iy = y[Symbol.iterator]();
  for (;;) {
    const nx = ix.next();
    const ny = iy.next();
    if (nx.done && ny.done) {
      return 0;
    }
    const cx = nx.done ? -1 : nx.value.codePointAt(0)!;
    const cy = ny.done ? -1 : ny.value.codePointAt(0)!;
    const diff = cx - cy;
    if (diff) {
      return diff;
    }
  }
}

function compareRow(x: string[], y: string[]): number {
  const diffWordLen = [...x[0]].length - [...y[0]].length;
  if (diffWordLen) {
    return diffWordLen;
  }
  const l = Math.min(x.length, y.length);
  for (let i = 0; i < l; i++) {
    const diff = compareFullUnicode(x[i], y[i]);
    if (diff) {
      return diff;
    }
  }
  return x.length - y.length;
}

// Converter utils

type WithSchemas<T> = [code: T, pos: T, tupa: T, kyonh: T, unt: T];

const sourceFiles = ["chars.tsv", "words.tsv", "extra_words.tsv"];
const CC = new OpenCC.OpenCC("t2s.json");
const trie = new Trie();
const data: Map<string, WithSchemas<string>> = new Map();
const dict: Map<string, string> = new Map();
const deriveCode: (地位: 音韻地位) => string = 地位 => 地位.編碼;
const derivePos: (地位: 音韻地位) => string = 地位 => 地位.描述;
const deriveTupa: (地位: 音韻地位) => string = tupa.schema({ 模式: "寬鬆" });
const converters: WithSchemas<(地位: 音韻地位) => string> = [deriveCode, derivePos, deriveTupa, kyonh, unt];
const special地位: Record<string, WithSchemas<string>> = { 精一侵上: ["N$B", "精開一侵上", "tsoimq", "crimx", "tsím"] };

function conv(x: string): string {
  let res = data.get(x);
  if (!res) {
    if (x.startsWith("!")) {
      const sub = special地位[x.slice(1)];
      if (!sub) {
        throw new Error(`unhandled special 地位: ${x}`);
      }
      res = sub;
    } else {
      const 地位 = 音韻地位.from描述(x);
      res = converters.map(derive => derive(地位)) as WithSchemas<string>;
    }
    data.set(x, res);
  }
  return res[0];
}

function* printData(): IterableIterator<string> {
  for (const [, [code, pos, tupa, kyonh, unt]] of data) {
    yield `${pos}${code}${tupa} ${kyonh} ${unt}`;
  }
}

// File reading

async function* loadTsv(path: string): AsyncIterableIterator<[string, string]> {
  for await (const line of createInterface({
    input: createReadStream(path),
    crlfDelay: Infinity,
  })) {
    const [word, input] = line.split("\t");
    const code = input.split(" ").map(conv).join("");
    yield [word, code];
  }
}

async function extendFromTsv(path: string) {
  for await (const [word, code] of loadTsv(path)) {
    dict.set(word, code);
    dict.set(CC.convertSync(word), code);
  }
}

// Main

(async () => {
  await Promise.all(
    sourceFiles.map(file =>
      download(`https://raw.githubusercontent.com/nk2028/rime-dict-source/df307c8/${file}`, `dict/${file}`)
    )
  );
  for (const file of sourceFiles) {
    console.log(`reading ${file}`);
    await extendFromTsv(`dict/${file}`);
  }

  console.log(`sorting dict`);
  const lines = Array.from(dict).sort(compareRow);
  console.log(`writing dict.txt`);
  await pipeline(
    lines.map(pair => pair.join("\t") + "\n"),
    createWriteStream(`dict/dict.txt`)
  );

  console.log(`making trie`);
  for (const line of lines) {
    trie.set(...line);
  }
  const serialized = trie.serialize();
  console.log(`writing trie.txt`);
  await new Promise(resolve => createWriteStream(`dict/trie.txt`).write(serialized, resolve));

  console.log(`handling data`);
  const entries = printData();
  console.log(`writing data.txt`);
  await pipeline(entries, createWriteStream(`dict/data.txt`));
})();
