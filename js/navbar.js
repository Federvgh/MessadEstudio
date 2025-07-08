(function(){
    'use strict'

    var siteMenuClone = function() {
        var jsCloneNavs = document.querySelectorAll('.js-clone-nav');
        var siteMobileMenuBody = document.querySelector('.site-mobile-menu-body');

        // Limpiar el contenido existente
        siteMobileMenuBody.innerHTML = '';

        // Clonar el menú
        jsCloneNavs.forEach(nav => {
            var navCloned = nav.cloneNode(true);
            navCloned.setAttribute('class', 'site-nav-wrap');
            siteMobileMenuBody.appendChild(navCloned);
        });

        setTimeout(function(){
            var hasChildrens = document.querySelector('.site-mobile-menu').querySelectorAll('.has-children');
            
            hasChildrens.forEach(hasChild => {
                // Agregar la flecha
                var arrow = document.createElement('span');
                arrow.className = 'arrow-collapse';
                hasChild.insertBefore(arrow, hasChild.querySelector('a').nextSibling);
                
                // Manejar el click en la flecha
                arrow.addEventListener('click', function(e) {
                    e.preventDefault();
                    var dropdown = hasChild.querySelector('.dropdown');
                    if (dropdown.style.display === 'block') {
                        dropdown.style.display = 'none';
                        arrow.classList.remove('active');
                    } else {
                        // Cerrar otros submenús del mismo nivel
                        var siblings = hasChild.parentNode.querySelectorAll('.has-children');
                        siblings.forEach(sibling => {
                            if (sibling !== hasChild) {
                                var siblingDropdown = sibling.querySelector('.dropdown');
                                var siblingArrow = sibling.querySelector('.arrow-collapse');
                                if (siblingDropdown) {
                                    siblingDropdown.style.display = 'none';
                                    if (siblingArrow) siblingArrow.classList.remove('active');
                                }
                            }
                        });
                        dropdown.style.display = 'block';
                        arrow.classList.add('active');
                    }
                });

                // Prevenir que el click en el enlace abra el submenú
                hasChild.querySelector('a').addEventListener('click', function(e) {
                    if (hasChild.querySelector('.dropdown')) {
                        e.preventDefault();
                    }
                });
            });
        }, 300);

        // Manejar el botón del menú móvil
        var menuToggle = document.querySelectorAll(".js-menu-toggle");
        menuToggle.forEach(mtoggle => {
            mtoggle.addEventListener("click", function(e) {
                e.preventDefault();
                if (document.body.classList.contains('offcanvas-menu')) {
                    document.body.classList.remove('offcanvas-menu');
                    mtoggle.classList.remove('active');
                } else {
                    // Cerrar todos los submenús al abrir el menú
                    var allDropdowns = document.querySelectorAll('.site-mobile-menu .dropdown');
                    var allArrows = document.querySelectorAll('.site-mobile-menu .arrow-collapse');
                    allDropdowns.forEach(dropdown => {
                        dropdown.style.display = 'none';
                    });
                    allArrows.forEach(arrow => {
                        arrow.classList.remove('active');
                    });
                    
                    document.body.classList.add('offcanvas-menu');
                    mtoggle.classList.add('active');
                }
            });
        });

        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', function(e) {
            var specifiedElement = document.querySelector(".site-mobile-menu");
            var isClickInside = specifiedElement.contains(e.target);
            var isMenuToggle = e.target.closest('.js-menu-toggle');

            if (!isClickInside && !isMenuToggle && document.body.classList.contains('offcanvas-menu')) {
                document.body.classList.remove('offcanvas-menu');
                document.querySelector('.js-menu-toggle').classList.remove('active');
            }
        });
    }; 

    siteMenuClone();
})();
