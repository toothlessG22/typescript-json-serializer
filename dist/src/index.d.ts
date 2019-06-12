import 'reflect-metadata';
declare type JsonPropertyInput = string | {
    name?: string;
    type: Function;
} | {
    name?: string;
    predicate: Function;
} | {
    name?: string;
    dataPredicate: Function;
} | {
    name?: string;
    type: Function;
    dataPredicate: Function;
};
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
export {};
