const APIURL = "https://api.github.com/users/";
const nameInput = document.querySelector('#name');
const submitButton = document.querySelector('.submit');
const userPhoto = document.querySelector('.photo');
const userName = document.querySelector('.username');
const userBlog = document.querySelector('.blog');
const userLocation = document.querySelector('.location');
const userBio = document.querySelector('.bio');
const addRes = document.querySelector('.addRes');
const user_result = document.querySelector('.user_result');
const storageInfo = document.querySelector('.storageInfo');
/*
  This function is an event handler for pressing the submit button. First, it checks that if the username exists in the local storage,
  it will call the userInStorage function. Else, it will send a request to get the user data and then adds the username and userdata to 
  local storage for future fetches and call the displayUser function. If the user is not found, it will call the userNotFound function.
  If there is a problem in connecting to server, it will call the connectionErr function.
*/
async function getUser(e) {
    let uname = nameInput.value;
    e.preventDefault();
    try {
        existedData = await JSON.parse(window.localStorage.getItem(uname))
        if (existedData == null){
          let api = APIURL + uname
          let response = await fetch(api)
          let userData = await response.json()
          window.localStorage.setItem(uname, JSON.stringify(userData));
          storageInfo.innerHTML = "<span style='font-size:12px'> Information added to local storage </span>"
          if (response.status != 200){
              userNotFound()
          }
          else if (response.status == 200){
              displayUser(userData)
              // getRepos(uname)
         } 
        }
        else {
          userInStorage(existedData)
        }
        
    }
    catch(err){
        connectionErr()
        
    }
}
// async function getRepos(username) {
//   const resp = await fetch(APIURL + username + "/repos");
//   const respData = await resp.json();
//   repos.sort()

// }
/*
  This function is used when there is a connection error.
*/
function connectionErr(){
  addRes.style.display = 'block';
  user_result.style.display = 'none';
  addRes.innerHTML = "<span style='color:#ff0000;text-align: center'> Connection Error </span>"
}
/*
  This function is used when a request has been send before to bring the user data from the local storage.
*/
function userInStorage(existedData){
  storageInfo.innerHTML = "<span style='font-size:12px'> Information exists in local storage </span>"
  if (existedData.message == 'Not Found'){
    userNotFound();
  }
  else{
    displayUser(existedData);
  }
}
/*
  This function is used when a user is not found. It will show a message.
*/
function userNotFound(){
  addRes.style.display = 'block';
  user_result.style.display = 'none';
  addRes.innerHTML = "<span style='color:#ff0000;text-align: center'> user not found </span>"
}
/*
  This function is for displaying the user data.
*/
function displayUser(data){
    addRes.style.display = 'none';
    user_result.style.display = 'block';
    userPhoto.innerHTML = "<input type='image' width='100px' height='100px'  src=" + data.avatar_url + ">"
    userName.innerHTML = "<fieldset class='fieldset'> <legend> UserName </legend> <p>" + data.name + "</p></fieldset>"
    userBlog.innerHTML = "<fieldset class='fieldset'> <legend> UserBlog </legend> <p>" + data.blog + "</p></fieldset>"
    userLocation.innerHTML = "<fieldset class='fieldset'> <legend> UserLocation </legend> <p>" + data.location + "</p></fieldset>"
    userBio.innerHTML = "<fieldset class = 'fieldset'> <legend> UserBio </legend> <span style='white-space: pre-wrap'> " + data.bio + "</span> </fieldset>"
}

submitButton.addEventListener('click', getUser);
window.localStorage.clear();