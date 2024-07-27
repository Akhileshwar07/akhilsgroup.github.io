function generateRandomUsername() {
    const adjectives = ['Swift', 'Silent', 'Mystic', 'Shadow', 'Cosmic', 'Cyber', 'Phantom', 'Enigma', 'Stealth', 'Nebula'];
    const nouns = ['Hawk', 'Wolf', 'Spectre', 'Ghost', 'Raven', 'Lynx', 'Phoenix', 'Viper', 'Echo', 'Nova'];
    
    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 1000);

    return `${randomAdjective}${randomNoun}${randomNumber}`;
}

document.addEventListener('DOMContentLoaded', () => {
    const socket = io();
    const chatArea = document.getElementById('chat-area');
    const messageForm = document.getElementById('message-form');
    const messageInput = document.getElementById('message-input');
    const userList = document.getElementById('user-list');

    const username = generateRandomUsername();
    console.log("Your anonymous username is:", username);

    socket.emit('join', username);

    messageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = messageInput.value.trim();
        if (message) {
            socket.emit('chatMessage', message);
            messageInput.value = '';
        }
    });

    function addMessage(username, text, type) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', type);
        messageElement.textContent = `${username}: ${text}`;
        chatArea.appendChild(messageElement);
        chatArea.scrollTop = chatArea.scrollHeight;
    }

    socket.on('message', (message) => {
        addMessage(message.username, message.text, message.username === username ? 'sent' : 'received');
    });

    socket.on('userJoined', (user) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('system-message','user-joined');
        messageElement.textContent = `${user} has joined the chat`;
        chatArea.appendChild(messageElement);
    });

    socket.on('userLeft', (user) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('system-message','user-left');
        messageElement.textContent = `${user} has left the chat`;
        chatArea.appendChild(messageElement);
    });

    socket.on('userList', (users) => {
        userList.innerHTML = '';
        users.forEach(user => {
            const userElement = document.createElement('div');
            userElement.textContent = user === username ? `${user} (You)` : user;
            userList.appendChild(userElement);
        });
    });
});