let mainModule = import("./main.js");

async function main() {
    (await mainModule).main();
}

main();
