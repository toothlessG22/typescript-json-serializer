import { Panther } from './panther';
import { Metadata } from './../../src/metadata';
import { Serializable, JsonProperty } from './../../src';

import { Gender } from './gender';
import { Status } from './status';

const nameDeserializationHandler: (parent: any, metadata: Metadata, keyOptions: Array<string>) => string = (parent: any, metadata: Metadata, keyOptions: Array<string>): string => {
    if (parent instanceof Panther) {
        if (keyOptions.includes('5StarRating')) {
            return '5StarRating';
        }
    }
    return metadata.name;
};

const nameSerializationHandler: (parent: any, metadata: Metadata) => string = (parent: any, metadata: Metadata): string => {
    if (parent instanceof Panther) {
        return '5StarRating';
    }
    return metadata.name;
};

@Serializable()
export class Animal {

    @JsonProperty()
    public id: number;
    @JsonProperty()
    public name: string;
    @JsonProperty()
    public birthDate: Date;
    @JsonProperty()
    public numberOfPaws: number;
    @JsonProperty()
    public gender: Gender;
    @JsonProperty({ name: 'childrenIdentifiers' })
    public childrenIds: Array<number>;
    @JsonProperty()
    public status: Status;
    @JsonProperty({
        name: 'rating',
        dataDeserializationHandlers: [
            (data: any): any => data * 2,
            (data: any): any => data + 1
        ],
        dataSerializationHandlers: [
            (data: any): any => data - 1,
            (data: any): any => data / 2
        ],
        nameDeserializationHandlers: [nameDeserializationHandler],
        nameSerializationHandlers: [nameSerializationHandler]
    })
    public rating: number;

    public constructor(name: string) {
        this.name = name;
    }

}
