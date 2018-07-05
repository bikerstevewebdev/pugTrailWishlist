console.log('heads.js loaded')
let hamOpen = false
let burgerOpen = false
$(".ham_container").on("click", function() {
    console.log("ham container clicked")
    if(hamOpen){
        $(".ham").removeClass("open")
        $(".ham_menu").removeClass("open")
    }else{
        $(".ham").addClass("open")
        $(".ham_menu").addClass("open")
    }
    hamOpen = !hamOpen
    return
})
$(".burger_container").on("click", function() {
    console.log("burger container clicked")
    if(burgerOpen){
        $(".burger_container").removeClass("open")
    }else{
        $(".burger_container").addClass("open")
    }
    burgerOpen = !burgerOpen
    return
})
