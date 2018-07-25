let idToDelete = 0
$('.recycle_trail').on('click', e => {
    e.preventDefault()
    console.log(e.target.id, 'Has been HIT')
    let trailID = e.target.id.split('_')[1]
    idToDelete = trailID    
    $('.confirm_delete_modal').addClass('open')
})
$('#dont_delete').on('click', e => {
    e.preventDefault()
    console.log(e.target.id, 'Has been HIT')
    idToDelete = 0
    $('.confirm_delete_modal').removeClass('open')
})
$('#confirm_delete').on('click', e => {
    e.preventDefault()
    console.log(e.target.id, 'Has BEEN CLICKEDYCLICK CLICKED YO. It\'s ListeningStateChangedEvent (that was supposed to be "late" but nope, said JavaScript), please excuse this lingo')
    console.log('Parent ID: ', idToDelete, 'TARGET: ', e.target)
    $.ajax({
          type: 'DELETE'
        , url: `/users/wishlist/${idToDelete}`
        , success: (data, status) => {
            if(status === 'success'){
                console.log('IT"S BEEN REMOVED')
                alert('Your Trail has been Removed from your Wishlist')
                idToDelete = 0
                window.location.reload()
            }else{
                alert('OOPSIES! Something went wrong with your request to remove the trail from your wishlist. Please try again!')
                idToDelete = 0
                window.location.reload()
            }
        }
        , error: err => {
            console.log('Error sending request to remove trail from wishlist: ', err.responseJSON.message)
            alert('OOPSIES! Something went wrong with your request to remove the trail from your wishlist. Please try again!')
            idToDelete = 0
            window.location.reload()
        }
    })
})

