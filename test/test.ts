/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-explicit-any */
import returnFormatDetector from '../lib/detect-format';
import { JSONSchema7 } from 'json-schema';
// const defaultFormats = require("ajv/lib/compile/formats")('fast'); // https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
// const sample_data = require("../test/format.json");
// https://github.com/epoberezkin/ajv/blob/master/spec/typescript/index.ts

const formats = ['date', 'time', 'date-time', 'uri', 'email', 'ipv4', 'ipv6', 'uuid'];

const stringFormats: JSONSchema7[] = [
  {
    pattern: '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$',
    $comment: 'American Phone Number'
  },
  { pattern: '^4[0-9]{12}(?:[0-9]{3})?$', $comment: 'Visa Credit Card' },
  { pattern: '^3[47][0-9]{13}$', $comment: 'American Express Credit Card' },
  {
    pattern: '^3(?:0[0-5]|[68][0-9])[0-9]{11}$',
    $comment: 'Diners Credit Club'
  },
  {
    pattern: '^[a-zA-Z]{2}[0-9]{2}[a-zA-Z0-9]{4}[0-9]{7}([a-zA-Z0-9]?){0,20}',
    $comment: 'IBANN'
  },
  ...formats.map((format: string) => ({ format }))
];

//const fastDetect:Function = returnFormatDetector({ schemas: stringFormats, ajvOptions: { format: 'full' }, options: { minHits: 0 }}); // full|fast
const fastDetect: Function = returnFormatDetector({}); // full|fast
// There are two modes of format validation: fast and full. This mode affects formats date, time, date-time, uri, uri-reference, email, and hostname.
// "full" - more restrictive and slow validation. E.g., 25:00:00 and 2015/14/33 will be invalid time and date in 'full' mode but it will be valid in 'fast' mode.
// false - ignore all format keywords.

const sampleSize = 10 * 1000;
//prettier-ignore
const testData: any = {
  Telss: ['555-1212', '555-1211112'],
  TelFl: ['(888)555-1212 ext. 532', '(800)FLOWERS'],
  URI: ['scheme:[//authority]path[?query][#fragment]', 'https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top', '#fragment'],
  urlst: ['https://www.example.com/foo/?bar=baz&inga=42&quux', "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", 'http://foo.com/unicode_(✪)_in_parens', 'https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js'],
  slow: ['https://www.example.com843244fdst4b46xn6e', 'https://www.exampl234e.com85fdst4b46xn6e', 'https://www.exam24ple.com86fdst4b46xn6e', 'https://ww24w.example.com87fdst4b46xn6e', 'https://www.example.com88fdst4b46xn6e', 'https://www.example.com89fdst4b46xn6e', 'https://www.example.com90fdst4b46xn6e', 'https://www.example.com91f5dst4b46xn6e', 'https://www.example.com92f4dst4b46xn6e', 'https://www.example.com93fdst43b46xn6e', 'https://www.example.com94fdst4b146xn6e'],
  ipv4: ['0.0.0.0', '127.0.0.53', '127.0.0.1', '192.168.1.13', '0.0.0.0', '1.2.3.4'],
  ipv6: ['fe00::0', 'ff02::3', '2001:0db8:85a3:0000:0000:8a2e:0370:7334', 'fe80::f2de:f1ff:fe55:53'],
  dates: ['1963-06-19', '2020-10-02'],
  Time: ['12:34:56.789', '12:34:56+01:00', '12:34:56'],
  urlst2: 'x'.repeat(sampleSize).split('').map((x, i) => `https://www.example.com${i}fdst4ljeflajtl4q5h5kqjhkltjhklsjdhflkdjhflb46${x}n6e`),
  ipv62: 'x'.repeat(sampleSize).split('').map((x, i) => `2001:0db8:85a3:0000:${i}:0370:7334`),
  Time2: 'x'.repeat(sampleSize).split('').map((x, i) => `12:34:56.${i}`),
  URIs: 'x'.repeat(sampleSize).split('').map((x, i) => `1https://vvbwet2${x}f3vr${i}`),
  ipv44: 'x'.repeat(sampleSize).split('').map((x, i) => `ASR§B%B%NDVV192.${i}.1.13`),
  DATE: 'x'.repeat(sampleSize).split('').map((x, i) => new Date(Date.now() - i).toISOString()),
  IBANs: 'x'.repeat(sampleSize).split('').map((x, i) => `DE64500105178934265523${i}`),
  AMEs: 'x'.repeat(sampleSize).split('').map((x, i) => `37873449367100${i % 3}`),
  TELs: 'x'.repeat(sampleSize).split('').map((x, i) => `(888)555-332${i % 3}`),

  ccc: 'x'.repeat(sampleSize).split('').map((x, i) => `ASR§B%B%NDVV192.${i}.1.13`),
  ddd: 'x'.repeat(sampleSize).split('').map((x, i) => new Date(Date.now() - i).toISOString()),
  fff: 'x'.repeat(sampleSize).split('').map((x, i) => `DE64500105178934265523${i}`),
  hhh: 'x'.repeat(sampleSize).split('').map((x, i) => `37873449367100${i % 3}`),
  kkk: 'x'.repeat(sampleSize).split('').map((x, i) => `(888)555-332${i % 3}`)
};

// testData.DATE.push("1963-06-19") // no format
// testData.DATE.push("2020-02-17T19:06:11.736Z") // no format
// const {DATE} =  testData;

const start = Date.now();
let hits = 0,
  checked = 0;
const results: any = [];
const runs = 2;
const addHits = (i: number): number => (hits += Number(i));
for (let i = 0; i < runs; i++) {
  console.log('##### run ', i);
  for (const key in testData) {
    checked += testData[key].length * stringFormats.length;
    const res = fastDetect(testData[key]);
    //if(res && res.length) console.log(key,res);
    if (res && res.length) {
      if (i < 1) results.push({ key, res });
      res.map((h: any) => addHits((h.$comment || '').split('matched:')[1]));
    }
  }
  //results.map( (r:any)=> r.res.map( (h:any)=> addHits( (h.$comment||'').split('matched:')[1] )));
}
console.log('');
results.forEach((r: any) => console.log([r.key, r.res.map((f: any) => f.format + ' ' + f.$comment)].join('\t\t')));

console.log({ matched: results.length });
console.log('');
console.log({
  checked: (checked / 1000 / 1000).toFixed(0) + 'M',
  hits: (hits / 1000 / 1000).toFixed(0) + 'M',
  elapsed: Date.now() - start,
  hpS: (hits * 1000) / (Date.now() - start)
});
