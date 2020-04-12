//参考
//https://github.com/liusaint/games/tree/master/soduku

function SD() {
    this.sdArr = [];//生成的数独数组	
    this.errorArr = [];//错误的格子。
    this.blankNum = 30;//空白格子数量 
    this.sdType = 6; //数独类型 6、9宫格
    this.numArr = [1, 2, 3, 4, 5, 6];
    this.areas = [
        [11, 12, 13, 21, 22, 23],
        [31, 32, 33, 41, 42, 43],
        [51, 52, 53, 61, 62, 63],
        [14, 15, 16, 24, 25, 26],
        [34, 35, 36, 44, 45, 46],
        [54, 55, 56, 64, 65, 66]
    ];;
    this.container = 'body';
    this.backupSdArr = [];//数独数组备份。
}

SD.prototype = {
    constructor: SD,
    init: function (container, blankNum) {
        this.container = container;
        this.createDoms();
        var beginTime = new Date().getTime();
        this.createSdArr();
        console.log("数独生成完毕，耗时：" + ((new Date().getTime()) - beginTime) / 1000 + "秒！");
        this.blankNum = blankNum;
        this.createBlank(this.blankNum);
        this.drawCells();


    },

    createSdArr: function () {
        this.sdArr = [];
        this.sdArr[11] = 5;
        this.sdArr[12] = 1;
        this.sdArr[13] = 4;
        this.sdArr[14] = 6;
        this.sdArr[15] = 3;
        this.sdArr[16] = 2;

        this.sdArr[21] = 6;
        this.sdArr[22] = 2;

        for (var i = 1; i <= 6; i++) {
            for (var j = 1; j <= 6; j++) {
                var sdArrIndex = i * 10 + j;
                if (this.sdArr[sdArrIndex] !== undefined) {
                    continue;
                }

                var ableArr = this.getAbleArr(i, j, sdArrIndex);
                if (ableArr.length > 1) {

                    for (var k = j + 1; k <= 6; k++) {
                        var nextSdArrIndex = i * 10 + k;
                        var nextAbleArray = this.getAbleArr(i, k, nextSdArrIndex);
                        if (nextAbleArray.length == 1) {
                            ableArr = arrMinus(ableArr, nextAbleArray);
                            if (ableArr.length == 1) {
                                break;
                            }
                        }
                    }

                }

                if (ableArr.length == 1) {
                    this.sdArr[sdArrIndex] = ableArr[0];
                }
                var random = getRandom(ableArr.length);
                this.sdArr[sdArrIndex] = ableArr[random - 1];









                if (this.sdArr[sdArrIndex] === undefined) {
                    var errorStr = '';
                    for (var k = 0; k < this.sdArr.length; k++) {

                        if (this.sdArr[k] !== undefined) {
                            errorStr += ' this.sdArr[' + k + '] = ' + this.sdArr[k] + ';';
                        }
                    }
                    console.log(errorStr);
                }

            }
        }



    },

    getAbleArr: function (x, y, sdArrIndex) {
        var XArr = this.getXArr(x, this.sdArr);
        var YArr = this.getYArr(y, this.sdArr);
        var thArr = this.getThArr(sdArrIndex, this.sdArr);
        var arr = getConnect(getConnect(XArr, YArr), thArr);
        var ableArr = arrMinus(this.numArr, arr);
        return ableArr;
    },
    getXArr: function (x, sdArr) {
        //获取所在行的值。
        var arr = [];
        for (var a = 1; a <= 6; a++) {
            if (this.sdArr[parseInt(x + "" + a)]) {
                arr.push(sdArr[parseInt(x + "" + a)])
            }
        }
        return arr;
    },
    getYArr: function (y, sdArr) {
        //获取所在列的值。
        var arr = [];
        for (var a = 1; a <= 6; a++) {
            if (sdArr[parseInt(a + '' + y)]) {
                arr.push(sdArr[parseInt(a + '' + y)])
            }
        }
        return arr;
    },
    getThArr: function (xy) {
        var arr = [];
        for (var i = 0; i < this.areas.length; i++) {
            var area = this.areas[i];
            if (area.indexOf(xy) > -1) {
                for (var j = 0; j < area.length; j++) {
                    if (this.sdArr[area[j]] !== undefined) {
                        arr.push(this.sdArr[area[j]]);
                    }

                }
                break;
            }
        }
        return arr;
    },
    getTh: function (i, j) {
        //获取所在三宫格的中间位坐标。
        var cenArr = [22, 52, 82, 25, 55, 85, 28, 58, 88];
        var index = (Math.ceil(j / 3) - 1) * 3 + Math.ceil(i / 3) - 1;
        var cenNum = cenArr[index];
        return cenNum;
    },
    setThird: function () {
        //为对角线上的6个数字随机生成。    
        var thIndexArr = [11, 22, 33, 44, 55, 66];
        for (var a = 0; a < 6; a++) {
            var random = getRandom(this.sdType);
            this.sdArr[thIndexArr[a]] = random;
        }
    },
    drawCells: function () {
        //将生成的数组填写到九宫格
        for (var j = 1; j <= this.sdType; j++) {
            for (var i = 1; i <= this.sdType; i++) {
                $(this.container).find(".sdli").eq(j - 1).find(".sdspan").eq(i - 1).html(this.sdArr[parseInt(j + '' + i)]);
            }
        }
    },
    createBlank: function (num) {
        //生成指定数量的空白格子的坐标。
        var blankArr = [];
        var numArr = [1, 2, 3, 4, 5, 6];
        var x, y, xy;
        while (blankArr.length != num) {
            x = getRandom(6);
            y = getRandom(6);
            xy = x * 10 + y;
            if (blankArr.indexOf(xy) < 0) {
                blankArr.push(xy);
                this.sdArr[xy] = '　';
            }
        }
    },


    checkCell: function (i, j) {
        //检测一个格子中输入的值，在横竖宫里是否已存在。
        var index = parseInt(i + '' + j);
        var backupSdArr = this.backupSdArr;
        var XArr = this.getXArr(j, backupSdArr);
        var YArr = this.getYArr(i, backupSdArr);
        var thArr = this.getThArr(i, j, backupSdArr);
        var arr = getConnect(getConnect(XArr, YArr), thArr);
        var val = parseInt($(this.container).find(".sdli").eq(j - 1).find(".sdspan").eq(i - 1).html());
        if ($.inArray(val, arr) > -1) {
            this.errorArr.push(index);
        }
    },
    getInputVals: function () {
        //将用户输入的结果添加到数组中。
        var blankArr = this.blankArr, len = this.blankArr.length, i, x, y, dom, theval;
        for (i = 0; i < len; i++) {
            x = parseInt(blankArr[i] / 10);
            y = blankArr[i] % 10;
            dom = $(this.container).find(".sdli").eq(y - 1).find(".sdspan").eq(x - 1);
            theval = parseInt(dom.text()) || undefined;
            this.backupSdArr[blankArr[i]] = theval;
        }
    },

    createDoms: function () {
        //生成九宫格。
        var html = '<ul class="sd clearfix">';
        html = html + ('<li class="sdli">' + '<span class="sdspan"></span>'.times(this.sdType) + '</li>').times(this.sdType) + '</ul>';
        $(this.container).prepend(html);

        for (var k = 0; k < this.sdType; k++) {
            $(this.container).find(".sdli:eq(" + k + ") .sdspan").eq(2).addClass('br');
            $(this.container).find(".sdli:eq(" + k + ") .sdspan").eq(5).addClass('br');
            $(this.container).find(".sdli:eq(" + k + ") .sdspan").eq(3).addClass('bl');
            $(this.container).find(".sdli:eq(" + k + ") .sdspan").eq(6).addClass('bl');
        }
        $(this.container).find(".sdli:eq(1) .sdspan,.sdli:eq(3) .sdspan").addClass('bb');
        $(this.container).find(".sdli:eq(2) .sdspan,.sdli:eq(4) .sdspan").addClass('bt');
    }
}


//生成随机正整数
function getRandom(n) {
    return Math.floor(Math.random() * n + 1)
}

//两个简单数组的并集。
function getConnect(arr1, arr2) {
    var i, len = arr1.length, resArr = arr2.slice();
    for (i = 0; i < len; i++) {
        if ($.inArray(arr1[i], arr2) < 0) {
            resArr.push(arr1[i]);
        }
    }
    return resArr;
}

//两个简单数组差集，arr1为大数组
function arrMinus(arr1, arr2) {
    var resArr = [], len = arr1.length;
    for (var i = 0; i < len; i++) {
        if ($.inArray(arr1[i], arr2) < 0) {
            resArr.push(arr1[i]);
        }
    }
    return resArr;
}

//两个简单数组交集，arr1为大数组
function arrSame(arr1, arr2) {
    var resArr = [], len = arr1.length;
    for (var i = 0; i < len; i++) {
        if ($.inArray(arr1[i], arr2) >= 0) {
            resArr.push(arr1[i]);
        }
    }
    return resArr;
}






