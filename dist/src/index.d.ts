import 'reflect-metadata';
import Metadata from './metadata';
export { Metadata };
export interface JsonPropertyInput {
    name?: string;
    predicate?: Function;
    namePredicate?: (metadata: Metadata, keyOptions: Array<string>) => string;
    dataDeserializationHandlers?: Array<Function>;
    dataSerializationHandlers?: Array<Function>;
    type?: Function;
}
/**
 * Decorator JsonProperty
 */
export declare function JsonProperty(args?: JsonPropertyInput): Function;
/**
 * Decorator Serializable
 */
export declare function Serializable(baseClassName?: string): Function;
/**
 * Function to deserialize json into a class
 */
export declare function deserialize(json: any, type: any): any;
/**
 * Function to serialize a class into json
 */
export declare function serialize(instance: any, removeUndefined?: boolean): any;
