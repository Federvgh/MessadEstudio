// Manejador de menú colapsable con animación suave
(function() {
    document.addEventListener('DOMContentLoaded', function() {
        var arrows = document.querySelectorAll('.arrow-collapse');
        
        arrows.forEach(function(arrow) {
            arrow.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                var targetId = this.getAttribute('data-target');
                var target = document.querySelector(targetId);
                
                if (!target) return;
                
                // Si el menú ya está en transición, no hacer nada
                if (target.classList.contains('collapsing')) return;
                
                // Preparar para la animación
                if (target.classList.contains('show')) {
                    // Cerrar
                    var height = target.getBoundingClientRect().height;
                    target.style.height = height + 'px';
                    target.offsetHeight; // Force reflow
                    
                    target.classList.remove('collapse', 'show');
                    target.classList.add('collapsing');
                    target.style.height = '0px';
                    
                    this.classList.add('collapsed');
                    
                    setTimeout(() => {
                        target.classList.remove('collapsing');
                        target.classList.add('collapse');
                        target.style.height = '';
                    }, 1000);
                } else {
                    // Abrir
                    target.classList.remove('collapse');
                    target.classList.add('collapsing');
                    
                    var height = target.scrollHeight;
                    target.style.height = '0px';
                    target.offsetHeight; // Force reflow
                    target.style.height = height + 'px';
                    
                    this.classList.remove('collapsed');
                    
                    setTimeout(() => {
                        target.classList.remove('collapsing');
                        target.classList.add('collapse', 'show');
                        target.style.height = '';
                    }, 1000);
                }
            });
        });
    });
})();
