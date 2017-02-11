$(function () {

    //判断是否登录
    ajaxGet(blogUrl, '', function (data) {
        if (data.unlogin == true) {
            window.location.href = 'login.html';
        }
    });

    $('div.management_panel[data-type=blog]').show();
    $(document).on('click', '#blogNav li', function () {
        var type = $(this).attr('data-type');
        $('#blogNav li').removeClass('active');
        $(this).addClass('active');
        $('div.management_panel').hide();
        $('div.management_panel[data-type=' + type + ']').show();
    });

    navManagement();

    userManagement();

    blogManagement();

    fileManagement();

});

//用户管理
var userManagement = function () {
    var $userList = $('#userList'),
        $userName = $('#userName'),
        $password = $('#password'),
        $userAdd = $('#userAdd'),
        $userAddEdit = $('#userAddEdit'),
        $userAddEditTitle = $('#userAddEditTitle'),
        $sureUserAddEdit = $('#sureUserAddEdit');

    var reqUrl = blogUrl + '/user';

    render({page: 1, size: 20});

    //用户删除
    $(document).on('click', '#userList button.user_del', function () {
        var $this = $(this),
            id = $this.attr('data-id');
        popComfirm('删除提示', '确定要删除此用户吗?', function () {
            ajaxDel(reqUrl, {id: id}, function (data) {
                if (data.success == true) {
                    popTips('删除成功!');
                    render({page: 1, size: 20});
                }
            });
        });
        return false;
    });

    //用户编辑
    $(document).on('click', '#userList button.user_edit', function () {
        $userAddEditTitle.html('用户编辑');

        var $this = $(this),
            id = $this.attr('data-id');
        $sureUserAddEdit.attr({
            'data-type': 'edit',
            'data-id': $this.attr('data-id')
        });
        $password.val($this.attr('data-password'));
        $userName.val($this.attr('data-username'));
        $userAddEdit.modal({backdrop: 'static', keyboard: false});
        return false;
    });


    //用户添加
    $(document).on('click', '#userAdd', function () {
        $userAddEditTitle.text('用户添加');

        $sureUserAddEdit.attr({
            'data-type': 'add',
            'data-id': ''
        });
        $password.val('');
        $userName.val('');
        $userAddEdit.modal({backdrop: 'static', keyboard: false});
        return false;
    });


    //确认添加与编辑
    $(document).on('click', '#sureUserAddEdit', function () {
        var $this = $(this),
            id = $this.attr('data-id'),
            type = $this.attr('data-type');
        switch (type) {
            case 'add':
                userAdd();
                break;
            case 'edit':
                userEdit(id);
                break;
        }
        return false;
    });
    function userAdd() {
        var userName = $.trim($userName.val()),
            password = $.trim($password.val());
        if (userName != '' && password != '') {
            ajaxPut(reqUrl, {
                username: userName,
                password: password
            }, function (data) {
                if (data.success == true) {
                    popTips('添加成功');
                    $userAddEdit.modal('hide');
                    render({page: 1, size: 20});
                } else {
                    popTips(data.message);
                }
            })
        } else {
            popTips('用户名或密码不能为空');
        }
    }

    function userEdit(id) {
        var userName = $.trim($userName.val()),
            password = $.trim($password.val());
        if (userName != '' && password != '') {
            ajaxPost(reqUrl, {
                id: id,
                username: userName,
                password: password
            }, function (data) {
                if (data.success == true) {
                    popTips('修改成功');
                    $userAddEdit.modal('hide');
                    render({page: 1, size: 20});
                } else {
                    popTips(data.message);
                }
            })
        } else {
            popTips('用户名或密码不能为空');
        }
    }


    function render(data) {
        var str = '';
        ajaxGet(reqUrl, data, function (data) {
            $.each(data.element, function (i, d) {
                str += '<tr>' +
                    '<td scope="row">' + d.username + '</td>' +
                    '<td>' + d.password + '</td>' +
                    '<td>' +
                    '<button type="button" class="btn btn-primary btn-xs user_edit" ' +
                    'data-id="' + d.id + '"' +
                    'data-username="' + d.username + '"' +
                    'data-password="' + d.password + '"' +
                    '>编辑</button>' +
                    '<button type="button" class="btn btn-success btn-xs user_del" data-id="' + d.id + '">删除</button>' +
                    '</td>' +
                    '</tr>';
            });
            $userList.html(str);

            var pager = data.pager;
            pageBtn({
                element: '#userPager',
                totalpage: pager.totalpage,
                pagecurrent: pager.pagecurrent,
                pagesize: pager.pagesize,
                render: render
            })
        });

    }

};

