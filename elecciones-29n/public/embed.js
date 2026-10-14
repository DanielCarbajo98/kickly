/* Partidómetro: inserta el test en cualquier web.
   Uso: <div data-partidometro data-medio="nombre-del-medio"></div><script async src="https://partidometro.es/embed.js"></script> */
(function(){
  var nodes=document.querySelectorAll("[data-partidometro]:not([data-ready])");
  nodes.forEach(function(n){
    n.setAttribute("data-ready","1");
    var f=document.createElement("iframe");
    f.src="https://partidometro.es/embed/?medio="+encodeURIComponent(n.getAttribute("data-medio")||location.hostname);
    f.title="Test electoral 29N · Partidómetro";
    f.loading="lazy";
    f.style.cssText="width:100%;border:0;min-height:640px;display:block";
    f.setAttribute("allow","clipboard-write; web-share");
    n.appendChild(f);
    window.addEventListener("message",function(e){
      if(e.source===f.contentWindow&&e.data&&e.data.partidometro==="h")f.style.height=Math.max(640,e.data.h+10)+"px";
    });
  });
})();
