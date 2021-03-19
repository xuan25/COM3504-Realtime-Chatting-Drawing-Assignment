$(document).ready(() => {
  $('#searchBtn').click(() => {
    searchText = $('#searchBox').val();
    url = null

    if(searchText === ''){
      url = '/img/meta'
    }
    else{
      url = `/search?q=${searchText}`
    }

    $.ajax({
      url: url,
      type: "GET",
      success: function (response) {
        console.log(JSON.stringify(response));

        if(response.code == 0){
          roomsContainer = $('#roomsContainer')
          roomsContainer.empty();
          for(var img of response.data.list){
            roomsContainer.append(`
              <div class="card m-3 item" style="width: 18rem;">
                <img src="/img/raw/${img.id}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${img.title}</h5>
                  <p class="card-title">Created by ${img.author}</p>
                  <p class="card-text">Description: ${img.desc}</p>
                  <a href="/join/${img.id}" class="btn btn-primary">Join</a>
                </div>
              </div>
            `)
          }
        }

      },
      error: function (xhr, status, error) {
        console.log(error);
      },
    });
    
  });
});