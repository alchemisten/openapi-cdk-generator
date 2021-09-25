import { IFunction } from '@aws-cdk/aws-lambda';

/**
 * Some simple functions to test the generator
 */
export interface ITestFunctions {
    /**
     * Get some test values
     */
    getAllTestObjects: IFunction;

    /**
     * Create new test value
     */
    createTestObject: IFunction;
}
