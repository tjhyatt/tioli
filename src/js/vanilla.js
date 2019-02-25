//* nav hover element ============================== */

// get hover element
var itemHover = document.querySelector(".item-hover");

// get/set resting position
var defaultPos = document.querySelector(".nav-main .s_here");

if (defaultPos === null) {
  defaultPos = document.querySelector(".logo");
}

var width = defaultPos.offsetWidth - 12;
var left = defaultPos.offsetLeft + 6;
itemHover.style.width = width + 'px';
itemHover.style.left = left + 'px';

// get each nav item
var navItems = document.querySelectorAll(".nav-main ul li");

for (var index = 0; index < navItems.length; index++) {
  navItems[index].addEventListener("mouseover", function() {

    var width = this.offsetWidth - 12;
    var left = this.offsetLeft + 6;
    itemHover.style.width = width + 'px';
    itemHover.style.left = left + 'px';
  });

  navItems[index].addEventListener("mouseout", function() {

    var width = defaultPos.offsetWidth - 12;
    var left = defaultPos.offsetLeft + 6;
    itemHover.style.width = width + 'px';
    itemHover.style.left = left + 'px';
  });
}


// get hover element
var boxPreview = document.querySelector(".box-preview");

boxPreview.addEventListener("mouseover", function() {
  alert('hi');
});
