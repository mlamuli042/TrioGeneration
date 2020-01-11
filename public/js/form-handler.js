$(function () {
  $("#order-form").submit(function (event) {
    event.preventDefault();

    $form = $(this);

    $.post(document.location.url, $(this).serialize(), function (data) {
      $feedback = $("<div>").html(data).find(".feedback");

      $form.prepend($feedback);
      $feedback.fadeIn();
      /* $form.prepend($feedback)[0].reset(); */
    });

     //get form values
     const subject = $('#name').val().trim();
     const email = $('#email').val().trim();
     const phone = $('#phone').val().trim();
     const address = $('#address').val().trim();
     const color = $('#color').val().trim();
     const size = $('#size').val().trim();
 
 
     //defining text
     const text = 'I need a(n) ' + size + ' size ' + color + ' T-shirt.' + ' You can reach me at, ' + String(phone);
 
 
     const form_data = {
       subject,
       email,
       text
     }
 
     $.post('/email', form_data, function () {
       console.log('Server received data');
     });

  });
})


