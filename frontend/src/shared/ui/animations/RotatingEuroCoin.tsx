"use client";

/**
 * RotatingEuroCoin
 * -----------------------------------------------------------------------
 * A premium, fully procedural 3D Euro coin built with Three.js — no .gltf,
 * .obj, or image files. Geometry is built from primitives (ExtrudeGeometry
 * for the bevelled gold ring, CylinderGeometry for the dark core disc) and
 * all face artwork (the "€" glyph, EU star ring, milled edge, neon halo)
 * is drawn at runtime onto <canvas> elements and used as CanvasTexture.
 *
 * Install dependency (peer to Next.js):
 *   npm install three
 *
 * Usage:
 *   <RotatingEuroCoin className="w-72 h-72 mx-auto" />
 * -----------------------------------------------------------------------
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface RotatingEuroCoinProps {
  /** Tailwind (or any) classes used to size/position the canvas container. */
  className?: string;
}

export default function RotatingEuroCoin({ className }: RotatingEuroCoinProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // ------------------------------------------------------------------
    // Renderer / Scene / Camera
    // ------------------------------------------------------------------
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    // ------------------------------------------------------------------
    // Procedural studio environment — gives metalness/clearcoat something
    // to reflect without ever loading an external HDRI/image file.
    // ------------------------------------------------------------------
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envRenderTarget = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envRenderTarget.texture;

    // ------------------------------------------------------------------
    // Lights — neutral key light + gold/cyan accent points for the
    // fintech-neon rim lighting look.
    // ------------------------------------------------------------------
    const ambient = new THREE.AmbientLight(0x404050, 0.6);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight(0xfff2da, 2.2);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);

    const rimLightGold = new THREE.PointLight(0xffc97a, 6, 12, 2);
    rimLightGold.position.set(-3, 1, 3);
    scene.add(rimLightGold);

    const rimLightCyan = new THREE.PointLight(0x35e8ff, 5, 12, 2);
    rimLightCyan.position.set(2, -2, -3);
    scene.add(rimLightCyan);

    // ==================================================================
    // Procedural texture builders (canvas only — zero external assets)
    // ==================================================================
    function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
      ctx.save();
      ctx.translate(x, y);
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const outerAngle = ((18 + i * 72) * Math.PI) / 180;
        const innerAngle = ((54 + i * 72) * Math.PI) / 180;
        ctx.lineTo(Math.cos(outerAngle) * r, -Math.sin(outerAngle) * r);
        ctx.lineTo(Math.cos(innerAngle) * r * 0.5, -Math.sin(innerAngle) * r * 0.5);
      }
      ctx.closePath();
      ctx.fillStyle = color;
      ctx.fill();
      ctx.restore();
    }

    /** Obverse face: glowing "€" glyph ringed by 12 EU-style stars. */
    function createFrontFaceTexture(): THREE.CanvasTexture {
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#10131a";
      ctx.fillRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;

      ctx.strokeStyle = "rgba(216,177,92,0.5)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.4, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2;
        const sx = cx + Math.cos(angle) * size * 0.43;
        const sy = cy + Math.sin(angle) * size * 0.43;
        drawStar(ctx, sx, sy, size * 0.014, "#d8b15c");
      }

      ctx.save();
      ctx.shadowColor = "#39e6ff";
      ctx.shadowBlur = size * 0.05;
      ctx.fillStyle = "#9af6ff";
      ctx.font = `700 ${size * 0.34}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("€", cx, cy + size * 0.01);
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    /** Reverse face: dot ring + year mark, echoing a real coin's reverse. */
    function createBackFaceTexture(): THREE.CanvasTexture {
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#10131a";
      ctx.fillRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;

      ctx.strokeStyle = "rgba(216,177,92,0.5)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(cx, cy, size * 0.46, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 36; i++) {
        const angle = (i / 36) * Math.PI * 2;
        const dx = cx + Math.cos(angle) * size * 0.38;
        const dy = cy + Math.sin(angle) * size * 0.38;
        ctx.beginPath();
        ctx.arc(dx, dy, size * 0.006, 0, Math.PI * 2);
        ctx.fillStyle = "#d8b15c";
        ctx.fill();
      }

      ctx.save();
      ctx.shadowColor = "#d8b15c";
      ctx.shadowBlur = size * 0.04;
      ctx.fillStyle = "#f3d99a";
      ctx.font = `700 ${size * 0.16}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("2026", cx, cy);
      ctx.restore();

      const texture = new THREE.CanvasTexture(canvas);
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    }

    /** Tileable vertical stripes used as a roughnessMap to fake a milled coin edge. */
    function createMilledEdgeTexture(): THREE.CanvasTexture {
      const w = 256;
      const h = 32;
      const canvas = document.createElement("canvas");
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext("2d")!;
      ctx.fillStyle = "#888888";
      ctx.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 4) {
        ctx.fillStyle = x % 8 === 0 ? "#3f3f3f" : "#bdbdbd";
        ctx.fillRect(x, 0, 2, h);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.set(80, 1);
      return texture;
    }

    /** Soft radial gradient used for the neon backlight halo behind the coin. */
    function createRadialGlowTexture(): THREE.CanvasTexture {
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, "rgba(255,255,255,0.9)");
      gradient.addColorStop(0.4, "rgba(57,230,255,0.35)");
      gradient.addColorStop(1, "rgba(57,230,255,0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(canvas);
    }

    // ==================================================================
    // Coin geometry — bi-metal construction: a bevelled gold outer ring
    // (Shape + hole, extruded) fused with a dark metallic core disc
    // (Cylinder) whose two caps carry the procedural face artwork.
    // ==================================================================
    const coinGroup = new THREE.Group();
    scene.add(coinGroup);

    const OUTER_RADIUS = 1.55;
    const INNER_RADIUS = 1.18;
    const THICKNESS = 0.16;

    // --- Gold ring: a circle Shape with a circular hole, extruded with a bevel ---
    const ringShape = new THREE.Shape();
    ringShape.absarc(0, 0, OUTER_RADIUS, 0, Math.PI * 2, false);
    const ringHole = new THREE.Path();
    ringHole.absarc(0, 0, INNER_RADIUS, 0, Math.PI * 2, true);
    ringShape.holes.push(ringHole);

    const ringGeometry = new THREE.ExtrudeGeometry(ringShape, {
      depth: THICKNESS,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.025,
      bevelSegments: 4,
      curveSegments: 96,
    });
    ringGeometry.translate(0, 0, -THICKNESS / 2); // center the ring on the Z axis

    const edgeTexture = createMilledEdgeTexture();
    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#d8b15c"),
      metalness: 1,
      roughness: 0.32,
      roughnessMap: edgeTexture,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      reflectivity: 1,
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    coinGroup.add(ringMesh);

    // --- Dark core disc: Cylinder rotated so its caps face +Z/-Z (matching
    //     the ring's extrusion axis) instead of the default +Y/-Y ---
    const coreGeometry = new THREE.CylinderGeometry(INNER_RADIUS, INNER_RADIUS, THICKNESS, 96);
    coreGeometry.rotateX(Math.PI / 2);

    const frontTexture = createFrontFaceTexture();
    const backTexture = createBackFaceTexture();

    const coreSideMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#1c2026"),
      metalness: 0.85,
      roughness: 0.4,
      clearcoat: 0.6,
      clearcoatRoughness: 0.2,
    });
    const coreFrontMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#10131a"),
      map: frontTexture,
      emissive: new THREE.Color("#39e6ff"),
      emissiveMap: frontTexture,
      emissiveIntensity: 1.4,
      metalness: 0.5,
      roughness: 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    });
    const coreBackMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#10131a"),
      map: backTexture,
      emissive: new THREE.Color("#d8b15c"),
      emissiveMap: backTexture,
      emissiveIntensity: 0.9,
      metalness: 0.5,
      roughness: 0.35,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    });

    // CylinderGeometry material group order is fixed: [0]=side, [1]=top cap, [2]=bottom cap
    const coreMesh = new THREE.Mesh(coreGeometry, [coreSideMaterial, coreFrontMaterial, coreBackMaterial]);
    coinGroup.add(coreMesh);

    // --- Neon backlight halo: an additive-blended plane with a radial alpha gradient ---
    const glowTexture = createRadialGlowTexture();
    const glowMaterial = new THREE.MeshBasicMaterial({
      map: glowTexture,
      color: new THREE.Color("#39e6ff"),
      transparent: true,
      opacity: 0.55,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const glowGeometry = new THREE.PlaneGeometry(5.2, 5.2);
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.z = -0.6;
    coinGroup.add(glowMesh);

    // ------------------------------------------------------------------
    // Resize handling — keeps the canvas filling its parent container.
    // ------------------------------------------------------------------
    function handleResize() {
      const { clientWidth, clientHeight } = container!;
      if (clientWidth === 0 || clientHeight === 0) return;
      camera.aspect = clientWidth / clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(clientWidth, clientHeight);
    }
    handleResize();
    window.addEventListener("resize", handleResize);

    // ------------------------------------------------------------------
    // Animation loop — gentle sine-wave float + continuous Y-axis spin,
    // both driven by elapsed time so speed is independent of frame rate.
    // ------------------------------------------------------------------
    const clock = new THREE.Clock();
    let elapsed = 0;
    let frameId = 0;

    function animate() {
      const delta = clock.getDelta();
      elapsed += delta;

      coinGroup.position.y = Math.sin(elapsed * 1.2) * 0.18; // gentle float
      coinGroup.rotation.y += delta * 0.8; // continuous spin (~0.8 rad/s)

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    }
    animate();

    // ------------------------------------------------------------------
    // Cleanup — dispose every geometry/material/texture, cancel the RAF
    // loop, remove the resize listener and detach the canvas. This runs
    // on unmount and on every Next.js hot-reload to prevent leaks.
    // ------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);

      ringGeometry.dispose();
      coreGeometry.dispose();
      glowGeometry.dispose();

      ringMaterial.dispose();
      coreSideMaterial.dispose();
      coreFrontMaterial.dispose();
      coreBackMaterial.dispose();
      glowMaterial.dispose();

      edgeTexture.dispose();
      frontTexture.dispose();
      backTexture.dispose();
      glowTexture.dispose();

      envScene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => m.dispose());
        }
      });
      envRenderTarget.dispose();
      pmremGenerator.dispose();

      scene.clear();
      renderer.dispose();

      if (renderer.domElement.parentElement === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className={className ?? "w-full h-full"} />;
}
