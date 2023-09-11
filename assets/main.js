(function($){
    'use strict';
    $(document).ready(function(){
        // handle forgot password form
        const forgotPasswordBtn = $('.reover-password-btn');
        const cancelBtn = $('.cancel-btn');
        if (forgotPasswordBtn.length) {
            $(forgotPasswordBtn).on('click', function(e){
                e.preventDefault();
                $('.customer-recover-password').css({
                    display: 'block'
                });
                $('.customer-login').css({
                    display: 'none'
                });
            });
        }
        if (cancelBtn.length) {
            $(cancelBtn).on('click', function(e){
                e.preventDefault();
                $('.customer-recover-password').css({
                    display: 'none'
                });
                $('.customer-login').css({
                    display: 'block'
                });
            });
        }
    });
})(jQuery);