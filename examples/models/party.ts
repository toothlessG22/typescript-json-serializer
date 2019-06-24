import { Animal } from './animal';
import { DataHandler } from './../../src/metadata';
import { Serializable, JsonProperty } from '../../src';

const dataSerializationHandler: DataHandler = (data: any): any => {
    return { 'inviteeData': data };
};
const dataDeserializationHandler: DataHandler = (data: any): any => {
    return data['inviteeData'];
};

@Serializable()
export class Party {
    @JsonProperty({
        name: 'animals',
        type: Animal,
        dataDeserializationHandlers: [dataDeserializationHandler],
        dataSerializationHandlers: [dataSerializationHandler]
    })
    public animals: Array<Animal>;
}
