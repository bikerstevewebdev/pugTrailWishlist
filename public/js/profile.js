console.log('Profile JS File has been Loaded!!!')
let editing = false
let uploading = false

$('#profile_pic').on('click', e => {
    e.preventDefault()
    console.log(e.target.id, ' has been hit')
    $('#upload_pic').addClass('visible');
})

$('.profile #begin_edit').on('click', (e) => {
    e.preventDefault()
    console.log(e.target.id, ' has been hit')
    if(!editing){
        $('#edit_profile').addClass('visible');
        $('.profile #begin_edit').text("Stop Edit");
        editing = true
    }else{
        $('#edit_profile').removeClass('visible');
        $('.profile #begin_edit').text("Edit Profile");
        editing = false
    }
})
$('.profile #form_pic_edit').on('click', (e) => {
    e.preventDefault()
    console.log(e.target.id, ' has been hit')
    $('#upload_pic').addClass('visible');
})

$('#upload_pic').on('click', (e) => {
    e.preventDefault()
    setTimeout(() => {
        console.log($(this).attr('class'), ' has been hit')
    }, 500)
    $('#upload_pic').removeClass('visible')
})
$('.s3_upload').on('click', e => {
        // e.preventDefault()
        e.stopPropagation()
    }
)
$('#close_s3').on('click', (e) => {
    e.preventDefault()
    console.log(e.target.id, ' has been hit')
    $('.profile #upload_pic').removeClass('visible')
})

$('form#edit_profile').on('submit', e => {
    e.preventDefault()
    console.log(e.target.id, ' form has been submitted! Let\s see what happens.....')
    $.ajax({
          type: 'POST'
        , url: '/users/profile'
        , contentType: 'application/json'
        , data: JSON.stringify({
              username: $('input[name="username"]').val()
            , email: $('input[name="email"]').val()
            , fullname: $('input[name="fullname"]').val()
            , profile_pic: $('input[name="profile_pic"]').val()
        })
        , success: (data, status) => {
            if(status === 'success'){
                console.log('Successful Profile Update')
                alert('Your profile changes have been saved!')
                window.location.reload()
            }else{
                console.log('Error sending profile edits to the back', status)
                alert('Something went terribly wrong. We are so sorry to tell you that your request did not make it back in one piece. Please try sending it again and cross your fingers next time.')
                window.location.reload()
            }
        }
        , error: err => {
            console.log('Error with profile edits POST: ', err)
            alert('Well this is awkward.... we couldn\'t quite send your stuffs back too get updated sooooo uh yeah try again maybe? K BYE')
            window.location.reload()
        }
    })
})