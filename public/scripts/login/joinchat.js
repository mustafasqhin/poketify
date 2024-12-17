//enable strict mode
'use strict';

import { errlog, usernameformat } from './common.js';

// eslint-disable-next-line no-undef
const socket = io('/auth');

socket.on('connect', () => {
	console.log('%cConnected to auth namespace', 'color: deepskyblue;');
});

const form = document.getElementById('form');
const next = document.getElementById('next');
const form1 = document.getElementById('subform1');
const form2 = document.getElementById('subform2');

const keyformat = /^[a-zA-Z0-9]{2}-[a-zA-Z0-9]{3}-[a-zA-Z0-9]{2}$/;

function validateKey(){
	const key = document.getElementById('key').value;
	if(key.length == 0){
		document.getElementById('key').focus();
		errlog('keyErr', 'Anahtar gerekli <i class="fa-solid fa-triangle-exclamation"></i>');
		document.getElementById('keyLabel').innerHTML = 'Anahtar girin <i id=\'lb__icon\' class="fa-solid fa-key"></i>';
		return false;
	}
	if(!keyformat.test(key)){
		document.getElementById('key').focus();
		errlog('keyErr', 'Anahtar geçerli değil <i class="fa-solid fa-triangle-exclamation"></i>');
		document.getElementById('keyLabel').innerHTML = 'Anahtar girin <i id=\'lb__icon\' class="fa-solid fa-key"></i>';
		return false;
	}
	return true;
}

let usersData = {};

async function validateUser(){

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

	const hashes = usersData.map(userData => userData.hash);
	const avatarsTaken = usersData.map(userData => userData.avatar);

	if (hashes){

		const encodedText = new TextEncoder().encode(username);
		const hashBuffer = await crypto.subtle.digest('SHA-256', encodedText);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

		if (hashes.includes(hashHex)){
			errlog('usernameErr', 'Kullanıcı adı alındı <i class="fa-solid fa-triangle-exclamation"></i>');
			return false;
		}
	}else{
		return false;
	}

	if (!avatarsChecked){
		errlog('avatarErr', 'Avatar gerekli <i class="fa-solid fa-triangle-exclamation"></i>');
		return false;
	}


	if (avatarsTaken){
		const selectedAvatar = document.querySelector('.avatar input[type=radio]:checked');
		if (!selectedAvatar){
			errlog('avatarErr', 'Avatar başkası tarafından alınmıştır <i class="fa-solid fa-triangle-exclamation"></i>');
			return false;
		}
		if (avatarsTaken.includes(selectedAvatar.value)){
			errlog('avatarErr', 'Avatar başkası tarafından alınmıştır <i class="fa-solid fa-triangle-exclamation"></i>');
			return false;
		}
	}else{
		return false;
	}

	return true;
}

async function check(){

	document.querySelectorAll('.errLog')
		.forEach(elem => {
			elem.textContent = '';
		});
	

	const valid = await validateUser();
	
	if (valid){
		document.getElementById('enter').innerHTML = 'Lütfen bekleyin <i class="fa-solid fa-circle-notch fa-spin"></i>';
	}

	return valid;
}

form.addEventListener('submit', async (e) => {
	e.preventDefault();

	emitSignal(true);

	if ( validateKey() && await check()){

		usersData.forEach(userData => {
			const selectedAvatar = document.querySelector('.avatar input[type=radio]:checked');
			if (selectedAvatar && selectedAvatar.value != userData.avatar){
				document.getElementById('enter').setAttribute('disabled', 'disabled');
				form.submit();
			}
		});

	}
});

//click on the next button when enter pressed on document.getElementById('key')
const keyElem = document.getElementById('key');

['paste', 'keydown'].forEach(event => {
	keyElem.addEventListener(event, (e) => {
		if (e.key === 'Enter'){
			e.preventDefault();
			next.click();
		}
		//for paste event
		if (e.type === 'paste'){
			setTimeout(() => {
				next.click();
			}, 100);
		}
	});
});


function removeAvatars(){
	document.querySelectorAll('.avatar img.taken')
		.forEach(elem => {
			elem.classList.remove('taken');
		});


	if (usersData.length == 0){
		return;
	}

	usersData.forEach(userData => {
		const avatar = document.getElementById(userData.avatar);
		if (avatar){
			avatar.closest('.avatar').querySelector('img').classList.add('taken');
		}
	});
}

socket.on('userUpdate', (response) => {
	//console.log('new user joined', response);

	if (!response.success){
		next.disabled = true;
		document.getElementById('enter').disabled = true;
		errlog('usernameErr', `Anahtar artık mevcut değil ${response.icon}`);
		let i = 0;
		const timeout = setInterval(() => {
			//countdown from 5 to 0
			errlog('usernameErr', `Yeniden yükleniyor ${5 - i} ${ i != 4 ? 'seconds' : 'second' } ${response.icon}`);
			i++;
			if (i == 5){
				clearInterval(timeout);
				location.reload();
			}
		}, 1000);
	}

	usersData = response.message;
	//console.log(usersData);
	removeAvatars();
});

socket.on('disconnect', () => {
	console.log('%cDisconnected from auth namespace', 'color: deepskyblue;');
	errlog('keyErr', 'Sunucudan bağlantı kesildi <i class="fa-solid fa-triangle-exclamation"></i>');
	errlog('usernameErr', 'Sunucudan bağlantı kesildi <i class="fa-solid fa-triangle-exclamation"></i>');

	next.disabled = true;
	document.getElementById('enter').disabled = true;

	//countdown from 5 to 0
	let i = 0;
	setInterval(() => {
		errlog('keyErr', `yeniden yükleniyor: ${5 - i} ${ i != 4 ? 'seconds' : 'second' } <i class="fa-solid fa-triangle-exclamation"></i>`);
		errlog('usernameErr', `yeniden yükleniyor: ${5 - i} ${ i != 4 ? 'seconds' : 'second' } <i class="fa-solid fa-triangle-exclamation"></i>`);
		i++;
		if (i == 5){
			location.reload();
		}
	}, 1000);
});

function emitSignal(onlySignal = false){
	const key = document.getElementById('key').value;
	socket.emit('joinRequest', key, (response) => {
		document.getElementById('keyLabel').innerHTML = 'Anahtarı girin <i id=\'lb__icon\' class="fa-solid fa-key"></i>';
		if (response.success){
			usersData = response.message;
			//remove existing avatars
			removeAvatars();

			if (!onlySignal){
				form1.classList.add('done');
				form2.classList.add('active');
			}
		}else{

			errlog('keyErr', `${response.message} ${response.icon}`);
			
			if (response.blocked == true){
				next.classList.remove('clickable');
				next.innerHTML = 'Yeniden yükle <i class="fa-solid fa-rotate-right"></i>';
				next.style.background = '#ff2a20';
				next.onclick = () => {
					next.innerHTML = 'Lütfen bekleyiniz <i class="fa-solid fa-rotate-right fa-spin"></i>';
					location.reload();
				};
			}
		}
	});
}

next.onclick = (e) => {
	e.preventDefault();
	document.getElementById('keyLabel').innerHTML = 'Kontrol ediliyor <i id=\'lb__icon\' class="fa-solid fa-circle-notch fa-spin"></i>';
	if (validateKey()){
		emitSignal();
	}
};

if (window.autoFetch){
	emitSignal();
	console.log('%cAuto-fetching key', 'color: limegreen;');
	window.autoFetch = undefined;
	document.getElementById('autoFetch').remove();
}

console.log('%cjoinchat.js loaded', 'color: limegreen;');