export interface Foo {
    bar: string;
}

export interface GetFooParams {
    some: string;
}

export interface GetFooQuery {
    snacks?: string;
}

export interface GetFooProps {
    params: GetFooParams;
    query: GetFooQuery;
}

export interface ISampleController {
    getFoo(props: GetFooProps): Promise<Foo>;
}
