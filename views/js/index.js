$(function () {

    $('#paginationContainer').hide();

    getNav();
    tabNav();
    navMenu();
    backToTop();
    shareSocial();
    browserTip();

    backHistory();

});

var urlParm = new GetUrlParms();

var reqUrl = indexUrl + '/article';

var $blogDetail = $('#blogDetail'),
    $blogTypeList = $('#blogTypeList');


//返回按钮
function backHistory() {
    var $backHistory = $('#backHistory');
    if (parseInt($(window).width()) <= 960 && urlParm['articleid'] !== undefined) {
        $backHistory.show();
    } else {
        $backHistory.hide();
    }

    $backHistory.click(function () {

        var typeid = $.cookie('typeid');

        if (typeid == 'undefined' || typeid == null || typeid == 'index') {
            window.location.href = 'index.html';
        } else {

            $('#blogTypeTitle span').text('笙歌离人的博客');
            $('#navigation a').removeClass('active');
            $('#navigation a[data-typeid=' + typeid + ']').addClass('active');

            $(this).hide();
            $blogDetail.hide();
            $blogTypeList.show();

            render({
                typeid: typeid,
                page: 1,
                size: 20
            });
        }

    });
}

//浏览器版本提醒
function browserTip() {
    if (getExplorerInfo().type == "IE" && parseFloat(getExplorerInfo().version) < 10) {
        window.location.href = 'error.html'
    }
}

//汉堡菜单
function navMenu() {
    var $blogNav = $('#blogNav');

    $(document).on('click', '#blogTypeTitle a.menu', function () {
        $blogNav.addClass('active');
    });

    $(document).on('click', '#navClose', function () {
        $blogNav.removeClass('active');
    });
}

//回到顶部
function backToTop() {
    var $backToTop = $('#backToTop'),
        $blogContent = $('div.blog-content');
    $blogContent.scroll(function () {
        if ($(this).scrollTop() < 100) {
            $backToTop.fadeOut(500);
        } else {
            $backToTop.fadeIn(500);
        }
    });
    $backToTop.click(function () {
        $blogContent.animate({scrollTop: 0}, 1000);
    });
}

//导航获取
function getNav() {
    var navStr = '<a data-typeid="index" href="index.html">主页</a>';
    ajaxGet(indexUrl + '/nav', '', function (data) {
        $.each(data, function (i, d) {
            navStr += '<a data-typeid="' + d.id + '">' + d.title + '</a>';
        });
        navStr += '<a href="mailto:124622297@qq.com?subject=欢迎你的来信！&body=请写下你的建议或分享,谢谢！">联系我</a>';
        $('#navigation').html(navStr);

        getArticle();
    });
}
//带参数地址
function getArticle() {
    if (urlParm['articleid'] == undefined) {
        $blogDetail.hide();
        $blogTypeList.show();

        $('#navigation a:eq(0)').addClass('active');
        render({
            recommend: 1,
            page: 1,
            size: 20
        });
    } else {
        $blogDetail.show();
        $blogTypeList.hide();

        renderArticle(urlParm['articleid']);
    }

    $(document).on('click', '#blogDetail .previous', function () {
        renderArticle($(this).attr('data-id'))
    });

    $(document).on('click', '#blogDetail .next', function () {
        renderArticle($(this).attr('data-id'))
    });
}
//渲染文章
function renderArticle(id) {
    var $updatetime = $blogDetail.find('.update-time'),
        $category = $blogDetail.find('.category'),
        $blogArticle = $blogDetail.find('.blog-article'),
        $paginationContainer = $blogDetail.find('.pagination-container'),
        $pcPrev = $paginationContainer.find('.previous'),
        $pcNext = $paginationContainer.find('.next');

    $paginationContainer.hide();
    ajaxGet(reqUrl, {id: id}, function (data) {
        if (data.element.length != 0) {
            var detail = data.element[0],
                timeArr = detail.updatetime.split(' ')[0].split('-');

            $('#htmlTitle').text(detail.title);

            $('#blogTypeTitle span').text(detail.title);
            $('#navigation a').removeClass('active');
            $('#navigation a[data-typeid=' + detail.typeid + ']').addClass('active');

            $updatetime.html(timeArr[0] + '年' + timeArr[1] + '月<em>' + timeArr[2] + '</em>日');
            $category.find('a').text(detail.typename).attr('data-typeid', detail.typeid);
            $blogArticle.html(detail.content);
            $pcPrev.attr('data-id', parseInt(id) - 1);
            $pcNext.attr('data-id', parseInt(id) + 1);
        } else {
            popTips('没有更多的了!');
        }

        $paginationContainer.show();
    });
}


