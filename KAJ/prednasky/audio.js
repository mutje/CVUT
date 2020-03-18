let cache = new Map();

let button = document.createElement("button");
button.id = "audio-button";
document.body.appendChild(button);

let current = null;
function syncButton(e) {
	if (!current) { return; }
	button.textContent = current.paused ? "▶" : "⏸";
}

button.addEventListener("click", _ => (current.paused ? current.play() : current.pause()));

function syncAudio(index) {
	let audio = cache.get(index);
	button.hidden = !audio;
	if (audio) {
		current && current.pause();
		current = audio;
		current.currentTime = 0;
		syncButton();
		current.play();
	}
}

window.addEventListener("slide-change", e => {
	let index = e.detail.currentIndex;
	if (cache.has(index)) {
		syncAudio(index);
	} else {
		let a = new Audio();
		a.addEventListener("canplay", _ => {
			if (cache.has(index)) { return; }
			cache.set(index, a);
			syncAudio(index);
		});
		a.addEventListener("error", _ => {
			if (cache.has(index)) { return; }
			cache.set(index, null);
			syncAudio(index);
		});
		a.addEventListener("play", syncButton);
		a.addEventListener("pause", syncButton);
		a.addEventListener("ended", syncButton);
		a.src = `audio/${index.toString().padStart(2, "0")}.m4a`;
	}
});

let style = document.createElement("style");
style.textContent = `
#audio-button {
	position: fixed;
	right: 8px;
	top: 8px;
	line-height: 1.5;
	width: 1.5em;
	padding: 0;
	font-size: 120%;
}

.slide:first-child.current ~ #audio-button {
	animation: pulse 1s infinite alternate ease-in-out;
}

@keyframes pulse {
	from { box-shadow: none; }
	to { box-shadow: 0 0 3px 3px red; }
}
`;
document.head.appendChild(style);