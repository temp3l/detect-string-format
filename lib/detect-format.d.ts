import Ajv from 'ajv';
import { JSONSchema7 } from 'json-schema';
export declare const defaultFormats: string[];
export declare type FormatterOptions = {
    minHits: number;
};
export declare type FormatOptions = {
    schemas?: JSONSchema7[];
    options?: FormatterOptions;
    ajvOptions?: Ajv.Options;
};
declare const _default: ({ schemas, options, ajvOptions }: FormatOptions) => Function;
export default _default;
