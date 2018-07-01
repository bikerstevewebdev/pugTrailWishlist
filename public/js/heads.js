console.log('heads.js loaded')
let hamOpen = false
$(".ham-container").on("click", function() {
    console.log("ham container clicked")
    if(hamOpen){
        $(".ham").removeClass("open")
        $(".ham-menu").removeClass("open")
    }else{
        $(".ham").addClass("open")
        $(".ham-menu").addClass("open")
    }
    hamOpen = !hamOpen
    return
})
