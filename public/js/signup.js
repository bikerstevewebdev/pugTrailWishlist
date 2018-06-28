console.log('signup.js is loaded')
$(document).ready( function(){
    var $username = $('.username.signup')
    var $fullname = $('.fullname.signup')
    var $email = $('.email.signup')
    var $password = $('.password.signup')
    $('form#signup').on('submit', function(e){
        e.preventDefault()
        console.log('Event Object: ', e)
        console.log('Username', $username.val(), 'Email', $email.val(), 'Password', $password.val(), 'Fullname', $fullname.val())
        $.ajax({
            type: 'POST'
            , url: '/login'
            // , processData: false
            , data: JSON.stringify({
                fullname: $fullname.val()
                , username: $username.val()
                , email: $email.val()
                , password: $password.val()
            })
            , contentType: 'application/json'
            , success: function(data, status) {
                alert("Data: " + data + "\nStatus: " + status)
            }
            , error: function(err){
                console.log(err)
            }
        })
    })
})