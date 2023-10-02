
const socket = io();


$(document).ready(function () {

    // Evento para enviar un mensaje
    $('#contact-form').submit(function (e) {
        e.preventDefault();

        var formData = new FormData(this);

        $.ajax({
            url: '/chat/messages',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {

                if (response.success) {

                    const messagesContainer = $('#messages-container');
                    let messageHtml
                    messagesContainer.empty(); 

                    response.Messages.forEach(function (message) {
                        messageHtml = `
                         <div class="message-${message.senderId === response.myId ? 'me' : 'friend'}">
                           <div class="message-sender">
                             <strong>${message.sender.name}</strong>
                             <p>...</p>
                           </div>
                           <div class="message-text-${message.senderId === response.myId ? 'me' : 'friend'}">
                             <p>${message.description}</p>
                           </div>
                         </div>
                        `;
                    });
                    
                    messagesContainer.append(messageHtml);
                    $('#input-friend').val(response.Friend.id);

                    socket.emit('joinChat', response.myId, response.Friend.id);

                } else {
                    console.log("errooooooor")
                }

            },
            error: function (error) {
                console.error('Error en la solicitud AJAX:', error);
            },
        });
    });

});


$(document).ready(function () {
    $('#chat-form').submit(function (e) {
        e.preventDefault(); // Evita que el formulario se envíe normalmente

        var formData = new FormData(this);

        $.ajax({
            url: '/chat/send',
            method: 'POST',
            data: formData,
            processData: false,
            contentType: false,
            success: function (response) {
                if (response.success) {

                    $('#message-input').val('');

                    const myId = response.data.myId;
                    const senderId = response.data.sender.id;
                    const receiverId = response.data.receiver.id;
                    const senderName = response.data.sender.name;
                    const receiverName = response.data.receiver.name;
                    const messageText = response.data.message.description;
                    const messageTime = new Date(response.data.message.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });



                    const senderMessageHtml = `
                <div class="message-me">
                  <div class="message-sender">
                    <strong>${senderName}</strong>
                    <p>${messageTime}</p>
                  </div>
                  <div class="message-text-me">
                    <p>${messageText}</p>
                  </div>
                </div>
              `;

                    // Agregar el nuevo mensaje al contenedor de mensajes del receptor
                    /*  const receiverMessageHtml = `
                 <div class="message-friend">
                   <div class="message-sender">
                     <strong>${senderName}</strong>
                     <p>${messageTime}</p>
                   </div>
                   <div class="message-text-friend">
                     <p>${messageText}</p>
                   </div>
                 </div>
               `; */


                    $('#messages-container').append(senderMessageHtml);

                    socket.emit('setUserId', senderId);

                    socket.emit('message', {
                        senderName,
                        senderId,
                        receiverName,
                        receiverId,
                        messageText,
                    });

                } else {
                    console.log('Error al enviar el mensaje');
                }
            },
            error: function (error) {
                console.error('Error en la solicitud AJAX:', error);
            },
        });
    });
});




socket.on('message', (data) => {
    const senderName = data.senderName;
    const messageText = data.messageText;
    const messageTime = new Date(data.messageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // Agrega el nuevo mensaje al contenedor de mensajes del receptor en tiempo real
    const receiverMessageHtml = `
      <div class="message-friend">
        <div class="message-sender">
          <strong>${senderName}</strong>
          <p>${messageTime}</p>
        </div>
        <div class="message-text-friend">
          <p>${messageText}</p>
        </div>
      </div>
    `;

    $('#messages-container').append(receiverMessageHtml);
});