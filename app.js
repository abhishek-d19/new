/* Label NUVI - 3D Engine & Interactive Logic */
/* LABEL NUVI - Interactive JavaScript Engine & Redesign Script */
document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }
    // Wait for custom fonts to load so canvas text measures and renders correctly
    // Wait for custom fonts to load so layout renders correctly
    if (document.fonts) {
        document.fonts.ready.then(() => {
            initApp();
        });
    } else {
        setTimeout(initApp, 800);
        setTimeout(initApp, 600);
    }
});
function initApp() {
    // ----------------------------------------------------
    // 1. THREE.JS INITIALIZATION
    // 1. CUSTOM CURSOR TRACKING & LERP
    // ----------------------------------------------------
    const container = document.getElementById('canvas-container');
    if (!container) return;
    const scene = new THREE.Scene();
    const customCursor = document.getElementById('custom-cursor');
    const cursorText = customCursor ? customCursor.querySelector('.cursor-text') : null;
    
    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.z = 10;
    let cursorX = 0, cursorY = 0;
    let targetX = 0, targetY = 0;
    let isMoving = false;
    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0); // Transparent background
    container.appendChild(renderer.domElement);
    // Group to hold cylinders for overall rotation & parallax
    const cylinderGroup = new THREE.Group();
    scene.add(cylinderGroup);
    // ----------------------------------------------------
    // 2. DYNAMIC TEXT TEXTURE CREATION
    // ----------------------------------------------------
    function createSeamlessTextTexture(text, styleType) {
        const tempCanvas = document.createElement('canvas');
        const tempCtx = tempCanvas.getContext('2d');
    window.addEventListener('mousemove', (e) => {
        targetX = e.clientX;
        targetY = e.clientY;
