/**
 * Created by a313 on 2016/5/23.
 */
data.sort(function (a, b) {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
});
var list = {};
for (var i = 0; i < data.length; i++) {
    var date = new Date(data[i].date);
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    //console.log(month);
    if (!list[year]) {
        list[year] = {};
    }
    if (!list[year][month]) list[year][month] = [];
    var item = data[i];
    var lunar = GetLunarDateString(date);
    lunar = lunar[0] + "<br>&nbsp;&nbsp;&nbsp;&nbsp;" + lunar[1];
    //console.log(lunar);
    item.lunar = lunar;
    item.veryLike = data[i].like < 10000 ? data[i].like : (data[i].like / 10000).toFixed(1) + "万";
    list[year][month].push(item);
}
//console.log(list);

//动态组装左边的侧边栏的年月
var html = [];
var aside = document.querySelector("main aside");
for (year in list) {
    html.unshift("</dl>");//前插数组元素，成为降序排序

    for (month in list[year]) {
        html.unshift("<dd class='month'>" + month + "月</dd>");
    }
    html.unshift("<dl><dt class='year'>" + year + "年</dt>");
}
//console.log(html);
aside.innerHTML = html.join("");
//console.log(aside.innerHTML);

//动态组装section的内容
var section = document.querySelector("main section");
var artHtml;
var temHtml = document.querySelector("template").innerHTML; //获取模板的内部
html = [];
for (year in list) {
    html.unshift("</dl>");
    for (month in list[year]) {
        html.unshift("</dd>");
        artHtml = "";
        for (i = 0; i < list[year][month].length; i++) {
            artHtml += temHtml.replace("{{lunar}}", list[year][month][i].lunar).replace("{{date}}", list[year][month][i].date).replace("{{content}}", list[year][month][i].intro).replace("{{img}}", list[year][month][i].media).replace("{{like}}", list[year][month][i].like).replace("{{comment}}", list[year][month][i].comment).replace("{{veryLike}}", list[year][month][i].veryLike);

        }
        html.unshift(artHtml);
        html.unshift("<dd><span class='title'>" + month + "月</span>");
    }

    html.unshift("<dl class='year'><dt >" + year + "年</dt>");
}
section.innerHTML = html.join("");
//console.log(section.innerHTML);

//获取年份，实现滚动监控并显示当前年份的样式
var sectionYears = section.querySelectorAll("dl");
var asideYears = aside.querySelectorAll("dl");
var asideMonthAll=aside.querySelectorAll("dd");
var sectionMonthAll=section.querySelectorAll("dd");
//console.log(sectionYears);
//获取对象纵坐标
function getTop(els) {
    if (els) {
        var top = els.offsetTop;
        while (els = els.offsetParent) {
            top += els.offsetTop;
        }
        return top;
    }
}
//清除年份和月份的on和active类名
function clearClass() {
    for (var i = 0; i < asideYears.length; i++) {
        if (asideYears[i].classList.contains("on")) {
            asideYears[i].classList.remove("on");//清除年份的class名on
            var mouthAll = asideYears[i].querySelectorAll("dd.month");
            for (var j = 0; j < mouthAll.length; j++) {
                if (mouthAll[j].classList.contains("active")) {
                    mouthAll[j].classList.remove("active");
                    break;
                }
            }
            break;
        }
    }
}
asideYears[0].classList.add("on");
window.onscroll = function () {

    var scrollTop = document.body.scrollTop;
    //处理aside让它先滚动后固定
    if (scrollTop > 250) {
        aside.style.position = "fixed";
        aside.style.top = "-60px";
    } else {
        aside.style.position = "absolute";
        aside.style.top = "200px";
    }
    for (i = 0; i < sectionYears.length; i++) {
        if (scrollTop < getTop(sectionYears[i]) - 300)
            break;
    }
    //清除类名
    clearClass();
    asideYears[i - 1].classList.add("on");
    var asideMonths=asideYears[i - 1].querySelectorAll("dd");
    var sectionMonths= sectionYears[i -1].querySelectorAll("dd");

    for (i = 0; i < sectionMonths.length; i++) {
        if (scrollTop < getTop(sectionMonths[i]) - 300)
            break;
    }

    asideMonths[i-1].classList.add("active");
};



//aside的滚动监控和点击动画

//动画卷动函数
var animated=true;
function  scrollAnimation(end){
    if (animated) {
        animated=false;
        var start = document.body.scrollTop || document.documentElement.scrollTop;
        var timer = setInterval(function () {
            if (start != end) {
                start += (end > start) ? Math.ceil((end - start) / 10) : Math.floor((end - start) / 10);
                window.scroll(0, start);
            } else {
                clearInterval(timer);
                animated=true;
            }
        }, 10);
    }
}
//给年加上索引坐标，通过索引来找到它
for(i=0;i<asideYears.length;i++){
    asideYears[i].index=i;
    // console.log(asideYears[i].index);
}
//给月加上索引坐标，通过索引来找到它
for(i=0;i<asideMonthAll.length;i++){
    asideMonthAll[i].index=i;
}
aside.onclick=function(e){
    e=e||window.event;
    eTarget= e.target|| e.srcElement;
    if(eTarget.classList.contains("year")){
        var dlYear=eTarget.parentNode;
        var index=dlYear.index;
        console.log(eTarget);
        scrollAnimation(getTop(sectionYears[index])-85);//找到当前年上面的部分冒出去的距离再减去导航条的高度
    }else if(eTarget.classList.contains("month")){
        index=eTarget.index;
        scrollAnimation(getTop(sectionMonthAll[index])-85);
    }
};





/**
 * Created by bankeys-01 on 2016/6/24.
 */
