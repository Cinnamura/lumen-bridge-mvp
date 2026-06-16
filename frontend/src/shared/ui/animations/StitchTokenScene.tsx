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

    // Use getBoundingClientRect for reliable size — not clientHeight which can be 0
    const rect = container.getBoundingClientRect();
    const width  = rect.width  > 0 ? rect.width  : container.offsetWidth  || 300;
    const height = rect.height > 0 ? rect.height : container.offsetHeight || 200;

    const scene    = new THREE.Scene();
    const camera   = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    // Pass false so Three.js does NOT set explicit CSS pixel dims on the canvas.
    // We size the canvas via CSS (position: absolute; inset: 0) so it fills the
    // container without ever creating a layout-breaking block.
    renderer.setSize(width, height, false);

    const canvas = renderer.domElement;
    canvas.style.position = 'absolute';
    canvas.style.top      = '0';
    canvas.style.left     = '0';
    canvas.style.width    = '100%';
    canvas.style.height   = '100%';
    container.appendChild(canvas);

    const group = new THREE.Group();

    const cylinderGeom = new THREE.CylinderGeometry(1.2, 1.2, 0.2, 32);
    const cylinderMat  = new THREE.MeshPhongMaterial({
      color: 0x4f46e5,
      transparent: true,
      opacity: 0.3,
      shininess: 100,
    });
    const tokenBody = new THREE.Mesh(cylinderGeom, cylinderMat);
    tokenBody.rotation.x = Math.PI / 2;
    group.add(tokenBody);

    const ringGeom = new THREE.TorusGeometry(0.8, 0.1, 16, 100);
    const ringMat  = new THREE.MeshPhongMaterial({ color: 0x10b981 });
    const ring     = new THREE.Mesh(ringGeom, ringMat);
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
      const r      = container.getBoundingClientRect();
      const nextW  = r.width  > 0 ? r.width  : container.offsetWidth  || 300;
      const nextH  = r.height > 0 ? r.height : container.offsetHeight || 200;
      camera.aspect = nextW / nextH;
      camera.updateProjectionMatrix();
      renderer.setSize(nextW, nextH, false);
    };

    // ResizeObserver keeps the render buffer in sync with the CSS-sized canvas.
    const ro = new ResizeObserver(onResize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(rafId);
      ro.disconnect();
      renderer.dispose();
      cylinderGeom.dispose();
      cylinderMat.dispose();
      ringGeom.dispose();
      ringMat.dispose();
      if (container.contains(canvas)) container.removeChild(canvas);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: 'relative',
        width:    '100%',
        height:   '100%',
        overflow: 'hidden',
        ...style,
      }}
    />
  );
}
