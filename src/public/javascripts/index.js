$(document).ready(() => {
  $('#searchBtn').click(() => {
    searchText = $('#searchBox').val();
    url = null

    if(searchText === ''){
      url = '/room/all'
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
          for(var room of response.data.list){
            roomsContainer.append(`
              <div class="card m-3 item" style="width: 18rem;">
                <img src="/img/raw/${room.imgId}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${room.title}</h5>
                  <p class="card-title">Created by ${room.author}</p>
                  <p class="card-text">Description: ${room.desc}</p>
                  <a href="/join/${room.id}" class="btn btn-primary">Join</a>
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