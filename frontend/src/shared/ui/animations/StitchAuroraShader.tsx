'use client';

import { CSSProperties, useEffect, useRef } from 'react';

type StitchAuroraShaderProps = {
  className?: string;
  style?: CSSProperties;
};

const vertexShader = `attribute vec2 a_position;
varying vec2 v_texCoord;
void main() {
  v_texCoord = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}`;

const fragmentShader = `precision highp float;
uniform float u_time;
uniform vec2 u_resolution;

void main() {
    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    float t = u_time * 0.15;

    vec3 color1 = vec3(0.31, 0.27, 0.9);
    vec3 color2 = vec3(0.66, 0.33, 0.97);
    vec3 color3 = vec3(0.06, 0.73, 0.51);

    float n1 = sin(uv.x * 3.0 + t) * 0.5 + 0.5;
    float n2 = sin(uv.y * 2.0 - t * 1.2) * 0.5 + 0.5;
    float n3 = cos((uv.x + uv.y) * 2.5 + t * 0.8) * 0.5 + 0.5;

    vec3 finalColor = mix(color1, color2, n1 * 0.4);
    finalColor = mix(finalColor, color3, n2 * 0.3);
    finalColor *= n3 * 0.15;

    gl_FragColor = vec4(finalColor, 1.0);
}`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export default function StitchAuroraShader({ className, style }: StitchAuroraShaderProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl || !(gl instanceof WebGLRenderingContext)) return;

    const syncSize = () => {
      const width = canvas.clientWidth || 1280;
      const height = canvas.clientHeight || 720;
      if (canvas.width != width || canvas.height != height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    syncSize();

    const program = gl.createProgram();
    const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShader);
    const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShader);

    if (!program || !vertex || !fragment) {
      if (program) gl.deleteProgram(program);
      return;
    }

    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }

    gl.useProgram(program);

    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      return;
    }

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const position = gl.getAttribLocation(program, 'a_position');
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(program, 'u_time');
    const uResolution = gl.getUniformLocation(program, 'u_resolution');
    const uMouse = gl.getUniformLocation(program, 'u_mouse');

    let rafId = 0;
    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const onMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = 1 - (event.clientY - rect.top) / rect.height;
      mouseX = nx * canvas.width;
      mouseY = ny * canvas.height;
    };

    const resizeObserver = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(() => {
          syncSize();
        })
      : null;

    resizeObserver?.observe(canvas);
    window.addEventListener('mousemove', onMouseMove);

    const render = (time: number) => {
      syncSize();
      gl.viewport(0, 0, canvas.width, canvas.height);
      if (uTime) gl.uniform1f(uTime, time * 0.001);
      if (uResolution) gl.uniform2f(uResolution, canvas.width, canvas.height);
      if (uMouse) gl.uniform2f(uMouse, mouseX, mouseY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      rafId = window.requestAnimationFrame(render);
    };

    rafId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      resizeObserver?.disconnect();
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        display: 'block',
        width: '100%',
        height: '100%',
        ...style,
      }}
    />
  );
}
