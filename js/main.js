// Inicializar AOS
AOS.init({
  duration: 1000,
  easing: 'ease-in-out',
  once: true,
});
(() => {
  const chatbot = document.getElementById('chatbot');
  const closeBtn = document.getElementById('chatbot-close');
  const messages = document.getElementById('chatbot-messages');
  const form = document.getElementById('chatbot-form');
  const input = document.getElementById('chatbot-input');

  // Estado básico para controlar flujo
  let estado = 'saludo';
  let pedido = {};

  // Añadir mensaje al chat
  function agregarMensaje(text, from = 'bot') {
    const msgDiv = document.createElement('div');
    msgDiv.style.marginBottom = '10px';
    msgDiv.style.padding = '8px 12px';
    msgDiv.style.borderRadius = '15px';
    msgDiv.style.maxWidth = '80%';
    msgDiv.style.clear = 'both';
    if (from === 'bot') {
      msgDiv.style.backgroundColor = '#dc3545';
      msgDiv.style.color = 'white';
      msgDiv.style.float = 'left';
    } else {
      msgDiv.style.backgroundColor = '#e9ecef';
      msgDiv.style.color = '#333';
      msgDiv.style.float = 'right';
    }
    msgDiv.textContent = text;
    messages.appendChild(msgDiv);
    messages.scrollTop = messages.scrollHeight;
  }

  // Respuestas básicas FAQ
  function responderPregunta(text) {
    const pregunta = text.toLowerCase();

    if (pregunta.includes('horario')) {
      return 'Nuestro horario de atención es de lunes a viernes de 9:00 a.m. a 6:00 p.m.';
    }
    if (pregunta.includes('sede')) {
      return 'Contamos con varias sedes: Avelino Cáceres (principal), Miraflores, Mariano Melgar, Socabaya, Paucarpata, Cayma y Alto Selva Alegre.';
    }
    if (pregunta.includes('contacto')) {
      return 'Puedes contactarnos al correo avesdelsur@delacruzcorp.com o al teléfono +51 993 671 861.';
    }
    if (pregunta.includes('pedido') || pregunta.includes('separar')) {
      estado = 'pedido_iniciado';
      return 'Perfecto, ¿qué producto deseas separar?';
    }
    return 'Disculpa, no entendí tu pregunta. Puedes consultarme sobre horarios, sedes, contacto o separar pedidos.';
  }

  // Manejar mensajes enviados por el usuario
  form.addEventListener('submit', e => {
    e.preventDefault();
    const texto = input.value.trim();
    if (!texto) return;
    agregarMensaje(texto, 'user');
    input.value = '';

    setTimeout(() => {
      if (estado === 'saludo') {
        const respuesta = responderPregunta(texto);
        agregarMensaje(respuesta);

        // Si empieza proceso de pedido, estado cambia
        if (estado === 'pedido_iniciado') {
          pedido.producto = null;
          pedido.cantidad = null;
        }
      } else if (estado === 'pedido_iniciado') {
        pedido.producto = texto;
        agregarMensaje(`Producto seleccionado: ${pedido.producto}. ¿Cuántas unidades deseas separar?`);
        estado = 'pedido_cantidad';
      } else if (estado === 'pedido_cantidad') {
        // Validar que sea un número
        const cantidad = parseInt(texto);
        if (isNaN(cantidad) || cantidad <= 0) {
          agregarMensaje('Por favor ingresa un número válido para la cantidad.');
        } else {
          pedido.cantidad = cantidad;
          agregarMensaje(`Perfecto, has solicitado separar ${pedido.cantidad} unidades de "${pedido.producto}". ¿Quieres confirmar el pedido? (sí/no)`);
          estado = 'pedido_confirmacion';
        }
      } else if (estado === 'pedido_confirmacion') {
        if (texto.toLowerCase() === 'sí' || texto.toLowerCase() === 'si') {
          agregarMensaje('¡Gracias! Tu pedido ha sido separado. Nos contactaremos contigo pronto para los detalles.');
          estado = 'saludo';
          pedido = {};
        } else if (texto.toLowerCase() === 'no') {
          agregarMensaje('Pedido cancelado. ¿En qué más puedo ayudarte?');
          estado = 'saludo';
          pedido = {};
        } else {
          agregarMensaje('Por favor responde con "sí" o "no".');
        }
      }
    }, 600);
  });

  // Mensaje inicial
  agregarMensaje('Hola, soy tu asistente Avicruz. ¿En qué puedo ayudarte hoy? Puedes preguntar por horarios, sedes, contacto o separar un pedido.');

  // Cerrar el chatbot
  closeBtn.addEventListener('click', () => {
    chatbot.style.display = 'none';
  });
})();

document.getElementById('chatbot-toggle').addEventListener('click', () => {
  document.getElementById('chatbot').style.display = 'flex';
  document.getElementById('chatbot-container').style.display = 'none';
});

document.getElementById('chatbot-close').addEventListener('click', () => {
  document.getElementById('chatbot').style.display = 'none';
  document.getElementById('chatbot-container').style.display = 'block';
});

