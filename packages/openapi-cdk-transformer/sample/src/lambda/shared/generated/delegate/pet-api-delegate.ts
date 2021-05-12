import type {APIGatewayProxyEvent, APIGatewayProxyResult} from 'aws-lambda';
import {CreatePetDto} from "../dto";
import {ApiDelegateWrapper} from "./types";
import {IPetApiInterface} from "../api";

export interface IPetApiDelegate extends ApiDelegateWrapper<IPetApiInterface> {}

const test = async (wrapper: ApiDelegateWrapper<IPetApiInterface>) => {
    const dto: CreatePetDto = {
        name: "ABC"
    }
    const event = {} as APIGatewayProxyEvent

    const a = await wrapper.addPetOperationId(event, dto)
}
