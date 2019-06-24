export declare class Metadata {
    name: string;
    predicate?: Function;
    nameDeserializationHandlers?: Array<NameDeserializationHandler>;
    nameSerializationHandlers?: Array<NameSerializationHandler>;
    dataDeserializationHandlers?: Array<DataHandler>;
    dataSerializationHandlers?: Array<DataHandler>;
    type?: Function;
    typeName: string;
    constructor();
}
export declare type NameDeserializationHandler = (parent: any, metadata: Metadata, keyOptions: Array<string>) => string;
export declare type NameSerializationHandler = (parent: any, metadata: Metadata) => string;
export declare type DataHandler = (data: any) => any;