window.addEventListener('load', () => {
  const canvas = document.getElementById('festiveCanvas');
  const ctx = canvas.getContext('2d');
  let width, height;
  let animationId;

  // Ajustar tamaño del canvas a la ventana
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  // Detectar festividad
  const today = new Date();
  const month = today.getMonth() + 1; // Enero=1
  const day = today.getDate();
// CAMBIAR FECHA DE FIESTAS
  if ((month === 12 && day >= 1 && day <= 31)) {
    startSnow();
    setTimeout(stopAnimation, 6000);
  } else if (month === 10 && day >= 1 && day <= 31) {
    startHalloween();
    setTimeout(stopAnimation, 6000);
  } else if (month === 7 && (day === 28 || day === 29)) {
    startFiestasPatrias();
    setTimeout(stopAnimation, 6000);
  }

  function stopAnimation() {
    cancelAnimationFrame(animationId);
    ctx.clearRect(0, 0, width, height);
    canvas.style.display = 'none';
  }

  // ------- ANIMACIONES ---------

  // 1. Nieve para Navidad
  function startSnow() {
    canvas.style.display = 'block';
    const flakes = [];

    function createFlake() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 4 + 1,
        speedY: Math.random() * 1 + 0.5,
        speedX: Math.random() * 0.5 - 0.25
      };
    }

    for (let i = 0; i < 150; i++) {
      flakes.push(createFlake());
    }

    function snowLoop() {
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.beginPath();
      flakes.forEach(flake => {
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      });
      ctx.fill();

      flakes.forEach(flake => {
        flake.y += flake.speedY;
        flake.x += flake.speedX;

        if (flake.y > height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * width;
        }
        if (flake.x > width) flake.x = 0;
        else if (flake.x < 0) flake.x = width;
      });

      animationId = requestAnimationFrame(snowLoop);
    }

    snowLoop();
  }

  // 2. Halloween: arañitas colgando oscilando
  function startHalloween() {
    canvas.style.display = 'block';

    const spiders = [];

    function createSpider() {
      return {
        x: Math.random() * width,
        y: -20 - Math.random() * 100,
        length: 50 + Math.random() * 50,
        swingAngle: 0,
        swingSpeed: (Math.random() * 0.05) + 0.02,
        swingRange: (Math.random() * 0.3) + 0.1,
        size: 10 + Math.random() * 8,
        speedY: 0.5 + Math.random() * 0.5
      };
    }

    for (let i = 0; i < 25; i++) {
      spiders.push(createSpider());
    }

    function drawSpider(spider) {
      ctx.save();

      const baseX = spider.x;
      const baseY = spider.y;

      const swingX = Math.sin(spider.swingAngle) * spider.swingRange * 50;

      // Telaraña (línea colgante)
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(baseX, baseY);
      ctx.lineTo(baseX + swingX, baseY + spider.length);
      ctx.stroke();

      // Araña cuerpo (círculo negro)
      const spiderX = baseX + swingX;
      const spiderY = baseY + spider.length;

      ctx.fillStyle = 'black';
      ctx.beginPath();
      ctx.ellipse(spiderX, spiderY, spider.size * 0.6, spider.size * 0.8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Cabeza
      ctx.beginPath();
      ctx.ellipse(spiderX, spiderY - spider.size * 0.7, spider.size * 0.4, spider.size * 0.5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Patas (8 patas simples)
      ctx.strokeStyle = 'black';
      ctx.lineWidth = 2;
      for(let i = -1; i <= 1; i += 2) {
        for(let j = 0; j < 4; j++) {
          ctx.beginPath();
          const startX = spiderX + i * spider.size * 0.4;
          const startY = spiderY - spider.size * 0.4 + j * (spider.size * 0.2);
          const endX = startX + i * spider.size * (0.6 + 0.1 * j);
          const endY = startY + spider.size * (0.2 + 0.1 * j);
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    function spiderLoop() {
      ctx.clearRect(0, 0, width, height);

      spiders.forEach(spider => {
        drawSpider(spider);
        spider.y += spider.speedY;
        spider.swingAngle += spider.swingSpeed;

        if (spider.y - spider.length > height + spider.size) {
          spider.x = Math.random() * width;
          spider.y = -20 - Math.random() * 100;
          spider.length = 50 + Math.random() * 50;
          spider.swingAngle = 0;
          spider.swingSpeed = (Math.random() * 0.05) + 0.02;
          spider.swingRange = (Math.random() * 0.3) + 0.1;
          spider.size = 10 + Math.random() * 8;
          spider.speedY = 0.5 + Math.random() * 0.5;
        }
      });

      animationId = requestAnimationFrame(spiderLoop);
    }

    spiderLoop();
  }

  // 3. Fiestas Patrias Perú: Banderitas ondeando
  function startFiestasPatrias() {
    canvas.style.display = 'block';

    const flags = [];

    function createFlag() {
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        speedY: Math.random() * 0.5 + 0.2,
        width: 40,
        height: 25,
        angle: 0,
        angleSpeed: (Math.random() * 0.04) + 0.01
      };
    }

    for (let i = 0; i < 40; i++) {
      flags.push(createFlag());
    }

    function drawFlag(x, y, width, height, angle) {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      // mástil
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(-2, 0, 4, height + 10);
      // bandera (rojo - blanco - rojo)
      ctx.fillStyle = '#D52B1E';
      ctx.fillRect(0, 0, width * 0.3, height);
      ctx.fillStyle = 'white';
      ctx.fillRect(width * 0.3, 0, width * 0.4, height);
      ctx.fillStyle = '#D52B1E';
      ctx.fillRect(width * 0.7, 0, width * 0.3, height);
      ctx.restore();
    }

    function flagLoop() {
      ctx.clearRect(0, 0, width, height);
      flags.forEach(flag => {
        drawFlag(flag.x, flag.y, flag.width, flag.height, Math.sin(flag.angle) * 0.2);
        flag.y += flag.speedY;
        if (flag.y > height + flag.height) flag.y = -flag.height;
        flag.angle += flag.angleSpeed;
      });
      animationId = requestAnimationFrame(flagLoop);
    }

    flagLoop();
  }
});
