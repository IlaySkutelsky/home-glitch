const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


let canvasTex = new THREE.Texture(generateTexture())
canvasTex.needsUpdate = true

uniforms1 = {
  "time": { value: 1.0 },
  "texture1": { type: "t", value: canvasTex }
};

const myMaterial = new THREE.ShaderMaterial( {
  uniforms: uniforms1,
  vertexShader: document.getElementById( 'vertexShader' ).textContent,
  fragmentShader: document.getElementById( 'fragment_shader' ).textContent
} );


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
document.body.appendChild( renderer.domElement );

function animate() {
	let frameNum = requestAnimationFrame( animate );
  renderer.render( scene, camera );

  uniforms1[ "time" ].value += 0.0725

  houseGroup.rotation.x = (Math.sin(frameNum*0.005)+0.725) * 0.4;
  houseGroup.rotation.y -= (Math.sin(frameNum*0.02)+3)*0.002;

}

function generateTexture() {

  const canvas = document.createElement( 'canvas' );
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext( '2d' );
  const image = context.getImageData( 0, 0, 256, 256 );

  let x = 0, y = 0;

  for ( let i = 0, j = 0, l = image.data.length; i < l; i += 4, j ++ ) {

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

animate();