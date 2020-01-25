"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_1 = __importDefault(require("lodash"));
const ajv_1 = __importDefault(require("ajv")); // yarn add ajv
//import formats from "ajv/lib/compile/formats"; // https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js
//https://github.com/epoberezkin/ajv
//https://github.com/epoberezkin/ajv/blob/master/spec/typescript/index.ts
// const full = formats("full"); //const validator = instance.compile({});
// const fast = formats("fast"); //const allFormats = Object.keys(full);
const sample_data = require("../test/format.json");
const allFormats = ["date", "time", "date-time", "uri", "url", "email", "hostname", "ipv4", "ipv6", "uuid"];
// "json-pointer", "json-pointer-uri-fragment", "relative-json-pointer", "uri-reference", "uri-template", "regex"
const options = {
    allErrors: true,
    verbose: true,
    format: "full",
    inlineRefs: false,
    jsonPointers: true
};
const getInstances = ({ allFormats, options }) => {
    return allFormats.map(format => new ajv_1.default(options).compile({ format }));
};
exports.returnFormats = (values) => {
    const instances = getInstances({ allFormats, options });
    const results = instances
        .map((validate, i) => {
        const passed = values.map((data) => validate(data));
        const allMatched = lodash_1.default.union(passed).length === 1 && lodash_1.default.union(passed)[0] === true;
        if (allMatched)
            return allFormats[i];
    })
        .filter(d => d);
    return results;
};
console.log({
    urlsFormat: exports.returnFormats(["https://www.example.com/foo/?bar=baz&inga=42&quux", "http://userid@example.com:8080/", "http://foo.com/unicode_(✪)_in_parens", "https://github.com/epoberezkin/ajv/blob/master/lib/compile/formats.js"]),
    someString: exports.returnFormats(["fpp", "bar", "baz"]),
    someInts: exports.returnFormats([123, 34, 534, 5647, 58, 7698, 754, 6256, 25624, 753685, 7532, 5].map(String))
});
const just4fun = () => {
    let categories = lodash_1.default.map(sample_data, (sample, i) => {
        const { description, schema, tests } = sample;
        if (schema.format === "allowedUnknown")
            return false;
        const validate = new ajv_1.default(options).compile(schema);
        lodash_1.default.forEach(tests, (test, i) => {
            const { data, valid: validExpected } = test;
            const isValid = validate(data);
            if (isValid !== validExpected)
                console.log(validate.errors); //just for fun
        });
        return {
            description,
            schema,
            pass: tests.filter((t) => t.valid).map((t) => t.data),
            fail: tests.filter((t) => !t.valid).map((t) => t.data)
        };
    }).filter(d => d !== false);
    //loop test categories
    categories.forEach((category) => {
        const instances = getInstances({ allFormats, options });
        const { schema, pass, fail, description } = category;
        //console.log(description); // loop tests where we should find a format
        //console.log(instances);
        let results = instances
            .map((validate, i) => {
            let passed = pass.map((data) => validate(data));
            return {
                correct: schema.format,
                testedFormat: allFormats[i],
                description,
                data: pass,
                passed,
                allMatch: lodash_1.default.union(passed).length === 1 && lodash_1.default.union(passed)[0] === true
            };
        })
            .filter(res => res.allMatch) // filter 100 % successfull matches
            .map(res => {
            let { testedFormat, data, description } = res;
            console.log(`${testedFormat} \t\t matched all samples from ${description}`);
        });
    });
};
