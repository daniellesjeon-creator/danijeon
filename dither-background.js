// Configuration
const config = {
    waveColor: [0.9, 0.9, 0.9], // Very light grey for the waves (even lighter)
    baseColor: [0.75, 0.75, 0.75], // Light grey for the base background
    disableAnimation: false,
    enableMouseInteraction: true,
    mouseRadius: 0.2,
    colorNum: 4,
    waveAmplitude: 0.3,
    waveFrequency: 3,
    waveSpeed: 0.05,
    pixelSize: 2
};

// Combined shader with dither effect built-in
const waveVertexShader = `
precision highp float;
varying vec2 vUv;

void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    vec4 viewPosition = viewMatrix * modelPosition;
    gl_Position = projectionMatrix * viewPosition;
}
`;

const waveFragmentShader = `
precision highp float;

uniform vec2 resolution;
uniform float time;
uniform float waveSpeed;
uniform float waveFrequency;
uniform float waveAmplitude;
uniform vec3 waveColor;
uniform vec2 mousePos;
uniform int enableMouseInteraction;
uniform float mouseRadius;
uniform float colorNum;
uniform float pixelSize;

varying vec2 vUv;

vec4 mod289(vec4 x) { return x - floor(x * (1.0/289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x * 34.0) + 1.0) * x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
vec2 fade(vec2 t) { return t*t*t*(t*(t*6.0-15.0)+10.0); }

float cnoise(vec2 P) {
    vec4 Pi = floor(P.xyxy) + vec4(0.0,0.0,1.0,1.0);
    vec4 Pf = fract(P.xyxy) - vec4(0.0,0.0,1.0,1.0);
    Pi = mod289(Pi);
    vec4 ix = Pi.xzxz;
    vec4 iy = Pi.yyww;
    vec4 fx = Pf.xzxz;
    vec4 fy = Pf.yyww;
    vec4 i = permute(permute(ix) + iy);
    vec4 gx = fract(i * (1.0/41.0)) * 2.0 - 1.0;
    vec4 gy = abs(gx) - 0.5;
    vec4 tx = floor(gx + 0.5);
    gx = gx - tx;
    vec2 g00 = vec2(gx.x, gy.x);
    vec2 g10 = vec2(gx.y, gy.y);
    vec2 g01 = vec2(gx.z, gy.z);
    vec2 g11 = vec2(gx.w, gy.w);
    vec4 norm = taylorInvSqrt(vec4(dot(g00,g00), dot(g01,g01), dot(g10,g10), dot(g11,g11)));
    g00 *= norm.x; g01 *= norm.y; g10 *= norm.z; g11 *= norm.w;
    float n00 = dot(g00, vec2(fx.x, fy.x));
    float n10 = dot(g10, vec2(fx.y, fy.y));
    float n01 = dot(g01, vec2(fx.z, fy.z));
    float n11 = dot(g11, vec2(fx.w, fy.w));
    vec2 fade_xy = fade(Pf.xy);
    vec2 n_x = mix(vec2(n00, n01), vec2(n10, n11), fade_xy.x);
    return 2.3 * mix(n_x.x, n_x.y, fade_xy.y);
}

const int OCTAVES = 4;
float fbm(vec2 p) {
    float value = 0.0;
    float amp = 1.0;
    float freq = waveFrequency;
    for (int i = 0; i < OCTAVES; i++) {
        value += amp * abs(cnoise(p));
        p *= freq;
        amp *= waveAmplitude;
    }
    return value;
}

float pattern(vec2 p) {
    vec2 p2 = p - time * waveSpeed;
    return fbm(p + fbm(p2)); 
}

const float bayerMatrix8x8[64] = float[64](
    0.0/64.0, 48.0/64.0, 12.0/64.0, 60.0/64.0,  3.0/64.0, 51.0/64.0, 15.0/64.0, 63.0/64.0,
    32.0/64.0,16.0/64.0, 44.0/64.0, 28.0/64.0, 35.0/64.0,19.0/64.0, 47.0/64.0, 31.0/64.0,
    8.0/64.0, 56.0/64.0,  4.0/64.0, 52.0/64.0, 11.0/64.0,59.0/64.0,  7.0/64.0, 55.0/64.0,
    40.0/64.0,24.0/64.0, 36.0/64.0, 20.0/64.0, 43.0/64.0,27.0/64.0, 39.0/64.0, 23.0/64.0,
    2.0/64.0, 50.0/64.0, 14.0/64.0, 62.0/64.0,  1.0/64.0,49.0/64.0, 13.0/64.0, 61.0/64.0,
    34.0/64.0,18.0/64.0, 46.0/64.0, 30.0/64.0, 33.0/64.0,17.0/64.0, 45.0/64.0, 29.0/64.0,
    10.0/64.0,58.0/64.0,  6.0/64.0, 54.0/64.0,  9.0/64.0,57.0/64.0,  5.0/64.0, 53.0/64.0,
    42.0/64.0,26.0/64.0, 38.0/64.0, 22.0/64.0, 41.0/64.0,25.0/64.0, 37.0/64.0, 21.0/64.0
);

vec3 dither(vec2 uv, vec3 color) {
    vec2 scaledCoord = floor(uv * resolution / pixelSize);
    int x = int(mod(scaledCoord.x, 8.0));
    int y = int(mod(scaledCoord.y, 8.0));
    float threshold = bayerMatrix8x8[y * 8 + x] - 0.25;
    float step = 1.0 / (colorNum - 1.0);
    color += threshold * step;
    float bias = 0.2;
    color = clamp(color - bias, 0.0, 1.0);
    return floor(color * (colorNum - 1.0) + 0.5) / (colorNum - 1.0);
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    uv -= 0.5;
    uv.x *= resolution.x / resolution.y;
    float f = pattern(uv);
    
    if (enableMouseInteraction == 1) {
        vec2 mouseNDC = (mousePos / resolution - 0.5) * vec2(1.0, -1.0);
        mouseNDC.x *= resolution.x / resolution.y;
        float dist = length(uv - mouseNDC);
        float effect = 1.0 - smoothstep(0.0, mouseRadius, dist);
        f -= 0.5 * effect;
    }
    
    // Mix from light grey base to even lighter grey waves
    vec3 baseGrey = vec3(0.75, 0.75, 0.75); // Light grey background
    vec3 col = mix(baseGrey, waveColor, f);
    
    // Apply dither effect
    col = dither(gl_FragCoord.xy, col);
    
    gl_FragColor = vec4(col, 1.0);
}
`;

