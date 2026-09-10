/* Showroom skin switcher.
 *
 * Pairs with assets/site-themes.css (36 themes as :root[data-skin="X"] blocks) and
 * design.html (where you browse themes and click "적용" to persist one).
 *
 * Unlike the TAB site's version, no token bridging is needed: assets/style.css declares
 * its default palette using the SAME token names the theme blocks define (--bg, --text-1,
 * --accent, --font-sans, ...), so activating a [data-skin] block simply overrides :root
 * by specificity. Every page only needs this script in <head> (before first paint) to
 * silently re-apply the stored choice.
 */
(function () {
	var KEY = "showroomSkin";
	// Resolve asset paths relative to this script's own src, so pages in subfolders
	// (portfolio/*.html) work without knowing their depth.
	var here = (document.currentScript && document.currentScript.src) || "";
	var base = here.replace(/[^/]*$/, "");
	var THEMES_CSS_URL = base + "site-themes.css";
	var FONTS_CSS_URL =
		"https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Noto+Sans+KR:wght@300;400;500;600;700;900&family=JetBrains+Mono:wght@400;500;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400&display=swap";

	function getSkin() {
		try {
			return localStorage.getItem(KEY) || "";
		} catch (e) {
			return "";
		}
	}

	function ensureLink(id, href) {
		if (document.getElementById(id)) return;
		var link = document.createElement("link");
		link.id = id;
		link.rel = "stylesheet";
		link.href = href;
		document.head.appendChild(link);
	}

	// Applies without persisting — used for live preview on design.html.
	function applySkin(name) {
		var root = document.documentElement;
		if (!name) {
			root.removeAttribute("data-skin");
			return;
		}
		ensureLink("showroom-themes-css", THEMES_CSS_URL);
		ensureLink("showroom-theme-fonts", FONTS_CSS_URL);
		root.setAttribute("data-skin", name);
	}

	function setSkin(name) {
		try {
			if (name) localStorage.setItem(KEY, name);
			else localStorage.removeItem(KEY);
		} catch (e) {}
		applySkin(name);
	}

	if (!window.SHOWROOM_SKIP_AUTO_SKIN) applySkin(getSkin());

	window.ShowroomTheme = { get: getSkin, set: setSkin, apply: applySkin };
})();
