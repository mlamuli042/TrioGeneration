$(function() {
  $("#changePassword").submit( function(event){
    event.preventDefault();

    $form = $(this);

    $.post(document.location.url, $(this).serialize(), function(data){
      $feedback = $("<div>").html(data).find(".form-feedback");

      $form.preprnd($feedback);
    });
  }); 
})



