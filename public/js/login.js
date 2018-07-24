console.log('Login JS File Loaded')
$(document).ready( function(){
    var $username = $('.username.login')
    var $password = $('.password.login')
    $('form#login').on('submit', function(e){
        e.preventDefault()
        console.log('Event Object: ', e)
        console.log('Username', $username.val(), 'Password', $password.val())
        $.ajax({
              type: 'POST'
            , url: '/auth/login'
            , data: JSON.stringify({
                username: $username.val()
                , password: $password.val()
            })
            , contentType: 'application/json'
            , success: function(data, status) {
                console.log('Login Success: ', data, status)
                window.location.replace('/users/dashboard')
            }
            , error: function(err){
                console.log('Login Error: ', err.responseJSON.message)
                alert(err.responseJSON.message)
                
            }
        })
    })
})