const service_url = 'https://kgsearch.googleapis.com/v1/entities:search';
const apiKey= 'AIzaSyAG7w627q-djB4gTTahssufwNOImRqdYKM';

/**
 * Init kg
 */
function initKg(){
    // Init params
    kgConfig = {
        'limit': 10,
        'languages': ['en'],
        'maxDescChars': 100,
        'selectHandler': kgItemSelected,
    }
    KGSearchWidget(apiKey, document.getElementById("kg-input"), kgConfig);

    // Handling KG type updates
    $("#kg-type").change(function(){
        let type = $("#kg-type").val();
        if (type) {
            kgConfig = {
                'limit': 10,
                'languages': ['en'],
                'types': [type],
                'maxDescChars': 100,
                'selectHandler': kgItemSelected,
            }
        }
        else {
            kgConfig = {
                'limit': 10,
                'languages': ['en'],
                'maxDescChars': 100,
                'selectHandler': kgItemSelected,
            }
        }
        KGSearchWidget(apiKey, document.getElementById("kg-input"), kgConfig);
    });
}

/**
 * callback called when an element in the widget is selected
 * @param event the Google Graph widget event {@link https://developers.google.com/knowledge-graph/how-tos/search-widget}
 */
function kgItemSelected(event){
    let row = event.row;
    console.log(row)
    showKgTag(row)
}

/**
 * show a kg tag in the list
 * @param data kg data
 */
function showKgTag(data){
    $('#kg-tags').append(
        $(`
            <div class='card mb-1 border-3' style="border-color: ${inkColor}">
                <div class="card-body">
                    <h3>${data.name}</h3>
                    <h6>${data.description}</h6>
                    <div>${data.rc}</div>
                    <div>
                        <a href="${data.qc}" target="_blank">
                            Link to Webpage
                        </a>
                    </div>
                </div>
            </div>
        `)
    )
}
