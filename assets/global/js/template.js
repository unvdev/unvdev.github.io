window.addEventListener("load", (event) => {
  	function footer() {
  		var parent = document.querySelector("body");
  		var footer = document.createElement("footer");
  		var footerText = document.createElement("div");
  		footerText.classList.add("footerText");
  		footer.appendChild(footerText);
  		parent.insertBefore(footer, parent.lastChild);
  	}
  	footer();
});