$('.recycle_trail').on('click', e => {
    e.preventDefault()
    console.log(e.target.id, 'Has BEEN CLICKEDYCLICK CLICKED YO. It\'s ListeningStateChangedEvent (that was supposed to be "late" but nope, said JavaScript), please excuse this lingo')
    let trailID = e.target.id.split('_')[1]
    console.log('Parent ID: ', trailID, 'TARGET: ', e.target)
    $.ajax({
          type: 'DELETE'
        , url: `/users/wishlist/${trailID}`
        , success: (data, status) => {
            if(status === 'success'){
                console.log('IT"S BEEN REMOVED')
                alert('Your Trail has been Removed from your Wishlist')
                window.location.reload()
            }else{
                alert('OOPSIES! Something went wrong with your request to remove the trail from your wishlist. Please try again!')
                window.location.reload()
            }
        }
        , error: err => {
            console.log('Error sending request to remove trail from wishlist: ', err.responseJSON.message)
            alert('OOPSIES! Something went wrong with your request to remove the trail from your wishlist. Please try again!')
            window.location.reload()
        }
    })
})