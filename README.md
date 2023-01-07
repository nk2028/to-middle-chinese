# to-middle-chinese

[![npm](https://img.shields.io/npm/v/to-middle-chinese)](https://www.npmjs.com/package/to-middle-chinese) [![types](https://img.shields.io/npm/types/to-middle-chinese)](https://www.npmjs.com/package/to-middle-chinese) [![license](https://img.shields.io/npm/l/to-middle-chinese)](https://www.npmjs.com/package/to-middle-chinese)

### 中古漢語自動標註工具 Middle Chinese Pronunciation Automatic Labeling Tool

## Installation

```shell
npm install to-middle-chinese
```

### Via CDN

```html
<script src="https://unpkg.com/to-middle-chinese@0.1.0/dist/index.js" defer></script>
```

## Usage

```js
> import ToMiddleChinese from "to-middle-chinese";

> // 音韻地位 (Description of Phonological Position)
> ToMiddleChinese.get_pos_list("遙襟甫暢，逸興遄飛");
[["遙", "以開三宵平"], ["襟", "見開三B侵平"], ["甫", "幫三虞上"], ["暢", "徹開三陽去"], ["，", null], ["逸", "以開三眞入"], ["興", "曉開三蒸平"], ["遄", "常合三仙平"], ["飛", "幫三微平"]]
> ToMiddleChinese.get_pos("遙襟甫暢，逸興遄飛");
"遙(以開三宵平)襟(見開三B侵平)甫(幫三虞上)暢(徹開三陽去)，逸(以開三眞入)興(曉開三蒸平)遄(常合三仙平)飛(幫三微平)"
> ToMiddleChinese.get_pos_text("遙襟甫暢，逸興遄飛");
"以開三宵平 見開三B侵平 幫三虞上 徹開三陽去 以開三眞入 曉開三蒸平 常合三仙平 幫三微平"

> // 切韻拼音 (Tshet-uinh Phonetic Alphabet)
> ToMiddleChinese.get_tupa_list("遙襟甫暢，逸興遄飛");
[["遙", "jiew"], ["襟", "kyim"], ["甫", "puoq"], ["暢", "trhyangh"], ["，", null], ["逸", "jit"], ["興", "hyngh"], ["遄", "djwien"], ["飛", "puj"]]
> ToMiddleChinese.get_tupa("遙襟甫暢，逸興遄飛");
"遙(jiew)襟(kyim)甫(puoq)暢(trhyangh)，逸(jit)興(hyngh)遄(djwien)飛(puj)"
> ToMiddleChinese.get_tupa_text("遙襟甫暢，逸興遄飛");
"jiew kyim puoq trhyangh jit hyngh djwien puj"

> // 古韻羅馬字 (Koxyonh’s Romanization)
> ToMiddleChinese.get_kyonh_list("遙襟甫暢，逸興遄飛");
[["遙", "jeu"], ["襟", "kim"], ["甫", "pyox"], ["暢", "thriangh"], ["，", null], ["逸", "jit"], ["興", "hingh"], ["遄", "zjyen"], ["飛", "pyoi"]]
> ToMiddleChinese.get_kyonh("遙襟甫暢，逸興遄飛");
"遙(jeu)襟(kim)甫(pyox)暢(thriangh)，逸(jit)興(hingh)遄(zjyen)飛(pyoi)"
> ToMiddleChinese.get_kyonh_text("遙襟甫暢，逸興遄飛");
"jeu kim pyox thriangh jit hingh zjyen pyoi"

> // unt 切韻擬音 (unt’s Qieyun Reconstruction)
> ToMiddleChinese.get_unt_list("遙襟甫暢，逸興遄飛");
[["遙", "jew"], ["襟", "kɹim"], ["甫", "púo"], ["暢", "ʈʰàɴ"], ["，", null], ["逸", "jit"], ["興", "xɨ̀ŋ"], ["遄", "dʑwen"], ["飛", "puj"]]
> ToMiddleChinese.get_unt("遙襟甫暢，逸興遄飛");
"遙[jew]襟[kɹim]甫[púo]暢[ʈʰàɴ]，逸[jit]興[xɨ̀ŋ]遄[dʑwen]飛[puj]"
> ToMiddleChinese.get_unt_text("遙襟甫暢，逸興遄飛");
"jew.kɹim.púo.ʈʰàɴ.jit.xɨ̀ŋ.dʑwen.puj"
```
