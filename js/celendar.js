/*钟表表盘样式*/
(function(){
    var  oClickList = document.querySelector('.clock-list');
    var str = '';
    for (var i = 0; i < 60; i++) {
        str += '<li style="transform: rotate(' + (i * 6) + 'deg)"></li>';
    }
    oClickList.innerHTML = str;
})();

/*钟表表盘*/
(function() {
    getTime();
    setInterval(getTime, 1000);

    /*设置时间*/
    function getTime() {
        var oHour = document.querySelector('.split-hour');
        var oMinute = document.querySelector('.split-minute');
        var oSecond = document.querySelector('.split-second');
        var iNow = new Date();
        var iYear = iNow.getFullYear();
        var iMonth = iNow.getMonth() + 1;
        var iDate = iNow.getDate();
        var iHour = iNow.getHours();
        var iMinute = iNow.getMinutes();
        var iSecond = iNow.getSeconds();

        var minuteDeg = iMinute + iSecond / 60;
        var hourDeg = iHour + minuteDeg / 60;
        oHour.style.transform = 'rotate(' + (hourDeg * 30) +'deg)';
        oMinute.style.transform = 'rotate(' + (minuteDeg * 6) +'deg)';
        oSecond.style.transform = 'rotate(' + (iSecond * 6) +'deg)';


        var oDate = document.querySelector('.celendar .date');//日期-年月日
        var oTime = document.querySelector('.celendar-right .time');//时间
        var oDay = document.querySelector('.celendar-right .day');//星期几
        var arrWeekValue = ['星期日','星期一','星期二','星期三','星期四','星期五','星期六'];
        oDate.innerHTML = iYear + '年' + iMonth + '月' + iDate + '日';
        oTime.innerHTML = toTwo(iHour) + ':' + toTwo(iMinute) + ':' + toTwo(iSecond);
        oDay.innerHTML = arrWeekValue[iNow.getDay()];
    }


    /*转换成2位数*/
    function toTwo(n){
        return n < 10? '0' + n : '' + n;
    }
})();