// Main initialization
let scene, camera, renderer;
let waveMesh, waveUniforms;
let mousePos = new THREE.Vector2(0, 0);
let clock = new THREE.Clock();

function init() {
    const container = document.getElementById('dither-background');
    if (!container) {
        console.error('Dither background container not found');
        return;
    }

    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const width = container.clientWidth;
    const height = container.clientHeight;
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    const canvas = renderer.domElement;
    container.appendChild(canvas);

    // Wave uniforms
    const dpr = renderer.getPixelRatio();
    waveUniforms = {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2(width * dpr, height * dpr) },
        waveSpeed: { value: config.waveSpeed },
        waveFrequency: { value: config.waveFrequency },
        waveAmplitude: { value: config.waveAmplitude },
        waveColor: { value: new THREE.Color(...config.waveColor) },
        mousePos: { value: new THREE.Vector2(0, 0) },
        enableMouseInteraction: { value: config.enableMouseInteraction ? 1 : 0 },
        mouseRadius: { value: config.mouseRadius },
        colorNum: { value: config.colorNum },
        pixelSize: { value: config.pixelSize }
    };

    // Create wave plane
    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
        vertexShader: waveVertexShader,
        fragmentShader: waveFragmentShader,
        uniforms: waveUniforms
    });
    waveMesh = new THREE.Mesh(geometry, material);
    scene.add(waveMesh);

    // Mouse interaction - listen on hero section so it works even over text
    if (config.enableMouseInteraction) {
        // Find the hero section (parent of the dither container)
        const heroSection = container.closest('.hero');
        
        if (heroSection) {
            // Listen on hero section to capture mouse even when over text
            heroSection.addEventListener('mousemove', onMouseMove);
            heroSection.addEventListener('mouseleave', onMouseLeave);
        }
        
        // Also listen on container and canvas as backup
        container.addEventListener('mousemove', onMouseMove);
        container.addEventListener('mouseleave', onMouseLeave);
        canvas.addEventListener('mousemove', onMouseMove);
    }

    // Handle resize
    window.addEventListener('resize', onWindowResize);

    // Start animation
    animate();
}

function onMouseMove(event) {
    const container = document.getElementById('dither-background');
    if (!container || !renderer) return;
    
    // Get the container's position relative to viewport
    const rect = container.getBoundingClientRect();
    const dpr = renderer.getPixelRatio();
    
    // Calculate mouse position relative to container
    // This works even if the event came from the hero section
    const x = (event.clientX - rect.left) * dpr;
    const y = (event.clientY - rect.top) * dpr;
    
    mousePos.set(x, y);
    waveUniforms.mousePos.value.copy(mousePos);
}

function onMouseLeave(event) {
    // Reset mouse position when leaving the area
    // This prevents the effect from staying at the edge
    mousePos.set(-1000, -1000);
    if (waveUniforms) {
        waveUniforms.mousePos.value.copy(mousePos);
    }
}

function onWindowResize() {
    const container = document.getElementById('dither-background');
    if (!container || !renderer) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    renderer.setSize(width, height);
    waveUniforms.resolution.value.set(width * renderer.getPixelRatio(), height * renderer.getPixelRatio());
    
}

function animate() {
    requestAnimationFrame(animate);

    if (!config.disableAnimation) {
        waveUniforms.time.value = clock.getElapsedTime();
    }

    renderer.render(scene, camera);
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
