console.log('signup.js is loaded')
$(document).ready( function(){
    $('form#signup').on('submit', function(e){
        e.preventDefault()
        console.log('Event Object: ', e)
        let username = $('.username.signup').val()
        let fullname = $('.fullname.signup').val()
        let email = $('.email.signup').val()
        let password = $('.password.signup').val()
        console.log('Username', username, 'Email', email, 'Password', password, 'Fullname', fullname)
        $.post('/users',
            {
                "fullname": fullname
                , "username": username
                , "email": email
                , "password": password
            }
            , function(data, status) {
                alert("Data: " + data + "\nStatus: " + status)
            })
    })
})