/*功能设置*/
(function(){
    var iActDate = new Date();//当前选中的年月日
    var aLbox = document.querySelectorAll('.celendar-lbox');
    var iLevel = 0;//显示的是第几个 0=月 1=1年 2=10年 3=100年

    var oDate = document.querySelector('.celendar .date');//日期-年月日
    var oTitleBox = document.querySelector('.celendar .title-box');//日期-年月盒子
    var oTitle = document.querySelector('.celendar-ltitle .title');//日期-年月
    var aBtn = document.querySelectorAll('.celendar-ltitle>div');//左右按键
    var oHundredYear = document.querySelector('.celendar-lcont .year-hundred');//百年
    var aHundredYearLi = document.querySelectorAll('.celendar-lcont .year-hundred > li');
    var oTenYear = document.querySelector('.celendar-lcont .year-ten');//十年
    var aTenYearLi = document.querySelectorAll('.celendar-lcont .year-ten > li');
    var oYear = document.querySelector('.celendar-lcont .year');//年
    var aYearContLi = [];
    var oMonth = document.querySelector('.celendar-lcont .month');//月
    var aMonthLi = document.querySelectorAll('.celendar-lcont .month > li');
    var iWidth= css(aMonthLi[0], 'width');
    var moveVal = {'slide': {'time': 500, 'type': 'easeIn'}
                    ,'scale': {'time': 500, 'type': 'easeOut'}
                 };

    /*初始化年份数据 + 月份数据*/
    (function (){
        var arrVal = ['一月','二月','三月','四月','五月','六月','七月','八月','九月','十月','十一月','十二月'];
        var inner = '';
        for (var i = 0; i < arrVal.length; i++) {
            inner += '<li>' + arrVal[i] + '</li>';
        }
        var aYearCont = document.querySelectorAll('.celendar-lcont .year-cont');
        for (var i = 0; i < aYearCont.length; i++) {
            aYearCont[i].innerHTML = inner;
        }

        /*移入移出事件*/
        for (var i = 0; i < aYearCont.length; i++) {
            aYearContLi[i] = aYearCont[i].querySelectorAll('li');
            setMoveAndOut(aYearContLi[i]);
        }
        /*点击事件*/
        for (var i = 0; i < aYearContLi.length; i++){
            for (var j = 0; j < aYearContLi[i].length; j++){
                aYearContLi[i][j].index = j;
                aYearContLi[i][j].onclick =function (){
                    var iMonth = this.index;
                    var fullDay = new Date(iActDate.getFullYear(), iMonth + 1, 0).getDate();
                    if (iActDate.getDate() > fullDay){
                        iActDate.setDate(fullDay);
                    }
                    iActDate.setMonth(iMonth);
                    toPreLevel(oYear, oMonth, aMonthLi[0]);
                }
            }
        }
        setMonthByLi(aMonthLi[0]);
    })();

    /*日期(年月日)鼠标点击 还原到当前月*/
    oDate.onclick = function () {
        var date = new Date();
        if(iLevel != 0) {
            iActDate = date;
            if (iLevel == 1) {
                toPreLevel(oYear, oMonth, aMonthLi[0]);
            } else if (iLevel == 2){
                iLevel = 1;
                toPreLevel(oTenYear, oMonth, aMonthLi[0]);
            }
        } else {
            if(isCurMonthByYM(iActDate, date)){
                return;
            }
            if ((date.getFullYear() > iActDate.getFullYear())
                || date.getMonth() > iActDate.getMonth()) {
                nextMonth(date);
            }else {
                preMonth(date);
            }
        }
    };

    /*日期(年月)鼠标点击  月->到年->到10年-> 到100年*/
    oTitleBox.onclick = function () {
        if (iLevel == 0) {
            toNextLevel(oMonth, oYear, aYearContLi[0]);
        } else if (iLevel == 1){
            toNextLevel(oYear, oTenYear, aTenYearLi[0]);
        } else if (iLevel == 2){
            toNextLevel(oTenYear, oHundredYear, aHundredYearLi[0]);
        }
    };

    /*前一个点击事件*/
    aBtn[0].onclick =aBtnPre;
    function aBtnPre(){
        if (isNextDisable()) {
            removeClass(aBtn[1], 'disable');
            aBtn[1].onclick = aBtnNext;
        }
        var state = [preMonth, preYear, preTenYear, preHundredYear];
        console.log(iLevel);
        state[iLevel]();
        if (isPreDisable()) {
            addClass(aBtn[0], 'disable');
            aBtn[0].onclick = null;
        }
    };

    /*下一个点击事件*/
    aBtn[1].onclick = aBtnNext;
    function aBtnNext() {
        if (isPreDisable()) {
            removeClass(aBtn[0], 'disable');
            aBtn[0].onclick = aBtnPre;
        }
        var state = [nextMonth, nextYear, nextTenYear, nextHundredYear];
        state[iLevel]();
        if (isNextDisable()) {
            addClass(aBtn[1], 'disable');
            aBtn[1].onclick = null;
        }
    };

    /*以月份设置圆点位置*/
    function getXY(els){
        var sum = iActDate.getMonth() + 1;
        var x;
        var y;
        if(sum % 4){
            x = (sum % 4) / 4 - 1 / 8;
            y = parseInt(sum / 4) / 3 + 1 / 6;
        } else {
            x = 1 - 1 / 8;
            y = (sum / 4) / 3 - 1 / 6;
        }
        els.forEach(function(el, index){
            el.style.cssText += 'transform-origin: ' + x * 100 + '% ' + y  * 100 + '%;';
        });
    }

    /*点击到下一级*/
    function toNextLevel(curLevel, nextLevel,nextLevelLi) {
        iLevel++;
        if (iLevel > aLbox.length) {
            iLevel = aLbox.length - 1;
            return;
        }
        setPreNextDisable();
        var state = [setYearByArr, setTenYearByLi, setHundredYearByLi];
        css(nextLevel, 'left', 0);
        state[iLevel - 1](nextLevelLi);
        getXY([curLevel, nextLevel]);
        startMove(curLevel, {'zIndex': 1, 'transform':0.5, 'opacity': 0}, moveVal['scale']['time'], moveVal['scale']['type']);
        startMove(nextLevel, {'zIndex': 10, 'transform': 1, 'opacity': 1}, moveVal['scale']['time'], moveVal['scale']['type']);
    }

    /*点击到前一级*/
    function toPreLevel (curLevel, preLevel, preLevelLi){
        iLevel--;
        setPreNextDisable();
        var state = [setMonthByLi, setYearByArr, setTenYearByLi];
        css(preLevel, 'left', 0);
        state[iLevel](preLevelLi);
        getXY([curLevel, preLevel]);
        startMove(preLevel, {'zIndex': 10, 'transform': 1, 'opacity': 1}, moveVal['scale']['time'], moveVal['scale']['type']);
        startMove(curLevel, {'zIndex': 1, 'transform': 2, 'opacity': 0}, moveVal['scale']['time'], moveVal['scale']['type']);
    }

    /*放大缩小设置左右键*/
    function setPreNextDisable() {
        removeClass(aBtn[0], 'disable');
        aBtn[0].onclick = aBtnPre;
        removeClass(aBtn[1], 'disable');
        aBtn[1].onclick = aBtnNext;
        if (isPreDisable()) {
            addClass(aBtn[0], 'disable');
            aBtn[0].onclick = null;
        }
        if (isNextDisable()) {
            addClass(aBtn[1], 'disable');
            aBtn[1].onclick = null;
        }
    }

    /*左键是否不可用*/
    function isPreDisable() {
        var iMinYear = parseInt(new Date().getFullYear() / 100) * 100 - 100;//最小值
        var iActYear = iActDate.getFullYear();
        switch ( iLevel) {
            case 0:
                if(iActDate.getMonth() != 0){
                    break;
                }
            case 1:
                 if (iActYear != iMinYear) {
                    break;
                 }
            case 2:
            case 3:
                if (parseInt(iActYear / 10) * 10 != iMinYear) {
                    break;
                }
            default :
                return true;
        }
        return false;
    }

    /*右键是否不可用*/
    function  isNextDisable() {
        var iMaxYear = parseInt(new Date().getFullYear() / 100) * 100 + 100;//最大值
        var iActYear = iActDate.getFullYear();
        switch ( iLevel) {
            case 0:
                if(iActDate.getMonth() != 11){
                    break;
                }
            case 1:
                if (iActYear != iMaxYear - 1) {
                    break;
                }
            case 2:
                if (parseInt(iActYear / 10) * 10 + 10 != iMaxYear) {
                    break;
                }
            case 3:
                if (parseInt(iActYear / 100) * 100 + 100 != iMaxYear) {
                    break;
                }
            default :
                return true;
        }
        return false;
    }

    /*上一个百年 右动画*/
    function preHundredYear() {
        var iYear = parseInt(iActDate.getFullYear() / 100) * 100 - 100;
        var iDate = iActDate;
        iDate.setFullYear(iYear);
        slideToPre(oHundredYear, aHundredYearLi, iDate);
    }

    /*上一个十年 右动画*/
    function preTenYear() {
        var iYear = parseInt(iActDate.getFullYear() / 10) * 10 - 10;
        var iDate = iActDate;
        iDate.setFullYear(iYear);
        slideToPre(oTenYear, aTenYearLi, iDate);
    }

    /*上一年 右动画*/
    function preYear() {
        var iDate = new Date(iActDate.getFullYear() - 1, 0, iActDate.getDate());
        slideToPre(oYear, aYearContLi, iDate);
    }

    /*上一个月 右动画*/
    function preMonth(date) {
        var iDate = arguments.length == 1? date : new Date(iActDate.getFullYear(), iActDate.getMonth() - 1, 1);
        slideToPre(oMonth, aMonthLi, iDate);
    }

    /*上一个 右滑动*/
    function slideToPre(oList, aLi, date) {
        var state = [setMonthByLi, setYearByArr, setTenYearByLi, setHundredYearByLi];
        state[iLevel](aLi[1]);
        iActDate = date;
        state[iLevel](aLi[0]);
        css(oList, 'left', -iWidth);
        startMove(oList, {'left': 0}, moveVal['slide']['time'], moveVal['slide']['type']);
    }

    /*下一个百年 右动画*/
    function nextHundredYear() {
        var iYear = parseInt(iActDate.getFullYear() / 100) * 100 + 100;
        var iDate = iActDate;
        iDate.setFullYear(iYear);
        slideToNext(oHundredYear, aHundredYearLi, iDate);
    }

    /*下一个十年 左动画*/
    function nextTenYear() {
        var iYear = iActDate.getFullYear();
        var iDate = iActDate;
        iYear = iYear - (iYear % 10) + 10;
        iDate.setFullYear(iYear);
        slideToNext(oTenYear, aTenYearLi, iDate);
    }

    /*下一年 左动画*/
    function nextYear() {
        var iDate = new Date(iActDate.getFullYear() + 1, 0, iActDate.getDate());
        slideToNext(oYear, aYearContLi, iDate);
    }

    /*下一个月 左动画*/
    function nextMonth(date) {
        var iDate = arguments.length == 1? date : new Date(iActDate.getFullYear(), iActDate.getMonth() + 1, 1);
        slideToNext(oMonth, aMonthLi, iDate);
    }

    /*上一个 右滑动*/
    function slideToNext(oList, aLi, date) {
        var state = [setMonthByLi, setYearByArr, setTenYearByLi, setHundredYearByLi];
        state[iLevel](aLi[0]);
        iActDate = date;
        state[iLevel](aLi[1]);
        css(oList, 'left', 0);
        startMove(oList, {'left': -iWidth}, moveVal['slide']['time'], moveVal['slide']['type']);
    }

    /*鼠标移入移出事件*/
    function setMoveAndOut(aLi){
        for (var i = 0; i < aLi.length; i++){
            aLi[i].onmouseover = function(){
                if(this.className.indexOf('active') == -1) {
                    this.className = this.className + ' hover';
                }
            };
            aLi[i].onmouseout = function(){
                removeClass(this, 'hover');
            };
        }
    }

    /*设置百年*/
    function  setHundredYearByLi(li) {
        var list = li.querySelector('ul');
        var iYear = iActDate.getFullYear();
        var iFir = parseInt(iYear / 100) * 100;//当前最小整数值
        var iEnd = iFir + 100;//当前最大整数值
        var inner = '';
        oTitle.innerHTML = iFir + '-' + (iEnd - 1);
        inner += '<li class="gray">' + (iFir - 10) + '-' + (iFir - 1) + '</li>';
        for (var i = iFir; i < iEnd; i = i + 10) {
            if (i <= iYear && i + 9 >= iYear) {
                inner += '<li class="active">' + i + '-' + (i + 9) + '</li>';
            } else {
                inner += '<li>' + i + '-' + (i + 9)  + '</li>';
            }
        }
        inner += '<li class="gray">' + iEnd + '-' + (iEnd + 9) + '</li>';
        list.innerHTML = inner;

        var aLi = list.querySelectorAll('li');
        setMoveAndOut(aLi);// 鼠标移入移出事件
        for (var i = 0; i < aLi.length ; i++) {
            aLi[i].index = i;
            aLi[i].onclick = function() {
                aLi.forEach(function(obj) {
                    obj.className = '';
                });
                this.className = 'active';
                var iYear = parseInt(this.innerHTML) + (iActDate.getFullYear() % 10);
                iActDate.setFullYear(iYear);
                toPreLevel(oHundredYear, oTenYear, aTenYearLi[0]);
            };
        }
        var iNowYear = new Date().getFullYear();
        var iMinYear = parseInt(iNowYear / 100) * 100 - 100;//最小值
        var iMaxYear = parseInt(iNowYear / 100) * 100 + 100;//最大值
        if (iFir == iMinYear) {
            aLi[0].innerHTML = '';
            clearEvent(aLi[0]);
        } else if (iEnd == iMaxYear) {
            aLi[aLi.length - 1].innerHTML = '';
            clearEvent(aLi[aLi.length - 1]);
        }
    }

    /*设置十年*/
    function  setTenYearByLi(li) {
        var list = li.querySelector('ul');
        var iYear = iActDate.getFullYear();
        var iFir = parseInt(iYear / 10) * 10;//当前最小整数值
        var iEnd = iFir + 10;//当前最大整数值
        var inner = '';
        oTitle.innerHTML = iFir + '-' + (iEnd - 1);
        inner += '<li class="gray">' + (iFir - 1) + '</li>';
        for (var i = iFir; i < iEnd; i++) {
            if (i == iYear) {
                inner += '<li class="active">' + i + '</li>';
            } else {
                inner += '<li>' + i + '</li>';
            }
        }
        inner += '<li class="gray">' + iEnd + '</li>';
        list.innerHTML = inner;

        var aLi = list.querySelectorAll('li');
        setMoveAndOut(aLi);// 鼠标移入移出事件
        for (var i = 0; i < aLi.length ; i++) {
            aLi[i].onclick = function() {
                var lastIndex = iActDate.getFullYear() % 10 + 1;
                aLi[lastIndex].className = '';
                iActDate.setFullYear(parseInt(this.innerHTML));
                this.className = 'active';
                toPreLevel(oTenYear, oYear, aYearContLi[0]);
            };
        }
        var iNowYear = new Date().getFullYear();
        var iMinYear = parseInt(iNowYear / 100) * 100 - 100;//最小值
        var iMaxYear = parseInt(iNowYear / 100) * 100 + 100;//最大值
        if (iFir == iMinYear) {
            aLi[0].innerHTML = '';
            clearEvent(aLi[0]);
        } else if (iEnd == iMaxYear) {
            aLi[aLi.length - 1].innerHTML = '';
            clearEvent(aLi[aLi.length - 1]);
        }
    }

    /*设置年份*/
    function setYearByArr(arr){
        for(var i = 0; i < arr.length; i++){
            arr[i].className = '';
        }
        arr[iActDate.getMonth()].className = 'active';
        oTitle.innerHTML = iActDate.getFullYear();
    }

    /*设置月份*/
    function setMonthByLi(li) {
        /*生成月份的内容*/
        var iYear = iActDate.getFullYear();
        var iMonth = iActDate.getMonth();
        var oMonth = li.querySelector('.month-cont');
        var iSum = 42;//一个月共显示多少天
        var iMday = getDaysByDate(iActDate);//本月月的天数
        var iNextMonth = new Date(iYear, iMonth + 1, 1);
        var iLMDay = getDaysByDate(iNextMonth);//下月的天数
        var iWeek= getWeekByDate(iActDate);//本月第一天是星期几
        var innner ='';
        var iNow = new Date();
        for (var i = 1; i <= iSum; i++) {
            var cur = i - iWeek;
            if (cur <= 0) {//上月
                innner += '<li class="gray">' + (cur + iLMDay) + '</li>';
            } else if (cur > iMday) {//下月
                innner += '<li class="gray">' + (cur - iMday) + '</li>';
            } else {//本月
                if(cur == iActDate.getDate()){
                    innner += '<li class="active">' + cur + '</li>'
                } else if (isCurMonthByYM(iActDate, iNow) && cur == iNow.getDate()){
                    innner += '<li class="cur">' + cur + '</li>';
                } else {
                    innner += '<li>' + cur + '</li>';
                }
            }
        }
        oMonth.innerHTML = innner;
        oTitle.innerHTML = iYear + '年' + (iMonth + 1) + '月';

        var aLi = li.querySelectorAll('.month-cont li');
        setMoveAndOut(aLi);// 鼠标移入移出事件
        /*点击事件*/
        for (var i = 1; i <= iSum; i++){
            var cur = i - iWeek;
            if (cur <= 0) {//上月
                aLi[i - 1].onclick = function(){
                    preMonth(new Date(iActDate.getFullYear(), iActDate.getMonth() - 1, parseInt(this.innerHTML)));
                };
            } else if (cur > iMday) {//下月
                aLi[i - 1].onclick = function(){
                    nextMonth(new Date(iActDate.getFullYear(), iActDate.getMonth() + 1, parseInt(this.innerHTML)));
                };
            } else {//本月
                aLi[i - 1].index = cur;
                aLi[i - 1].onclick = function() {
                    var lastIndex =  iWeek + iActDate.getDate() - 1;
                    if (isCurMonthByYMD(iActDate, new Date())){
                        aLi[lastIndex].className =  'cur';
                    } else {
                        aLi[lastIndex].className =  '';
                    }
                    iActDate.setDate(parseInt(this.innerHTML));
                    this.className = 'active';
                };
            }
        }
    }

    /*清除事件*/
    function clearEvent(el) {
        el.onmouseover = null;
        el.onmouseout = null;
        el.onclick = null;
    }

    /*根据日期 获取该月份的天数*/
    function getDaysByDate(date) {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    }

    /*根据日期 获取该月份的第一天是星期几*/
    function getWeekByDate(date) {
        var day = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
        return day == 0 ? 7 : day;
    }

    /*判断两个日期[年月]是否相同*/
    function isCurMonthByYM(date1, date2){
        return (date1.getFullYear() == date2.getFullYear())
            && (date1.getMonth() == date2.getMonth());
    }

    /*判断两个日期[年月日]是否相同*/
    function isCurMonthByYMD(date1, date2){
        return isCurMonthByYM(date1,date2)
            && (date1.getDate() == date2.getDate());
    }

    /*为某个元素新增新的类名*/
    function addClass (obj, className) {
        if(obj.className.indexOf(className) == -1) {
            obj.className = obj.className + ' ' +className;
        }
    }

    /*为某个元素移除新的类名*/
    function removeClass(obj, className) {
        if(obj.className.indexOf(className) != -1) {
            obj.className = obj.className.split(className).join('').trim();
        }
    }
})();
