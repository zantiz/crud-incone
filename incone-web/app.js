import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getAuth, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut} from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
			const firebaseConfig = {
				apiKey: "AIzaSyBU48yJjB077W266fcE5gFlC7w6QbcCVhU",
				authDomain: "crud-incone.firebaseapp.com",
				projectId: "crud-incone",
				storageBucket: "crud-incone.appspot.com",
				messagingSenderId: "35354464511",
				appId: "1:35354464511:web:f71154df40c7605ef43cca"
			};
			const app = initializeApp(firebaseConfig);
			const auth = getAuth(app);

			let email = 'santivalentinrivero@gmail.com',
					password = '123456';


function registerUser(email, password){
	createUserWithEmailAndPassword(auth, email, password)
	.then((userCredential) => {
		const user = userCredential.user;
		console.log(user);
		let welcome = `Welcome ${user.email}`
		showMsgAuth('ok' , welcome);
		modalInstance.hide();
	})
	.catch((error) => {
		console.log(error);
		const errorCode = error.code;
		const errorMessage = getErrorMsg(errorCode);
		showMsgAuth('error' ,errorMessage);
	});
}

const btnIsLogOut = document.querySelectorAll('.logged-out');
const btnIsLogIn = document.querySelectorAll('.logged-in');


function checkSession(){
    onAuthStateChanged (auth, (user) =>{
        if(user){
            console.log(user);
            const uid = user.uid;
			btnIsLogOut.forEach(btn => btn.style.display = 'none');
			btnIsLogIn.forEach(btn => btn.style.display = 'block');
        } else {
            console.log('no logged');
			btnIsLogIn.forEach(btn => btn.style.display = 'none');
			btnIsLogOut.forEach(btn => btn.style.display = 'block');
        }
    });
}
checkSession();

function login(email, password){
    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    console.log(user);
	let welcome = `Welcome back ${user.email}`
	showMsgAuth('ok' , welcome);
	modalInstance.hide();
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = getErrorMsg(errorCode);
	showMsgAuth('error' ,errorMessage);
  });
}

function logout(){
	signOut(auth).then(() => {
		showMsgAuth('info', 'Logged out')
	}).catch(error => {
		console.log('An error occurred');
	})
}

document.getElementById('btn-logout').addEventListener('click', logout);

function showError(err){
	let inputsError = document.querySelectorAll('.form-control-auth');
	
	inputsError.forEach(element => {
		element.classList.add('error-input');
	});

	document.querySelector('#error-auth').innerHTML = getErrorMsg(err);
}

function showMsgAuth(status = 'info', msg ='Authentication error'){

let bgCustom = 'linear-gradient(to left, #36d1dc, #5b86e5)';

switch(status) {
	case 'error':
		bgCustom = 'linear-gradient(to right, #ed213a, #93291e)';
		break;
	case 'ok':
		bgCustom = 'linear-gradient(to right, #11998e, #38ef7d)'
		break;
	case 'warning':
		bgCustom = 'linear-gradient(to right, #fdc830, #f37335)'
		break;
	case 'info':
	default:
		bgCustom = 'linear-gradient(to left, #36d1dc, #5b86e5)'
		break;
}

		Toastify({
		text: msg,
		duration: 3000,
		close: true,
		gravity: "top", // `top` or `bottom`
		position: "center", // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		style: {
		  background: bgCustom,
		},
		onClick: function(){} // Callback after click
	  }).showToast();
}

function getErrorMsg(code){
	let msg;
	console.log(code);
	switch(code){
	case 'auth/user-not-found':
		msg = 'User not found';
		break;
	case 'auth/wrong-password': 
		msg = 'Invalid credentials';
		break;
	case 'auth/too-many-requests':
		msg = 'Too many requests';
		break;
	case 'auth/missing-app-credentials':
	default:
		msg = 'Authentication error';
	}
	return msg;
}

function validateField(field = '', type){
	let status = false;
	let msg = '';
	let input = field.trim();
	const rules = /^[A-Za-z0-9_.-]*$/;
	const rulesmail = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
	switch (type) {
		case 'password':
			if (input.length > 5 && rules.test(input)) {
				status = true;
			} else{
				msg = 'The password needs to have a minimum of five characters. You can only use letters, numbers, -_ and .';
			}
			break;
	
		case 'email':
			if (rulesmail.test(input)) {
				status = true;
			} else {
				msg = 'The email adress is invalid. ';
			}
			break;
		
		default:
			if (input.length > 3) {
				status = true;
			} else {
				msg = 'Enter a minimum of 3 characters'
			}
			break;
	}

	return {status, msg};
}

const modalAuth = document.getElementById('modalAuth');
const modalInstance = new bootstrap.Modal(modalAuth);
const btnAction = modalAuth.querySelector('#btn-action');
let action = null;

modalAuth.addEventListener('show.bs.modal', event =>{
    const button = event.relatedTarget;
    action = button.getAttribute('data-action-form');
    console.log('>>>>'+action);

    const modalTitle = modalAuth.querySelector('.modal-title');
    modalTitle.textContent = action === 'login'? 'Log In:' : 'Sign Up:'

    btnAction.innerHTML = action === 'login'? 'Log In' : 'Sign Up'
});
	

btnAction.addEventListener('click', (event)=>{
	let email = document.getElementById('email').value;
	let password = document.getElementById('password').value;
	let validateMail = validateField(email, 'email');
	let validatePassword = validateField(password, 'password');
	if (validateMail.status && validatePassword.status){
		sendRequest(email, password);
	} else {
		console.log('validation failed: '+ validateMail.msg + validatePassword.msg);
		let msg = validateMail.msg + validatePassword.msg;
		showMsgAuth('error', msg);
	}
})

function sendRequest(email, password){
		if (action === 'login'){
		login(email, password);
	} else {
		registerUser(email, password);
	}
}