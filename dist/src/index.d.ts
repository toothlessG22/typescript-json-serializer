import 'reflect-metadata';
import { Metadata, DataHandler, NameDeserializationHandler, NameSerializationHandler } from './metadata';
export { Metadata, DataHandler, NameDeserializationHandler, NameSerializationHandler };
export interface JsonPropertyInput {
    name?: string;
    predicate?: Function;
    nameSerializationHandlers?: Array<NameSerializationHandler>;
    nameDeserializationHandlers?: Array<NameDeserializationHandler>;
    dataDeserializationHandlers?: Array<DataHandler>;
    dataSerializationHandlers?: Array<DataHandler>;
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
