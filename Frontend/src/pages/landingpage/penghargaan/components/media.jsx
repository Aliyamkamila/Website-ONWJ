import { Mesh, Plane, Program, Texture } from 'ogl';

export class Media {
  constructor({ gl, scene, image, text, index, total, bend, textColor, font }) {
    this.gl = gl;
    this.scene = scene;
    this.image = image;
    this.text = text;
    this.index = index;
    this.total = total;
    this.bend = bend;
    this.textColor = textColor;
    this.font = font;

    this.createGeometry();
    this.createMaterial();
    this.createMesh();
  }

  createGeometry() {
    this.geometry = new Plane(this.gl, {
      width: 2.5,  // Diperbesar dari 1.5
      height: 3.5, // Diperbesar dari 2
      widthSegments: 50,
      heightSegments: 50
    });
  }

  createMaterial() {
    const texture = new Texture(this.gl, {
      generateMipmaps: false,
    });

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = this.image;
    
    img.onload = () => {
      texture.image = img;
    };

    img.onerror = (e) => {
      console.error('Error loading image:', this.image, e);
    };

    this.program = new Program(this.gl, {
      vertex: `
        attribute vec3 position;
        attribute vec2 uv;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform float uBend;
        varying vec2 vUv;
        
        #define PI 3.14159265359
        
        void main() {
          vUv = uv;
          vec3 pos = position;
          
          // Apply cylindrical bending
          float radius = uBend;
          float angle = pos.x / radius;
          pos.x = sin(angle) * radius;
          pos.z = cos(angle) * radius - radius;
          
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragment: `
        precision highp float;
        uniform sampler2D tMap;
        varying vec2 vUv;
        
        void main() {
          vec4 texColor = texture2D(tMap, vUv);
          gl_FragColor = texColor;
        }
      `,
      uniforms: {
        tMap: { value: texture },
        uBend: { value: this.bend }
      },
      transparent: true,
      depthTest: true,
      depthWrite: true
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    });

    const angle = (this.index / this.total) * Math.PI * 2;
    const radius = this.bend;
    
    this.mesh.position.x = Math.sin(angle) * radius;
    this.mesh.position.z = Math.cos(angle) * radius - radius;
    this.mesh.rotation.y = -angle;
    
    this.mesh.setParent(this.scene);
  }

  update(scroll) {
    const angle = ((this.index / this.total) * Math.PI * 2) + scroll.current * 0.5;
    const radius = this.bend;
    
    this.mesh.position.x = Math.sin(angle) * radius;
    this.mesh.position.z = Math.cos(angle) * radius - radius;
    this.mesh.rotation.y = -angle;
  }

  onResize() {
    // Handle resize if needed
  }
}