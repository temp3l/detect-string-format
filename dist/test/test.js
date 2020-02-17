"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//import Ajv from "ajv"; // yarn add ajv
const detect_format_1 = __importDefault(require("../lib/detect-format"));
const safe_regex_1 = __importDefault(require("safe-regex"));
//const defaultFormats = require("ajv/lib/compile/formats")('fast'); // https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
//const sample_data = require("../test/format.json");
//https://github.com/epoberezkin/ajv/blob/master/spec/typescript/index.ts
const formats = ['date', 'time', 'date-time', 'uri', 'email', 'ipv4', 'ipv6', 'uuid', 'json-pointer', 'json-pointer-uri-fragment', 'relative-json-pointer'];
const schemas = [
    { pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$", $comment: "American Phone Number" },
    { pattern: "^4[0-9]{12}(?:[0-9]{3})?$", $comment: "Visa Credit Card" },
    { pattern: "^3[47][0-9]{13}$", $comment: "American Express Credit Card" },
    { pattern: "^3(?:0[0-5]|[68][0-9])[0-9]{11}$", $comment: "Diners Credit Club" },
    { pattern: "^DE([0-9a-zA-Z]\s?){20}$", $comment: "IBAN" },
    ...formats.map((format) => ({ format }))
];
schemas.filter(s => s.pattern).map(({ pattern, $comment }) => {
    console.log({ pattern, isSafeRegex: safe_regex_1.default(pattern, { limit: 25 }) });
});
const fastDetect = detect_format_1.default({ schemas, options: { format: 'full', minHits: 10 } }); // full|fast
// There are two modes of format validation: fast and full. This mode affects formats date, time, date-time, uri, uri-reference, email, and hostname.
// "full" - more restrictive and slow validation. E.g., 25:00:00 and 2015/14/33 will be invalid time and date in 'full' mode but it will be valid in 'fast' mode.
// false - ignore all format keywords.
const testData = {
    urlst: ["https://www.example.com/foo/?bar=baz&inga=42&quux", "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", "http://foo.com/unicode_(✪)_in_parens", "https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js"],
    urlst2: 'xxxxx'.repeat(100000).split('').map((x, i) => `https://www.example.com${i}fdst4ljeflajtl4q5h5kqjhkltjhklsjdhflkdjhflb46${x}n6e`),
    slow: ["https://www.example.com843244fdst4b46xn6e", "https://www.exampl234e.com85fdst4b46xn6e", "https://www.exam24ple.com86fdst4b46xn6e", "https://ww24w.example.com87fdst4b46xn6e", "https://www.example.com88fdst4b46xn6e", "https://www.example.com89fdst4b46xn6e", "https://www.example.com90fdst4b46xn6e", "https://www.example.com91f5dst4b46xn6e", "https://www.example.com92f4dst4b46xn6e", "https://www.example.com93fdst43b46xn6e", "https://www.example.com94fdst4b146xn6e"],
    ipv4: ["0.0.0.0", "127.0.0.53", "127.0.0.1", "192.168.1.13", "0.0.0.0", "1.2.3.4"],
    ipv6: ["fe00::0", "ff02::3", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "fe80::f2de:f1ff:fe55:53"],
    ipv62: 'xxxxx'.repeat(100000).split('').map((x, i) => `"2001:0db8:85a3:0000:${i}:0370:7334"`),
    dates: ["1963-06-19", "2020-10-02"],
    Time: ["12:34:56.789", "12:34:56+01:00", "12:34:56"],
    Time2: 'xxxxx'.repeat(100000).split('').map((x, i) => `12:34:56.${i}`),
    Telss: ["555-1212", "555-1211112"],
    TelFl: ["(888)555-1212 ext. 532", "(800)FLOWERS"],
    URI: ["scheme:[//authority]path[?query][#fragment]", "https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top", "#fragment"],
    uri: 'xxxxx'.repeat(100000).split('').map((x, i) => `1https://vvbwet2${x}f3vr${i}`),
    ipv44: 'xxxxx'.repeat(100000).split('').map((x, i) => `ASR§B%B%NDVV192.${i}.1.13`),
    DATE: 'xxxxx'.repeat(500000).split('').map((x, i) => new Date(Date.now() - i).toISOString()),
};
//testData.DATE.push("1963-06-19") //
const { DATE } = testData;
console.log(DATE);
let checked = 0;
const start = Date.now();
let hits = 0;
let results = [];
const addHits = (i) => hits = hits + i;
for (let i = 0; i < 3; i++) {
    console.log('##### run ' + i);
    results = [];
    for (const key in testData) {
        checked += testData[key].length;
        const res = fastDetect(testData[key]);
        if (res.length)
            results.push({ key, res });
    }
    let stats = results.map((r) => r.res.map((h) => addHits(h.hits)));
}
results.forEach((r) => console.log([r.key, r.res.map((f) => f.format || f.$comment)].join('\t\t')));
console.log({ matched: results.length, });
console.log('');
console.log({ hits, elapsed: Date.now() - start, hpS: (hits * 1000) / (Date.now() - start) });
