export declare class Metadata {
    name: string;
    predicate?: Function;
    nameSerializationHandlers?: Array<(parent: any, metadata: Metadata) => string>;
    nameDeserializationHandlers?: Array<(parent: any, metadata: Metadata, keyOptions: Array<string>) => string>;
    dataDeserializationHandlers?: Array<Function>;
    dataSerializationHandlers?: Array<Function>;
    type?: Function;
    typeName: string;
    constructor();
}
export default Metadata;
