(function(){var b=document.querySelector('.burger'),m=document.getElementById('menu');if(!b||!m)return;
function c(){m.classList.remove('open');b.setAttribute('aria-expanded','false');b.textContent='☰'}
b.addEventListener('click',function(){var o=m.classList.toggle('open');b.setAttribute('aria-expanded',o);b.textContent=o?'✕':'☰'});
m.addEventListener('click',function(e){if(e.target.tagName==='A')c()});
document.addEventListener('keydown',function(e){if(e.key==='Escape')c()});})();
