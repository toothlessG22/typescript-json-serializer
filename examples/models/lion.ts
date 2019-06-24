import { Animal } from './animal';
import { Serializable } from '../../src';

// This class is meant to be empty to test handling of empty classes
@Serializable('Animal')
export class Lion extends Animal {
    public constructor(public name: string) {
        super(name);
    }
}
