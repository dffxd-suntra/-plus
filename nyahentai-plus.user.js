// ==UserScript==
// @name         喵绅士(nyahentai)
// @namespace    https://github.com/dffxd-suntra/nyahentai-plus
// @version      1.0
// @description  让新版喵绅士有长条预览功能,预计是不会有更新的了
// @homepageURL  https://github.com/dffxd-suntra/nyahentai-plus
// @supportURL   https://github.com/dffxd-suntra/nyahentai-plus
// @match        https://nyahentai.red/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyahentai.red
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @author       Suntra
// @run-at       document-end
// @license      MIT
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    var inited = false;
    function startView() {
        if(inited) return;
        inited = true;
        var pages = $("#tags > div:nth-child(7) > span > a > span").text();
        var tempUrl = $("#cover > a > img").attr("src").match(/https:\/\/cdn.nhentai.xxx\/g\/[0-9]+\//);
        console.log("pages: "+pages);
        console.log("tempUrl: "+tempUrl);

        for(var i=1;i<=pages;i++) {
            $("#nyap-read-page-img").append(`<img src="`+tempUrl+`/`+i+`.jpg" class="lazyload" style="width: 100%"/><br>`);
        }
    }

    GM_addStyle(`.hide {display: none !important;}`);
    $("body").prepend(`
    <div style="width: 100%;display: none;" id="nyap-read-page">
        <div style="position: fixed;bottom: 10px;right: 10px;">
            <h1 id="showWidth">80%</h1>
            <div id="nyap-read-page-img-change-width">
                <button type="button" class="btn btn-primary">+1</button><br>
                <button type="button" class="btn btn-primary">+5</button><br>
                <button type="button" class="btn btn-primary">+10</button><br>
                <button type="button" class="btn btn-primary">-10</button><br>
                <button type="button" class="btn btn-primary">-5</button><br>
                <button type="button" class="btn btn-primary">-1</button><br>
            </div>
            <button type="button" id="nyap-read-page-hide"  class="btn btn-primary">关闭</button><br>
            <button type="button" onclick="javascript:document.body.scrollIntoView({block: 'start'});" class="btn btn-primary">顶部</button>
        </div>
        <center>
        <div id="nyap-read-page-img" style="width: 80%">
        </div>
        </center>
    </div>
    `);
    $("#info > div").prepend(`<button class="btn btn-primary" id="nyap-read-page-show">垂直阅读</button>`);
    $("#nyap-read-page-show").click(function () {
        $("body").children().each(function (i,e) {
            console.log(e);
            if($(e).attr("id")=="nyap-read-page") {
                $(e).css("display","");
            }
            else {
                $(e).addClass("hide");
            }
        });
        startView();
    });
    $("#nyap-read-page-hide").click(function () {
        $("body").children().each(function (i,e) {
            console.log(e);
            if($(e).attr("id")=="nyap-read-page") {
                $(e).css("display","none");
            }
            else {
                $(e).removeClass("hide");
            }
        });
    });
    var imgWidth = 80;
    $("#nyap-read-page-img-change-width").click(function ({target}) {
        if($(target).attr("id")=="nyap-read-page-img-change-width") {
            return;
        }
        imgWidth += Number($(target).text());
        imgWidth = Math.max(1,imgWidth);
        $("#nyap-read-page-img").css("width",imgWidth+"%");
    });
})();
