console.log('search.js connected')
$('#advanced_question').on('click', function() {
    console.log('Advamc===nced Search Clicked')
    $('.form_group_advanced').addClass('visible')
    $('#advanced_question').addClass('hidden')
    $('#hide_advanced').addClass('visible')
})
$('#hide_advanced').on('click', function() {
    console.log('Hide adva===nced Search Clicked')
    $('.form_group_advanced').removeClass('visible')
    $('#advanced_question').removeClass('hidden')
    $('#hide_advanced').removeClass('visible')
})
$(document).on('input', '#difficulty_slider', function(e) {
    e.preventDefault()
    console.log(e.target.value)
    switch(e.target.value/1){
        case 0:
            $(this).removeClass()
            $(this).addClass('green')
            break
            case 1:
            $(this).removeClass()
            $(this).addClass('greenBlue')
            break
            case 2:
            $(this).removeClass()
            $(this).addClass('blue')
            break
            case 4:
            $(this).removeClass()
            $(this).addClass('blueBlack')
            break
            case 5:
            $(this).removeClass()
            $(this).addClass('black')
            break
            case 6:
            $(this).removeClass()
            $(this).addClass('dblack')
            break
            default:
            $(this).removeClass()
            $(this).addClass('random')
    }
})
// function geocode(){
//     let location = $('input[name="location"]').val()
//     let location = $('input[name="max-distance"]').val()
//     let location = $('input[name="difficulty"]')
// }