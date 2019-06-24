
export class Metadata {
    public name: string;
    public predicate?: Function;
    public nameDeserializationHandlers?: Array<NameDeserializationHandler>;
    public nameSerializationHandlers?: Array<NameSerializationHandler>;
    public dataDeserializationHandlers?: Array<DataHandler>;
    public dataSerializationHandlers?: Array<DataHandler>;
    public type?: Function;
    public typeName: string;

    public constructor() {

    }
}

export type NameDeserializationHandler = (parent: any, metadata: Metadata, keyOptions: Array<string>) => string;
export type NameSerializationHandler = (parent: any, metadata: Metadata) => string;
export type DataHandler = (data: any) => any;
