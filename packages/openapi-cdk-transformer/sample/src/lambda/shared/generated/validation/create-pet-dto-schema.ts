export const createPetDtoSchema = {
    type: 'object',
    properties: {
        body: {
            type: 'object',
            properties: {
                name: { type: 'string', minLength: 1, maxLength: 10, pattern: '\d+' },
            },
            required: ['name']
        }
        // possible to add parameter requirements!
    }
}