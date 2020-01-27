import Ajv from "ajv";
import { JSONSchema7 } from "json-schema";

//  See: https://github.com/epoberezkin/ajv for more information!

const getInstances = ({ schemas, options }: { schemas: JSONSchema7[]; options: Ajv.Options }) => schemas.map(schema => new Ajv(options).compile(schema));


export const returnFormatDetector = (schemas?:JSONSchema7[], options?:Ajv.Options) => {
  const _schemas: JSONSchema7[] = schemas || ["date", "time", "date-time", "uri", "url", "email", "ipv4", "ipv6", "uuid"].map(format => ({format}));
  const _options: Ajv.Options = options || {format: 'full'};
  const instances = getInstances({ schemas: _schemas, options: _options });
  return (values: string[]) => {
    return instances
      .map((validate, i) => {
        const passed = values.map((data: string) => validate(data));
        return passed.length > 1 && passed.indexOf(false) === -1 ? _schemas[i] : false;   
      })
      .filter(d => d);
  };
};
/* 

const defaultFormats: string[] = ["date", "time", "date-time", "uri", "url", "email", "ipv4", "ipv6", "uuid"];
const customSchemas: JSONSchema7[] = [
  {
    pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
  },
  ...defaultFormats.map(format => ({ format }))
];

const fastDetect = returnFormatDetector(customSchemas, );
const formats: any[] = fastDetect(["0.0.0.0", "127.0.0.53", "127.0.0.1"]);
const af = fastDetect(["fe00::0", "ff02::3", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "fe80::f2de:f1ff:fe55:53"]);

console.log({formats,af});
 */

const fastDetect = returnFormatDetector();

console.log({
  urlsFormat: fastDetect(["https://www.example.com/foo/?bar=baz&inga=42&quux", "http://-.~_!$&'()*+,;=:%40:80%2f::::::@example.com", "http://foo.com/unicode_(✪)_in_parens", "https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js"]),

  ipv4: fastDetect(["0.0.0.0", "127.0.0.53", "127.0.0.1", "192.168.1.13", "0.0.0.0", "1.2.3.4"]),
  ipv6: fastDetect(["fe00::0", "ff02::3", "2001:0db8:85a3:0000:0000:8a2e:0370:7334", "fe80::f2de:f1ff:fe55:53"]),

  dates: fastDetect(["1963-06-19", "2020-10-02"]),
  dateTime: fastDetect(["12:34:56.789", "12:34:56+01:00", "12:34:56"]),

  TelPass: fastDetect(["555-1212", "(888)555-1212"]),
  TelFail: fastDetect(["(888)555-1212 ext. 532", "(800)FLOWERS"]),

  URI: fastDetect(["scheme:[//authority]path[?query][#fragment]", "https://john.doe@www.example.com:123/forum/questions/?tag=networking&order=newest#top", "#fragment"]),
  someString: fastDetect(["foo", "bar", "baz"])
});

