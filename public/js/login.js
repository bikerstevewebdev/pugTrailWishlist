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
            , url: '/login'
            // , processData: false
            , data: JSON.stringify({
                username: $username.val()
                , password: $password.val()
            })
            , contentType: 'application/json'
            , success: function(data, status) {
                // alert("Data: " + data + "\nStatus: " + status)
                // $.get('/dashboard')
                console.log(data, status)
                window.location.replace('/dashboard')
            }
            , error: function(err){
                console.log(err)
            }
        })
    })
})