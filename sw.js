const CACHE='ghazala-pwa-v10';
const CORE=['./','./index.html','./styles.css','./app.js','./firebase-config.js','./manifest.webmanifest','./assets/logo.png','./assets/food.png','./assets/grocery.png','./assets/transport.png','./assets/placeholder-food.png'];
self.addEventListener('install',event=>{self.skipWaiting();event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(CORE.map(path=>new Request(path,{cache:'reload'})))))});
self.addEventListener('activate',event=>event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(key=>key!==CACHE).map(key=>caches.delete(key)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',event=>{
  const request=event.request;
  if(request.method!=='GET')return;
  const url=new URL(request.url);
  if(url.origin!==self.location.origin)return;
  const freshFiles=/\.(?:html|js|css|json|webmanifest)$/i.test(url.pathname)||request.mode==='navigate';
  if(freshFiles){
    event.respondWith(fetch(new Request(request,{cache:'no-store'})).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;}).catch(()=>caches.match(request).then(cached=>cached||caches.match('./index.html'))));
  }else{
    event.respondWith(caches.match(request).then(cached=>cached||fetch(request).then(response=>{if(response&&response.ok){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(request,copy));}return response;})));
  }
});
