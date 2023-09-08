// need moment.js jquery

let getPageDocument = async function (url) {
    // 不带错误处理，懒得搞了，外头直接catch就行
    let html = (await CapacitorHttp.get({
        url,
        headers: {
            "User-Agent": "Mozilla/ 5.0(X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/116.0.0.0 Safari / 537.36",
            "Origin": new URL(url).origin
        },
    })).data;
    return new window.DOMParser().parseFromString(html, "text/html");
}

async function getGallerys(url) {
    let pageDocument = await getPageDocument(url);

    let page = { url };
    page.firstPageNum = parseInt($(".pagination > a:not(:first, :last):first", pageDocument).text());
    page.lastPageNum = parseInt($(".pagination > a:not(:first, :last):last", pageDocument).text());
    page.currentPageNum = parseInt($(".pagination > a:not(:first, :last).current", pageDocument).text());

    let tempUrl = new URL(url);
    tempUrl.searchParams.set("page", page.firstPageNum);
    page.firstPage = tempUrl.href;
    tempUrl.searchParams.set("page", page.lastPageNum);
    page.lastPage = tempUrl.href;
    tempUrl.searchParams.set("page", page.currentPageNum);
    page.currentPage = tempUrl.href;

    page.gallerys = [];
    $(".index-container:not(.index-popular) > .gallery", pageDocument).each(
        (index, element) => {
            page.gallerys.push({
                id: parseInt(
                    $(element).find(".cover").attr("href").split("/").pop()
                ),
                url: $(element).find(".cover").attr("href"),
                cover: $(element).find(".cover > img").attr("src"),
                title: $(element).find(".caption").text(),
                tags: $(element)
                    .attr("data-tags")
                    .trim()
                    .split(" ")
                    .map((tag) => parseInt(tag)),
            });
        }
    );

    page.gallerysPerPage = page.gallerys.length;

    return page;
}

async function getGalleryInfo(url) {
    let baseUrl = new URL(url);
    baseUrl = new URL(baseUrl.origin);
    let pageDocument = await getPageDocument(url);

    let gallery = { url };
    gallery.id = parseInt($("#gallery_id", pageDocument).text().substr(1));
    gallery.cover = $("#cover img", pageDocument).attr("src");
    gallery.title = $("h1.title", pageDocument).text();
    gallery.secondaryTitle = $("h2.title", pageDocument).text();

    gallery.tags = [];
    $("#tags > div", pageDocument).each((index, element) => {
        let type = $(element)
            .text()
            .substr(0, $(element).text().length - $(element).children(".tags").text().length - 1)
            .trim()
            .toLowerCase();

        if (type.match(/upload/g) != null) {
            // date ms
            gallery.uploaded = +moment($(element).find("[datetime]").attr("datetime"));
            return;
        }
        if (type.match(/page/g) != null) {
            gallery.pages = parseInt($(element).find(".name").text());
            return;
        }

        $(element)
            .find(".tag")
            .each((index, tag) => {
                gallery.tags.push({
                    id: parseInt(
                        $(tag)
                            .attr("class")
                            .match(/tag-(\d*)/)[1]
                    ),
                    name: $(tag).children(".name").text(),
                    url: (new URL($(tag).attr("href"), baseUrl)).href,
                    count: parseInt($(tag).children(".count").text()),
                    type,
                });
            });
    });

    gallery.pics = [];
    $(".thumbs a", pageDocument).each((index, element) => {
        let pic = {
            thumb: $(element).find("img[data-src]").attr("data-src"),
            url: (new URL($(element).attr("href"), baseUrl)).href
        };

        let temp = pic.thumb.split("/");
        temp[temp.length - 1] = temp[temp.length - 1].replaceAll("t", "");
        pic.file = temp.join("/");

        gallery.pics.push(pic);
    });

    return gallery;
}

async function getPopularGallerys(baseUrl) {
    baseUrl = new URL(baseUrl);
    let pageDocument = await getPageDocument(baseUrl.origin);

    let gallerys = [];
    $(".index-container.index-popular > .gallery", pageDocument).each(
        (index, element) => {
            gallerys.push({
                id: parseInt(
                    $(element).find(".cover").attr("href").split("/").pop()
                ),
                url: $(element).find(".cover").attr("href"),
                cover: $(element).find(".cover > img").attr("src"),
                title: $(element).find(".caption").text(),
                tags: $(element)
                    .attr("data-tags")
                    .trim()
                    .split(" ")
                    .map((tag) => parseInt(tag)),
            });
        }
    );/**
 * 切换平台只需修改 getPageDocument 即可，CapacitorHttp仅用于跨过cors
 */

import { boot } from "quasar/wrappers";
import { CapacitorHttp } from "@capacitor/core";
import $ from "jquery";
import moment from "moment";

    return gallerys;
}

async function getTags(baseUrl, { onprogress = () => { }, typeList = ["tags", "artists", "characters", "parodies", "groups"] }) {
    baseUrl = new URL(baseUrl);
    baseUrl = new URL(baseUrl.origin);

    let tags = [];
    for (let i in typeList) {
        let type = typeList[i];
        baseUrl.pathname = type;

        // 随便搞一个值，待会获取到了改
        let pages = Infinity;
        for (let i = 1; i <= pages; i++) {
            baseUrl.searchParams.set("page", i);
            let pageDocument = await getPageDocument(baseUrl.href);
            pages = parseInt($(".pagination > a:not(:first, :last):last", pageDocument).text());

            $("section > .tag", pageDocument).each(function (index, element) {
                tags.push({
                    id: parseInt($(element).attr("class").match(/tag-(\d*)/)[1]),
                    count: parseInt($(element).children(".count").text().match(/\((\d*)\)/)[1]),
                    url: (new URL($(element).attr("href"), baseUrl.origin)).href,
                    name: $(element).text().substr(0, $(element).text().length - $(element).children(".count").text().length - 1),
                    type
                });
            });

            onprogress(i, pages, type, tags);
        }
    }

    return tags;
}
