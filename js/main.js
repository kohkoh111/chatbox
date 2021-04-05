(() =>{
    'use strict'

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const config = {
        apiKey: "AIzaSyDScm0ecZuALqnnh24AulZxR6X76oXX5jA",
        authDomain: "myfirebase-c9472.firebaseapp.com",
        projectId: "myfirebase-c9472",
        storageBucket: "myfirebase-c9472.appspot.com",
        messagingSenderId: "413375133839",
        appId: "1:413375133839:web:a429d96045916c3247d8fa",
        measurementId: "G-PMFBPTYFNV"
    };
    // Initialize Firebase
    firebase.initializeApp(config);


    const db = firebase.firestore();
    db.settings({
    timestampsInSnapshots: true
    });
    const collection = db.collection('messages');

    const message = document.getElementById('message');
    const form = document.querySelector('form');
    const messages = document.getElementById('messages');
    const auth = firebase.auth();

    let loggedInUser = null;

    const login = document.getElementById('login');
    const logout = document.getElementById('logout');


    login.addEventListener('click',() =>{
        auth.signInAnonymously();
    });

    logout.addEventListener('click',()=>{
        auth.signOut();
    });

    auth.onAuthStateChanged(user =>{
        if(user){
            loggedInUser = user;

            while(messages.firstChild){     
                messages.removeChild(messages.firstChild);
            }

            collection.orderBy('created').onSnapshot(snapshot => {
                snapshot.docChanges().forEach(change => {
                if (change.type === 'added') {
                    const li = document.createElement('li');
                    const d = change.doc.data();
                    li.textContent = d.uid.substr(0,8) + ':'+ d.message; 
                    messages.appendChild(li);
                }
                });
            }, error => {});
            console.log(`Logged in user as: ${user.uid}`);
            login.classList.add('hidden');
            [logout,form,messages].forEach(el =>{
                el.classList.remove('hidden');
            });
            message.focus();
            return;
        }
        loggedInUser = null;
        console.log('Nobody is logged in');
        login.classList.remove('hidden');
        [logout,form,messages].forEach(el =>{
            el.classList.add('hidden');
        });
    });

    form.addEventListener('submit', e => {
    e.preventDefault();

    const val = message.value.trim();
    if (val === "") {
        return;
    }

    message.value = '';
    message.focus();

    collection.add({
        message: val,
        created: firebase.firestore.FieldValue.serverTimestamp(),
        uid: loggedInUser ? loggedInUser.uid : 'nobody',
    })
    .then(doc => {
        console.log(`${doc.id} added!`);
    })
    .catch(error => {
        console.log(error);
    });
    });
})();
