(()=>{"use strict";(()=>{function e(e,t){document.querySelector("#viewing").hidden=!1;let i=e.youtubeUrl.split("=")[1];e.player.setVideoId(i);let s=e.player.getPlayer();return s.classList.add("overlay"),s}const t=new RegExp("^(https://[a-zA-Z]+.youtube.com)");function i(e){return e&&t.test(e)}function s(e,t){let s=document.querySelector("#picking").content.cloneNode(!0),a=s.querySelector("input"),o=s.querySelector("#open-video");return a.oninput=e=>{const t=a.value;a.classList.remove("invalid"),a.classList.remove("valid"),o.classList.remove("valid"),i(t)?(o.removeAttribute("disabled"),a.style.color="black",o.classList.add("valid"),a.classList.add("valid")):(o.setAttribute("disabled","disabled"),a.classList.add("invalid"),a.style.color="red")},o.onclick=e=>{let i=a.value;t({type:"youtube-url-changed",payload:i})},s.querySelector("#close").onclick=e=>{t({type:"close-integration"})},s}function a(e,t){let i=document.querySelector("#waiting").content.firstElementChild.cloneNode(!0);return i.querySelector("label").innerHTML=`${e.initializer.clientName} is picking a video to share`,i}class o{constructor(e){this.kosyClient=window.parent,this.kosyApp=e}startApp(){return new Promise(((e,t)=>{window.addEventListener("message",(t=>{let i=t.data;switch(i.type){case"receive-initial-info":e(i.payload);break;case"client-has-joined":this.kosyApp.onClientHasJoined(i.payload);break;case"client-has-left":this.kosyApp.onClientHasLeft(i.clientUuid);break;case"get-app-state":const t=this.kosyApp.onRequestState();this._sendMessageToKosy({type:"receive-app-state",payload:t,clientUuids:i.clientUuids});break;case"set-app-state":this.kosyApp.onProvideState(i.state);break;case"receive-message":this.kosyApp.onReceiveMessage(i.payload)}})),this._sendMessageToKosy({type:"ready-and-listening"})}))}stopApp(){this._sendMessageToKosy({type:"stop-app"})}relayMessage(e){this._sendMessageToKosy({type:"relay-message",payload:e})}_sendMessageToKosy(e){this.kosyClient.postMessage(e,"*")}}class n{constructor(e,t,i,s){this.dispatch=s,this.isHost=i;const a=document.createElement("script");a.src="https://www.youtube.com/iframe_api";const o=document.getElementsByTagName("script")[0];o.parentNode.insertBefore(a,o),a.onload=()=>this.setupPlayer(e,t,i)}setVideoId(e){this.videoId=e}getPlayer(){let e=this.player.getIframe();return this.isHost||e.classList.add("remove-click"),e}setupPlayer(e,t,i){this.player=new YT.Player("viewing",{height:`${window.innerHeight}px`,width:`${window.innerWidth}px`,videoId:t,events:{onReady:()=>this.onPlayerReady(i)},playerVars:{enablejsapi:1,controls:i?1:0,disablekb:i?0:1,origin:e,fs:1,rel:0,modestbranding:1,showinfo:0,autohide:i?0:1}})}loadVideo(){null!=this.videoId&&""!=this.videoId&&(this.player.loadVideoById(this.videoId,0,"large"),this.player.setSize(window.innerWidth,window.innerHeight))}handleStateChange(e,t){let i=this.player.getPlayerState();if(console.log(`current state: ${i} - new state: ${e}`),i!=e)switch(null!=t&&this.player.seekTo(t,!0),e){case YT.PlayerState.BUFFERING:case YT.PlayerState.PLAYING:console.log(`Play video at ${t}`),this.player.playVideo();break;case YT.PlayerState.PAUSED:console.log(`Pause video at ${t}`),this.player.pauseVideo();break;case YT.PlayerState.ENDED:console.log("Video ended")}}onPlayerReady(e){console.log("Video player is ready!"),null!=this.videoId&&(this.loadVideo(),this.player.playVideo(),e&&(this.interval=window.setInterval((()=>{this.getCurrentStateAndTime()}),500)))}getCurrentStateAndTime(){let e=this.player.getPlayerState(),t=this.player.getCurrentTime();this.dispatch({type:"youtube-video-state-changed",payload:{state:e,time:t}}),e==YT.PlayerState.ENDED&&null!=this.interval&&clearInterval(this.interval)}}var l;!function(t){var l;(function(t){class l{constructor(){this.state={youtubeUrl:null,videoState:null},this.kosyApi=new o({onClientHasJoined:e=>this.onClientHasJoined(e),onClientHasLeft:e=>this.onClientHasLeft(e),onReceiveMessage:e=>this.processMessage(e),onRequestState:()=>this.getState(),onProvideState:e=>this.setState(e)})}start(){var e,t,i,s,a;return t=this,i=void 0,a=function*(){let t=yield this.kosyApi.startApp();this.initializer=t.clients[t.initializerClientUuid],this.currentClient=t.clients[t.currentClientUuid],this.state=null!==(e=t.currentAppState)&&void 0!==e?e:this.state,this.player=new n(window.origin,"",t.currentClientUuid==t.initializerClientUuid,(e=>this.processComponentMessage(e))),this.renderComponent(),window.addEventListener("message",(e=>{this.processComponentMessage(e.data)}))},new((s=void 0)||(s=Promise))((function(e,o){function n(e){try{r(a.next(e))}catch(e){o(e)}}function l(e){try{r(a.throw(e))}catch(e){o(e)}}function r(t){var i;t.done?e(t.value):(i=t.value,i instanceof s?i:new s((function(e){e(i)}))).then(n,l)}r((a=a.apply(t,i||[])).next())}))}setState(e){this.state=e,this.renderComponent()}getState(){return this.state}onClientHasJoined(e){}onClientHasLeft(e){e!==this.initializer.clientUuid||this.state.youtubeUrl||this.kosyApi.stopApp()}processMessage(e){switch(e.type){case"close-integration":this.kosyApi.stopApp();break;case"receive-youtube-url":i(e.payload)&&(this.state.youtubeUrl=`${e.payload}`,this.renderComponent());break;case"receive-youtube-video-state":this.state.videoState=e.payload.state,this.state.time=e.payload.time,this.state.videoState==YT.PlayerState.ENDED&&(console.log("Video ended, clearing youtube url"),this.state.youtubeUrl=null,this.state.videoState=null,this.kosyApi.stopApp()),this.renderComponent()}}processComponentMessage(e){switch(e.type){case"close-integration":this.kosyApi.relayMessage({type:"close-integration"});break;case"youtube-url-changed":this.kosyApi.relayMessage({type:"receive-youtube-url",payload:e.payload});break;case"youtube-video-state-changed":this.kosyApi.relayMessage({type:"receive-youtube-video-state",payload:e.payload})}}renderComponent(){!function(t,i){let o,n=document.getElementById("root"),l=n.firstChild;if((null==t?void 0:t.youtubeUrl)?(o=e,null!=t.videoState&&null!=l&&(l.hidden=!1,t.player.handleStateChange(t.videoState,t.time))):(document.querySelector("#viewing").hidden=!0,o=t.currentClient.clientUuid==t.initializer.clientUuid?s:a),null==t.videoState){var r=n.cloneNode(!1);n.parentNode.replaceChild(r,n),r.appendChild(o(t,i))}}({youtubeUrl:this.state.youtubeUrl,videoState:this.state.videoState,time:this.state.time,currentClient:this.currentClient,initializer:this.initializer,player:this.player},(e=>this.processComponentMessage(e)))}log(...e){var t,i;console.log(`${null!==(i=null===(t=this.currentClient)||void 0===t?void 0:t.clientName)&&void 0!==i?i:"New user"} logged: `,...e)}}t.App=l,(new l).start()})((l=t.Integration||(t.Integration={})).Youtube||(l.Youtube={}))}(l||(l={}))})()})();