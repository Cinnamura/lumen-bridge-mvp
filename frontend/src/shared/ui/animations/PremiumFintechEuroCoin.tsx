"use client";

/**
 * PremiumFintechEuroCoin
 * -----------------------------------------------------------------------
 * A multi-layered, procedurally-built 3D Euro coin styled for a high-density
 * dark fintech UI. Three mesh layers compose the coin (see comments inline):
 *
 *   1. Outer Rim   — beveled "washer" (ExtrudeGeometry, shape + hole) in
 *                     dark obsidian/chrome metal.
 *   2. Glow Seam    — a thin emissive Torus nested in the gap between the
 *                     rim's bore and the glass disc; reads as a glowing
 *                     chamfer from any rotation angle (front, back, edge-on).
 *   3. Glass Core   — a recessed CylinderGeometry disc using true PBR
 *                     transmission/clearcoat glass.
 *   4. € Glyph      — two flat emissive planes (front + back), textured via
 *                     a procedurally-drawn CanvasTexture, floating a hair
 *                     above the glass surface like a holographic etching.
 *
 * No .gltf/.obj/image assets are loaded — every geometry is a Three.js
 * primitive and every "texture" is drawn at runtime on an off-DOM <canvas>.
 *
 * Install dependency:
 *   npm install three
 *
 * Usage:
 *   <PremiumFintechEuroCoin className="w-72 h-72 mx-auto" />
 * -----------------------------------------------------------------------
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

interface PremiumFintechEuroCoinProps {
  /** Tailwind (or any) classes used to size/position the canvas container. */
  className?: string;
}

// Brand accent palette
const COLOR_INDIGO = "#4F46E5"; // Electric Indigo — chamfer seam + one rim light
const COLOR_MINT = "#10B981"; // Vibrant Mint — opposite rim light
const COLOR_AMBER = "#F59E0B"; // Neon Amber — € glyph glow

