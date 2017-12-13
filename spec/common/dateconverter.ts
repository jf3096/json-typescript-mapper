import {ICustomConverter} from '../../index';

const dateConverter: ICustomConverter = {
    fromJson(data: any): any {
        return new Date(data);
    },

    toJson(data: any): any {
        return 'some-date';
    }
};

export default dateConverter;