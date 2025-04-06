document.getElementById('logout').addEventListener('click',()=>onLogout());
console.log(document.getElementById('logout'));
function onLogout(){
    console.log("run");
    document.querySelector('.logout-model').classList.remove('hide-logout');
}
function cancelLogout(){
    document.querySelector('.logout-model').classList.add('hide-logout')
}