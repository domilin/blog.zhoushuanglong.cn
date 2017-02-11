
//导航
var navigation = function () {
    var str = '',
        active = '';
    ajaxGet(blogUrl + '/nav', '', function (data) {
        $.each(data, function (i, d) {
            if(d.id == 1){
                active = 'class="active"'
            }else{
                active = '';
            }
            str += '<li ' + active + '><a data-id="' + d.id + '">' + d.title + '</a></li>'
        });
        $('#blogNav').html(str);
    });
};