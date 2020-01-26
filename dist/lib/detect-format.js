"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
//  See: https://github.com/epoberezkin/ajv for more information!
const ajvOptions = {
    allErrors: true,
    verbose: true,
    format: "full",
    inlineRefs: false,
    jsonPointers: true
};
const onlyUnique = (value, index, self) => self.indexOf(value) === index; // filter array
const getInstances = ({ schemas, options }) => schemas.map(schema => new ajv_1.default(options).compile(schema));
// detect-formats:
const defaultFormats = ["date", "time", "date-time", "uri", "url", "email", "ipv4", "ipv6", "uuid"];
// you can enable more Formats, like:
//  [ "hostname", "json-pointer", "json-pointer-uri-fragment", "relative-json-pointer", "uri-reference", "regex" ]
// or write your own patterns:
// The following example matches a simple North American telephone number with an optional area code:
// See https://json-schema.org/ for more information
const sampleSchemas = [
    {
        pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
    },
    ...defaultFormats.map((format) => ({ format }))
];
// export const returnFormats = (values: string[], schemas = sampleSchemas, options = ajvOptions) => {
//   const instances = getInstances({ schemas, options });
//   return instances
//     .map((validate, i) => {
//       const passed = values.map((data: string) => validate(data));
//       const allMatch = passed.filter(onlyUnique);
//       if (schemas && allMatch.length === 1 && allMatch[0] === true) return schemas[i];
//     })
//     .filter(d => d);
// };
// let fastFormatter = returnFormatDetector(sampleSchemas, ajvOptions); // returns a function
// fastFormatter(["fe00::0", "ff02::3", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "fe80::f2de:f1ff:fe55:53"]) // returns the formats
exports.returnFormatDetector = (schemas = sampleSchemas, options = ajvOptions) => {
    const instances = getInstances({ schemas, options });
    return (values) => {
        return instances
            .map((validate, i) => {
            const passed = values.map((data) => validate(data));
            const allMatch = passed.filter(onlyUnique);
            if (schemas && allMatch.length === 1 && allMatch[0] === true)
                return schemas[i];
        })
            .filter(d => d);
    };
};
// let start = Date.now();
// let fastFormatter = returnFormatDetector(sampleSchemas, ajvOptions);
// let res = [];
// for (var i = 0; i < 1000; i++) {
//   res.push(fastFormatter(["fe00::0", "ff02::3", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "fe80::f2de:f1ff:fe55:53", "https://www.example.com/foo/?bar=baz&inga=42&quux", "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", "http://foo.com/unicode_(✪)_in_parens", "https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js", "https://www.example.com/foo/?bar=baz&inga=42&quux", "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", "http://foo.com/unicode_(✪)_in_parens", "https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js",]));
// }
// console.log({ elapsed: Date.now() - start });
// Samples
// let fastFormatter = returnFormatDetector(sampleSchemas, ajvOptions); // returns a function
// console.log({
//   urlsFormat: fastFormatter(["https://www.example.com/foo/?bar=baz&inga=42&quux", "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", "http://foo.com/unicode_(✪)_in_parens", "https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js"]),
//   ipv4: fastFormatter(["0.0.0.0", "127.0.0.53", "127.0.0.1", "192.168.1.13", "0.0.0.0", "1.2.3.4"]),
//   ipv6: fastFormatter(["fe00::0", "ff02::3", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "fe80::f2de:f1ff:fe55:53"]),
//   dates: fastFormatter(["1963-06-19", "2020-10-02"]),
//   dateTime: fastFormatter(["12:34:56.789", "12:34:56+01:00", "12:34:56"]),
//   TelPass: fastFormatter(["555-1212", "(888)555-1212"]),
//   TelFail: fastFormatter(["(888)555-1212 ext. 532", "(800)FLOWERS"]),
//   URI: fastFormatter(["scheme:[//authority]path[?query][#fragment]", "https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top", "#fragment"]),
//   someString: fastFormatter(["foo", "bar", "baz"])
// });
/*
// Will return:
{
  urlsFormat: [ 'url' ],
  ipv4: [ 'ipv4' ],
  ipv6: [ 'ipv6' ],
  dates: [ 'date' ],
  dateTime: [ 'time' ],
  TelPass: [
    { type: 'string', pattern: '^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$' }
  ],
  TelFail: [],
  URI: [],
  someString: []
}
*/
