import Ajv from "ajv";
import { JSONSchema7 } from "json-schema";

//  See: https://github.com/epoberezkin/ajv for more information!
const ajvOptions: Ajv.Options = {
  allErrors: true,
  verbose: true,
  format: "full",
  inlineRefs: false,
  jsonPointers: true
};
const onlyUnique = (value: any, index: number, self: any[]) => self.indexOf(value) === index; // filter array
const getInstances = ({ schemas, options }: { schemas: JSONSchema7[]; options: Ajv.Options }) => schemas.map(schema => new Ajv(options).compile(schema));

// detect-formats:
const defaultFormats: string[] = ["date", "time", "date-time", "uri", "url", "email", "ipv4", "ipv6", "uuid"];

// you can enable more Formats, like:
//  [ "hostname", "json-pointer", "json-pointer-uri-fragment", "relative-json-pointer", "uri-reference", "regex" ]

// or write your own patterns:
// The following example matches a simple North American telephone number with an optional area code:

// See https://json-schema.org/ for more information
const sampleSchemas: JSONSchema7[] = [
  {
    type: "string",
    pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
  },
  ...defaultFormats.map((format): JSONSchema7 => ({ type: "string", format }))
];

export const returnFormats = (values: string[], schemas = sampleSchemas, options = ajvOptions) => {
  const instances = getInstances({ schemas, options });
  return instances
    .map((validate, i) => {
      const passed = values.map((data: string) => validate(data));
      const allMatch = passed.filter(onlyUnique);
      if (schemas && allMatch.length === 1 && allMatch[0] === true) return schemas[i];
    })
    .filter(d => d);
};

// Samples
console.log({
  urlsFormat: returnFormats(["https://www.example.com/foo/?bar=baz&inga=42&quux", "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", "http://foo.com/unicode_(✪)_in_parens", "https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js"]),

  ipv4: returnFormats(["0.0.0.0", "127.0.0.53", "127.0.0.1", "192.168.1.13", "0.0.0.0", "1.2.3.4"]),
  ipv6: returnFormats(["fe00::0", "ff02::3", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "fe80::f2de:f1ff:fe55:53"]),

  dates: returnFormats(["1963-06-19", "2020-10-02"]),
  dateTime: returnFormats(["12:34:56.789", "12:34:56+01:00", "12:34:56"]),

  TelPass: returnFormats(["555-1212", "(888)555-1212"]),
  TelFail: returnFormats(["(888)555-1212 ext. 532", "(800)FLOWERS"]),

  URI: returnFormats(["scheme:[//authority]path[?query][#fragment]", "https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top", "#fragment"]),
  someString: returnFormats(["foo", "bar", "baz"])
});

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
