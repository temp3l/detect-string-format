import Ajv from "ajv";
import { JSONSchema7 } from "json-schema";
import isSafeRegex from 'safe-regex';

const getInstances = ({ schemas, options }: { schemas: JSONSchema7[]; options: Ajv.Options }) => schemas.map(schema => new Ajv(options).compile(schema));

export const defaultFormats = require("ajv/lib/compile/formats")('full'); // https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js

export type FormatOptions = { schemas?: JSONSchema7[]; options?: any; }

export default ({schemas, options}: FormatOptions) => {
  const _schemas: JSONSchema7[] = schemas || ["date", "time", "date-time", "uri", "url", "email", "ipv4", "ipv6", "uuid"].map(format => ({format}));
  const _options: any = options || { format: 'fast', minHits: 0 };
  const instances = getInstances({ schemas: _schemas, options: _options });
  return (values: string[]) => { // this functions gets exported and accepts arrays of strings as input!
    return instances.map((validate, i) => {
      if(_options.minHits && _options.minHits > 0 && _options.minHits > values.length)  return null; // minimum sample size
      return values.some((data: string) => !validate(data) ) ?  null : Object.assign({},_schemas[i], { hits: values.length });
    }).filter(d => d!==null);
  };
};

/*
const defaultFormats: string[] = ["date", "time", "date-time", "uri", "url", "email", "ipv4", "ipv6", "uuid"];
const customSchemas: JSONSchema7[] = [
  { pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$", $comment: "American Phone Number" },
  { pattern: "^4[0-9]{12}(?:[0-9]{3})?$", $comment: "Visa Credit Card" },
  { pattern: "^3[47][0-9]{13}$", $comment: "American Express Credit Card" },
  { pattern: "^3(?:0[0-5]|[68][0-9])[0-9]{11}$", $comment: "Diners Credit Club",},
  { pattern: "^DE([0-9a-zA-Z]\s?){20}$", $comment: "IBANN",},
  ...defaultFormats.map(format => ({ format }))
];
const fastDetect = returnFormatDetector(customSchemas, );
//const fastDetect = returnFormatDetector();
console.log({
  urlsFormat: fastDetect(["https://www.example.com/foo/?bar=baz&inga=42&quux", "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", "http://foo.com/unicode_(✪)_in_parens", "https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js"]),

  ipv4: fastDetect(["0.0.0.0", "127.0.0.53", "127.0.0.1", "192.168.1.13", "0.0.0.0", "1.2.3.4"]),
  ipv6: fastDetect(["fe00::0", "ff02::3", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "fe80::f2de:f1ff:fe55:53"]),

  dates: fastDetect(["1963-06-19", "2020-10-02"]),
  dateTime: fastDetect(["12:34:56.789", "12:34:56+01:00", "12:34:56"]),

  ame: fastDetect(["378734493671000"]),
  iban: fastDetect(["DE64500105178934265523"]),
  
  TelPass: fastDetect(["555-1212", "(888)555-1212"]),
  TelFail: fastDetect(["(888)555-1212 ext. 532", "(800)FLOWERS"]),

  URI: fastDetect(["scheme:[//authority]path[?query][#fragment]", "https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top", "#fragment"]),
  someString: fastDetect(["foo", "bar", "baz"])
});
*/