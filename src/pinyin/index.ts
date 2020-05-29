interface py {
    name: string;
    ziMu: string[];
    zi: string[];
}

const shengMu = ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s", "y", "w"];
const shengMuZi = ["播", "泼", "摸", "佛", "得", "特", "讷", "勒", "哥", "科", "喝", "鸡", "气", "西", "知", "吃", "狮", "日", "字", "刺", "丝", "医", "屋"];

const danYunMu = ["a", "o", "e", "i", "u", "ü"];
const danYunMuZi = ["啊", "喔", "鹅", "衣", "乌", "迂"];

const fuYunMu = ["ai", "ei", "ui", "ao", "ou", "iu", "ie", "üe", "er", "an", "en", "in", "un", "ün", "ang", "eng", "ing", "ong"];
const fuYunMuZi = ["爱", "欸", "威", "熬", "欧", "优", "耶", "约", "儿", "安", "恩", "因", "温", "晕", "昂", "亨", "英", "翁"];

const zhengTiRenDu = ["zhi", "chi", "shi", "ri", "zi", "ci", "si", "yi", "wu", "yu", "ye", "yue", "yuan", "yin", "yun", "ying"];
const zhengTiRenDuZi = ["织", "吃", "狮", "日", "字", "刺", "丝", "衣", "乌", "鱼", "爷", "月", "圆", "因", "云", "鹰"];


const pyGroup: py[] = [
    { name: "声母", ziMu: shengMu, zi: shengMuZi },
    { name: "单韵母", ziMu: danYunMu, zi: danYunMuZi },

    { name: "复韵母", ziMu: fuYunMu, zi: fuYunMuZi },

    { name: "整体认读音节", ziMu: zhengTiRenDu, zi: zhengTiRenDuZi },
];




(<any>window).generateFn = (isRandom: boolean) => {

    const area = document.getElementById("printArea");
    if (area == null) {
        return;
    }

    area.innerHTML = "";

    pyGroup.forEach((el: py, index: number) => {

        const name = el.name;
        let html = `<span class="title">${name}</span><br/>`;
        if (index > 0) {
            html = `<br/><br/>` + html;
        }

        const len = el.ziMu.length;
        let array: number[] = [];
        for (var i = 0; i < len; i++) {
            array[i] = i;
        }

        let ziMuIndex: number = 0;
        while (array.length > 0) {
            let index = 0;
            if (isRandom) {
                index = Math.floor(Math.random() * array.length);
            }


            if (ziMuIndex % 8 == 0 && ziMuIndex > 0) {
                html += `<br/><br/>`;
            }

            html += `<span class="ziMu">${el.ziMu[array[index]]}</span>`;

            array.splice(index, 1);
            ziMuIndex++;

        }





        area.innerHTML = area.innerHTML + html;

    });
}



document.write(`<div id='menuArea'>
    <button onclick='window.generateFn(false)'>顺序生成</button>
    <button onclick='window.generateFn(true)'>随机生成</button>
    <button onclick='javascript:window.print();'>打印</button>
</div>`);
document.write("<div id='printArea'/>");