export interface SwaggerTagInfo {
    name: string,
    description: string
}
export interface SwaggerParameterInfo {
    description: string;
    in: string;
    name: string;
    type?:string,
    required: boolean;
    default?:string
    schema: { $ref: string 
        items:{
            $ref:string
        }
    };
}
export interface SwaggerReponseInfo {
    "200": {
        description: string;
        schema: { 
            type:string
            $ref: string
         };
    }
}
export interface SwaggerPathInfo {
    consumes: string[],
    operationId: string[],
    parameters: SwaggerParameterInfo[],
    produces: string,
    responses: SwaggerReponseInfo,
    summary: string,
    
    tags: string[],
    path?:string,
    description?:string,
    author?:string,
    method?:string,
}

export interface SwaggerDefinitionPropertyInfo{
    type:string,
    description:string,
    allowEmptyValue:string
    items:{$ref:string}
    $ref?:string,
    format:string
}

export interface SwaggerDefinitionInfo{
    type:string,
    title:string,
    properties:object
}

export interface SwaggerInfo {
    swagger: string,
    info: { version: string, title: string },
    host: string,
    basePath: string,
    definitions: object,
    paths: object,
    tags: SwaggerTagInfo[]
}