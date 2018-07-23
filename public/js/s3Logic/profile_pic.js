let state = {
      file: ''
    , filename: ''
    , filetype: ''
}

function handlePhoto(event){
    const reader = new FileReader()
        , file   = event.target.files[0]
    console.log(file)
    reader.onload = photo => {
          state.file     = photo.target.result
        , state.filename = file.name
        , state.filetype = file.type
        $('img.file-preview').addClass('file_present').attr('src', photo.target.result)
    }
    reader.readAsDataURL(file)
}

function uploadPhoto(picObj, type){
    console.log(state)
    $.ajax({
        type: 'POST'
        , url: '/users/profile/pictures'
        , data: JSON.stringify({
            photo: picObj
            , type
        })
        , contentType: 'application/json'
        , success: (data, status) => {
            if(status === 'success'){
                console.log('Huurraayy the photo was uploaded!')
                alert('Your Profile Picture was Successfully Changed!')
                window.location.reload()
            }else{
                console.log('Oops! Something went wrong! Sent something to the backend but there was a problem with a status code of ', status)
            }
        }
        , error: (err) => {
            console.log('Error uploading Picture: ', err)
            alert('There was a problem sending your information to the back. Please try again.')
            window.location.reload()
        }
    })
}

$('#file-input').change(e => {
    e.preventDefault()
    console.log(e.target.id, ' has changed! Hopefully a photo file.')
    handlePhoto(e)
})
$('#visible_s3_btn').on('click', e => {
    e.preventDefault()
    console.log(e.target.id, ' has been clicked! Hopefully this works.')
    uploadPhoto(state, 'progress')
})