//导航切换
function tabNav() {
    $(document).on('click', '#navigation a', function () {

        $('#backHistory').hide();

        $blogDetail.hide();
        $blogTypeList.show();
        $('#blogNav').removeClass('active');

        var $this = $(this),
            $na = $('#navigation a'),
            typeid = $this.attr('data-typeid');

        $.cookie('typeid', typeid);

        if (typeid != undefined && typeid != 'index') {
            $na.removeClass('active');
            $this.addClass('active');

            $('#htmlTitle').text('互动影视|前端达人');

            $('#blogTypeTitle span').text($this.text());
            render({
                typeid: typeid,
                page: 1,
                size: 20
            });
        }
    });
}


//博客列表渲染
function render(dataCondition) {
    var $paginationContainer = $('#paginationContainer'),
        $blogList = $('#blogList');

    $paginationContainer.hide();

    var str = '';
    ajaxGet(reqUrl, dataCondition, function (data) {
        if (data.element.length == 0) {
            $blogList.html('<li><a>暂无数据</a></li>');
        } else {
            $.each(data.element, function (i, d) {
                var timeArr = d.updatetime.split(' ')[0].split('-'),
                    href = rootUrl + '/index.html?articleid=' + d.id;
                str += '<li>' +
                    '<span>' + timeArr[0] + '年' + timeArr[1] + '月' + timeArr[2] + '日</span>' +
                    '<a href="' + href + '">' + d.title + '</a>' +
                    '</li>';
            });
            $blogList.html(str);

            if (data.pager.totalpage > 1) {
                $paginationContainer.show();

                var pager = data.pager,
                    pageArg = {
                        element: '#paginationContainer',
                        totalpage: pager.totalpage,
                        pagecurrent: pager.pagecurrent,
                        pagesize: pager.pagesize,
                        render: render
                    };
                if (dataCondition.typeid) {
                    pageArg.condition = {
                        typeid: dataCondition.typeid
                    }
                } else if (dataCondition.recommend) {
                    pageArg.condition = {
                        recommend: dataCondition.recommend
                    }
                }

                pageBtn(pageArg);
            }
        }

    });
}


//分享到
function shareSocial() {
    var $blogNav = $('.blog-nav'),
        $blogContent = $('.blog-content'),
        $htmlTitle = $('#htmlTitle');

    //左侧导航分享按钮
    $blogNav.find('.qq').click(function () {
        var share = new ShareSocial();
        share.shareqqzone('笙歌离人的博客', rootUrl);
    });
    $blogNav.find('.tencent-weibo').click(function () {
        var share = new ShareSocial();
        share.shareqq('笙歌离人的博客', rootUrl);
    });
    $blogNav.find('.sina-weibo').click(function () {
        var share = new ShareSocial();
        share.sharesina('笙歌离人的博客', rootUrl);
    });

    //文章具体内容分享按钮
    $blogContent.find('.qq').click(function () {
        var share = new ShareSocial();
        share.shareqqzone($htmlTitle.text(), window.location.href);
    });
    $blogContent.find('.tencent-weibo').click(function () {
        var share = new ShareSocial();
        share.shareqq($htmlTitle.text(), window.location.href);
    });
    $blogContent.find('.sina-weibo').click(function () {
        var share = new ShareSocial();
        share.sharesina($htmlTitle.text(), window.location.href);
    });
}