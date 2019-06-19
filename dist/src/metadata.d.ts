export declare class Metadata {
    name: string;
    predicate?: Function;
    namePredicate?: (metadata: Metadata, keyOptions: Array<string>) => string;
    dataDeserializationHandlers?: Array<Function>;
    dataSerializationHandlers?: Array<Function>;
    type?: Function;
    typeName: string;
    constructor();
}
export default Metadata;
