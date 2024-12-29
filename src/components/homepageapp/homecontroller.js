import { createApp } from 'vue/dist/vue.esm-bundler.js'
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as WEBGI from 'webgi';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { TerrainFragmentShader, TerrainVertexShader } from './Shaders';
import { Lensflare, LensflareElement } from 'three/addons/objects/Lensflare.js';

const updateProgressEvent = new Event('updateprogress');
const clock = new THREE.Clock();
let terrain;
let mouseX = 0, mouseY = 0, rotaionX = 0, rotaionY=0;
let rotTarget = new THREE.Vector2(0,0);
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;
const birds = [];
let frameRatedelta = 0;
const backendScenes = [];
const models = [];
const target = new THREE.Vector2();
let backendRenderer;
let backendCanvas = null;
let bCanvaWidth = window.innerWidth;
let bCanvaHeight = window.innerHeight;

//advance offset for monitoring renderer's visibility
let rootMarginValue = Math.floor(screen.height*0.20);
const initHomeMainApp = function(){
    const app = createApp(
        {props:[]},
        {
            isLoaded:false,
            loadPercentage:0,
        });
    app.component('jewelleryframe',{
        props: ['identifier', 'margintop'],
        data(){
            return{
                ID: this.identifier,
            };
        },
        created(){
        },
        mounted(){
            this.dom = document.getElementById(this.identifier);
            this.initWebGI();
        },
        methods:{
            redirectDemo(){
                window.location.href = 'https://francis-xav1er.github.io/Jewellery/weddingrings.html';
            },
            async initWebGI(){
                app._props.loadPercentage +=5;
                document.dispatchEvent(updateProgressEvent);
                this.viewer = new WEBGI.ViewerApp({
                    canvas: document.getElementById(this.identifier),
                    isAntialiased: true,
                    useRgbm: true
                  }) ;
                const manager = new WEBGI.AssetManagerPlugin();
                await this.viewer.addPlugin(manager);
                this.viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1.5);
                await WEBGI.addBasePlugins(this.viewer);
                const camViews = this.viewer.getPlugin(WEBGI.CameraViewPlugin);
                this.viewer.renderer.refreshPipeline();
                const options = {autoScale: false}
                const assets = await manager.addFromPath("./objects/jewelleryDemo.glb", options);
                this.controls = this.viewer.scene.activeCamera.controls;
                this.controls.autoRotate = false;
                app._props.loadPercentage +=20;
                document.dispatchEvent(updateProgressEvent);
                setTimeout(this.suspendViewer, 1200);
                let observer = new IntersectionObserver(this.manageRendererByVisibility,{
                    root: null,
                    rootMargin: rootMarginValue+'px 0px',
                    threshold: 0.1,
                });
                observer.observe(document.getElementById(this.identifier+''));
            },
            manageRendererByVisibility(entries, observer){
                entries.forEach(entry => {
                    if (
                        entry &&
                        entry.isIntersecting &&
                        entry.intersectionRatio >= 0.1
                      ){
                    this.resumeViewer();
                    this.startRotate();
                      }else{
                        this.suspendViewer();
                      }
                  });
            },
            startRotate(){
                this.controls.autoRotate = true;
                this.controls.autoRotateSpeed = 0.8;
            },
            suspendViewer(){
                this.viewer.enabled=false;
            },
            resumeViewer(){
                this.viewer.enabled=true;
            }
        },
        template:`
            <div class="jewelleryContainer">
                <canvas class="jewelleryViewer" :id="identifier"></canvas>
                <div id="jewelleryInfo">
                    <h1 class="demoSectionHeader">Jewellery Experience</h1>
                    <p class="demoSectionInfo">Shop, design & customize your unique ring with realistic graphics and pure beauty of the collection.</p>
                    <div class="demoSectionDemo" style="background-color: rgb(145, 25, 53);" @click="redirectDemo()">DEMO</div>
                </div>
            </div>
        `
    });
    app.component('productframe',{
        props: ['identifier', 'margintop'],
        data(){
            return{
                ID: this.identifier,
                marginTop: this.margintop,
            };
        },
        created(){
        },
        mounted(){
            this.dom = document.getElementById(this.identifier);
            this.initWebGI();
        },
        methods:{
            redirectDemo(){
                window.location.href = 'https://francis-xav1er.github.io/Product_Viewer_Demo/';
            },
            async initWebGI(){
                app._props.loadPercentage +=5;
                document.dispatchEvent(updateProgressEvent);
                this.viewer = new WEBGI.ViewerApp({
                    canvas: document.getElementById(this.identifier),
                    isAntialiased: true,
                    useRgbm: true
                  }) ;
                const manager = new WEBGI.AssetManagerPlugin();
                await this.viewer.addPlugin(manager);
                this.viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1.5);
                await WEBGI.addBasePlugins(this.viewer);
                const camViews = this.viewer.getPlugin(WEBGI.CameraViewPlugin);
                this.viewer.renderer.refreshPipeline();
                const options = {autoScale: false}
                const assets = await manager.addFromPath("./objects/pr1.glb", options);
                this.controls = this.viewer.scene.activeCamera.controls;
                this.controls.autoRotate = false;
                app._props.loadPercentage +=20;
                document.dispatchEvent(updateProgressEvent);
                setTimeout(this.suspendViewer, 1200);
                let observer = new IntersectionObserver(this.manageRendererByVisibility,{
                    root: null,
                    rootMargin: rootMarginValue+'px 0px',
                    threshold: 0.1,
                });
                observer.observe(document.getElementById(this.identifier+''));
            },
            manageRendererByVisibility(entries, observer){
                entries.forEach(entry => {
                    if (
                        entry &&
                        entry.isIntersecting &&
                        entry.intersectionRatio >= 0.1
                      ){
                        this.resumeViewer();
                        this.startRotate();
                      }else{
                        this.suspendViewer();
                      }
                  });
            },
            startRotate(){
                this.controls.autoRotate = true;
                this.controls.autoRotateSpeed = 0.8;
            },
            suspendViewer(){
                this.viewer.enabled=false;
            },
            resumeViewer(){
                this.viewer.enabled=true;
            }
        },
        template:`
            <div class="jewelleryContainer" :style="{'margin-top':margintop}">
                <canvas class="jewelleryViewer" :id="identifier"></canvas>
                <div id="jewelleryInfo">
                    <h1 class="demoSectionHeader" style="color:rgb(86 11 107)">Shopping Experience</h1>
                    <p class="demoSectionInfo">Experience the marvel of your favorite products in its true essence of color, shape and real life looks.</p>
                    <div class="demoSectionDemo" style="background-color: rgb(86 11 107);" @click="redirectDemo()">DEMO</div>
                </div>
            </div>
        `
    });
    app.component('realestateframe',{
        props: ['identifier', 'margintop'],
        data(){
            return{
                ID: this.identifier,
            };
        },
        created(){
        },
        mounted(){
            this.dom = document.getElementById(this.identifier);
            this.initWebGI();
        },
        methods:{
            redirectDemo(){
                window.location.href = 'https://francis-xav1er.github.io/MyHome_realestate/';
            },
            async initWebGI(){
                app._props.loadPercentage +=5;
                document.dispatchEvent(updateProgressEvent);
                this.viewer = new WEBGI.ViewerApp({
                    canvas: document.getElementById(this.identifier),
                    isAntialiased: true,
                    useRgbm: true
                  }) ;
                const manager = new WEBGI.AssetManagerPlugin();
                await this.viewer.addPlugin(manager);
                this.viewer.renderer.displayCanvasScaling = Math.min(window.devicePixelRatio, 1.5);
                await WEBGI.addBasePlugins(this.viewer);
                const camViews = this.viewer.getPlugin(WEBGI.CameraViewPlugin);
                this.viewer.renderer.refreshPipeline();
                const options = {autoScale: false}
                const assets = await manager.addFromPath("./objects/realestate.glb", options);
                this.controls = this.viewer.scene.activeCamera.controls;
                this.controls.autoRotate = false;
                app._props.loadPercentage +=20;
                document.dispatchEvent(updateProgressEvent);
                setTimeout(this.suspendViewer, 1200);
                let observer = new IntersectionObserver(this.manageRendererByVisibility,{
                    root: null,
                    rootMargin: rootMarginValue+'px 0px',
                    threshold: 0.1,
                });
                observer.observe(document.getElementById(this.identifier+''));
            },
            manageRendererByVisibility(entries, observer){
                entries.forEach(entry => {
                    if (
                        entry &&
                        entry.isIntersecting &&
                        entry.intersectionRatio >= 0.1
                      ){
                        this.resumeViewer();
                        this.startRotate();
                      }else{
                        this.suspendViewer();
                      }
                  });
            },
            startRotate(){
                this.controls.autoRotate = true;
                this.controls.autoRotateSpeed = 0.8;
            },
            suspendViewer(){
                this.viewer.enabled=false;
            },
            resumeViewer(){
                this.viewer.enabled=true;
            }
        },
        template:`
            <div class="jewelleryContainer">
                <canvas class="jewelleryViewer" :id="identifier"></canvas>
                <div id="jewelleryInfo">
                    <h1 class="demoSectionHeader" style="color:rgb(223 92 22)">Realestate Visualization</h1>
                    <p class="demoSectionInfo">Visualize your dream with industry leading 3D solution to showcase your next realestate project to your potential customers.</p>
                    <div class="demoSectionDemo" style="background-color: rgb(223 92 22);" @click="redirectDemo()">DEMO</div>
                </div>
            </div>
        `
    });
    app.component('patternengineframe',{
        props: ['identifier', 'margintop'],
        data(){
            return{
                ID: this.identifier,
                inited : false,
            };
        },
        created(){
            window.addEventListener( 'resize', this.updateCanvasOnResize, false );
        },
        mounted(){
            this.dom = document.getElementById(this.identifier);
            if(!this.inited)
                this.initPatternEngine();

            document.getElementById(this.ID).addEventListener('mousemove',(e)=>{
                if(this.inited){
                    this.updateShadowMode(e);
                }
            });
        },
        methods:{
            updateCanvasOnResize(){
                if(this.renderer != null){
                    this.canvasWidth = this.dom.getBoundingClientRect().width;
                    this.canvasHeight = this.dom.getBoundingClientRect().height;
                    this.camera.aspect = this.canvasWidth/this.canvasHeight
                    this.camera.updateProjectionMatrix();
                    this.renderer.setSize( this.canvasWidth, this.canvasHeight );
                }
            },
            redirectDemo(){
            },
            async initPatternEngine(){
                this.mouse = new THREE.Vector2();
                this.inited = true;
                this.canvasWidth = this.dom.getBoundingClientRect().width;
                this.canvasHeight = this.dom.getBoundingClientRect().height;
                this.renderer = new THREE.WebGLRenderer({antialias:false});
                this.scene = new THREE.Scene();
                this.scene.background = new THREE.Color('#0f0f60');
                this.renderer.setSize(this.canvasWidth, this.canvasHeight);
                this.renderer.setPixelRatio( window.devicePixelRatio );
                this.dom.append(this.renderer.domElement);
                this.camera = new THREE.PerspectiveCamera(10, this.canvasWidth/this.canvasHeight,1,1000);
                this.camera.lookAt(this.scene.position);
                this.camera.position.z = 60;
                this.camera.position.x = 35;
                this.camera.position.y = 20;
                this.controls = new OrbitControls(this.camera,  this.renderer.domElement);
                await this.createGeometry();
                app._props.loadPercentage += 5;
                document.dispatchEvent(updateProgressEvent);
                this.raycaster = new THREE.Raycaster();
                this.scannery = -7;
                this.scannerColor = new THREE.Color('#ffffff');
                this.origin = [0,0,0];
                this.maxRadius = 5;
                this.curRadius = 0;
                this.startRendering();
                app._props.loadPercentage += 10;
                document.dispatchEvent(updateProgressEvent);
                setTimeout(this.suspendViewer, 1200);
                let observer = new IntersectionObserver(this.manageRendererByVisibility,{
                    root: null,
                    rootMargin: rootMarginValue+'px 0px',
                    threshold: 0.1,
                });
                observer.observe(document.getElementById(this.identifier+''));
            },
            createGeometry(){
                const positions = [];
                const colors = [];
                const color = new THREE.Color("#00f0f0");
                for(let i=-5; i<5; i++){
                    for(let j=-5; j<5; j++){
                        for(let k=-5; k<5; k++){
                            positions.push(i, j, k);
                            colors.push(color.r, color.g, color.b);
                        }
                    }
                }
                const leds = new THREE.BufferGeometry();
                leds.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
                leds.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
                leds.computeBoundingSphere();
                const material = new THREE.PointsMaterial({ size: 0.8, vertexColors: true });
                this.geometry = new THREE.Points(leds, material);
                this.geometry.scale.set(0.5, 0.5, 0.5);
                this.geometry.position.set(0, 0, 0);
                this.scene.add(this.geometry);
            },
            updateShadowMode(e){
                this.mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
                this.mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
                this.raycaster.setFromCamera( this.mouse, this.camera );
                const intersects = this.raycaster.intersectObjects( this.scene.children );
                if ( intersects.length > 0 ) {
                    const intersection = intersects[0];
                    const faceIndex = intersection.point;
                    const x = this.geometry.geometry.attributes.position.getX(faceIndex);
                    const y = this.geometry.geometry.attributes.position.getY(faceIndex);
                    const z = this.geometry.geometry.attributes.position.getZ(faceIndex);
                    this.origin = [faceIndex.x,faceIndex.y,faceIndex.z];
                }
            },
            scanner( { color, position }){
                for (let index = 0; index < position.count; index++) {
                    //clearingtree
                    color.setXYZ(index, ...[0, 0, 0]);
                    //scannerPattern
                    const y = position.getY(index);
                    if (y < this.scannery && y> this.scannery-2){
                        if(y == Math.floor(this.scannery-1)) {
                            const newColor = [0.3,0.3,0.3];
                            color.setXYZ(index, ...newColor);
                        }else{
                            color.setXYZ(index, ...this.scannerColor);

                        }
                    }
                    //rainbowpattern
                    const x = position.getX(index);
                    const z = position.getZ(index);
                    let dx = x - this.origin[0];
                    let dy = y - this.origin[1];
                    let dz = z - this.origin[2];
                    let distanceEQ = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    if (distanceEQ <= this.maxRadius) {
                      let colorWeight = 1;
                      if (distanceEQ == this.curRadius) {
                        colorWeight = 1;
                      } else if (distanceEQ < this.curRadius) {
                        colorWeight = 1 - (this.curRadius - distanceEQ) / this.maxRadius;
                      } else {
                        colorWeight = (distanceEQ - this.curRadius) / this.maxRadius;
                      }
                      const h = 1.0 * colorWeight;
                      const tempColor = new THREE.Color();
                      tempColor.setHSL(h, 1, 0.5);
                      color.setXYZ(index, ...tempColor.toArray());
                    }
                  }
                  if (this.scannery <= 6) {
                    this.scannery += 0.05;
                  } else {
                    this.scannery = -6;
                  }
                  if (this.curRadius <= this.maxRadius - 0.025) {
                    this.curRadius += 0.025;
                  } else {
                    this.curRadius = 0;
                  }
            },
            tick(){
                // if (frameRatedelta * 1000 < 33) {
                //       frameRatedelta += clock.getDelta();
                //       return;
                // }
                this.scanner(this.geometry.geometry.attributes);
                this.geometry.geometry.attributes.color.needsUpdate = true;
            },
            startRendering(){
                this.renderer.setAnimationLoop(this.animate);
            },
            animate(){
                this.tick();
				this.renderer.render( this.scene, this.camera );
            },
            manageRendererByVisibility(entries, observer){
                entries.forEach(entry => {
                    if (
                        entry &&
                        entry.isIntersecting &&
                        entry.intersectionRatio >= 0
                    ){
                        this.resumeViewer();
                    }else{
                        this.suspendViewer();
                    }
                });
            },
            suspendViewer(){
                this.renderer.setAnimationLoop(null);
            },
            resumeViewer(){
                this.renderer.setAnimationLoop(this.animate);
            }
        },
        template:`
            <div class="jewelleryContainer" :style="{'margin-top':margintop}">
                <div class="jewelleryViewer" :id="identifier" style="overflow:hidden"></div>
                <div id="jewelleryInfo">
                    <h1 class="demoSectionHeader" style="color:rgb(8 81 175);">Custom 3D Solutions</h1>
                    <p class="demoSectionInfo">Building highly optimized and efficient custom 3D solutions to unique graphical requirements, such as generating upto 120fps LED art installation light pattern cues</p>
                    <div class="demoSectionDemo" style="background-color: rgb(8 81 175);" @click="redirectDemo()">Coming Soon</div>
                </div>
            </div>
        `
    });
    app.component('showreelcard',{
        props:[],
        data(){
            return{
                uploadedNo: 0,
            }
        },
        created(){

        },
        mounted(){

        },
        methods:{
            updateVideoLoadProgress(){
                this.uploadedNo++;
                if(this.uploadedNo>=4){
                    app._props.loadPercentage += 20;
                    document.dispatchEvent(updateProgressEvent);
                }
            }
        },
        template: `
            <table id="showReelContainer">
                <tr>
                <td><div class="showreelcard">
                    <video class="showReelCardVideo" preload="auto" autoplay muted playsinline loop @loadeddata="updateVideoLoadProgress">
                        <source src="./images/realestate.mp4" type="video/mp4" />
                    </video>
                </div></td>
                <td><div class="showreelcard">
                    <video class="showReelCardVideo" preload="auto" autoplay muted playsinline loop @loadeddata="updateVideoLoadProgress">
                        <source src="./images/jewellery.mp4" type="video/mp4" />
                    </video>
                </div></td>
                <td><div class="showreelcard">
                    <video class="showReelCardVideo" preload="auto" autoplay muted playsinline loop @loadeddata="updateVideoLoadProgress">
                        <source src="./images/shopping.mp4" type="video/mp4" />
                    </video>
                </div></td>
                <td><div class="showreelcard">
                    <video class="showReelCardVideo" preload="auto" autoplay muted playsinline loop @loadeddata="updateVideoLoadProgress">
                        <source src="./images/patternengine.mp4" type="video/mp4" />
                    </video>
                </div></td>
                <td><div class="showreelcard">
                    <video class="showReelCardVideo" preload="auto" autoplay muted playsinline loop @loadeddata="updateVideoLoadProgress">
                        <source src="./images/realestate.mp4" type="video/mp4" />
                    </video>
                </div></td>
                <td><div class="showreelcard">
                    <video class="showReelCardVideo" preload="auto" autoplay muted playsinline loop @loadeddata="updateVideoLoadProgress">
                        <source src="./images/jewellery.mp4" type="video/mp4" />
                    </video>
                </div></td>
                <td><div class="showreelcard">
                    <video class="showReelCardVideo" preload="auto" autoplay muted playsinline loop @loadeddata="updateVideoLoadProgress">
                        <source src="./images/shopping.mp4" type="video/mp4" />
                    </video>
            </div></td>
                </tr>
            </table>
        `
    });
    app.component('homemain',{
        props:[],
        data(){
            return{
                rootApp: app,
                dummyKey: false,
                bigCanvas: true,
                orientationPermissionGranted: false,
                orientationRequest : false,
            };
        },
        created(){
            if(screen.width<=500){
                this.bigCanvas = false;
            }
            if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function'){
                DeviceOrientationEvent.requestPermission().catch(()=>{
                    this.orientationRequest = true;
                });
            }
            document.addEventListener('updateprogress',(e)=>{
                this.forceRenderLoader();
                if(app._props.loadPercentage >=90 && this.bigCanvas){
                    document.body.style.overflow = 'auto';
                    app._props.isLoaded = true;
                    document.dispatchEvent(new Event("canvasResetSize"));
                }else if(app._props.loadPercentage >=90 && !this.orientationRequest){
                    app._props.loadPercentage = 100;
                    document.body.style.overflow = 'auto';
                    app._props.isLoaded = true;
                    document.dispatchEvent(new Event("canvasResetSize"));
                    setTimeout(this.showScrollTip,10000);
                }
            });
            document.addEventListener('canvasResetSize',()=>{
                if(this.backgroundDom!=null && this.renderer!=null){
                    this.backgroundDom.style.width = '100%';
                    const width = this.backgroundDom.clientWidth;
				    const height = this.backgroundDom.clientHeight;
				if ( this.backgroundDom.width !== width || this.backgroundDom.height !== height ) {
					this.renderer.setSize( width, height, false );
				}
                }
            });
        },
        mounted(){
            this.backgroundDom = document.getElementById('mainBackgroundCanvas');
            this.initBackground();
            this.initBackendRenderEngine();
            this.dom = document.getElementById('homeAppBannerCanvaDiv');
            const beyondPath = document.getElementById('beyondPath');
            const beyond = document.getElementById('beyondPathSvg');
            const beyondPathLength = beyondPath.getTotalLength();
            beyondPath.style.strokeDasharray = beyondPathLength;
            beyondPath.style.strokeDashoffset = beyondPathLength;

            const visionPath = document.getElementById('visionPath');
            const vision = document.getElementById('visionPathSvg');
            const visionPathLength = visionPath.getTotalLength();
            visionPath.style.strokeDasharray = visionPathLength;
            visionPath.style.strokeDashoffset = visionPathLength;

            const reachPath = document.getElementById('reachPath');
            const reach = document.getElementById('reachPathSvg');
            const reachPathLength = reachPath.getTotalLength();
            reachPath.style.strokeDasharray = reachPathLength;
            reachPath.style.strokeDashoffset = reachPathLength;
            let end;
            let endPath;
            let endPathLength;
            if(!this.bigCanvas){
                endPath = document.getElementById('endPath');
                end = document.getElementById('endPathSvg');
                endPathLength = endPath.getTotalLength();
                endPath.style.strokeDasharray = endPathLength;
                endPath.style.strokeDashoffset = endPathLength;
            }
            let options = {
                root: null,
                rootMargin: '0px 0px',
                threshold: 0.1
            };
            let observer = new IntersectionObserver(this.cbTextAppeared, options);
            observer.observe(document.getElementById('typog1'));
            observer.observe(document.getElementById('typog2'));
            observer.observe(document.getElementById('typog3'));
            observer.observe(document.getElementById('typog4'));
            window.addEventListener("scroll",(e)=>{
                if(this.backgroundDom.getBoundingClientRect().bottom < 30){
                    this.suspendBackgroundRender();
                }else{
                    this.animate();
                }
                if(backendCanvas.getBoundingClientRect().y - window.innerHeight < 0 && backendCanvas.getBoundingClientRect().bottom > 0){
                    this.startBackendCanvasRendering();
                }else{
                    this.suspendBackendCanvasRendering();
                }

                const beyondScrollPercentage = (window.innerHeight-beyond.getBoundingClientRect().top - 200)/beyond.getBoundingClientRect().height
                const beyondDrawLength = beyondPathLength * Math.max(0,beyondScrollPercentage*0.7);
                beyondPath.style.strokeDashoffset = Math.max(0,beyondPathLength - beyondDrawLength);

                const visionScrollPercentage = (window.innerHeight-vision.getBoundingClientRect().top - 200)/vision.getBoundingClientRect().height
                const visionDrawLength = visionPathLength * Math.max(0,visionScrollPercentage*0.7);
                visionPath.style.strokeDashoffset = Math.max(0,visionPathLength - visionDrawLength);

                const reachScrollPercentage = (window.innerHeight-reach.getBoundingClientRect().top - 200)/reach.getBoundingClientRect().height
                const reachDrawLength = reachPathLength * Math.max(0,reachScrollPercentage*0.8);
                reachPath.style.strokeDashoffset = Math.max(0,reachPathLength - reachDrawLength);

                if(!this.bigCanvas){
                    const endScrollPercentage = (1-(end.getBoundingClientRect().y - window.innerHeight*0.8))/end.getBoundingClientRect().height;
                    const endDrawLength = endPathLength * Math.max(0,endScrollPercentage);
                    endPath.style.strokeDashoffset = Math.max(0,endPathLength - endDrawLength);
                    
                    const showreelcontainer = document.getElementById('showReelContainer');
                    if(showreelcontainer.getBoundingClientRect().y - window.innerHeight < 0 && showreelcontainer.getBoundingClientRect().bottom>0){
                        const reelScrollPer = (window.innerHeight - showreelcontainer.getBoundingClientRect().top)/((beyond.getBoundingClientRect().height + window.innerHeight));
                        if(reelScrollPer >=0.0 && reelScrollPer <=1.0){
                            const translateValue = showreelcontainer.getBoundingClientRect().width * reelScrollPer*0.85;
                            showreelcontainer.style.transform = 'translateX(-'+ translateValue +'px)';
                        }
                    }
                }else{
                    const showreelcontainer = document.getElementById('showReelContainer');
                    if(showreelcontainer.getBoundingClientRect().y - window.innerHeight < 40 && showreelcontainer.getBoundingClientRect().bottom>0){
                        const reelScrollPer = (window.innerHeight - showreelcontainer.getBoundingClientRect().top)/((beyond.getBoundingClientRect().height + window.innerHeight));
                        if(reelScrollPer >=0.0 && reelScrollPer <=1.0){
                            const translateValue = showreelcontainer.getBoundingClientRect().width * reelScrollPer * 0.7;
                            showreelcontainer.style.transform = 'translateX(-'+ translateValue +'px)';
                        }
                    }
                }
            });
        },
        methods:{
            showScrollTip(){
                if(document.documentElement.scrollTop <= 20){
                    const scrollTip = document.getElementById('scrollToolTip');
                    scrollTip.style.display = 'block';
                    scrollTip.classList.add('scrollToolTipUpAnim');
                }
            },
            initBackground(){
                this.mlib = {};
                this.animDelta = 0;
                this.animDeltaDir = - 1;
                this.lightVal = 1;
                this.lightDir = -1;

                this.sceneRenderTarget = new THREE.Scene();
				this.cameraOrtho = new THREE.OrthographicCamera( this.backgroundDom.getBoundingClientRect().width / - 2, this.backgroundDom.getBoundingClientRect().width / 2, this.backgroundDom.getBoundingClientRect().height / 2, this.backgroundDom.getBoundingClientRect().height / - 2, - 10000, 10000 );
				this.cameraOrtho.position.z = 100;
				this.sceneRenderTarget.add( this.cameraOrtho );

                this.camera = new THREE.PerspectiveCamera(40, this.backgroundDom.getBoundingClientRect().width / this.backgroundDom.getBoundingClientRect().height, 2, 40000 );
				this.scene = new THREE.Scene();
				this.scene.background = new THREE.Color( 0xfad1b5 );
                this.camera.position.set( -2200, 300, 0 );
                this.camera.lookAt(0,0,0);
                this.camera.zoom = 1.5;
				this.scene.fog = new THREE.FogExp2( 0xe0d1b5, 0.0011 );
                this.scene.add( new THREE.AmbientLight( 0x001111 ) );
                this.directionalLight = new THREE.DirectionalLight( 0xfff0f0, 1.15 );
				this.directionalLight.position.set( 500, 2000, 0 );
				this.scene.add( this.directionalLight );
				this.pointLight = new THREE.PointLight( 0xff4400, 1.5 );
				this.pointLight.position.set( 0, 0, 0 );
				this.scene.add( this.pointLight );

				let rx = 256, ry = 256;
				let pars = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat };

                this.heightMap = new THREE.WebGLRenderTarget( rx, ry, pars );
				this.heightMap.texture.generateMipmaps = false;

				this.uniformsNoise = {
					"time": { value: 1.0 },
					"scale": { value: new THREE.Vector2( 2.5, 2.5 ) },
					"offset": { value: new THREE.Vector2( 0, 0 )}
				};
                if(!this.bigCanvas){
                    this.uniformsNoise['scale'].value = new THREE.Vector2(3.5,3.5);
                }
                let vertexShader = TerrainVertexShader;

                this.heightMapNoiseShaderMat = new THREE.ShaderMaterial({
                    uniforms: this.uniformsNoise,
                    vertexShader: vertexShader,
                    fragmentShader: TerrainFragmentShader,
                    lights: false,
                    fog:true
                });

				let plane = new THREE.PlaneGeometry( this.backgroundDom.getBoundingClientRect().width, this.backgroundDom.getBoundingClientRect().height);
				this.quadTarget = new THREE.Mesh( plane, new THREE.MeshBasicMaterial( { color: 0x000000 } ) );
				this.quadTarget.position.z = - 500;
				this.sceneRenderTarget.add( this.quadTarget );
                let geometryTerrain;
                if(this.bigCanvas)
                    geometryTerrain = new THREE.PlaneGeometry( 4000, 4000, 256, 256 );
                else
                    geometryTerrain = new THREE.PlaneGeometry( 4000, 2000, 256, 256 );

                this.disMat = new THREE.MeshStandardMaterial({
                    color : 0x10c010,
                    displacementMap: this.heightMap.texture,
                    displacementScale: this.bigCanvas? 180 : 150,
                });

				terrain = new THREE.Mesh( geometryTerrain, this.disMat );
				terrain.position.set( 0, 0, 0 );
				terrain.rotation.x = - Math.PI / 2;
				terrain.visible = true;
				this.scene.add( terrain );

                this.renderer = new THREE.WebGLRenderer({ canvas: this.backgroundDom});
				this.renderer.setPixelRatio( window.devicePixelRatio );
				this.renderer.setSize( this.backgroundDom.getBoundingClientRect().width, this.backgroundDom.getBoundingClientRect().height );

				this.onWindowResize();

				window.addEventListener( 'resize', this.onWindowResize, false );
                let fLow = 0.1, fHigh = 0.8;
                this.lightVal = THREE.MathUtils.clamp( this.lightVal + 0.5 * clock.getDelta(), fLow, fHigh );

                let valNorm = ( this.lightVal - fLow ) / ( fHigh - fLow );

                this.scene.background.setHSL( 0.1, 0.6, this.lightVal );
                this.scene.fog.color.setHSL( 0.1, 0.6, this.lightVal );
                this.directionalLight.intensity = THREE.MathUtils.mapLinear( valNorm, 0, 1, 0.1, 1.5 );
                this.pointLight.intensity = THREE.MathUtils.mapLinear( valNorm, 0, 1, 0.9, 1.5 );

                const Gloader = new GLTFLoader();
                Gloader.load( './objects/Flamingo.glb', this.gltFLoaded);

                const textureLoader = new THREE.TextureLoader();

				const textureFlare0 = textureLoader.load( './images/lensflare.png' );
				const textureFlare3 = textureLoader.load( './images/lensflare3.png' );

				if(this.bigCanvas)
                    this.addLensFlare(6000, -50, -1000, textureFlare0, textureFlare3 );
                else
                    this.addLensFlare(6000, -100, -500, textureFlare0, textureFlare3 );
                this.animate();
            },
            addLensFlare(x, y, z , textureFlare0, textureFlare3){
                const light = new THREE.PointLight( 0xffff55, 2.5, 2000, 0 );
                light.position.set( x, y, z );
                this.scene.add( light );
                const lensflare = new Lensflare();
                lensflare.addElement( new LensflareElement( textureFlare0, 500, 0.2, light.color ) );
                lensflare.addElement( new LensflareElement( textureFlare3, 60, 0.6 ) );
                lensflare.addElement( new LensflareElement( textureFlare3, 70, 0.7 ) );
                lensflare.addElement( new LensflareElement( textureFlare3, 120, 0.9 ) );
                lensflare.addElement( new LensflareElement( textureFlare3, 70, 1 ) );
                light.add( lensflare );
            },
            gltFLoaded(gltf){
                if(this.bigCanvas){
                    gltf.scene.position.set(-2500,220,0);   
                    gltf.scene.scale.set(0.2,0.2,0.2);

                }else{
                    gltf.scene.position.set(-2500,220,20);
                    gltf.scene.scale.set(0.1,0.1,0.1);
                }
                
                const color = gltf.scene.children[0].geometry.attributes.color
                for(let i=0; i<color.count; i++ ){
                    const r = color.getX(i);
                    if(r == 0.7677687406539917){
                        color.setXYZ(i, ...[0.98,1,0.98]);
                    }else if(r== 0.06372379511594772){
                        color.setXYZ(i, ...[0.1,0.2,0.1]);
                    }
                }
                gltf.scene.children[0].geometry.attributes.color.needsUpdate = true;
                gltf.scene.rotation.y = Math.PI / 2;
                this.scene.add(gltf.scene);
                this.birdModel = gltf;
                this.mixer = new THREE.AnimationMixer( gltf.scene );
				this.mixer.clipAction( gltf.animations[ 0 ] ).play();
                const bird = {
                    bird: gltf.scene,
                    mixer: this.mixer
                };
                birds.push(bird);
                this.cloneRandomBirdInstance();
            },
            cloneRandomBirdInstance(){
                for(let i=0; i<10; i++){
                    const nbird = this.birdModel.scene.clone();
                    nbird.position.z = this.bigCanvas? (Math.random()*1000)-500 :(Math.random()*500)-250;
                    nbird.position.y = this.bigCanvas? 210 + (Math.random()*50): 180 + (Math.random()*50);
                    nbird.position.x = -3000 - Math.random() * 1000;
                    this.scene.add(nbird);
                    const mixer = new THREE.AnimationMixer(nbird);
                    mixer.clipAction(this.birdModel.animations[ 0 ] ).play();
                    mixer.setTime(Math.random()*5);
                    const bird = {
                        bird: nbird,
                        mixer: mixer
                    };
                    birds.push(bird);
                }
                app._props.loadPercentage += 20;
                document.dispatchEvent(updateProgressEvent);
            },
            onPointerMove( e ) {
				if ( e.isPrimary === false ) return;
				mouseX = e.clientX;
				mouseY = e.clientY;
                target.x = mouseX;
                target.y = mouseY;
			},
            onDeviceRotation(e){
                const con = document.getElementById('console');
				rotaionX = rotaionX + e.rotationRate.beta;
				rotaionY = rotaionY + e.rotationRate.alpha;
                rotTarget.x = e.rotationRate.beta;
                rotTarget.y = e.rotationRate.alpha;
            },
            onWindowResize() {
                this.backgroundDom.style.width = '100%';
                const width = this.backgroundDom.clientWidth;
                const height = this.backgroundDom.clientHeight;
				this.renderer.setSize( width, height );
				this.camera.aspect = width / height;
				this.camera.updateProjectionMatrix();
			},
            render(){
                let delta = clock.getDelta();
                for(let i=0; i <  birds.length; i++){
                    birds[i].mixer?.update( delta*2 );
                    birds[i].bird.position.x += 100 * delta;
                    if(birds[i].bird.position.x > 1200){
                        birds[i].bird.position.x = -2000 - Math.random() * 500;
                    }
                }
                if(this.bigCanvas){
                    this.camera.position.z = Math.max(-350,Math.min(this.camera.position.z + (( mouseX - windowHalfX - this.camera.position.z ) * 0.005), 350));
                    this.camera.position.y = Math.max(280,Math.min(this.camera.position.y + (( mouseY - windowHalfY - this.camera.position.y ) * 0.002), 370));
                    this.camera.lookAt(0,150,0);
                }else{
                    this.camera.position.z = Math.max(-350,Math.min(this.camera.position.z + (( rotaionX + this.camera.position.z ) * 0.002), 350));
                    this.camera.lookAt(0,150,0);
                }
				if ( terrain.visible ) {
                    this.uniformsNoise[ 'offset' ].value.x += delta * 0.2;
                    this.quadTarget.material = this.heightMapNoiseShaderMat;
                    this.renderer.setRenderTarget( this.heightMap );
                    this.renderer.clear();
                    this.renderer.render( this.sceneRenderTarget, this.cameraOrtho );
					this.renderer.setRenderTarget( null );
					this.renderer.render( this.scene, this.camera );
				}
            },
            animate() {
                if(!this.bigCanvas)
                    window.addEventListener( 'devicemotion', this.onDeviceRotation, false );
                else
                    window.addEventListener( 'pointermove', this.onPointerMove );
				this.renderer.setAnimationLoop(this.render);
			},
            suspendBackgroundRender(){
                if(!this.bigCanvas)
                    window.removeEventListener( 'devicemotion', this.onDeviceRotation );
                else
                    window.removeEventListener( 'pointermove',this.onPointerMove);
				this.renderer.setAnimationLoop(null);
            },
            cbTextAppeared(entries, observer){
                entries.forEach(entry => {
                    if (
                        entry &&
                        entry.isIntersecting &&
                        entry.intersectionRatio >= 0.1
                      ){
                    entry.target.classList.add('lineUp');
                      }
                  });
            },
            updateVideoLoadProgress(){
                app._props.loadPercentage += 20;
                document.dispatchEvent(updateProgressEvent);
            },
            forceRenderLoader(){
                this.dummyKey = !this.dummyKey;
            },
            skipOrientation(){
                this.orientationRequest = false;
                document.dispatchEvent(updateProgressEvent);
            },
            requestOrientation(){
                if (typeof(DeviceOrientationEvent) !== 'undefined' && typeof(DeviceOrientationEvent.requestPermission) === 'function'){
                    DeviceOrientationEvent.requestPermission().then(response => {
                        if(response == 'granted'){
                            this.orientationPermissionGranted = true;
                        }
                    }).catch();
                }
                this.orientationRequest = false;
                document.dispatchEvent(updateProgressEvent);
            },
            initBackendRenderEngine(){
                backendCanvas = document.getElementById('perspectiveCardCanvas');
                this.cardCount = this.bigCanvas ? 2 : 1; 
                for(let i=0; i<this.cardCount;i++){
                    const perspectiveCardScene = new THREE.Scene();
                    const fov = this.bigCanvas ? 20 : 55;
                    const perspectiveCardCamera = new THREE.PerspectiveCamera( fov, bCanvaWidth/bCanvaHeight, 0.1, 2000 );
                    if(this.bigCanvas){
                        perspectiveCardCamera.position.z = 50;
                        perspectiveCardCamera.zoom = 1;
                        perspectiveCardScene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444, 3 ) );
                        const light = new THREE.DirectionalLight( 0xffffff, 3 );
                        light.position.set( 10, 10, 10 );
                        perspectiveCardScene.add( light );
                    }else{
                        perspectiveCardCamera.position.z = 8;
                        perspectiveCardCamera.zoom = 1.8;
                        perspectiveCardCamera.position.y = -5;
                        perspectiveCardCamera.lookAt(0,-5,-10);
                        perspectiveCardScene.fog = new THREE.FogExp2( 0xb0c1b5, 0.0042 );
                        perspectiveCardScene.add( new THREE.HemisphereLight( 0xaaaaaa, 0x444444, 3 ) );
                        const light = new THREE.DirectionalLight( 0xffffff, 2 );
                        light.castShadow = true;
                        light.position.set( 15, 15, 15 );
                        light.target.y=0;
                        light.target.z=-10;
                        perspectiveCardScene.add( light );
                        perspectiveCardScene.add( light.target );
                    }
                    perspectiveCardScene.userData.element = document.getElementById('perspectiveCardDiv'+ (i+1));
                    perspectiveCardScene.userData.camera = perspectiveCardCamera;

                    backendScenes.push(perspectiveCardScene);
                    const Gloader = new GLTFLoader();
                    const smallCanvas = !this.bigCanvas;
                    const modelFileName = this.bigCanvas? 'panda.glb' : 'mpanda.glb';
                    Gloader.load( './objects/'+modelFileName, (gltf)=>{
                        if(smallCanvas){
                            gltf.scene.position.y = -10.5;
                            gltf.scene.scale.set(3.5,3.5,3.5);
                            gltf.scene.traverse(function(child) {
                                if (child.isMesh) {
                                  child.castShadow = true;
                                  child.receiveShadow = true;
                                }
                            })
                        }else{
                            gltf.scene.position.y = -11;
                            gltf.scene.scale.set(3.8,3.8,3.8);
                        }
                        backendScenes[i].add(gltf.scene);
                    });
                }
                backendRenderer = new THREE.WebGLRenderer( { canvas: backendCanvas, antialias: true } );
				backendRenderer.setClearColor( 0xffffff, this.bigCanvas? 0 : 1 );
				backendRenderer.setPixelRatio( window.devicePixelRatio );
                backendRenderer.setSize( backendCanvas.getBoundingClientRect().width, backendCanvas.getBoundingClientRect().height, false );
            },
            startBackendCanvasRendering(){
                if(!this.bigCanvas){
                    rotTarget.x = 0;
                    rotTarget.y=0;
                    window.addEventListener( 'devicemotion', this.onDeviceRotation, false );
                }
                else
                    document.addEventListener( 'pointermove', this.onPointerMove );
				backendRenderer.setAnimationLoop(this.backendCanvasRender);
            },
            suspendBackendCanvasRendering(){
                if(!this.bigCanvas){
                    window.removeEventListener( 'devicemotion', this.onDeviceRotation );
                    rotTarget.x = 0;
                    rotTarget.y=0;
                    backendScenes[0].userData.camera.position.x = 0;
                    backendScenes[0].userData.camera.position.y = -5;
                }
                else
                    document.removeEventListener( 'pointermove', this.onPointerMove );
                backendRenderer.setAnimationLoop(null);
            },
            backendCanvasRender(){
                backendRenderer.setClearColor( 0xffffff , this.bigCanvas? 0 : 1);
				backendRenderer.setScissorTest( false );
				backendRenderer.clear();
				backendRenderer.setClearColor( 0xfffff0 , this.bigCanvas? 0 : 1);
				backendRenderer.setScissorTest( true );
                for(let i=0; i<this.cardCount;i++){
                    const rect = backendScenes[i].userData.element.getBoundingClientRect();
                    if ( rect.bottom < 0 || rect.top > window.innerHeight ||
                        rect.right < 0 || rect.left > window.innerWidth ) {
                       continue; // it's off screen
                   }
                   const width = rect.right - rect.left;
                   const height = rect.bottom - rect.top;
                   const bottom = Math.abs(backendCanvas.getBoundingClientRect().bottom - rect.bottom);
                   if(this.bigCanvas){
                    const midY = (rect.top + (height/2));
                    const midX = (rect.left + (width/2));
                    backendScenes[i].children[2]?.lookAt((target.x - midX)/25,-(target.y - midY)/25,60);
                   }else{
                    backendScenes[i].userData.camera.position.x = backendScenes[i].userData.camera.position.x + -(rotTarget.x )*0.002;
                    backendScenes[i].userData.camera.position.y = Math.max(-10,backendScenes[i].userData.camera.position.y - -(rotTarget.y )*0.002);
                    backendScenes[i].userData.camera.lookAt(0,-5,-25);
                   }
				   backendScenes[i].userData.camera.aspect = width / height;
				   backendScenes[i].userData.camera.updateProjectionMatrix();
                   backendRenderer.setViewport( rect.left - backendCanvas.getBoundingClientRect().left, bottom, width, height );
                   backendRenderer.setScissor( rect.left - backendCanvas.getBoundingClientRect().left, bottom, width, height );
                   backendRenderer.render( backendScenes[i], backendScenes[i].userData.camera );
                }
            },
        },
        template:`
            <div id="homeLoaderBackground" v-if="!rootApp._props.isLoaded">
                <div style="width:80%; display:flex;justify-content:center;align-items: center;flex-direction:column">
                    <div :key="dummyKey" id="homeLoader" :style="{'width':rootApp._props.loadPercentage+'%'}"></div>
                    <span :key="dummyKey" style="margin-top:1rem">{{rootApp._props.loadPercentage+'%'}}</span>
                </div>
                <div v-if="!bigCanvas && orientationRequest" id="orientationPromptDiv">
                    <span>For better experience allow device motion</span>
                    <div id="orientationOptionDiv">
                        <button class="orientOption" style="background-color:#555555;" @click="skipOrientation()">Skip</button>
                        <button class="orientOption" @click="requestOrientation()">Allow</button>
                    </div>
                </div>
            </div>
            <div v-if="bigCanvas">
                <div class="homeAppHeader">
                    <div class="homeAppHeaderTitle">Creative<img id="titleX" src="./images/favcon.svg"></div>
                    <nav class="homeAppLinksContainer">
                        <ul class="homeAppNavLink">
                            <li class="homeAppLinkItem">Projects</li>
                            <li class="homeAppLinkItem">Services</li>
                            <li class="homeAppLinkItem">About</li>
                            <li class="homeAppLinkItem">Join</li>
                        </ul>
                    </nav>
                    <div id="homeAppContactContainer">
                        <div id="homeAppContactUs">CONTACT US</div>
                    </div>
                </div>
                <div id="homeAppBannerContainer">
                    <div id="homeAppBannerLogo">
                        <span id="logoTextX">X</span>
                        <span id="logoTextCreative">CREATIVE</span>
                        <!--<div id="logoOrg">
                            Powered by NEOITO
                        </div>-->
                        <table id="bannerOptions">
                            <tr>
                                <td><div class="bannerOptionsButton" style="">Contact Us</div></td>
                                <td><div class="bannerOptionsButton" style="background-color: aliceblue;color:black">See what's new</div></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div id="projectsContainer">
                    <p id="scrollLabel">- Scroll for more -</p>
                    <div id="projectContainerFlex">
                        <div id="projectsHeader">
                            <h1 id="projectsTitle">Projects</h1>
                        </div>
                        <div id="missionHeader">
                            <h1 style="font-size:3rem">Realize your next 3D Web-experience with Creative<span style="color:#6e9d53;font-size:1.2em">X</span></h1>
                            
                            <p style="font-size:1.75rem;color: rgb(110 110 110);">Work with us on conception, design, development and 3D visualization
                            of your projects from scratch to get sophisticated and unique web experience for your customers.</p>
                        </div>
                    </div>
                    <div id="showReelCardContainer">
                        <showreelcard></showreelcard>
                    </div>
                    <p class="projectSubTitle">We build epic realtime interactive experience to blow people's mind.</p>
                    <div id="perspectiveCardContainer">
                        <canvas id="perspectiveCardCanvas"></canvas>
                        <div id="perspectiveGridContainer">
                            <div id="perspectiveGrid">
                                <div class="perspectiveDiv">
                                    <div class="door" id="door11"><img style="height:100%; width:100%" src="./images/greendoor.png"></div>
                                    <div class="door" id="door12"><img style="height:100%; width:100%" src="./images/greendoor.png"></div>
                                    <div class="windowFrame">
                                        <div class="windowPane">
                                            <div class="windowCut" id="windowCut1">
                                                <div class="perspectiveCardDiv" id="perspectiveCardDiv1"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div style="height:100%;width:20%;"></div>
                                <div class="perspectiveDiv" style="justify-content: end;">
                                    <div class="door" id="door21"><img style="height:100%; width:100%" src="./images/greendoor.png"></div>
                                    <div class="door" id="door22"><img style="height:100%; width:100%" src="./images/greendoor.png"></div>
                                    <div class="windowFrame">
                                        <div class="windowPane">
                                            <div class="windowCut" id="windowCut2">
                                                <div class="perspectiveCardDiv" id="perspectiveCardDiv2"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div id="embedTitle"><span>EMBEDDING</span></div>
                        <div id="embedSub"><span>"Add an extra dimension to your existing websites hustle free and upscale your customer experience with mind blowing interactive 3D experience."</span></div>
                        <div id="lintel1"></div>
                        <div id="bushHedge"></div>
                        <div id="lintel2"></div>
                    </div>
                    <div id="svgPathContainers">
                        <svg id="beyondPathSvg" viewBox="0 0 1908 888" preserveAscpectRatio="xMidYMax meet">
                            <defs>
                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stop-color="#81c55c"/>
                            <stop offset="100%" stop-color="#bbe955"/>
                            </linearGradient>
                            </defs>
                            <path id="beyondPath" fill="none" stroke="url(#gradient1)" stroke-width="25"
                            d="M -15.00,145.50 C -15.00,145.50 88.50,115.50 165.00,148.50
                                241.50,181.50 309.00,219.00 361.50,274.50 414.00,330.00 507.00,445.50 528.00,550.50
                                549.00,655.50 579.00,708.00 645.00,711.00 711.00,714.00 807.00,664.50 823.50,586.50
                                840.00,508.50 817.50,447.00 810.00,381.00 802.50,315.00 841.50,264.00 883.50,249.00
                                925.50,234.00 1026.00,234.00 1083.00,271.50 1140.00,309.00 1198.50,354.00 1225.50,420.00
                                1252.50,486.00 1263.00,613.50 1237.50,690.00 1212.00,766.50 1149.00,792.00 1116.00,781.50
                                1083.00,771.00 1060.50,757.50 1051.50,727.50 1042.50,697.50 1062.00,670.50 1092.00,670.50
                                1122.00,670.50 1195.50,687.00 1270.50,748.50 1345.50,810.00 1438.50,831.00 1516.50,828.00
                                1594.50,825.00 1735.50,808.50 1789.50,786.00 1843.50,763.50 1923.00,693.00 1923.00,693.00" />
                        </svg>
                        <svg id="visionPathSvg" viewBox="0 0 1912 1016" preserveAscpectRatio="xMidYMax meet">
                            <defs>
                            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stop-color="#1aaaff"/>
                            <stop offset="50%"   stop-color="#1aaaff"/>
                            <stop offset="100%" stop-color="#ff2525"/>
                            </linearGradient>
                            </defs>
                            <path id="visionPath" fill="none" stroke="url(#gradient2)" stroke-width="25"
                                d="M -18.00,195.00 C -18.00,195.00 79.50,295.50 190.50,327.00
                                    301.50,358.50 552.00,405.00 820.50,325.50 1089.00,246.00 1107.00,175.50 1101.00,123.00 1095.00,70.50 1059.00,45.00 997.50,46.50
                                    936.00,48.00 844.50,72.00 816.00,117.00 787.50,162.00 736.50,280.50 772.50,397.50
                                    808.50,514.50 892.50,601.50 943.50,631.50 994.50,661.50 1021.50,675.00 1086.00,690.00
                                    1150.50,705.00 1195.50,723.00 1227.00,775.50 1258.50,828.00 1236.00,874.50 1285.50,919.50
                                    1335.00,964.50 1365.00,979.50 1455.00,985.50 1545.00,991.50 1564.50,1000.50 1665.00,978.00
                                    1765.50,955.50 1947.00,870.00 1954.50,861.00" />
                        </svg>
                        <svg id="reachPathSvg" viewBox="0 0 1912 1016" preserveAscpectRatio="xMidYMax meet">
                            <path id="reachPath" fill="none" stroke="#ff4242" stroke-width="25"
                            d="M 1938.00,54.00 C 1938.00,54.00 1857.00,73.50 1801.50,103.50
                            1746.00,133.50 1411.50,283.50 1207.50,280.50 1003.50,277.50 813.00,265.50 744.00,304.50
                            675.00,343.50 583.50,424.50 480.00,432.00 376.50,439.50 130.50,364.50 46.50,528.00
                            -37.50,691.50 -48.00,703.50 -112.50,717.00" />
                        </svg>
                    </div>
                    <div class="grid" style="margin-top:30vh">
                        <jewelleryframe :identifier="'jewelleryViewer1'"></jewelleryframe>
                        <div class="typog" id="typog1">Beyond</div>
                        <div class="typog" id="typog2">Visions</div>
                        <productframe :identifier="'jewelleryViewer2'" :margintop="'100vh'"></productframe>
                    </div>
                    <div class="grid" style="margin-top:15vh">
                        <realestateframe :identifier="'jewelleryViewer3'"></realestateframe>
                        <div class="typog" id="typog3">Within</div>
                        <div class="typog" id="typog4">Reach.</div>
                        <patternengineframe :identifier="'jewelleryViewer4'" :margintop="'100vh'"></patternengineframe>
                    </div>
                    <div id="footerContainer">
                        <div id="footerTitle">
                            <div style="font-size: 1.5rem;margin-bottom:2rem">CreativeX</div>
                            <div style="font-size: 1rem;font-family:sans-serif">
                                Contact us <br>
                                francis.xvr@outlook.com<br>
                                safaldasg@gmail.com
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            
            <div v-else>
                <div class="homeAppHeader">
                    <div id="scrollToolTip">+ Scroll for more +</div>
                    <div id="console" style="position:absolute; color:red;"></div>
                    <div id="homeAppHeaderTitleContainer">
                        <div class="homeAppHeaderTitle">Creative<img id="titleX" src="./images/favcon.svg"></div>
                        <div id="homeAppContactUs">CONTACT US</div>
                    </div>
                    <nav class="homeAppLinksContainer">
                        <ul class="homeAppNavLink">
                            <li class="homeAppLinkItem">Projects</li>
                            <li class="homeAppLinkItem">Services</li>
                            <li class="homeAppLinkItem">About</li>
                            <li class="homeAppLinkItem">Join</li>
                        </ul>
                    </nav>
                </div>
                <div id="homeAppBannerContainer">
                    <div id="homeAppBannerLogo">
                        <span id="logoTextX">X</span>
                        <span id="logoTextCreative">CREATIVE</span>
                        <!--<div id="logoOrg">
                            Powered by NEOITO
                        </div>-->
                        <table id="bannerOptions">
                            <tr>
                                <td><div class="bannerOptionsButton" style="">Contact Us</div></td>
                                <td><div class="bannerOptionsButton" style="background-color: aliceblue;color:black">See what's new</div></td>
                            </tr>
                        </table>
                    </div>
                </div>
                <div id="projectsContainer">
                    <div id="projectContainerFlex">
                        <div id="projectsHeader">
                            <h1 id="projectsTitle">Projects</h1>
                        </div>
                        <div id="missionHeader">
                            <h1 style="font-size:1.8rem; line-height:1.2em">Realize your next 3D Web-experience with Creative<span style="color:#6e9d53;font-size:1.2em">X</span></h1>
                            
                            <p style="font-size:1.2rem;color: rgb(110 110 110);">Work with us on conception, design, development and 3D visualization
                            of your projects from scratch to get sophisticated and unique web experience for your customers.</p>
                        </div>
                    </div>
                    <div id="showReelCardContainer">
                        <showreelcard></showreelcard>
                    </div>
                    
                    <p class="projectSubTitle">We build epic realtime interactive experience to blow people's mind.</p>
                    
                    <div id="perspectiveCardContainer">
                        <h1 class="demoSectionTitle">Embedding</h1>
                        <div id="mobileBodyDesignContainer">
                            <div id="mobileDisplayContainer">
                                <div id="dynamicIsland"></div>
                                <div id="powerButton"></div>
                                <div id="volumeButton1"></div>
                                <div id="volumeButton2"></div>
                                <canvas id="perspectiveCardCanvas"></canvas>
                                <div id="perspectiveCardDiv1" class="perspectiveCardDiv"></div>
                            </div>
                        </div>
                    </div>
                    <div class="demoSection">
                        <p class="demoSectionPara">
                            Add an extra dimension to your existing websites hustle free and upscale your customer experience with mind blowing interactive 3D experience.
                        </p>
                    </div>
                    <div id="svgPathContainers">
                        <svg id="beyondPathSvg" viewBox="0 150 430 470" preserveAscpectRatio="xMidYMax meet">
                            <defs>
                            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stop-color="#81c55c"/>
                            <stop offset="100%" stop-color="#bbe955"/>
                            </linearGradient>
                            </defs>
                            <path id="beyondPath" fill="none" stroke="url(#gradient1)" stroke-width="15"
                            d="M -15.00,164.00
                            C -15.00,164.00 150.00,141.00 264.00,285.00
                            378.00,429.00 248.00,466.00 232.00,468.00
                            216.00,470.00 164.00,440.00 157.00,414.00
                            150.00,388.00 152.00,337.00 184.00,325.00
                            216.00,313.00 300.00,312.00 342.00,344.00
                            384.00,376.00 367.00,409.00 383.00,435.00
                            399.00,461.00 426.00,463.00 430.00,464.00" />
                        </svg>
                        <svg id="visionPathSvg" viewBox="0 200 387 500" preserveAscpectRatio="xMidYMax meet">
                            <path id="visionPath" fill="none" stroke="#1aaaff"  stroke-width="15"
                            d="M 396.00,221.00
                            C 394.00,221.00 356.00,220.00 315.00,259.00
                            274.00,298.00 253.00,359.00 218.00,378.00
                            183.00,397.00 139.00,408.00 99.00,407.00
                            59.00,406.00 30.00,446.00 33.00,464.00
                            36.00,482.00 31.00,502.00 70.00,523.00
                            109.00,544.00 124.00,542.00 157.00,538.00
                            190.00,534.00 211.00,510.00 244.00,504.00
                            277.00,498.00 350.00,498.00 369.00,520.00
                            388.00,542.00 393.00,577.00 399.00,584.00M 504.00,446.00" />
                        </svg>
                        <svg id="reachPathSvg" viewBox="0 200 387 510" preserveAscpectRatio="xMidYMax meet">
                            <defs>
                            <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%"   stop-color="#1aaaff"/>
                            <stop offset="50%"   stop-color="#1aaaff"/>
                            <stop offset="100%" stop-color="#f525f5"/>
                            </linearGradient>
                            </defs>
                            <path id="reachPath" fill="none" stroke="url(#gradient2)" stroke-width="15"
                            d="M -11.00,203.00
                            C -11.00,203.00 -21.00,299.00 100.00,364.00
                            221.00,429.00 245.00,440.00 277.00,449.00
                            309.00,458.00 344.00,453.00 361.00,441.00
                            378.00,429.00 385.00,379.00 373.00,368.00
                            361.00,357.00 331.00,341.00 305.00,346.00
                            279.00,351.00 248.00,386.00 242.00,400.00
                            236.00,414.00 212.00,470.00 200.00,484.00
                            188.00,498.00 163.00,531.00 145.00,549.00
                            127.00,567.00 39.00,654.00 15.00,666.00
                            -9.00,678.00 -46.00,703.00 -46.00,703.00" />
                        </svg>
                        <svg id="endPathSvg" viewBox="0 190 387 400" preserveAscpectRatio="xMidYMax meet">
                        <path id="endPath" fill="none" stroke="#ff4242" stroke-width="15"
                        d="M -9.00,193.00
                        C -9.00,193.00 9.00,280.00 32.00,313.00
                            55.00,346.00 76.00,362.00 83.00,365.00
                            90.00,368.00 123.00,379.00 133.00,384.00
                            143.00,389.00 158.00,404.00 164.00,423.00
                            170.00,442.00 175.00,460.00 201.00,473.00
                            227.00,486.00 251.00,496.00 272.00,498.00
                            293.00,500.00 329.00,508.00 358.00,511.00
                            387.00,514.00 398.00,543.00 405.00,553.00" />
                        </svg>
                    </div>

                    <div class="grid">
                        <div class="typog" id="typog1">Beyond</div>
                        <jewelleryframe :identifier="'jewelleryViewer1'"></jewelleryframe>
                        <div class="typog" id="typog2">Visions</div>
                        <productframe :identifier="'jewelleryViewer2'"  :margintop="'0'"></productframe>
                    </div>
                    <div class="grid">
                        <div class="typog" id="typog3">Within</div>
                        <realestateframe :identifier="'jewelleryViewer3'"></realestateframe>
                        <div class="typog" id="typog4">Reach.</div>
                        <patternengineframe :identifier="'jewelleryViewer4'" :margintop="'0'"></patternengineframe>
                    </div>
                    <div id="footerContainer">
                        <div id="footerTitle">
                            <div style="font-size: 1.1rem;margin-bottom:1rem">CreativeX</div>
                            <div style="font-size: 1rem;font-family:sans-serif;">
                                Contact us <br>
                                francis.xvr@outlook.com<br>
                                safaldasg@gmail.com
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
            

        `
    });

    return app;
};

export {initHomeMainApp};