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
const favorite_Language = document.querySelector('.favoriteLanguage');
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
              getRepos(uname)
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
/*
  This function is used to get the repositories of user and count the languages of first 5 recently pushed repositories and 
  detect the most used language as the user's favorite language.
*/
async function getRepos(username) {
  const repos = await fetch(APIURL + username + "/repos?sort=pushed_at");
  const data = await repos.json()
  const languages = {};
  for (let i =0; i<5; i++){
    if(languages[data[i]['language']]){
      languages[data[i]['language']] =  languages[data[i]['language']]+1
    }
    else{
      languages[data[i]['language']] = 1
    }
  }
  console.log(languages)
  const sorted_languages = [...Object.keys(languages)].sort((a, b) =>  languages[b] - languages[a]).filter(value => value !== 'null');
  fav_lan = sorted_languages[0]
  favorite_Language.innerHTML = "<fieldset class='fieldset'> <legend> Favorite Language </legend> <p>" + fav_lan + "</p></fieldset>"
}
/*
  This function is used when there is a connection error.
*/
function connectionErr(){
  addRes.style.display = 'block';
  user_result.style.display = 'none';
  storageInfo.style.display = 'none';
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
    if(data.blog == null){
      userBlog.innerHTML = "<fieldset class='fieldset'> <legend> UserBlog </legend> <p>" + "</p></fieldset>"
    }
    else{
      userBlog.innerHTML = "<fieldset class='fieldset'> <legend> UserBlog </legend> <p>" + data.blog + "</p></fieldset>"
    }
    if(data.location == null){
      userLocation.innerHTML = "<fieldset class='fieldset'> <legend> UserLocation </legend> <p>" + "</p></fieldset>"
    }
    else{
      userLocation.innerHTML = "<fieldset class='fieldset'> <legend> UserLocation </legend> <p>" + data.location + "</p></fieldset>"
    }
    if(data.bio == null){
      userBio.innerHTML = "<fieldset class = 'fieldset'> <legend> UserBio </legend> <span style='white-space: pre-wrap'> " + "</span> </fieldset>"
    }
    else{
      userBio.innerHTML = "<fieldset class = 'fieldset'> <legend> UserBio </legend> <span style='white-space: pre-wrap'> " + data.bio + "</span> </fieldset>"
    }
    userPhoto.innerHTML = "<input type='image' width='100px' height='100px'  src=" + data.avatar_url + ">"
    if(data.name == null){
      userName.innerHTML = "<fieldset class='fieldset'> <legend> UserName </legend> <p>" + "</p></fieldset>"
    } 
    else{
      userName.innerHTML = "<fieldset class='fieldset'> <legend> UserName </legend> <p>" + data.name + "</p></fieldset>"
    }
}

submitButton.addEventListener('click', getUser);
// window.localStorage.clear()