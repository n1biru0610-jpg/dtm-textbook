// 体験型DTM学習 Service Worker
// 方針: ページ本体はネット優先（ブラウザのキャッシュも通さず、いつも最新を取りにいく）、つながらないときは保存済みを使う。
var CACHE='dtm-v17',TACC='dtm-tac-1';
var CORE=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install',function(e){e.waitUntil(caches.open(CACHE).then(function(c){return c.addAll(CORE)}).then(function(){return self.skipWaiting()}))});
self.addEventListener('activate',function(e){e.waitUntil(caches.keys().then(function(ks){return Promise.all(ks.filter(function(k){return k!==CACHE&&k!==TACC}).map(function(k){return caches.delete(k)}))}).then(function(){return self.clients.claim()}))});
self.addEventListener('fetch',function(e){var r=e.request;if(r.method!=='GET')return;var u=new URL(r.url);if(u.origin!==location.origin)return;
  // 楽器の音（tac/）は変わらないので、一度読んだらこの端末に取っておいて使う
  if(u.pathname.indexOf('/tac/')>=0){e.respondWith(caches.open(TACC).then(function(c){return c.match(r).then(function(m){return m||fetch(r).then(function(res){if(res&&res.ok)c.put(r,res.clone());return res})})}));return}
  e.respondWith(fetch(r,{cache:'no-store'}).then(function(res){if(res&&res.ok){var cp=res.clone();caches.open(CACHE).then(function(c){c.put(r,cp)})}return res}).catch(function(){return caches.match(r).then(function(m){return m||caches.match('./index.html')})}))});
