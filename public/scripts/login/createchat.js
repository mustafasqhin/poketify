//enable strict mode
'use strict';

import { usernameformat, errlog } from './common.js';

const form = document.getElementById('form');

const maxuser = document.getElementById('maxuser');

maxuser.addEventListener('input', ()=>{
	document.getElementById('rangeValue').textContent = maxuser.value;
});

function validateUser(){

	const username = document.getElementById('username').value;
	const avatarsChecked = document.querySelector('.avatar input[type="radio"]:checked');

	if (username.length == 0){
		document.getElementById('username').focus();
		errlog('usernameErr', 'Kullanıcı adı gerekli <i class="fa-solid fa-triangle-exclamation"></i>');
		return false;
	}
	if(username.length < 3 || username.length > 20){
		document.getElementById('username').focus();
		errlog('usernameErr', 'Kullanıcı adı 3 ile 20 karakter arasında olmalıdır <i class="fa-solid fa-triangle-exclamation"></i>');
		return false;
	}
	if(!usernameformat.test(username)){
		document.getElementById('username').focus();
		errlog('usernameErr', 'Özel karakterler veya boşluk içeremez <i class="fa-solid fa-triangle-exclamation"></i>');
		return false;
	}
	if (!avatarsChecked){
		errlog('avatarErr', 'Avatar gerekli <i class="fa-solid fa-triangle-exclamation"></i>');
		return false;
	}
	return true;
}

function check(){

	document.querySelectorAll('.errLog')
		.forEach(elem => {
			elem.textContent = '';
		});
	

	const valid = validateUser();
	
	if (valid){
		document.getElementById('enter').innerHTML = 'Lütfen bekleyiniz <i class="fa-solid fa-circle-notch fa-spin"></i>';
	}

	return valid;
}

form.addEventListener('submit', async (e) => {
	e.preventDefault();
	if (check()){
		document.getElementById('enter').setAttribute('disabled', 'disabled');
		form.submit();
	}
});

console.log('%ccreatechat.js loaded', 'color: limegreen;');