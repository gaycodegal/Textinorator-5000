let mainModule = import("./main.js");

async function main() {
		mainModule.then(module=>{
				const toRun = module.main;
				if (document.readyState === "complete") {
						toRun();
				} else {
						window.addEventListener("load", toRun);
				}
		}).catch(e => {
				console.log(mainModule);
				console.error(e);
		});
    
}

main();
