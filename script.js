/* LOADER */
window.addEventListener("load", () => {
    const loader = document.getElementById("loader");
    setTimeout(() => {
        loader.style.opacity = "0";
        setTimeout(() => loader.style.display = "none", 500);
    }, 800);
});

/* ELEMENTOS CAROUSEL */
const cards = document.querySelectorAll(".card");
const leftBtn = document.querySelector(".left");
const rightBtn = document.querySelector(".right");

let index = 0;
let gaugesAnimated = false;

/* CAROUSEL LOGIC */
function updateCarousel() {
    cards.forEach((card, i) => {
        card.classList.remove("active", "left-pos", "right-pos", "hidden");

        if (i === index) {
            card.classList.add("active");
        } else if (i === (index - 1 + cards.length) % cards.length) {
            card.classList.add("left-pos");
        } else if (i === (index + 1) % cards.length) {
            card.classList.add("right-pos");
        } else {
            card.classList.add("hidden");
        }
    });

    const activeCard = cards[index];
    const color = activeCard.dataset.color;
    
    // Gradiente de fondo dinámico
    document.body.style.background = `radial-gradient(circle at center, ${color}, #000 90%)`;

    updateGauge(activeCard);
    animateNumbers(activeCard);
}

/* BOTONES - CORREGIDOS */
if (rightBtn) {
    rightBtn.addEventListener("click", () => {
        index = (index + 1) % cards.length;
        updateCarousel();
    });
}

if (leftBtn) {
    leftBtn.addEventListener("click", () => {
        index = (index - 1 + cards.length) % cards.length;
        updateCarousel();
    });
}


/* GAUGE ANIMATION */
function updateGauge(card) {
    const gauge = card.querySelector(".gauge");
    if (!gauge) return;

    const speed = parseFloat(gauge.dataset.speed);
    const progress = gauge.querySelector(".progress");
    const needle = gauge.querySelector(".needle");

    let percent = (1 - (speed - 3) / 3) * 100;
    percent = Math.max(0, Math.min(100, percent));

    const offset = 141 - (percent / 100) * 141;
    progress.style.strokeDashoffset = offset;

    const angle = -90 + (percent / 100) * 180;
    needle.style.transform = `rotate(${angle}deg)`;
}

/* NÚMEROS ANIMADOS */
function animateNumbers(card) {
    const numbers = card.querySelectorAll(".num");
    
    numbers.forEach(num => {
        const target = parseFloat(num.getAttribute("data-target"));
        const isDecimal = target % 1 !== 0;
        let current = 0;
        const duration = 800; 
        const start = performance.now();

        function step(timestamp) {
            const progress = Math.min((timestamp - start) / duration, 1);
            current = progress * target;
            
            num.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);

            if (progress < 1) {
                requestAnimationFrame(step);
            }
        }
        requestAnimationFrame(step);
    });
}

/* SCROLL EFFECTS */
window.addEventListener("scroll", () => {
    const section = document.querySelector(".models");
    const header = document.querySelector(".header");
    
    if (section) {
        const rect = section.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.8) {
            section.classList.add("visible");
            if (!gaugesAnimated) {
                updateCarousel();
                gaugesAnimated = true;
            }
        }
    }

    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
});

/* INICIALIZACIÓN */
updateCarousel();

function updateCarousel() {
    cards.forEach((card, i) => {
        card.classList.remove("active", "left-pos", "right-pos", "hidden");
        
        // Efecto de opacidad para el texto
        const info = card.querySelector('.info');
        if(info) info.style.opacity = "0";

        if (i === index) {
            card.classList.add("active");
            setTimeout(() => { if(info) info.style.opacity = "1"; }, 300);
        } else if (i === (index - 1 + cards.length) % cards.length) {
            card.classList.add("left-pos");
        } else if (i === (index + 1) % cards.length) {
            card.classList.add("right-pos");
        } else {
            card.classList.add("hidden");
        }
    });

    const activeCard = cards[index];
    const color = activeCard.dataset.color;
    document.body.style.background = `radial-gradient(circle at center, ${color}, #000 85%)`;

    updateGauge(activeCard);
    animateNumbers(activeCard); // Llamamos a la animación de números
}

