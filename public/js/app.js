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

    function saveSelectedArea(data){
        // const response = await fetch('/doctor/save-selected-area', {
        //     method: 'POST',
        //     headers: {
        //       'Content-Type': 'application/json'
        //     },
        //     body: data
        //   });
        // return response.json();

        fetch('/doctor/save-selected-area', {
            method: "POST",
            body: JSON.stringify(data),
            headers: {"Content-type": "application/json; charset=UTF-8"}
        })
        .then(response => response.json()) 
        .then(json => console.log(json))
        .catch(err => console.log(err));
    }

    $('#btn_next_img').on('click', function(){
        fetch('/doctor/save-selected-area', {
            method: "GET",
            body: JSON.stringify({a:'b'}),
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
              },
        })
        .then(response => response.json()) 
        .then(json => console.log(json))
        .catch(err => console.log(err));

        pack_via_metadata('json').then(function(data) {
            // console.log(JSON.stringify(data.join('')).replace('"',''))
            // saveSelectedArea({selected_area:'data'})
            // .then(data => {
            //     console.log(data); // JSON data parsed by `data.json()` call
            //   });
            
        });
    });

})
