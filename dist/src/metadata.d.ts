declare type Metadata = {
    name: string;
    type: Function;
} | {
    name: string;
    predicate: Function;
} | {
    name: string;
    dataPredicate: Function;
};
export default Metadata;
