$(document).ready(function(){
  $('.delete-award').on('click', function(e){
    $target = $(e.target);
    const id = $target.attr('data-id');
    $.ajax({
      type:'DELETE',
      url: '/awards/'+id,
      success: function(response){
        alert('Deleting Award');
        window.location.href='/';
      },
      error: function(err){
        console.log(err);
      }
    });
  });
});
