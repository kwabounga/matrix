/*!
 * @pixi/filter-glitch - v4.0.0
 * Compiled Wed, 03 Mar 2021 00:14:06 UTC
 *
 * @pixi/filter-glitch is licensed under the MIT License.
 * http://www.opensource.org/licenses/mit-license
 */
var __filters=function(e,t,i,n){"use strict";var r=function(e,t){return(r=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var i in t)Object.prototype.hasOwnProperty.call(t,i)&&(e[i]=t[i])})(e,t)};Object.create;Object.create;var o=function(e){function o(n){var r=e.call(this,"attribute vec2 aVertexPosition;\nattribute vec2 aTextureCoord;\n\nuniform mat3 projectionMatrix;\n\nvarying vec2 vTextureCoord;\n\nvoid main(void)\n{\n    gl_Position = vec4((projectionMatrix * vec3(aVertexPosition, 1.0)).xy, 0.0, 1.0);\n    vTextureCoord = aTextureCoord;\n}","// precision highp float;\n\nvarying vec2 vTextureCoord;\nuniform sampler2D uSampler;\n\nuniform vec4 filterArea;\nuniform vec4 filterClamp;\nuniform vec2 dimensions;\nuniform float aspect;\n\nuniform sampler2D displacementMap;\nuniform float offset;\nuniform float sinDir;\nuniform float cosDir;\nuniform int fillMode;\n\nuniform float seed;\nuniform vec2 red;\nuniform vec2 green;\nuniform vec2 blue;\n\nconst int TRANSPARENT = 0;\nconst int ORIGINAL = 1;\nconst int LOOP = 2;\nconst int CLAMP = 3;\nconst int MIRROR = 4;\n\nvoid main(void)\n{\n    vec2 coord = (vTextureCoord * filterArea.xy) / dimensions;\n\n    if (coord.x > 1.0 || coord.y > 1.0) {\n        return;\n    }\n\n    float cx = coord.x - 0.5;\n    float cy = (coord.y - 0.5) * aspect;\n    float ny = (-sinDir * cx + cosDir * cy) / aspect + 0.5;\n\n    // displacementMap: repeat\n    // ny = ny > 1.0 ? ny - 1.0 : (ny < 0.0 ? 1.0 + ny : ny);\n\n    // displacementMap: mirror\n    ny = ny > 1.0 ? 2.0 - ny : (ny < 0.0 ? -ny : ny);\n\n    vec4 dc = texture2D(displacementMap, vec2(0.5, ny));\n\n    float displacement = (dc.r - dc.g) * (offset / filterArea.x);\n\n    coord = vTextureCoord + vec2(cosDir * displacement, sinDir * displacement * aspect);\n\n    if (fillMode == CLAMP) {\n        coord = clamp(coord, filterClamp.xy, filterClamp.zw);\n    } else {\n        if( coord.x > filterClamp.z ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.x -= filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x = filterClamp.z * 2.0 - coord.x;\n            }\n        } else if( coord.x < filterClamp.x ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.x += filterClamp.z;\n            } else if (fillMode == MIRROR) {\n                coord.x *= -filterClamp.z;\n            }\n        }\n\n        if( coord.y > filterClamp.w ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.y -= filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y = filterClamp.w * 2.0 - coord.y;\n            }\n        } else if( coord.y < filterClamp.y ) {\n            if (fillMode == TRANSPARENT) {\n                discard;\n            } else if (fillMode == LOOP) {\n                coord.y += filterClamp.w;\n            } else if (fillMode == MIRROR) {\n                coord.y *= -filterClamp.w;\n            }\n        }\n    }\n\n    gl_FragColor.r = texture2D(uSampler, coord + red * (1.0 - seed * 0.4) / filterArea.xy).r;\n    gl_FragColor.g = texture2D(uSampler, coord + green * (1.0 - seed * 0.3) / filterArea.xy).g;\n    gl_FragColor.b = texture2D(uSampler, coord + blue * (1.0 - seed * 0.2) / filterArea.xy).b;\n    gl_FragColor.a = texture2D(uSampler, coord).a;\n}\n")||this;return r.offset=100,r.fillMode=o.TRANSPARENT,r.average=!1,r.seed=0,r.minSize=8,r.sampleSize=512,r._slices=0,r._offsets=new Float32Array(1),r._sizes=new Float32Array(1),r._direction=0,r.uniforms.dimensions=new Float32Array(2),r._canvas=document.createElement("canvas"),r._canvas.width=4,r._canvas.height=r.sampleSize,r.texture=t.Texture.from(r._canvas,{scaleMode:i.SCALE_MODES.NEAREST}),Object.assign(r,o.defaults,n),r}return function(e,t){function i(){this.constructor=e}r(e,t),e.prototype=null===t?Object.create(t):(i.prototype=t.prototype,new i)}(o,e),o.prototype.apply=function(e,t,i,n){var r=t.filterFrame,o=r.width,s=r.height;this.uniforms.dimensions[0]=o,this.uniforms.dimensions[1]=s,this.uniforms.aspect=s/o,this.uniforms.seed=this.seed,this.uniforms.offset=this.offset,this.uniforms.fillMode=this.fillMode,e.applyFilter(this,t,i,n)},o.prototype._randomizeSizes=function(){var e=this._sizes,t=this._slices-1,i=this.sampleSize,n=Math.min(this.minSize/i,.9/this._slices);if(this.average){for(var r=this._slices,o=1,s=0;s<t;s++){var f=o/(r-s),l=Math.max(f*(1-.6*Math.random()),n);e[s]=l,o-=l}e[t]=o}else{o=1;var a=Math.sqrt(1/this._slices);for(s=0;s<t;s++){l=Math.max(a*o*Math.random(),n);e[s]=l,o-=l}e[t]=o}this.shuffle()},o.prototype.shuffle=function(){for(var e=this._sizes,t=this._slices-1;t>0;t--){var i=Math.random()*t>>0,n=e[t];e[t]=e[i],e[i]=n}},o.prototype._randomizeOffsets=function(){for(var e=0;e<this._slices;e++)this._offsets[e]=Math.random()*(Math.random()<.5?-1:1)},o.prototype.refresh=function(){this._randomizeSizes(),this._randomizeOffsets(),this.redraw()},o.prototype.redraw=function(){var e,t=this.sampleSize,i=this.texture,n=this._canvas.getContext("2d");n.clearRect(0,0,8,t);for(var r=0,o=0;o<this._slices;o++){e=Math.floor(256*this._offsets[o]);var s=this._sizes[o]*t,f=e>0?e:0,l=e<0?-e:0;n.fillStyle="rgba("+f+", "+l+", 0, 1)",n.fillRect(0,r>>0,t,s+1>>0),r+=s}i.baseTexture.update(),this.uniforms.displacementMap=i},Object.defineProperty(o.prototype,"sizes",{get:function(){return this._sizes},set:function(e){for(var t=Math.min(this._slices,e.length),i=0;i<t;i++)this._sizes[i]=e[i]},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"offsets",{get:function(){return this._offsets},set:function(e){for(var t=Math.min(this._slices,e.length),i=0;i<t;i++)this._offsets[i]=e[i]},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"slices",{get:function(){return this._slices},set:function(e){this._slices!==e&&(this._slices=e,this.uniforms.slices=e,this._sizes=this.uniforms.slicesWidth=new Float32Array(e),this._offsets=this.uniforms.slicesOffset=new Float32Array(e),this.refresh())},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"direction",{get:function(){return this._direction},set:function(e){if(this._direction!==e){this._direction=e;var t=e*n.DEG_TO_RAD;this.uniforms.sinDir=Math.sin(t),this.uniforms.cosDir=Math.cos(t)}},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"red",{get:function(){return this.uniforms.red},set:function(e){this.uniforms.red=e},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"green",{get:function(){return this.uniforms.green},set:function(e){this.uniforms.green=e},enumerable:!1,configurable:!0}),Object.defineProperty(o.prototype,"blue",{get:function(){return this.uniforms.blue},set:function(e){this.uniforms.blue=e},enumerable:!1,configurable:!0}),o.prototype.destroy=function(){var e;null===(e=this.texture)||void 0===e||e.destroy(!0),this.texture=this._canvas=this.red=this.green=this.blue=this._sizes=this._offsets=null},o.defaults={slices:5,offset:100,direction:0,fillMode:0,average:!1,seed:0,red:[0,0],green:[0,0],blue:[0,0],minSize:8,sampleSize:512},o.TRANSPARENT=0,o.ORIGINAL=1,o.LOOP=2,o.CLAMP=3,o.MIRROR=4,o}(t.Filter);return e.GlitchFilter=o,Object.defineProperty(e,"__esModule",{value:!0}),e}({},PIXI,PIXI,PIXI);Object.assign(PIXI.filters,__filters);
//# sourceMappingURL=filter-glitch.js.map