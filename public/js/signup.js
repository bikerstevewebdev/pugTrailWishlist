console.log('signup.js is loaded')
$(document).ready( function(){
    $('form#signup').on('submit', function(e){
        e.preventDefault()
        console.log('Event Object: ', e)
        let username = $('.username.signup').val()
        let email = $('.email.signup').val()
        let password = $('.password.signup').val()
        console.log('Username', username, 'Email', email, 'Password', password)
        // $.post('/users',
        //     {
        //         fullname
        //         , username
        //         , email
        //         , password
        //     }
        //     , function(data,status) {
        //         alert("Data: " + data + "\nStatus: " + status)
        //     })
    })
})