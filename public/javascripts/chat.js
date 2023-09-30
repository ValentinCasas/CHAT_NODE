document.addEventListener('DOMContentLoaded', function() {
    // Obtén el elemento del contenedor de mensajes
    var chatMessages = document.querySelector('.chat-messages');

    // Realiza un desplazamiento hacia abajo al final del contenido
    chatMessages.scrollTop = chatMessages.scrollHeight;
  });