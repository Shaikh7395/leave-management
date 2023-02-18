function previewFile() {
    var preview = document.querySelector('.profile-pic');
    var file = document.querySelector('.profileEdit[type=file]').files[0];
    var reader = new FileReader();

    reader.addEventListener("load", function () {
       preview.src = reader.result;
    }, false);

    if (file) {
       reader.readAsDataURL(file);
    }
 }
 // $(function () {
 //    $('#profile-image1').on('click', function () {
 //       $('#profile-image-upload').click();
 //    });
 // });