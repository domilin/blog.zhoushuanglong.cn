//根路径
var rootUrl = 'http://' + window.location.host,
    blogUrl = rootUrl + '/management',
    indexUrl = rootUrl + '/index';

//ajax
function ajaxGet(url, data, fn) {
    $.ajax({
        type: 'GET',
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        data: data,
        error: function () {
            console.log('error');
        },
        success: function (data) {
            fn.call(window, data);
        }
    });
}
function ajaxPut(url, data, fn) {
    $.ajax({
        type: 'PUT',
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function () {
            console.log('error');
        },
        success: function (data) {
            fn.call(window, data);
        }
    });
}
function ajaxPost(url, data, fn) {
    $.ajax({
        type: 'POST',
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function () {
            console.log('error');
        },
        success: function (data) {
            fn.call(window, data);
        }
    });
}
function ajaxDel(url, data, fn) {
    $.ajax({
        type: 'DELETE',
        url: url,
        dataType: 'json',
        contentType: 'application/json',
        data: JSON.stringify(data),
        error: function () {
            console.log('error');
        },
        success: function (data) {
            fn.call(window, data);
        }
    });
}


//提示信息弹出层
function popTips(text) {
    if ($('#popTips')) {
        $('#popTips').remove();
    }
    var str = '<div class="pop_tips" id="popTips">' + text + '<a></a></div>';
    $(str).appendTo($('body'));
    var $pt = $('#popTips'),
        $w = $(window);
    setTimeout(function () {
        $('#popTips').css({
            'left': (parseInt($w.width()) - parseInt($pt.width()) - 80) / 2,
            'top': (parseInt($w.height()) - parseInt($pt.height()) - 20) / 2
        }).addClass('focus');
    }, 10);
    setTimeout(function () {
        $pt.removeClass('focus');
        setTimeout(function () {
            $pt.remove();
        }, 200)
    }, 2000);
}

//确认对话框
function popComfirm(title, text, fn) {
    var str = '<div class="modal fade" id="confirmPkg">' +
        '<div class="modal-dialog">' +
        '<div class="modal-content">' +
        '<div class="modal-header">' +
        '<button id="cancelConfirmTop" type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        '<h4 class="modal-title">' + title + '</h4></div>' +
        '<div class="modal-body"><p>' + text + '</p></div>' +
        '<div class="modal-footer">' +
        '<button type="button" class="btn btn-default" data-dismiss="modal"id="cancelConfirm">取消</button>' +
        '<button type="button" class="btn btn-primary" id="sureConfirm">确定</button>' +
        '</div></div></div></div>';
    $(str).appendTo($('body'));
    $('#cancelConfirmTop').click(function () {
        confirmHide();
    });
    $('#cancelConfirm').click(function () {
        confirmHide();
    });
    $('#sureConfirm').click(function () {
        fn.call(window);
        confirmHide();
    });
    $('#confirmPkg').modal({backdrop: 'static', keyboard: false});
    function confirmHide() {
        setTimeout(function () {
            $('#confirmPkg').modal('hide');
        }, 500);
        setTimeout(function () {
            $('#confirmPkg').remove();
        }, 800);
    }
}


//分页
function pageBtn(arg) {
    var element = arg.element,
        totalpage = arg.totalpage,
        pagecurrent = arg.pagecurrent,
        pagesize = arg.pagesize,
        condition = arg.condition ? arg.condition : {},
        render = arg.render;

    var $pager = $(element),
        $select = $pager.find('select.assignto'),
        $prev = $pager.find('.previous'),
        $next = $pager.find('.next');

    var option = '';
    for (var i = 1; i <= totalpage; i++) {
        option += '<option value="' + i + '">' + i + '</option>'
    }
    $select.html(option);

    $select.val(pagecurrent);

    var prevNum;
    if (pagecurrent == 1) {
        prevNum = 1;
        $prev.addClass('disabled');
    } else {
        prevNum = pagecurrent - 1;
        $prev.removeClass('disabled');
    }

    var nextNum;
    if (pagecurrent == totalpage) {
        nextNum = totalpage;
        $next.addClass('disabled');
    } else {
        nextNum = pagecurrent + 1;
        $next.removeClass('disabled');
    }

    $prev.attr('data-page', prevNum);
    $next.attr('data-page', nextNum);

    $prev.off('click');
    $prev.click(function () {
        var $this = $(this);
        renderPage($this, $this.attr('data-page'))
    });

    $next.off('click');
    $next.click(function () {
        var $this = $(this);
        renderPage($this, $this.attr('data-page'))
    });

    $select.off('change');
    $select.change(function () {
        var $this = $(this);
        renderPage($this, $this.val())
    });

    function renderPage($this, page) {
        var pageArg = {
            size: pagesize,
            page: page
        };

        $.each(condition, function (i, d) {
            pageArg[i] = d;
        });

        render(pageArg);
    }

}

//地址参数截取
function GetUrlParms() {
    var args = new Object();
    var query = location.search.substring(1);//获取查询串
    var pairs = query.split("&");//在逗号处断开
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('=');//查找name=value
        if (pos == -1) continue;//如果没有找到就跳过
        var argname = pairs[i].substring(0, pos);//提取name
        var value = pairs[i].substring(pos + 1);//提取value
        args[argname] = unescape(value);//存为属性
    }
    return args;
}


//分享到
function ShareSocial() {
}
ShareSocial.prototype = {
    shareqq: function (title, url, picurl) {
        var shareqqstring = 'http://v.t.qq.com/share/share.php?title=' + title + '&url=' + url + '&pic=' + picurl;
        window.open(shareqqstring, 'newwindow', 'height=550,width=770,top=100,left=' + (parseInt($(window).width()) - 700) / 2 + '');
    },
    sharesina: function (title, url, picurl) {
        var sharesinastring = 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + url + '&content=utf-8&sourceUrl=' + url + '&pic=' + picurl;
        window.open(sharesinastring, 'newwindow', 'height=550,width=770,top=100,left=' + (parseInt($(window).width()) - 700) / 2 + '');
    },
    shareqqzone: function (title, url, picurl) {
        var shareqqzonestring = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?summary=' + title + '&url=' + url + '&pics=' + picurl;
        window.open(shareqqzonestring, 'newwindow', 'height=550,width=770,top=100,left=' + (parseInt($(window).width()) - 700) / 2 + '');
    }
};


//浏览器检测
//getExplorerInfo().type
//getExplorerInfo().version
function getExplorerInfo() {
    var explorer = window.navigator.userAgent.toLowerCase();
    //ie
    if (explorer.indexOf("msie") >= 0) {
        var ver = explorer.match(/msie ([\d.]+)/)[1];
        return {type: "IE", version: ver};
    }
    //firefox
    else if (explorer.indexOf("firefox") >= 0) {
        var ver = explorer.match(/firefox\/([\d.]+)/)[1];
        return {type: "Firefox", version: ver};
    }
    //Chrome
    else if (explorer.indexOf("chrome") >= 0) {
        var ver = explorer.match(/chrome\/([\d.]+)/)[1];
        return {type: "Chrome", version: ver};
    }
    //Opera
    else if (explorer.indexOf("opera") >= 0) {
        var ver = explorer.match(/opera.([\d.]+)/)[1];
        return {type: "Opera", version: ver};
    }
    //Safari
    else if (explorer.indexOf("Safari") >= 0) {
        var ver = explorer.match(/version\/([\d.]+)/)[1];
        return {type: "Safari", version: ver};
    }
    //unknown
    else {
        return {type: "unknown", version: 'unknown'};
    }
}