$(function(){

    //初始化
    navigation();

    //导航
    var $blogNav = $('#blogNav');
    $blogNav.children('li').click(function(){
        var $this = $(this),
            id = $this.attr('data-id'),
            name = $this.children('a').text();
        switch (name){
            case '首页':
                navigation();
        }
    });
});
