
export class Metadata {
    public name: string;
    public predicate?: Function;
    public nameSerializationHandlers?: Array<(parent: any, metadata: Metadata) => string>;
    public nameDeserializationHandlers?: Array<(parent: any, metadata: Metadata, keyOptions: Array<string>) => string>;
    public dataDeserializationHandlers?: Array<Function>;
    public dataSerializationHandlers?: Array<Function>;
    public type?: Function;
    public typeName: string;

    public constructor() {

    }
}
export default Metadata;
