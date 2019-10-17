$(document).ready(function(){
    $("#carouselButton").click(function(){
        if ($("#carouselButton").children("span").hasClass('fa-pause')) {
            $("#mycarousel").carousel('pause');
            $("#carouselButton").children("span").removeClass('fa-pause');
            $("#carouselButton").children("span").addClass('fa-play');
        }
        else if ($("#carouselButton").children("span").hasClass('fa-play')){
            $("#mycarousel").carousel('cycle');
            $("#carouselButton").children("span").removeClass('fa-play');
            $("#carouselButton").children("span").addClass('fa-pause');                    
        }
    });

    $("#reserveButton").click(function(){
        $("#reserveButton").removeAttr( "data-target" );
        $("#reserveButton").removeAttr( "data-toggle" );
        $('#reserveModal').modal('show');
    });

    $("#loginButton").click(function(){
        $("#loginButton").removeAttr( "data-target" );
        $("#loginButton").removeAttr( "data-toggle" );
        $('#loginModal').modal('show');
    });

});  