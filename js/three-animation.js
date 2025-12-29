function initThreeAnimation() {
    const canvas = document.getElementById('threeCanvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, 500 / 400, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(500, 400);
    renderer.setClearColor(0xffffff, 0);
    
    const material = new THREE.LineBasicMaterial({ color: 0x000000 });
    const nodes = [];
    const connections = [];
    
    // Create nodes
    for (let i = 0; i < 20; i++) {
        const geometry = new THREE.SphereGeometry(0.1, 8, 8);
        const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ color: 0x000000 }));
        
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const radius = 1.5 + Math.random() * 0.5;
        
        mesh.position.x = radius * Math.sin(phi) * Math.cos(theta);
        mesh.position.y = radius * Math.sin(phi) * Math.sin(theta);
        mesh.position.z = radius * Math.cos(phi);
        
        mesh.userData.originalPos = mesh.position.clone();
        mesh.userData.phase = Math.random() * Math.PI * 2;
        
        nodes.push(mesh);
        scene.add(mesh);
    }
    
    // Create connections
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            const distance = nodes[i].position.distanceTo(nodes[j].position);
            if (distance < 1.2) {
                const points = [nodes[i].position, nodes[j].position];
                const geometry = new THREE.BufferGeometry().setFromPoints(points);
                const line = new THREE.Line(geometry, material);
                line.userData.nodeA = i;
                line.userData.nodeB = j;
                connections.push(line);
                scene.add(line);
            }
        }
    }
    
    // Core
    const coreGeometry = new THREE.SphereGeometry(0.5, 16, 16);
    const coreMaterial = new THREE.MeshBasicMaterial({ color: 0x000000, wireframe: true });
    const core = new THREE.Mesh(coreGeometry, coreMaterial);
    scene.add(core);
    
    camera.position.z = 5;
    
    let time = 0;
    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;
        
        nodes.forEach((node) => {
            const pulse = Math.sin(time * 2 + node.userData.phase) * 0.1;
            node.position.x = node.userData.originalPos.x * (1 + pulse);
            node.position.y = node.userData.originalPos.y * (1 + pulse);
            node.position.z = node.userData.originalPos.z * (1 + pulse);
            
            const scale = 1 + Math.sin(time * 3 + node.userData.phase) * 0.2;
            node.scale.set(scale, scale, scale);
        });
        
        connections.forEach(connection => {
            const nodeA = nodes[connection.userData.nodeA];
            const nodeB = nodes[connection.userData.nodeB];
            const points = [nodeA.position, nodeB.position];
            connection.geometry.setFromPoints(points);
        });
        
        core.rotation.x += 0.01;
        core.rotation.y += 0.015;
        
        camera.position.x = Math.sin(time * 0.3) * 0.5;
        camera.lookAt(0, 0, 0);
        
        renderer.render(scene, camera);
    }
    
    animate();
}
