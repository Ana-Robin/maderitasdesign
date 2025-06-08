document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d'); // Contexto 2D para dibujar

    const selectShapeBtn = document.getElementById('selectShapeBtn');
    const colorPicker = document.getElementById('colorPicker');
    const penSizeSlider = document.getElementById('penSizeSlider');
    const penSizeValue = document.getElementById('penSizeValue');
    const clearCanvasBtn = document.getElementById('clearCanvasBtn');
    const saveDesignBtn = document.getElementById('saveDesignBtn');
    const sendEmailBtn = document.getElementById('sendEmailBtn');
    const messageDisplay = document.getElementById('message');

    let isDrawing = false;
    let penColor = colorPicker.value; // Color inicial del pincel (desde el input)
    let penSize = parseInt(penSizeSlider.value); // Tamaño inicial del pincel (desde el input)
    const woodColor = "#D2B48C"; // Color de la "madera"

    // --- Configuración inicial del Canvas ---
    // Dimensiones por defecto para empezar
    let currentShape = 'rectangle'; // Por defecto
    let currentWidth = 400;
    let currentHeight = 300;
    let currentDiameter = 300; // Si es círculo

    function setCanvasDimensions(shape, dim1, dim2) {
        if (shape === 'rectangle') {
            canvas.width = dim1;
            canvas.height = dim2;
            ctx.fillStyle = woodColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'brown';
            ctx.lineWidth = 2;
            ctx.strokeRect(0, 0, canvas.width, canvas.height);
        } else if (shape === 'circle') {
            const margin = 50; // Margen para que el círculo no toque el borde
            canvas.width = dim1 + margin;
            canvas.height = dim1 + margin;
            const radius = dim1 / 2;
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx.fillStyle = woodColor;
            ctx.beginPath();
            ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = 'brown';
            ctx.lineWidth = 2;
            ctx.stroke();
        }
        messageDisplay.textContent = `¡Listo para dibujar! Pincel actual: ${penSize}px, Color: ${penColor}`;
    }

    // Inicializar canvas con forma por defecto al cargar
    setCanvasDimensions(currentShape, currentWidth, currentHeight);

    // --- Eventos de Dibujo ---
    canvas.addEventListener('mousedown', (e) => {
        isDrawing = true;
        ctx.beginPath();
        ctx.moveTo(e.offsetX, e.offsetY); // Mueve el punto de inicio al cursor
    });

    canvas.addEventListener('mousemove', (e) => {
        if (!isDrawing) return;
        ctx.lineWidth = penSize;
        ctx.lineCap = 'round'; // Extremos de línea redondeados
        ctx.strokeStyle = penColor;
        ctx.lineTo(e.offsetX, e.offsetY); // Dibuja una línea hasta el cursor
        ctx.stroke();
    });

    canvas.addEventListener('mouseup', () => {
        isDrawing = false;
        ctx.closePath();
    });

    canvas.addEventListener('mouseout', () => {
        isDrawing = false; // Detener el dibujo si el ratón sale del canvas
        ctx.closePath();
    });

    // --- Eventos de Controles ---

    selectShapeBtn.addEventListener('click', () => {
        const choice = confirm("¿Deseas una forma Rectangular? (Aceptar para Rectangular, Cancelar para Redonda)");
        
        let width = 400;
        let height = 300;
        let diameter = 300;

        if (choice) {
            // Rectangular
            let dimensions = prompt("Introduce el Ancho y Alto (ej. 400x300):", "400x300");
            if (dimensions) {
                const parts = dimensions.split('x').map(Number);
                if (parts.length === 2 && !isNaN(parts[0]) && !isNaN(parts[1])) {
                    width = parts[0];
                    height = parts[1];
                } else {
                    alert("Formato de dimensiones incorrecto. Usando valores por defecto.");
                }
            }
            currentShape = 'rectangle';
            currentWidth = width;
            currentHeight = height;
            setCanvasDimensions(currentShape, currentWidth, currentHeight);
        } else {
            // Redonda
            let dimDiameter = prompt("Introduce el Diámetro (ej. 300):", "300");
            if (dimDiameter) {
                const d = parseInt(dimDiameter);
                if (!isNaN(d)) {
                    diameter = d;
                } else {
                    alert("Formato de diámetro incorrecto. Usando valor por defecto.");
                }
            }
            currentShape = 'circle';
            currentDiameter = diameter;
            setCanvasDimensions(currentShape, currentDiameter); // Para el círculo, ambas dimensiones son el diámetro+margen
        }
    });

    colorPicker.addEventListener('input', (e) => {
        penColor = e.target.value;
        messageDisplay.textContent = `¡Listo para dibujar! Pincel actual: ${penSize}px, Color: ${penColor}`;
    });

    penSizeSlider.addEventListener('input', (e) => {
        penSize = parseInt(e.target.value);
        penSizeValue.textContent = penSize; // Actualiza el valor mostrado
        messageDisplay.textContent = `¡Listo para dibujar! Pincel actual: ${penSize}px, Color: ${penColor}`;
    });

    clearCanvasBtn.addEventListener('click', () => {
        const confirmClear = confirm("¿Estás seguro que quieres limpiar el canvas?");
        if (confirmClear) {
            // Redibujar la forma base según la última selección
            if (currentShape === 'rectangle') {
                setCanvasDimensions(currentShape, currentWidth, currentHeight);
            } else {
                setCanvasDimensions(currentShape, currentDiameter);
            }
            messageDisplay.textContent = "El canvas ha sido limpiado. ¡Dibuja de nuevo!";
        }
    });

    saveDesignBtn.addEventListener('click', () => {
        // Crea un enlace temporal para descargar la imagen del canvas
        const link = document.createElement('a');
        link.download = `diseño_madera_${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png'); // Convierte el canvas a una URL de imagen
        link.click();
        messageDisplay.textContent = "Diseño guardado exitosamente.";
    });

    sendEmailBtn.addEventListener('click', () => {
        // En un entorno web real, esto requeriría un backend (servidor) para enviar el correo.
        // El navegador por sí solo no puede enviar correos directamente por seguridad.
        
        // Aquí se mostraría un mensaje o se podría enviar la imagen a un servidor:
        const emailAddress = prompt("Introduce tu dirección de correo (opcional, para enviar el diseño):");
        if (emailAddress) {
            // Convertir el canvas a un formato de imagen (base64)
            const imageData = canvas.toDataURL('image/png'); 
            
            // Aquí iría el código para enviar 'imageData' al servidor
            // y el servidor se encargaría de adjuntarlo y enviarlo por correo.
            
            alert(`El diseño se prepararía para enviar a ${emailAddress}.\n\nPara el envío real, se necesitaría un servidor web (backend) que gestione el envío de correos.`);
            messageDisplay.textContent = "Funcionalidad de correo requiere un servidor. Ver consola para más detalles.";
            console.log("Datos de la imagen para enviar:", imageData.substring(0, 50) + "..."); // Muestra solo el principio
        } else {
            alert("Envío de correo cancelado.");
        }
    });
});