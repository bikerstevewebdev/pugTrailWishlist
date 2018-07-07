console.log('We have a main.js')
const difficulties = {
    green: 'Family Friendly'
    , greenBlue: 'Easy Going'
    , blue: 'Moderate'
    , blueBlack: 'Somewhat Difficult'
    , black: 'Advanced'
    , dblack: 'Extremely Difficult'
}
//GET RID OF YOUR DANG KEY BEFORE YOU COMMIT
var API_KEY = 'NOPE GO GET YOUR OWN'
///////////
///////////


///////////
///////////


// let userTrails = []
// $(document).ready(() => {
//     if('geolocation' in navigator){
//         navigator.geolocation.getCurrentPosition(position => {
//             let userLat = position.coords.latitude
//             let userLng = position.coords.longitude
//             $.get(`https://www.hikingproject.com/data/get-trails?lat=${userLat}&lon=${userLng}&maxDistance=10&key=${API_KEY}`, function( data ) {
//                 console.log(data)
//                 $.each(data.trails, (i, trail) => {
//                     let noImg = !trail.imgMedium.length
//                     let img = noImg ?  '/static/images/no-image.jpg' : trail.imgMedium
//                     let bgPosition = noImg ? 'center' : 'top center'
//                     let bgSize = noImg ? "contain" : "cover"
//                     $('section.trails-list').append(
//                         $("<div class='trail'>")
//                             .append($(`<a href='/trails/${trail.id}'>`)
//                                 .append($(`<div class="trail-img" style="background-image: url(${img}); background-position: ${bgPosition}; background-size: ${bgSize}" alt=${trail.name} />`))
//                             )
//                             .append($(`<div class="trail-info">`)
//                                 .append($(`<h3>${trail.name}</h3>`))
//                                 .append($(`<p class="location">${trail.location}</p>`))
//                                 .append($(`<div class="details">`)
//                                     .append($(`<p>${difficulties[trail.difficulty]}</p>`))
//                                     .append($(`<p class="length">${trail.length} miles</p>`))
//                                 )
//                             )
//                     )
//                 })

//             })
//         })
//     }
// })


$(document).ready(() => {
    if("geolocation" in navigator){
        navigator.geolocation.getCurrentPosition(position => {
            let userLng = position.coords.longitude 
                , userLat = position.coords.latitude
            console.log("Latitude: ", userLat, "Longitude: ", userLng)
        })
    }else {
        console.log('Location Not Supported')
    }
})

$('.star').on('click', e => {
    e.preventDefault()
    let $starId = e.target.id/1
    console.log($starId)
    $.ajax({
        type: 'post'
        , url: `/users/wishlist/add/${$starId}`
        , data: JSON.stringify({
            id: $starId
        })
        , contentType: 'application/json'
        , success: function(data, status) {
            console.log('Login Success: ', data, status)
            alert(`Trail Added to Wishlist!`)
            window.location.reload(true)
        }
        , error: function(err){
            console.log('Login Error: ', err.responseJSON.message)
            alert(err.responseJSON.message)
        }
    })
})
$('.mark_completed').on('click', e => {
    e.preventDefault()
    let $markId = e.target.id/1
    console.log($markId)
    $('#completed_form_container').addClass('visible')
})
$('#cancel_completed_form').on('click', e => {
    e.preventDefault()
    console.log(e.target.id, 'has been hit')
    $('#completed_form_container').addClass('visible')
})

$('#completed_form').on('submit', e => {
    e.preventDefault()
    // $.ajax({
        //     type: 'post'
        //     , url: `/users/wishlist/completed/${$markId}`
        //     , data: JSON.stringify({
            //         id: $starId
            //         , date_completed: $dateCompleted
            //         , company: $company
            //         , rating: $user_rating
            //         , time_completed_in: $time
            //         , notes: $trip_notes
            //     })
            //     , contentType: 'application/json'
            //     , success: function(data, status) {
                //         console.log('Login Success: ', data, status)
                //         alert(`Trail Added to Wishlist!`)
    //         window.location.reload(true)
    //     }
    //     , error: function(err){
        //         console.log('Login Error: ', err.responseJSON.message)
        //         alert(err.responseJSON.message)
        //     }
        // })
    
})
