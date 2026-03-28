// --- Interactive Particle Background Animation ---
const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');
let width, height;
let particles = [];

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

const mouse = { x: null, y: null, radius: 150 };
window.addEventListener('mousemove', (e) => { mouse.x = e.x; mouse.y = e.y; });
window.addEventListener('mouseout', () => { mouse.x = null; mouse.y = null; });

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 1 - 0.5;
        this.speedY = Math.random() * 1 - 0.5;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > width || this.x < 0) this.speedX *= -1;
        if (this.y > height || this.y < 0) this.speedY *= -1;
    }
    draw() {
        const isLight = document.body.getAttribute('data-theme') === 'light';
        ctx.fillStyle = isLight ? 'rgba(37, 99, 235, 0.4)' : 'rgba(59, 130, 246, 0.6)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    const particleCount = (width * height) / 9000; 
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, width, height);
    const isLight = document.body.getAttribute('data-theme') === 'light';
    const baseColor = isLight ? '37, 99, 235' : '59, 130, 246';
    const hoverColor = isLight ? '147, 51, 234' : '168, 85, 247';
    
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 120) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${baseColor}, ${1 - distance/120})`;
                ctx.lineWidth = 0.5;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.stroke();
            }
        }

        if (mouse.x != null) {
            const dx = particles[i].x - mouse.x;
            const dy = particles[i].y - mouse.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < mouse.radius) {
                ctx.beginPath();
                ctx.strokeStyle = `rgba(${hoverColor}, ${1 - distance/mouse.radius})`;
                ctx.lineWidth = 1;
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(mouse.x, mouse.y);
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// --- Typewriter Effect ---
const textElement = document.getElementById('typewriter');
const roles = ["C Developer", "Web Developer", "Data Science Enthusiast", "Problem Solver"];
let roleIdx = 0;
let charIdx = 0;
let isDeleting = false;

function type() {
    const currentRole = roles[roleIdx];
    if (isDeleting) {
        textElement.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
    } else {
        textElement.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
    }

    let typeSpeed = isDeleting ? 40 : 100;

    if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typeSpeed = 2000; 
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typeSpeed = 500;
    }

    setTimeout(type, typeSpeed);
}

// --- Staggered Scroll Reveal ---
const observerOptions = { threshold: 0.1, rootMargin: "0px 0px -50px 0px" };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('reveal-visible');
            entry.target.classList.remove('reveal-hidden');
            
            const staggers = entry.target.querySelectorAll('.stagger-item');
            staggers.forEach((el, index) => {
                setTimeout(() => {
                    el.classList.add('reveal-visible');
                    el.classList.remove('reveal-hidden');
                    if(el.classList.contains('skill-category')) {
                        el.querySelectorAll('.progress-fill').forEach(bar => {
                            bar.style.width = bar.getAttribute('data-width');
                        });
                    }
                    if(el.querySelector('.stat-number')) {
                        startCounter(el.querySelector('.stat-number'));
                    }
                }, index * 150);
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.section').forEach(section => observer.observe(section));

function startCounter(counter) {
    if(counter.classList.contains('counted')) return;
    counter.classList.add('counted');
    const target = +counter.getAttribute('data-target');
    let count = 0;
    
    // Duration is set to 1000ms 
    const duration = 1000; 
    const startTime = performance.now();

    function updateCount(currentTime) {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 4);
        count = Math.floor(easeOut * target);
        counter.innerText = count + (progress === 1 ? "+" : "");
        if (progress < 1) requestAnimationFrame(updateCount);
    }
    requestAnimationFrame(updateCount);
}

// --- 3D Hover Tilt Effect ---
const tiltElements = document.querySelectorAll('.tilt-element');
tiltElements.forEach(el => {
    el.addEventListener('mousemove', e => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left; 
        const y = e.clientY - rect.top;  
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;
        el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    });
    el.addEventListener('mouseleave', () => {
        el.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    });
});

// --- Sticky Navbar & Scroll Top ---
window.addEventListener('scroll', () => {
    const nav = document.querySelector('nav');
    const scrollTop = document.getElementById('scroll-top');
    if (window.scrollY > 50) { nav.classList.add('sticky'); } 
    else { nav.classList.remove('sticky'); }
    if (window.scrollY > 500) { scrollTop.style.display = 'flex'; } 
    else { scrollTop.style.display = 'none'; }
});

document.getElementById('scroll-top').addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Dark/Light Mode ---
const themeBtn = document.getElementById('theme-btn');
themeBtn.addEventListener('click', () => {
    const body = document.body;
    const icon = themeBtn.querySelector('i');
    
    if (body.getAttribute('data-theme') === 'light') {
        body.removeAttribute('data-theme');
        icon.classList.replace('fa-sun', 'fa-moon');
    } else {
        body.setAttribute('data-theme', 'light');
        icon.classList.replace('fa-moon', 'fa-sun');
    }
});

// --- Initialization Sequence ---
window.onload = () => { 
    // Intro animation timer
    setTimeout(() => {
        document.getElementById('intro-screen').classList.add('hide-intro');
        document.body.classList.remove('no-scroll');
        
        // Start typing effect only after intro finishes
        setTimeout(type, 500);
    }, 2200); 
};