//FROM OPENAPI_GENERATOR WITH SPECIAL MUSTACHE TEMPLATE!

import {BasicPetDto, CreatePetDto} from "../dto";

export interface IPetApiInterface {
    addPetOperationId(body: CreatePetDto): Promise<Array<BasicPetDto>>;
}