let mainModule = import("./main.js");

async function main() {
		const toRun = (await mainModule).main;
		if (document.readyState === "complete") {
				toRun();
		} else {
				window.addEventListener("load", toRun);
		}

    
}

main();
