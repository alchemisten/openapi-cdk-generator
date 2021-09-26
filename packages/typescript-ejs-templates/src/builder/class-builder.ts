import { ClassImplBlock, CommentProps, MemberFunctionBodyProps, PropertyInterface } from '../templates';
import { IClassBuilder } from './types';

export class ClassBuilder implements IClassBuilder {
    public static createClass(name: string): IClassBuilder {
        return new ClassBuilder(name);
    }

    public comment?: string;

    public extendsClass?: string;

    public generics?: string;

    public implementsInterfaces?: string[];

    public jsDoc?: boolean;

    public properties: PropertyInterface[] = [];

    public methods: MemberFunctionBodyProps[] = [];

    public constructor(public name: string) {}

    public build(): ClassImplBlock {
        return {
            type: 'class-impl',
            name: this.name,
            extendsClass: this.extendsClass,
            implementsInterfaces: this.implementsInterfaces,
            generics: this.generics,
            comment: this.comment,
            jsDoc: this.jsDoc,
            properties: this.properties,
            methods: this.methods,
        };
    }

    public addImplementingInterface(...interfaces: string[]): IClassBuilder {
        if (!this.implementsInterfaces) {
            this.implementsInterfaces = interfaces;
        } else {
            this.implementsInterfaces = [...this.implementsInterfaces, ...interfaces];
        }

        return this;
    }

    public addMethod(method: Omit<MemberFunctionBodyProps, 'functionType'>): IClassBuilder {
        this.methods.push({
            functionType: 'member',
            ...method,
        });
        return this;
    }

    public addProperty(property: PropertyInterface): IClassBuilder {
        this.properties.push(property);
        return this;
    }

    public setComment(comment: CommentProps): IClassBuilder {
        this.comment = comment.comment;
        this.jsDoc = comment.jsDoc;
        return this;
    }

    public setExtends(extend: string): IClassBuilder {
        this.extendsClass = extend;
        return this;
    }

    public setGeneric(generic: string): IClassBuilder {
        this.generics = generic;
        return this;
    }

    public setName(name: string): IClassBuilder {
        this.name = name;
        return this;
    }
}