export default function PremiumFintechEuroCoin({ className }: PremiumFintechEuroCoinProps) {
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
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    // ------------------------------------------------------------------
    // Procedural studio environment — required for the chrome rim's
    // reflections and the glass's refraction to read correctly. Built
    // entirely in-memory via PMREM, no HDRI file involved.
    // ------------------------------------------------------------------
    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const envScene = new RoomEnvironment();
    const envRenderTarget = pmremGenerator.fromScene(envScene, 0.04);
    scene.environment = envRenderTarget.texture;

    // ------------------------------------------------------------------
    // Studio lighting rig
    // ------------------------------------------------------------------
    // Dark ambient — keeps the overall mood muted/low-key rather than flat-lit.
    const ambient = new THREE.AmbientLight(0x12131a, 0.4);
    scene.add(ambient);

    // Soft neutral fill so the obsidian metal still reads as metal, not silhouette.
    const fillLight = new THREE.DirectionalLight(0xffffff, 0.5);
    fillLight.position.set(0, 3, 4);
    scene.add(fillLight);

    // Two highly-directional colored rim lights from opposite edges.
    const indigoRimLight = new THREE.DirectionalLight(new THREE.Color(COLOR_INDIGO), 3.2);
    indigoRimLight.position.set(-4, 1.5, 2.5);
    scene.add(indigoRimLight);

    const mintRimLight = new THREE.DirectionalLight(new THREE.Color(COLOR_MINT), 3.2);
    mintRimLight.position.set(4, -1.5, -2.5);
    scene.add(mintRimLight);

    // ==================================================================
    // Procedural texture builders (canvas only — zero external assets)
    // ==================================================================

    /** Razor-sharp "€" glyph on a transparent canvas, with a colored neon shadow-blur glow. */
    function createEuroGlyphTexture(glowColor: string): THREE.CanvasTexture {
      const size = 1024;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      // Transparent background — only the glyph itself should be opaque.
      ctx.clearRect(0, 0, size, size);

      const cx = size / 2;
      const cy = size / 2;

      // Outer glow pass (soft, wide blur)
      ctx.save();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = size * 0.09;
      ctx.fillStyle = glowColor;
      ctx.font = `800 ${size * 0.46}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("€", cx, cy + size * 0.01);
      ctx.restore();

      // Crisp core pass (tight blur, near-white hot center for high contrast)
      ctx.save();
      ctx.shadowColor = glowColor;
      ctx.shadowBlur = size * 0.015;
      ctx.fillStyle = "#fefefe";
      ctx.font = `800 ${size * 0.44}px Arial, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("€", cx, cy + size * 0.01);
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
      ctx.fillStyle = "#3a3a3a";
      ctx.fillRect(0, 0, w, h);
      for (let x = 0; x < w; x += 4) {
        ctx.fillStyle = x % 8 === 0 ? "#1a1a1a" : "#555555";
        ctx.fillRect(x, 0, 2, h);
      }
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.repeat.set(80, 1);
      return texture;
    }

    /** Soft radial gradient used for the ambient backlight halo behind the coin. */
    function createRadialGlowTexture(color: string): THREE.CanvasTexture {
      const size = 512;
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = size;
      const ctx = canvas.getContext("2d")!;
      const c = new THREE.Color(color);
      const rgb = `${Math.round(c.r * 255)},${Math.round(c.g * 255)},${Math.round(c.b * 255)}`;
      const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
      gradient.addColorStop(0, `rgba(${rgb},0.8)`);
      gradient.addColorStop(0.45, `rgba(${rgb},0.3)`);
      gradient.addColorStop(1, `rgba(${rgb},0)`);
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, size, size);
      return new THREE.CanvasTexture(canvas);
    }

    // ==================================================================
    // Coin construction — four stacked layers inside one rotating group
    // ==================================================================
    const coinGroup = new THREE.Group();
    scene.add(coinGroup);

    const OUTER_RADIUS = 1.55; // rim outer edge
    const RIM_INNER_RADIUS = 1.22; // rim bore (the hole the glass sits in)
    const SEAM_RADIUS = 1.18; // centerline of the glowing chamfer torus
    const SEAM_TUBE = 0.045; // half-thickness of the chamfer torus
    const GLASS_RADIUS = 1.15; // glass disc radius (overlaps seam slightly, no visible gap)
    const RIM_THICKNESS = 0.2; // rim is the thickest layer — "heavy outer ring"
    const GLASS_THICKNESS = 0.12; // thinner than the rim → reads as recessed

    // ---- Layer 1: Outer Rim — beveled metal washer (obsidian / dark chrome) ----
    const rimShape = new THREE.Shape();
    rimShape.absarc(0, 0, OUTER_RADIUS, 0, Math.PI * 2, false);
    const rimHole = new THREE.Path();
    rimHole.absarc(0, 0, RIM_INNER_RADIUS, 0, Math.PI * 2, true);
    rimShape.holes.push(rimHole);

    const rimGeometry = new THREE.ExtrudeGeometry(rimShape, {
      depth: RIM_THICKNESS,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 4,
      curveSegments: 96,
    });
    rimGeometry.translate(0, 0, -RIM_THICKNESS / 2); // center on the Z axis

    const edgeTexture = createMilledEdgeTexture();
    const rimMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#13141a"), // dark obsidian base
      metalness: 0.9,
      roughness: 0.4,
      roughnessMap: edgeTexture,
      clearcoat: 0.5,
      clearcoatRoughness: 0.25,
    });
    const rimMesh = new THREE.Mesh(rimGeometry, rimMaterial);
    coinGroup.add(rimMesh);

    // ---- Layer 2: Glow Seam — emissive Torus bridging rim bore → glass edge ----
    // A genuine 3D tube (not a flat decal) so the glow stays visible edge-on
    // as the coin spins, not just face-on.
    const seamGeometry = new THREE.TorusGeometry(SEAM_RADIUS, SEAM_TUBE, 16, 128);
    const seamMaterial = new THREE.MeshStandardMaterial({
      color: new THREE.Color(COLOR_INDIGO),
      emissive: new THREE.Color(COLOR_INDIGO),
      emissiveIntensity: 2.6,
      metalness: 0.2,
      roughness: 0.4,
      toneMapped: false, // keep the neon color punchy, unaffected by ACES rolloff
    });
    const seamMesh = new THREE.Mesh(seamGeometry, seamMaterial);
    coinGroup.add(seamMesh);

    // ---- Layer 3: Glass Core — recessed disc, true transmissive PBR glass ----
    const glassGeometry = new THREE.CylinderGeometry(GLASS_RADIUS, GLASS_RADIUS, GLASS_THICKNESS, 96);
    glassGeometry.rotateX(Math.PI / 2); // align cap normals with +Z/-Z (front/back of coin)

    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#dbe6ff"),
      metalness: 0,
      roughness: 0.2,
      transmission: 0.6,
      thickness: 0.5,
      clearcoat: 1.0,
      clearcoatRoughness: 0.1,
      ior: 1.45,
      attenuationColor: new THREE.Color(COLOR_INDIGO), // faint indigo tint through the glass body
      attenuationDistance: 1.2,
    });
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    coinGroup.add(glassMesh);

    // ---- Layer 4: € Glyph — emissive planes etched onto the front & back of the glass ----
    const glyphTexture = createEuroGlyphTexture(COLOR_AMBER);
    const glyphMaterialBase = {
      map: glyphTexture,
      emissive: new THREE.Color(COLOR_AMBER),
      emissiveMap: glyphTexture,
      emissiveIntensity: 1.8,
      transparent: true, // lets the glyph's transparent canvas background show the glass behind it
      depthWrite: false, // avoids z-fighting with the glass surface just behind it
      toneMapped: false, // keeps the amber neon vivid against the dark theme
    };
    const glyphFrontMaterial = new THREE.MeshStandardMaterial(glyphMaterialBase);
    const glyphBackMaterial = new THREE.MeshStandardMaterial(glyphMaterialBase);

    const glyphGeometry = new THREE.PlaneGeometry(1.5, 1.5);

    const glyphFrontMesh = new THREE.Mesh(glyphGeometry, glyphFrontMaterial);
    glyphFrontMesh.position.z = GLASS_THICKNESS / 2 + 0.005; // hair's-width above the front face
    glyphFrontMesh.renderOrder = 1;
    coinGroup.add(glyphFrontMesh);

    const glyphBackMesh = new THREE.Mesh(glyphGeometry, glyphBackMaterial);
    glyphBackMesh.position.z = -(GLASS_THICKNESS / 2 + 0.005);
    glyphBackMesh.rotation.y = Math.PI; // face outward, away from the back of the glass
    glyphBackMesh.renderOrder = 1;
    coinGroup.add(glyphBackMesh);

    // ---- Ambient ground/backlight halo (additive, depth-sorted behind everything) ----
    const glowTexture = createRadialGlowTexture(COLOR_INDIGO);
    const glowMaterial = new THREE.MeshBasicMaterial({
      map: glowTexture,
      color: new THREE.Color(COLOR_INDIGO),
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    const glowGeometry = new THREE.PlaneGeometry(5.4, 5.4);
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    glowMesh.position.z = -0.7;
    glowMesh.renderOrder = -1;
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
    // Animation loop — unchanged: sine-wave float + continuous Y spin,
    // both driven by elapsed time so speed is frame-rate independent.
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
    // loop, remove the resize listener and detach the canvas. Runs on
    // unmount and on every Next.js hot-reload to prevent leaks.
    // ------------------------------------------------------------------
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);

      rimGeometry.dispose();
      seamGeometry.dispose();
      glassGeometry.dispose();
      glyphGeometry.dispose();
      glowGeometry.dispose();

      rimMaterial.dispose();
      seamMaterial.dispose();
      glassMaterial.dispose();
      glyphFrontMaterial.dispose();
      glyphBackMaterial.dispose();
      glowMaterial.dispose();

      edgeTexture.dispose();
      glyphTexture.dispose();
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
