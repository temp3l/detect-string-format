import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';
import returnFormatDetector from '../lib/detect-format';
const ajv = new Ajv({ allErrors: true });

const schema: JSONSchema7 = {
  properties: {
    start: {
      type: 'string',
      title: 'start',
      description: 'start description',
      minLength: 0,
      default: '2019-09-08T15:54:08.822Z',
      examples: ['10000.00000000', '20000.00000000', '50000.00000000']
    }
  },
  required: ['start']
};

let valid = ajv.validate(schema, {
  //start: new Date().toDateString()
  start: '10000.00000000'
});
if (!valid) {
  console.log(ajv.errors);
} else console.log('isValid!');
