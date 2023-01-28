document.addEventListener("DOMContentLoaded", function() {

    $('.nav-link').on('click', function(){
        var tabId = $(this).data('bs-target');
        var url = $(this).data('url');
        $.ajax({
            url: url,
            success: function(data){
                $(tabId).html(data);
            }
        });
    });

});