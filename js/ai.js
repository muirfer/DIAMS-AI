$(document).ready(function() {

            // --- INICIALIZACIÓN ---
            var chatLog = $('#aiChatLog');
            var chatInput = $('#aiChatInput');
            var chatSend = $('#aiChatSend');
            var chatOverlay = $('#aiChatOverlay');
            var chatPanel = $('#aiChatPanel');

            // Habilitar tooltips
            $('[data-toggle="tooltip"]').tooltip();

            // --- MANEJO DE ABRIR/CERRAR EL PANEL ---

            // Función para cerrar el chat
            function closeChat() {
                chatPanel.removeClass('open');
                chatOverlay.removeClass('open');
            }

            // 1. Abrir el panel con el botón flotante
            $('#aiChatToggle').on('click', function() {
                chatPanel.toggleClass('open');
                chatOverlay.toggleClass('open');
                // Asegurarse de que el scroll esté al fondo al abrir
                if (chatPanel.hasClass('open')) {
                    scrollToBottom();
                    chatInput.focus(); // <-- Foco al abrir
                }
            });

            // 2. Cerrar el panel con el botón 'X'
            $('#aiChatClose').on('click', closeChat);

            // 3. Cerrar el panel al hacer clic en el overlay
            chatOverlay.on('click', closeChat);

            // 4. Botón de Reset
            $('#aiChatReset').on('click', function() {
                // Vaciar el log
                chatLog.empty();
                // Añadir el saludo inicial de nuevo
                var welcomeHtml = `
                    <div class="chat-message bot">
                        <div class="bot-response-container">
                            <div class="message-bubble">
                                <span class="message-icon"><i class="fas fa-robot"></i></span>
                                <div class="message-content">
                                    <p>Hello! I'm your AI assistant. How can I help you today?</p>
                                </div>
                            </div>
                        </div>
                    </div>`;
                chatLog.append(welcomeHtml);
                // Ocultar el tooltip
                $(this).tooltip('hide');
            });


            // --- MANEJO DEL CHAT ---

            // 5. Enviar mensaje al presionar el botón
            chatSend.on('click', function() {
                sendMessage();
            });

            // 6. Enviar mensaje al presionar "Enter" en el textarea
            chatInput.on('keypress', function(e) {
                if (e.which == 13 && !e.shiftKey) { // Enter sin Shift
                    e.preventDefault(); // Evita el salto de línea
                    sendMessage();
                }
            });

            // Función para enviar el mensaje
            function sendMessage() {
                var messageText = chatInput.val().trim();
                if (messageText === "") {
                    return; 
                }
                
                // Generar un ID único para este intercambio
                var messageId = 'msg-' + Date.now();

                // --- LÓGICA DE OCULTAR BOTONES ANTERIORES ---
                // Antes de añadir el nuevo mensaje del usuario, buscamos el *último*
                // mensaje del bot y le quitamos los botones de acción interactivos.
                var $lastBotMessage = chatLog.find('.chat-message.bot:last');
                if ($lastBotMessage.length > 0) {
                    $lastBotMessage.find('.btn-regenerate').remove();
                    $lastBotMessage.find('.btn-like').remove();
                    $lastBotMessage.find('.btn-dislike').remove();
                }
                // --- FIN LÓGICA ---


                // 1. Añadir el mensaje del usuario al log
                var userHtml = `
                    <div class="chat-message user" data-message-id="${messageId}">
                        <div class="message-bubble">
                            <span class="message-icon"><i class="fas fa-user"></i></span>
                            <div class="message-content">
                                <p>${escapeHTML(messageText)}</p>
                            </div>
                        </div>
                    </div>`;
                chatLog.append(userHtml);

                // 2. Limpiar el input
                chatInput.val('').css('height', 'auto'); // Limpia y resetea altura

                // 3. Deshabilitar inputs mientras se espera respuesta
                setChatInputs(false);

                // 4. Mostrar indicador de "escribiendo..."
                showTypingIndicator(messageId);
                scrollToBottom();


                // 5. (SIMULACIÓN) Llamar al bot y esperar respuesta
                setTimeout(function() {
                    // Reemplazar el "escribiendo" con la respuesta real
                    var $typingBubble = $('#typing-' + messageId);
                    showBotResponse(messageText, messageId, $typingBubble);
                    
                    // Reactivar inputs
                    setChatInputs(true);
                    
                    scrollToBottom();
                }, 2500); // Simula 2.5 segundos de espera
            }

            /**
             * Muestra la respuesta del bot, reemplazando el indicador de 'escribiendo'.
             * @param {string} userMessage - El mensaje original del usuario.
             * @param {string} messageId - El ID único para este intercambio.
             * @param {jQuery} $bubbleToReplace - El 'typing' bubble para reemplazar.
             */
            function showBotResponse(userMessage, messageId, $bubbleToReplace) {
                var simulatedReply = getSimulatedResponse(userMessage, 1);

                // HTML para la *primera* respuesta
                var botResponseHtml = `
                    <div class="bot-response-container">
                        <div class="message-bubble">
                            <span class="message-icon"><i class="fas fa-robot"></i></span>
                            <div class="message-content">
                                
                                <!-- Contenedor para todas las versiones -->
                                <div class="response-versions">
                                    <p class="response-text version-1" style="display: block;">${escapeHTML(simulatedReply)}</p>
                                </div>

                                <!-- Botones de Acción -->
                                <div class="message-actions d-flex justify-content-between">
                                    <div>
                                        <button class="btn btn-transparent btn-sm btn-regenerate" data-toggle="tooltip" title="Regenerate">
                                            <i class="fas fa-sync-alt"></i>
                                        </button>
                                        <button class="btn btn-transparent btn-sm btn-copy" data-toggle="tooltip" title="Copy text">
                                            <i class="fas fa-clipboard"></i>
                                        </button>
                                    </div>
                                    <div class="like-dislike-group">
                                        <button class="btn btn-light btn-sm btn-like">
                                            <i class="fas fa-thumbs-up"></i>
                                        </button>
                                        <button class="btn btn-light btn-sm btn-dislike">
                                            <i class="fas fa-thumbs-down"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Navegación (fuera de la burbuja) -->
                        <div class="version-nav" style="display: none;">
                            <button class="btn btn-sm btn-nav prev-version" disabled>&lt;</button>
                            <span class="version-counter">1 / 1</span>
                            <button class="btn btn-sm btn-nav next-version" disabled>&gt;</button>
                        </div>
                    </div>`;
                
                // Creamos el nuevo elemento bot
                var $botMessage = $('<div>', {
                    'class': 'chat-message bot',
                    'data-message-id': messageId,
                    'data-original-query': userMessage,
                    'data-total-versions': 1,
                    'data-current-version': 1,
                    'html': botResponseHtml
                });

                // Reemplazar el "typing"
                if ($bubbleToReplace && $bubbleToReplace.length) {
                    $bubbleToReplace.replaceWith($botMessage);
                } else {
                    chatLog.append($botMessage);
                }

                // Habilitar tooltips de Bootstrap en los nuevos botones
                $botMessage.find('[data-toggle="tooltip"]').tooltip();
            }

            /**
             * Muestra el indicador de "escribiendo...".
             * @param {string} messageId - El ID único para este intercambio.
             */
            function showTypingIndicator(messageId) {
                // Usar ID único para poder reemplazarlo
                var typingHtml = `
                    <div id="typing-${messageId}" class="chat-message bot" data-message-id="${messageId}">
                        <div class="bot-response-container">
                            <div class="message-bubble">
                                <span class="message-icon"><i class="fas fa-robot"></i></span>
                                <div class="message-content">
                                    <div class="typing-indicator">
                                        <span></span>
                                        <span></span>
                                        <span></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>`;
                chatLog.append(typingHtml);
            }
            

            // --- MANEJO DE ACCIONES DE MENSAJE (con delegación de eventos) ---

            // 7. Botón de "Like"
            chatLog.on('click', '.btn-like', function() {
                var $this = $(this);
                //$this.tooltip('hide'); // Ocultar tooltip al hacer clic
                $this.toggleClass('btn-success btn-light');
                // Asegurarse de que "dislike" no esté activo
                $this.closest('.like-dislike-group').find('.btn-dislike').removeClass('btn-danger').addClass('btn-light');
            });

            // 8. Botón de "Dislike"
            chatLog.on('click', '.btn-dislike', function() {
                var $this = $(this);
                //$this.tooltip('hide'); // Ocultar tooltip al hacer clic
                $this.toggleClass('btn-danger btn-light');
                // Asegurarse de que "like" no esté activo
                $this.closest('.like-dislike-group').find('.btn-like').removeClass('btn-success').addClass('btn-light');
            });

            // 9. Botón de "Copiar"
            chatLog.on('click', '.btn-copy', function() {
                var $this = $(this);
                var $messageContent = $this.closest('.message-content');
                var currentVersion = $messageContent.closest('.chat-message').data('current-version');
                
                // Encontrar el texto de la versión activa
                var textToCopy = $messageContent.find('.response-text.version-' + currentVersion).text();

                // Crear un textarea temporal para copiar
                var $temp = $("<textarea>");
                $("body").append($temp);
                $temp.val(textToCopy).select();
                document.execCommand("copy");
                $temp.remove();

                // Feedback visual
                $this.tooltip('hide')
                     .attr('data-original-title', 'Copied!')
                     .tooltip('show');
                $this.find('i').removeClass('fa-clipboard').addClass('fa-check');

                // Volver al estado original después de 2s
                setTimeout(function() {
                    $this.tooltip('hide')
                         .attr('data-original-title', 'Copy text');
                    $this.find('i').removeClass('fa-check').addClass('fa-clipboard');
                }, 2000);
            });

            // 10. Botón de "Regenerar"
            chatLog.on('click', '.btn-regenerate', function() {
                var $this = $(this);
                var $botMessage = $this.closest('.chat-message.bot');
                var messageId = $botMessage.data('message-id');
                var originalQuery = $botMessage.data('original-query');
                var totalVersions = $botMessage.data('total-versions');
                var newVersionNum = totalVersions + 1;

                // --- Resetear Like/Dislike ---
                var $likeDislikeGroup = $this.closest('.message-actions').find('.like-dislike-group');
                $likeDislikeGroup.find('.btn-like').removeClass('btn-primary').addClass('btn-light');
                $likeDislikeGroup.find('.btn-dislike').removeClass('btn-danger').addClass('btn-light');
                // --- Fin Reseteo ---

                // Deshabilitar inputs
                setChatInputs(false);
                
                // Encontrar el contenedor de versiones
                var $versionsContainer = $botMessage.find('.response-versions');
                var $navContainer = $botMessage.find('.version-nav');
                var $counter = $navContainer.find('.version-counter');
                var $prevBtn = $navContainer.find('.prev-version');
                var $nextBtn = $navContainer.find('.next-version');

                // Ocultar la versión actual
                $botMessage.find('.response-text').hide();

                // Crear el nuevo slot para la respuesta y mostrar el "typing"
                var newResponseHtml = `<p class="response-text version-${newVersionNum}" style="display: block;"></p>`;
                $versionsContainer.append(newResponseHtml);
                var $newResponseP = $versionsContainer.find('.version-' + newVersionNum);
                
                // Añadir el "typing" dentro del nuevo <p>
                var typingIndicatorHtml = `
                    <div class="typing-indicator" style="padding: 0;">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>`;
                $newResponseP.html(typingIndicatorHtml);

                // Actualizar atributos y navegación
                $botMessage.data('total-versions', newVersionNum);
                $botMessage.data('current-version', newVersionNum);
                $counter.text(`${newVersionNum} / ${newVersionNum}`);
                $navContainer.show();
                $prevBtn.prop('disabled', false); // Ya hay una versión anterior
                $nextBtn.prop('disabled', true); // Estamos en la última

                scrollToBottom();

                // Simular espera para la nueva respuesta
                setTimeout(function() {
                    var newSimulatedReply = getSimulatedResponse(originalQuery, newVersionNum);
                    
                    // Reemplazar el "typing" con la respuesta real
                    $newResponseP.html(escapeHTML(newSimulatedReply));

                    // Reactivar inputs
                    setChatInputs(true);

                    scrollToBottom();
                }, 2500);
            });

            // 11. Navegación de Versiones (Anterior)
            chatLog.on('click', '.prev-version', function() {
                var $botMessage = $(this).closest('.chat-message.bot');
                var currentVersion = $botMessage.data('current-version');
                if (currentVersion <= 1) return; // No ir más atrás

                var newVersion = currentVersion - 1;
                updateVersionView($botMessage, newVersion);
            });

            // 12. Navegación de Versiones (Siguiente)
            chatLog.on('click', '.next-version', function() {
                var $botMessage = $(this).closest('.chat-message.bot');
                var totalVersions = $botMessage.data('total-versions');
                var currentVersion = $botMessage.data('current-version');
                if (currentVersion >= totalVersions) return; // No ir más adelante

                var newVersion = currentVersion + 1;
                updateVersionView($botMessage, newVersion);
            });

            // --- FUNCIONES DE UTILIDAD ---

            /**
             * Actualiza la vista del mensaje del bot a una versión específica.
             */
            function updateVersionView($botMessage, newVersion) {
                var totalVersions = $botMessage.data('total-versions');
                
                // Ocultar todos los textos de versión
                $botMessage.find('.response-text').hide();
                // Mostrar el texto de la nueva versión
                $botMessage.find('.version-' + newVersion).show();
                
                // Actualizar atributos
                $botMessage.data('current-version', newVersion);
                
                // Actualizar contador
                $botMessage.find('.version-counter').text(`${newVersion} / ${totalVersions}`);
                
                // Actualizar estado de botones
                $botMessage.find('.prev-version').prop('disabled', newVersion === 1);
                $botMessage.find('.next-version').prop('disabled', newVersion === totalVersions);

                // --- LÓGICA DE OCULTAR BOTONES ---
                var $actions = $botMessage.find('.message-actions');
                var $likeDislikeGroup = $actions.find('.like-dislike-group');
                var $regenerateBtn = $actions.find('.btn-regenerate');

                if (newVersion === totalVersions) {
                    // Es la última versión: mostrar botones
                    $regenerateBtn.show();
                    $likeDislikeGroup.show();
                } else {
                    // Es una versión antigua: ocultar botones
                    $regenerateBtn.hide();
                    $likeDislikeGroup.hide();
                }
            }


            /**
             * Habilita o deshabilita los inputs del chat.
             * @param {boolean} isEnabled - true para habilitar, false para deshabilitar.
             */
            function setChatInputs(isEnabled) {
                chatInput.prop('disabled', !isEnabled);
                chatSend.prop('disabled', !isEnabled);
                // Deshabilitar todos los botones de acción del chat
                chatLog.find('.btn-like, .btn-dislike, .btn-copy, .btn-regenerate').prop('disabled', !isEnabled);
                
                // Si estamos habilitando los inputs, hacer foco en el chat.
                if (isEnabled) {
                    chatInput.focus(); // <-- Foco al habilitar
                }
            }

            /**
             * Genera una respuesta simulada.
             */
            function getSimulatedResponse(message, version) {
                // Se quita la referencia al 'message' del usuario
                var response = `Here are the details you requested.\nThis is version ${version} of the response.\n\nLine 1\nLine 2\nLine 3`;
                return response;
            }

            /**
             * Escapa HTML para prevenir XSS.
             */
            function escapeHTML(str) {
                return str.replace(/&/g, '&amp;')
                          .replace(/</g, '&lt;')
                          .replace(/>/g, '&gt;')
                          .replace(/"/g, '&quot;')
                          .replace(/'/g, '&#039;');
            }

            /**
             * Desplaza el log del chat al fondo.
             */
            function scrollToBottom() {
                chatLog.scrollTop(chatLog[0].scrollHeight);
            }

            // 7. Auto-ajustar altura del textarea
            chatInput.on('input', function () {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });

        });