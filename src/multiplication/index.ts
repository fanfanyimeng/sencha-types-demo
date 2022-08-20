
class fnTool1 {

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
            + `<li class="operator">-</li><li>${num3}</li><li class="operator"  style="margin-right:60px;">=</li>`;
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
            + `<li class="operator" style="margin-right:60px;">=</li>`;
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
            + `<li>${num3}</li><li class="operator"  style="margin-right:60px;">=</li>`;
    }
};

(<any>window).generateFn = () => {
    interface expression {
        x:number;
        y:number;
    }
    let expressions = [];
    for (let i = 1; i <= 9; i++) {
        for (let j = 9; j > 0; j--) {
            expressions[expressions.length] = {x:i,y:j} as expression;
        }
    }



    let html = '';
    let count = 0;
    while (expressions.length > 0) {
        count++;
        let index = Math.floor(expressions.length * Math.random());
        let item = expressions[index] as expression;
        expressions.splice(index, 1);
        html += `<span><li>${item.x}</li><li class="operator">X</li><li>${item.y}</li><li class="operator">=</li></span>`;
        if(count == 24){
            break;
        }
        if (count % 3 == 0) {
            html += '<br />';
        }
    }
    html += '<br />';
    count = 0;
    expressions = [];
    for (let i = 1; i <= 9; i++) {
        for (let j = 9; j > 0; j--) {
            expressions[expressions.length] = {x:i,y:j} as expression;
        }
    }

    while (expressions.length > 0) {
        count++;
        let index = Math.floor(expressions.length * Math.random());
        let item = expressions[index] as expression;
        expressions.splice(index, 1);
        html += `<span><li>${item.x * item.y}</li><li class="operator">÷</li><li>${item.y}</li><li class="operator">=</li></span>`;
        if(count == 24){
            break;
        }
        if (count % 3 == 0) {
            html += '<br />';
        }
    }

    html += '<br />';
    count = 18;
    while(count > 0){
        html += `<span>${fnTool1.fn32()}</span>`;
        count --;
        if (count % 2 == 0) {
            html += '<br />';
        }
        if(count<=0){
            break;
        }
        html += `<span>${fnTool1.fn33()}</span>`;
        count --;
        if (count % 2 == 0) {
            html += '<br />';
        }
        if(count<=0){
            break;
        }
        html += `<span>${fnTool1.fn34()}</span>`;
        count --;
        if (count % 2 == 0) {
            html += '<br />';
        }
        if(count<=0){
            break;
        }
    }

    const htmlEl = document.getElementById("printArea");
    if (htmlEl != null) {
        htmlEl.innerHTML = html;
    }
}


document.write(`<div id='menuArea'>
<button onclick='window.generateFn()'>生成</button>
<button onclick='javascript:window.print();'>打印</button>
</div>`);
document.write("<div id='printArea'/>");