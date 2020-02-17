//import Ajv from "ajv"; // yarn add ajv
import returnFormatDetector from '../lib/detect-format';
import { JSONSchema7 } from "json-schema";
const defaultFormats = require("ajv/lib/compile/formats")('fast'); // https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
const sample_data = require("../test/format.json");

//https://github.com/epoberezkin/ajv/blob/master/spec/typescript/index.ts
// const full = formats("full"); //const validator = instance.compile({});
// const fast = formats("fast"); //const allFormats = Object.keys(full);


let formats = [
  'date',
  'time',
  'date-time',
  'uri',
  'uri-reference',
  'uri-template',
  //'url',
  'email',
  //'hostname',
  'ipv4',
  'ipv6',
  //'regex',
  'uuid',
  'json-pointer',
  'json-pointer-uri-fragment',
  'relative-json-pointer'
]

const schemas: JSONSchema7[] = [
  { pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$", $comment: "American Phone Number" },
  { pattern: "^4[0-9]{12}(?:[0-9]{3})?$", $comment: "Visa Credit Card" },
  { pattern: "^3[47][0-9]{13}$", $comment: "American Express Credit Card" },
  { pattern: "^3(?:0[0-5]|[68][0-9])[0-9]{11}$", $comment: "Diners Credit Club",},
  { pattern: "^DE([0-9a-zA-Z]\s?){20}$", $comment: "IBANN",},
  //...Object.keys(defaultFormats).map( (format:string) => ({ format })),
  ...formats.map( (format:string) => ({ format }))
];

const fastDetect = returnFormatDetector({schemas, options: { format: 'full'}}); // full|fast
// There are two modes of format validation: fast and full. This mode affects formats date, time, date-time, uri, uri-reference, email, and hostname.
// "full" - more restrictive and slow validation. E.g., 25:00:00 and 2015/14/33 will be invalid time and date in 'full' mode but it will be valid in 'fast' mode.
// false - ignore all format keywords.


/*
incredible slow!!!


*/

const testData:any = {
  urlsFormat: ["https://www.example.com/foo/?bar=baz&inga=42&quux", "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", "http://foo.com/unicode_(✪)_in_parens", "https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js"],
  urlsFormat2: 'xxxxx'.repeat(100000).split('').map( (x,i)=> `https://www.example.com${i}fdst4ljeflajtl4q5h5kqjhkltjhklsjdhflkdjhflb46${x}n6e` ),
  slow: [ "https://www.example.com843244fdst4b46xn6e","https://www.exampl234e.com85fdst4b46xn6e","https://www.exam24ple.com86fdst4b46xn6e","https://ww24w.example.com87fdst4b46xn6e","https://www.example.com88fdst4b46xn6e","https://www.example.com89fdst4b46xn6e","https://www.example.com90fdst4b46xn6e","https://www.example.com91f5dst4b46xn6e","https://www.example.com92f4dst4b46xn6e","https://www.example.com93fdst43b46xn6e","https://www.example.com94fdst4b146xn6e"],
  ipv4: [ "0.0.0.0", "127.0.0.53", "127.0.0.1", "192.168.1.13", "0.0.0.0", "1.2.3.4"],
  ipv6: [ "fe00::0", "ff02::3", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "fe80::f2de:f1ff:fe55:53"],
  ipv62: 'xxxxx'.repeat(100000).split('').map( (x,i)=> `"2001:0db8:85a3:0000:${i}:0370:7334"` ),
  dates: ["1963-06-19", "2020-10-02"],
  dateTime: ["12:34:56.789", "12:34:56+01:00", "12:34:56"],
  dateTime2: 'xxxxx'.repeat(100000).split('').map( (x,i)=> `12:34:56.${i}` ),
  TelPass: ["555-1212", "555-1211112"],
  TelFail: ["(888)555-1212 ext. 532", "(800)FLOWERS"],
  URI: ["scheme:[//authority]path[?query][#fragment]", "https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top", "#fragment"],
  someString: 'xxxxx'.repeat(100000).split('').map( (x,i)=> `https://vvbwet2${x}f3vr${i}` ),
  ipv44: 'xxxxx'.repeat(100000).split('').map( (x,i)=> `ASR§B%B%NDVV192.${i}.1.13` ),
  //uris: new Array(100000).fill('https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#tophttps://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#tophttps://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#tophttps://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#tophttps://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top')
};
//console.log(testData.urlsFormat2); //   'https://www.example.com/?bar=a&inga=42&quuxasd94fdst4b46n6e',
// console.log(testData.someString); //   'https://vvbwet2xf3vr15',

for (let i=0; i<3; i++){
  console.log('######### run ' + i);
  
  const results:any = [];
  let checked = 0;
  const start = Date.now();
  for (const key in testData){
    checked += testData[key].length;
    //console.log(' ++ ' + key);
    let res = fastDetect(testData[key]);
    if(res.length){
      results.push({ key, res });
      //console.log({ key, res });
    } 
  }
  //console.log('');
  //results.forEach( (r:any)=> console.log({ key: r.key, formats: r.res.map( (f:any)=> f.format||f.$comment) }));

  results.forEach( (r:any)=> console.log({ key: r.key, formats: r.res }) );
  console.log('');
  console.log({checked: checked, matched: results.length, elapsed: Date.now()-start});
}