//导航管理
var navManagement = function () {
    var $navList = $('#navList'),
        $navName = $('#navName'),
        $navAdd = $('#navAdd'),
        $navAddEdit = $('#navAddEdit'),
        $navAddEditTitle = $('#navAddEditTitle'),
        $sureNavAddEdit = $('#sureNavAddEdit');

    var reqUrl = blogUrl + '/nav';

    render();


    //导航删除
    $(document).on('click', '#navList button.nav_del', function () {
        var $this = $(this),
            id = $this.attr('data-id');
        popComfirm('删除提示', '确定要删除此导航吗?', function () {
            ajaxDel(reqUrl, {id: id}, function (data) {
                if (data.success == true) {
                    popTips('删除成功!');
                    render();
                }
            });
        });
        return false;
    });


    //导航编辑
    $(document).on('click', '#navList button.nav_edit', function () {
        $navAddEditTitle.html('导航编辑');

        var $this = $(this),
            id = $this.attr('data-id');
        $sureNavAddEdit.attr({
            'data-type': 'edit',
            'data-id': $this.attr('data-id')
        });
        $navName.val($('#navItem' + id).text());
        $navAddEdit.modal({backdrop: 'static', keyboard: false});
        return false;
    });


    //导航添加
    $(document).on('click', '#navAdd', function () {
        $navAddEditTitle.html('导航添加');

        $sureNavAddEdit.attr({
            'data-type': 'add',
            'data-id': ''
        });
        $navName.val('');
        $navAddEdit.modal({backdrop: 'static', keyboard: false});
        return false;
    });


    //确认添加与编辑
    $(document).on('click', '#sureNavAddEdit', function () {
        var $this = $(this),
            id = $this.attr('data-id'),
            type = $this.attr('data-type');
        switch (type) {
            case 'add':
                navAdd();
                break;
            case 'edit':
                navEdit(id);
                break;
        }
        return false;
    });
    function navAdd() {
        var navName = $.trim($navName.val());
        if (navName != '') {
            ajaxPut(reqUrl, {title: navName}, function (data) {
                if (data.success == true) {
                    popTips('添加成功');
                    blogNavList();
                    $navAddEdit.modal('hide');
                    render();
                } else {
                    popTips(data.message);
                }
            })
        } else {
            popTips('导航名称不能为空');
        }
    }

    function navEdit(id) {
        var navName = $.trim($navName.val());
        if (navName != '') {
            ajaxPost(reqUrl, {
                id: id,
                title: navName
            }, function (data) {
                if (data.success == true) {
                    popTips('修改成功');
                    $navAddEdit.modal('hide');
                    render();
                } else {
                    popTips(data.message);
                }
            })
        } else {
            popTips('导航名称不能为空');
        }
    }

    function render() {
        var str = '';
        ajaxGet(reqUrl, '', function (data) {
            $.each(data, function (i, d) {
                str += '<tr>' +
                    '<td scope="row" id="navItem' + d.id + '">' + d.title + '</td>' +
                    '<td>' +
                    '<button type="button" class="btn btn-primary btn-xs nav_edit" data-id="' + d.id + '">编辑</button>' +
                    '<button type="button" class="btn btn-success btn-xs nav_del" data-id="' + d.id + '">删除</button>' +
                    '</td>' +
                    '</tr>';
            });
            $navList.html(str);
        });
    }
};


