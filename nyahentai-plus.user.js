// ==UserScript==
// @name         喵绅士(nyahentai)
// @namespace    https://github.com/dffxd-suntra/nyahentai-plus
// @version      1.0
// @description  让新版喵绅士有长条预览功能,预计是不会有更新的了
// @homepageURL  https://github.com/dffxd-suntra/nyahentai-plus
// @supportURL   https://github.com/dffxd-suntra/nyahentai-plus
// @match        https://nyahentai.red/g/*
// @match        https://nhentai.xxx/g/*
// @icon         https://nyahentai.red/front/favicon.ico
// @require      https://cdn.jsdelivr.net/npm/jquery@3.7.0/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/lazysizes@5.3.2/lazysizes.min.js
// @author       Suntra
// @license      MIT
// ==/UserScript==

(function() {
    let loadingImg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAAAAAA6fptVAAAACXBIWXMAAAsTAAALEwEAmpwYAAAE7WlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDggNzkuMTY0MDM2LCAyMDE5LzA4LzEzLTAxOjA2OjU3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0RXZ0PSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VFdmVudCMiIHhtbG5zOnBob3Rvc2hvcD0iaHR0cDovL25zLmFkb2JlLmNvbS9waG90b3Nob3AvMS4wLyIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiIHhtcDpDcmVhdGVEYXRlPSIyMDIzLTA1LTMwVDIyOjMzOjE0KzA4OjAwIiB4bXA6TWV0YWRhdGFEYXRlPSIyMDIzLTA1LTMwVDIyOjMzOjE0KzA4OjAwIiB4bXA6TW9kaWZ5RGF0ZT0iMjAyMy0wNS0zMFQyMjozMzoxNCswODowMCIgZGM6Zm9ybWF0PSJpbWFnZS9wbmciIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MTlmYWFhY2MtZGQ5Zi0yMDRlLTk5MGQtMWZiNzFiYjhhYThhIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE5ZmFhYWNjLWRkOWYtMjA0ZS05OTBkLTFmYjcxYmI4YWE4YSIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjE5ZmFhYWNjLWRkOWYtMjA0ZS05OTBkLTFmYjcxYmI4YWE4YSIgcGhvdG9zaG9wOkNvbG9yTW9kZT0iMSI+IDx4bXBNTTpIaXN0b3J5PiA8cmRmOlNlcT4gPHJkZjpsaSBzdEV2dDphY3Rpb249ImNyZWF0ZWQiIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6MTlmYWFhY2MtZGQ5Zi0yMDRlLTk5MGQtMWZiNzFiYjhhYThhIiBzdEV2dDp3aGVuPSIyMDIzLTA1LTMwVDIyOjMzOjE0KzA4OjAwIiBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZG9iZSBQaG90b3Nob3AgMjEuMSAoV2luZG93cykiLz4gPC9yZGY6U2VxPiA8L3htcE1NOkhpc3Rvcnk+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+ejvILQAAAApJREFUCJljKAcAAHkAeO/tISkAAAAASUVORK5CYII=";
    let inited = false;
    let imgWidth = 80;
    function startView() {
        if(inited) return;
        inited = true;
        let pages = new Number($("#tags").children(":contains('Pages')").find(".tag").text());
        let tempUrl = $("#cover > a > img").attr("src").split("/").slice(0, -1).join("/")+"/";
        console.log("pages: "+pages);
        console.log("tempUrl: "+tempUrl);

        for(let i=1; i<=pages; i++) {
            $("#nyap-read-page-img").append(
                $("<span>")
                    .text(`${i}/${pages}page`)
                    .css({
                        "color": "gray",
                        "position": "absolute",
                        "left": 0
                    }),
                $("<img>")
                    .attr("src", loadingImg)
                    .attr("data-src", `${tempUrl+i}.jpg`)
                    .addClass("lazyload")
                    .css({
                        "width": "100%",
                        "padding": 0,
                        "margin": 0
                    }),
                $("<br>")
            );
        }
    }
    // 页面样式
    $("body").prepend(`
    <div style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 114514;display: none;background: rgba(0, 0, 0, 95%);overflow: auto;" id="nyap-read-page">
        <div style="position: fixed;bottom: 10px;right: 10px;">
            <h1 id="showWidth">${imgWidth}%</h1>
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
            <div id="nyap-read-page-img" style="width: ${imgWidth}%"></div>
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
    $("#nyap-read-page-img-change-width").click(function ({target}) {
        if($(target).attr("id")=="nyap-read-page-img-change-width") {
            return;
        }
        imgWidth = Math.max(1, imgWidth+Number($(target).text()));
        // 以屏幕中线为标准获取阅读进度,避免
        let readProgress = ($("#nyap-read-page").scrollTop()+$(window).height()/2)/$("#nyap-read-page").prop("scrollHeight");
        $("#nyap-read-page-img").css("width", imgWidth+"%");
        $("#showWidth").text(imgWidth+"%");
        $("#nyap-read-page").scrollTop(readProgress*$("#nyap-read-page").prop("scrollHeight")-$(window).height()/2);
    });
    done = false;
ms = 60000;
(function () {
    let start, previousTimeStamp;
    let pixelPreMs = $(window).height()/ms;
    let sum = 0;
    function step(time) {
        if(start == undefined) {
            start = time;
            previousTimeStamp = time;
        }
        if(done) {
            return;
        }
        sum += pixelPreMs*(time-previousTimeStamp);
        $("#nyap-read-page").scrollTop($("#nyap-read-page").scrollTop()+sum-sum%1);
        sum = sum%1;
        previousTimeStamp = time;
        window.requestAnimationFrame(step);
    }
    window.requestAnimationFrame(step);
})();
})();
