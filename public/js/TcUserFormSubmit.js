/**
 * @author - Chandra Bhavanasi
 */
var form = $('form');
$('#submitUserInfo').click(function(e) {
    e.preventDefault();
    $.ajax({
        url: 'saveUserInfo',
        type: 'post',
        dataType: 'json',
        data: form.serialize(),
        success: function(data) {
             console.log(data);
             alert("You're good to go");


        }
    });
});
