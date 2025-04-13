import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

class SceneManager {
    constructor() {
        this.initialize();
        this.createLights();
        this.createParticles();
        this.createGeometries();
        this.setupEventListeners();
        this.animate();
    }

    initialize() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.querySelector('#scene'),
            antialias: true,
            alpha: true
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.camera.position.z = 12;
        this.camera.fov = 60;
        this.camera.updateProjectionMatrix();

        this.mouseX = 0;
        this.mouseY = 0;
        this.scrollY = window.scrollY;
    }

    createLights() {
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(2, 2, 5);
        this.scene.add(directionalLight);

        this.pointLight1 = new THREE.PointLight(0x00ffff, 1, 100);
        this.pointLight1.position.set(5, 5, 5);
        this.scene.add(this.pointLight1);

        this.pointLight2 = new THREE.PointLight(0xff00ff, 1, 100);
        this.pointLight2.position.set(-5, -5, 5);
        this.scene.add(this.pointLight2);
    }

    createParticles() {
        const particleGeometry = new THREE.BufferGeometry();
        const particleCount = 2000;
        const posArray = new Float32Array(particleCount * 3);

        for(let i = 0; i < particleCount * 3; i++) {
            posArray[i] = (Math.random() - 0.5) * 75;
        }

        particleGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.08,
            color: 0x00ffff,
            transparent: true,
            opacity: 0.6
        });

        this.particleSystem = new THREE.Points(particleGeometry, particleMaterial);
        this.scene.add(this.particleSystem);
    }

    createGeometries() {
        const geometries = [
            new THREE.TorusKnotGeometry(3, 1, 200, 32, 3, 4),
            new THREE.IcosahedronGeometry(3, 1),
            new THREE.TorusGeometry(3, 1, 32, 200),
            new THREE.SphereGeometry(3, 64, 64),
            new THREE.OctahedronGeometry(3, 2),
            new THREE.DodecahedronGeometry(3, 1),
            new THREE.ConeGeometry(3, 6, 64, 4, true),
            new THREE.RingGeometry(2, 4, 64, 8)
        ];

        const material = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            wireframe: true,
            wireframeLinewidth: 2,
            emissive: 0x00ffff,
            emissiveIntensity: 0.6,
            metalness: 0.8,
            roughness: 0.2,
            reflectivity: 0.9,
            clearcoat: 1.0,
            clearcoatRoughness: 0.1,
            side: THREE.DoubleSide
        });

        this.meshes = geometries.map(geometry => {
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.z = -12;
            
            const glowMaterial = new THREE.MeshPhysicalMaterial({
                color: 0x00ffff,
                wireframe: true,
                wireframeLinewidth: 1,
                transparent: true,
                opacity: 0.2,
                side: THREE.BackSide
            });
            
            const glowMesh = new THREE.Mesh(geometry, glowMaterial);
            glowMesh.scale.multiplyScalar(1.1);
            mesh.add(glowMesh);
            
            this.scene.add(mesh);
            return mesh;
        });
    }

    setupEventListeners() {
        window.addEventListener('resize', () => {
            this.camera.aspect = window.innerWidth / window.innerHeight;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(window.innerWidth, window.innerHeight);
        });

        document.addEventListener('mousemove', (event) => {
            this.mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            this.mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        });

        window.addEventListener('scroll', () => {
            this.scrollY = window.scrollY;
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());

        const time = Date.now() * 0.001;
        
        // Particle animation
        this.particleSystem.rotation.x += 0.0002;
        this.particleSystem.rotation.y += 0.0002;

        // Light animation
        this.pointLight1.position.x = Math.sin(time) * 5;
        this.pointLight1.position.y = Math.cos(time) * 5;
        this.pointLight2.position.x = Math.sin(time + Math.PI) * 5;
        this.pointLight2.position.y = Math.cos(time + Math.PI) * 5;

        // Mesh animations
        this.meshes.forEach((mesh, index) => {
            mesh.rotation.x += 0.002;
            mesh.rotation.y += 0.003;
            mesh.rotation.z += 0.001;
            
            mesh.visible = Math.floor(this.scrollY / window.innerHeight) === index;
            
            mesh.position.y = Math.sin(time) * 0.5;
            mesh.position.x += (this.mouseX * 0.3 - mesh.position.x) * 0.05;
            mesh.rotation.y += (this.mouseX * 0.3 - mesh.rotation.y) * 0.05;

            const scale = 1 + Math.sin(time * 2) * 0.1;
            mesh.scale.set(scale, scale, scale);

            const glowMesh = mesh.children[0];
            glowMesh.rotation.x -= 0.001;
            glowMesh.rotation.y -= 0.002;
        });

        this.renderer.render(this.scene, this.camera);
    }
}

export default SceneManager; 