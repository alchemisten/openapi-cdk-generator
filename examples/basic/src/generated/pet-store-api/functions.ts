import { IFunction } from '@aws-cdk/aws-lambda';

export interface IDefaultFunctions {
    /**
     * Get some test values
     */
    getAllTestObjects: IFunction;

    /**
     * Create new test value
     */
    createTestObject: IFunction;
}
