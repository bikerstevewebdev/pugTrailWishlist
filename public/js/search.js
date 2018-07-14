console.log('search.js connected')
$('#advanced_question').on('click', function() {
    console.log('Advamc===nced Search Clicked')
    $('.form_group.advanced').addClass('visible')
    $('#advanced_question').addClass('hidden')
    $('#hide_advanced').addClass('visible')
})
$('#hide_advanced').on('click', function() {
    console.log('Hide adva===nced Search Clicked')
    $('.form_group.advanced').removeClass('visible')
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
            $('span#diff').text('Family Friendly')
            break
        case 1:
            $(this).removeClass()
            $(this).addClass('greenBlue')
            $('span#diff').text('Easy Going')
            break
        case 2:
            $(this).removeClass()
            $(this).addClass('blue')
            $('span#diff').text('Moderate')
            break
        case 3:
            $(this).removeClass()
            $(this).addClass('any')
            $('span#diff').text('Any')
            break
        case 4:
            $(this).removeClass()
            $(this).addClass('blueBlack')
            $('span#diff').text('Somewhat Difficult')
            break
        case 5:
            $(this).removeClass()
            $(this).addClass('black')
            $('span#diff').text('Advanced')
            break
        case 6:
            $(this).removeClass()
            $(this).addClass('dblack')
            $('span#diff').text('Extremely Difficult')
            break
        default:
            console.log('Invalid value selected for Difficulty')
            return
    }
})
$(document).on('input', '#rating_slider', function(e) {
    e.preventDefault()
    console.log(e.target.value)
    switch(e.target.value/1){
        case 1:
            $('.two_stars svg, .three_stars svg, .four_stars svg, .five_stars svg').removeClass()
            $('.one_star svg').addClass('gold')
            break
        case 2:
            $('.three_stars svg, .four_stars svg, .five_stars svg').removeClass()
            $('.two_stars svg').addClass('gold')
            break
        case 3:
            $('.four_stars svg, .five_stars svg').removeClass()
            $('.three_stars svg, .two_stars svg').removeClass().addClass('gold')
            break
        case 4:
            $('.five_stars svg').removeClass()
            $('.four_stars svg, .two_stars svg, .three_stars svg').removeClass().addClass('gold')
            break
        case 5:
            $('.five_stars svg').addClass('gold')
            $('.three_stars svg, .four_stars svg, .two_stars svg').removeClass().addClass('gold')
            break
        default:
            return
    }
})

$('form.search').on('submit', e => {
    // e.preventDefault()
    console.log('Search e.target Obj', e.target)
})
$('#random').on('click', e => {
    e.preventDefault()
    console.log('Random hit, let\'s be sure:', e.target.id )
    if('geolocation' in navigator){
        navigator.geolocation.getCurrentPosition(position => {
            let userLat = position.coords.latitude
            let userLng = position.coords.longitude
            $.ajax({
                type: 'POST'
                , url: '/trails/random'
                , data: JSON.stringify({
                    userLat
                    , userLng
                })
                , contentType: 'application/json'
                , success: function(data, status) {
                    console.log('Login Success: ', data, status)
                    window.location.replace(`/trails/${data.trail_id}`)
                }
                , error: function(err){
                    console.log('Login Error: ', err.responseJSON.message)
                    alert(err.responseJSON.message)
                }
            })
            // $.get(`https://www.hikingproject.com/data/get-trails?lat=${userLat}&lon=${userLng}&maxDistance=10&key=${API_KEY}`, function( data ) {
            //     console.log(data)
            //     $.each(data.trails, (i, trail) => {
            //         let noImg = !trail.imgMedium.length
            //         let img = noImg ?  '/static/images/no-image.jpg' : trail.imgMedium
            //         let bgPosition = noImg ? 'center' : 'top center'
            //         let bgSize = noImg ? "contain" : "cover"
            //         $('section.trails-list').append(
            //             $("<div class='trail'>")
            //                 .append($(`<a href='/trails/${trail.id}'>`)
            //                     .append($(`<div class="trail-img" style="background-image: url(${img}); background-position: ${bgPosition}; background-size: ${bgSize}" alt=${trail.name} />`))
            //                 )
            //                 .append($(`<div class="trail-info">`)
            //                     .append($(`<h3>${trail.name}</h3>`))
            //                     .append($(`<p class="location">${trail.location}</p>`))
            //                     .append($(`<div class="details">`)
            //                         .append($(`<p>${difficulties[trail.difficulty]}</p>`))
            //                         .append($(`<p class="length">${trail.length} miles</p>`))
            //                     )
            //                 )
            //         )
            //     })
            // })
        })
    }else if($('input[name="location"]').val()){
        $.ajax({
            type: 'POST'
            , url: '/trails/random'
            , data: JSON.stringify({
                location: $('input[name="location"]').val()
            })
            , contentType: 'application/json'
            , success: function(data, status) {
                console.log('Login Success: ', data, status)
                window.location.replace(`/trails/${data.trail_id}`)
            }
            , error: function(err){
                console.log('Login Error: ', err.responseJSON.message)
                alert(err.responseJSON.message)
                
            }
        })
    }else{
        alert('Please allow location services or enter a location in the Address field.')
    }
})