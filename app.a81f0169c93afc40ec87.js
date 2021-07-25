(()=>{"use strict";(()=>{function e(e,t){let s=document.querySelector("#viewing"),i=e.youtubeUrl.split("=")[1];if(null!=e.player){let t=document.createElement("div");return e.player.setVideoId(i).then((()=>{return s=this,i=void 0,n=function*(){let s=yield e.player.getIframe();t.appendChild(s)},new((a=void 0)||(a=Promise))((function(e,t){function o(e){try{r(n.next(e))}catch(e){t(e)}}function l(e){try{r(n.throw(e))}catch(e){t(e)}}function r(t){var s;t.done?e(t.value):(s=t.value,s instanceof a?s:new a((function(e){e(s)}))).then(o,l)}r((n=n.apply(s,i||[])).next())}));var s,i,a,n})),t}return s.cloneNode(!1)}const t=new RegExp("^(https://[a-zA-Z]+.youtube.com)");function s(e){return e&&t.test(e)}function i(e,t){let i=document.querySelector("#picking").content.cloneNode(!0),a=i.querySelector("input"),n=i.querySelector("#open-video"),o=i.querySelector("#error");return a.oninput=e=>{const t=a.value;a.classList.remove("invalid"),a.classList.remove("valid"),n.classList.remove("valid"),s(t)?(n.removeAttribute("disabled"),o.innerHTML="",o.style.marginBottom="0",o.style.marginTop="0",a.style.color="black",n.classList.add("valid"),a.classList.add("valid")):(o.innerHTML="This is an invalid youtube video url",o.style.marginBottom="16px",o.style.marginTop="5px",n.setAttribute("disabled","disabled"),a.classList.add("invalid"),a.style.color="red")},n.onclick=e=>{let s=a.value;t({type:"youtube-url-changed",payload:s})},i}function a(e,t){let s=document.querySelector("#waiting").content.firstElementChild.cloneNode(!0);return s.querySelector("label").innerHTML=`${e.initializer.clientName} is picking a video to share`,s}class n{constructor(e){this.kosyClient=window.parent,this.latestMessageNumber=0,this.kosyApp=e}dictionaryToArray(e){let t=[];for(const s in e)e.hasOwnProperty(s)&&t.push([s,e[s]]);return t}startApp(){return this.initialInfoPromise=new Promise(((e,t)=>{window.addEventListener("message",(t=>{let s=t.data;switch(s.type){case"receive-initial-info":this.latestMessageNumber=s.latestMessageNumber,this.clients=s.payload.clients,this.hostClientUuid=s.payload.initializerClientUuid,this.log("Resolving initial info promise with: ",s.payload),e(s.payload);break;case"set-client-info":{let e=s.clients,t=s.hostClientUuid;this.initialInfoPromise.then((s=>{let i=this.dictionaryToArray(e).filter((e=>!this.clients[e[0]])),a=this.dictionaryToArray(this.clients).filter((t=>!e[t[0]])),n=this.latestMessageNumber;this.hostClientUuid!==t&&this._relayMessageToClients(s,{type:"_host-has-changed",clientUuid:t},++n),i.forEach((e=>this._relayMessageToClients(s,{type:"_client-has-joined",clientInfo:e[1]},++n))),a.forEach((e=>this._relayMessageToClients(s,{type:"_client-has-left",clientUuid:e[0]},++n))),this.clients=e,this.hostClientUuid=t}));break}case"get-app-state":{let e=s.clientUuids;this.log("Get app state received -> sending app state");const t=this.kosyApp.onRequestState();this._sendMessageToKosy({type:"receive-app-state",state:t,clientUuids:e,latestMessageNumber:this.latestMessageNumber});break}case"set-app-state":this.latestMessageNumber=s.latestMessageNumber;let t=s.state;this.initialInfoPromise.then((()=>{this.log("Received app state from Kosy -> setting app state"),this.kosyApp.onProvideState(t)}));break;case"receive-message-as-host":this._handleReceiveMessageAsHost(s);break;case"receive-message-as-client":this._handleReceiveMessageAsClient(s)}})),this._sendMessageToKosy({type:"ready-and-listening"})})),this.initialInfoPromise}stopApp(){this._sendMessageToKosy({type:"stop-app"})}relayMessage(e){this.log("Relaying client message to host: ",e),this._sendMessageToKosy({type:"relay-message-to-host",message:e})}_relayMessageToClients(e,t,s){this.log("Relaying host to client message: ",t),this._sendMessageToKosy({type:"relay-message-to-clients",sentByClientUuid:e.currentClientUuid,message:t,messageNumber:s})}_sendMessageToKosy(e){this.kosyClient.postMessage(e,"*")}_handleReceiveMessageAsClientRecursive(e,t,s){var i,a,n,o,l,r;if(this.latestMessageNumber===e.messageNumber-1){switch(e.message.type){case"_host-has-changed":{let t=e.message.clientUuid;this.hostClientUuid=t,null===(a=(i=this.kosyApp).onHostHasChanged)||void 0===a||a.call(i,t);break}case"_client-has-joined":{let t=e.message.clientInfo;this.clients[t.clientUuid]=t,null===(o=(n=this.kosyApp).onClientHasJoined)||void 0===o||o.call(n,t);break}case"_client-has-left":{let t=e.message.clientUuid;this.clients[t]=null,null===(r=(l=this.kosyApp).onClientHasLeft)||void 0===r||r.call(l,t);break}default:this.kosyApp.onReceiveMessageAsClient(e.message)}this.latestMessageNumber=e.messageNumber}else s<50&&this.latestMessageNumber<e.messageNumber?setTimeout((()=>this._handleReceiveMessageAsClientRecursive(e,t,s+1)),100):(this.log("Timeout on processing message as client: ",e.message),this.log("Wait for Kosy to fix this mess..."))}_handleReceiveMessageAsClient(e){this.initialInfoPromise.then((t=>{this.log("Received message as client, processing: ",e.message),this._handleReceiveMessageAsClientRecursive(e,t,0)}))}_handleReceiveMessageAsHost(e){this.initialInfoPromise.then((t=>{this.log("Trying to handle message as host");const s=this.kosyApp.onReceiveMessageAsHost(e.message);s&&this._relayMessageToClients(t,s,this.latestMessageNumber+1)}))}log(...e){"1"===localStorage.getItem("debug-mode")&&console.log("From kosy-app-api: ",...e)}}var o=function(e,t,s,i){return new(s||(s=Promise))((function(a,n){function o(e){try{r(i.next(e))}catch(e){n(e)}}function l(e){try{r(i.throw(e))}catch(e){n(e)}}function r(e){var t;e.done?a(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(o,l)}r((i=i.apply(e,t||[])).next())}))};class l{constructor(e,t,s,i){this.videoId=e,this.isHost=t,this.dispatch=s,this.appState=i,this.gettingCurrentStateAndTime=!1,this.previousSyncTime=new Date}setVideoId(e){return o(this,void 0,void 0,(function*(){return this.videoId=e,this.playerPromise=new Promise(((t,s)=>{let i=new YT.Player("viewing",{height:"1px",width:"1px",videoId:e,events:{onReady:()=>{t(i)}},playerVars:{enablejsapi:1,origin:window.location.host,fs:1,rel:0,modestbranding:1,showinfo:0,start:this.appState.time,controls:this.isHost?1:0}})})),this.playerPromise.then((e=>{this.loadVideo(e,this.appState.time),setTimeout((()=>{e.mute(),this.handleStateChange(this.appState.videoState,this.appState.time),this.isHost&&(this.interval=window.setInterval((()=>{this.gettingCurrentStateAndTime||(this.gettingCurrentStateAndTime=!0,this.getCurrentStateAndTime(e),this.gettingCurrentStateAndTime=!1)}),500))}),1e3)})),this.playerPromise}))}getIframe(){return o(this,void 0,void 0,(function*(){return(yield this.playerPromise).getIframe()}))}getCurrentState(){return o(this,void 0,void 0,(function*(){return(yield this.playerPromise).getPlayerState()}))}getCurrentTime(){return o(this,void 0,void 0,(function*(){return(yield this.playerPromise).getCurrentTime()}))}loadVideo(e,t){null!=this.videoId&&""!=this.videoId&&(e.loadVideoById(this.videoId,null!=t?t:0,"large"),e.setSize(window.innerWidth,window.innerHeight))}handleStateChange(e,t){return o(this,void 0,void 0,(function*(){if(this.playerPromise){let s=yield this.playerPromise;switch(s.seekTo(null!=t?t:0,!0),null!=e?e:YT.PlayerState.UNSTARTED){case YT.PlayerState.PLAYING:case YT.PlayerState.UNSTARTED:case YT.PlayerState.CUED:s.playVideo();break;case YT.PlayerState.PAUSED:s.pauseVideo();break;case YT.PlayerState.ENDED:console.log("Video ended")}}}))}getCurrentStateAndTime(e){return o(this,void 0,void 0,(function*(){let t=e.getPlayerState(),s=e.getCurrentTime(),i=this.appState.videoState,a=this.appState.time;this.appState.videoState=t,this.appState.time=s,(i!=t||Math.abs(s-a)>2||(new Date).valueOf()-this.previousSyncTime.valueOf()>1e4)&&(this.previousSyncTime=new Date,this.dispatch({type:"youtube-video-state-changed",payload:{state:t,time:s}}),t==YT.PlayerState.ENDED&&null!=this.interval&&clearInterval(this.interval))}))}}var r,c=function(e,t,s,i){return new(s||(s=Promise))((function(a,n){function o(e){try{r(i.next(e))}catch(e){n(e)}}function l(e){try{r(i.throw(e))}catch(e){n(e)}}function r(e){var t;e.done?a(e.value):(t=e.value,t instanceof s?t:new s((function(e){e(t)}))).then(o,l)}r((i=i.apply(e,t||[])).next())}))};!function(t){var o;(function(t){class o{constructor(){this.state={youtubeUrl:null,videoState:null},this.kosyApi=new n({onClientHasLeft:e=>this.onClientHasLeft(e),onReceiveMessageAsClient:e=>this.processMessage(e),onReceiveMessageAsHost:e=>this.processMessageAsHost(e),onRequestState:()=>this.getState(),onProvideState:e=>this.setState(e)})}start(){var e;return c(this,void 0,void 0,(function*(){yield this.setupPlayerScript();let t=yield this.kosyApi.startApp();this.initializer=t.clients[t.initializerClientUuid],this.currentClient=t.clients[t.currentClientUuid],this.state=null!==(e=t.currentAppState)&&void 0!==e?e:this.state,this.player=new l(null,this.initializer.clientUuid==this.currentClient.clientUuid,(e=>this.processComponentMessage(e)),this.state),this.renderComponent(),window.addEventListener("message",(e=>{this.processComponentMessage(e.data)}))}))}setupPlayerScript(){return c(this,void 0,void 0,(function*(){return new Promise(((e,t)=>{window.onYouTubeIframeAPIReady=()=>e();const s=document.createElement("script");s.src="https://www.youtube.com/iframe_api";const i=document.getElementsByTagName("script")[0];i.parentNode.insertBefore(s,i)}))}))}setState(e){this.state=e,this.renderComponent()}getState(){return this.state}onClientHasLeft(e){e===this.initializer.clientUuid&&(this.state.youtubeUrl?this.kosyApi.relayMessage({type:"assign-new-host"}):this.kosyApi.stopApp())}processMessage(e){switch(e.type){case"close-integration":this.kosyApi.stopApp();break;case"receive-youtube-url":s(e.payload)&&(this.state.youtubeUrl=`${e.payload}`,this.renderComponent());break;case"receive-youtube-video-state":this.currentClient.clientUuid!==this.initializer.clientUuid&&(this.player.handleStateChange(e.payload.state,e.payload.time),this.state.videoState=e.payload.state,this.state.time=e.payload.time,this.renderComponent()),this.state.videoState==YT.PlayerState.ENDED&&(console.log("Video ended, clearing youtube url"),this.state.youtubeUrl=null,this.state.videoState=null,this.kosyApi.stopApp())}}processMessageAsHost(e){switch(e.type){case"assign-new-host":this.renderComponent();break;default:return e}return null}processComponentMessage(e){switch(e.type){case"close-integration":this.kosyApi.relayMessage({type:"close-integration"});break;case"youtube-url-changed":this.kosyApi.relayMessage({type:"receive-youtube-url",payload:e.payload});break;case"youtube-video-state-changed":this.kosyApi.relayMessage({type:"receive-youtube-video-state",payload:e.payload})}}renderComponent(){!function(t,s){let n,o=document.getElementById("root"),l=null==t.videoState||null==t.player.videoId;if(n=(null==t?void 0:t.youtubeUrl)?e:t.currentClient.clientUuid==t.initializer.clientUuid?i:a,l&&null!=n){console.log("App is redrawn");var r=o.cloneNode(!1);o.parentNode.replaceChild(r,o),r.appendChild(n(t,s))}}({youtubeUrl:this.state.youtubeUrl,videoState:this.state.videoState,time:this.state.time,currentClient:this.currentClient,initializer:this.initializer,player:this.player},(e=>this.processComponentMessage(e)))}log(...e){var t,s;console.log(`${null!==(s=null===(t=this.currentClient)||void 0===t?void 0:t.clientName)&&void 0!==s?s:"New user"} logged: `,...e)}}t.App=o,(new o).start()})((o=t.Integration||(t.Integration={})).Youtube||(o.Youtube={}))}(r||(r={}))})()})();