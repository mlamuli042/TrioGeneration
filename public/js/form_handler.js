$(function () {
  $("#order-form").submit(function (event) {
    event.preventDefault();

    $form = $(this);

    $.post(document.location.url, $(this).serialize(), function(data){
      $feedback = $("<div>").html(data).find(".error-feedback");

      $form.prepend($feedback);
      $feedback.fadeIn();
      /* $form.prepend($feedback)[0].reset(); */  
    });

  });
})