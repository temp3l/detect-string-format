"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ajv_1 = __importDefault(require("ajv"));
const ajv = new ajv_1.default({ allErrors: true });
const schema = {
    properties: {
        start: {
            type: "string",
            title: "start",
            description: "start description",
            minLength: 0,
            default: "2019-09-08T15:54:08.822Z",
            examples: ["10000.00000000", "20000.00000000", "50000.00000000"]
        }
    },
    required: ["start"]
};
const valid = ajv.validate(schema, {
    //start: new Date().toDateString()
    start: "10000.00000000"
});
if (!valid) {
    console.log(ajv.errors);
}
else
    console.log("isValid!");
