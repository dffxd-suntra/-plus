// ==UserScript==
// @name         喵绅士(nyahentai)
// @namespace    https://github.com/dffxd-suntra/nyahentai-plus
// @version      1.0
// @description  让新版喵绅士有长条预览功能,预计是不会有更新的了
// @homepageURL  https://github.com/dffxd-suntra/nyahentai-plus
// @supportURL   https://github.com/dffxd-suntra/nyahentai-plus
// @match        https://nyahentai.red/g/*
// @match        https://nhentai.net/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nyahentai.red
// @require      https://lf6-cdn-tos.bytecdntp.com/cdn/expire-1-M/jquery/3.6.0/jquery.min.js
// @author       Suntra
// @license      MIT
// ==/UserScript==

(function() {
    var inited = false;
    function startView() {
        if(inited) return;
        inited = true;
        var pages = new Number($("#tags").children(":contains('Pages')").find(".tag").text());
        var tempUrl = $("#cover > a > img").attr("src").match(/https:\/\/cdn.nhentai.xxx\/g\/[0-9]+\//);
        console.log("pages: "+pages);
        console.log("tempUrl: "+tempUrl);

        for(var i=1;i<=pages;i++) {
            $("#nyap-read-page-img").append(`<img src="`+tempUrl+i+`.jpg" class="lazyload" style="width: 100%"/><br>`);
        }
    }
    // 页面样式
    $("body").prepend(`
    <div style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 9999;display: none;background: rgba(0, 0, 0, 95%);overflow: auto;" id="nyap-read-page">
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
            <button type="button" id="nyap-read-page-toTop" class="btn btn-primary">顶部</button>
        </div>
        <center>
        <div id="nyap-read-page-img" style="width: 80%">
        </div>
        </center>
    </div>
    `);
    $("#info > div").prepend(`<button class="btn btn-primary" id="nyap-read-page-show">垂直阅读</button>`);
    // 切换开,关
    $("#nyap-read-page-show").click(function () {
        startView();
        $("body").css("overflow", "hidden");
        $("#nyap-read-page").show();
    });
    $("#nyap-read-page-hide").click(function () {
        $("body").css("overflow", "");
        $("#nyap-read-page").hide();
    });
    $("#nyap-read-page-toTop").click(function () {
        $("#nyap-read-page").scrollTop(0);
    });
    // 切换宽度
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
