console.log('search.js connected')
const axios = require('axios')
require('dotenv').config()
const { API_KEY } = process.env
let advanced = false

$('#advanced_question').on('click', function() {
    if(advanced){
        $('form_group_advanced').removeClass('visible')
        $('#adnvanced_question').removeClass('hidden')
        $('#hide_advanced').removeClass('visible')
        advanced = false
    }else{
        $('form_group_advanced').addClass('visible')
        $('#adnvanced_question').addClass('hidden')
        $('#hide_advanced').addClass('visible')
        advanced = true
    }
})
// function geocode(){
//     let location = $('input[name="location"]').val()
//     let location = $('input[name="max-distance"]').val()
//     let location = $('input[name="difficulty"]')
// }