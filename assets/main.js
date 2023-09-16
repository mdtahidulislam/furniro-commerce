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

        // handle search btn
        const searchBtn = $('.search-btn');
        const searchContainer = $('.search-area');
        const searchCloseBtn = $('.search-close-btn');
        if (searchBtn) {
            $(searchBtn).on('click', function(){
                $(searchContainer).css({display: 'block'});
            });
        }
        if (searchCloseBtn) {
            $(searchCloseBtn).on('click', function(){
                $(searchContainer).css({display: 'none'});
            });
        }
        // cart popup
        const cartPopupHolder = $('.js-cart-popup-holder');
        const cartPopupCloseBtn = $('.js-cart-popup-close');
        const headerCartBtn = $('.js-header-cart-btn');
        if ($(cartPopupCloseBtn).length) {
            $(cartPopupCloseBtn).on('click', function(){
                $(this).parent().hide();
            });
        }
        if ($(headerCartBtn).length) {
            $(headerCartBtn).on('click', function(){
                $(cartPopupHolder).show();
            });
        }
        /**
         * handle add to cart button
        */
        const addToCartBtn = $('.js-add-to-cart-btn');

        if ($(addToCartBtn).length) {
            $(addToCartBtn).on('click', function(){
                let addToCartForm = document.querySelector('form[action$="/cart/add"]');
                let formData = new FormData(addToCartForm);
                let rtContainer = $('.js-cart-container');

                fetch(window.Shopify.routes.root + 'cart/add.js', {
                    method: 'POST',
                    body: formData
                })
                .then(res => {
                    return res.json();
                })
                .then(cartDta => {
                    if (cartDta) {
                        $(cartPopupHolder).show();
                    }
                    fetch(window.location.pathname + "?section_id=main-cart-items")
                    .then(res => res.text())
                    .then(res => {
                        rtContainer.html(res);
                    })
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            });
        }

        /**
         * cart page 
         * delete btn 
        */

        if ($('.js-cart-delete-btn').length) {
            $(document).on('click', '.js-cart-delete-btn', function(e) {
                // prevent anchor default behaviour
                e.preventDefault();
            
                // get line item & key
                const cartLine = $(this).parents('tr.js-cart-line').attr('data-index');
                const cartLineKey = $(this).parents('tr.js-cart-line').attr('data-key');
                const loadingOverlay = $(this).parents('.js-cart-line').find('.js-loading-overlay');
                const price = $(this).parents('.js-cart-line').find('.price');
            
                // container where to rerender section
                let rtContainer = $('.js-cart-container');

                // loading effect
                $(loadingOverlay).removeClass('hidden');
                $(price).empty();
            
                /**
                 * post request to delete line
                 * dynamic url
                 * pass line index
                 * set to quantity 0
                 * get request to render static section
                */
                fetch(window.Shopify.routes.root + 'cart/change.js', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        line: cartLine,
                        quantity: 0
                    })
                })
                .then(res => res.json())
                .then(res => {
                    fetch(window.location.pathname + "?section_id=main-cart-items")
                    .then(res => res.text())
                    .then(res => {
                        rtContainer.html(res);
                    })
                    .finally(()=>{
                        // loading effect
                        $(loadingOverlay).addClass('hidden');
                    });
                });
            });
        }
        
        if ($('.js-cart-popup-delete-btn').length) {
            $(document).on('click', '.js-cart-popup-delete-btn', function(e) {
                // prevent anchor default behaviour
                e.preventDefault();
            
                // get line item & key
                const cartLine = $(this).parents('tr.js-cart-line').attr('data-index');
                const cartLineKey = $(this).parents('tr.js-cart-line').attr('data-key');
                const loadingOverlay = $(this).parents('.js-cart-line').find('.js-loading-overlay');
                const price = $(this).parents('.js-cart-line').find('.price');
            
                // container where to rerender section
                let rtContainer = $('.js-cart-container');

                // loading effect
                $(loadingOverlay).removeClass('hidden');
                $(price).empty();
            
                /**
                 * post request to delete line
                 * dynamic url
                 * pass line index
                 * set to quantity 0
                 * get request to render static section
                */
                fetch(window.Shopify.routes.root + 'cart/change.js', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        line: cartLine,
                        quantity: 0
                    })
                })
                .then(res => res.json())
                .then(res => {
                    fetch(window.location.pathname + "?section_id=cart-popup")
                    .then(res => res.text())
                    .then(res => {
                        rtContainer.html(res);
                    })
                    .finally(()=>{
                        // loading effect
                        $(loadingOverlay).addClass('hidden');
                    });
                });
            });
        }
        // quantity and price update
        if ($('.js-cart-qty').length) {
            $(document).on('change', '.js-cart-qty', function (e) {
                // Prevent anchor default behavior
                e.preventDefault();
            
                // Get line item & key
                const cartLine = $(this).parents('.js-cart-line');
                const cartLineKey = cartLine.attr('data-key');
                const updatedQty = $(this).val();
                const loadingOverlay = $(this).parents('.js-cart-line').find('.js-loading-overlay');
                const price = $(this).parents('.js-cart-line').find('.price');

                // Container where to re-render section
                let rtContainer = $('.js-cart-container');
            
                // Create the data object for the Fetch API request
                const data = {
                    updates: {
                        [cartLineKey]: updatedQty
                    }
                };

                // loading effect
                $(loadingOverlay).removeClass('hidden');
                $(price).empty();
            
                // Send a POST request to update the cart
                fetch('/cart/update.js', {
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'X-Requested-With': 'XMLHttpRequest'
                    },
                    body: JSON.stringify(data)
                })
                .then(res => {
                    return res.json();
                })
                .then(cartData => {
                    // Check if the cart update was successful
                    if (cartData) {
                        // After successfully updating the cart, re-render the cart section
                        // fetch('/cart', {
                        //     headers: {
                        //         'X-Requested-With': 'XMLHttpRequest'
                        //     }
                        // })
                        // .then(res => res.text())
                        // .then(html => {
                        //     $('.price').empty();
                        //     $('.price').text($(html).find('.price').text());
                        // })
                        
                        fetch(window.location.pathname + "?section_id=main-cart-items")
                        .then(res => res.text())
                        .then(res => {
                            rtContainer.html(res);
                        })
                        .catch(error => {
                            console.error('Error re-rendering cart section:', error);
                        })
                        .finally(() => {
                            // loading effect
                            $(loadingOverlay).addClass('hidden');
                        });
                    } else {
                        // Handle errors in the cart update
                        console.error('Error updating cart:', cartData);
                    }
                })
                .catch(error => {
                    console.error('Error updating cart:', error);
                });
            });  
        }
    });
})(jQuery);