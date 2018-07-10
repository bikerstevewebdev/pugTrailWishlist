$('#completed_form').on('submit', e => {
    e.preventDefault()
    let completion_time = ($('#hours').val()*60*60) + ($('#hours').val()*60)
    let familyFriendly = $('#ff_yes').prop('checked') ? true : false
    let dogFriendly = $('#df_yes').prop('checked') ? true : false
    let date_completed = new Date($('#date_completed').val()).getTime()
    console.log(JSON.stringify({
                        id: $('#completed_form>h1').attr('id')/1
                        , date_completed: date_completed
                        , company: $('#company').val()
                        , rating: $('#user_rating').val()
                        , time_completed_in: completion_time
                        , notes: $('#trip_notes').val()
                        , family_friendly: familyFriendly
                        , dog_friendly: dogFriendly
                        , traffic: $('#traffic').val()
                    }))
    // $.ajax({
    //         type: 'post'
    //         , url: `/users/wishlist/completed/${$markId}`
    //         , data: JSON.stringify({
    //                 id: $('#completed_form>h1').attr('id')/1
    //                 , date_completed: $('#date_completed').val()
    //                 , company: $('#company').val()
    //                 , rating: $('#user_rating').val()
    //                 , time_completed_in: completion_time
    //                 , notes: $('#trip_notes').val()
    //                 , family_friendly: familyFriendly
    //                 , dog_friendly: dogFriendly
    //                 , traffic: $('#traffic').val()
    //             })
    //         , contentType: 'application/json'
    //         , success: function(data, status) {
    //                 console.log('Login Success: ', data, status)
    //                 alert(`Your Journey Has Been Recorded!`)
    //                 window.location.replace('/dashboard')
    //             }
    //         , error: function(err){
    //                 console.log('Login Error: ', err.responseJSON.message)
    //                 alert(err.responseJSON.message)
    //             }
    //     })
    
})


$(document).on('input', '#user_rating', function(e) {
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