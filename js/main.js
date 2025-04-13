import SceneManager from './three-scene.js';
import UIManager from './ui-manager.js';

document.addEventListener('DOMContentLoaded', () => {
    // Initialize 3D scene
    const sceneManager = new SceneManager();
    
    // Initialize UI
    const uiManager = new UIManager();
    
    // Initialize first section as visible
    document.querySelector('.section').classList.add('visible');
}); 