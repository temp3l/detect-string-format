/* eslint-disable prettier/prettier */
import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';
//export const defaultFormats = require('ajv/lib/compile/formats')('full'); // https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js

const getInstances = ({ schemas, options }: { schemas: JSONSchema7[]; options?: Ajv.Options }): Function[] => schemas.map(schema => new Ajv(options || { format: 'full' }).compile(schema));

export const defaultFormats = ['date', 'time', 'date-time', 'uri', 'email', 'ipv4', 'ipv6', 'uuid'];

export type FormatterOptions = {
  minHits: number;
};
export type FormatOptions = {
  schemas?: JSONSchema7[];
  options?: FormatterOptions;
  ajvOptions?: Ajv.Options;
};

export default ({ schemas, options, ajvOptions }: FormatOptions): Function => {
  const _schemas: JSONSchema7[] = schemas || defaultFormats.map(format => ({ format }));
  const _options: FormatterOptions = options || { minHits: 0 };
  const { minHits } = _options;
  const instances = getInstances({ schemas: _schemas, options: ajvOptions }); // create ajv instances
  return (values: string[]): object => {
    if (!values || !values.length) return [];
    if (minHits > 0 && minHits > values.length) return []; // abort on low sample Size

    return instances
      .map((validate, i) => {
        return values.some((data: string) => !validate(data))
          ? null
          : Object.assign({}, _schemas[i], {
              $comment: `${_schemas[i].$comment || _schemas[i].format} matched:${values.length}`
            });
      })
      .filter(d => d !== null);
  };
};

/*
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
