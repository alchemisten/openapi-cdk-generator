import { Construct } from "@aws-cdk/core";
class Snoot extends Construct {
    constructor(scope: Construct, id: string) {
        super(scope, id);
    }
    async snacks(): Promise<number> {
        return 0;
    }
}