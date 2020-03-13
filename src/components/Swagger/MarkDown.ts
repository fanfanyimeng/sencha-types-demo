import { SwaggerInfo, SwaggerParameterInfo, SwaggerDefinitionInfo, SwaggerDefinitionPropertyInfo } from './model/SwarggerInfo'

export class MarkDown {
    public static getParameterForMD(parameters: SwaggerParameterInfo[]): string {
        let result: string = '';
        parameters.forEach((item) => {
            result += `|${item.name} | ${item.description}  |${item.in} | ${item.schema !== undefined ? `${item.schema.$ref}` : `${item.type == undefined ? '' : item.type}`} |${item.default}|${item.required}|
`
        })
        return result.trim();
    }


    //获得模型名字
    public static getRefName(val: string): string {
        console.log(`valu 的值是 ${val}`);
        if (val == undefined) {
            return '';
        }
        if (val.startsWith("#") !== true) {
            return val;
        }
        let result = val.substring(val.lastIndexOf("/") + 1, val.length);
        console.log(`valu 的值是 ${val},result的值是${result}`);
        return result;
    }

    public static getModelMDTable(model: SwaggerDefinitionInfo): string {
        let result = '';
        if (model.title.startsWith("MsCommonResult") || model.title.startsWith("CommonResult")) {
            for (const key in model.properties) {
                const prop = model.properties[key] as SwaggerDefinitionPropertyInfo;
                result += `|${key}|${prop.type}|${key == "result" ? '0表示成功，其他值表示错误' : (key == "detail" ? 'result对应的消息文本' : (key == "data" ? '返回的数据' : prop.description))}    |
`
            }
        } else {
            for (const key in model.properties) {
                const prop = model.properties[key] as SwaggerDefinitionPropertyInfo;
                result += `|${key}|${prop.format ? `${prop.type}(${prop.format})` : prop.type}|${prop.description}|
`
            }
        }
        return result.trim();
    }

    public static getModelMDJSON(model: SwaggerDefinitionInfo): string {
        let result = '';
        for (const key in model.properties) {
            const prop = model.properties[key] as SwaggerDefinitionPropertyInfo;
            result += `"${key}":"${prop.description}",//${prop.type}
`    }
        return result.trim();
    }
    public static renderRefModel(swagger: SwaggerInfo, modelName: string): string {
        if (!modelName)
            return '';
        console.log(`modelName 的值是 ${modelName}`);
        modelName = MarkDown.getRefName(modelName);
        console.log(`格式化后modelName 的值是 ${modelName}`);
        var model = swagger.definitions[modelName] as SwaggerDefinitionInfo;

        let result = `-	${modelName} 

|名称|类型|描述   |
|:----    |:----- |-----   |
${MarkDown.getModelMDTable(model)}  
    
-	${modelName}
    
\`\`\` 
{
    ${MarkDown.getModelMDJSON(model)}
}

\`\`\` 
`;

        for (const key in model.properties) {
            const property = model.properties[key] as SwaggerDefinitionPropertyInfo;
            if (property.$ref) {
                result += MarkDown.renderRefModel(swagger, MarkDown.getRefName(property.$ref));
            } else if (property.items && property.items.$ref) {
                let typeModel = property.items.$ref.startsWith('#') ? MarkDown.getRefName(property.items.$ref) : property.items.$ref;
                result += MarkDown.renderRefModel(swagger, typeModel);
            }
        }

        return result.trim();
    }


    public static getPrametersMDDoc(swagger: SwaggerInfo, parameters: SwaggerParameterInfo[]): string {

        let result = '';
        parameters.forEach((p) => {
            if (p.schema) {
                var parameterModelName = MarkDown.getRefName(p.schema.$ref);
                if (parameterModelName == undefined) {
                    parameterModelName = MarkDown.getRefName(p.schema.items.$ref);
                }
                result += MarkDown.renderRefModel(swagger, parameterModelName);
            }
        });
        return result;

    }

    public static getPrametersTest(swagger: SwaggerInfo, parameters: SwaggerParameterInfo[]): string {

        let result = '';
        parameters.forEach((p) => {
            if (p.schema) {
                var parameterModelName = MarkDown.getRefName(p.schema.$ref);
                if (parameterModelName == undefined) {
                    parameterModelName = MarkDown.getRefName(p.schema.items.$ref);
                }
                result += MarkDown.renderRefModelTest(swagger, parameterModelName);
            }
        });
        return result;

    }


    public static renderRefModelTest(swagger: SwaggerInfo, modelName: string): string {
        if (!modelName)
            return '';
        console.log(`modelName 的值是 ${modelName}`);
        modelName = MarkDown.getRefName(modelName);
        console.log(`格式化后modelName 的值是 ${modelName}`);
        var model = swagger.definitions[modelName] as SwaggerDefinitionInfo;

        let result = `    
{
    ${MarkDown.getModelJSONTest(model)}
}

`;

        for (const key in model.properties) {
            const property = model.properties[key] as SwaggerDefinitionPropertyInfo;
            if (property.$ref) {
                result += MarkDown.renderRefModelTest(swagger, MarkDown.getRefName(property.$ref));
            } else if (property.items && property.items.$ref) {
                let typeModel = property.items.$ref.startsWith('#') ? MarkDown.getRefName(property.items.$ref) : property.items.$ref;
                result += MarkDown.renderRefModelTest(swagger, typeModel);
            }
        }

        return result.trim();
    }

    public static getModelJSONTest(model: SwaggerDefinitionInfo): string {
        let result = '';
        for (const key in model.properties) {
            result += `"${key}":"[CaseStep.${key}]",
`    }
        result = result.trim();
        if (result.endsWith(',')) {
            result = result.substring(0, result.length - 1);
        }
        return result;
    }

    public static renderTestResult(swagger: SwaggerInfo, modelName: string): string {
        if (!modelName)
            return '';
        console.log(`modelName 的值是 ${modelName}`);
        modelName = MarkDown.getRefName(modelName);
        console.log(`格式化后modelName 的值是 ${modelName}`);
        var model = swagger.definitions[modelName] as SwaggerDefinitionInfo;

        let result = ``;

        for (const key in model.properties) {

            const property = model.properties[key] as SwaggerDefinitionPropertyInfo;
            if (property.$ref) {
                result += `
${key}
${MarkDown.renderTestResult(swagger, MarkDown.getRefName(property.$ref))}

`
            } else if (property.items && property.items.$ref) {
                let typeModel = property.items.$ref.startsWith('#') ? MarkDown.getRefName(property.items.$ref) : property.items.$ref;
                result += `
${key}"
${MarkDown.renderTestResult(swagger, typeModel)}

`
            } else {
                if (property.type == 'integer' || property.type == 'number') {
                    result += `"${key}":[CaseStep.${key}]#获取${key}成功,${key}为[CaseStep.${key}]
`
                } else {
                    result += `"${key}":"[CaseStep.${key}]"#获取${key}成功,${key}为[CaseStep.${key}]
`
                }
            }

        }

        return result.trim();
    }


}