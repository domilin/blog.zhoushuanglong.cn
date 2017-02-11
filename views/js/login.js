$(function(){
    $('#loginBtn').click(function(){
        ajaxGet(rootUrl + '/login', $('#login').serialize(), function(data){
            if(data.success == true){
                window.location.href = 'management.html'
            }else{
                popTips('账号密码错误!');
            }
        });
        return false;
    });
});