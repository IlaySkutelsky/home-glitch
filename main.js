const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


let xorTex = new THREE.Texture(generateXorTexture())
xorTex.needsUpdate = true

let noiseTex = new THREE.Texture(generateNoiseTexture())
noiseTex.needsUpdate = true

uniforms1 = {
  "time": { value: Math.floor(Math.random()*1000) },
  "texture1": { type: "t", value: xorTex },
  "texture2": { type: "t", value: noiseTex }
};



const myMaterial = new THREE.ShaderMaterial( {
  uniforms: uniforms1,
  vertexShader: `
    uniform float time;

    varying vec2 vUv;

    void main()
    {
      vUv = uv;
      vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
      gl_Position = projectionMatrix * mvPosition * vec4(cos(float(int(position.x*0.3 + time*0.02)))+1.1,sin(float(int(position.x + sin(time*0.1))))*0.25+1.0, int(position.y),1.0) ;
    }
  `,
  fragmentShader: `
    #define M_PI 3.1415926535897932384626433832795
    
    uniform sampler2D texture1;

    uniform sampler2D texture2;

    uniform float time;

    varying vec2 vUv;

    void main( void ) {

      vec2 position =  vUv*0.05;

      float color = 0.0;
      color += sin( position.x * cos( time / 30.0 ) * 80.0 ) + cos( position.y * cos( time / 30.0 ) * 10.0 );
      color += sin( position.y * sin( time / 20.0 ) * 40.0 ) + cos( position.x * sin( time / 50.0 ) * 40.0 );
      color += sin( position.x * sin( time / 10.0 ) * 10.0 ) + sin( position.y * sin( time / 70.0 ) * 80.0 );
      color *= sin( time / 10.0 ) * 0.5;
    
      vec4 xor = texture2D(texture1, vUv);
      vec4 noise = texture2D(texture2, vUv);
      gl_FragColor = vec4(cos((noise.x+0.5) * color + time * 0.2), color, tan((xor.x)*0.1 + color*1.5 + time / 100.0 ) + 0.1 , 1.0 );
    }
  `})




// Add box
const boxGeometry = new THREE.BoxGeometry();
//boxMaterial.transparent = true
//boxMaterial.opacity = 0.5
const cube = new THREE.Mesh( boxGeometry, myMaterial );
scene.add( cube );

// Add cone
const coneGeometry = new THREE.ConeGeometry( 0.9, 0.6, 4 );
//coneMaterial.transparent = true
//coneMaterial.opacity = 0.5
const cone = new THREE.Mesh( coneGeometry, myMaterial );
cone.position.y += 0.8
cone.rotation.y += Math.PI/4
scene.add( cone )

const houseGroup = new THREE.Group();
houseGroup.add( cube );
houseGroup.add( cone );

scene.add( houseGroup );


camera.position.z = 2;

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );

window.onload = function() {
  console.log('got here');
  document.body.appendChild( renderer.domElement )
  animate()
}

function animate() {
	let frameNum = requestAnimationFrame( animate );
  renderer.render( scene, camera );

  uniforms1[ "time" ].value += 0.0725

  houseGroup.rotation.x = (Math.sin(frameNum*0.005)+0.725) * 0.4;
  houseGroup.rotation.y -= (Math.sin(frameNum*0.02)+3)*0.002;

  animateTitle()
}

function generateXorTexture() {

  const canvas = document.createElement( 'canvas' );
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext( '2d' );
  const image = context.getImageData( 0, 0, 256, 256 );

  let x = 0, y = 0;

  for ( let i = 0, j = 0; i < image.data.length; i += 4, j ++ ) {

    x = j % 256;
    y = ( x === 0 ) ? y + 1 : y;

    let val =  Math.floor( x ^ y )

    image.data[ i ] = val;
    image.data[ i + 1 ] = val;
    image.data[ i + 2 ] = val;
    image.data[ i + 3 ] =  255;

  }

  context.putImageData( image, 0, 0 );

  return canvas;
}

function generateNoiseTexture() {

  const canvas = document.createElement( 'canvas' );
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext( '2d' );
  const image = context.getImageData( 0, 0, 256, 256 );

  let x = 0, y = 0;

  noise.seed(Math.random());

  for ( let i = 0, j = 0; i < image.data.length; i += 4, j ++ ) {

    x = j % 256;
    y = ( x === 0 ) ? y + 1 : y;

    let val = noise.simplex2(x / 256, y / 256) * 256

    image.data[ i ] = val;
    image.data[ i + 1 ] = val;
    image.data[ i + 2 ] = val;
    image.data[ i + 3 ] =  255;

  }

  context.putImageData( image, 0, 0 );

  return canvas;
}

function animateTitle() {
  if (Math.random()>0.017) return
  let titleElm = document.querySelector("title")
  let titleString = titleElm.innerText
  let index = Math.floor(Math.random()*4)
  let newChar
  if (titleString.charAt(index) === titleString.charAt(index).toLowerCase()) newChar = titleString.charAt(index).toUpperCase()
  else newChar = titleString.charAt(index).toLowerCase()
  titleString = titleString.substr(0, index) + newChar + titleString.substr(index + 1)
  titleElm.innerText = titleString
}