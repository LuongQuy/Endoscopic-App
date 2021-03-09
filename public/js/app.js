$(document).ready(function(){
    var img_type = $('#img_type');
    var div_img_level = $('#div_img_level');
    var img_level = $('#img_level')
    var select_date = $('#select_date')
    // div_img_level.attr("hidden", true);

    img_level.attr("disabled", true)
    img_type.on("change", () => {
        if (img_type.val() == "normal") {
            img_level.attr("disabled", true)
        } else {
            img_level.attr("disabled", false)
        }
    })

    var date = new Date();
    var current_date = date.getDate() + '-' + (date.getMonth()+1) + '-' + date.getFullYear();
    var project_name = $('#project_name')
    project_name.text('Ngày: ' + current_date)

    fetch('/doctor/get-images?selected_date='+current_date)
    .then(response => response.json())
    .then(data => {
        if(data.error){
            console.log(data.message)
        }else{
            $('#image_name').val(`[1] ${data.data[0].split('/')[2]}`);
            import_files_url_from_csv(data.data.join('\n'));
        }
    });

    fetch('/doctor/get-selected-dates')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        if(data.error){
            console.log(data.message)
        }else{
            let i = 0;
            let content = '';
            for (i = 0; i < data.data.length; i++){
                content += `<option value=${data.data[i]}>${data.data[i]}</option>`
            }
            select_date.html(content)
        }
    });

    async function remove_all_file() {
        var img_id = Array.from(Array(5).keys());
        console.log('_via_img_metadata[img_id]:',_via_img_metadata[img_id])
        var filename = _via_img_metadata[img_id].filename;
        
        var region_count = _via_img_metadata[img_id].regions.length;
      
        var config = {'title':'Remove File from Project' };
        var input = { 'img_index': { type:'text', name:'File Id', value:(_via_image_index+1), disabled:true, size:8 },
                      'filename':{ type:'text', name:'Filename', value:filename, disabled:true, size:30},
                      'region_count':{ type:'text', name:'Number of regions', disabled:true, value:region_count, size:8}
                    };
      
        invoke_with_user_inputs(project_file_remove_confirmed, input, config);
      }

    $('#select_date').on('change', () => {
        fetch('/doctor/get-images-by-date?selected_date=' + $('#select_date').val())
            .then(response => response.json())
            .then(async data => {
                if (data.error) {
                    alert(data.message)
                } else {
                    // console.log(data)
                    let i = 0;
                    for (i = 0; i < 30; i++){
                        project_remove_file(0);
                    }
                    update_img_fn_list()
                    
                    import_files_url_from_csv(data.data.join('\n'));
                }
            });
    })

    async function saveDiagnostic(data){
        const response = await fetch('/doctor/save-diagnostic', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
        return response.json();
    }

    $('#btn_next_img').on('click', function(){
        let selected_img_name = $('#image_name').val();
        $('#image_name').val($('li.sel').text());

        pack_via_metadata('json').then(function(data) {
            saveDiagnostic({selected_area:data, image:selected_img_name, img_type: $('#img_type').val(), img_level: $('#img_level').val()})
            .then(data => {
                console.log(data);
              });
        });

        writeLog({
            action: 'click_next_image',
            image: $('#image_name').val()
        })
    });

    $('#btn_previous_img').on('click', function(){
        let selected_img_name = $('#image_name').val();
        // alert(selected_img_name)
        $('#image_name').val($('li.sel').text());

        pack_via_metadata('json').then(function(data) {
            saveDiagnostic({selected_area:data, image:selected_img_name, img_type: $('#img_type').val(), img_level: $('#img_level').val()})
            .then(data => {
                console.log(data);
              });
        });

        writeLog({
            action: 'click_previous_image',
            image: $('#image_name').val()
        })
    });

    // write log

    async function postData(url, data){
        const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
        return response.json();
    }

    async function writeLog(data){
        return postData('/doctor/write-log', data)
    }

    $('.region_shape li').on('click', function(){
        writeLog({
            action: 'select_shape',
            image: $('#image_name').val()
        })
    });

    $('#region_canvas').on('click', function(){
        writeLog({
            action: 'click_on_image',
            image: $('#image_name').val()
        })
    })

    $('#region_canvas').on('keyup', function (event) {
        if (event.keyCode === 13) {
            writeLog({
                action: 'enter_on_image',
                image: $('#image_name').val()
            })
        }
     });

    $('#img_fn_list').on('click', event => {
        let selected_img_name = $('#image_name').val();
        // alert(selected_img_name)
        $('#image_name').val($('li.sel').text());

        pack_via_metadata('json').then(function(data) {
            saveDiagnostic({selected_area:data, image:selected_img_name, img_type: $('#img_type').val(), img_level: $('#img_level').val()})
            .then(data => {
                console.log(data);
              });
        });

        writeLog({
            action: 'click_select_image',
            image: $('#image_name').val()
        })
    });

});
