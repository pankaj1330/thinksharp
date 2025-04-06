const showModel = document.getElementById('show-model');
showModel.addEventListener('click',function(){
  document.querySelector('.container-model-main').classList.remove('hide');
})

const hideModel = document.getElementById('close-model');
hideModel.addEventListener('click',function(){
  document.querySelector('.container-model-main').classList.add('hide');
})