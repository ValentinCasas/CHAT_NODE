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
                    // Mensaje enviado con éxito, muestra un mensaje en la página
                    $('#message-input').val(''); // Limpia el campo de entrada de mensajes

                    // Agregar el nuevo mensaje al contenedor de mensajes
                    var newMessage = response.data.message;
                    var senderName = response.data.sender.name;
                    var messageText = newMessage.description;
                    var messageTime = newMessage.date;

                    var messageHtml = `
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

                    // Agregar el nuevo mensaje al final del contenedor
                    $('#messages-container').append(messageHtml);
                } else {
                    // Error al enviar el mensaje, muestra un mensaje de error
                    alert('Error al enviar el mensaje. Inténtalo de nuevo.');
                }
            },
            error: function (error) {
                // Manejar errores de la solicitud aquí
                console.error('Error en la solicitud AJAX:', error);
            },
        });
    });
});





$(document).ready(function () {
    const socket = io(); // Inicializa el socket

    $('#chat-form').submit(function (e) {
        e.preventDefault(); // Evita que el formulario se envíe normalmente

        var formData = new FormData(this);
        var messageText = formData.get('message');

        // Enviar el mensaje al servidor
        socket.emit('chat message', messageText);

        // Limpia el campo de entrada de mensajes
        $('#message-input').val('');
    });

    // Escuchar eventos de mensajes desde el servidor
    socket.on('chat message', function (message) {
        // Agregar el nuevo mensaje al contenedor de mensajes
        // Este es solo un ejemplo simple; puedes personalizar el formato del mensaje
        var messageHtml = `
            <div class="message-me">
                <div class="message-sender">
                    <strong>Tú</strong>
                    <p>${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                </div>
                <div class="message-text-me">
                    <p>${message}</p>
                </div>
            </div>
        `;

        $('#messages-container').append(messageHtml);
    });
});