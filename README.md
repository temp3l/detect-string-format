# detect-string-formats

- Takes an Array of Strings and returns an array of formats when all strings match
- Uses AJV: https://github.com/epoberezkin/ajv

## installation

```bash

yarn add detect-string-format

import returnFormatDetector from "detect-string-format";

```

### usage

```ts
const fastDetect = returnFormatDetector(stringFormats, ajvOptions);

const formats: any[] = fastDetect(["0.0.0.0", "127.0.0.53", "127.0.0.1"]);
```

## enabled by default

```ts
const enabled: any = ["date", "time", "date-time", "uri", "url", "email", "ipv4", "ipv6", "uuid"];

// disabled because of false-positives:
const disabled: any = ["hostname", "json-pointer", "json-pointer-uri-fragment", "relative-json-pointer", "uri-reference", "regex"];
```

## adding custom formats and patterns

- The following example matches a simple North American telephone number with an optional area code:

```ts
const customSchemas = [
  {
    type: "string",
    pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
  }
];

const allFormats = [...enabled, ...customSchemas];
```

## AJV Config Options

```ts
const options: Ajv.Options = {
  allErrors: true,
  verbose: true,
  format: "full",
  inlineRefs: false,
  jsonPointers: true
};
```

## Sample Usage

```ts
// just call returnFormats and pass an arry of strings!
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
```

## Sample output

```ts
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
```

## See test folder for more example code
