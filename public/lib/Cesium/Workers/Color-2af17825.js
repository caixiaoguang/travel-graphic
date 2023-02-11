/**
 * @license
 * Cesium - https://github.com/CesiumGS/cesium
 * Version 1.96.6
 *
 * Copyright 2011-2022 Cesium Contributors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Columbus View (Pat. Pend.)
 *
 * Portions licensed separately.
 * See https://github.com/CesiumGS/cesium/blob/main/LICENSE.md for full licensing details.
 */

define(["exports","./RuntimeError-a977b8e0","./defaultValue-028a8a27","./Transforms-66eda18c","./ComponentDatatype-438cad2a"],function(j,n,t,l,i){"use strict";function F(r,o,f){return f<0&&(f+=1),f>1&&(f-=1),f*6<1?r+(o-r)*6*f:f*2<1?o:f*3<2?r+(o-r)*(2/3-f)*6:r}function e(r,o,f,C){this.red=t.defaultValue(r,1),this.green=t.defaultValue(o,1),this.blue=t.defaultValue(f,1),this.alpha=t.defaultValue(C,1)}e.fromCartesian4=function(r,o){return n.Check.typeOf.object("cartesian",r),t.defined(o)?(o.red=r.x,o.green=r.y,o.blue=r.z,o.alpha=r.w,o):new e(r.x,r.y,r.z,r.w)},e.fromBytes=function(r,o,f,C,s){return r=e.byteToFloat(t.defaultValue(r,255)),o=e.byteToFloat(t.defaultValue(o,255)),f=e.byteToFloat(t.defaultValue(f,255)),C=e.byteToFloat(t.defaultValue(C,255)),t.defined(s)?(s.red=r,s.green=o,s.blue=f,s.alpha=C,s):new e(r,o,f,C)},e.fromAlpha=function(r,o,f){return n.Check.typeOf.object("color",r),n.Check.typeOf.number("alpha",o),t.defined(f)?(f.red=r.red,f.green=r.green,f.blue=r.blue,f.alpha=o,f):new e(r.red,r.green,r.blue,o)};let m,A,c;l.FeatureDetection.supportsTypedArrays()&&(m=new ArrayBuffer(4),A=new Uint32Array(m),c=new Uint8Array(m)),e.fromRgba=function(r,o){return A[0]=r,e.fromBytes(c[0],c[1],c[2],c[3],o)},e.fromHsl=function(r,o,f,C,s){r=t.defaultValue(r,0)%1,o=t.defaultValue(o,0),f=t.defaultValue(f,0),C=t.defaultValue(C,1);let S=f,b=f,O=f;if(o!==0){let E;f<.5?E=f*(1+o):E=f+o-f*o;const g=2*f-E;S=F(g,E,r+1/3),b=F(g,E,r),O=F(g,E,r-1/3)}return t.defined(s)?(s.red=S,s.green=b,s.blue=O,s.alpha=C,s):new e(S,b,O,C)},e.fromRandom=function(r,o){r=t.defaultValue(r,t.defaultValue.EMPTY_OBJECT);let f=r.red;if(!t.defined(f)){const b=t.defaultValue(r.minimumRed,0),O=t.defaultValue(r.maximumRed,1);n.Check.typeOf.number.lessThanOrEquals("minimumRed",b,O),f=b+i.CesiumMath.nextRandomNumber()*(O-b)}let C=r.green;if(!t.defined(C)){const b=t.defaultValue(r.minimumGreen,0),O=t.defaultValue(r.maximumGreen,1);n.Check.typeOf.number.lessThanOrEquals("minimumGreen",b,O),C=b+i.CesiumMath.nextRandomNumber()*(O-b)}let s=r.blue;if(!t.defined(s)){const b=t.defaultValue(r.minimumBlue,0),O=t.defaultValue(r.maximumBlue,1);n.Check.typeOf.number.lessThanOrEquals("minimumBlue",b,O),s=b+i.CesiumMath.nextRandomNumber()*(O-b)}let S=r.alpha;if(!t.defined(S)){const b=t.defaultValue(r.minimumAlpha,0),O=t.defaultValue(r.maximumAlpha,1);n.Check.typeOf.number.lessThanOrEquals("minumumAlpha",b,O),S=b+i.CesiumMath.nextRandomNumber()*(O-b)}return t.defined(o)?(o.red=f,o.green=C,o.blue=s,o.alpha=S,o):new e(f,C,s,S)};const z=/^#([0-9a-f])([0-9a-f])([0-9a-f])([0-9a-f])?$/i,h=/^#([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})([0-9a-f]{2})?$/i,a=/^rgba?\(\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)\s*,\s*([0-9.]+%?)(?:\s*,\s*([0-9.]+))?\s*\)$/i,p=/^hsla?\(\s*([0-9.]+)\s*,\s*([0-9.]+%)\s*,\s*([0-9.]+%)(?:\s*,\s*([0-9.]+))?\s*\)$/i;e.fromCssColorString=function(r,o){n.Check.typeOf.string("color",r),t.defined(o)||(o=new e),r=r.replace(/\s/g,"");const f=e[r.toUpperCase()];if(t.defined(f))return e.clone(f,o),o;let C=z.exec(r);return C!==null?(o.red=parseInt(C[1],16)/15,o.green=parseInt(C[2],16)/15,o.blue=parseInt(C[3],16)/15,o.alpha=parseInt(t.defaultValue(C[4],"f"),16)/15,o):(C=h.exec(r),C!==null?(o.red=parseInt(C[1],16)/255,o.green=parseInt(C[2],16)/255,o.blue=parseInt(C[3],16)/255,o.alpha=parseInt(t.defaultValue(C[4],"ff"),16)/255,o):(C=a.exec(r),C!==null?(o.red=parseFloat(C[1])/(C[1].substr(-1)==="%"?100:255),o.green=parseFloat(C[2])/(C[2].substr(-1)==="%"?100:255),o.blue=parseFloat(C[3])/(C[3].substr(-1)==="%"?100:255),o.alpha=parseFloat(t.defaultValue(C[4],"1.0")),o):(C=p.exec(r),C!==null?e.fromHsl(parseFloat(C[1])/360,parseFloat(C[2])/100,parseFloat(C[3])/100,parseFloat(t.defaultValue(C[4],"1.0")),o):(o=void 0,o))))},e.packedLength=4,e.pack=function(r,o,f){return n.Check.typeOf.object("value",r),n.Check.defined("array",o),f=t.defaultValue(f,0),o[f++]=r.red,o[f++]=r.green,o[f++]=r.blue,o[f]=r.alpha,o},e.unpack=function(r,o,f){return n.Check.defined("array",r),o=t.defaultValue(o,0),t.defined(f)||(f=new e),f.red=r[o++],f.green=r[o++],f.blue=r[o++],f.alpha=r[o],f},e.byteToFloat=function(r){return r/255},e.floatToByte=function(r){return r===1?255:r*256|0},e.clone=function(r,o){if(!!t.defined(r))return t.defined(o)?(o.red=r.red,o.green=r.green,o.blue=r.blue,o.alpha=r.alpha,o):new e(r.red,r.green,r.blue,r.alpha)},e.equals=function(r,o){return r===o||t.defined(r)&&t.defined(o)&&r.red===o.red&&r.green===o.green&&r.blue===o.blue&&r.alpha===o.alpha},e.equalsArray=function(r,o,f){return r.red===o[f]&&r.green===o[f+1]&&r.blue===o[f+2]&&r.alpha===o[f+3]},e.prototype.clone=function(r){return e.clone(this,r)},e.prototype.equals=function(r){return e.equals(this,r)},e.prototype.equalsEpsilon=function(r,o){return this===r||t.defined(r)&&Math.abs(this.red-r.red)<=o&&Math.abs(this.green-r.green)<=o&&Math.abs(this.blue-r.blue)<=o&&Math.abs(this.alpha-r.alpha)<=o},e.prototype.toString=function(){return`(${this.red}, ${this.green}, ${this.blue}, ${this.alpha})`},e.prototype.toCssColorString=function(){const r=e.floatToByte(this.red),o=e.floatToByte(this.green),f=e.floatToByte(this.blue);return this.alpha===1?`rgb(${r},${o},${f})`:`rgba(${r},${o},${f},${this.alpha})`},e.prototype.toCssHexString=function(){let r=e.floatToByte(this.red).toString(16);r.length<2&&(r=`0${r}`);let o=e.floatToByte(this.green).toString(16);o.length<2&&(o=`0${o}`);let f=e.floatToByte(this.blue).toString(16);if(f.length<2&&(f=`0${f}`),this.alpha<1){let C=e.floatToByte(this.alpha).toString(16);return C.length<2&&(C=`0${C}`),`#${r}${o}${f}${C}`}return`#${r}${o}${f}`},e.prototype.toBytes=function(r){const o=e.floatToByte(this.red),f=e.floatToByte(this.green),C=e.floatToByte(this.blue),s=e.floatToByte(this.alpha);return t.defined(r)?(r[0]=o,r[1]=f,r[2]=C,r[3]=s,r):[o,f,C,s]},e.prototype.toRgba=function(){return c[0]=e.floatToByte(this.red),c[1]=e.floatToByte(this.green),c[2]=e.floatToByte(this.blue),c[3]=e.floatToByte(this.alpha),A[0]},e.prototype.brighten=function(r,o){return n.Check.typeOf.number("magnitude",r),n.Check.typeOf.number.greaterThanOrEquals("magnitude",r,0),n.Check.typeOf.object("result",o),r=1-r,o.red=1-(1-this.red)*r,o.green=1-(1-this.green)*r,o.blue=1-(1-this.blue)*r,o.alpha=this.alpha,o},e.prototype.darken=function(r,o){return n.Check.typeOf.number("magnitude",r),n.Check.typeOf.number.greaterThanOrEquals("magnitude",r,0),n.Check.typeOf.object("result",o),r=1-r,o.red=this.red*r,o.green=this.green*r,o.blue=this.blue*r,o.alpha=this.alpha,o},e.prototype.withAlpha=function(r,o){return e.fromAlpha(this,r,o)},e.add=function(r,o,f){return n.Check.typeOf.object("left",r),n.Check.typeOf.object("right",o),n.Check.typeOf.object("result",f),f.red=r.red+o.red,f.green=r.green+o.green,f.blue=r.blue+o.blue,f.alpha=r.alpha+o.alpha,f},e.subtract=function(r,o,f){return n.Check.typeOf.object("left",r),n.Check.typeOf.object("right",o),n.Check.typeOf.object("result",f),f.red=r.red-o.red,f.green=r.green-o.green,f.blue=r.blue-o.blue,f.alpha=r.alpha-o.alpha,f},e.multiply=function(r,o,f){return n.Check.typeOf.object("left",r),n.Check.typeOf.object("right",o),n.Check.typeOf.object("result",f),f.red=r.red*o.red,f.green=r.green*o.green,f.blue=r.blue*o.blue,f.alpha=r.alpha*o.alpha,f},e.divide=function(r,o,f){return n.Check.typeOf.object("left",r),n.Check.typeOf.object("right",o),n.Check.typeOf.object("result",f),f.red=r.red/o.red,f.green=r.green/o.green,f.blue=r.blue/o.blue,f.alpha=r.alpha/o.alpha,f},e.mod=function(r,o,f){return n.Check.typeOf.object("left",r),n.Check.typeOf.object("right",o),n.Check.typeOf.object("result",f),f.red=r.red%o.red,f.green=r.green%o.green,f.blue=r.blue%o.blue,f.alpha=r.alpha%o.alpha,f},e.lerp=function(r,o,f,C){return n.Check.typeOf.object("start",r),n.Check.typeOf.object("end",o),n.Check.typeOf.number("t",f),n.Check.typeOf.object("result",C),C.red=i.CesiumMath.lerp(r.red,o.red,f),C.green=i.CesiumMath.lerp(r.green,o.green,f),C.blue=i.CesiumMath.lerp(r.blue,o.blue,f),C.alpha=i.CesiumMath.lerp(r.alpha,o.alpha,f),C},e.multiplyByScalar=function(r,o,f){return n.Check.typeOf.object("color",r),n.Check.typeOf.number("scalar",o),n.Check.typeOf.object("result",f),f.red=r.red*o,f.green=r.green*o,f.blue=r.blue*o,f.alpha=r.alpha*o,f},e.divideByScalar=function(r,o,f){return n.Check.typeOf.object("color",r),n.Check.typeOf.number("scalar",o),n.Check.typeOf.object("result",f),f.red=r.red/o,f.green=r.green/o,f.blue=r.blue/o,f.alpha=r.alpha/o,f},e.ALICEBLUE=Object.freeze(e.fromCssColorString("#F0F8FF")),e.ANTIQUEWHITE=Object.freeze(e.fromCssColorString("#FAEBD7")),e.AQUA=Object.freeze(e.fromCssColorString("#00FFFF")),e.AQUAMARINE=Object.freeze(e.fromCssColorString("#7FFFD4")),e.AZURE=Object.freeze(e.fromCssColorString("#F0FFFF")),e.BEIGE=Object.freeze(e.fromCssColorString("#F5F5DC")),e.BISQUE=Object.freeze(e.fromCssColorString("#FFE4C4")),e.BLACK=Object.freeze(e.fromCssColorString("#000000")),e.BLANCHEDALMOND=Object.freeze(e.fromCssColorString("#FFEBCD")),e.BLUE=Object.freeze(e.fromCssColorString("#0000FF")),e.BLUEVIOLET=Object.freeze(e.fromCssColorString("#8A2BE2")),e.BROWN=Object.freeze(e.fromCssColorString("#A52A2A")),e.BURLYWOOD=Object.freeze(e.fromCssColorString("#DEB887")),e.CADETBLUE=Object.freeze(e.fromCssColorString("#5F9EA0")),e.CHARTREUSE=Object.freeze(e.fromCssColorString("#7FFF00")),e.CHOCOLATE=Object.freeze(e.fromCssColorString("#D2691E")),e.CORAL=Object.freeze(e.fromCssColorString("#FF7F50")),e.CORNFLOWERBLUE=Object.freeze(e.fromCssColorString("#6495ED")),e.CORNSILK=Object.freeze(e.fromCssColorString("#FFF8DC")),e.CRIMSON=Object.freeze(e.fromCssColorString("#DC143C")),e.CYAN=Object.freeze(e.fromCssColorString("#00FFFF")),e.DARKBLUE=Object.freeze(e.fromCssColorString("#00008B")),e.DARKCYAN=Object.freeze(e.fromCssColorString("#008B8B")),e.DARKGOLDENROD=Object.freeze(e.fromCssColorString("#B8860B")),e.DARKGRAY=Object.freeze(e.fromCssColorString("#A9A9A9")),e.DARKGREEN=Object.freeze(e.fromCssColorString("#006400")),e.DARKGREY=e.DARKGRAY,e.DARKKHAKI=Object.freeze(e.fromCssColorString("#BDB76B")),e.DARKMAGENTA=Object.freeze(e.fromCssColorString("#8B008B")),e.DARKOLIVEGREEN=Object.freeze(e.fromCssColorString("#556B2F")),e.DARKORANGE=Object.freeze(e.fromCssColorString("#FF8C00")),e.DARKORCHID=Object.freeze(e.fromCssColorString("#9932CC")),e.DARKRED=Object.freeze(e.fromCssColorString("#8B0000")),e.DARKSALMON=Object.freeze(e.fromCssColorString("#E9967A")),e.DARKSEAGREEN=Object.freeze(e.fromCssColorString("#8FBC8F")),e.DARKSLATEBLUE=Object.freeze(e.fromCssColorString("#483D8B")),e.DARKSLATEGRAY=Object.freeze(e.fromCssColorString("#2F4F4F")),e.DARKSLATEGREY=e.DARKSLATEGRAY,e.DARKTURQUOISE=Object.freeze(e.fromCssColorString("#00CED1")),e.DARKVIOLET=Object.freeze(e.fromCssColorString("#9400D3")),e.DEEPPINK=Object.freeze(e.fromCssColorString("#FF1493")),e.DEEPSKYBLUE=Object.freeze(e.fromCssColorString("#00BFFF")),e.DIMGRAY=Object.freeze(e.fromCssColorString("#696969")),e.DIMGREY=e.DIMGRAY,e.DODGERBLUE=Object.freeze(e.fromCssColorString("#1E90FF")),e.FIREBRICK=Object.freeze(e.fromCssColorString("#B22222")),e.FLORALWHITE=Object.freeze(e.fromCssColorString("#FFFAF0")),e.FORESTGREEN=Object.freeze(e.fromCssColorString("#228B22")),e.FUCHSIA=Object.freeze(e.fromCssColorString("#FF00FF")),e.GAINSBORO=Object.freeze(e.fromCssColorString("#DCDCDC")),e.GHOSTWHITE=Object.freeze(e.fromCssColorString("#F8F8FF")),e.GOLD=Object.freeze(e.fromCssColorString("#FFD700")),e.GOLDENROD=Object.freeze(e.fromCssColorString("#DAA520")),e.GRAY=Object.freeze(e.fromCssColorString("#808080")),e.GREEN=Object.freeze(e.fromCssColorString("#008000")),e.GREENYELLOW=Object.freeze(e.fromCssColorString("#ADFF2F")),e.GREY=e.GRAY,e.HONEYDEW=Object.freeze(e.fromCssColorString("#F0FFF0")),e.HOTPINK=Object.freeze(e.fromCssColorString("#FF69B4")),e.INDIANRED=Object.freeze(e.fromCssColorString("#CD5C5C")),e.INDIGO=Object.freeze(e.fromCssColorString("#4B0082")),e.IVORY=Object.freeze(e.fromCssColorString("#FFFFF0")),e.KHAKI=Object.freeze(e.fromCssColorString("#F0E68C")),e.LAVENDER=Object.freeze(e.fromCssColorString("#E6E6FA")),e.LAVENDAR_BLUSH=Object.freeze(e.fromCssColorString("#FFF0F5")),e.LAWNGREEN=Object.freeze(e.fromCssColorString("#7CFC00")),e.LEMONCHIFFON=Object.freeze(e.fromCssColorString("#FFFACD")),e.LIGHTBLUE=Object.freeze(e.fromCssColorString("#ADD8E6")),e.LIGHTCORAL=Object.freeze(e.fromCssColorString("#F08080")),e.LIGHTCYAN=Object.freeze(e.fromCssColorString("#E0FFFF")),e.LIGHTGOLDENRODYELLOW=Object.freeze(e.fromCssColorString("#FAFAD2")),e.LIGHTGRAY=Object.freeze(e.fromCssColorString("#D3D3D3")),e.LIGHTGREEN=Object.freeze(e.fromCssColorString("#90EE90")),e.LIGHTGREY=e.LIGHTGRAY,e.LIGHTPINK=Object.freeze(e.fromCssColorString("#FFB6C1")),e.LIGHTSEAGREEN=Object.freeze(e.fromCssColorString("#20B2AA")),e.LIGHTSKYBLUE=Object.freeze(e.fromCssColorString("#87CEFA")),e.LIGHTSLATEGRAY=Object.freeze(e.fromCssColorString("#778899")),e.LIGHTSLATEGREY=e.LIGHTSLATEGRAY,e.LIGHTSTEELBLUE=Object.freeze(e.fromCssColorString("#B0C4DE")),e.LIGHTYELLOW=Object.freeze(e.fromCssColorString("#FFFFE0")),e.LIME=Object.freeze(e.fromCssColorString("#00FF00")),e.LIMEGREEN=Object.freeze(e.fromCssColorString("#32CD32")),e.LINEN=Object.freeze(e.fromCssColorString("#FAF0E6")),e.MAGENTA=Object.freeze(e.fromCssColorString("#FF00FF")),e.MAROON=Object.freeze(e.fromCssColorString("#800000")),e.MEDIUMAQUAMARINE=Object.freeze(e.fromCssColorString("#66CDAA")),e.MEDIUMBLUE=Object.freeze(e.fromCssColorString("#0000CD")),e.MEDIUMORCHID=Object.freeze(e.fromCssColorString("#BA55D3")),e.MEDIUMPURPLE=Object.freeze(e.fromCssColorString("#9370DB")),e.MEDIUMSEAGREEN=Object.freeze(e.fromCssColorString("#3CB371")),e.MEDIUMSLATEBLUE=Object.freeze(e.fromCssColorString("#7B68EE")),e.MEDIUMSPRINGGREEN=Object.freeze(e.fromCssColorString("#00FA9A")),e.MEDIUMTURQUOISE=Object.freeze(e.fromCssColorString("#48D1CC")),e.MEDIUMVIOLETRED=Object.freeze(e.fromCssColorString("#C71585")),e.MIDNIGHTBLUE=Object.freeze(e.fromCssColorString("#191970")),e.MINTCREAM=Object.freeze(e.fromCssColorString("#F5FFFA")),e.MISTYROSE=Object.freeze(e.fromCssColorString("#FFE4E1")),e.MOCCASIN=Object.freeze(e.fromCssColorString("#FFE4B5")),e.NAVAJOWHITE=Object.freeze(e.fromCssColorString("#FFDEAD")),e.NAVY=Object.freeze(e.fromCssColorString("#000080")),e.OLDLACE=Object.freeze(e.fromCssColorString("#FDF5E6")),e.OLIVE=Object.freeze(e.fromCssColorString("#808000")),e.OLIVEDRAB=Object.freeze(e.fromCssColorString("#6B8E23")),e.ORANGE=Object.freeze(e.fromCssColorString("#FFA500")),e.ORANGERED=Object.freeze(e.fromCssColorString("#FF4500")),e.ORCHID=Object.freeze(e.fromCssColorString("#DA70D6")),e.PALEGOLDENROD=Object.freeze(e.fromCssColorString("#EEE8AA")),e.PALEGREEN=Object.freeze(e.fromCssColorString("#98FB98")),e.PALETURQUOISE=Object.freeze(e.fromCssColorString("#AFEEEE")),e.PALEVIOLETRED=Object.freeze(e.fromCssColorString("#DB7093")),e.PAPAYAWHIP=Object.freeze(e.fromCssColorString("#FFEFD5")),e.PEACHPUFF=Object.freeze(e.fromCssColorString("#FFDAB9")),e.PERU=Object.freeze(e.fromCssColorString("#CD853F")),e.PINK=Object.freeze(e.fromCssColorString("#FFC0CB")),e.PLUM=Object.freeze(e.fromCssColorString("#DDA0DD")),e.POWDERBLUE=Object.freeze(e.fromCssColorString("#B0E0E6")),e.PURPLE=Object.freeze(e.fromCssColorString("#800080")),e.RED=Object.freeze(e.fromCssColorString("#FF0000")),e.ROSYBROWN=Object.freeze(e.fromCssColorString("#BC8F8F")),e.ROYALBLUE=Object.freeze(e.fromCssColorString("#4169E1")),e.SADDLEBROWN=Object.freeze(e.fromCssColorString("#8B4513")),e.SALMON=Object.freeze(e.fromCssColorString("#FA8072")),e.SANDYBROWN=Object.freeze(e.fromCssColorString("#F4A460")),e.SEAGREEN=Object.freeze(e.fromCssColorString("#2E8B57")),e.SEASHELL=Object.freeze(e.fromCssColorString("#FFF5EE")),e.SIENNA=Object.freeze(e.fromCssColorString("#A0522D")),e.SILVER=Object.freeze(e.fromCssColorString("#C0C0C0")),e.SKYBLUE=Object.freeze(e.fromCssColorString("#87CEEB")),e.SLATEBLUE=Object.freeze(e.fromCssColorString("#6A5ACD")),e.SLATEGRAY=Object.freeze(e.fromCssColorString("#708090")),e.SLATEGREY=e.SLATEGRAY,e.SNOW=Object.freeze(e.fromCssColorString("#FFFAFA")),e.SPRINGGREEN=Object.freeze(e.fromCssColorString("#00FF7F")),e.STEELBLUE=Object.freeze(e.fromCssColorString("#4682B4")),e.TAN=Object.freeze(e.fromCssColorString("#D2B48C")),e.TEAL=Object.freeze(e.fromCssColorString("#008080")),e.THISTLE=Object.freeze(e.fromCssColorString("#D8BFD8")),e.TOMATO=Object.freeze(e.fromCssColorString("#FF6347")),e.TURQUOISE=Object.freeze(e.fromCssColorString("#40E0D0")),e.VIOLET=Object.freeze(e.fromCssColorString("#EE82EE")),e.WHEAT=Object.freeze(e.fromCssColorString("#F5DEB3")),e.WHITE=Object.freeze(e.fromCssColorString("#FFFFFF")),e.WHITESMOKE=Object.freeze(e.fromCssColorString("#F5F5F5")),e.YELLOW=Object.freeze(e.fromCssColorString("#FFFF00")),e.YELLOWGREEN=Object.freeze(e.fromCssColorString("#9ACD32")),e.TRANSPARENT=Object.freeze(new e(0,0,0,0)),j.Color=e});
