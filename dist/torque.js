// =================
// profiler
// =================
//
// Counters
//   pendingJobs.inc();
//   pendingJobs.dec();
//
// Meters
//  A meter measures the rate of events over time
//  requests.mark();
//
// Histograms
//  responseSizes.update(response.getContent().length);
//
// Timers
//  private final Timer responses = metrics.timer(name(RequestHandler.class, "responses"));
// 
//  final Timer.Context context = responses.time();
//try {
//return "OK";
//} finally {
//context.stop();
//}
// Health Checks
//
function Profiler(){}Profiler.times={},Profiler.new_time=function(e,t){var n=Profiler.times[e]=Profiler.times[e]||{max:0,min:1e7,avg:0,total:0,count:0};n.max=Math.max(n.max,t),n.total+=t,n.min=Math.min(n.min,t),++n.count,n.avg=n.total/n.count},Profiler.print_stats=function(){for(k in Profiler.times){var e=Profiler.times[k];console.log(" === "+k+" === "),console.log(" max: "+e.max),console.log(" min: "+e.min),console.log(" avg: "+e.avg),console.log(" total: "+e.total)}},Profiler.get=function(e){return{t0:null,start:function(){this.t0=(new Date).getTime()},end:function(){this.t0!==null&&(Profiler.new_time(e,this.time=(new Date).getTime()-this.t0),this.t0=null)}}},function(e){function n(e){for(var t=1;t<arguments.length;++t){var n=arguments[t];for(var r in n)e=e.replace(RegExp("\\{"+r+"\\}","g"),n[r])}return e}e.torque=e.torque||{};var t=e.torque.providers=e.torque.providers||{},r=function(e){this._ready=!1,this._tileQueue=[],this.options=e;if(e.resolution===undefined)throw new Error("resolution should be provided");if(e.steps===undefined)throw new Error("steps should be provided");e.start===undefined?this.getKeySpan():this._ready=!0};r.prototype={proccessTile:function(e,t,n){var r=new Uint8Array(e.length),i=new Uint8Array(e.length),s=0,o=0;for(var u=0;u<e.length;++u){var a=e[u];s+=a.dates__uint16.length,o=Math.max(o,a.dates__uint16.length)}var f=new Int32Array(o),l=new Int32Array(o),c=new Uint8Array(s),h=new Uint32Array(s),p=[];for(var u=0;u<e.length;++u){var a=e[u];r[u]=a.x__uint8,i[u]=a.y__uint8;var s=e[u].dates__uint16,d=e[u].vals__uint8;for(var v=0,m=s.length;v<m;++v){var g=p[s[v]]||(p[s[v]]=[]);g.push([u,d[v]])}}var y=0,b=0;for(var w=0;w<o;++w){var E=0,S=p[w];if(S)for(var u=0;u<S.length;++u){var g=S[u];++E,h[y]=g[0],c[y]=g[1],++y}f[w]=b,l[w]=E,b+=E}return{x:r,y:i,coord:{x:t.x,y:t.y,z:n},timeCount:l,timeIndex:f,renderDataPos:h,renderData:c}},url:function(){return this.options.url||"http://"+this.options.user+".cartodb.com/api/v2/sql"},sql:function(e,t,n){n=n||{},torque.net.get(this.url()+"?q="+encodeURIComponent(e),function(e){n.parseJSON&&(e=JSON.parse(e.responseText)),t(e)})},getTileData:function(e,t,n){this._ready?this._getTileData(e,t,n):this._tileQueue.push([e,t,n])},_setReady:function(e){this._ready=!0,this._processQueue()},_processQueue:function(){var e;while(e=this._tileQueue.pop())this._getTileData.apply(this,e)},_getTileData:function(e,t,r){this.table=this.options.table;var i=1<<t,s=this.options.column;this.options.is_time&&(s=n("date_part('epoch', {column})",this.options));var o="WITH par AS (  SELECT CDB_XYZ_Resolution({zoom})*{resolution} as res, CDB_XYZ_Extent({x}, {y}, {zoom}) as ext ),cte AS (   SELECT ST_SnapToGrid(i.the_geom_webmercator, p.res) g, {countby} c, floor(({column_conv} - {start})/{step}) d  FROM {table} i, par p   WHERE i.the_geom_webmercator && p.ext   GROUP BY g, d) SELECT least((st_x(g)-st_xmin(p.ext))/p.res, 255) x__uint8,        least((st_y(g)-st_ymin(p.ext))/p.res, 255) y__uint8, array_agg(c) vals__uint8, array_agg(d) dates__uint16 FROM cte, par p GROUP BY x__uint8, y__uint8",u=n(o,this.options,{zoom:t,x:e.x,y:e.y,column_conv:s}),a=this;this.sql(u,function(n){var i=JSON.parse(n.responseText).rows;r(a.proccessTile(i,e,t))})},getKeySpan:function(){var e,t,r,i;this.options.is_time?(r="date_part('epoch', max({column}))",i="date_part('epoch', min({column}))"):(r="max({0})",i="min({0})"),e=n(r,{column:this.options.column}),t=n(i,{column:this.options.column});var s=n("SELECT st_xmax(st_envelope(st_collect(the_geom))) xmax,st_ymax(st_envelope(st_collect(the_geom))) ymax, st_xmin(st_envelope(st_collect(the_geom))) xmin, st_ymin(st_envelope(st_collect(the_geom))) ymin, {max_col} max, {min_col} min FROM {table}",{max_col:e,min_col:t,table:this.options.table}),o=this;this.sql(s,function(e){e=e.rows[0],o.options.start=e.min,o.options.step=(e.max-e.min)/o.options.steps,o._setReady(!0)},{parseJSON:!0})}},torque.providers.json=r}(typeof exports=="undefined"?this:exports),function(e){function n(e,t){for(var n=1;n<arguments.length;++n){var t=arguments[n];for(var r in t)e=e.replace(RegExp("\\{"+r+"\\}","g"),t[r])}return e}e.torque=e.torque||{};var t=e.torque.providers=e.torque.providers||{},r=function(e){this.options=e};r.prototype={proccessTile:function(e,t,n){function u(e){var t=3,n={x:e.data[0]*o.options.resolution,y:e.data[1]*o.options.resolution,valuesCount:e.data[2],times:[],values:[]};for(var r=0;r<n.valuesCount;++r)n.times.push(e.data[t+r]),n.values.push(e.data[t+n.valuesCount+r]);if(o.options.cummulative)for(var r=1;r<n.valuesCount;++r)n.values[r]+=n.values[r-1];return n}var r,i=new Uint8Array(e.length),s=new Uint8Array(e.length),o=this;for(r=0;r<e.length;++r)e[r]=u(e[r]);var a=0,f=0;for(r=0;r<e.length;++r){var l=e[r];a+=l.times.length;for(var c=0;c<l.times.length;++c)f=Math.max(f,l.times[c])}var h=new Int32Array(f+1),p=new Int32Array(f+1),d=new Uint8Array(a),v=new Uint32Array(a),m={};for(var r=0;r<e.length;++r){var l=e[r];i[r]=l.x,s[r]=l.y;var a=l.times,g=l.values;for(var y=0,b=a.length;y<b;++y){var w=m[a[y]]||(m[a[y]]=[]);w.push([r,g[y]])}}var E=0,S=0,x=0;for(var x=0;x<=f;++x){var T=0,N=m[x];if(N)for(var r=0;r<N.length;++r){var w=N[r];++T,v[E]=w[0],d[E]=w[1],++E}h[x]=S,p[x]=T,S+=T}return{x:i,y:s,coord:{x:t.x,y:t.y,z:n},timeCount:p,timeIndex:h,renderDataPos:v,renderData:d}},url:function(){return this.options.url},getTileData:function(e,t,n){var r=this.url();r=r.replace("{x}",e.x).replace("{y}",e.y).replace("{z}",t);var i=this;torque.net.get(r,function(r){var s=null;try{var o=JSON.parse(r.responseText).rows;s=i.proccessTile(o,e,t)}catch(u){console.log(u.stack),console.error("problem parsing JSON on ",e,t)}s&&n(s)})}},torque.providers.JsonArray=r}(typeof exports=="undefined"?this:exports),function(e){function n(e,t){var n=new XMLHttpRequest;return n.onreadystatechange=function(){n.readyState==4&&(n.status==200?t(n):t(null))},n.open("GET",e,!0),n.send(null),n}var t=e.torque=e.torque||{};t.net=t.net||{},t.net={get:n}}(typeof exports=="undefined"?this:exports),function(e){function n(e,n){e.fillStyle=n.fillStyle,e.strokStyle=n.strokStyle;var r=n["point-radius"];e.beginPath(),e.arc(0,0,r,0,t,!0,!0),e.closePath(),n.fillStyle&&(n.fillOpacity&&(e.globalAlpha=n.fillOpacity),e.fill()),e.globalAlpha=1,n.strokeStyle&&(n.strokeOpacity&&(e.globalAlpha=n.strokeOpacity),n.lineWidth&&(e.lineWidth=n.lineWidth),e.strokeStyle=n.strokeStyle,e.stroke())}e.torque=e.torque||{};var t=Math.PI*2;e.torque.cartocss=e.torque.cartocss||{},e.torque.cartocss.renderPoint=n}(typeof exports=="undefined"?this:exports),function(e){function r(e,t){if(!e)throw new Error("canvas can't be undefined");this.options=t,this._canvas=e,this._ctx=e.getContext("2d"),this._sprites={},this.setCartoCSS(this.options.cartocss||n)}e.torque=e.torque||{},e.torque.renderer=e.torque.renderer||{};var t=Math.PI*2,n=["#layer {","  marker-fill: #662506;","  marker-width: 3;","  [value > 1] { marker-fill: #FEE391; }","  [value > 2] { marker-fill: #FEC44F; }","  [value > 3] { marker-fill: #FE9929; }","  [value > 4] { marker-fill: #EC7014; }","  [value > 5] { marker-fill: #CC4C02; }","  [value > 6] { marker-fill: #993404; }","  [value > 7] { marker-fill: #662506; }","}"].join("\n");r.prototype={setCanvas:function(e){this._canvas=e,this._ctx=e.getContext("2d")},setCartoCSS:function(e){this._sprites={},this._cartoCssStyle=(new carto.RendererJS).render(e);if(this._cartoCssStyle.getLayers().length>1)throw new Error("only one CartoCSS layer is supported");this._shader=this._cartoCssStyle.getLayers()[0]},generateSprite:function(e,t){var n=this._shader.getStyle("canvas-2d",{value:e},{zoom:t.zoom}),r=n["point-radius"];if(!r)throw new Error("marker-width property should be set");var i=r*2,s=document.createElement("canvas"),o=s.getContext("2d");return o.width=s.width=i,o.height=s.height=i,o.translate(r,r),torque.cartocss.renderPoint(o,n),s},renderTile:function(e,t){if(!this._canvas)return;var n=this._ctx,r=this.options.resolution,i=this._sprites,s=e.timeCount[t];this.options.blendmode&&(n.globalCompositeOperation=this.options.blendmode);if(s){var o=e.timeIndex[t];for(var u=0;u<s;++u){var a=e.renderDataPos[o+u],f=e.renderData[o+u];if(f){var l=i[f];l||(l=i[f]=this.generateSprite(f,e));var c=e.x[a]-(l.width>>1),h=e.y[a]-(l.height>>1);n.drawImage(l,c*r,255-h*r)}}}}},e.torque.renderer.Point=r}(typeof exports=="undefined"?this:exports),function(e){function t(e){var t=[];for(var n=e.length-1;n>=0;--n)t.push("if( x >= "+e[n]+") return "+(n+1)+";");t.push("return 0;");var r=t.join("\n");return new Function("x",r)}function s(e){var t=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);return t?[parseInt(t[1],16),parseInt(t[2],16),parseInt(t[3],16),255]:[0,0,0,0]}function o(e,t){this.options=t,this.setCanvas(e),this._colors=i}e.torque=e.torque||{},e.torque.renderer=e.torque.renderer||{};var n=t([10,100,1e3,1e4,1e5]);console.log(n(0),n(11));var r=Math.PI*2,i=["#FFFF00","#FFCC00","#FF9900","#FF6600","#FF3300","#CC0000"];o.prototype={setCanvas:function(e){if(!e)return;this._canvas=e,this._ctx=e.getContext("2d")},accumulate:function(e,t){var n,r,i,s,o,u,a,f,l=this.options.resolution,c=256/l,h=new Float32Array(c*c);typeof t!="object"&&(t=[t]);for(o=0;o<t.length;++o){u=t[o],a=e.timeCount[u];if(a){f=e.timeIndex[u];for(s=0;s<a;++s)i=e.renderDataPos[f+s],n=e.x[i]/l,r=e.y[i]/l,h[n*c+r]+=e.renderData[f+s]}}return h},renderTileAccum:function(e,t,r){var i=this.options.resolution,s=this._ctx,o=256/i|0,u=o*o,a=this._colors;for(var f=0;f<u;++f){var l=f,c=e[f];if(c){var h=l/o|0,p=l%o,d=a[n(c)];s.fillStyle=d,s.fillRect(h*i,256-i-p*i,i,i)}}},renderTile:function(e,t,n,r){if(!this._canvas)return;var i=this.options.resolution,s=this._ctx,o=this._colors,u=e.timeCount[t];if(u){var a=this._canvas.width,f=this._canvas.height,l=e.timeIndex[t];for(var c=0;c<activePixels;++c){var h=e.renderDataPos[l+c],p=e.renderData[l+c];if(p){var d=o[Math.min(p,o.length-1)],v=e.x[h],m=e.y[h];s.fillStyle=d,s.fillRect(v,m,i,i)}}}}},e.torque.renderer.Rectangle=o}(typeof exports=="undefined"?this:exports);if(typeof google!="undefined"&&typeof google.maps!="undefined"){function CanvasLayer(e){function n(e,t){return function(){t.apply(e)}}this.isAdded_=!1,this.isAnimated_=!1,this.paneName_=CanvasLayer.DEFAULT_PANE_NAME_,this.updateHandler_=null,this.resizeHandler_=null,this.topLeft_=null,this.centerListener_=null,this.resizeListener_=null,this.needsResize_=!0,this.requestAnimationFrameId_=null;var t=document.createElement("canvas");t.style.position="absolute",t.style.top=0,t.style.left=0,t.style.pointerEvents="none",this.canvas=t,this.repositionFunction_=n(this,this.repositionCanvas_),this.resizeFunction_=n(this,this.resize_),this.requestUpdateFunction_=n(this,this.update_),e&&this.setOptions(e)}CanvasLayer.prototype=new google.maps.OverlayView,CanvasLayer.DEFAULT_PANE_NAME_="overlayLayer",CanvasLayer.CSS_TRANSFORM_=function(){var e=document.createElement("div"),t=["transform","WebkitTransform","MozTransform","OTransform","msTransform"];for(var n=0;n<t.length;n++){var r=t[n];if(e.style[r]!==undefined)return r}return t[0]}(),CanvasLayer.prototype.requestAnimFrame_=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(e){return window.setTimeout(e,1e3/60)},CanvasLayer.prototype.cancelAnimFrame_=window.cancelAnimationFrame||window.webkitCancelAnimationFrame||window.mozCancelAnimationFrame||window.oCancelAnimationFrame||window.msCancelAnimationFrame||function(e){},CanvasLayer.prototype.setOptions=function(e){e.animate!==undefined&&this.setAnimate(e.animate),e.paneName!==undefined&&this.setPane(e.paneName),e.updateHandler!==undefined&&this.setUpdateHandler(e.updateHandler),e.resizeHandler!==undefined&&this.setResizeHandler(e.resizeHandler),e.map!==undefined&&this.setMap(e.map)},CanvasLayer.prototype.setAnimate=function(e){this.isAnimated_=!!e,this.isAnimated_&&this.scheduleUpdate()},CanvasLayer.prototype.isAnimated=function(){return this.isAnimated_},CanvasLayer.prototype.setPaneName=function(e){this.paneName_=e,this.setPane_()},CanvasLayer.prototype.getPaneName=function(){return this.paneName_},CanvasLayer.prototype.setPane_=function(){if(!this.isAdded_)return;var e=this.getPanes();if(!e[this.paneName_])throw new Error('"'+this.paneName_+'" is not a valid MapPane name.');e[this.paneName_].appendChild(this.canvas)},CanvasLayer.prototype.setResizeHandler=function(e){this.resizeHandler_=e},CanvasLayer.prototype.setUpdateHandler=function(e){this.updateHandler_=e},CanvasLayer.prototype.onAdd=function(){if(this.isAdded_)return;this.isAdded_=!0,this.setPane_(),this.resizeListener_=google.maps.event.addListener(this.getMap(),"resize",this.resizeFunction_),this.centerListener_=google.maps.event.addListener(this.getMap(),"center_changed",this.repositionFunction_),this.resize_(),this.repositionCanvas_()},CanvasLayer.prototype.onRemove=function(){if(!this.isAdded_)return;this.isAdded_=!1,this.topLeft_=null,this.canvas.parentElement.removeChild(this.canvas),this.centerListener_&&(google.maps.event.removeListener(this.centerListener_),this.centerListener_=null),this.resizeListener_&&(google.maps.event.removeListener(this.resizeListener_),this.resizeListener_=null),this.requestAnimationFrameId_&&(this.cancelAnimFrame_.call(window,this.requestAnimationFrameId_),this.requestAnimationFrameId_=null)},CanvasLayer.prototype.resize_=function(){if(!this.isAdded_)return;var e=this.getMap(),t=e.getDiv().offsetWidth,n=e.getDiv().offsetHeight,r=this.canvas.width,i=this.canvas.height;if(r!==t||i!==n)this.canvas.width=t,this.canvas.height=n,this.canvas.style.width=t+"px",this.canvas.style.height=n+"px",this.needsResize_=!0,this.scheduleUpdate()},CanvasLayer.prototype.draw=function(){this.repositionCanvas_()},CanvasLayer.prototype.repositionCanvas_=function(){var e=this.getMap().getBounds();this.topLeft_=new google.maps.LatLng(e.getNorthEast().lat(),e.getSouthWest().lng());var t=this.getProjection(),n=t.fromLatLngToDivPixel(this.topLeft_);this.canvas.style[CanvasLayer.CSS_TRANSFORM_]="translate("+Math.round(n.x)+"px,"+Math.round(n.y)+"px)",this.scheduleUpdate()},CanvasLayer.prototype.update_=function(){this.requestAnimationFrameId_=null;if(!this.isAdded_)return;this.isAnimated_&&this.scheduleUpdate(),this.needsResize_&&this.resizeHandler_&&(this.needsResize_=!1,this.resizeHandler_()),this.updateHandler_&&this.updateHandler_()},CanvasLayer.prototype.getTopLeft=function(){return this.topLeft_},CanvasLayer.prototype.scheduleUpdate=function(){this.isAdded_&&!this.requestAnimationFrameId_&&(this.requestAnimationFrameId_=this.requestAnimFrame_.call(window,this.requestUpdateFunction_))}}L.CanvasLayer=L.Class.extend({includes:[L.Mixin.Events,L.Mixin.TileLoader],options:{minZoom:0,maxZoom:28,tileSize:256,subdomains:"abc",errorTileUrl:"",attribution:"",zoomOffset:0,opacity:1,unloadInvisibleTiles:L.Browser.mobile,updateWhenIdle:L.Browser.mobile,tileLoader:!1},initialize:function(e){var t=this;this.render=this.render.bind(this),L.Util.setOptions(this,e),this._canvas=document.createElement("canvas"),this._ctx=this._canvas.getContext("2d");var n=window.requestAnimationFrame||window.mozRequestAnimationFrame||window.webkitRequestAnimationFrame||window.msRequestAnimationFrame;this.requestAnimationFrame=n},onAdd:function(e){this._map=e,this._staticPane=e._createPane("leaflet-tile-pane",e._container),this._staticPane.appendChild(this._canvas),e.on({viewreset:this._reset},this),e.on("move",this._render,this),this.options.tileLoader&&this._initTileLoader(),this._reset()},getCanvas:function(){return this._canvas},draw:function(){return this._reset()},onRemove:function(e){e._container.removeChild(this._staticPane),e.off({viewreset:this._reset,move:this._render},this)},addTo:function(e){return e.addLayer(this),this},setOpacity:function(e){return this.options.opacity=e,this._updateOpacity(),this},bringToFront:function(){return this},bringToBack:function(){return this},_reset:function(){var e=this._map.getSize();this._canvas.width=e.x,this._canvas.height=e.y,this.onResize(),this._render()},_updateOpacity:function(){},_render:function(){this.requestAnimationFrame.call(window,this.render)},redraw:function(){this._render()},onResize:function(){},render:function(){throw new Error("render function should be implemented")}}),L.Mixin.TileLoader={_initTileLoader:function(){this._tiles={},this._tilesToLoad=0,this._map.on({moveend:this._updateTiles},this),this._updateTiles()},_removeTileLoader:function(){map.off({moveend:this._updateTiles},this)},_updateTiles:function(){if(!this._map)return;var e=this._map.getPixelBounds(),t=this._map.getZoom(),n=this.options.tileSize;if(t>this.options.maxZoom||t<this.options.minZoom)return;var r=new L.Point(Math.floor(e.min.x/n),Math.floor(e.min.y/n)),i=new L.Point(Math.floor(e.max.x/n),Math.floor(e.max.y/n)),s=new L.Bounds(r,i);this._addTilesFromCenterOut(s),this._removeOtherTiles(s)},_removeOtherTiles:function(e){var t,n,r,i;for(i in this._tiles)this._tiles.hasOwnProperty(i)&&(t=i.split(":"),n=parseInt(t[0],10),r=parseInt(t[1],10),(n<e.min.x||n>e.max.x||r<e.min.y||r>e.max.y)&&this._removeTile(i))},_removeTile:function(e){this.fire("tileRemoved",this._tiles[e]),delete this._tiles[e]},_tileShouldBeLoaded:function(e){return!(e.x+":"+e.y+":"+e.zoom in this._tiles)},_tileLoaded:function(e,t){this._tilesToLoad--,this._tiles[e.x+":"+e.y+":"+e.zoom]=t,this._tilesToLoad===0&&this.fire("tilesLoaded")},getTilePos:function(e){e=new L.Point(e.x,e.y);var t=this._map._getNewTopLeftPoint(this._map.getCenter()),n=this.options.tileSize;return e.multiplyBy(n).subtract(t)},_addTilesFromCenterOut:function(e){var t=[],n=e.getCenter(),r=this._map.getZoom(),i,s,o;for(i=e.min.y;i<=e.max.y;i++)for(s=e.min.x;s<=e.max.x;s++)o=new L.Point(s,i),o.zoom=r,this._tileShouldBeLoaded(o)&&t.push(o);var u=t.length;if(u===0)return;t.sort(function(e,t){return e.distanceTo(n)-t.distanceTo(n)}),this._tilesToLoad+=u;for(s=0;s<u;s++)this.fire("tileAdded",t[s])}},L.TorqueLayer=L.CanvasLayer.extend({providers:{sql_api:torque.providers.json,url_template:torque.providers.jsonarray},renderers:{point:torque.renderer.Point,pixel:torque.renderer.Rectangle},initialize:function(e){var t=this;e.tileLoader=!0,this.key=0,L.CanvasLayer.prototype.initialize.call(this,e),this.options.renderer=this.options.renderer||"point",this.provider=new this.providers[this.options.provider](e),this.renderer=new this.renderers[this.options.renderer](this.getCanvas(),e),this.on("tileAdded",function(e){var n=this.provider.getTileData(e,e.zoom,function(n){t._tileLoaded(e,n),t.redraw()})},this)},render:function(){var e,t,n,r=this.getCanvas();r.width=r.width;var i=r.getContext("2d");if(typeof this.key=="number")for(e in this._tiles)t=this._tiles[e],n=this.getTilePos(t.coord),i.setTransform(1,0,0,1,n.x,n.y),this.renderer.renderTile(t,this.key,n.x,n.y);else for(e in this._tiles){t=this._tiles[e],n=this.getTilePos(t.coord);var s=this.renderer.accumulate(t,this.key);i.setTransform(1,0,0,1,n.x,n.y),this.renderer.renderTileAccum(s,0,0)}},setKey:function(e){this.key=e,this.redraw()}}),L.TiledTorqueLayer=L.TileLayer.Canvas.extend({providers:{sql_api:torque.providers.json,url_template:torque.providers.JsonArray},renderers:{point:torque.renderer.Point,pixel:torque.renderer.Rectangle},initialize:function(e){var t=this;this.key=0,e.async=!0,L.TileLayer.Canvas.prototype.initialize.call(this,e),this.options.renderer=this.options.renderer||"pixel",this.provider=new this.providers[this.options.provider](e),this.renderer=new this.renderers[this.options.renderer](null,e)},_tileLoaded:function(e,t,n){this._tiles[t.x+":"+t.y].data=n,this.drawTile(e)},_loadTile:function(e,t){var n=this;L.TileLayer.Canvas.prototype._loadTile.apply(this,arguments),this.provider.getTileData(t,this._map.getZoom(),function(r){n._tileLoaded(e,t,r),L.DomUtil.addClass(e,"leaflet-tile-loaded")})},drawTile:function(e){var t=e;if(!e.data)return;t.width=t.width,this.renderer.setCanvas(t);var n=this.renderer.accumulate(e.data,this.key);this.renderer.renderTileAccum(n,0,0)},setKey:function(e){this.key=e,this.redraw()}});