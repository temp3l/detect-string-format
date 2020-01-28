# detect-string-formats

- Takes an Array of Strings as inputs
- Gives an Arrray of Formats as output when ALL of the strings match a certain format
- Uses AJV: https://github.com/epoberezkin/ajv

## installation

```bash

yarn add detect-string-format

import returnFormatDetector from "detect-string-format";

```

### usage

```ts

// quick start with default formats:
const fastDetect = returnFormatDetector(); // returns a function
const results = fastDetect(["0.0.0.0", "127.0.0.53", "127.0.0.1"]);
```

## defaults:

```ts
const defaultFormats: JSONSchema7 = ["date", "time", "date-time", "uri", "url", "email", "ipv4", "ipv6", "uuid"].map(format => ({ format }));
// you may want to add any of these: 
// ["hostname", "json-pointer", "json-pointer-uri-fragment", "relative-json-pointer", "uri-reference", "regex"];

```

## add custom formats/schemas
- The following example matches a simple North American telephone number with an optional area code:

```ts
const customSchemas: JSONSchema7[] = [
  {
    pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$"
  },
  ...defaultFormats.map(format => ({ format }))
];

// default options for Ajv:
const options: Ajv.Options = { format: "full" };

// custom schemas/formats:
const fastDetect = returnFormatDetector(formats, options);
```


## Sample Usage

```ts
// just call returnFormats and pass an arry of strings!

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
```

## Sample output

```ts
let result = {
  urlsFormat: [{ format: "url" }],
  ipv4: [{ format: "ipv4" }],
  ipv6: [{ format: "ipv6" }],
  dates: [{ format: "date" }],
  dateTime: [{ format: "time" }],
  TelPass: [{ pattern: "^(\\([0-9]{3}\\))?[0-9]{3}-[0-9]{4}$" }],
  TelFail: [],
  URI: [],
  someString: []
};
```

## See test folder for more example code
