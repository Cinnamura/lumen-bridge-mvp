'use client';

import { CSSProperties, useEffect, useRef } from 'react';
import * as THREE from 'three';

type StitchTokenSceneProps = {
  className?: string;
  style?: CSSProperties;
};

export default function StitchTokenScene({ className, style }: StitchTokenSceneProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(width, height);
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();

    const cylinderGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const cylinderMat = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.3,
      shininess: 100,
    });
    const tokenBody = new THREE.Mesh(cylinderGeom, cylinderMat);
    tokenBody.rotation.x = Math.PI / 2;
    group.add(tokenBody);

    const ringGeom = new THREE.TorusGeometry(0.8, 0.1, 16, 100);
    const ringMat = new THREE.MeshPhongMaterial({ color: 0x10b981 });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    group.add(ring);

    scene.add(group);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x4f46e5, 1);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    camera.position.z = 4;

    let rafId = 0;
    const animate = () => {
      rafId = window.requestAnimationFrame(animate);
      group.rotation.y += 0.01;
      group.rotation.x += 0.005;
      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      const nextWidth = container.clientWidth || window.innerWidth;
      const nextHeight = container.clientHeight || window.innerHeight;
      camera.aspect = nextWidth / nextHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(nextWidth, nextHeight);
    };

    window.addEventListener('resize', onResize);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      renderer.dispose();
      cylinderGeom.dispose();
      cylinderMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
}
