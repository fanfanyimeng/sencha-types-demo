
class fnTool {

    /**
     * 两个数加法
     */
    static fn21(): string {
        var num1 = Math.floor(Math.random() * 100) + 1;
        var num2 = Math.floor(Math.random() * 100) + 1;
        while ((num2 + num1) < 100) {
            num1 = num2 + num1;
        }
        return `<li>${num1}</li><li class="operator">+</li><li>${num2}</li>`
            + `<li class="operator">=</li>`;
    }

    /**
    * 两个数减法
    * @returns 
    */
    static fn22(): string {
        var num1 = Math.floor(Math.random() * 100) + 1;
        var num2 = Math.floor(Math.random() * 100) + 1;
        var max = 0, min = 0;
        if (num1 > num2) {
            max = num1;
            min = num2;
        } else {
            max = num2;
            min = num1;
        }

        while (max < 100) {
            max = max + min;
        }

        return `<li>${max}</li><li class="operator">-</li><li>${min}</li><li class="operator">=</li>`;
    }

    /**
     * 三个数加法
     */
    static fn31(): string {
        var num1 = Math.floor(Math.random() * 100) + 1;
        var num2 = Math.floor(Math.random() * 100) + 1;
        var num3 = Math.floor(Math.random() * 100) + 1;

        while ((num2 + num1 + num3) < 100) {
            num1 = num2 + num1;
            num3 = num2 + num3;
        }

        return `<li>${num1}</li><li class="operator">+</li><li>${num2}</li>`
            + `<li class="operator">+</li><li>${num3}</li>`
            + `<li class="operator">=</li>`;
    }

    /**
     * 两个1位数相加
     */
    static fn23(): string {
        var num1 = Math.floor(Math.random() * 10);
        var num2 = Math.floor(Math.random() * 10);
        return `<li>${num1}</li><li class="operator">+</li><li>${num2}</li>`
            + `<li class="operator">=</li>`;
    }

    /**
     * 两个1位数相减
     */
    static fn24(): string {
        var num1 = Math.floor(Math.random() * 10);
        var tmpNum = Math.floor(Math.random() * 10);
        var num2 = tmpNum;
        if (tmpNum > num1) {
            num2 = num1;
            num1 = tmpNum;
        }
        return `<li>${num1}</li><li class="operator">-</li><li>${num2}</li>`
            + `<li class="operator">=</li>`;
    }

    /**
     * 三个数连减
     * @returns 
     */
    static fn32(): string {
        var num1 = 0;
        var num2 = 0;
        var num3 = 0;
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        num3 = Math.floor(Math.random() * 100) + 1;
        while ((num2 + num1 + num3) < 100) {
            num1 = num2 + num1;
            num2 = num1 + num3;
        }

        return `<li>${num1 + num2 + num3}</li><li class="operator">-</li><li>${num2}</li>`
            + `<li class="operator">-</li><li>${num3}</li><li class="operator">=</li>`;
    }

    /**
     * 三个数先加后减
     * @returns 
     */
    static fn33(): string {
        var num1 = 0;
        var num2 = 0;
        var num3 = 0;
        num1 = Math.floor(Math.random() * 100) + 1;
        num2 = Math.floor(Math.random() * 100) + 1;
        do {
            num3 = Math.floor(Math.random() * 100) + 1;
        } while ((num1 + num2) < num3)

        return `<li>${num1 + num2 + num3}</li><li class="operator">+</li><li>${num2}</li>`
            + `<li class="operator">-</li><li>${num3}</li>`
            + `<li class="operator">=</li>`;
    }

    /**
     * 
     * @returns 三个数先减后加
     */
    static fn34(): string {
        var num1 = 0;
        var num2 = 0;
        var num3 = 0;

        do {
            num1 = Math.floor(Math.random() * 100) + 1;
        } while (num1 < 20)


        do {
            num2 = Math.floor(Math.random() * 100) + 1;
        } while (num1 < num2)


        num3 = Math.floor(Math.random() * 100) + 1;

        return `<li>${num1}</li><li class="operator">-</li><li>${num2}</li><li class="operator">+</li>`
            + `<li>${num3}</li><li class="operator">=</li>`;
    }

    /**
     * 三个1位数相加
     * @returns 
     */
    static fn35(): string {
        var num1 = Math.floor(Math.random() * 10 );
        var num2 = Math.floor(Math.random() * 10 );
        var num3 = Math.floor(Math.random() * 10 );

        

        return `<li>${num1}</li><li class="operator">+</li><li>${num2}</li>`
            + `<li class="operator">+</li><li>${num3}</li>`
            + `<li class="operator">=</li>`;
    }
};

(<any>window).generateFn = () => {

    const genCount: number = Number(document.getElementsByName("genCount")[0]["value"]);
    var sumTypes: string[] | null[] = [];
    document.getElementsByName("sumType").forEach((value) => {
        if (value["checked"] === true) {
            sumTypes[sumTypes.length] = value.getAttribute("value");
        }
    });
    var genType = 1;
    document.getElementsByName("genType").forEach((value) => {
        if (value["checked"] === true) {
            genType = Number(value.getAttribute("value"));
        }
    });


    const sumTypesLen = sumTypes.length;
    let html = '';
    for (let i = 0; i < genCount; i++) {

        let genFn: Function = (genType == 1) ?
            fnTool["fn" + sumTypes[i % sumTypesLen]] :
            fnTool["fn" + sumTypes[(Math.floor(Math.random() * 40) + 1) % sumTypesLen]];
        const item = genFn.call(null);

        html += `<span class='${i % 2 == 0 ? "s-left" : "s-right"}'>${item}</span>`
            + ((i > 0 && i % 2) == 1 ? "<br/>" : "");
    }
    const htmlEl = document.getElementById("printArea");
    if (htmlEl != null) {
        htmlEl.innerHTML = html;
    }






}


document.write(`<div id='menuArea'>
<input type="checkbox" name="sumType" value="21" checked/> 两个数加法
<input type="checkbox" name="sumType" value="22" /> 两个数减法

<br/>
<input type="checkbox" name="sumType" value="23" checked/> 两个个位数加法
<input type="checkbox" name="sumType" value="24" /> 两个个位数减法

<br/>
<input type="checkbox" name="sumType" value="31" /> 三个数连加
<input type="checkbox" name="sumType" value="35" /> 三个一位数连加
<input type="checkbox" name="sumType" value="32" /> 三个数连减
<br/>
<input type="checkbox" name="sumType" value="33" /> 三个数先加后减
<input type="checkbox" name="sumType" value="34" /> 三个数先减后加
<br/>
<br/>
生成多少个(10~500)
<input type="number" name="genCount" value="50"  min="10" max = "500" style="width:200px;"/> 
<input type="radio" name="genType" value="1" /> 顺序生成
<input type="radio" name="genType" value="2" checked /> 乱序生成
<br/><br/>
<button onclick='window.generateFn()'>生成</button>
<button onclick='javascript:window.print();'>打印</button>
</div>`);
document.write("<div id='printArea'/>");