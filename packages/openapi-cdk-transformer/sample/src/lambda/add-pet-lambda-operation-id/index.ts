import middy from '@middy/core'
import validator from '@middy/validator'
import jsonBodyParser from '@middy/http-json-body-parser'
import {createPetDtoSchema, IPetApiDelegate} from '../shared/generated';

const delegate: IPetApiDelegate = /*MAGIC INJECTION*/{addPetOperationId: async () => ({statusCode: 200, body: ''})};

const baseHandler = async (event, context, callback) => {
    return await delegate.addPetOperationId(event.body, event);
}

export const handler = middy(baseHandler)
    .use(jsonBodyParser())
    .use(validator(
        {inputSchema: createPetDtoSchema}
    ))
// .use(ourCustomHttpErrorHandler)