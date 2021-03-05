$(document).ready(function(){
    var img_type = $('#img_type');
    var div_img_level = $('#div_img_level');
    var img_level = $('#img_level')
    // div_img_level.attr("hidden", true);

    img_level.attr("disabled", true)
    img_type.on("change", () => {
        if (img_type.val() == "normal") {
            img_level.attr("disabled", true)
        } else {
            img_level.attr("disabled", false)
        }
    })

    var today = new Date();
    var date = today.getDate() + '-' + (today.getMonth()+1) + '-' + today.getFullYear();
    var project_name = $('#project_name')
    project_name.text('Ngày: ' + date)
})
