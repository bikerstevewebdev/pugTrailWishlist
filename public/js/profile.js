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
        e.preventDefault()
        e.stopPropagation()
    }
)
$('#close_s3').on('click', (e) => {
    e.preventDefault()
    console.log(e.target.id, ' has been hit')
    $('.profile #upload_pic').removeClass('visible')
})