/* ANIMACIÓN DE NÚMEROS (MODIFICADA) */
function animateNumbers(card) {
    card.querySelectorAll(".num").forEach(num => {
        const target = parseFloat(num.getAttribute("data-target"));
        const isDecimal = target % 1 !== 0;
        let start = performance.now();

        function step(timestamp) {
            let progress = Math.min((timestamp - start) / 800, 1);
            let current = progress * target;
            num.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
            if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
    });
}

/* LÓGICA DE LA SECCIÓN DE INGENIERÍA */
const engPanel = document.getElementById('engineering-panel');
const closeEng = document.querySelector('.close-eng');
const engButtons = document.querySelectorAll('.btn-more');

const carSpecs = {
    "BMW M4": {
        motor: "6 cilindros en línea M TwinPower Turbo",
        speed: "250 km/h (Limitada)",
        chassis: "Suspensión M adaptativa y diferencial activo",
        desc: "El BMW M4 Competition combina un motor de 503 HP con una transmisión de 8 velocidades para una respuesta inmediata en pista y carretera."
    },
    "BMW i8": {
        motor: "Híbrido enchufable (Eléctrico + 1.5L Turbo)",
        speed: "250 km/h",
        chassis: "Arquitectura LifeDrive con fibra de carbono",
        desc: "Un icono del diseño que utiliza un chasis de aluminio y una célula de pasajeros de polímero reforzado con fibra de carbono (CFRP)."
    },
    "BMW X6": {
        motor: "V8 BMW TwinPower Turbo / 6 en línea",
        speed: "243 km/h",
        chassis: "Tracción integral xDrive inteligente",
        desc: "El Sports Activity Coupé por excelencia, combinando la presencia de un SUV con la agilidad de un deportivo de lujo."
    }
};

engButtons.forEach(btn => {
    btn.addEventListener('click', () => {
        const card = btn.closest('.card');
        const carName = card.querySelector('h3').innerText;
        const specs = carSpecs[carName];

        if (specs) {
            document.getElementById('eng-title').innerText = carName;
            document.getElementById('eng-motor').innerText = specs.motor;
            document.getElementById('eng-speed').innerText = specs.speed;
            document.getElementById('eng-chassis').innerText = specs.chassis;
            document.getElementById('eng-desc').innerText = specs.desc;
            
            engPanel.classList.add('active');
        }
    });
});

closeEng.addEventListener('click', () => {
    engPanel.classList.remove('active');
});

// Cerrar si hace clic fuera del contenido
engPanel.addEventListener('click', (e) => {
    if (e.target === engPanel) engPanel.classList.remove('active');
});

const specData = {
    propulsion: `
        <div class="spec-grid-details">
            <div class="detail-item">
                <h4>Configuración</h4>
                <p>Motor Dual Eléctrico (AWD)</p>
            </div>
            <div class="detail-item">
                <h4>Potencia Máxima</h4>
                <p>750 kW (1020 CV)</p>
            </div>
            <div class="detail-item">
                <h4>Aceleración</h4>
                <p>0-100 km/h en 2.1s</p>
            </div>
            <div class="detail-item">
                <h4>Velocidad Máxima</h4>
                <p>322 km/h</p>
            </div>
        </div>
    `,
    autonomia: `
        <div class="spec-grid-details">
            <div class="detail-item">
                <h4>Estimación WLTP</h4>
                <p>Hasta 634 km</p>
            </div>
            <div class="detail-item">
                <h4>Capacidad de Batería</h4>
                <p>100 kWh</p>
            </div>
            <div class="detail-item">
                <h4>Carga Rápida (DC)</h4>
                <p>250 kW Max</p>
            </div>
            <div class="detail-item">
                <h4>Tiempo de Recarga</h4>
                <p>15 min para 282 km</p>
            </div>
        </div>
    `,
    dinamica: `
        <div class="spec-grid-details">
            <div class="detail-item">
                <h4>Suspensión</h4>
                <p>Neumática Adaptativa Inteligente</p>
            </div>
            <div class="detail-item">
                <h4>Coeficiente Drag</h4>
                <p>0.208 Cd</p>
            </div>
            <div class="detail-item">
                <h4>Frenos</h4>
                <p>Pistones Múltiples Carbocerámicos</p>
            </div>
            <div class="detail-item">
                <h4>Distribución de Peso</h4>
                <p>48% Delante / 52% Detrás</p>
            </div>
        </div>
    `
};

function switchSpec(type) {
    const buttons = document.querySelectorAll('.tab-btn');
    const panel = document.getElementById('spec-info');
    
    buttons.forEach(btn => btn.classList.remove('active'));
    event.currentTarget.classList.add('active');
    
    panel.style.opacity = 0;
    panel.style.transform = 'translateY(10px)';
    
    setTimeout(() => {
        panel.innerHTML = specData[type];
        panel.style.opacity = 1;
        panel.style.transform = 'translateY(0)';
    }, 300);
}function changeVehicleColor(color, element) {
    const swatches = document.querySelectorAll('.swatch');
    const carImage = document.getElementById('concept-car-img');
    
    swatches.forEach(s => s.classList.remove('active'));
    element.classList.add('active');
    
    carImage.style.opacity = 0.3;
    carImage.style.transform = 'scale(0.98)';
    
    setTimeout(() => {
        if (color === 'white') {
            carImage.src = "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=800";
        } else if (color === 'blue') {
            carImage.src = "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?q=80&w=800"; // Simulación azul (puedes cambiarla después)
        } else if (color === 'black') {
            carImage.src = "https://images.unsplash.com/photo-1555215695-3004980ad54e?q=80&w=800"; // Simulación negro (puedes cambiarla después)
        }
        
        carImage.style.opacity = 0.8;
        carImage.style.transform = 'scale(1)';
    }, 350);
}