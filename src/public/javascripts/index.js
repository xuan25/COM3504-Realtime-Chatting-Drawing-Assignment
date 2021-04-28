/**
 * Onload
 */
$(document).ready(() => {
  // search button clicked
  $('#searchBtn').click(() => {
    searchText = $('#searchBox').val();
    url = null

    // search or not
    if(searchText === ''){
      url = '/img/meta'
    }
    else{
      url = `/search?q=${searchText}`
    }

    loadImagesFrom(url)
  });

  loadImagesFrom('/img/meta');
});

/**
 * Async Load images from a Url
 * @param url load from a url (/img/meta or /search)
 */
function loadImagesFrom(url){
  // ajax request
  $.ajax({
    url: url,
    type: "GET",
    success: function (response) {

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
}
/**
 * upload the image by the internet link
 * @param imgUrl  image url
 * @param title title
 * @param author author
 * @param description description
 */
 function uploadByUrl(imgUrl, title, author, description){
  doUpload(title, author, description, "http", imgUrl)
}
/**
 * upload the image by data Url
 * @param  data image data
 * @param  title title
 * @param  author author
 * @param  description description
 */
function uploadByData(data, title, author, description){
  doUpload(title, author, description, "data", data)
}

/**
 * 
 * Get all the information required for submission and submit
 * @param  title title
 * @param  author author
 * @param  description description
 * @param  imgType image type
 * @param  img image
 */
 function doUpload(title, author, description, imgType, img){
  $("#submitBtn").prop("disabled", true);
  data = { title: title, author: author, desc: description, imgType: imgType, img: img }
  json = JSON.stringify(data);

  $.ajax({
    url: "/upload",
    type: "POST",
    data: json,

    contentType: "application/json",
    success: function (response) {
      if(response.code == 0){
        successUrl = `/join/${response.data.imgId}`
        window.location.href = successUrl;
      }
      else{
        $("#submitBtn").prop("disabled", false);
        console.log("Upload failed");
      }
      console.log(JSON.stringify(response));
    },
    error: function (xhr, status, error) {
      $("#submitBtn").prop("disabled", false);
      console.log(error);
    },
  });
}