//博客管理
var blogManagement = function () {
    var $blogList = $('#blogList'),
        $blogAdd = $('#blogAdd'),
        $blogTitle = $('#blogTitle'),
        $blogType = $('#blogType'),
        $blogRecommend = $('#blogRecommend'),
        $blogAddEdit = $('#blogAddEdit'),
        $blogAddEditTitle = $('#blogAddEditTitle'),
        $sureBlogAddEdit = $('#sureBlogAddEdit'),
        $blogContent = $('#blogContent'),
        $blogNavTab = $('#blogNavTab');

    var reqUrl = blogUrl + '/artitle';

    $blogContent.summernote({
        lang: 'zh-CN',
        height: 500
    });

    blogNavList();
    render({
        recommend: 1,
        page: 1,
        size: 20
    });

    //博客列表切换
    $(document).on('click', '#blogNavTab li', function () {
        var $this = $(this),
            id = $this.attr('data-id');
        if (id == 'recommend') {
            render({
                recommend: 1,
                page: 1,
                size: 20
            });
        } else {
            render({
                typeid: id,
                page: 1,
                size: 20
            });
        }
        return false;
    });

    //博客删除
    $(document).on('click', '#blogList button.blog_del', function () {
        var $this = $(this),
            id = $this.attr('data-id');
        popComfirm('删除提示', '确定要删除此博客吗?', function () {
            ajaxDel(reqUrl, {id: id}, function (data) {
                if (data.success == true) {
                    refreshBlogList();
                    popTips('删除成功!');
                }
            });
        });
        return false;
    });

    //博客编辑
    $(document).on('click', '#blogList button.blog_edit', function () {
        $blogAddEditTitle.html('博客查看与编辑');

        var $this = $(this),
            id = $this.attr('data-id');
        $sureBlogAddEdit.attr({
            'data-type': 'edit',
            'data-id': $this.attr('data-id')
        });
        ajaxGet(reqUrl, {id: id}, function (data) {
            var thisData = data.element[0];
            $blogTitle.val(thisData.title);
            $blogType.val(thisData.typeid);
            $blogRecommend.val(thisData.recommend);
            $blogContent.summernote('code', thisData.content);
            $blogAddEdit.modal({backdrop: 'static', keyboard: false});
        });
        return false;
    });

    //博客添加
    $(document).on('click', '#blogAdd', function () {
        $blogAddEditTitle.html('博客添加');

        $sureBlogAddEdit.attr({
            'data-type': 'add',
            'data-id': ''
        });
        $blogTitle.val('');
        $blogType.val(0);
        $blogContent.summernote('code', '');
        $blogAddEdit.modal({backdrop: 'static', keyboard: false});
        return false;
    });

    //确认添加与编辑
    $(document).on('click', '#sureBlogAddEdit', function () {
        var $this = $(this),
            id = $this.attr('data-id'),
            type = $this.attr('data-type');
        switch (type) {
            case 'add':
                blogAdd();
                break;
            case 'edit':
                blogEdit(id);
                break;
        }
        return false;
    });
    function blogAdd() {
        var blogTitle = $.trim($blogTitle.val()),
            blogTypeId = parseInt($blogType.val()),
            blogTypeName = $blogType.find("option:selected").text(),
            blogRecommend = parseInt($blogRecommend.val()),
            blogContent = $blogContent.summernote('code');
        if (blogTitle != '') {
            ajaxPut(reqUrl, {
                typeid: blogTypeId,
                typename: blogTypeName,
                title: blogTitle,
                content: blogContent,
                recommend: blogRecommend
            }, function (data) {
                if (data.success == true) {
                    refreshBlogList();
                    popTips('添加成功');
                    $blogAddEdit.modal('hide');
                } else {
                    popTips(data.message);
                }
            })
        } else {
            popTips('文章标题不能为空');
        }
    }

    function blogEdit(id) {
        var blogTitle = $.trim($blogTitle.val()),
            blogTypeId = parseInt($blogType.val()),
            blogTypeName = $blogType.find("option:selected").text(),
            blogRecommend = parseInt($blogRecommend.val()),
            blogContent = $blogContent.summernote('code');
        if (blogTitle != '') {
            ajaxPost(reqUrl, {
                id: id,
                typeid: blogTypeId,
                typename: blogTypeName,
                title: blogTitle,
                content: blogContent,
                recommend: blogRecommend
            }, function (data) {
                if (data.success == true) {
                    refreshBlogList();
                    popTips('修改成功');
                    $blogAddEdit.modal('hide');
                } else {
                    popTips(data.message);
                }
            })
        } else {
            popTips('导航名称不能为空');
        }
    }

    function refreshBlogList() {//添加与编辑后刷新当前选中列表
        if (currentNavItem() == 'recommend') {
            render({
                recommend: 1,
                page: 1,
                size: 20
            });
        } else {
            render({
                typeid: parseInt(currentNavItem()),
                page: 1,
                size: 20
            });
        }
    }

    function currentNavItem() {//获取当前选中类型
        var id;
        $blogNavTab.children('li').each(function (i) {
            var $this = $(this);
            if ($this.hasClass('active')) {
                id = $this.attr('data-id');
            }
        });
        return id;
    }

    function render(dataCondition) {//列表渲染
        var str = '';
        ajaxGet(reqUrl, dataCondition, function (data) {
            $.each(data.element, function (i, d) {
                var recommend = '';
                switch (d.recommend) {
                    case 0:
                        recommend = '不推荐';
                        break;
                    case 1:
                        recommend = '推荐';
                }
                var href = rootUrl + '/index.html?articleid=' + d.id;
                str += '<tr>' +
                    '<td scope="row">' + d.title + '</td>' +
                    '<td>' + recommend + '</td>' +
                    '<td>' + d.typename + '</td>' +
                    '<td>' + d.createtime + '</td>' +
                    '<td>' + d.updatetime + '</td>' +
                    '<td>' +
                    '<a class="btn btn-primary btn-xs blog_check" href="' + href + '" target="_blank">查看</a>' +
                    '<button type="button" class="btn btn-primary btn-xs blog_edit" data-id="' + d.id + '">编辑</button>' +
                    '<button type="button" class="btn btn-success btn-xs blog_del" data-id="' + d.id + '">删除</button>' +
                    '</td>' +
                    '</tr>';
            });
            $blogList.html(str);

            var pager = data.pager,
                pageArg = {
                    element: '#blogPager',
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
        });
    }
};

//博客编辑导航获取
function blogNavList() {
    var str = '',
        blogNavStr = '<li role="presentation" class="active" data-id="recommend"><a role="tab" data-toggle="tab">推荐</a></li>',
        active = '';
    ajaxGet(blogUrl + '/nav', '', function (data) {
        $.each(data, function (i, d) {
            blogNavStr += '<li role="presentation" data-id="' + d.id + '"><a role="tab" data-toggle="tab">' + d.title + '</a></li>';
            str += '<option value="' + d.id + '">' + d.title + '</option>'
        });
        $('#blogNavTab').html(blogNavStr);
        $('#blogType').html(str);
    });
}


//文件管理
var fileManagement = function () {

    var $fileList = $('#fileList');

    var reqUrl = blogUrl + '/file';

    render({page: 1, size: 20});

    function render(data) {
        var str = '';
        ajaxGet(reqUrl, data, function (data) {
            $.each(data.element, function (i, d) {
                str += '<tr>' +
                    '<td scope="row">' + d.name + '</td>' +
                    '<td>' + (d.size / 1024 / 1024).toFixed(2) + 'MB' + '</td>' +
                    '<td>' + d.time + '</td>' +
                    '<td>' +
                    '<a class="btn btn-primary btn-xs file_check" href="' + d.url + '">查看</a>' +
                    '<button type="button" class="btn btn-success btn-xs file_del" data-name="' + d.name + '">删除</button>' +
                    '</td>' +
                    '</tr>';
            });
            $fileList.html(str);

            var pager = data.pager;
            pageBtn({
                element: '#filePager',
                totalpage: pager.totalpage,
                pagecurrent: pager.pagecurrent,
                pagesize: pager.pagesize,
                render: render
            })
        });
    }

    //文件删除
    $(document).on('click', '#fileList button.file_del', function () {
        var $this = $(this),
            name = $this.attr('data-name');
        popComfirm('删除提示', '确定要删除此文件吗?', function () {
            ajaxDel(reqUrl, {name: name}, function (data) {
                if (data.success == true) {
                    popTips('删除成功!');
                    render({page: 1, size: 20});
                }
            });
        });
        return false;
    });

    //清除缓存
    $(document).on('click', '#clearTemps', function () {
        var $this = $(this),
            name = $this.attr('data-name');
        popComfirm('清除提示', '确定要清除全部缓存吗?', function () {
            ajaxDel(blogUrl + '/upload/cleartemps', {}, function (data) {
                if (data.success == true) {
                    popTips('删除成功!');
                }
            });
        });
        return false;
    });

    //formdata普通上传
    var $fdu = $('#formDataUpload'),
        $fdf = $('#formDataForm'),
        $fdb = $('#formDataBtn'),
        $fds = $('#sureFormData');
    $fdb.click(function () {
        $fdu.modal({backdrop: 'static', keyboard: false});
    });
    $fds.click(function () {
        var formData = new FormData($fdf[0]);
        $.ajax({
            url: blogUrl + '/upload/formdata',
            type: 'POST',
            data: formData,
            async: true,
            cache: false,
            contentType: false,
            processData: false,
            success: function (data) {
                if (data.success == true) {
                    $fdu.modal('hide');
                    popTips('上传成功');
                    render({page: 1, size: 20});
                }
            }
        });
        return false;
    });


    //largefile大文件上传
    var $lfu = $('#largeFileUpload'),
        $lff = $('#largeFileForm'),
        $lfb = $('#largeFileBtn'),
        $lfs = $('#sureLargeFile'),
        $uploadProcesss = $('#uploadProcesss'),
        $largeFileInput = $('#largeFileInput');

    $largeFileInput.change(function () {
        $uploadProcesss.width('0%').html('0%');
    });

    $lfb.click(function () {
        $lfu.modal({backdrop: 'static', keyboard: false});
    });

    $lfs.click(function () {

        var file = $largeFileInput[0].files[0], //文件对象
            name = file.name, //文件名
            size = file.size, //总大小
            succeed = 0, //上传完成标记
            timestamp = new Date().getTime(); //上传文件标记

        var shardSize = 2 * 1024 * 1024, //以2MB为一个分片
            shardCount = Math.ceil(size / shardSize); //总片数

        for (var i = 0; i < shardCount; ++i) {

            //计算每一片的起始与结束位置
            var start = i * shardSize,
                end = Math.min(size, start + shardSize);

            //构造一个表单，FormData是HTML5新增的
            var form = new FormData();
            form.append("data", file.slice(start, end)); //slice方法用于切出文件的一部分
            form.append("name", name);
            form.append("total", shardCount); //总片数
            form.append("index", i + 1); //当前是第几片
            form.append("size", size); //文件总大小
            form.append("timestamp", timestamp); //当前是第几片

            // Ajax提交
            $.ajax({
                url: blogUrl + '/upload/largefile',
                type: "POST",
                data: form,
                async: true, //异步
                processData: false, //很重要，告诉jquery不要对form进行处理
                contentType: false, //很重要，指定为false才能形成正确的Content-Type
                success: function (data) {
                    succeed++;
                    if (data.success == true) {
                        var process = (succeed / shardCount * 100).toFixed(0) + '%';
                        $uploadProcesss.width(process).html(process);
                        if (process == '100%') {
                            $uploadProcesss.width('0%').html('0%');
                            $lfu.modal('hide');
                            popTips('上传成功');
                            setTimeout(function () {
                                //后台合并文件需要时间,在此固定等待一定时候后更新文件列表
                                //若后台还是合并完,就强制刷新整个页面
                                //后续想更好的办法
                                render({page: 1, size: 20});
                            }, 2000);
                        }
                    }
                }
            });
        }

        return false;
    });

};